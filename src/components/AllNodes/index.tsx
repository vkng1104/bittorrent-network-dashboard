import { useTorrentContext } from "../../hooks/useTorrentContext";
import NodeInfo from "../Node";

const AllNodes = () => {
  const { nodes } = useTorrentContext();

  const renderNodes = () => {
    if (!nodes) {
      return <p>No nodes found.</p>;
    }

    return nodes.map((node) => <NodeInfo key={node.nodeId} node={node} />);
  };

  return <>{renderNodes()}</>;
};

export default AllNodes;
