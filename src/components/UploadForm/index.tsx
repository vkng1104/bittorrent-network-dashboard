import { Button, TextField } from "@mui/material";

export default function UploadForm() {
  return (
    <form>
      <TextField type="file" />
      <Button variant="contained" color="primary" component="span">
        Upload
      </Button>
    </form>
  );
}
