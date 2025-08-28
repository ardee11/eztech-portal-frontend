import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <LayoutContext.Provider value={{ isSidebarMinimized, setIsSidebarMinimized }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
