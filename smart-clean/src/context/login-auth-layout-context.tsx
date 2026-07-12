"use client";
import { createContext, useContext, useState } from "react";

interface AuthLayoutContextType {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export const AuthLayoutContext = createContext<
  AuthLayoutContextType | undefined
>(undefined);

export const AuthLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <AuthLayoutContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </AuthLayoutContext.Provider>
  );
};

export const useAuthLayout = () => {
  const context = useContext(AuthLayoutContext);
  if (!context)
    throw new Error("useAuthLayout must be used within AuthLayoutProvider");
  return context;
};
