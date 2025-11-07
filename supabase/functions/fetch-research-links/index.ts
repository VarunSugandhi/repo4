import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse payload ONCE so we don't re-read the stream in catch
  const payload = await req.json().catch(() => ({ topic: '', summary: '' } as any));
  const { topic, summary } = payload as { topic?: string; summary?: string };

  try {
    if (!topic && !summary) {
      throw new Error('Topic or summary is required');
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

    // Use AI to generate relevant search queries and suggest credible sources
    const useLovable = Boolean(LOVABLE_API_KEY);
    const endpoint = useLovable ? 'https://ai.gateway.lovable.dev/v1/chat/completions' : `${CEREBRAS_BASE_URL}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useLovable ? LOVABLE_API_KEY : CEREBRAS_API_KEY}`,
    };
    const body = {
      model: useLovable ? 'google/gemini-2.5-flash' : 'llama3.1-8b',
      messages: [
          { 
            role: 'system', 
            content: 'You are a research assistant. Analyze the provided content and generate relevant research links. Extract main topics and recommend high-quality learning resources including YouTube lectures, educational websites, and academic sources. Always return valid JSON format with proper structure.'
          },
          { 
            role: 'user', 
            content: `Content to analyze:\n\nTopic: ${topic || ''}\n\nSummary: ${summary || ''}\n\nGenerate research links in this JSON format:
{
  "links": [
    {
      "title": "Clear descriptive title",
      "description": "Brief description of the resource",
      "url": "https://full-url-here.com",
      "source": "YouTube" or "Wikipedia" or "Google Scholar" or "Khan Academy" etc.,
      "heading": "Main topic",
      "subheading": "Sub-topic (optional)"
    }
  ]
}

Requirements:
- Generate 5-8 high-quality research links
- Include YouTube lecture videos from reputable channels (MIT, Stanford, Khan Academy, etc.)
- Include Wikipedia articles for foundational concepts
- Include Google Scholar links for academic research
- Ensure all URLs are valid and complete
- Make titles clear and descriptive
- Focus on educational and learning resources`
          }
        ]
      },
    };
    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });

    if (!response.ok) {
      throw new Error('Failed to generate research links');
    }

    const data = await response.json();
    // Expect pure JSON or markdown fenced JSON; fallback to LLM text parse
    const raw = data.choices?.[0]?.message?.content || data.choices?.[0]?.message || data.choices?.[0]?.text || '';
    let links: any[] = [];
    
    if (!raw || typeof raw !== 'string') {
      throw new Error('No response content from AI');
    }
    
    try {
      // Try multiple parsing strategies
      // Strategy 1: Remove markdown code blocks
      let cleanedText = raw
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Strategy 2: Find JSON object in the text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : cleanedText;
      
      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch (e) {
        // Strategy 3: Try to fix common JSON issues
        const fixed = jsonText
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
        parsed = JSON.parse(fixed);
      }
      
      // Accept either {sections:[{heading, subheadings:[...], videos:[{title,url,channel}]}]} or {links:[...]}
      if (parsed?.sections && Array.isArray(parsed.sections)) {
        parsed.sections.forEach((sec: any) => {
          const heading = sec.heading || 'General';
          (sec.subheadings || [null]).forEach((sub: any) => {
            (sec.videos || []).forEach((v: any) => {
              if (v?.url && v?.title) {
                links.push({
                  title: String(v.title).trim(),
                  description: `Lecture: ${heading}${sub ? ' • ' + sub : ''}${v?.channel ? ' • ' + v.channel : ''}`,
                  url: String(v.url).trim(),
                  source: 'YouTube',
                  heading: heading,
                  subheading: sub || undefined,
                });
              }
            });
          });
        });
      } else if (parsed?.links && Array.isArray(parsed.links)) {
        links = parsed.links
          .filter((link: any) => link && link.url && link.title)
          .map((link: any) => ({
            title: String(link.title || '').trim(),
            description: String(link.description || link.title || '').trim(),
            url: String(link.url || '').trim(),
            source: String(link.source || 'Web').trim(),
            heading: link.heading || undefined,
            subheading: link.subheading || undefined,
          }))
          .filter((link: any) => link.url && link.title);
      }
    } catch (parseError) {
      console.error('Error parsing research links JSON:', parseError);
      console.error('Raw response:', raw.substring(0, 500));
      links = [];
    }

    return new Response(
      JSON.stringify({ links }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-research-links:', error);
    // Fallback: build YouTube search links from topic/summary so UI still works
    try {
      const baseText = String(summary || topic || '').split('\n').map((l: string) => l.trim()).filter((l: string) => l).slice(0, 6);
      const normalized = baseText.map((t: string) => t.replace(/^#\s+/, '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
      const fallbackLinks = normalized.map((t: string) => ({
        title: `Lecture: ${t}`,
        description: `YouTube search for ${t}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t} lecture`)}`,
        source: 'YouTube',
        heading: t,
      }));
      return new Response(
        JSON.stringify({ links: fallbackLinks }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
});
