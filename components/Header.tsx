"use client"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const Header = () => {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black">Anecdotes</h1>
            <Tabs defaultValue="create" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="create">
                        Create New
                    </TabsTrigger>
                    <TabsTrigger value="anecdotes">
                        Anecdotes
                    </TabsTrigger>
                    <TabsTrigger value="faq">
                        FAQ
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default Header;
