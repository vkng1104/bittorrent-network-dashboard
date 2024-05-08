/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from "axios";
import type { Options } from "axios-hooks";
import useAxios from "axios-hooks";

const useAxiosRequest = ({
  api,
  method,
  params,
  options,
  config = {},
}: {
  api: string;
  method?: string;
  params?: any;
  options?: Options;
  config?: AxiosRequestConfig<any>;
}) => {
  const axiosResult = useAxios(
    {
      url: api,
      method,
      params,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      ...config,
    },
    {
      useCache: false,
      ...options,
    }
  );

  return axiosResult;
};

export default useAxiosRequest;
