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

interface NodeProps {
  node: Node;
}

const NodeInfo: React.FC<NodeProps> = ({ node }) => {
  const { onModeChange } = useTorrentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
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
      setSelectedFileName(file.name); // Update the selected file name
      // Here you can handle the file upload
    }
  };

  const renderModeComponent = () => {
    switch (mode) {
      case "send":
        return (
          <Stack direction="row" spacing={1}>
            <Stack gap={2}>
              <Stack direction="row" gap={2}>
                <Button variant="contained" onClick={handleUpload}>
                  Upload
                </Button>
                <Button variant="contained" disabled={selectedFileName === ""}>
                  Send
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
                {selectedFileName || "No file selected"}
              </Typography>
            </Stack>
          </Stack>
        );
      case "download":
        return (
          <Stack gap={2}>
            <SearchFiles fileOptions={node.files} />
            <Button variant="contained">Download</Button>
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
