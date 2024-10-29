"use client"
import { useAppStore } from "@/store/useAppStore";
import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Filter = () => {
  const { filter, setFilter } = useAppStore();
  const [inputValue, setInputValue] = React.useState(filter);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // If the value starts with a valid prefix or is empty, update the filter
    if (!value || value.startsWith('topic:') || value.startsWith('content:')) {
      setFilter(value);
    }
    // If we're continuing to type after a prefix, maintain the prefix
    else if (filter.startsWith('topic:') || filter.startsWith('content:')) {
      const prefix = filter.split(':')[0];
      const newFilter = `${prefix}:${value}`;
      setFilter(newFilter);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="filter">Filter</Label>
      <Input
        placeholder="Use topic: or content: to filter (e.g., topic:programming)"
        name="filter"
        value={inputValue}
        onChange={handleChange}
      />
      <p className="text-xs text-muted-foreground">
        {"Examples: 'topic:programming' or 'content:debugging'"}
      </p>
    </div>
  );
};

export default Filter;
