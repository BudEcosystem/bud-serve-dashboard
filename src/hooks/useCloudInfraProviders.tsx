// dashboard/src/hooks/useCloudInfraProviders.tsx
import { tempApiBaseUrl } from "@/components/environment";
import { AppRequest } from "src/pages/api/requests";
import { create } from "zustand";

/**
 * Represents a cloud infrastructure provider
 */
export type CloudInfraProvider = {
  /** Unique identifier for the provider */
  id: string;
  /** Display name of the provider */
  name: string;
  /** Description of the provider services */
  description: string;
  /** URL to the provider's logo image */
  logo_url: string;
  /** JSON schema definition for the provider configuration */
  schema_definition: string;
  /** Whether the provider is currently enabled */
  is_enabled: boolean;
  /** Alternative unique identifier */
  unique_id: string;
  /** Creation timestamp */
  created_at: string;
  /** Last modification timestamp */
  modified_at: string;
};

export type CloudCredentials = {
  /** Unique identifier for the credentials */
  id: string;
  /** ID of the cloud provider these credentials are for */
  provider_id: string;
  /** Name of the cloud provider */
  provider_name: string;
  /** When the credentials were created */
  created_at: string;
  /** Summary of the credential details with sensitive information masked */
  credential_summary: Record<string, string>;
  /** The credential name */
  credential_name: string;
};

export type CloudCredentialFilter = {
  providerId?: string | null;
};

/**
 * State for cloud infrastructure providers
 */
export type CloudInfraProvidersState = {
  /** List of available cloud providers */
  providers: CloudInfraProvider[];
  /** List of saved credentials for each provider **/
  credentials: CloudCredentials[];
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to fetch providers from the API */
  getProviders: () => Promise<void>;
  /** Get Saved Credentials for user */
  getCloudCredentials: (filter?: CloudCredentialFilter) => Promise<void>;
  /** Refresh both providers and credentials data */
  refreshCloudCredentials: (filter?: CloudCredentialFilter) => Promise<void>;
  /** Region By Provider **/
  getRegionByProviderID: (providerID: string) => Promise<any>;
};

/**
 * Zustand store for managing cloud infrastructure providers
 */
export const useCloudInfraProviders = create<CloudInfraProvidersState>(
  (set) => ({
    getRegionByProviderID: async (providerID: string) => {
      try {
        set({ isLoading: true });
        const response: any = await AppRequest.Get(
          `${tempApiBaseUrl}/credentials/cloud-providers/${providerID}/regions`,
        );
        set({ isLoading: false });
        return response.data.regions;
      } catch (error) {
        set({ isLoading: false });
        console.error("error", error);
        return error;
      }
    },
    providers: [],
    credentials: [],
    isLoading: false,
    error: null,
    getProviders: async () => {
      try {
        set({ isLoading: true });
        const response = await AppRequest.Get(
          `${tempApiBaseUrl}/credentials/cloud-providers`,
        );
        set({ providers: response.data.providers, isLoading: false });
      } catch (error) {
        console.error(error);
        set({ error: error.message, isLoading: false });
      }
    },
    getCloudCredentials: async (filter?: CloudCredentialFilter) => {
      try {
        set({ isLoading: true });
        let url = `${tempApiBaseUrl}/credentials/cloud-providers/credentials`;
        if (filter) {
          const params = new URLSearchParams();
          if (filter.providerId) {
            params.append("provider_id", filter.providerId);
          }
          const queryString = params.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
        }
        const response = await AppRequest.Get(url);
        set({ credentials: response.data.credentials, isLoading: false });
      } catch (error) {
        console.error(error);
        set({ error: error.message, isLoading: false });
      }
    },
    refreshCloudCredentials: async (filter?: CloudCredentialFilter) => {
      try {
        set({ isLoading: true, error: null });
        // Fetch both providers and credentials in parallel
        await Promise.all([
          AppRequest.Get(`${tempApiBaseUrl}/credentials/cloud-providers`).then(
            (response) => {
              set((state) => ({
                ...state,
                providers: response.data.providers,
              }));
            },
          ),
          (async () => {
            let url = `${tempApiBaseUrl}/credentials/cloud-providers/credentials`;
            if (filter) {
              const params = new URLSearchParams();
              if (filter.providerId) {
                params.append("provider_id", filter.providerId);
              }
              const queryString = params.toString();
              if (queryString) {
                url += `?${queryString}`;
              }
            }
            const response = await AppRequest.Get(url);
            set((state) => ({
              ...state,
              credentials: response.data.credentials,
            }));
          })(),
        ]);
        set({ isLoading: false });
      } catch (error) {
        console.error(error);
        set({ error: error.message, isLoading: false });
      }
    },
  }),
);
