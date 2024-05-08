/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallAPIOptions, ModeForm } from "../types";
import useAxiosRequest from "./useAxiosRequest";

export const useSetMode = () => {
  const [{ data, loading }, setMode] = useAxiosRequest({
    api: `http://127.0.0.1:5000/set_mode`,
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleSetMode = async (
    data: ModeForm,
    { onSuccess, onError }: CallAPIOptions = {}
  ) => {
    try {
      await setMode({ data });
      onSuccess?.();
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, setMode: handleSetMode };
};
