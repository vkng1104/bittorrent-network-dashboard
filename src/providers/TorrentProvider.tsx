import React, { useState, createContext, useEffect } from "react";
import { useGetAllNodes, useSetMode } from "../hooks/useNode";
import { AllNodeResponse, ModeForm, Node, SnackbarContent } from "../types";
import { nodeInfoTransform } from "../utils/nodeUtils";

interface TorrentContextType {
  nodes: Node[] | null;
  bittorrentFiles: string[] | null;
  snackbarContent: SnackbarContent;
  selectedFileName: string[] | null;
  onSetSnackbarContent: (snackbarContent: SnackbarContent) => void;
  onGetAllNodes: () => Promise<void>;
  onSetMode: (nodeId: number) => Promise<void>;
  onSetFileName: (nodeId: number, filename: string) => void;
  onModeChange: (nodeId: number, mode: string) => void;
}

// Create a context for the SDK
export const TorrentContext = createContext<TorrentContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const TorrentProvider: React.FC<Props> = ({ children }) => {
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({
    open: false,
    message: "",
    severity: "error",
  });
  const [nodes, setNodes] = useState<Node[] | null>(null);
  const [bittorrentFiles, setBittorrentFiles] = useState<string[] | null>(null);
  const [selectedMode, setSelectedMode] = useState<string[] | null>(null);
  const [selectedFileName, setFileName] = useState<string[] | null>(null);

  const { getAllNodes } = useGetAllNodes();
  const { setMode } = useSetMode();

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        await handleGetAllNodes();
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, []);

  const handleGetAllNodes = async () => {
    await getAllNodes({
      onSuccess(data: AllNodeResponse) {
        const transformedNodes = nodeInfoTransform(data);
        console.log(transformedNodes);
        setNodes(transformedNodes);
        setBittorrentFiles(data.bittorrentFiles);
      },
    });
  };

  const handleFileNameChange = (nodeId: number, filename: string) => {
    setFileName((prevFileNames) => {
      const updatedFileNames = [...(prevFileNames || [])];
      updatedFileNames[nodeId] = filename;
      return updatedFileNames;
    });
  };

  const handleModeChange = (nodeId: number, mode: string) => {
    setSelectedMode((prevModes) => {
      const updatedModes = [...(prevModes || [])];
      updatedModes[nodeId] = mode;
      return updatedModes;
    });
  };

  const handleSetMode = async (nodeId: number) => {
    const validMode =
      selectedMode &&
      (selectedMode[nodeId] === "exit" ||
        (selectedFileName && selectedFileName[nodeId] !== ""));

    if (!validMode) {
      setSnackbarContent({
        open: true,
        message: "No selected file or mode.",
        severity: "error",
      });

      return;
    }

    const data: ModeForm = {
      nodeId: nodeId,
      mode: selectedMode[nodeId],
      filename: selectedFileName ? selectedFileName[nodeId] : "",
    };

    await setMode(data, {
      onSuccess() {
        setSnackbarContent({
          open: true,
          message: `Node ${nodeId} successfully ${selectedMode[nodeId]} ${
            selectedFileName ? selectedFileName[nodeId] : ""
          }.`,
          severity: "success",
        });

        handleGetAllNodes();
        handleFileNameChange(nodeId, "");
      },
    });
  };

  return (
    <TorrentContext.Provider
      value={{
        nodes,
        snackbarContent,
        selectedFileName,
        bittorrentFiles,
        onSetSnackbarContent: setSnackbarContent,
        onGetAllNodes: handleGetAllNodes,
        onSetMode: handleSetMode,
        onModeChange: handleModeChange,
        onSetFileName: handleFileNameChange,
      }}
    >
      {children}
    </TorrentContext.Provider>
  );
};
