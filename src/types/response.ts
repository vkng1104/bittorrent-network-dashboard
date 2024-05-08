export type AllNodeResponse = {
  count: number;
  data: {
    nodeId: number;
    files: string;
  }[];
  bittorrentFiles: string[];
};

export type LogResponse = {
  logData: string;
};
