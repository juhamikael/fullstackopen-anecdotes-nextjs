"use client"

import Link from 'next/link'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useAppStore } from '@/store/useAppStore'
import Divider from './Divider'

const CustomLink = ({ href, text }: { href: string, text: string }) => (
    <>
        {" "}
        <Link
            target='_blank'
            className='text-blue-500 hover:underline'
            href={href}>
            {text}
        </Link>
        {" "}
    </>
)

const Info = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold" id="faq">FAQ</h2>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>{"Why?"}</AccordionTrigger>
                    <AccordionContent>
                        I made these changes to help automate tasks for Part 11 of the Full Stack Open course. This project was a great way to:

                        <ul className="list-disc pl-5 mt-2">
                            <li>Automate the build, test, and deployment processes</li>
                            <li>Use CI/CD concepts in practice</li>
                            <li>Meet the course requirements by integrating CI/CD practices</li>
                            <li>Get hands-on experience with modern development tools and workflows</li>
                            <li>Show that I can set up a CI/CD pipeline for a web app</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>{"What's the origin of this project?"}</AccordionTrigger>
                    <AccordionContent>
                        This project started as a simple anecdote sharing app from
                        <CustomLink
                            href="https://fullstackopen.com/en/part7/exercises_extending_the_bloglist"
                            text="Full Stack Open Part 7"
                        />
                        and evolved through various parts of the course. The original was a Redux app, but I rebuilt it with:
                        <ul className="list-disc pl-5 mt-2">
                            <li>Next.js 14 for better performance and SEO</li>
                            <li>Zustand for simpler state management</li>
                            <li>Shadcn/ui for consistent, accessible components</li>
                            <li>TypeScript for better type safety</li>
                            <li>PostgreSQL with Drizzle ORM for robust data handling</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>{"What are the main changes?"}</AccordionTrigger>
                    <AccordionContent>
                        The key improvements include:
                        <ul className="list-disc pl-5 mt-2">
                            <li>Modern tech stack with Next.js, TypeScript, and Zustand</li>
                            <li>Improved UI with Shadcn components</li>
                            <li>Better state management</li>
                            <li>Enhanced type safety</li>
                            <li>Automated testing with Cypress</li>
                            <li>CI/CD pipeline setup</li>
                            <li>Proper error handling</li>
                            <li>Responsive design</li>
                            <li>Dark mode support</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>{"What's next?"}</AccordionTrigger>
                    <AccordionContent>
                        Future improvements could include:
                        <ul className="list-disc pl-5 mt-2">
                            <li>User authentication</li>
                            <li>More interactive features</li>
                            <li>Enhanced AI integration</li>
                            <li>Mobile app version</li>
                            <li>Real-time updates</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Resources</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        Course:
                        <CustomLink
                            href="https://fullstackopen.com/"
                            text="Full Stack Open"
                        />
                    </li>
                    <li>
                        UI Components:
                        <CustomLink
                            href="https://ui.shadcn.com/"
                            text="shadcn/ui"
                        />
                    </li>
                    <li>
                        Framework:
                        <CustomLink
                            href="https://nextjs.org/"
                            text="Next.js"
                        />
                    </li>
                    <li>
                        State Management:
                        <CustomLink
                            href="https://zustand-demo.pmnd.rs/"
                            text="Zustand"
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Info;
