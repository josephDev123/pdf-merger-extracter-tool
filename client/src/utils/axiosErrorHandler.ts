import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function AxiosErrorHandler(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    toast.error(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    toast.error(error.request.data.message);
  } else {
    // Something happened in setting up the request that triggered an Error
    toast.error(error.message);
  }
  console.log(error.config);
}
