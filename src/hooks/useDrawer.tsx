import { errorToast } from "@/components/toast";
import { FormProgressStatus, FormProgressType } from "@/components/ui/bud/progress/FormProgress";
import { StepComponentsType } from "src/flows";
import { create } from "zustand";
import drawerFlows, { Flow } from "./drawerFlows";

export type DrawerStepParsedType = {
  id: string;
  step: number;
  navigation: string[];
  component: React.FC;
  progress: FormProgressType[];
  properties?: any;
  confirmClose: boolean;
  status: FormProgressStatus;
};

export const useDrawer = create<{
  minmizedProcessList: {
    step: DrawerStepParsedType;
    flow: Flow;
  }[];
  showMinimizedItem: boolean;
  minimizeProcess: (step: DrawerStepParsedType) => void;
  maxmizedProcess: (step: DrawerStepParsedType) => void;
  isDrawerOpen: boolean;
  openDrawer: (newFlow: Flow, props?: any) => void;
  openDrawerWithStep: (step: string, props?: any) => void;
  openDrawerWithExpandedStep: (step: string, props?: any) => void;
  closeDrawer: () => void;
  currentFlow: Flow | null;
  setCurrentFlow: (flow: Flow) => void;
  step: DrawerStepParsedType;
  expandedStep: DrawerStepParsedType;
  previousStep?: StepComponentsType;
  setPreviousStep: (step: StepComponentsType) => void;
  cancelAlert: boolean;
  setCancelAlert: (value: boolean) => void;
  timeout?: NodeJS.Timeout;
  closeExpandedStep: () => void;
  isFailed: boolean;
  setFailed: (value: boolean) => void;
  drawerProps?: any;
  expandedDrawerProps?: any;
}>((set, get) => ({
  isFailed: false,
  setFailed: (value: boolean) => {
    set({ isFailed: value });
  },
  showMinimizedItem: false,
  minmizedProcessList: [],
  timeout: null,
  closeExpandedStep: () => {
    set({ expandedStep: null });
  },
  minimizeProcess: (step: DrawerStepParsedType) => {
    get().timeout && clearTimeout(get().timeout);
    get().closeDrawer();
    set((state) => {
      return {
        // 1 item in the list
        minmizedProcessList: [{
          step: step,
          flow: get().currentFlow,
        }],
        showMinimizedItem: true,
        cancelAlert: false,
        // Hide the minimized item after 5 seconds
        timeout: setTimeout(() => {
          set((state) => {
            return {
              showMinimizedItem: false,
            };
          });
        }, 3000),
      };
    }
    );

  },
  maxmizedProcess: (step: DrawerStepParsedType) => {
    set((state) => {
      return {
        minmizedProcessList: state.minmizedProcessList.filter((s) => s.step.id !== step.id),
        showMinimizedItem: false,
      };
    });
  },
  previousStep: null,
  expandedStep: null,
  setPreviousStep: (step: StepComponentsType) => {
    set({ previousStep: step });
  },
  isDrawerOpen: false,
  openDrawer: (newFlow: Flow, props: any) => {
    const foundStep = drawerFlows[newFlow].steps[0];
    set({
      isDrawerOpen: true,
      currentFlow: newFlow,
      cancelAlert: false,
      step: {
        ...foundStep,
        navigation: foundStep.navigation(),
        status: FormProgressStatus.inProgress,
      },
      expandedStep: null,
      isFailed: false,
      drawerProps: props,
      expandedDrawerProps: null,
    });
  },
  openDrawerWithExpandedStep: (step: StepComponentsType, props: any) => {
    const foundFlow = Object.keys(drawerFlows).find((flow) => {
      return drawerFlows[flow as Flow].steps.find((s) => s.id === step);
    }) as Flow;
    if (!foundFlow) {
      errorToast(`Flow not found for step ${step}`);
      return;
    }

    const foundFlowSteps = drawerFlows[foundFlow].steps;
    const foundStepIndex = foundFlowSteps.find((s) => s.id === step).step;
    const foundStep = foundFlowSteps.find((s) => s.id === step)

    if (!foundStepIndex) {
      errorToast("Step not found");
      return;
    }
    console.groupEnd();
    set({
      expandedStep: {
        ...foundStep,
        navigation: foundStep.navigation(),
        status: FormProgressStatus.inProgress,
      },
      expandedDrawerProps: props,
    });
  },
  openDrawerWithStep: (step: StepComponentsType, props: any) => {
    const foundFlow = Object.keys(drawerFlows).find((flow) => {
      return drawerFlows[flow as Flow].steps.find((s) => s.id === step);
    }) as Flow;
    if (!foundFlow) {
      errorToast(`Flow not found for step ${step}`);
      return;
    }

    const foundFlowSteps = drawerFlows[foundFlow].steps;
    const foundStepIndex = foundFlowSteps.find((s) => s.id === step).step;
    const foundStep = foundFlowSteps.find((s) => s.id === step)



    if (!foundStepIndex) {
      errorToast("Step not found");
      return;
    }
    console.groupEnd();
    set({
      isDrawerOpen: true,
      currentFlow: foundFlow,
      cancelAlert: false,
      step: {
        ...foundStep,
        navigation: foundStep.navigation(),
        status: FormProgressStatus.inProgress,
      },
      minmizedProcessList: [],
      expandedStep: null,
      isFailed: false,
      drawerProps: props,
      expandedDrawerProps: null,
    });
  },
  closeDrawer: () => {
    set({ isDrawerOpen: false, currentFlow: null, step: null, previousStep: null, expandedStep: null, isFailed: false, drawerProps: null, expandedDrawerProps: null });
  },
  currentFlow: "run-model-evaluations",
  // currentFlow: "view-model",
  // currentFlow: "deploy-model",
  setCurrentFlow: (flow: Flow) => {
    set({ currentFlow: flow });
  },
  // get current flow
  step: null,
  progress: [],
  cancelAlert: false,
  setCancelAlert: (value: boolean) => {
    set({ cancelAlert: value });
  },
}));
