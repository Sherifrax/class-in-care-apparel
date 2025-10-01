import React, { createContext, useContext, useState } from 'react';

interface SizeGuideContextType {
  isOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

const SizeGuideContext = createContext<SizeGuideContextType | undefined>(undefined);

export const SizeGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSizeGuide = () => setIsOpen(true);
  const closeSizeGuide = () => setIsOpen(false);

  return (
    <SizeGuideContext.Provider value={{ isOpen, openSizeGuide, closeSizeGuide }}>
      {children}
    </SizeGuideContext.Provider>
  );
};

export const useSizeGuide = () => {
  const context = useContext(SizeGuideContext);
  if (!context) {
    throw new Error('useSizeGuide must be used within a SizeGuideProvider');
  }
  return context;
};
