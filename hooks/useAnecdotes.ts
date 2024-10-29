"use client"
import { useAppStore } from '@/store/useAppStore';
import { Anecdote, AnecdoteWithoutId } from "@/types";
import { toast } from "sonner"

export const useAnecdotes = () => {
    const {
        anecdotes,
        setAnecdotes,
        appendAnecdote,
        updateAnecdote,
        removeAnecdote,
    } = useAppStore();

    const initializeAnecdotes = async () => {
        try {
            const fetchedAnecdotes = await fetch("/api/service",
                {
                    method: "GET"
                });
            const json = await fetchedAnecdotes.json();
            setAnecdotes(json);
        } catch (error) {
            console.error(error);
        }
    };

    const filterAnecdotes = (anecdotes: Anecdote[], filter: string) => {
        if (!filter) return anecdotes;

        const [type, query] = filter.split(':');
        if (!query) return anecdotes;

        const searchTerm = query.toLowerCase().trim();

        return anecdotes.filter((anecdote) => {
            switch (type) {
                case 'topic':
                    return anecdote.topic.toLowerCase().includes(searchTerm);
                case 'content':
                    return anecdote.content.toLowerCase().includes(searchTerm);
                default:
                    return true;
            }
        });
    };

    const createAnecdote = async (content: string, topic: string, generatedWithAI: boolean = false) => {
        try {
            const response = await fetch("/api/service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content,
                    topic,
                    generatedWithAI
                })
            });
            const createdAnecdote = await response.json();
            appendAnecdote(createdAnecdote);
            toast.success(`Created new ${generatedWithAI ? 'AI-generated' : ''} anecdote`);
        } catch (error) {
            console.error("Failed to create anecdote", error);
            toast.error('Failed to create anecdote');
        }
    };

    const voteAnecdote = async (id: number) => {
        try {
            const response = await fetch(`/api/service`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                })
            });
            const updatedAnecdote = await response.json();
            updateAnecdote(updatedAnecdote);
            toast.success(`Voted successfuly`);
        } catch (error) {
            console.error("Failed to vote for anecdote", error);
            toast.error('Failed to vote for anecdote');
        }
    };

    const deleteAnecdote = async (id: number) => {
        try {
            const response = await fetch(`/api/service`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                })
            });
            if (response.ok) {
                removeAnecdote(id);
                toast.success(`Deleted Anecdote ID ${id}`);
                return true;
            } else {
                throw new Error('Failed to delete anecdote');
            }
        } catch (error) {
            console.error("Failed to delete anecdote", error);
            toast.error('Failed to delete anecdote');
            return false;
        }
    };

    return {
        anecdotes,
        deleteAnecdote,
        initializeAnecdotes,
        createAnecdote,
        voteAnecdote,
        filterAnecdotes
    };
};
