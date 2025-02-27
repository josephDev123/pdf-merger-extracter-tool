import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "react-toastify";

export const useMutationAction = <TData, TVariables>(
  method: "post" | "put",
  url: string,
  responseType: "json" | "arraybuffer" | "blob" | "text" = "json", // Default to "json"
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      try {
        const response = await axiosInstance[method]<TData>(url, data, {
          responseType,
        });
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success("Operation successful...");
    },
    // onError: (error) => {
    //   toast.error(error.message);
    // },
    ...options,
  });
};
