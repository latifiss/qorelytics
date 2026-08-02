"use client";

import { useState } from "react";
import { useTheme } from "@/context/themeContext";
import SelectionModal from "@/components/ui/selectionModal";
import Input from "@/components/ui/input";
import Response from "@/components/ui/response";
import BlogCard from "@/components/ui/blogCard";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
    >
      {theme === "light" ? "Switch to dark" : "Switch to light"}
    </button>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState('');
const [isStreaming, setIsStreaming] = useState(false);

  const handleFileSelect = (file: File, type: string) => {
    console.log('Selected file:', file, 'Type:', type);
  };

  return (
    <div className="flex flex-col bg-background font-text transition-colors min-h-screen p-8 relative">
      <Response isStreaming={true} />
      <div className="w-full max-w-2xl mx-auto flex-1 pb-32">
        <div className="flex items-center justify-between mb-8">
          <div>
            <BlogCard
  title="Close Friends Only: J Balvin & Ryan Castro Talk New Album"
  date="2026-06-30"
  imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D"
  tags={['announcement']}
/>

<BlogCard
  title="Mastering Data Visualization in 2026"
  date="2026-07-15"
  imageUrl="https://images.unsplash.com/photo-1556740772-1a741367b93e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYWxsJTIwYnVzaW5lc3N8ZW58MHx8MHx8fDA%3D"
  tags={['tutorials', 'visualization', 'trends']}
/>
            <h1 className="text-3xl font-display font-bold text-foreground">Upload File</h1>
            <p className="text-muted mt-1">Select a file type to upload</p>
          </div>
          <ThemeSwitcher />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-subtle bg-surface hover:border-border hover:bg-surface-muted transition-all duration-200 text-foreground font-medium"
        >
          Click to select file type
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-background">
        <div className="w-full max-w-2xl mx-auto px-4 pb-5">
          <Input />
        </div>
      </div>

      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleFileSelect}
      />
    </div>
  );
}