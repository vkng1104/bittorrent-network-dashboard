import { useContext } from "react";
import { TorrentContext } from "../providers/TorrentProvider";

export const useTorrentContext = () => {
  const context = useContext(TorrentContext);
  if (!context) {
    throw new Error("Must be used within a TorrentContext");
  }
  return context;
};
