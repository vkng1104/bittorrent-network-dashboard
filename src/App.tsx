import { useState } from "react";
import {
  Button,
  Snackbar,
  TextField,
  Alert,
  Stack,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useTorrentContext } from "./hooks/useTorrentContext";
import { useCreateNode } from "./hooks/useNode";
import AllNodes from "./components/AllNodes";
import { useStartTracker } from "./hooks/useStartTracker";
import { useUtilsContext } from "./hooks/useUtilsContext";
import IPModal from "./components/IPModal";

const App: React.FC = () => {
  const { onGetAllNodes } = useTorrentContext();

  const { snackbarContent, onSetSnackbarContent, ip } = useUtilsContext();

  const { createNode } = useCreateNode();
  const { startTracker } = useStartTracker();

  const [nodeIdInput, setNodeIdInput] = useState("");

  const [isIPModalOpen, setIsIPModalOpen] = useState(false);

  const handleOpen = () => setIsIPModalOpen(true);
  const handleClose = () => setIsIPModalOpen(false);

  const handleCreateNode = async () => {
    const nodeId = parseInt(nodeIdInput);
    if (!isNaN(nodeId) && nodeId >= 0) {
      await createNode(
        { nodeId },
        {
          onSuccess: (data) => {
            onSetSnackbarContent({
              open: true,
              message: data.message,
              severity: "success",
            });
            setNodeIdInput(""); // Clear input field
            onGetAllNodes(); // Refresh nodes data after creation
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
    } else {
      onSetSnackbarContent({
        open: true,
        message: "Node ID must be a non-negative integer.",
        severity: "error",
      });
    }
  };

  const handleStartTracker = async () => {
    await startTracker({
      onSuccess(data) {
        onSetSnackbarContent({
          open: true,
          message: data.message,
          severity: "success",
        });
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

  const handleCloseSnackbar = () => {
    onSetSnackbarContent({ ...snackbarContent, open: false });
  };

  return (
    <>
      <Stack p={5} direction="row" justifyContent="start" alignItems="center">
        <Typography>IP: {ip}</Typography>
        <IconButton aria-label="edit IP" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
      </Stack>

      <Stack p={5} justifyContent="center" alignItems="center" gap={3}>
        <Stack
          gap={3}
          width={600}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            label="Node ID"
            type="number"
            value={nodeIdInput}
            onChange={(e) => setNodeIdInput(e.target.value)}
          />
          <Button onClick={handleCreateNode}>Create Node</Button>
          <Button onClick={handleStartTracker}>Start tracker</Button>
        </Stack>
        <Divider />
        <AllNodes />
        {/* Snackbar to display alert messages */}
        <Snackbar
          open={snackbarContent.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            severity={
              snackbarContent.severity === "success" ? "success" : "error"
            }
            onClose={handleCloseSnackbar}
          >
            {snackbarContent.message}
          </Alert>
        </Snackbar>
      </Stack>
      {/* IP edit modal */}
      <IPModal open={isIPModalOpen} handleClose={handleClose} />
    </>
  );
};

export default App;
