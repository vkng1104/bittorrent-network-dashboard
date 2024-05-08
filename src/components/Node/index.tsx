import React from "react";
import { Box, Button } from "@mui/material";
import { Node } from "../../types";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import SearchFiles from "../SearchFiles";

interface NodeProps {
  node: Node;
}

const NodeInfo: React.FC<NodeProps> = ({ node }) => {
  const { onModeChange } = useTorrentContext();

  const handleModeChange = (mode: string) => {
    onModeChange(mode);
  };

  return (
    <Box>
      <h2>Node ID: {node.nodeId}</h2>
      <SearchFiles fileOptions={node.files} />
      <Button variant="contained" onClick={() => handleModeChange("upload")}>
        Upload
      </Button>
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
