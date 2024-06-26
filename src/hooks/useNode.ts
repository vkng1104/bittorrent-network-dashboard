/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallAPIOptions,
  NodeForm,
  NodeParams,
} from "../types/request";
import useAxiosRequest from "./useAxiosRequest";

export const useCreateNode = () => {
  const [{ data, loading }, createNode] = useAxiosRequest({
    api: "http://127.0.0.1:5000/create_node",
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleCreateNode = async (
    data: NodeForm,
    { onSuccess, onError }: CallAPIOptions = {}
  ) => {
    try {
      const res = await createNode({ data });
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, createNode: handleCreateNode };
};

export const useUploadFile = () => {
  const [{ data, loading }, uploadFile] = useAxiosRequest({
    api: "http://127.0.0.1:5000/upload_file",
    method: "POST",
    options: {
      manual: true,
    },
  });

  const handleUploadFile = async (
    data: FormData,
    { onSuccess, onError }: CallAPIOptions = {}
  ) => {
    try {
      const res = await uploadFile({ data });
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, uploadFile: handleUploadFile };
};

export const useGetAllNodes = () => {
  const [{ data, loading }, getAllNodes] = useAxiosRequest({
    api: "http://127.0.0.1:5000/get_nodes",
    method: "GET",
    options: {
      manual: true,
    },
  });

  const handleGetAllNodes = async ({
    onSuccess,
    onError,
  }: CallAPIOptions = {}) => {
    try {
      const res = await getAllNodes();
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, getAllNodes: handleGetAllNodes };
};

export const useGetNode = (params: NodeParams) => {
  const [{ data, loading }, getAllNodes] = useAxiosRequest({
    api: "http://127.0.0.1:5000/get_nodes",
    params,
    method: "GET",
    options: {
      manual: true,
    },
  });

  const handleGetAllNodes = async ({
    onSuccess,
    onError,
  }: CallAPIOptions = {}) => {
    try {
      const res = await getAllNodes();
      onSuccess?.(res.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  return { data, loading, getAllNodes: handleGetAllNodes };
};
