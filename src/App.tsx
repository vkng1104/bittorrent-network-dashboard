import { useState } from "react";
import { Box, Button, Snackbar, TextField, Alert, Stack } from "@mui/material";

import { useTorrentContext } from "./hooks/useTorrentContext";
import { useCreateNode } from "./hooks/useNode";
import AllNodes from "./components/AllNodes";

const App = () => {
  const { onGetAllNodes } = useTorrentContext();
  const { createNode } = useCreateNode();

  const [nodeIdInput, setNodeIdInput] = useState("");
  const [snackbarContent, setSnackbarContent] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCreateNode = async () => {
    const nodeId = parseInt(nodeIdInput);
    if (!isNaN(nodeId) && nodeId >= 0) {
      try {
        await createNode(
          { nodeId },
          {
            onSuccess: () => {
              setSnackbarContent({
                open: true,
                message: "Node created successfully.",
                severity: "success",
              });
              setNodeIdInput(""); // Clear input field
              onGetAllNodes(); // Refresh nodes data after creation
            },
          }
        );
      } catch (error) {
        console.error("Error creating node:", error);
        setSnackbarContent({
          open: true,
          message: "Error creating node. Please try again.",
          severity: "error",
        });
      }
    } else {
      setSnackbarContent({
        open: true,
        message: "Node ID must be a non-negative integer.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarContent({ ...snackbarContent, open: false });
  };

  return (
    <Box p={5} justifyContent="center" alignItems="center">
      <Stack
        gap={3}
        width={400}
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
      </Stack>
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
    </Box>
  );
};

export default App;
