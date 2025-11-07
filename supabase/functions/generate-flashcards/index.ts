import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { summary, keyPoints } = await req.json();

    if (!summary && !keyPoints) {
      throw new Error('Summary or key points are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const CEREBRAS_API_KEY = Deno.env.get('CEREBRAS_API_KEY');
    const CEREBRAS_BASE_URL = Deno.env.get('CEREBRAS_BASE_URL') || 'https://api.cerebras.ai/v1';
    
    if (!LOVABLE_API_KEY && !CEREBRAS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI provider not configured. Set LOVABLE_API_KEY or CEREBRAS_API_KEY.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const useLovable = Boolean(LOVABLE_API_KEY);
    const endpoint = useLovable ? 'https://ai.gateway.lovable.dev/v1/chat/completions' : `${CEREBRAS_BASE_URL}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useLovable ? LOVABLE_API_KEY : CEREBRAS_API_KEY}`,
    };

    const keyPointsText = Array.isArray(keyPoints) ? keyPoints.join('\n') : (keyPoints || '');
    
    // Remove markdown headings, file names, and extract main content
    let mainContent = summary || '';
    
    // More aggressive filtering to remove headings, titles, and file names
    mainContent = mainContent.split('\n')
      .filter(line => {
        const trimmed = line.trim();
        // Skip markdown headings (#, ##, ###, etc.)
        if (/^#{1,6}\s+/.test(trimmed)) return false;
        // Skip lines that are just headings (very short lines, all caps, or title case)
        if (trimmed.length < 15 && /^[A-Z\s]+$/.test(trimmed)) return false;
        // Skip lines that look like file names (contain extensions like .pdf, .docx, etc.)
        if (/\.(pdf|docx?|txt|md|pptx?|xlsx?)$/i.test(trimmed)) return false;
        // Skip lines that are just numbers or symbols
        if (/^[\d\s\-_\.]+$/.test(trimmed)) return false;
        // Skip very short lines that might be headings
        if (trimmed.length < 20 && /^[A-Z][a-z]+\s+[A-Z]/.test(trimmed)) return false;
        return true;
      })
      .join('\n')
      .trim();
    
    // Remove any remaining markdown formatting
    mainContent = mainContent
      .replace(/^#{1,6}\s+/gm, '') // Remove any remaining headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
    
    // Only use content that has substantial text (at least 100 characters)
    if (mainContent.length < 100 && keyPointsText.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient content to generate flashcards. Please ensure the summary contains detailed explanations, not just headings or titles.',
          flashcards: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const flashcardPrompt = `You are an educational AI that creates high-quality flashcards from study material. 

CRITICAL INSTRUCTIONS:
- Extract questions ONLY from the actual body content, explanations, and detailed text
- NEVER use section headings, chapter titles, file names, or topic names as questions
- NEVER use lines like "Introduction", "Chapter 1", "Summary", etc. as questions
- Focus on concepts, facts, definitions, processes, and explanations from the detailed content
- Each question should test understanding of the actual content, not just recall of titles

Content to analyze (headings and titles already removed):
${mainContent || 'N/A'}

Key Points (if available):
${keyPointsText || 'N/A'}

Generate 10-15 flashcards with:
1. Front: A clear, specific question about a concept, fact, process, or explanation from the BODY CONTENT (not headings)
2. Back: A detailed, comprehensive answer based on the actual content
3. Topic: A meaningful topic category (not just "General")
4. Difficulty: easy, medium, or hard based on complexity

Example of GOOD flashcard:
- Front: "What is the process of photosynthesis and what are its main stages?"
- Back: "Photosynthesis is the process by which plants convert light energy into chemical energy. The main stages are: 1) Light-dependent reactions where chlorophyll absorbs light and produces ATP and NADPH, 2) Light-independent reactions (Calvin cycle) where CO2 is fixed into glucose using the energy from ATP and NADPH."

Example of BAD flashcard (DO NOT DO THIS):
- Front: "Introduction" or "Chapter 1" or "Photosynthesis" (these are headings, not questions!)

Return ONLY a valid JSON array in this exact format (no markdown, no code blocks, just the JSON array):
[
  {
    "front": "Question about the content",
    "back": "Answer or explanation",
    "topic": "Topic name",
    "difficulty": "easy"
  }
]`;

    const body = {
      model: useLovable ? 'google/gemini-2.5-flash' : 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content: 'You are an educational AI that creates flashcards. Always return ONLY valid JSON arrays, no markdown, no code blocks, no additional text. The response must be a valid JSON array that can be parsed directly.'
        },
        {
          role: 'user',
          content: flashcardPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate flashcards');
    }

    const data = await response.json();
    const flashcardText = data.choices?.[0]?.message?.content || data.choices?.[0]?.message || data.choices?.[0]?.text || '';

    if (!flashcardText) {
      throw new Error('No flashcard content generated');
    }

    // Extract JSON from response
    let flashcards: any[] = [];
    try {
      // Remove markdown code blocks if present
      let cleanedText = flashcardText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[\s\n]*/, '')
        .replace(/[\s\n]*$/, '')
        .trim();
      
      // Try multiple parsing strategies
      // Strategy 1: Find JSON array in the text
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          flashcards = JSON.parse(jsonMatch[0]);
        } catch (e) {
          // Try to fix common JSON issues
          const fixed = jsonMatch[0]
            .replace(/,\s*]/g, ']')
            .replace(/,\s*}/g, '}')
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
          flashcards = JSON.parse(fixed);
        }
      } else {
        // Strategy 2: Try parsing the whole text
        try {
          flashcards = JSON.parse(cleanedText);
        } catch (e) {
          // Strategy 3: Try to extract structured data from text
          const lines = cleanedText.split('\n').filter(l => l.trim());
          flashcards = lines
            .filter(l => l.includes('"') || l.includes("'") || l.includes('front') || l.includes('question'))
            .slice(0, 15)
            .map((line, idx) => {
              const frontMatch = line.match(/"front":\s*"([^"]+)"/) || line.match(/"question":\s*"([^"]+)"/);
              const backMatch = line.match(/"back":\s*"([^"]+)"/) || line.match(/"answer":\s*"([^"]+)"/);
              return {
                front: frontMatch ? frontMatch[1] : `Question ${idx + 1}`,
                back: backMatch ? backMatch[1] : 'Answer',
                topic: 'General',
                difficulty: 'medium'
              };
            });
        }
      }
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
      console.error('Response text:', flashcardText.substring(0, 500));
      // Return empty array instead of throwing - let frontend handle fallback
      flashcards = [];
    }

    // Validate and format flashcards - filter out invalid ones
    const formattedFlashcards = flashcards
      .filter((fc: any) => fc && (fc.front || fc.question || fc.concept))
      .slice(0, 15)
      .map((fc: any, idx: number) => ({
        front: String(fc.front || fc.question || fc.concept || `Question ${idx + 1}`).trim(),
        back: String(fc.back || fc.answer || fc.explanation || 'Answer').trim(),
        topic: String(fc.topic || fc.subject || 'General').trim(),
        difficulty: ['easy', 'medium', 'hard'].includes(fc.difficulty) ? fc.difficulty : 'medium',
      }))
      .filter((fc: any) => fc.front.length > 0 && fc.back.length > 0); // Remove empty flashcards

    // If we have valid flashcards, return them; otherwise return empty array (frontend will use fallback)
    return new Response(
      JSON.stringify({ 
        flashcards: formattedFlashcards.length > 0 ? formattedFlashcards : [],
        ...(formattedFlashcards.length === 0 && { error: 'No valid flashcards could be generated from the response' })
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-flashcards:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        flashcards: []
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

