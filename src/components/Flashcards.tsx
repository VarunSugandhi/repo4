import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface FlashcardsProps {
  flashcards: Flashcard[];
  onGenerate?: () => void;
  generating?: boolean;
}

export default function Flashcards({ flashcards, onGenerate, generating }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Function to strip markdown and return plain text
  const stripMarkdown = (text: string): string => {
    if (!text) return '';
    return text
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
      // Remove list markers
      .replace(/^[\*\-\+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  if (flashcards.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground mb-4">No flashcards available</p>
        {onGenerate && (
          <Button
            onClick={onGenerate}
            disabled={generating}
            size="sm"
            className="w-full"
          >
            {generating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Flashcards
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const hasFlipped = flippedCards.has(currentIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!hasFlipped) {
      setFlippedCards((prev) => new Set([...prev, currentIndex]));
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setFlippedCards(new Set());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-base text-foreground">Flashcards</h3>
        <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
          {currentIndex + 1} / {flashcards.length}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center mb-4 min-h-[280px]">
        <Card
          className="w-full h-full min-h-[280px] cursor-pointer transition-all duration-300 hover:shadow-xl border-2 bg-gradient-to-br from-card to-muted/20"
          onClick={handleFlip}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          <div className="h-full p-8 flex flex-col items-center justify-center text-center relative">
            {!isFlipped ? (
              <>
                <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {stripMarkdown(currentCard.topic)}
                </div>
                <div className="text-xl font-bold text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                  {stripMarkdown(currentCard.front)}
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-xs text-muted-foreground font-medium">
                  Click to reveal answer
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ transform: 'rotateY(180deg)' }}>
                <div className="text-xs font-semibold text-primary mb-4 uppercase tracking-wide">
                  Answer
                </div>
                <div className="text-base font-normal text-foreground whitespace-pre-wrap leading-relaxed font-sans max-h-[180px] overflow-y-auto px-2">
                  {stripMarkdown(currentCard.back)}
                </div>
                {currentCard.difficulty && (
                  <div className="mt-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      currentCard.difficulty === 'easy' ? 'bg-green-500/20 text-green-700 dark:text-green-400 dark:bg-green-500/10' :
                      currentCard.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 dark:bg-yellow-500/10' :
                      'bg-red-500/20 text-red-700 dark:text-red-400 dark:bg-red-500/10'
                    }`}>
                      {currentCard.difficulty.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex gap-2 mb-2">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={flashcards.length <= 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button
        onClick={handleReset}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>

      {onGenerate && (
        <Button
          onClick={onGenerate}
          disabled={generating}
          size="sm"
          variant="outline"
          className="w-full mt-2 mb-4"
        >
          {generating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating More...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate More
            </>
          )}
        </Button>
      )}
    </div>
  );
}

