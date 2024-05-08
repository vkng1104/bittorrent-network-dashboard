import { Grid } from "@mui/material";
import { useTorrentContext } from "../../hooks/useTorrentContext";
import NodeInfo from "../Node";

const AllNodes = () => {
  const { nodes } = useTorrentContext();

  const renderNodes = () => {
    if (!nodes) {
      return <p>No nodes found.</p>;
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
