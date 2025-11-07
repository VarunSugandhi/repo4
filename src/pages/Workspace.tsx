import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Upload, Send, Loader2, ArrowLeft, ExternalLink, FileUp, FileDown, CheckSquare, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindMapVisualization from "@/components/MindMapVisualization";
import MindMapFlow from "@/components/MindMapFlow";
import JSZip from "jszip";
import jsPDF from "jspdf";
import Flashcards, { type Flashcard } from "@/components/Flashcards";

interface Source {
  id: string;
  title: string;
  type: string;
  content: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ResearchLink {
  title: string;
  description: string;
  url: string;
  source: string;
}

const Workspace = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notebook, setNotebook] = useState<any>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [researchLinks, setResearchLinks] = useState<ResearchLink[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<Set<number>>(new Set());
  const [loadingResearchLinks, setLoadingResearchLinks] = useState(false);
  const [audioOverview, setAudioOverview] = useState<{dialogue: string; audioSegments: any[]; providerError?: string | null} | null>(null);
  const [generatingSegments, setGeneratingSegments] = useState<Set<number>>(new Set());
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [mindMapSvgEl, setMindMapSvgEl] = useState<SVGSVGElement | null>(null);
  const [report, setReport] = useState<string>("");
  const [activeTab, setActiveTab] = useState("summary");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(-1);
  const [isSpeakingAll, setIsSpeakingAll] = useState(false);
  const [isSpeakingPaused, setIsSpeakingPaused] = useState(false);
  const speakingIndexRef = useRef<number>(-1);
  const speakingActiveRef = useRef<boolean>(false);
  const speakingPausedRef = useRef<boolean>(false);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState<string | null>(null);
  const [combining, setCombining] = useState(false);
  const [selectedKeyPoint, setSelectedKeyPoint] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);

  // Inline rename support for notebook header
  const [renamingTitle, setRenamingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingTitle) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          titleInputRef.current?.focus();
          titleInputRef.current?.select();
        });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [renamingTitle]);

  const chooseColor = (title: string) => {
    const palette = [
      'bg-pink-200',
      'bg-yellow-200',
      'bg-lime-200',
      'bg-sky-200',
      'bg-rose-200',
      'bg-indigo-200',
      'bg-orange-200',
      'bg-teal-200',
      'bg-fuchsia-200',
      'bg-blue-200',
      'bg-green-200',
      'bg-purple-200',
      'bg-cyan-200',
      'bg-red-200'
    ];
    const hash = Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };

  const localEmojiFallback = (title: string) => {
    const t = title.toLowerCase();
    const candidates: Record<string, string[]> = {
      science: ['🧪','🔬','🧬'],
      math: ['➗','📐','📊'],
      ai: ['🤖','🧠','✨'],
      history: ['🏰','📜','🗺️'],
      language: ['🗣️','📘','📝'],
      art: ['🎨','🖌️','🖼️'],
      code: ['💻','🧩','⚙️'],
      business: ['📈','💼','🏦'],
      health: ['🩺','💊','❤️'],
      python: ['🐍'],
      java: ['☕'],
      javascript: ['🟨'],
      typescript: ['💙'],
      react: ['⚛️'],
      vue: ['🟩'],
      svelte: ['🟧'],
      css: ['🎨'],
      html: ['🌐'],
      node: ['🌱'],
      c: ['🌊'],
      cpp: ['💠'],
      go: ['🐹'],
      rust: ['🦀'],
      dart: ['🎯'],
      sql: ['🗄️'],
      swift: ['🦅'],
      kotlin: ['🎈'],
      php: ['🐘'],
      ruby: ['💎'],
      shell: ['🐚'],
      powershell: ['💻'],
      mongodb: ['🍃'],
      firebase: ['🔥'],
      web: ['🌐'],
      dev: ['👨‍💻','👩‍💻'],
    };
    for (const [k, arr] of Object.entries(candidates)) {
      if (t.includes(k)) return arr[0];
    }
    const pool = ['📘','📗','📕','📙','📔','📝','⭐','🌟','🌱','🧠','🔎','🎯','🧭','🧩'];
    const hash = Array.from(title).reduce((a,c)=>a+c.charCodeAt(0),0);
    return pool[hash % pool.length];
  };

  const commitTitleRename = async () => {
    const newTitle = tempTitle.trim();
    setRenamingTitle(false);
    if (!notebook || !newTitle || newTitle === notebook.title) return;
    try {
      let emoji = notebook.icon || '📓';
      try {
        const { data: fnData, error: fnError } = await supabase.functions.invoke('generate-emoji', { body: { title: newTitle } });
        if (fnError) throw fnError;
        emoji = (fnData?.emoji || localEmojiFallback(newTitle)) as string;
      } catch (invokeErr) {
        emoji = localEmojiFallback(newTitle);
      }
      const color = chooseColor(newTitle);
      const { error } = await supabase.from('notebooks').update({ title: newTitle, icon: emoji, color }).eq('id', notebook.id);
      if (error) throw error;
      setNotebook((prev: any) => ({ ...prev, title: newTitle, icon: emoji, color }));
      toast.success('Notebook renamed');
    } catch (e) {
      console.error(e);
      toast.error('Failed to rename notebook');
    }
  };

  // Extract readable messages from Supabase Functions errors
  const getFunctionsErrorMessage = async (err: unknown): Promise<string> => {
    try {
      // Handle Supabase FunctionsHttpError
      if (err && typeof err === 'object') {
        // @ts-ignore - Supabase error structure
        const ctx = err?.context;
        const res = ctx?.response as Response | undefined;
        
        if (res) {
          try {
            const text = await res.text();
            try {
              const json = JSON.parse(text);
              return json.error || json.message || res.statusText || `HTTP ${res.status}: ${res.statusText}`;
            } catch {
              return text || res.statusText || `HTTP ${res.status}: ${res.statusText}`;
            }
          } catch (parseErr) {
            return res.statusText || `HTTP ${res.status}: ${res.statusText}`;
          }
        }
        
        // Try to get error message from other properties
        // @ts-ignore
        if (err.message) return err.message;
        // @ts-ignore
        if (err.error) return String(err.error);
        // @ts-ignore
        if (err.statusText) return err.statusText;
      }
      
      return err instanceof Error ? err.message : 'Unknown error occurred';
    } catch {
      return err instanceof Error ? err.message : 'Unknown error occurred';
    }
  };

  useEffect(() => {
    if (notebookId) {
      fetchNotebook();
      fetchSources();
    }
  }, [notebookId]);

  // Fetch research links when notebook, summary, or keyPoints are available
  useEffect(() => {
    if (notebook && (summary || keyPoints.length > 0)) {
      fetchResearchLinks(false); // Don't show loading on initial fetch
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebook, summary, keyPoints.length]);

  // Load latest summary and chat history for better resume experience
  useEffect(() => {
    if (notebookId) {
      fetchLatestSummary();
      fetchChatHistory();
    }
  }, [notebookId]);

  // Auto-generate summary for notes when sources are loaded
  useEffect(() => {
    if (sources.length > 0 && !summary && !generating) {
      // Check if any source is a note (not a question paper)
      const noteSources = sources.filter(s => 
        !s.content.toLowerCase().includes('question paper') &&
        !s.content.toLowerCase().includes('question') &&
        !s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
      );
      
      if (noteSources.length > 0) {
        // Combine all note content
        const combinedContent = noteSources.map(s => s.content).join('\n\n');
        if (combinedContent.trim()) {
          generateSummary(combinedContent, true); // true indicates it's a note
        }
      }
    }
  }, [sources]);

  const fetchLatestSummary = async () => {
    const { data, error } = await supabase
      .from("summaries")
      .select("content, key_points")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSummary(data.content);
      const maybeArray = data.key_points as unknown;
      if (Array.isArray(maybeArray)) {
        setKeyPoints(maybeArray as string[]);
      } else if (maybeArray) {
        try {
          // In case key_points is a JSON object/string of array
          const parsed = typeof maybeArray === 'string' ? JSON.parse(maybeArray) : maybeArray;
          setKeyPoints(Array.isArray(parsed) ? (parsed as string[]) : []);
        } catch {
          setKeyPoints([]);
        }
      }
    }
  };

  const fetchChatHistory = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const history: ChatMessage[] = data.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));
      setChatMessages(history);
    }
  };

  const fetchNotebook = async () => {
    const { data, error } = await supabase
      .from("notebooks")
      .select("*")
      .eq("id", notebookId)
      .single();

    if (error) {
      toast.error("Failed to load notebook");
      navigate("/notebooks");
    } else {
      setNotebook(data);
    }
    setLoading(false);
  };

  const fetchSources = async () => {
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSources(data);
      
      // Auto-generate summary for notes if no summary exists
      if (data.length > 0 && !summary) {
        const noteSources = data.filter(s => 
          !s.content.toLowerCase().includes('question paper') &&
          !s.content.toLowerCase().includes('question') &&
          !s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
        );
        
        if (noteSources.length > 0) {
          const combinedContent = noteSources.map(s => s.content).join('\n\n');
          if (combinedContent.trim() && !generating) {
            generateSummary(combinedContent, true); // true indicates it's a note
          }
        }
      }
      
      // Auto-generate flashcards when summary is available
      // This will be triggered after summary generation completes
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setGenerating(true);
    toast.info("Uploading PDF and extracting text...");

    try {
      // 1) Upload to Supabase Storage to persist the file
      const storagePath = `${user.id}/${notebookId}/${Date.now()}-${file.name}`;
      const uploadRes = await supabase.storage
        .from('documents')
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (uploadRes.error) {
        throw new Error(`Storage upload failed: ${uploadRes.error.message}`);
      }

      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke("extract-pdf-text", {
        body: formData,
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Save the extracted content as a source
      const { data: sourceData, error: sourceError } = await supabase
        .from("sources")
        .insert({
          notebook_id: notebookId,
          title: file.name,
          type: "pdf",
          content: data.text,
          file_path: uploadRes.data?.path || null,
          file_size: file.size,
        })
        .select()
        .single();

      if (sourceError) {
        toast.error("Failed to save PDF source");
        return;
      }

      setSources([sourceData, ...sources]);
      toast.success("PDF uploaded and processed!");
      await generateSummary(data.text);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to process PDF: ${message}`);
    } finally {
      setGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddTextSource = async () => {
    if (!textInput.trim() || !user) return;

    const { data, error } = await supabase
      .from("sources")
      .insert({
        notebook_id: notebookId,
        title: textInput.substring(0, 50) + "...",
        type: "text",
        content: textInput,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add source");
    } else {
      setSources([data, ...sources]);
      setTextInput("");
      toast.success("Source added!");
      await generateSummary(textInput);
    }
  };

  const generateSummary = async (content: string, isNote: boolean = false) => {
    setGenerating(true);

    try {
      // Detect context: prepometer notebook, notes, or question paper
      const isPrepometerNotebook = notebook?.title?.match(/^Class \d+ - .+$/);
      const isQuestionPaper = content.toLowerCase().includes('question paper') || 
                              content.toLowerCase().includes('question') ||
                              content.toLowerCase().match(/\d+\.\s*(question|q\.)/i);
      
      let generatingMessage = "Generating summary...";
      let successMessage = "Summary generated!";
      
      if (isPrepometerNotebook) {
        if (isQuestionPaper) {
          generatingMessage = "Generating question paper analysis...";
          successMessage = "Question paper analysis generated!";
        } else if (isNote) {
          generatingMessage = "Generating notes...";
          successMessage = "Notes generated!";
        }
      }
      
      toast.info(generatingMessage);

      // Use 'exam' mode for notes to get better structured summaries
      const mode = isNote ? "exam" : "standard";
      
      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: { text: content, mode },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSummary(data.summary);
      setKeyPoints(data.keyPoints || []);

      // Save summary to database
      await supabase.from("summaries").insert({
        notebook_id: notebookId,
        title: "AI Summary",
        content: data.summary,
        key_points: data.keyPoints,
      });

      toast.success(successMessage);

      // Auto-generate flashcards based on summary (for all notebooks)
      // Wait a bit for summary to be set, then generate flashcards
      setTimeout(async () => {
        if (data.summary && data.keyPoints && data.keyPoints.length > 0) {
          await generateFlashcardsFromPaper(data.summary);
        }
      }, 1000);

      // Fetch YouTube learning links based on extracted headings/subheadings
      try {
        const yt = await supabase.functions.invoke("fetch-research-links", { body: { summary: data.summary } });
        if (!yt.error && yt.data?.links) {
          const processed = prioritizeYouTubeLinks(yt.data.links, data.keyPoints || []);
          setResearchLinks(processed);
        }
      } catch {}
    } catch (error) {
      console.error('Error generating summary:', error);
      const message = await getFunctionsErrorMessage(error);
      toast.error(`Failed to generate summary: ${message}`);
    } finally {
      setGenerating(false);
    }
  };

  const generateFlashcardsFromPaper = async (paperContent?: string) => {
    setGeneratingFlashcards(true);
    try {
      // Prioritize summary for flashcard generation - it has the most processed content
      // Only use sources as fallback if summary is not available
      const contentToAnalyze = summary || paperContent;
      const keyPointsText = keyPoints.length > 0 ? keyPoints.join('\n') : '';
      
      if (!contentToAnalyze && !keyPointsText) {
        toast.error("No content available to generate flashcards. Please generate a summary first.");
        setGeneratingFlashcards(false);
        return;
      }

      // Use Supabase function to generate flashcards via AI
      // Always prioritize summary over raw sources
      const { data, error } = await supabase.functions.invoke("generate-flashcards", {
        body: { 
          summary: contentToAnalyze || undefined,
          keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
        },
      });

      // Handle errors gracefully - don't throw, use fallback instead
      let extractedFlashcards: Flashcard[] = [];
      
      if (error) {
        const errorMsg = await getFunctionsErrorMessage(error);
        console.warn('Flashcard generation error:', errorMsg);
        // Continue to fallback logic below instead of throwing
      } else if (data?.error) {
        console.warn('Flashcard generation returned error:', data.error);
        // Continue to fallback logic below
      } else if (data?.flashcards && Array.isArray(data.flashcards) && data.flashcards.length > 0) {
        // Process valid flashcards and filter out headings/file names
        extractedFlashcards = data.flashcards
          .map((fc: any, idx: number) => ({
            id: `fc-${Date.now()}-${idx}`,
            front: (fc.front || fc.question || fc.concept || 'Question').toString().trim(),
            back: (fc.back || fc.answer || fc.explanation || 'Answer').toString().trim(),
            topic: (fc.topic || fc.subject || 'General').toString(),
            difficulty: (['easy', 'medium', 'hard'].includes(fc.difficulty) ? fc.difficulty : 'medium') as 'easy' | 'medium' | 'hard',
          }))
          .filter(fc => {
            // Filter out invalid flashcards
            if (!fc.front || !fc.back) return false;
            
            // Filter out flashcards that look like headings or file names
            const front = fc.front.toLowerCase();
            const back = fc.back.toLowerCase();
            
            // Skip if front looks like a heading (very short, all caps, or title case without question mark)
            if (fc.front.length < 15 && !fc.front.includes('?') && !fc.front.includes('what') && !fc.front.includes('how') && !fc.front.includes('why')) {
              return false;
            }
            
            // Skip if front looks like a file name
            if (/\.(pdf|docx?|txt|md|pptx?|xlsx?)$/i.test(fc.front)) {
              return false;
            }
            
            // Skip if front is just a single word or very short phrase (likely a heading)
            if (fc.front.split(/\s+/).length <= 2 && fc.front.length < 20 && !fc.front.includes('?')) {
              return false;
            }
            
            // Skip common heading patterns
            const headingPatterns = [
              /^introduction$/i,
              /^chapter\s+\d+/i,
              /^section\s+\d+/i,
              /^part\s+\d+/i,
              /^summary$/i,
              /^conclusion$/i,
              /^overview$/i,
            ];
            
            if (headingPatterns.some(pattern => pattern.test(fc.front))) {
              return false;
            }
            
            return true;
          });
      }

      // If we have valid flashcards, use them; otherwise use fallback
      if (extractedFlashcards.length > 0) {
        setFlashcards(extractedFlashcards);
        toast.success(`Generated ${extractedFlashcards.length} flashcards!`);
        setGeneratingFlashcards(false);
        return;
      }

      // Fallback: Create flashcards from key points
      if (keyPoints.length > 0) {
        const fallbackFlashcards = keyPoints.slice(0, 10).map((kp, idx) => {
          const cleaned = kp.replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim();
          const parts = cleaned.split(':');
          return {
            id: `fc-fallback-${idx}`,
            front: parts[0]?.trim() || cleaned.substring(0, 50) || 'Question',
            back: parts.slice(1).join(':').trim() || cleaned || 'Answer',
            topic: 'Key Concepts',
            difficulty: 'medium' as const,
          };
        });
        setFlashcards(fallbackFlashcards);
        toast.success(`Created ${fallbackFlashcards.length} flashcards from key points!`);
      } else if (contentToAnalyze) {
        // Last resort: create simple flashcards from content
        const lines = contentToAnalyze.split('\n').filter(l => l.trim().length > 20).slice(0, 10);
        const simpleFlashcards = lines.map((line, idx) => {
          const cleaned = line.replace(/^[*•#-.\s]+/, '').trim();
          const words = cleaned.split(' ');
          const midPoint = Math.floor(words.length / 2);
          return {
            id: `fc-simple-${idx}`,
            front: words.slice(0, midPoint).join(' ') || 'Question',
            back: words.slice(midPoint).join(' ') || cleaned || 'Answer',
            topic: 'Content',
            difficulty: 'medium' as const,
          };
        });
        if (simpleFlashcards.length > 0) {
          setFlashcards(simpleFlashcards);
          toast.success(`Created ${simpleFlashcards.length} flashcards from content!`);
        } else {
          toast.error("Could not generate flashcards. Please ensure you have content or key points.");
        }
      } else {
        toast.error("Could not generate flashcards. Please ensure summary is generated first.");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      // Fallback: Create flashcards from key points
      if (keyPoints.length > 0) {
        const fallbackFlashcards = keyPoints.slice(0, 10).map((kp, idx) => {
          const cleaned = kp.replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim();
          const parts = cleaned.split(':');
          return {
            id: `fc-error-${idx}`,
            front: parts[0]?.trim() || cleaned.substring(0, 50) || 'Question',
            back: parts.slice(1).join(':').trim() || cleaned || 'Answer',
            topic: 'Key Concepts',
            difficulty: 'medium' as const,
          };
        });
        setFlashcards(fallbackFlashcards);
        toast.success(`Created ${fallbackFlashcards.length} flashcards from key points!`);
      } else {
        toast.error(`Failed to generate flashcards: ${errorMsg}`);
      }
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  const extractConceptsFromText = (content: string, summary: string): Array<{name: string; explanation: string; topic: string; difficulty: 'easy' | 'medium' | 'hard'}> => {
    const concepts: Array<{name: string; explanation: string; topic: string; difficulty: 'easy' | 'medium' | 'hard'}> = [];
    
    // Extract mathematical formulas
    const formulaRegex = /([A-Za-z]+\s*=\s*[^,\n]+)/g;
    const formulas = content.match(formulaRegex) || [];
    formulas.slice(0, 5).forEach((formula, idx) => {
      concepts.push({
        name: `Formula ${idx + 1}`,
        explanation: formula,
        topic: 'Formulas',
        difficulty: 'medium',
      });
    });

    // Extract definitions (look for patterns like "X is Y" or "X: Y")
    const definitionRegex = /([A-Z][^:\.]+):\s*([^\.\n]+)/g;
    let match;
    let defCount = 0;
    while ((match = definitionRegex.exec(content)) !== null && defCount < 5) {
      concepts.push({
        name: match[1].trim(),
        explanation: match[2].trim(),
        topic: 'Definitions',
        difficulty: 'easy',
      });
      defCount++;
    }

    // Extract key topics from summary
    const topicRegex = /(?:topic|concept|subject|chapter):\s*([^\n,]+)/gi;
    const topics = summary.match(topicRegex) || [];
    topics.slice(0, 5).forEach((topic, idx) => {
      const topicName = topic.replace(/topic|concept|subject|chapter:/gi, '').trim();
      concepts.push({
        name: topicName,
        explanation: `Important concept from the question paper`,
        topic: 'Key Topics',
        difficulty: 'medium',
      });
    });

    return concepts.slice(0, 10);
  };

  const handleGenerateFlashcards = async () => {
    // Generate flashcards based on summary, key points, or sources
    if (summary || keyPoints.length > 0 || sources.length > 0) {
      await generateFlashcardsFromPaper();
    } else {
      toast.error("Please add sources or generate a summary first to create flashcards");
    }
  };

  const handleGenerateMindMap = async () => {
    if (!summary && selectedLinks.size === 0) {
      toast.error("Please generate a summary or select research links first");
      return;
    }

    setGenerating(true);
    try {
      // Use selected research links or summary
      const content = selectedLinks.size > 0
        ? researchLinks
            .filter((_, idx) => selectedLinks.has(idx))
            .map(link => `${link.title}: ${link.description}`)
            .join('\n\n')
        : summary;

      const { data, error } = await supabase.functions.invoke("generate-mind-map", {
        body: { summary: content, notebookId },
      });

      if (error) {
        const errorMsg = await getFunctionsErrorMessage(error);
        toast.error(`Failed to generate mind map: ${errorMsg}`);
        setGenerating(false);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setGenerating(false);
        return;
      }

      if (!data.mindMapData) {
        toast.error("Failed to generate mind map: No data returned");
        setGenerating(false);
        return;
      }

      setMindMapData(data.mindMapData);

      // Save mind map to database
      try {
        await supabase.from("mind_maps").insert({
          notebook_id: notebookId,
          title: "AI Mind Map",
          data: data.mindMapData,
        });
      } catch (dbError) {
        console.warn("Failed to save mind map to database:", dbError);
        // Don't fail the whole operation if DB save fails
      }

      toast.success("Mind map generated!");
      setActiveTab("mindmap");
    } catch (error) {
      console.error("Error generating mind map:", error);
      const message = await getFunctionsErrorMessage(error);
      toast.error(`Failed to generate mind map: ${message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!summary) {
      toast.error("Please generate a summary first");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { 
          summary, 
          researchLinks,
          topic: notebook?.title 
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setReport(data.report);
      toast.success("Report generated!");
      setActiveTab("report");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate report: ${message}`);
    } finally {
      setGenerating(false);
    }
  };

  const toggleLinkSelection = (idx: number) => {
    const newSelected = new Set(selectedLinks);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedLinks(newSelected);
  };

  const handleGenerateAudioOverview = async () => {
    if (!summary) {
      toast.error("Please generate a summary first");
      return;
    }

    setGenerating(true);
    setAudioOverview(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-audio-overview", {
        body: { summary },
      });

      if (error) {
        const errorMsg = await getFunctionsErrorMessage(error);
        toast.error(`Failed to generate audio overview: ${errorMsg}`);
        setGenerating(false);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setGenerating(false);
        return;
      }

      setAudioOverview({
        dialogue: data.dialogue,
        audioSegments: data.audioSegments || [],
        providerError: data.providerError || null,
      });
      setIsPlayingAll(false);
      setCurrentSegmentIndex(-1);

      const failedCount = (data.audioSegments || []).filter((s: any) => s.status === 'failed').length;
      const successCount = (data.audioSegments || []).filter((s: any) => s.status === 'success').length;
      const quotaExceeded = data.providerError === 'quota_exceeded';

      if (successCount > 0) {
        // If we have any successful segments, prioritize ElevenLabs
        if (failedCount > 0) {
          toast.warning(`Generated ${successCount} segments with ElevenLabs, ${failedCount} failed (you can retry them or use browser TTS)`);
        } else {
          toast.success(`Audio overview generated with ElevenLabs!`);
        }
      } else if (failedCount > 0 || data.providerError) {
        // All segments failed or provider error - fall back to browser TTS
        if (quotaExceeded) {
          toast.warning("ElevenLabs quota exceeded. Using browser TTS as fallback.");
        } else if (data.providerError) {
          toast.warning("ElevenLabs API error. Using browser TTS as fallback.");
        } else {
          toast.warning("All segments failed to generate. Using browser TTS as fallback.");
        }
      } else {
        toast.success("Audio overview generated!");
      }
      setActiveTab("audio");
    } catch (error) {
      console.error("Error generating audio overview:", error);
      const message = await getFunctionsErrorMessage(error);
      toast.error(`Failed to generate audio overview: ${message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handlePlayAll = () => {
    if (!audioOverview?.audioSegments?.length) return;
    setIsPlayingAll(true);
    setCurrentSegmentIndex(0);
    setTimeout(() => {
      const first = audioRefs.current[0];
      first?.play().catch(() => {});
    }, 0);
  };

  const handleStopAll = () => {
    setIsPlayingAll(false);
    const arr = audioRefs.current;
    arr.forEach(a => a?.pause());
    setCurrentSegmentIndex(-1);
  };

  const handleEnded = (idx: number) => {
    if (!isPlayingAll) return;
    const next = idx + 1;
    if (!audioOverview?.audioSegments) return;
    if (next < audioOverview.audioSegments.length) {
      setCurrentSegmentIndex(next);
      const el = audioRefs.current[next];
      el?.play().catch(() => {});
    } else {
      setIsPlayingAll(false);
      setCurrentSegmentIndex(-1);
    }
  };

  const retryAllFailed = async () => {
    if (!audioOverview?.audioSegments) return;
    const indices = audioOverview.audioSegments
      .map((s: any, i: number) => (s.status === 'failed' ? i : -1))
      .filter((i: number) => i >= 0);
    if (indices.length === 0) return toast.info("No failed segments to retry");

    for (const idx of indices) {
      setGeneratingSegments(prev => new Set(prev).add(idx));
      const seg = audioOverview.audioSegments[idx];
      try {
        const { data, error } = await supabase.functions.invoke("generate-single-segment", {
          body: { speaker: seg.speaker, text: seg.text },
        });
        if (error) {
          const errorMsg = await getFunctionsErrorMessage(error);
          throw new Error(errorMsg);
        }
        if (data.error) {
          throw new Error(data.error);
        }
        setAudioOverview(prev => {
          if (!prev) return prev;
          const newSegments = [...prev.audioSegments];
          newSegments[idx] = { ...seg, audio: data.audio, status: 'success' };
          return { ...prev, audioSegments: newSegments };
        });
      } catch (e) {
        console.error("Error retrying segment:", e);
        const msg = await getFunctionsErrorMessage(e);
        toast.error(`Retry failed for segment ${idx + 1}: ${msg}`);
        // Fallback: speak the segment via browser TTS so user can still listen
        speakText(seg?.text || '', (seg?.speaker as 'AURA' | 'NEO') || 'AURA');
      } finally {
        setGeneratingSegments(prev => {
          const ns = new Set(prev);
          ns.delete(idx);
          return ns;
        });
      }
    }
    toast.success("Retried failed segments");
  };

  const downloadReportAsPDF = async () => {
    const title = (notebook?.title || 'report').replace(/\s+/g, '-');
    const contentLines = (report || '').split('\n').map(l => l.trim());

    // Basic markdown cleanup for paragraphs and headings
    const paragraphs: { type: 'h1' | 'p'; text: string }[] = [];
    contentLines.forEach((line) => {
      if (!line) return;
      if (/^#\s+/.test(line)) {
        paragraphs.push({ type: 'h1', text: line.replace(/^#\s+/, '') });
      } else {
        const t = line
          .replace(/^[-*]\s+/, '')
          .replace(/^\d+\.\s+/, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1');
        paragraphs.push({ type: 'p', text: t });
      }
    });

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text((notebook?.title || 'Report'), margin, y);
    y += 24;

    paragraphs.forEach((p) => {
      if (p.type === 'h1') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
      }
      const lines = doc.splitTextToSize(p.text, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 16;
      });
      y += p.type === 'h1' ? 6 : 4;
    });

    doc.save(`${title}.pdf`);
    toast.success('Report downloaded as PDF');
  };

  const downloadSegment = (base64: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = `data:audio/mpeg;base64,${base64}`;
      link.download = filename;
      link.click();
    } catch {}
  };

  // Browser speech synthesis fallback when provider quota is exceeded
  const ensureVoicesLoaded = (): Promise<void> => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) return resolve();
      const handler = () => {
        const vs = window.speechSynthesis.getVoices();
        if (vs && vs.length > 0) {
          window.speechSynthesis.onvoiceschanged = null as any;
          resolve();
        }
      };
      window.speechSynthesis.onvoiceschanged = handler;
      // safety timeout
      setTimeout(() => resolve(), 800);
    });
  };

  const pickVoice = (preferred: 'AURA' | 'NEO') => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    const female = voices.find(v => /female|woman|samantha|victoria/i.test(v.name));
    const male = voices.find(v => /male|man|daniel|alex|fred/i.test(v.name));
    return preferred === 'AURA' ? (female || voices[0]) : (male || voices[0]);
  };

  const speakText = (text: string, speaker: 'AURA' | 'NEO') => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(speaker);
    if (voice) utter.voice = voice;
    utter.rate = 1.0;
    utter.pitch = speaker === 'AURA' ? 1.05 : 0.95;
    window.speechSynthesis.speak(utter);
  };

  const continueSpeakFromCurrent = async () => {
    if (!audioOverview?.dialogue) return;
    await ensureVoicesLoaded();
    const lines = audioOverview.dialogue.split('\n').filter(Boolean);
    const speakNext = () => {
      // Check if we're paused - if so, don't continue
      if (speakingPausedRef.current) {
        return;
      }
      
      if (!speakingActiveRef.current || speakingIndexRef.current >= lines.length) {
        setIsSpeakingAll(false);
        setIsSpeakingPaused(false);
        speakingPausedRef.current = false;
        speakingIndexRef.current = -1;
        return;
      }
      const line = lines[speakingIndexRef.current];
      let speaker: 'AURA' | 'NEO' = /NEO:/i.test(line) ? 'NEO' : 'AURA';
      const text = line.replace(/^(🎙️\s*)?AURA:\s*/i, '').replace(/^(🤖\s*)?NEO:\s*/i, '');
      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(speaker);
      if (voice) utter.voice = voice;
      utter.rate = 1.0;
      utter.pitch = speaker === 'AURA' ? 1.05 : 0.95;
      utter.onend = () => { 
        // Only continue if not paused
        if (!speakingPausedRef.current) {
          speakingIndexRef.current += 1; 
          speakNext(); 
        }
      };
      utter.onerror = () => { 
        // Only continue if not paused
        if (!speakingPausedRef.current) {
          speakingIndexRef.current += 1; 
          speakNext(); 
        }
      };
      window.speechSynthesis.speak(utter);
    };
    speakNext();
  };

  const speakAll = async () => {
    if (!audioOverview?.dialogue) return;
    if (!('speechSynthesis' in window)) {
      toast.error('Browser speech synthesis not supported');
      return;
    }
    // Clear any queued utterances before starting fresh
    try { window.speechSynthesis.cancel(); } catch {}
    setIsSpeakingAll(true);
    setIsSpeakingPaused(false);
    speakingActiveRef.current = true;
    speakingPausedRef.current = false;
    speakingIndexRef.current = 0;
    await continueSpeakFromCurrent();
  };

  const pauseSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    // Pause if currently speaking and not already paused
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeakingPaused(true);
      speakingPausedRef.current = true;
      speakingActiveRef.current = true; // still active, just paused
    } else if (isSpeakingAll && !isSpeakingPaused) {
      // If we're speaking all but not paused, set paused state
      // This handles the case where we want to pause even if not currently speaking
      setIsSpeakingPaused(true);
      speakingPausedRef.current = true;
      speakingActiveRef.current = true;
      // Cancel any queued utterances
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error('Error canceling speech:', e);
      }
    }
  };

  const resumeSpeaking = async () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Browser speech synthesis not supported');
      return;
    }
    if (!audioOverview?.dialogue) {
      toast.error('No dialogue available');
      return;
    }
    
    // Cancel any queued utterances first
    try { 
      window.speechSynthesis.cancel(); 
    } catch (e) {
      console.error('Error canceling speech:', e);
    }
    
    // Case 1: We are truly paused mid-utterance → just resume
    if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.resume();
        setIsSpeakingPaused(false);
        speakingPausedRef.current = false;
        setIsSpeakingAll(true);
        speakingActiveRef.current = true;
        return;
      } catch (e) {
        console.error('Error resuming speech:', e);
        // Fall through to continue from current
      }
    }
    
    // Case 2: Our state says we're paused, but browser might not be (utterance ended while paused)
    // Continue from the current position
    if (isSpeakingPaused && speakingIndexRef.current >= 0) {
      // Make sure we're not at the end
      const lines = audioOverview.dialogue.split('\n').filter(Boolean);
      if (speakingIndexRef.current >= lines.length) {
        // We've reached the end, reset
        setIsSpeakingAll(false);
        setIsSpeakingPaused(false);
        speakingPausedRef.current = false;
        speakingIndexRef.current = -1;
        toast.info('Reached the end of the dialogue');
        return;
      }
      
      // Continue from current position
      speakingActiveRef.current = true;
      setIsSpeakingPaused(false);
      speakingPausedRef.current = false;
      setIsSpeakingAll(true);
      await continueSpeakFromCurrent();
      return;
    }
    
    // Case 3: Not paused but not speaking and we have a position - continue from current
    if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused && speakingIndexRef.current >= 0) {
      const lines = audioOverview.dialogue.split('\n').filter(Boolean);
      if (speakingIndexRef.current >= lines.length) {
        // We've reached the end, reset
        setIsSpeakingAll(false);
        setIsSpeakingPaused(false);
        speakingPausedRef.current = false;
        speakingIndexRef.current = -1;
        toast.info('Reached the end of the dialogue');
        return;
      }
      
      speakingActiveRef.current = true;
      setIsSpeakingPaused(false);
      speakingPausedRef.current = false;
      setIsSpeakingAll(true);
      await continueSpeakFromCurrent();
      return;
    }
    
    // If we get here, something went wrong - try to restart from beginning
    if (speakingIndexRef.current < 0 || speakingIndexRef.current >= (audioOverview.dialogue.split('\n').filter(Boolean).length)) {
      toast.info('Restarting from beginning');
      speakingIndexRef.current = 0;
      speakingActiveRef.current = true;
      setIsSpeakingPaused(false);
      speakingPausedRef.current = false;
      setIsSpeakingAll(true);
      await continueSpeakFromCurrent();
    }
  };

  // Utilities to combine multiple base64 mp3 segments into a single WAV we can play/download
  const base64ToArrayBuffer = (b64: string) => {
    const binary_string = atob(b64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
  };

  const encodeWAV = (audioBuffer: AudioBuffer) => {
    const numOfChan = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    const writeString = (view: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    let offset = 0;
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + audioBuffer.length * numOfChan * 2, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // PCM chunk size
    view.setUint16(offset, 1, true); offset += 2; // audio format PCM
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numOfChan * 2, true); offset += 4; // byte rate
    view.setUint16(offset, numOfChan * 2, true); offset += 2; // block align
    view.setUint16(offset, 16, true); offset += 2; // bits per sample
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, audioBuffer.length * numOfChan * 2, true); offset += 4;

    // interleave & write PCM
    const channels: Float32Array[] = [];
    for (let c = 0; c < numOfChan; c++) channels.push(audioBuffer.getChannelData(c));
    let sampleIndex = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let c = 0; c < numOfChan; c++) {
        let s = Math.max(-1, Math.min(1, channels[c][i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
      sampleIndex++;
    }
    return new Blob([view], { type: 'audio/wav' });
  };

  const combineSegmentsToSingleAudio = async (segments?: any[]) => {
    const list = segments || audioOverview?.audioSegments || [];
    if (!list.length) return;
    const playable = list.filter((s: any) => s.status === 'success' && s.audio);
    if (playable.length === 0) {
      toast.error('No generated audio to combine. Try Speak All (Browser).');
      return;
    }
    try {
      setCombining(true);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decoded: AudioBuffer[] = [];
      for (const seg of playable) {
        const buf = base64ToArrayBuffer(seg.audio);
        const ab = await audioCtx.decodeAudioData(buf.slice(0));
        decoded.push(ab);
      }
      const sampleRate = decoded[0].sampleRate;
      const channels = Math.max(...decoded.map(b => b.numberOfChannels));
      const totalLength = decoded.reduce((sum, b) => sum + b.length, 0);
      const output = audioCtx.createBuffer(channels, totalLength, sampleRate);
      let offset = 0;
      decoded.forEach(b => {
        for (let c = 0; c < channels; c++) {
          const src = b.getChannelData(Math.min(c, b.numberOfChannels - 1));
          output.getChannelData(c).set(src, offset);
        }
        offset += b.length;
      });
      const wavBlob = encodeWAV(output);
      const url = URL.createObjectURL(wavBlob);
      setCombinedAudioUrl(url);
      toast.success('Combined podcast ready');
    } catch (e) {
      console.error(e);
      toast.error('Failed to combine audio. Try Speak All (Browser).');
    } finally {
      setCombining(false);
    }
  };

  // Auto-combine when segments arrive
  useEffect(() => {
    if (audioOverview?.audioSegments?.length) {
      combineSegmentsToSingleAudio(audioOverview.audioSegments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioOverview?.audioSegments]);

  const handleSendMessage = async () => {
    if (!message.trim() || chatLoading) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setMessage("");
    setChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-document", {
        body: { 
          message: userMessage.content,
          notebookId,
          conversationHistory: chatMessages
        },
      });

      if (error) {
        const errorMsg = await getFunctionsErrorMessage(error);
        throw new Error(errorMsg || 'Failed to send message');
      }

      if (data?.error) {
        toast.error(data.error);
        setChatMessages(prev => prev.slice(0, -1)); // Remove the user message that failed
        return;
      }

      const assistantMessage: ChatMessage = { role: "assistant", content: data.reply || data.message || "I couldn't generate a response." };
      setChatMessages(prev => [...prev, assistantMessage]);

      // Save both messages to database
      try {
        await supabase.from("chat_messages").insert([
          { notebook_id: notebookId, role: "user", content: userMessage.content },
          { notebook_id: notebookId, role: "assistant", content: assistantMessage.content },
        ]);
      } catch (dbError) {
        console.warn('Failed to save chat messages to database:', dbError);
        // Don't show error to user, just log it
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const message = await getFunctionsErrorMessage(error);
      toast.error(`Failed to send message: ${message}`);
      // Remove the user message that failed
      setChatMessages(prev => prev.slice(0, -1));
      // Add error message
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const fetchResearchLinks = async (showLoading = true) => {
    if (!notebook) return;
    
    if (showLoading) setLoadingResearchLinks(true);
    
    // Don't fetch if we have no content to analyze
    if (!summary && keyPoints.length === 0) {
      // Still show fallback links based on notebook title or sources
      if (sources.length > 0) {
        const sourceTopics = sources.slice(0, 3).map(s => s.title || 'learning');
        const yt = buildYouTubeFallback(sourceTopics);
        const others = buildOtherResearchFallback(sourceTopics);
        setResearchLinks([...yt, ...others]);
      }
      if (showLoading) setLoadingResearchLinks(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("fetch-research-links", {
        body: { 
          summary: summary || undefined,
          topic: keyPoints.length > 0 ? keyPoints.join(', ') : (notebook?.title || undefined)
        },
      });

      if (error) {
        const errorMsg = await getFunctionsErrorMessage(error);
        console.warn('Research links fetch error:', errorMsg);
        // Continue to fallback instead of throwing
      } else if (data?.links && Array.isArray(data.links) && data.links.length > 0) {
        // Filter out invalid links (missing url or title)
        const validLinks = data.links.filter((link: any) => 
          link && link.url && link.title && link.url.trim() !== '' && link.title.trim() !== ''
        );
        
        if (validLinks.length > 0) {
          const processed = prioritizeYouTubeLinks(validLinks, keyPoints);
          setResearchLinks(processed);
          return;
        }
      }
      
      // Fallback if no valid links returned
      const yt = buildYouTubeFallback(keyPoints);
      const others = buildOtherResearchFallback(keyPoints);
      setResearchLinks([...yt, ...others]);
    } catch (error) {
      const msg = await getFunctionsErrorMessage(error);
      console.warn("Failed to fetch research links:", msg);
      // Local fallback: YouTube first, then other research links
      const yt = buildYouTubeFallback(keyPoints);
      const others = buildOtherResearchFallback(keyPoints);
      setResearchLinks([...yt, ...others]);
    } finally {
      if (showLoading) setLoadingResearchLinks(false);
    }
  };

  const isYouTubeUrl = (url?: string) => !!url && /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);

  const buildYouTubeFallback = (points: string[]) => {
    const topics = (points && points.length > 0 ? points.slice(0, 5) : ['learning']).map(t => {
      // Clean up the topic text
      const cleaned = String(t).replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim();
      return cleaned.length > 0 ? cleaned : 'learning';
    }).filter(t => t.length > 0);
    
    if (topics.length === 0) topics.push('learning');
    
    return topics.map((t) => ({
      title: `Lecture: ${t}`,
      description: `YouTube search results for ${t}`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t} lecture`)}`,
      source: 'YouTube',
      heading: t,
      subheading: undefined,
    }));
  };

  const buildOtherResearchFallback = (points: string[]) => {
    const topics = (points && points.length > 0 ? points.slice(0, 3) : ['learning']).map(t => {
      // Clean up the topic text
      const cleaned = String(t).replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim();
      return cleaned.length > 0 ? cleaned : 'learning';
    }).filter(t => t.length > 0);
    
    if (topics.length === 0) topics.push('learning');
    
    const items: any[] = [];
    for (const t of topics) {
      items.push({
        title: `Overview: ${t} – Wikipedia`,
        description: `Wikipedia overview for ${t}`,
        url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(t)}`,
        source: 'Wikipedia',
        heading: t,
        subheading: undefined,
      });
      items.push({
        title: `Research: ${t} – Google Scholar`,
        description: `Scholarly articles about ${t}`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(t)}`,
        source: 'Google Scholar',
        heading: t,
        subheading: undefined,
      });
    }
    return items;
  };

  const prioritizeYouTubeLinks = (links: any[], points: string[] = []) => {
    const withFlags = links.map(l => ({ ...l, __yt: isYouTubeUrl(l?.url) ? 1 : 0 }));
    withFlags.sort((a, b) => b.__yt - a.__yt);
    const hasYouTube = withFlags.some(l => l.__yt === 1);
    if (!hasYouTube) {
      return [...buildYouTubeFallback(points), ...withFlags];
    }
    return withFlags;
  };

  // Derive a main heading from the summary (prefer markdown H1, else first non-empty line)
  const getSummaryMainHeading = (text: string, fallback?: string) => {
    if (!text) return fallback || '';
    const lines = text.split('\n').map(l => l.trim());
    const h1 = lines.find(l => /^#\s+/.test(l));
    if (h1) return h1.replace(/^#\s+/, '').trim();
    const first = lines.find(l => l.length > 0);
    return (first || fallback || '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sources Sidebar */}
      <div className="w-80 border-r border-border bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm">
        <div className="p-5 border-b border-border/60 bg-gradient-card">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 hover:bg-accent/50 transition-colors"
            onClick={() => navigate("/notebooks")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notebooks
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-semibold text-lg">Sources</h2>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-5 space-y-4">
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg transition-all"
                disabled={generating}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
              <Textarea
                placeholder="Paste your text or notes here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px] border-2 focus:border-primary/50 rounded-xl resize-none"
              />
              <Button
                onClick={handleAddTextSource}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-md hover:shadow-lg transition-all"
                disabled={!textInput.trim() || generating}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Text & Generate Summary
              </Button>
            </div>

            {/* Flashcards Section */}
            <div className="mt-6 border-t border-border/60 pt-5">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <h3 className="text-sm font-semibold">Flashcards</h3>
                </div>
                <p className="text-xs text-muted-foreground pl-8">
                  AI-generated questions and answers from summary
                </p>
              </div>
              <div className="h-[400px] border-2 border-border/60 rounded-xl p-4 bg-gradient-card shadow-sm">
                <Flashcards
                  flashcards={flashcards}
                  onGenerate={handleGenerateFlashcards}
                  generating={generatingFlashcards}
                />
              </div>
            </div>

            {/* Added Sources Section */}
            <div className="mt-12 border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-md bg-secondary/10 flex items-center justify-center">
                  <FileText className="h-3 w-3 text-secondary" />
                </div>
                <p className="text-sm font-semibold">Added Sources</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {sources.length}
                </span>
              </div>
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm line-clamp-2 flex-1">{source.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-card/30 to-background rounded-t-2xl border border-border/60 shadow-2xl backdrop-blur-md transition-all duration-400 font-[Gill_Sans] tracking-wide overflow-hidden">
        <div className="p-6 border-b border-border/60 bg-gradient-card">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20">
              <span className="text-2xl">{notebook?.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              {renamingTitle ? (
                <input
                  ref={titleInputRef}
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={commitTitleRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitTitleRename();
                    if (e.key === 'Escape') { setRenamingTitle(false); setTempTitle(notebook?.title || ''); }
                  }}
                  className="text-xl font-semibold mb-1 bg-background border-2 border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                />
              ) : (
                <h1
                  className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-text group"
                  onClick={() => { setTempTitle(notebook?.title || ''); setRenamingTitle(true); }}
                >
                  {notebook?.title}
                  <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">(click to edit)</span>
                </h1>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <FileText className="h-3 w-3" />
                  {sources.length} source{sources.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {generating && (() => {
              const isPrepometerNotebook = notebook?.title?.match(/^Class \d+ - .+$/);
              const isQuestionPaper = sources.some(s => 
                s.content.toLowerCase().includes('question paper') ||
                s.content.toLowerCase().includes('question') ||
                s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
              );
              const isNote = sources.some(s => 
                !s.content.toLowerCase().includes('question paper') &&
                !s.content.toLowerCase().includes('question') &&
                !s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
              );
              
              let message = "Generating summary...";
              if (isPrepometerNotebook) {
                if (isQuestionPaper) {
                  message = "Generating question paper analysis...";
                } else if (isNote) {
                  message = "Generating notes...";
                }
              }
              
              return (
                <div className="flex flex-col items-center justify-center gap-4 p-12 bg-gradient-to-br from-primary/5 via-muted/30 to-primary/5 rounded-2xl border border-primary/20 shadow-lg">
                  <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground mb-1">{message}</p>
                    <p className="text-sm text-muted-foreground">This may take a few moments...</p>
                  </div>
                </div>
              );
            })()}

            {(summary || audioOverview || mindMapData || report) && !generating && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl border border-border/60">
                  <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">📝 Summary</TabsTrigger>
                  <TabsTrigger value="report" disabled={!report} className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">📄 Report</TabsTrigger>
                  <TabsTrigger value="audio" disabled={!audioOverview} className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">🎙️ Podcast</TabsTrigger>
                  <TabsTrigger value="mindmap" disabled={!mindMapData} className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">🗺️ Mind Map</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gradient-card rounded-xl border border-border/60 shadow-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateReport} 
                        disabled={!summary}
                        className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateMindMap} 
                        disabled={!summary && selectedLinks.size === 0}
                        className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                      >
                        🧠 Generate Mind Map
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateAudioOverview} 
                        disabled={!summary}
                        className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                      >
                        🎧 Generate Podcast
                      </Button>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <div className="mb-6 bg-gradient-to-br from-primary/5 via-card/50 to-muted/20 rounded-2xl shadow-xl p-8 border-2 border-primary/10 transition-all duration-500 animate-fade-in font-[Gill_Sans] tracking-wide backdrop-blur-md drop-shadow-xl overflow-hidden relative hover:border-primary/20 hover:shadow-2xl">
                        <div className="absolute inset-0 pointer-events-none animate-shimmer opacity-60 z-[1]" />
                        <div className="relative z-[2]">
                          <h1 className="text-2xl font-bold mb-4 text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {(() => {
                              const knownPhrases = [
                                'gen ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'supply chain', 'blockchain', 'big data', 'data science', 'natural language', 'computer vision', 'internet of things', 'iot', 'cloud computing', 'edge computing', 'cyber security', 'quantum computing'
                              ];
                              // Stopwords—expanded
                              const stopwords = new Set([
                                'the','a','an','to','and','or','of','in','for','on','this','that','is','be','are','being','by','with','at','from','as','was','were','it','which','if','not','but','has','have','had','can','will','would','should','may','might','could','do','does','done','about','into','been','was','their','its','also','we','i','you','our','they','he','she','them','his','her','us','so','than','these','those','such','more','most','some','other','all','over','new','used','using','use','because','among','between','through','per','each','within','after','before','one','two','three','first','second','third','file','document','prompt','user','say','output','extracted','content','summary','main','provide','please','introduction','extract','v1.0']
                              );
                              let text = summary || '';
                              // Try: first line/heading that isn't generic
                              const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                              for (let line of lines) {
                                const simple = line.replace(/^[\*•#\-.\s]+/, '').replace(/[^\w\s%]/g, '').trim().toLowerCase();
                                if (!simple) continue;
                                // look for phrase match
                                const matchedPhrase = knownPhrases.find(phrase => simple.includes(phrase));
                                if (matchedPhrase) return matchedPhrase;
                                // Heuristic: should be 3-8 words, not all caps, not all stopwords, not "introduction" etc
                                const ws = line.split(/\s+/).filter(w => !!w);
                                if (ws.length < 3 || ws.length > 8) continue;
                                if (ws.every(w => stopwords.has(w.toLowerCase()))) continue;
                                if (/^[A-Z \-]+$/.test(line)) continue; // skip ALLCAPS
                                if (['introduction','extract','summary','content','document'].includes(simple)) continue;
                                return ws.map(w => w.replace(/[^a-zA-Z0-9]/g, '')).join(' ');
                              }
                              // Fallback to previous keyword freq extraction:
                              text = text.replace(/[\*•#>\-_`~\[\](){}:\/"',.?!;0-9]/g,' ').toLowerCase();
                              const freq = {};
                              text.split(/\s+/).forEach(w => {
                                if (w.length < 2) return;
                                if (stopwords.has(w)) return;
                                freq[w] = (freq[w] || 0) + 1;
                              });
                              const sortedWords = Object.keys(freq)
                                .sort((a,b) => freq[b]-freq[a] || text.indexOf(a) - text.indexOf(b));
                              let topic = '';
                              if (text.includes('gen ai')) { topic = 'gen ai'; }
                              else if (text.includes('artificial intelligence')) { topic = 'artificial intelligence'; }
                              else if (sortedWords.length) { topic = sortedWords.slice(0,3).join(' '); }
                              else { topic = (getSummaryMainHeading(summary, notebook?.title)||'').split(/\s+/).slice(0,3).join(' '); }
                              return topic.trim();
                            })()}
                          </h1>
                          <div className="text-lg leading-relaxed">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                              }}
                            >
                              {summary}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      {keyPoints.length > 0 && (
                        <div className="bg-gradient-to-br from-accent/30 via-card/50 to-accent/10 rounded-2xl p-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                              <span className="text-lg">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold">Key Points</h3>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {keyPoints.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 p-3 rounded-xl bg-background/60 hover:bg-background/80 border border-border/60 hover:border-primary/30 cursor-pointer transition-all group"
                                onClick={() => setSelectedKeyPoint(point)}
                              >
                                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                  <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                                </div>
                                <span className="flex-1 pt-0.5">{point.replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim()}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Chat Interface in Key Points Section */}
                          <div className="mt-6 border-t border-border pt-6">
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                  <span className="text-sm">🤖</span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">AI Study Assistant</h3>
                                  <p className="text-xs text-muted-foreground">
                                    Ask detailed questions and get comprehensive answers
                                  </p>
                                </div>
                              </div>
                            </div>

                            {chatMessages.length > 0 && (
                              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-2 scrollbar-thin">
                                {chatMessages.map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex gap-3 ${
                                      msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    {msg.role === "assistant" && (
                                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-xs">🤖</span>
                                      </div>
                                    )}
                                    <div
                                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                        msg.role === "user"
                                          ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                                          : "bg-muted border border-border rounded-bl-sm"
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                    {msg.role === "user" && (
                                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-xs">👤</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {chatLoading && (
                                  <div className="flex gap-3 justify-start">
                                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm">
                                      <span className="text-xs">🤖</span>
                                    </div>
                                    <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Input
                                  placeholder="Ask anything about the content..."
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendMessage();
                                    }
                                  }}
                                  disabled={chatLoading}
                                  className="text-sm border-2 focus:border-primary"
                                />
                                {chatMessages.length === 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setMessage("Explain the key concepts in detail")}
                                      className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-accent transition-colors"
                                    >
                                      Explain concepts
                                    </button>
                                    <button
                                      onClick={() => setMessage("What are the main takeaways?")}
                                      className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-accent transition-colors"
                                    >
                                      Key takeaways
                                    </button>
                                    <button
                                      onClick={() => setMessage("Give me examples related to this")}
                                      className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-accent transition-colors"
                                    >
                                      Examples
                                    </button>
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || chatLoading}
                                className="bg-gradient-primary h-10 px-4"
                                size="sm"
                              >
                                {chatLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="report">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold">📄 Research Report</h2>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={downloadReportAsPDF}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none bg-card border border-border rounded-lg p-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}
                      >
                        {report}
                      </ReactMarkdown>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="audio">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-6">🎙️ AI Podcast: AURA × NEO</h2>
                    
                    <div className="flex flex-wrap gap-4 mb-6 items-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-sm font-medium">AURA - Curious Host</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg">
                        <div className="h-3 w-3 rounded-full bg-secondary animate-pulse"></div>
                        <span className="text-sm font-medium">NEO - Expert Analyst</span>
                      </div>
                      <div className="ml-auto flex gap-2">
                        {(() => {
                          // Always prefer ElevenLabs if there are any successful segments
                          const hasSuccess = !!audioOverview?.audioSegments?.some((s: any) => s.status === 'success');
                          const allFailed = audioOverview?.audioSegments?.every((s: any) => s.status === 'failed') || false;
                          const hasProviderError = audioOverview?.providerError && audioOverview.providerError !== null;
                          const quotaExceeded = audioOverview?.providerError === 'quota_exceeded';
                          
                          // Use ElevenLabs if we have any successful segments (even if some failed)
                          // Only fall back to browser TTS if all segments failed or there's a critical provider error
                          const useElevenLabs = hasSuccess && !quotaExceeded;
                          const useBrowserTTS = allFailed || (hasProviderError && !hasSuccess) || quotaExceeded;
                          
                          if (useElevenLabs) {
                            return (
                              <>
                                <Button size="sm" variant="outline" onClick={handlePlayAll} disabled={!audioOverview?.audioSegments?.length || isPlayingAll} className="h-full w-full rounded-[inherit] max-w-[110px]">
                                  ▶️ Play All
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleStopAll} disabled={!isPlayingAll} className="h-full w-full rounded-[inherit] max-w-[110px]">
                                  ⏹ Stop
                                </Button>
                              </>
                            );
                          }
                          
                          // Fall back to browser TTS only when ElevenLabs has errors
                          if (useBrowserTTS) {
                            return (
                              <>
                                <Button size="sm" variant="outline" onClick={speakAll} disabled={isSpeakingAll && !isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[170px]">
                                  🔊 Speak All (Browser)
                                </Button>
                                <Button size="sm" variant="outline" onClick={pauseSpeaking} disabled={!isSpeakingAll || isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[130px]">
                                  ⏸ Stop Speak
                                </Button>
                                <Button size="sm" variant="outline" onClick={resumeSpeaking} disabled={!isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[140px]">
                                  ▶️ Resume Speak
                                </Button>
                              </>
                            );
                          }
                          
                          // Default: show browser TTS if no audio segments yet
                          return (
                            <>
                              <Button size="sm" variant="outline" onClick={speakAll} disabled={isSpeakingAll && !isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[170px]">
                                🔊 Speak All (Browser)
                              </Button>
                              <Button size="sm" variant="outline" onClick={pauseSpeaking} disabled={!isSpeakingAll || isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[130px]">
                                ⏸ Stop Speak
                              </Button>
                              <Button size="sm" variant="outline" onClick={resumeSpeaking} disabled={!isSpeakingPaused} className="h-full w-full rounded-[inherit] max-w-[140px]">
                                ▶️ Resume Speak
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {(() => {
                      const hasSuccess = !!audioOverview?.audioSegments?.some((s: any) => s.status === 'success');
                      const quotaExceeded = audioOverview?.providerError === 'quota_exceeded';
                      const useElevenLabs = hasSuccess && !quotaExceeded;
                      
                      // Show ElevenLabs audio if available, otherwise don't show this section
                      if (useElevenLabs && audioOverview?.audioSegments && audioOverview.audioSegments.length > 0 && combinedAudioUrl) {
                        return (
                          <div className="mb-6 bg-muted/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Volume2 className="h-5 w-5" />
                              Audio Podcast (ElevenLabs)
                            </h3>
                            <audio controls className="w-full" src={combinedAudioUrl} />
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {audioOverview?.dialogue && (
                      <div className="bg-gradient-to-br from-card to-muted/30 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-lg mb-4">Transcript</h3>
                        <div className="space-y-4">
                          {audioOverview.dialogue.split('\n').map((line, idx) => {
                            if (line.includes('AURA:')) {
                              return (
                                <div key={idx} className="flex gap-3 items-start">
                                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    🎙️
                                  </div>
                                  <div className="flex-1 bg-primary/5 rounded-lg p-4">
                                    <p className="font-medium text-primary mb-1">AURA</p>
                                    <p>{line.replace(/🎙️\s*AURA:\s*/i, '')}</p>
                                  </div>
                                </div>
                              );
                            } else if (line.includes('NEO:')) {
                              return (
                                <div key={idx} className="flex gap-3 items-start">
                                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                    🤖
                                  </div>
                                  <div className="flex-1 bg-secondary/5 rounded-lg p-4">
                                    <p className="font-medium text-secondary mb-1">NEO</p>
                                    <p>{line.replace(/🤖\s*NEO:\s*/i, '')}</p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="mindmap">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">🗺️ Interactive Mind Map</h2>
                    {mindMapData && mindMapSvgEl && (
                      <div className="flex items-center gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!mindMapSvgEl) return;
                            const serializer = new XMLSerializer();
                            const source = serializer.serializeToString(mindMapSvgEl);
                            const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${(notebook?.title || 'mindmap').replace(/\s+/g, '-')}.svg`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success('SVG downloaded');
                          }}
                        >
                          Download SVG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!mindMapSvgEl) return;
                            const serializer = new XMLSerializer();
                            const svgString = serializer.serializeToString(mindMapSvgEl);
                            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                            const url = URL.createObjectURL(svgBlob);
                            const img = new Image();
                            const canvas = document.createElement('canvas');
                            const rect = mindMapSvgEl.viewBox.baseVal;
                            const width = rect && rect.width ? rect.width : mindMapSvgEl.clientWidth || 1200;
                            const height = rect && rect.height ? rect.height : mindMapSvgEl.clientHeight || 600;
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;
                            await new Promise<void>((resolve) => {
                              img.onload = () => {
                                ctx.fillStyle = '#111318';
                                ctx.fillRect(0, 0, width, height);
                                ctx.drawImage(img, 0, 0, width, height);
                                URL.revokeObjectURL(url);
                                resolve();
                              };
                              img.src = url;
                            });
                            canvas.toBlob((blob) => {
                              if (!blob) return;
                              const a = document.createElement('a');
                              const pngUrl = URL.createObjectURL(blob);
                              a.href = pngUrl;
                              a.download = `${(notebook?.title || 'mindmap').replace(/\s+/g, '-')}.png`;
                              a.click();
                              URL.revokeObjectURL(pngUrl);
                              toast.success('PNG downloaded');
                            }, 'image/png');
                          }}
                        >
                          Download PNG
                        </Button>
                      </div>
                    )}
                    {selectedLinks.size > 0 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Generated from {selectedLinks.size} selected research link{selectedLinks.size > 1 ? 's' : ''}
                      </p>
                    )}
                    {mindMapData && (
                      <MindMapFlow data={mindMapData} />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Display Question Papers Content */}
            {sources.length > 0 && sources.some(s => 
              s.content.toLowerCase().includes('question') ||
              s.content.toLowerCase().includes('paper') ||
              s.content.toLowerCase().includes('exam') ||
              s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
            ) && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">📄 Question Papers</h2>
                <div className="space-y-4">
                  {sources.filter(s => 
                    s.content.toLowerCase().includes('question') ||
                    s.content.toLowerCase().includes('paper') ||
                    s.content.toLowerCase().includes('exam') ||
                    s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
                  ).map((source) => (
                    <div key={source.id} className="bg-card border border-border rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4">{source.title}</h3>
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                        {source.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Key Points for Question Papers */}
                {keyPoints.length > 0 && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-3">📊 Key Points</h3>
                    <ul className="space-y-2">
                      {keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-primary font-semibold mt-0.5">•</span>
                          <span className="flex-1">{point.replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chat Interface for Question Papers */}
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">💬 AI Study Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask questions about solving these problems, get step-by-step solutions, or clarify concepts!
                    </p>
                  </div>

                  {chatMessages.length > 0 && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2 ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs">
                              🤖
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] p-3 rounded-lg text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50"
                            }`}
                          >
                            <p className="font-semibold mb-1 text-xs">
                              {msg.role === "user" ? "You" : "AI Tutor"}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          {msg.role === "user" && (
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs">
                              👤
                            </div>
                          )}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex gap-2 justify-start">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            🤖
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about questions, get solutions, or clarify concepts..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={chatLoading}
                      className="flex-1 text-sm"
                      size="sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || chatLoading}
                      className="bg-gradient-primary"
                      size="sm"
                    >
                      {chatLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {chatMessages.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground mt-4">
                      <p className="text-sm">Start a conversation with AI!</p>
                      <p className="text-xs mt-1">Try asking: "How do I solve question 1?" or "Explain this concept"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Display Notes Content */}
            {sources.length > 0 && sources.some(s => 
              !s.content.toLowerCase().includes('question paper') &&
              !s.content.toLowerCase().includes('question') &&
              !s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
            ) && !summary && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">📝 Study Notes</h2>
                <div className="space-y-4">
                  {sources.filter(s => 
                    !s.content.toLowerCase().includes('question paper') &&
                    !s.content.toLowerCase().includes('question') &&
                    !s.content.toLowerCase().match(/\d+\.\s*(question|q\.)/i)
                  ).map((source) => (
                    <div key={source.id} className="bg-card border border-border rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4">{source.title}</h3>
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                        {source.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Key Points for Notes */}
                {keyPoints.length > 0 && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-3">📊 Key Points</h3>
                    <ul className="space-y-2">
                      {keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-primary font-semibold mt-0.5">•</span>
                          <span className="flex-1">{point.replace(/^[*•.-]+\s*/, '').replace(/[*•.-]+$/, '').trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chat Interface for Notes */}
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">💬 AI Study Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask questions about the notes, get clarifications, or dive deeper into concepts!
                    </p>
                  </div>

                  {chatMessages.length > 0 && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2 ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs">
                              🤖
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] p-3 rounded-lg text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50"
                            }`}
                          >
                            <p className="font-semibold mb-1 text-xs">
                              {msg.role === "user" ? "You" : "AI Tutor"}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          {msg.role === "user" && (
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs">
                              👤
                            </div>
                          )}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex gap-2 justify-start">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            🤖
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about the notes, concepts, or get clarifications..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={chatLoading}
                      className="flex-1 text-sm"
                      size="sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || chatLoading}
                      className="bg-gradient-primary"
                      size="sm"
                    >
                      {chatLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {chatMessages.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground mt-4">
                      <p className="text-sm">Start a conversation with AI!</p>
                      <p className="text-xs mt-1">Try asking: "Explain this concept" or "What are the key takeaways?"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!summary && !generating && sources.length === 0 && (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sources yet</h3>
                <p className="text-muted-foreground">
                  Upload a PDF or add text to get started with AI-powered learning!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Research Panel */}
      <div className="w-96 border-l border-border bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm">
        <div className="p-5 border-b border-border/60 bg-gradient-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="font-semibold text-lg">Research Links</h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedLinks.size > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium shadow-sm">
                  {selectedLinks.size} selected
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchResearchLinks(true)}
                disabled={loadingResearchLinks || !notebook}
                className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors"
                title="Refresh research links"
              >
                {loadingResearchLinks ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {researchLinks.length > 0 && (
            <p className="text-xs text-muted-foreground pl-11">
              Select links to include in mind map generation
            </p>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-5 space-y-3">
            {loadingResearchLinks ? (
              <div className="text-center py-16">
                <div className="relative mx-auto mb-4 w-16 h-16">
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Loading research links...</p>
                <p className="text-xs text-muted-foreground">Finding the best resources for you</p>
              </div>
            ) : researchLinks.length > 0 ? (
              researchLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="group p-4 rounded-xl border-2 border-border/60 hover:border-primary/50 bg-gradient-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleLinkSelection(idx)}
                      className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm ${
                        selectedLinks.has(idx)
                          ? 'bg-gradient-primary border-primary text-primary-foreground shadow-md scale-110'
                          : 'border-muted-foreground/40 hover:border-primary bg-background hover:bg-accent/30'
                      }`}
                    >
                      {selectedLinks.has(idx) && <CheckSquare className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group/link"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary group-hover/link:text-primary/80 transition-colors group-hover/link:scale-110" />
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover/link:text-primary transition-colors">
                            {link.title}
                          </h3>
                        </div>
                        {('heading' in link || 'subheading' in link) && (
                          <p className="text-xs text-muted-foreground mb-2 px-1">
                            { (link as any).heading ? <><span className="font-medium text-primary">{(link as any).heading}</span>{(link as any).subheading ? ' • ' : ''}</> : null}
                            { (link as any).subheading ? <span>{(link as any).subheading}</span> : null }
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 px-1">
                          {link.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium shadow-sm">
                            {link.source}
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-lg">
                  <ExternalLink className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  No research links yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Links will appear here after generating summary
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      {selectedKeyPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-3 text-xl font-semibold p-2 rounded hover:bg-muted"
              onClick={() => setSelectedKeyPoint(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-foreground text-lg whitespace-pre-line">
              {selectedKeyPoint.replace(/^\*+\s*/, '').replace(/\*+$/, '').trim()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
