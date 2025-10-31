import { createContext, useContext, useState, type ReactNode } from "react";

interface TopBarTabContextType {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const TopBarTabContext = createContext<TopBarTabContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useTopBarTab = () => {
  const context = useContext(TopBarTabContext);
  if (!context) {
    throw new Error("useTopBarTab must be used within TopBarTabProvider");
  }
  return context;
};

interface TopBarTabProviderProps {
  children: ReactNode;
}

export const TopBarTabProvider = ({ children }: TopBarTabProviderProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("home");

  return (
    <TopBarTabContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TopBarTabContext.Provider>
  );
};
