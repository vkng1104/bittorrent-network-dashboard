import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Node } from "../../types";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import SearchFiles from "../SearchFiles";
import { useUploadFile } from "../../hooks/useNode";

interface NodeProps {
  node: Node;
}

const NodeInfo: React.FC<NodeProps> = ({ node }) => {
  const { nodes, onModeChange, onGetAllNodes, onSetSnackbarContent } =
    useTorrentContext();
  const { uploadFile } = useUploadFile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<string>("");

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    onModeChange(newMode);
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
      setSelectedFile(file); // Update the selected file name
      // Here you can handle the file upload
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("nodeId", node.nodeId.toString());
      formData.append("file", selectedFile);
      uploadFile(formData, {
        onSuccess: () => {
          onGetAllNodes;
          setSelectedFile(null);
          onSetSnackbarContent({
            open: true,
            message: `File uploaded to node ${node.nodeId} successfully.`,
            severity: "success",
          });
        },
        onError: (error) => {
          console.error("Error uploading file:", error);
          // Handle error if needed
        },
      });
    }
  };

  const renderModeComponent = () => {
    if (!nodes) {
      return null;
    }

    // Concatenate all files from all nodes except the current node
    const allFiles = nodes?.reduce(
      (acc, curr) => [...acc, ...curr.files],
      [] as string[]
    );
    const otherFiles = allFiles.filter((file) => !node.files.includes(file));

    switch (mode) {
      case "upload":
        return (
          <Stack direction="row" spacing={1}>
            <Stack gap={2}>
              <Stack direction="row" gap={2}>
                <Button variant="contained" onClick={handleUpload}>
                  Upload
                </Button>
                <Button
                  variant="contained"
                  disabled={selectedFile === null}
                  onClick={handleSaveFile}
                >
                  Save
                </Button>
              </Stack>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelected}
              />
              {/* Display selected file name */}
              <Typography gutterBottom component="div">
                {selectedFile?.name || "No file selected"}
              </Typography>
            </Stack>
          </Stack>
        );
      case "download":
        return (
          <Stack gap={2}>
            <SearchFiles
              fileOptions={otherFiles}
              placeholder={`Search files to download`}
            />
            <Button variant="contained">Download</Button>
          </Stack>
        );
      case "send":
        return (
          <Stack gap={2}>
            <SearchFiles
              fileOptions={node.files}
              placeholder={`Search files in node ${node.nodeId}`}
            />
            <Button variant="contained">Send</Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Card variant="outlined" sx={{ width: 360, height: 300 }}>
      <Stack sx={{ p: 2 }} gap={2} direction="column" alignItems="start">
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Typography gutterBottom variant="h5" component="div">
            Node ID: {node.nodeId}
          </Typography>
          <Button variant="contained">Exit</Button>
        </Stack>

        <Stack>
          <Typography gutterBottom variant="body2">
            Select option
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="mode"
              name="mode"
              value={mode}
              onChange={(e) => handleModeChange(e.target.value)}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
              >
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="Upload"
                />
                <FormControlLabel
                  value="send"
                  control={<Radio />}
                  label="Send"
                />
                <FormControlLabel
                  value="download"
                  control={<Radio />}
                  label="Download"
                />
              </Stack>
            </RadioGroup>
          </FormControl>
        </Stack>
        <Divider />
        {renderModeComponent()}
      </Stack>
    </Card>
  );
};

export default NodeInfo;
