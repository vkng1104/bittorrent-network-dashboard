import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Node } from "../../types";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import SearchFiles from "../SearchFiles";
import { useUploadFile } from "../../hooks/useNode";
import { modalStyle } from "./style";

interface NodeProps {
  node: Node;
}

const NodeInfo: React.FC<NodeProps> = ({ node }) => {
  const {
    bittorrentFiles,
    selectedLog,
    onModeChange,
    onGetAllNodes,
    onSetSnackbarContent,
    onSetMode,
    onGetLog,
  } = useTorrentContext();
  const { uploadFile } = useUploadFile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null
  );
  const [mode, setMode] = useState<string>("");
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    onModeChange(node.nodeId, newMode);
  };

  const handleGetLog = async () => {
    await onGetLog(node.nodeId);
    handleOpenModal();
  };

  const handleSetMode = (newMode?: string) => {
    if (newMode) handleModeChange(newMode);
    onSetMode(node.nodeId);
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
      setSelectedUploadFile(file); // Update the selected file name
      // Here you can handle the file upload
    }
  };

  const handleSaveFile = async () => {
    if (selectedUploadFile) {
      const formData = new FormData();
      formData.append("nodeId", node.nodeId.toString());
      formData.append("file", selectedUploadFile);
      await uploadFile(formData, {
        onSuccess: () => {
          onSetSnackbarContent({
            open: true,
            message: `File uploaded to node ${node.nodeId} successfully.`,
            severity: "success",
          });
          onGetAllNodes(); // Refresh nodes data after creation
          setSelectedUploadFile(null);
        },
        onError: (error) => {
          console.error("Error uploading file:", error);
          // Handle error if needed
        },
      });
    }
  };

  const renderModeComponent = () => {
    if (!bittorrentFiles) {
      return null;
    }

    const otherFiles = bittorrentFiles.filter(
      (file) => !node.files.includes(file)
    );

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
                  disabled={selectedUploadFile === null}
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
                {selectedUploadFile?.name || "No file selected"}
              </Typography>
            </Stack>
          </Stack>
        );
      case "download":
        return (
          <Stack gap={2}>
            <SearchFiles
              nodeId={node.nodeId}
              modeReset={mode}
              fileOptions={otherFiles}
              placeholder={`Search files to download`}
            />
            <Button variant="contained" onClick={() => handleSetMode()}>
              Download
            </Button>
          </Stack>
        );
      case "send":
        return (
          <Stack gap={2}>
            <SearchFiles
              modeReset={mode}
              nodeId={node.nodeId}
              fileOptions={node.files}
              placeholder={`Search files in node ${node.nodeId}`}
            />
            <Button variant="contained" onClick={() => handleSetMode()}>
              Send
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
            <Stack direction="row" gap={1}>
              <Button variant="contained" onClick={handleGetLog}>
                Log
              </Button>
              <Button variant="contained" onClick={() => handleSetMode("exit")}>
                Exit
              </Button>
            </Stack>
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              maxHeight: "400px",
              overflow: "auto",
              fontSize: "13px",
              whiteSpace: "pre-wrap", // Preserve line breaks
            }}
          >
            {selectedLog}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default NodeInfo;
