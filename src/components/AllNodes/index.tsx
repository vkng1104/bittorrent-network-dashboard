import { Grid, Typography } from "@mui/material";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import NodeInfo from "../Node";
import { isEmpty } from "lodash";

const AllNodes = () => {
  const { nodes } = useTorrentContext();

  const renderNodes = () => {
    if (!nodes || isEmpty(nodes)) {
      return (
        <Typography variant="h3" component="div">
          No nodes found.
        </Typography>
      );
    }

    return nodes.map((node) => (
      <Grid item xs={4}>
        <NodeInfo key={node.nodeId} node={node} />
      </Grid>
    ));
  };

  return (
    <Grid container spacing={2}>
      {renderNodes()}
    </Grid>
  );
};

export default AllNodes;
