import { tempApiBaseUrl } from "@/components/environment";
import { Worker } from "cluster";
import { AppRequest } from "src/pages/api/requests";
import { create } from "zustand";

export interface IWorker {
    cluster_id: string;
    namespace: string;
    name: string;
    status: string;
    node_name: string;
    utilization: string;
    hardware: string;
    uptime: string;
    last_restart_datetime: string;
    last_updated_datetime: string;
    created_datetime: string;
    node_ip: string;
    cores: number;
    memory: string;
    deployment_status: string;
    id: string;
}


// create zustand store
export const useWorkers = create<{
    workers: IWorker[];
    loading: boolean;
    selectedWorker: IWorker | null;
    getWorkers: (endpointId: string, params?: any) => Promise<IWorker[]>;
    getWorker: (endpointId: string, workerId: string, reload?: boolean) => Promise<IWorker>;
    deleteWorker: (endpointId: string, worker: IWorker) => Promise<any>;
    getWorkerMetrics: (endpointId: string, workerId: string) => Promise<any>;
    getWorkerLogs: (endpointId: string, workerId: string) => Promise<any>;
    isMetricsLoading: boolean;
    isLogsLoading: boolean;
}>((set, get) => ({
    getWorkerLogs: async (endpointId: string, workerId: string) => {
        set({ isLogsLoading: true });
        const response: any = await AppRequest.Get(`${tempApiBaseUrl}/endpoints/${endpointId}/workers/${workerId}/logs`);
        set({ isLogsLoading: false });
        return response?.data?.logs;
    },
    getWorkerMetrics: async (endpointId: string, workerId: string) => {
        set({ isMetricsLoading: true });
        const response: any = await AppRequest.Get(`${tempApiBaseUrl}/endpoints/${endpointId}/workers/${workerId}/metrics`);
        set({ isMetricsLoading: false });
        return response?.data?.metrics;
    },
    getWorker: async (endpointId: string, workerId: string, reload = false) => {
        set({ loading: true });
        const response: any = await AppRequest.Get(`${tempApiBaseUrl}/endpoints/${endpointId}/workers/${workerId}`, {
            params: {
                reload
            }
        });
        set({ selectedWorker: response.data?.worker, loading: false });
        return response?.data?.worker;
    },
    getWorkers: async (endpointId: string, params?: any) => {
        set({ loading: true });
        const response: any = await AppRequest.Get(`${tempApiBaseUrl}/endpoints/${endpointId}/workers`, {
            params: {
                ...params,
            }
        });
        set({ workers: response.data?.workers , loading: false});
        return response?.data?.workers;
    },
    workers: [],
    loading: false,
    isMetricsLoading: true,
    isLogsLoading: true,
    selectedWorker: null,
    deleteWorker: async (endpointId: string, _worker: IWorker) => {
        const response: any = await AppRequest.Post(`${tempApiBaseUrl}/endpoints/delete-worker`, { endpoint_id: endpointId, worker_id: _worker.id, worker_name: _worker.name });
        get().getWorkers(endpointId);
        return response;
    },
}));