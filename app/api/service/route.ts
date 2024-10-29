import { db } from "@/lib/db";
import { anecdotesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const anecdotes = await db.select().from(anecdotesTable);
    return NextResponse.json(anecdotes);
}

export async function POST(request: NextRequest) {
    const { content, topic, generatedWithAI } = await request.json();



    const response = await db.insert(anecdotesTable).values({
        content: content,
        topic: topic,
        votes: 0,
        generatedWithAI: generatedWithAI || false
    }).returning({
        id: anecdotesTable.id,
        content: anecdotesTable.content,
        topic: anecdotesTable.topic,
        generatedWithAI: anecdotesTable.generatedWithAI,
        createdAt: anecdotesTable.createdAt
    });
    return NextResponse.json(response[0], { status: 201 });
}

export async function PUT(request: NextRequest) {
    const { id } = await request.json();

    const currentVotes = await db.select().from(anecdotesTable).where(eq(anecdotesTable.id, id))
    const { votes } = currentVotes[0];

    const response = await db.update(anecdotesTable).set({ votes: votes + 1 }).where(eq(anecdotesTable.id, id)).returning({
        id: anecdotesTable.id,
        content: anecdotesTable.content,
        votes: anecdotesTable.votes,
        topic: anecdotesTable.topic
    })

    return NextResponse.json(response[0]);
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();

    const deletedAnecdote = await db.delete(anecdotesTable)
        .where(eq(anecdotesTable.id, id))
        .returning({
            id: anecdotesTable.id,
            content: anecdotesTable.content,
        });

    if (deletedAnecdote.length === 0) {
        return NextResponse.json({ error: "Anecdote not found" }, { status: 404 });
    }

    return NextResponse.json(deletedAnecdote[0]);
}
