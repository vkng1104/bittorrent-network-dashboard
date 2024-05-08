import { AllNodeResponse, Node } from "../types";

export const nodeInfoTransform = (
  allNodesResponse: AllNodeResponse
): Node[] => {
  return allNodesResponse.data.map((nodeData) => {
    const filesArray = nodeData.files.split(", ").filter(Boolean); // Split files string and remove empty strings
    return {
      nodeId: nodeData.nodeId,
      files: filesArray,
    };
  });
};
