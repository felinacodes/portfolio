import { createContext, useContext, ReactNode, useState } from "react";

type NotebookData = {
  inputs: Record<string, string>;
  setInput: (id: string, value: string) => void;
};

const NotebookContext = createContext<NotebookData | null>(null);

export function NotebookProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const setInput = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <NotebookContext.Provider value={{ inputs, setInput }}>
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  const context = useContext(NotebookContext);

  if (!context) {
    throw new Error("useNotebook must be used within a NotebookProvider");
  }

  return context;
}
