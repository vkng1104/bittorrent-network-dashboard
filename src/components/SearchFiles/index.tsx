import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

interface SearchFilesProps {
  fileOptions: string[];
  placeholder?: string;
}

const SearchFiles: React.FC<SearchFilesProps> = ({
  fileOptions,
  placeholder,
}) => {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="searchFiles"
        disableClearable
        options={fileOptions}
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
