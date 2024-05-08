/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallAPIOptions, NodeForm } from "../types";
import useAxiosRequest from "./useAxiosRequest";

export const useGetLog = () => {
  const [{ data, loading }, getLog] = useAxiosRequest({
    api: `http://127.0.0.1:5000/get_log`,
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleGetLog = async (
    data: NodeForm,
    { onSuccess, onError }: CallAPIOptions = {}
  ) => {
    try {
      const res = await getLog({ data });
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, getLog: handleGetLog };
};
