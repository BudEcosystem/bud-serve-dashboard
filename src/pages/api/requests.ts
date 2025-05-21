import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { errorToast } from "./../../components/toast";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
});

let Token = null;
let isRefreshing = false;
let refreshSubscribers = [];

if (typeof window !== "undefined") {
  Token = localStorage.getItem("access_token");
}

// Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (config.url === "token/refresh") {
//       Token = "";
//     } else if (!Token) {
//       Token = localStorage.getItem("access_token");
//     }
//     const accessToken = Token ? Token : "";
//     if (accessToken) {
//       if (config.headers)
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // ✅ Check Internet Connection
    if (typeof window !== 'undefined' && !navigator.onLine) {
      errorToast('No internet connection');
      return Promise.reject(new Error('No internet connection'));
    }

    // ✅ Optional: Check for network quality
    // Use type assertion to access non-standard properties
        const connection = (navigator as any).connection || (navigator as any)['mozConnection'] || (navigator as any)['webkitConnection'];
    if (connection) {
      const { effectiveType, downlink } = connection;
      const slowConnection = ['2g', 'slow-2g'].includes(effectiveType) || downlink < 0.5;

      if (slowConnection) {
        errorToast('Network is too slow or throttled');
        return Promise.reject(new Error('Poor network connection'));
      }
    }

    // 🛡️ Token logic
    if (config.url === "auth/refresh-token") {
      Token = "";
    } else if (!Token) {
      Token = localStorage.getItem("access_token");
    }

    const accessToken = Token ? Token : "";
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const status = err?.response?.status;
    if (status === 401 && !isRefreshing) {
      isRefreshing = true;
      return refreshToken()
        .then((newToken) => {
          isRefreshing = false;
          onRrefreshed(newToken);
          refreshSubscribers = [];
          return axiosInstance(err.config);
        })
        .catch((error) => {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(error);
        });
    } else if (status === 401 && isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          err.config.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(err.config));
        });
      });
    }
    return handleErrorResponse(err);
  }
);

const handleErrorResponse = (err) => {
  if (err.response && err.response.status === 403) {
    localStorage.clear();
    // setTimeout(() => {
    // window.location.replace("/");
    // });
    return false;
  } else if (err.response && err.response.code === 500) {
    // errorToast(err.response.data?.message || "Internal Server Error");
    window.location.reload();
    return false;
  } else if (err.response && err.response.status === 500) {
    // errorToast(err.response.data?.message || "Internal Server Error");
    return false;
  } else if (err.response && err.response.status === 422) {
    // errorToast(
    //   err.response?.data?.message ||
    //     err.response?.data?.message?.[0].detail[0].msg ||
    //     err.response?.data?.[0]?.detail[0].msg ||
    //     "Internal Server Error"
    // );
    return false;
  } else if (err.response && err.response.status == 400 && err.response.request.responseURL.includes('/login')) {
    return Promise.reject(err.response.data);
  } else {
    console.log(err)
    if (err) {
      console.log(err.response?.data?.message)
      errorToast(err.response?.data?.message);
    }
    // errorToast(err.response?.data?.message || "Internal Server Error");
    return false;
  }
};

const onRrefreshed = (token) => {
  refreshSubscribers.map((callback) => callback(token));
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("auth/refresh-token", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    const data = response.data;
    if (!data?.token) {
      localStorage.clear();
      return Promise.reject(data);
    }

    // console.log("data.token", data.token)

    localStorage.setItem("access_token", data.token.access_token);
    localStorage.setItem("refresh_token", data.token.refresh_token);
    return data.token.access_token;
  } catch (error) {
    // console.log("data.token", error);
    // errorToast(error?.response?.data?.error?.message || "Unauthorized Access");
    localStorage.clear();
    return Promise.reject(error);
  }
};

const Get = (
  endPoint,
  payload?: {
    params?: any;
    headers?: any;
  }
) => {
  return axiosInstance.get(endPoint, payload);
};

const Post = (endPoint, payload?, params?) => {
  const config = {
    params: params,
  };
  // Check if payload is an instance of FormData
  if (payload instanceof FormData) {
    config["headers"] = {
      Accept: "multipart/form-data",
    };
  }

  return axiosInstance.post(endPoint, payload, config);
};

const Delete = (endPoint, payload?) => {
  return axiosInstance.delete(endPoint);
};

const Patch = (endPoint, payload?) => {
  return axiosInstance.patch(endPoint, payload);
};

const Put = (endPoint, payload) => {
  return axiosInstance.put(endPoint, payload);
};

export const AppRequest = {
  Get,
  Post,
  Put,
  Patch,
  Delete,
};
