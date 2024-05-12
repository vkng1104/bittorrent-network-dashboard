import { useState } from "react";
import {
  Button,
  Snackbar,
  TextField,
  Alert,
  Stack,
  Divider,
} from "@mui/material";

import { useTorrentContext } from "./hooks/useTorrentContext";
import { useCreateNode } from "./hooks/useNode";
import AllNodes from "./components/AllNodes";
import { useStartTracker } from "./hooks/useStartTracker";
import { useUtilsContext } from "./hooks/useUtilsContext";

const App = () => {
  const { onGetAllNodes } = useTorrentContext();

  const { snackbarContent, onSetSnackbarContent } = useUtilsContext();

  const { createNode } = useCreateNode();
  const { startTracker } = useStartTracker();

  const [nodeIdInput, setNodeIdInput] = useState("");

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
  );
};

export default App;
