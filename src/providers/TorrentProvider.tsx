import React, { useState, createContext, useEffect } from "react";

import { useGetAllNodes } from "../hooks/useNode";
import { AllNodeResponse, LogResponse, ModeForm, Node } from "../types";
import { nodeInfoTransform } from "../utils/nodeUtils";
import { useSetMode } from "../hooks/useSetMode";
import { useGetLog } from "../hooks/useGetLog";
import { useUtilsContext } from "../hooks/useUtilsContext";

interface TorrentContextType {
  nodes: Node[];
  bittorrentFiles: string[];
  selectedLog: string;
  onGetAllNodes: () => Promise<void>;
  onSetMode: (nodeId: number, mode?: string) => Promise<void>;
  onGetLog: (nodeId: number) => Promise<void>;
}

// Create a context for the SDK
export const TorrentContext = createContext<TorrentContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const TorrentProvider: React.FC<Props> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [bittorrentFiles, setBittorrentFiles] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string>("");

  const {
    selectedFileName,
    selectedMode,
    onSetSnackbarContent,
    onSelectedFileNameChange,
    onSelectedModeChange,
  } = useUtilsContext();

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
      onSuccess: (data: AllNodeResponse) => {
        const transformedNodes = nodeInfoTransform(data);
        console.log(transformedNodes);
        setNodes(transformedNodes);
        setBittorrentFiles(data.bittorrentFiles);
      },
    });
  };

  const handleSetMode = async (nodeId: number, mode?: string) => {
    const validMode =
      mode ||
      (selectedMode &&
        (selectedMode[nodeId] === "exit" ||
          (selectedFileName && selectedFileName[nodeId] !== "")));

    if (!validMode) {
      onSetSnackbarContent({
        open: true,
        message: "No selected file or mode.",
        severity: "error",
      });

      return;
    }

    const submittedMode = mode ?? (selectedMode || [])[nodeId] ?? "";
    const submittedFile = (selectedFileName || [])[nodeId] ?? "";

    const data: ModeForm = {
      nodeId: nodeId,
      mode: submittedMode,
      filename: submittedFile,
    };

    console.log(data);

    await setMode(data, {
      onSuccess: () => {
        onSetSnackbarContent({
          open: true,
          message: `Node ${nodeId} successfully set mode to ${submittedMode} ${submittedFile}.`,
          severity: "success",
        });

        handleGetAllNodes();
        onSelectedFileNameChange(nodeId, "");
        onSelectedModeChange(nodeId, "");
      },
      onError: (error) => {
        onSetSnackbarContent({
          open: true,
          message: error.message,
          severity: "error",
        });
      },
    });
  };

  const handleGetLog = async (nodeId: number) => {
    await getLog(
      { nodeId },
      {
        onSuccess(data: LogResponse) {
          console.log(data);
          onSetSnackbarContent({
            open: true,
            message: `Node ${nodeId} successfully retrieve log`,
            severity: "success",
          });

          setSelectedLog(data.logData);
        },
        onError: (error) => {
          onSetSnackbarContent({
            open: true,
            message: error.message,
            severity: "error",
          });
        },
      }
    );
  };

  return (
    <TorrentContext.Provider
      value={{
        nodes,
        selectedLog,
        bittorrentFiles,
        onGetAllNodes: handleGetAllNodes,
        onSetMode: handleSetMode,
        onGetLog: handleGetLog,
      }}
    >
      {children}
    </TorrentContext.Provider>
  );
};
