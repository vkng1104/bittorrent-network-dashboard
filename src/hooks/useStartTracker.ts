/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallAPIOptions } from "../types";
import useAxiosRequest from "./useAxiosRequest";

export const useStartTracker = () => {
  const [{ data, loading }, startTracker] = useAxiosRequest({
    api: `http://127.0.0.1:5000/start_tracker`,
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleStartTracker = async ({
    onSuccess,
    onError,
  }: CallAPIOptions = {}) => {
    try {
      const res = await startTracker({ data });
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, startTracker: handleStartTracker };
};
