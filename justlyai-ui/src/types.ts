export type ModelType = "GPT-4" | "Claude" | "Cursor";
export type Language = "js" | "ts" | "py" | "java" | "cpp";

export interface ChatPreview {
  id: string;
  title: string;
  codeSnippet?: string;
  timestamp: string;
  model: ModelType;
}

export interface CodeContextItem {
  id: string;
  fileName: string;
  language: Language;
  inContext: boolean;
  lastAccessed: string;
} 