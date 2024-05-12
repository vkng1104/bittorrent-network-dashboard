import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

import { useUtilsContext } from "../../hooks/useUtilsContext";
import { useSetIP } from "../../hooks/useIP";

interface IPModalProps {
  open: boolean;
  handleClose: () => void;
}

const IPModal: React.FC<IPModalProps> = ({ open, handleClose }) => {
  const { ip, onSetIP, onSetSnackbarContent } = useUtilsContext();

  const [inputIP, setInputIP] = useState<string>(ip);

  const { setIP } = useSetIP();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputIP(event.target.value);
  };

  const handleSubmit = async () => {
    await setIP(
      { ip: inputIP },
      {
        onSuccess: (data) => {
          onSetSnackbarContent({
            open: true,
            message: data.message,
            severity: "success",
          });
          onSetIP(inputIP);
          handleClose();
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
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter IP Address</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="ip"
          label="IP Address"
          type="text"
          fullWidth
          variant="outlined"
          value={inputIP}
          onChange={handleInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IPModal;
