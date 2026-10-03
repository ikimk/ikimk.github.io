import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalContext {
  GlobalBoolean_Variable: boolean;
  setGlobalBoolean_Variable: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<GlobalContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [GlobalBoolean_Variable, setGlobalBoolean_Variable] =
    useState<boolean>(false);

  const value = {
    GlobalBoolean_Variable,
    setGlobalBoolean_Variable,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): GlobalContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
