import { successToast } from "../components/toast";
import { AppRequest } from "../pages/api/requests";
import { create } from "zustand";
import { tempApiBaseUrl } from "@/components/environment";
import { Model } from "./useModels";
import { Cluster } from "./useCluster";

export interface IEndPoint {
  users_count?: number;
  endpoints_count?: number;
  profile_colors?: string[];
  key?: string;
  name?: string;
  status?: string;
  type?: string;
  created_at?: string;
  model?: Model;
  cluster?: Cluster;
  id?: string;
}

export type EndpointClusterData = {
  id: string;
  name: string;
  model: Model;
  cluster: Cluster;
  deployment_config: {
    avg_context_length: number;
    avg_sequence_length: number;
    concurrent_requests: number;
  };
};

export type Endpoint = {
  id: string;
  name: string;
  status: string;
  deployment_config: {
    avg_context_length: number;
    avg_sequence_length: number;
    concurrent_requests: number;
  };
  created_at: string;
  modified_at: string;
};

export interface IAdapter {
  id: string;
  name: string;
  status: string;
  created_at: string;
  model: Model;
}
export interface PromptListSample {
  hit_ratio: number,
  latency: number,
  page: number,
  limit: number,
  total_record: number,
  total_pages: number,
  message: string,
  most_reused_prompts: [],
  object: string,
  items: [],
};

export interface PromptDetail {
  created_at: string,
  prompt: string,
  request_id: string,
  response: string,
  score: number,
};
export const useEndPoints = create<{
  endPoints: IEndPoint[];
  pageSource: string;
  scoreType: string;
  pageTitle: string;
  totalRecords: number;
  endPointsCount: number;
  loading: boolean;
  adapters: IAdapter[];
  reusedPromptList: PromptListSample;
  inferenceQualityAnalytics: any;
  inferenceQualityPrompts: any;
  getEndPoints: ({
    id,
    page,
    limit,
    name,
  }: {
    id: any;
    page: any;
    limit: any;
    name?: string;
    order_by?: string;
  }) => void;
  createEndPoint: (data: any) => Promise<any>;
  setPageSource: (data: any) => Promise<any>;
  setPromptPage: (type: string, title:string) => Promise<any>;
  deleteEndPoint: (endpointId: string) => Promise<any>;
  updateEndPoint: (endpointId: string, data: any) => void;
  getReusedPrompts: (deploymentId: string,) => void;
  getInferenceQualityAnalytics: (deploymentId: string,) => void;
  getEndpointClusterDetails: (endpointId: string, source?: string) => void;
  getInferenceQualityPrompts: (params: any, id:string) => void;
  clusterDetails?: EndpointClusterData;
  getAdapters: (
    endpointId: string,
    page: number,
    limit: number,
    name?: string,
    order_by?: string
  ) => void;
  deleteAdapter: (adapterId: string) => void;
}>((set, get) => ({
  pageSource: "",
  clusterDetails: undefined,
  endPoints: [],
  endPointsCount: null,
  reusedPromptList: null,
  inferenceQualityAnalytics: null,
  inferenceQualityPrompts: null,
  scoreType: null,
  pageTitle: null,
  totalRecords: null,
  loading: true,
  adapters: [],
  setPageSource: async (data) => {
    set({ pageSource: data });
  },
  setPromptPage: async (type, title) => {
    set({ scoreType: type });
    set({ pageTitle: title });
  },
  getEndpointClusterDetails: async (endpointId: string, source?: string) => {
    set({ loading: true });
    console.log("model-cluster-detail-source", source);
    const url = `${tempApiBaseUrl}/endpoints/${endpointId}/model-cluster-detail`;
    const response: any = await AppRequest.Get(url);
    if(response) {
      set({ clusterDetails: response.data?.result });
      set({ loading: false });
    }
  },
  getEndPoints: async ({ id, page, limit, name, order_by = "-created_at" }) => {
    const url = `${tempApiBaseUrl}/endpoints/`;
    set({ loading: true });
    try {
      const response: any = await AppRequest.Get(url, {
        params: {
          project_id: id,
          page: page,
          limit: limit,
          search: name ? true : false,
          name: name ? name : undefined,
          order_by: order_by,
        },
      });
      const listData = response.data;
      // const updatedListData =
      //   listData.map((item) => {
      //     return {
      //       ...item,
      //     };
      //   });
      set({ endPoints: listData.endpoints });
      set({ endPointsCount: listData.total_record });
      successToast(response.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      set({ loading: false });
    }
  },
  createEndPoint: async (data: any): Promise<any> => {
    try {
      const response: any = await AppRequest.Post("/EndPoints", data);
      successToast(response.data.message);
      return response.data.result;
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  deleteEndPoint: async (endpointId: string): Promise<any> => {
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/endpoints/${endpointId}/delete-workflow`
      );
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  updateEndPoint: async (endpointId: string, data: any) => {
    try {
      const response: any = await AppRequest.Patch(
        `/endpoints/${endpointId}`,
        data
      );
      successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  getAdapters: async (
    endpointId: string,
    page: number,
    limit: number,
    name?: string,
    order_by = "-created_at"
  ) => {
    const url = `${tempApiBaseUrl}/endpoints/${endpointId}/adapters`;
    set({ loading: true });
    try {
      const response: any = await AppRequest.Get(url, {
        params: {
          page: page,
          limit: limit,
          search: name ? true : false,
          name: name ? name : undefined,
          order_by: order_by,
        },
      });
      const listData = response.data;

      set({ adapters: listData.adapters });
      successToast(response.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteAdapter: async (adapterId: string) => {
    try {
      const url = `${tempApiBaseUrl}/endpoints/delete-adapter/${adapterId}`;
      const response: any = await AppRequest.Post(url);
      successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  getReusedPrompts: async (deploymentId: string): Promise<any> => {
    try {
      const url = `${tempApiBaseUrl}/metrics/analytics/cache-metrics/${deploymentId}?page=1&limit=1000`;
      const response: any = await AppRequest.Post(url);
      set({ reusedPromptList: response.data });
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  getInferenceQualityAnalytics: async (deploymentId: string): Promise<any> => {
    set({ loading: true });
    try {
      const url = `${tempApiBaseUrl}/metrics/analytics/inference-quality/${deploymentId}`;
      const response: any = await AppRequest.Post(url);
      set({ inferenceQualityAnalytics: response.data });
      set({ loading: false });
    } catch (error) {
      console.error("Error creating model:", error);
      set({ loading: false });
    }
  },
  getInferenceQualityPrompts: async (params: any, id: string): Promise<any> => {
    const payload = {
      search: params.search,
      page: params.page,
      limit: params.limit,
      // order_by: params.order_by,
      min_score: params.min_score,
      max_score: params.max_score,
    };
  
    const query = new URLSearchParams(payload as any).toString();
    const url = `${tempApiBaseUrl}/metrics/analytics/inference-quality-prompts/${id}/${get().scoreType}?${query}`;
  
    try {
      const response: any = await AppRequest.Post(url); // Assuming you're actually fetching data
      set({ inferenceQualityPrompts: response.data });
      set({ totalRecords: response.data.total_record });
    } catch (error) {
      console.error("Error fetching inference quality prompts:", error);
    }
  }
}));
