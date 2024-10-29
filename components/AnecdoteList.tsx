"use client"
import { useAnecdotes } from "@/hooks/useAnecdotes"
import { useAppStore } from "@/store/useAppStore"
import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"

const AnecdoteList = () => {
  const { anecdotes, voteAnecdote, initializeAnecdotes, deleteAnecdote, filterAnecdotes } = useAnecdotes();
  const { filter } = useAppStore();

  useEffect(() => {
    initializeAnecdotes();
  }, []);

  const filteredAnecdotes = filterAnecdotes(anecdotes, filter);

  // Sort anecdotes by votes in descending order
  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <Table>
      <TableCaption id="table-caption">
        {sortedAnecdotes.length === 0
          ? "No matching anecdotes found."
          : "A list of anecdotes."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Votes</TableHead>
          <TableHead>Vote</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAnecdotes.map((anecdote) => (
          <TableRow key={anecdote.id} data-testid={`anecdote-${anecdote.id}`}>
            <TableCell className="max-w-[300px]">{anecdote.content}</TableCell>
            <TableCell>{anecdote.topic}</TableCell>
            <TableCell id="vote-amount">{anecdote.votes}</TableCell>
            <TableCell className="text-left">
              <Button
                onClick={() => voteAnecdote(anecdote.id)}
                id={`vote-anecdote-${anecdote.id}`}
              >
                Vote
              </Button>
            </TableCell>
            <TableCell className="text-left">
              <Button
                variant="destructive"
                type="button"
                id={`delete-anecdote-${anecdote.id}`}
                onClick={async () => {
                  const success = await deleteAnecdote(anecdote.id);
                  if (success) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                  }
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AnecdoteList;
