import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect } from "react";
import { useTorrentContext } from "../../hooks/useTorrentContext";

interface SearchFilesProps {
  fileOptions: string[];
  placeholder?: string;
  modeReset: string; // a prop to trigger reset
  nodeId: number;
}

const SearchFiles: React.FC<SearchFilesProps> = ({
  fileOptions,
  placeholder,
  modeReset,
  nodeId,
}) => {
  const { selectedFileName, onSetFileName } = useTorrentContext();

  useEffect(() => {
    onSetFileName(nodeId, "");
  }, [modeReset]);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="searchFiles"
        disableClearable
        options={fileOptions}
        value={selectedFileName ? selectedFileName[nodeId] : ""}
        onInputChange={(event, newValue) => onSetFileName(nodeId, newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder ?? "Search"}
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </Stack>
  );
};

export default SearchFiles;
