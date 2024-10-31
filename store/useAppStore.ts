import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Anecdote, Notification } from "@/types";

interface AppState {
    anecdotes: Anecdote[];
    filter: string;
    notification: Notification;
    setAnecdotes: (anecdotes: Anecdote[]) => void;
    appendAnecdote: (anecdote: Anecdote) => void;
    updateAnecdote: (updatedAnecdote: Anecdote) => void;
    setFilter: (filter: string) => void;
    removeAnecdote: (id: number) => void;

}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            anecdotes: [],
            filter: "",
            notification: { message: "", type: "" },
            setAnecdotes: (anecdotes) => set({ anecdotes }),
            appendAnecdote: (anecdote) => set((state) => ({
                anecdotes: [...state.anecdotes, anecdote]
            })),
            updateAnecdote: (updatedAnecdote) => set((state) => ({
                anecdotes: state.anecdotes.map(anecdote =>
                    anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
                )
            })),
            removeAnecdote: (id) => set((state) => ({
                anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
            })),
            setFilter: (filter) => set({ filter }),
        }),
        {
            name: 'app-store',
        }
    )
);
