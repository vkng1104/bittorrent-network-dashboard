/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallAPIOptions } from "../types";
import useAxiosRequest from "./useAxiosRequest";

export const useGetIP = () => {
  const [{ data, loading }, getIP] = useAxiosRequest({
    api: `http://127.0.0.1:5000/get_ip`,
    method: "GET",
    options: {
      manual: true,
    },
  });

  const handleGetIP = async ({ onSuccess, onError }: CallAPIOptions = {}) => {
    try {
      const res = await getIP();
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, getIP: handleGetIP };
};

export const useSetIP = () => {
  const [{ data, loading }, setIP] = useAxiosRequest({
    api: `http://127.0.0.1:5000/set_ip`,
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleSetIP = async (
    data: { ip: string },
    { onSuccess, onError }: CallAPIOptions = {}
  ) => {
    try {
      const res = await setIP({ data });
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, setIP: handleSetIP };
};
