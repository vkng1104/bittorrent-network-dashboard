import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

import { useUtilsContext } from "../../hooks/useUtilsContext";

interface SearchFilesProps {
  fileOptions: string[];
  placeholder?: string;
  nodeId: number;
}

const SearchFiles: React.FC<SearchFilesProps> = ({
  fileOptions,
  placeholder,
  nodeId,
}) => {
  const { selectedFileName, onSelectedFileNameChange } = useUtilsContext();

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="searchFiles"
        disableClearable
        options={fileOptions}
        value={selectedFileName[nodeId] ?? ""}
        onInputChange={(event, newValue) =>
          onSelectedFileNameChange(nodeId, newValue)
        }
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
