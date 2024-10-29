export interface Anecdote {
    id: number;
    content: string;
    topic: string;
    votes: number;
}

export type AnecdoteWithoutId = Omit<Anecdote, "id">;

export interface Notification {
    message: string;
    type: "success" | "error" | "";
}