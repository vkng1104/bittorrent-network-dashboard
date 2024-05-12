import { useContext } from "react";
import { UtilsContext } from "../providers/UtilsProvider";

export const useUtilsContext = () => {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error("Must be used within a UtilsContext");
  }
  return context;
};
