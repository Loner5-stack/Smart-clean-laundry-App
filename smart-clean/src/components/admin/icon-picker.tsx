"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import data from "@emoji-mart/data";

const EmojiPicker = dynamic(
  () => import("@emoji-mart/react"),
  { 
    ssr: false,
    loading: () => <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 text-sm text-gray-500">Loading Picker...</div>
  }
);

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DynamicIcon({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) {
  // name is the literal emoji string, e.g. "👕"
  return (
    <span 
      style={{ fontSize: size, lineHeight: 1 }} 
      className={className}
    >
      {name}
    </span>
  );
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const onEmojiSelect = (emojiData: any) => {
    onChange(emojiData.native); // emoji-mart provides the raw string in `.native`
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] flex items-center justify-center cursor-pointer hover:border-brand-cobalt transition-colors"
      >
        <span className="text-2xl">{value || "👕"}</span>
      </div>

      <div className={`absolute top-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
        <EmojiPicker 
          data={data}
          onEmojiSelect={onEmojiSelect} 
          theme="auto"
        />
      </div>
    </div>
  );
}
