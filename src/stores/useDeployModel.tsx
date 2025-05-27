import { tempApiBaseUrl } from "@/components/environment";
import { errorToast, successToast } from "@/components/toast";
import { Provider } from "src/hooks/useCloudProviders";
import { Model, ModelIssue, ScanResult, useModels } from "src/hooks/useModels";
import { Project, useProjects } from "src/hooks/useProjects";
import { IDeploymentTemplate } from "src/hooks/useTemplates";
import { create } from "zustand";
import { Credentials } from "./useProprietaryCredentials";
import { WorkflowType } from "./useWorkflow";
import { AppRequest } from "src/pages/api/requests";

const providerTypeList = [
  {
    id: "cloud_model",
    icon: "/images/drawer/cloud-2.png",
    name: "Cloud",
    description: "Models from various cloud providers",
  },
  {
    id: "hugging_face",
    icon: "/images/drawer/huggingface.png",
    name: "Hugging Face",
    title: "Add Huggingface model",
    description: "Download from Hugging Face",
  },
  {
    id: "url",
    icon: "/images/drawer/url-2.png",
    name: "URL",
    title: "Add model from URL",
    description: "Provide a URL to download model",
  },
  {
    id: "disk",
    icon: "/images/drawer/disk-2.png",
    name: "Disk",
    title: "Add model from Disk",
    description: "Add from Disk",
  },
];

const modalityTypeList = [
  {
    id: "1",
    type: ["llm", "mllm"],
    icon: "/images/drawer/brain.png",
    name: "LLM, Multi-Model LLM",
    description: "Add LLM, Multi-Model LLM",
  },
  {
    id: "2",
    type: ["embedding"],
    icon: "/images/drawer/embedding.png",
    name: "Embedding models",
    description: "Add Embedding models",
  },
  {
    id: "speech_to_text",
    icon: "/images/drawer/speachToText.png",
    name: "Speech to text",
    description: "Add Speech to text models",
  },
  {
    id: "text_to_speech",
    icon: "/images/drawer/textToSpeach.png",
    name: "Text to Speech",
    description: "Add Text to Speech models",
  },
  {
    id: "action_transformers",
    icon: "/images/drawer/compare.png",
    name: "Action Transformers",
    description: "Add Action Transformers models",
  },
];

export type ModalityType = {
  id: string;
  type?: string[];
  icon: string;
  name: string;
  description: string;
};

type BudSimilatorEvent = {
  steps: BudSimulatorSteps[];
  eta: string;
};

export type BudSimulatorSteps = {
  payload: BudSimulatorPayload;
  title: string;
  description: string;
  id: string;
};
type BudSimulatorPayload = {
  category: string;
  type: string;
  event: string;
  workflow_id: string;
  source: string;
  content: {
    title: string;
    message: string;
    status: string;
    primary_action: string;
    secondary_action: string;
    progress: number;
  };
};

export type ProviderType = {
  id: string;
  icon: string;
  name: string;
  title?: string;
  description: string;
  type?: string;
};

export type QuantizeConfig = {
  bit: number;
  granularity: string;
  symmetric: boolean;
};
type QuantizationWorkflow = {
  modelName: string;
  type: string;
  hardware: string;
  method: string;
  weight: QuantizeConfig;
  activation: QuantizeConfig;
  clusterId: string;
};

type QuantizationMethod = {
  name: string;
  description: string;
  hardware_support: string[];
  method_type: string[];
  runtime_hardware_support: string[];
};

type AdapterWorkflow = {
  adapterName: string;
  adapterModelId: string;
  endpointId: string;
  adapterId: string;
};

export const useDeployModel = create<{
  requestCount: any | null;
  currentWorkflow: WorkflowType | null;
  setCurrentWorkflow: (workflow: WorkflowType) => void;
  selectedModel: Model | null;
  setSelectedModel: (model: Model) => void;
  selectedTemplate: IDeploymentTemplate | null;
  deploymentCluster: any;
  providerType: ProviderType | null;
  modalityType: ModalityType | null;
  selectedProvider: Provider | null;
  providerTypeList: ProviderType[];
  modalityTypeList: ModalityType[];
  deploymentSpecifcation: {
    deployment_name: string;
    concurrent_requests: number;
    avg_context_length: number;
    avg_sequence_length: number;
    per_session_tokens_per_sec: number[];
    ttft: number[];
    e2e_latency: number[];
  };
  scalingSpecifcation: {
    scalingType: string;
    scalingMetric: string;
    scalingValue: number;
    minReplicas: number;
    maxReplicas: number;
    scaleUpTolerance: number;
    scaleDownTolerance: number;
    window: number;
  };
  cloudModelDetails: {
    name: string;
    tags: { name: string; color: string }[];
    modality: string[];
    uri?: string;
  };
  status: any;
  providerName: string;
  selectedCredentials: Credentials | null;
  quantizationWorkflow: QuantizationWorkflow | null;
  quantizationMethods: QuantizationMethod[];
  adapterWorkflow: AdapterWorkflow | null;
  setSelectedCredentials: (credentials: Credentials | null) => void;
  setSelectedProvider: (provider: Provider) => void;
  setDeploymentSpecification: (spec: any) => void;
  setScalingSpecification: (spec: any) => void;
  setCloudModelDetails: (details: any) => void;
  setSelectedTemplate: (template: IDeploymentTemplate) => void;
  setDeploymentCluster: (cluster: any) => void;
  setProviderType: (id: string) => void;
  setModalityType: (id) => void;
  setStatus: (status: any) => void;
  setQuantizationWorkflow: (workflow: QuantizationWorkflow | null) => void;
  setQuantizationMethods: (methods: QuantizationMethod[]) => void;
  setAdapterWorkflow: (workflow: AdapterWorkflow | null) => void;
  reset: () => void;
  createWorkflow: (projectId: string) => void;
  updateModel: () => void;
  updateTemplate: () => void;
  getWorkflow: (id?: string) => Promise<any>;
  updateDeploymentSpecification: () => Promise<any>;
  updateScalingSpecification: () => Promise<any>;
  updateCluster: () => Promise<any>;
  createCloudModelWorkflow: () => any;
  updateProviderType: () => any;
  updateProvider: () => any;
  updateCredentials: (credentials: Credentials) => any;
  updateCloudModel: () => Promise<any>;
  updateCloudModelDetails: () => Promise<any>;
  getWorkflowCloud: (id?: string) => Promise<any>;
  createLocalModelWorkflow: () => any;
  createModalityForWorkflow: () => any;
  updateProviderTypeLocal: () => Promise<any>;
  updateModelDetailsLocal: (data: {
    name;
    tags;
    author;
    uri;
    icon?: string;
  }) => Promise<any>;
  updateCredentialsLocal: (credentials: Credentials) => Promise<any>;
  localModelDetails: any;
  setLocalModelDetails: (details: any) => void;
  startSecurityScan: () => Promise<any>;

  cancelModelDeployment: (id: string) => Promise<any>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  deleteWorkflow: (id: string, suppressToast?: boolean) => Promise<any>;
  cancelClusterOnboarding: (id: string) => Promise<any>;
  workerDetails: any;
  setWorkerDetails: (details: any) => void;
  createWorkerFlow: (
    endpointId: string,
    additionalConcurrency: number
  ) => Promise<any>;
  completeCreateWorkerFlow: (workflowId: string) => Promise<any>;
  getQuantizationMethods: () => Promise<any>;
  createQuantizationWorkflow: (
    model_name: string,
    type: string,
    hardware: string
  ) => Promise<any>;
  updateQuantizationMethod: (method: string) => Promise<any>;
  updateQuantizationAdvanced: (
    weight: QuantizeConfig,
    activation: QuantizeConfig
  ) => Promise<any>;
  updateQuantizationCluster: (clusterId: string) => Promise<any>;
  cancelQuantizationDeployment: (id: string) => Promise<any>;
  createAddAdapterWorkflow: (
    endpointId: string,
    adapterModelId: string
  ) => Promise<any>;
  updateAdapterDetailWorkflow: (adapterName: string) => Promise<any>;
  startRequest: () => void;
  endRequest: () => void;
}>((set, get) => ({
  loading: false,
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  workerDetails: {},
  setWorkerDetails: (details: any) => {
    set({ workerDetails: details });
  },
  providerType: null,
  modalityType: null,
  currentWorkflow: null,
  selectedProvider: null,
  setCurrentWorkflow: (workflow: WorkflowType) => {
    set({ currentWorkflow: workflow });
  },
  selectedModel: null,
  setSelectedModel: (model: any) => {
    set({ selectedModel: model });
  },
  selectedTemplate: null,
  setSelectedTemplate: (template: any) => {
    set({ selectedTemplate: template });
  },
  setProviderType: (id: string) => {
    set({
      providerType: get().providerTypeList.find(
        (provider) => provider.id === id
      ),
    });
  },
  setModalityType: (id) => {
    set({
      modalityType: get().modalityTypeList.find(
        (modality) => modality.id === id
      ),
    });
  },
  deploymentSpecifcation: {
    deployment_name: "",
    concurrent_requests: 0,
    avg_context_length: 0,
    avg_sequence_length: 0,
    per_session_tokens_per_sec: [],
    ttft: [],
    e2e_latency: [],
  },
  scalingSpecifcation: {
    scalingType: "metric",
    scalingMetric: "bud:time_to_first_token_seconds_average",
    scalingValue: 1,
    minReplicas: 1,
    maxReplicas: 1,
    scaleUpTolerance: 1.5,
    scaleDownTolerance: 0.5,
    window: 60,
  },
  cloudModelDetails: {
    name: "",
    tags: [],
    modality: [],
    uri: "",
  },
  setDeploymentSpecification: (spec: any) => {
    set({ deploymentSpecifcation: spec });
  },
  setScalingSpecification: (spec: any) => {
    set({ scalingSpecifcation: spec });
  },
  setCloudModelDetails: (details: any) => {
    set({ cloudModelDetails: details });
  },
  setSelectedProvider: (provider: Provider) => {
    set({ selectedProvider: provider });
  },
  deploymentCluster: {},
  setDeploymentCluster: (cluster: any) => {
    set({ deploymentCluster: cluster });
  },
  status: {},
  setStatus: (status: any) => {
    set({ status: status });
  },
  quantizationWorkflow: null,
  setQuantizationWorkflow: (workflow: QuantizationWorkflow | null) => {
    set({ quantizationWorkflow: workflow });
  },
  adapterWorkflow: null,
  setAdapterWorkflow: (workflow: AdapterWorkflow | null) => {
    set({ adapterWorkflow: workflow });
  },
  providerTypeList: providerTypeList,
  modalityTypeList: modalityTypeList,
  requestCount: 0,
  startRequest: () => {
    const newCount = get().requestCount + 1;
    set({ requestCount: newCount, loading: true });
  },
  endRequest: () => {
    const newCount = get().requestCount - 1;
    set({
      requestCount: newCount,
      loading: newCount > 0,
    });
  },

  reset: () => {
    set({
      modalityType: null,
      currentWorkflow: null,
      selectedModel: null,
      selectedTemplate: null,
      deploymentSpecifcation: {
        deployment_name: "",
        concurrent_requests: 0,
        avg_context_length: 0,
        avg_sequence_length: 0,
        per_session_tokens_per_sec: [],
        ttft: [],
        e2e_latency: [],
      },
      deploymentCluster: {},
      status: {},
      selectedProvider: null,
      providerType: null,
      cloudModelDetails: {
        name: "",
        tags: [],
        modality: [],
        uri: "",
      },
      selectedCredentials: null,
      localModelDetails: {
        name: "",
        icon:
          get().currentWorkflow?.workflow_steps?.provider?.type ===
          "huggingface"
            ? ""
            : "😍",
        tags: [],
        uri: "",
        author: "",
      },
      quantizationWorkflow: null,
      adapterWorkflow: null,
    });
  },
  getWorkflowCloud: async (id?: string) => {
    const workflowId = id || get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    try {
      get().startRequest();
      const response: any = await AppRequest.Get(`/workflows/${workflowId}`);
      if (response) {
        const workflow: WorkflowType = response.data;
        set({ currentWorkflow: workflow });
        return workflow;
      }
      return false;
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
      return false;
    } finally {
      get().endRequest();
    }
  },
  getWorkflow: async (id?: string) => {
    const workflowId = id || get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Get(
        `${tempApiBaseUrl}/workflows/${workflowId}`
      );
      if (response) {
        const workflow: WorkflowType = response.data;
        set({ currentWorkflow: workflow });
        return workflow;
      }
      // successToast(response.data.message);
    } catch (error) {
      return false;
    } finally {
      get().endRequest();
    }
  },
  createWorkflow: async (projectId: string) => {
    const modelId = get().selectedModel?.id;
    if (!modelId) {
      errorToast("Please select a model");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          workflow_total_steps: 8,
          step_number: 1,
          trigger_workflow: false,
          project_id: projectId,
          model_id: modelId,
        }
      );
      set({ currentWorkflow: response.data });
      get().getWorkflowCloud(response.data.id);
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateModel: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const modelId = get().selectedModel?.id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 1,
          trigger_workflow: false,
          workflow_id: workflowId,
          model_id: modelId,
          project_id: useProjects.getState().selectedProject?.id,
        }
      );
      get().getWorkflowCloud();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateTemplate: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const templateId = get().selectedTemplate?.id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 3,
          trigger_workflow: false,
          workflow_id: workflowId,
          template_id: templateId,
        }
      );
      get().getWorkflowCloud();
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateCredentials: async (credentials: Credentials) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 2,
          trigger_workflow: false,
          workflow_id: workflowId,
          credential_id: credentials?.id,
        }
      );
      get().getWorkflowCloud();
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateDeploymentSpecification: async () => {
    const currentWorkflow = get().currentWorkflow;
    const workflowId = get().currentWorkflow?.workflow_id;
    const deployConfig = get().deploymentSpecifcation;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      let deployConfigPayload: {
        concurrent_requests: number;
        avg_sequence_length: number;
        avg_context_length: number;
        per_session_tokens_per_sec?: number[];
        ttft?: number[];
        e2e_latency?: number[];
      } = {
        concurrent_requests: parseInt(`${deployConfig.concurrent_requests}`),
        avg_sequence_length: deployConfig.avg_sequence_length,
        avg_context_length: deployConfig.avg_context_length,
      };

      if (
        currentWorkflow.workflow_steps.model.provider_type !== "cloud_model"
      ) {
        deployConfigPayload = {
          concurrent_requests: parseInt(`${deployConfig.concurrent_requests}`),
          avg_sequence_length: deployConfig.avg_sequence_length,
          avg_context_length: deployConfig.avg_context_length,
          per_session_tokens_per_sec: deployConfig.per_session_tokens_per_sec,
          ttft: deployConfig.ttft,
          e2e_latency: deployConfig.e2e_latency,
        };
      }

      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 4,
          trigger_workflow: false,
          workflow_id: workflowId,
          endpoint_name: deployConfig.deployment_name,
          deploy_config: deployConfigPayload,
        }
      );
      get().getWorkflowCloud();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateScalingSpecification: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const scalingSpecifcation = get().scalingSpecifcation;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 7,
          trigger_workflow: true,
          workflow_id: workflowId,
          scaling_specification: scalingSpecifcation,
        }
      );
      get().getWorkflowCloud();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateCluster: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const cluster = get().deploymentCluster;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/deploy-workflow`,
        {
          step_number: 6,
          trigger_workflow: false,
          workflow_id: workflowId,
          cluster_id: cluster?.cluster_id,
        }
      );
      get().getWorkflowCloud();
      return response;
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  // Add Model Flow
  createCloudModelWorkflow: async () => {
    const modalityId = get().modalityType?.type;
    const providerId = get().providerType?.id;
    if (!providerId) {
      errorToast("Please select a model");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cloud-model-workflow`,
        {
          workflow_total_steps: 5,
          step_number: 2,
          provider_type: providerId,
          add_model_modality: modalityId,
        }
      );
      if (!response) {
        return;
      }

      get().getWorkflow(response.data.workflow_id);
      get().endRequest();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    }
  },
  // Add Model Flow
  updateProviderType: async () => {
    const providerType = get().providerType;
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cloud-model-workflow`,
        {
          workflow_total_steps: 6,
          step_number: 2,
          provider_type: providerType?.id,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  // Add Model Flow
  updateProvider: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const provider = get().selectedProvider;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cloud-model-workflow`,
        {
          step_number: 3,
          workflow_id: workflowId,
          provider_id: provider?.id,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  // Add Model Flow
  updateCloudModel: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const model = get().selectedModel;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cloud-model-workflow`,
        {
          step_number: 4,
          workflow_id: workflowId,
          cloud_model_id: model?.id,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  // Add Model Flow
  updateCloudModelDetails: async () => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const model = get().selectedModel;
    const cloudModelDetails = get().cloudModelDetails;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cloud-model-workflow`,
        {
          step_number: 5,
          workflow_id: workflowId,
          trigger_workflow: true,
          name: cloudModelDetails.name,
          tags: cloudModelDetails.tags,
          modality: cloudModelDetails.modality,
          uri: cloudModelDetails.uri ? cloudModelDetails.uri : undefined,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      errorToast("Error creating model");
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  providerName: "",
  selectedCredentials: null,
  setSelectedCredentials: (credentials: Credentials | null) => {
    set({ selectedCredentials: credentials });
  },
  // Add Model select modality
  createModalityForWorkflow: async () => {
    const modalityId = get().modalityType?.type;
    if (!modalityId) {
      errorToast("Please select a modality");
      return;
    }
    // get().startRequest();

    // try {
    //   const response: any = await AppRequest.Post(
    //     `${tempApiBaseUrl}/models/local-model-workflow`,
    //     {
    //       workflow_total_steps: 6,
    //       step_number: 1,
    //       trigger_workflow: false,
    //       modality: modalityId,
    //     }
    //   );
    //   if (!response) {
    //     return;
    //   }

    //   get().getWorkflow(response.data.workflow_id);
    //   get().endRequest();
    //   return response;
    // } catch (error) {
    //   console.error("Error creating model:", error);
    // }
  },
  // Add Model select modality
  createLocalModelWorkflow: async () => {
    const providerId = get().providerType?.id;
    const modalityId = get().modalityType?.type;
    if (!providerId) {
      errorToast("Please select a model");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/local-model-workflow`,
        {
          workflow_total_steps: 5,
          step_number: 1,
          provider_type: providerId,
          add_model_modality: modalityId,
        }
      );
      if (!response) {
        return;
      }

      get().getWorkflow(response.data.workflow_id);
      return response;
      // successToast(response.data.message);
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateProviderTypeLocal: async () => {
    const providerType = get().providerType;
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/local-model-workflow`,
        {
          workflow_total_steps: 5,
          step_number: 1,
          provider_type: providerType?.id,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateModelDetailsLocal: async (data: {
    name;
    tags;
    author;
    uri;
    icon?: string;
  }) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    const model = get().selectedModel;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/local-model-workflow`,
        {
          step_number: 2,
          workflow_id: workflowId,
          trigger_workflow: false,
          name: data.name,
          uri: data.uri,
          author: data.author,
          tags: data.tags,
          icon: data.icon || null,
        }
      );
      get().getWorkflow();
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateCredentialsLocal: async (credentials: Credentials) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/local-model-workflow`,
        {
          step_number: 3,
          workflow_id: workflowId,
          trigger_workflow: true,
          proprietary_credential_id: credentials ? credentials.id : undefined,
        }
      );
      get().getWorkflow();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  localModelDetails: {},
  setLocalModelDetails: (details: any) => {
    set({ localModelDetails: details });
  },

  // Security Scan
  startSecurityScan: async () => {
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/security-scan`,
        {
          workflow_total_steps: 3,
          step_number: 1,
          trigger_workflow: true,
          model_id: useModels.getState().selectedModel?.id,
        }
      );
      await get().getWorkflow(response.data.workflow_id);
      get().endRequest();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
      get().endRequest();
    }
  },
  cancelModelDeployment: async (id: string) => {
    try {
      if (!id) {
        return true;
      }
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cancel-deployment`,
        {
          workflow_id: id,
        }
      );
      return response.data;
    } catch (error) {
      errorToast("Failed to cancel model deployment");
      return error;
    }
  },
  cancelClusterOnboarding: async (id: string) => {
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/clusters/cancel-onboarding`,
        {
          workflow_id: id,
        }
      );
      return response.data;
    } catch (error) {
      errorToast("Failed to cancel cluster onboarding");
      return error;
    }
  },

  deleteWorkflow: async (id: string, suppressToast?: boolean) => {
    try {
      const response: any = await AppRequest.Delete(
        `${tempApiBaseUrl}/workflows/${id}`
      );
      if (!suppressToast) {
        successToast(response.data.message);
      }
      set({ currentWorkflow: null });
      return response.data;
    } catch (error) {
      console.error("Error creating model:", error);
      return error;
    }
  },
  createWorkerFlow: async (
    endpointId: string,
    additionalConcurrency: number
  ) => {
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/endpoints/add-worker`,
        {
          workflow_total_steps: 5,
          step_number: 1,
          trigger_workflow: false,
          endpoint_id: endpointId,
          additional_concurrency: additionalConcurrency,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating model:", error);
      return error;
    }
  },
  completeCreateWorkerFlow: async (workflowId: string) => {
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/endpoints/add-worker`,
        {
          step_number: 4,
          trigger_workflow: true,
          workflow_id: workflowId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating model:", error);
      return error;
    }
  },
  quantizationMethods: [],
  setQuantizationMethods: (methods: QuantizationMethod[]) => {
    set({ quantizationMethods: methods });
  },
  getQuantizationMethods: async () => {
    try {
      const response: any = await AppRequest.Get(
        `${tempApiBaseUrl}/models/quantization-methods`
      );
      set({ quantizationMethods: response.data.quantization_methods });
      return response.data;
    } catch (error) {
      console.error("Error creating model:", error);
      return error;
    }
  },
  createQuantizationWorkflow: async (
    model_name: string,
    type: string,
    hardware: string
  ) => {
    const modelId = useModels.getState().selectedModel?.id;
    if (!modelId) {
      errorToast("Please select a model");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/quantize-model-workflow`,
        {
          workflow_total_steps: 7,
          step_number: 1,
          trigger_workflow: false,
          model_id: modelId,
          quantized_model_name: model_name,
          target_type: type,
          target_device: hardware,
        }
      );
      get().getWorkflow(response.data.workflow_id);
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error quantizing model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateQuantizationMethod: async (method: string) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/quantize-model-workflow`,
        {
          step_number: 2,
          workflow_id: workflowId,
          trigger_workflow: false,
          method: method,
        }
      );
      get().getWorkflow();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateQuantizationAdvanced: async (
    weightConfig: QuantizeConfig,
    activationConfig: QuantizeConfig
  ) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/quantize-model-workflow`,
        {
          step_number: 3,
          workflow_id: workflowId,
          trigger_workflow: false,
          weight_config: weightConfig,
          activation_config: activationConfig,
        }
      );
      get().getWorkflow();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  updateQuantizationCluster: async (clusterId: string) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();

    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/quantize-model-workflow`,
        {
          step_number: 5,
          workflow_id: workflowId,
          trigger_workflow: true,
          cluster_id: clusterId,
        }
      );
      get().getWorkflow();
      return response;
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      get().endRequest();
    }
  },
  cancelQuantizationDeployment: async (id: string) => {
    try {
      if (!id) {
        return true;
      }
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/models/cancel-quantization`,
        {
          workflow_id: id,
        }
      );
      return response.data;
    } catch (error) {
      errorToast("Failed to cancel quantization deployment");
      return error;
    }
  },
  createAddAdapterWorkflow: async (
    endpointId: string,
    adapterModelId: string
  ) => {
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/endpoints/add-adapter`,
        {
          workflow_total_steps: 4,
          step_number: 1,
          trigger_workflow: false,
          adapter_model_id: adapterModelId,
          endpoint_id: endpointId,
        }
      );
      get().getWorkflow(response.data.workflow_id);
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating add adapter workflow:", error);
    } finally {
      get().endRequest();
    }
  },
  updateAdapterDetailWorkflow: async (adapterName: string) => {
    const workflowId = get().currentWorkflow?.workflow_id;
    if (!workflowId) {
      errorToast("Please create a workflow");
      return;
    }
    get().startRequest();
    try {
      const response: any = await AppRequest.Post(
        `${tempApiBaseUrl}/endpoints/add-adapter`,
        {
          step_number: 2,
          workflow_id: workflowId,
          trigger_workflow: true,
          adapter_name: adapterName,
        }
      );
      get().getWorkflow(response.data.workflow_id);
      // successToast(response.data.message);
      return response;
    } catch (error) {
      console.error("Error creating add adapter workflow:", error);
    } finally {
      get().endRequest();
    }
  },
}));
