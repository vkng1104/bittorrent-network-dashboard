import React, { useState, createContext, useEffect } from "react";

import { useGetAllNodes } from "../hooks/useNode";
import { AllNodeResponse, LogResponse, ModeForm, Node, SnackbarContent } from "../types";
import { nodeInfoTransform } from "../utils/nodeUtils";
import { useSetMode } from "../hooks/useSetMode";
import { useGetLog } from "../hooks/useGetLog";

interface TorrentContextType {
  nodes: Node[] | null;
  bittorrentFiles: string[] | null;
  selectedLog: string;
  snackbarContent: SnackbarContent;
  selectedFileName: string[] | null;
  onSetSnackbarContent: (snackbarContent: SnackbarContent) => void;
  onGetAllNodes: () => Promise<void>;
  onSetMode: (nodeId: number) => Promise<void>;
  onGetLog: (nodeId: number) => Promise<void>;
  onsetSelectedFileName: (nodeId: number, filename: string) => void;
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
  const [selectedFileName, setSelectedFileName] = useState<string[] | null>(
    null
  );
  const [selectedLog, setSelectedLog] = useState<string>("");

  const { getAllNodes } = useGetAllNodes();
  const { setMode } = useSetMode();
  const { getLog } = useGetLog();

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
    setSelectedFileName((prevFileNames) => {
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
          message: `Node ${nodeId} successfully set mode to ${
            selectedMode[nodeId]
          } ${selectedFileName ? selectedFileName[nodeId] : ""}.`,
          severity: "success",
        });

        handleGetAllNodes();
        handleFileNameChange(nodeId, "");
      },
    });
  };

  const handleGetLog = async (nodeId: number) => {
    await getLog(
      { nodeId },
      {
        onSuccess(data: LogResponse) {
          console.log(data);
          setSnackbarContent({
            open: true,
            message: `Node ${nodeId} successfully retrieve log`,
            severity: "success",
          });

          setSelectedLog(data.logData);
        },
      }
    );
  };

  return (
    <TorrentContext.Provider
      value={{
        nodes,
        selectedLog,
        snackbarContent,
        selectedFileName,
        bittorrentFiles,
        onSetSnackbarContent: setSnackbarContent,
        onGetAllNodes: handleGetAllNodes,
        onSetMode: handleSetMode,
        onModeChange: handleModeChange,
        onsetSelectedFileName: handleFileNameChange,
        onGetLog: handleGetLog,
      }}
    >
      {children}
    </TorrentContext.Provider>
  );
};
