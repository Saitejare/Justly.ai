export type ModelType = "GPT-4" | "Claude" | "Cursor";

export interface ChatPreview {
  id: string;
  preview: string;
  model: ModelType;
  lastUsed: string; // ISO string or formatted
  active?: boolean;
} 