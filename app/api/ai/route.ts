import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const { topic, finishWriting, context, previous } = await request.json();

    const allowedEmojis = [
        "😂", "😅", "😊", "👍", "🎉", "💡", "✨", "🚀", "💪", "🎯"
    ];

    const emojies = {
        enabled: true,
        maxEmojis: 5,
        allowedEmojis: allowedEmojis,
    } as const;

    const systemContent = {
        role: "system",
        task: finishWriting
            ? "Complete the given anecdote while maintaining its style and context"
            : "Generate engaging anecdotes based on provided topics",
        importantRules: [
            "Include humor and interesting elements in each anecdote",
            "Use satire, irony, exaggeration and sarcasm to make the anecdote more interesting",
            "Write like a storyteller, not like a journalist",
            "Write like a human, not like a robot/AI",
            "If provided with a previous anecdote, DO NOT repeat it and instead come up with something completely new",
            "NEVER write the topic in the anecdote, it should be a standalone anecdote and topic just gives you the context to write about",
            "Generate anecdotes between 10-100 characters in length, do not bypass this rule",
        ],
        emojis: {
            enabled: emojies.enabled,
            maxEmojis: emojies.maxEmojis,
            allowedEmojis: emojies.allowedEmojis,
            rules: [
                `CRITICAL: You can ONLY use these exact emojis: ${emojies.allowedEmojis.join(", ")}`,
                `Use EXACTLY ${emojies.maxEmojis} emojis per anecdote`,
                "Place the emoji at the very end of the anecdote",
                "Do not use any emoji combinations",
                "Do not use any variations or modifications of emojis",
                "If the anecdote doesn't match any of the allowed emojis perfectly, do not use any emoji",
                "Never place emojis in the middle of the text"
            ]
        },
        rules: [
            "Ensure each anecdote is unique and original",
            "Maintain strict relevance to the provided topic",
            "Write exclusively in English using clear language",
            "Avoid inappropriate or offensive content",
            "Focus on personal or relatable experiences",
            "Include a clear beginning, middle, and end despite brevity",
            ...(finishWriting ? [
                "Maintain consistency with the provided context",
                "Continue the story naturally from where it left off",
                "Keep the same tone and style as the original text"
            ] : [])
        ],
        previous,
        outputFormat: {
            type: "string",
            format: "single anecdote text with exactly one allowed emoji at the end"
        }
    } as const;

    const systemContentString = JSON.stringify(systemContent);

    const prompt = finishWriting
        ? `Complete this anecdote about ${topic}. Here's what's written so far: "${context}"`
        : `Generate a short, engaging anecdote about ${topic}`;

    const { text } = await generateText({
        model: openai('gpt-4o-mini-2024-07-18'),
        system: systemContentString,
        prompt,
    });

    return NextResponse.json({ anecdote: text, generatedWithAI: true }, {
        headers: { 'Content-Type': 'application/json' },
    });
}
