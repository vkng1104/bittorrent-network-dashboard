import React, { useState, createContext, useEffect } from "react";
import { useGetAllNodes } from "../hooks/useNode";
import { AllNodeResponse, Node, SnackbarContent } from "../types";
import { nodeInfoTransform } from "../utils/nodeUtils";

interface TorrentContextType {
  nodes: Node[] | null;
  snackbarContent: SnackbarContent;
  onModeChange: (mode: string) => void;
  onNodeSelect: (nodeId: number) => void;
  onGetAllNodes: () => void;
  onSetSnackbarContent: (snackbarContent: SnackbarContent) => void;
}

// Create a context for the SDK
export const TorrentContext = createContext<TorrentContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const TorrentProvider: React.FC<Props> = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({
    open: false,
    message: "",
    severity: "error",
  });
  const [nodes, setNodes] = useState<Node[] | null>(null);

  const { getAllNodes } = useGetAllNodes();

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
      onSuccess(data) {
        const transformedNodes = nodeInfoTransform(data as AllNodeResponse);
        console.log(transformedNodes);
        setNodes(transformedNodes);
      },
    });
  };

  const handleNodeSelect = (nodeId: number) => {
    setSelectedNode(nodeId);
  };

  const handleModeChange = (mode: string) => {
    // Here you can perform any action you want based on the mode selected
    console.log(`Mode changed to ${mode} for Node ID: ${selectedNode}`);
  };

  // const onFetchFiles = (nodeId: number) => {
  //   const [{ data, loading, error }, refetch] = useAxios(
  //     "https://reqres.in/api/users?delay=1"
  //   );
  // };

  return (
    <TorrentContext.Provider
      value={{
        nodes,
        snackbarContent,
        onNodeSelect: handleNodeSelect,
        onModeChange: handleModeChange,
        onGetAllNodes: handleGetAllNodes,
        onSetSnackbarContent: setSnackbarContent,
      }}
    >
      {children}
    </TorrentContext.Provider>
  );
};
