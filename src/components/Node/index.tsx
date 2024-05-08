import React, { useRef, useState } from "react";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { Node } from "../../types";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import SearchFiles from "../SearchFiles";

interface NodeProps {
  node: Node;
}

const NodeInfo: React.FC<NodeProps> = ({ node }) => {
  const { onModeChange } = useTorrentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleModeChange = (mode: string) => {
    onModeChange(mode);
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFileName(file.name); // Update the selected file name
      // Here you can handle the file upload
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 360 }}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Typography gutterBottom variant="h5" component="div">
            Node ID: {node.nodeId}
          </Typography>
          <Stack>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelected}
            />
            {/* Display selected file name */}
            <Typography gutterBottom component="div">
              {selectedFileName || "No file selected"}
            </Typography>
          </Stack>
        </Stack>
        <SearchFiles fileOptions={node.files} />
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="body2">
          Select option
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => handleModeChange("send")}
            sx={{ width: "200px" }}
          >
            Send
          </Button>
          <Button
            variant="contained"
            onClick={() => handleModeChange("download")}
            sx={{ width: "200px" }}
          >
            Download
          </Button>
        </Stack>
        <Button
          variant="contained"
          onClick={() => handleModeChange("exit")}
          sx={{ width: "200px" }}
        >
          Exit
        </Button>
      </Box>
    </Card>
  );
};

export default NodeInfo;
