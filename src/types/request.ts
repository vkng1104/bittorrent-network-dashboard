/* eslint-disable @typescript-eslint/no-explicit-any */
export type CallAPIOptions = {
  onSuccess?: (data?: any) => void;
  onError?: (error?: unknown) => void;
  onFinally?: () => void;
};

export type NodeForm = {
  nodeId: number;
};

export type UploadFileForm = NodeForm & {
  file: File;
};

export type NodeParams = {
  nodeId: number;
};

export type ModeForm = {
  nodeId: number;
  mode: string;
  filename?: string;
};
