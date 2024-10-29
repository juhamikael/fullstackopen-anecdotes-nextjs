"use client"
import AnecdoteForm from "@/components/AnecdoteForm";
import Filter from "@/components/Filter";
import AnecdoteList from '@/components/AnecdoteList';
import Info from "@/components/Info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("create")
  return (
    <main className="flex flex-col p-24 ">
      <div className="mt-8">
        <h1 className="text-4xl font-black text-center">Anecdotes</h1>
        <Tabs defaultValue="create" className="w-full" value={tab}>
          <TabsList className="flex justify-center gap-x-4 w-fit mx-auto my-8 bg-transparent">
            <TabsTrigger id="create" value="create" onClick={() => setTab("create")}>Create New</TabsTrigger>
            <TabsTrigger id="anecdotes" value="anecdotes" onClick={() => setTab("anecdotes")}>Anecdotes</TabsTrigger>
            <TabsTrigger id="faq" value="faq" onClick={() => setTab("faq")}>FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <AnecdoteForm setTab={setTab} />
          </TabsContent>

          <TabsContent value="anecdotes">
            <div className="space-y-6">
              <Filter />
              <AnecdoteList />
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <Info />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
