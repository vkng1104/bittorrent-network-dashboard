import React, { useState, createContext } from "react";

import { SnackbarContent } from "../types";

interface UtilsContextType {
  snackbarContent: SnackbarContent;
  selectedFileName: string[];
  selectedMode: string[];
  onSetSnackbarContent: (snackbarContent: SnackbarContent) => void;
  onSelectedFileNameChange: (nodeId: number, filename: string) => void;
  onSelectedModeChange: (nodeId: number, mode: string) => void;
}

// Create a context for the SDK
export const UtilsContext = createContext<UtilsContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const UtilsProvider: React.FC<Props> = ({ children }) => {
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({
    open: false,
    message: "",
    severity: "error",
  });
  const [selectedMode, setSelectedMode] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string[]>([]);

  const handleFileNameChange = (nodeId: number, filename: string) => {
    setSelectedFileName((prevFileNames) => {
      const updatedFileNames = [...(prevFileNames || [])];
      updatedFileNames[nodeId] = filename;
      return updatedFileNames;
    });
  };

  const handleModeChange = (nodeId: number, mode: string) => {
    // clear file input after mode change
    handleFileNameChange(nodeId, "");
    
    setSelectedMode((prevModes) => {
      const updatedModes = [...(prevModes || [])];
      updatedModes[nodeId] = mode;
      return updatedModes;
    });
  };

  return (
    <UtilsContext.Provider
      value={{
        snackbarContent,
        selectedFileName,
        selectedMode,
        onSetSnackbarContent: setSnackbarContent,
        onSelectedModeChange: handleModeChange,
        onSelectedFileNameChange: handleFileNameChange,
      }}
    >
      {children}
    </UtilsContext.Provider>
  );
};
