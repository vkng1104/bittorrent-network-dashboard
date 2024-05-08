import React, { useState, createContext, useEffect } from "react";
import { useGetAllNodes } from "../hooks/useNode";
import { Node } from "../types";

interface TorrentContextType {
  nodes: Node[] | null;
  onModeChange: (mode: string) => void;
  onNodeSelect: (nodeId: number) => void;
  onGetAllNodes: () => void;
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
  const [nodes, setNodes] = useState<Node[] | null>(null);

  const { getAllNodes } = useGetAllNodes();

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        await getAllNodes({
          onSuccess(data) {
            console.log(data);
            setNodes(data as Node[]);
          },
        });
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, []);

  const handleGetAllNodes = async () => {
    await getAllNodes({
      onSuccess(data) {
        console.log(data);
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
        onNodeSelect: handleNodeSelect,
        onModeChange: handleModeChange,
        onGetAllNodes: handleGetAllNodes,
      }}
    >
      {children}
    </TorrentContext.Provider>
  );
};
