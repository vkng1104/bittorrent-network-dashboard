import React from "react";
import { Box, Button } from "@mui/material";
import { Node } from "../../types";

interface NodeProps {
  node: Node;
  onModeChange: (mode: string) => void;
}

const NodeInfo: React.FC<NodeProps> = ({ node, onModeChange }) => {
  const handleModeChange = (mode: string) => {
    onModeChange(mode);
  };

  return (
    <Box>
      <h2>Node ID: {node.nodeId}</h2>
      <Button variant="contained" onClick={() => handleModeChange("send")}>
        Send
      </Button>
      <Button variant="contained" onClick={() => handleModeChange("download")}>
        Download
      </Button>
      <Button variant="contained" onClick={() => handleModeChange("exit")}>
        Exit
      </Button>
    </Box>
  );
};

export default NodeInfo;
