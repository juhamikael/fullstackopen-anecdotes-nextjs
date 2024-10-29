'use client';
import React, { useState } from 'react';
import { useAnecdotes } from "@/hooks/useAnecdotes";
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

const steps = [
  { title: 'First', description: 'Choose Topic' },
  { title: 'Second', description: 'Write Content' },
  { title: 'Third', description: 'Review & Post' }
] as const;

const AnecdoteForm: React.FC<{ setTab: (tab: string) => void }> = ({ setTab }) => {
  const { createAnecdote } = useAnecdotes();
  const [currentStep, setCurrentStep] = useState(0);
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedAnecdote, setGeneratedAnecdote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState<'manual' | 'ai'>('manual');
  const [previousAnecdote, setPreviousAnecdote] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const anecdoteToSubmit = generationType === 'manual' ? content : generatedAnecdote;
    if (!anecdoteToSubmit.trim() || !topic.trim()) return;

    await createAnecdote(
      anecdoteToSubmit,
      topic,
      generationType === 'ai'
    );

    setContent('');
    setGeneratedAnecdote('');
    setTopic('');
    setPreviousAnecdote('');
    setCurrentStep(0);
    setTab('anecdotes');
  };

  const generateAnecdote = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), previous: previousAnecdote }),
      });
      const data = await response.json();
      setGeneratedAnecdote(data.anecdote);
      setPreviousAnecdote(data.anecdote);
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to generate anecdote:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const finishWriting = async () => {
    if (!content.trim()) {
      alert('Please write something first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          finishWriting: true,
          context: content
        }),
      });
      const data = await response.json();
      setContent(data.anecdote);
    } catch (error) {
      console.error('Failed to finish writing:', error);
    } finally {
      setIsLoading(false);
    }
  }


  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    if (generationType === 'manual') {
      switch (currentStep) {
        case 0:
          return (
            <div className='space-y-4'>
              <Label htmlFor="topic">{"What's your topic?"}</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='e.g., "Programming", "Work Life", "Tech"'
                className="w-full"
                required
              />
            </div>
          );
        case 1:
          return (
            <div className='space-y-4'>
              <Label htmlFor="content">Write Your Anecdote</Label>
              {
                isLoading ? (
                  <div className="space-y-2">
                    <Skeleton id="content-skeleton-1" className="w-full h-4" />
                    <Skeleton id="content-skeleton-2" className="w-3/4 min-h-[200px]" />
                  </div>
                ) : (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Share your story...'
                    maxLength={280}
                    required
                    minLength={10}
                    className="p-4 min-h-[200px]"
                  />
                )
              }
              <Button
                type="button"
                onClick={finishWriting}
                disabled={isLoading || !content.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                ) : (
                  'Finish Writing'
                )}
              </Button>
            </div>
          );
        case 2:
          return (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Topic</Label>
                <p className="text-lg font-medium">{topic}</p>
              </div>
              <div className='space-y-2'>
                <Label>Your Anecdote</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="p-4 min-h-[200px]"
                />
              </div>
            </div>
          );
      }
    } else {
      switch (currentStep) {
        case 0:
          return (
            <div className='space-y-4'>
              <Label htmlFor="ai-topic">{"What's your topic?"}</Label>
              <Input
                id="ai-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='e.g., "Travel", "Cooking", "Photography"'
                className="w-full"
              />
            </div>
          );
        case 1:
          return (
            <div className='space-y-4 text-center'>
              <p className="text-lg font-medium">Generate an anecdote about:</p>
              <p className="text-2xl font-bold text-primary">{topic}</p>
              <Button
                type="button"
                onClick={generateAnecdote}
                disabled={isLoading}
                size="lg"
                className="w-full max-w-md mx-auto"
              >
                {isLoading ? 'Generating...' : 'Generate Anecdote'}
              </Button>
              {isLoading && (
                <div className="space-y-2">
                  <Skeleton id="ai-skeleton-1" className="w-full h-4" />
                  <Skeleton id="ai-skeleton-2" className="w-full h-4" />
                  <Skeleton id="ai-skeleton-3" className="w-3/4 h-4" />
                </div>
              )}
            </div>
          );
        case 2:
          return (
            <div className='space-y-4'>
              <Label>Review & Edit Generated Anecdote</Label>
              <Textarea
                value={generatedAnecdote}
                onChange={(e) => setGeneratedAnecdote(e.target.value)}
                className="p-4 min-h-[200px]"
              />
              <Button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setGeneratedAnecdote('');
                }}
                variant="outline"
                className="w-full"
              >
                Regenerate
              </Button>
            </div>
          );
      }
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => {
            setGenerationType('manual');
            setCurrentStep(0);
          }}
          variant={generationType === 'manual' ? 'default' : 'outline'}
          className="flex-1"
          id="write-manually"
        >
          Write Manually
        </Button>
        <Button
          onClick={() => {
            setGenerationType('ai');
            setCurrentStep(0);
          }}
          variant={generationType === 'ai' ? 'default' : 'outline'}
          className="flex-1"
          id="generate-with-ai"
        >
          Generate with AI
        </Button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Steps Progress */}
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep >= index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}>
                {index + 1}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-[2px] w-12 mx-4",
                  currentStep > index ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className='min-h-[50px]'>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              id="post-button"
              type="submit"
              disabled={!topic.trim() || !(content.trim() || generatedAnecdote.trim())}
            >
              Post Anecdote
            </Button>
          ) : (
            <Button
              id="next-button"
              type="button"
              onClick={nextStep}
              disabled={
                (currentStep === 0 && !topic.trim()) ||
                (currentStep === 1 && generationType === 'manual' && !content.trim())
              }
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AnecdoteForm;
