import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import DeployModelSpecificationInfo from "@/components/ui/bud/deploymentDrawer/DeployModelSpecificationInfo";
import router, { useRouter } from "next/router";
import BudStepAlert from "../components/BudStepAlert";
import { useDrawer } from "src/hooks/useDrawer";
import { useProjects } from "src/hooks/useProjects";
import { useDeployModel } from "src/stores/useDeployModel";
import { useEndPoints } from "src/hooks/useEndPoint";
import { useEffect } from "react";


export const AdapterResult = () => {

  const router = useRouter();
  const { selectedProject, getProject } = useProjects();
  const { openDrawer, closeDrawer } = useDrawer();
  const { adapterWorkflow, currentWorkflow, setAdapterWorkflow } = useDeployModel();
  const { getAdapters } = useEndPoints();

  useEffect(()=> {
    if(!currentWorkflow){
        return
    }
    setAdapterWorkflow({
        adapterModelId: currentWorkflow.workflow_steps.adapter_config?.adapter_model_id,
        adapterName: currentWorkflow.workflow_steps.adapter_config?.adapter_name,
        endpointId: currentWorkflow.workflow_steps.adapter_config?.endpoint_id,
        adapterId: currentWorkflow.workflow_steps.adapter_config?.adapter_id
    })
}, [currentWorkflow])

    return <BudForm
    data={{}}
    nextText="View Deployment"
    onNext={() => {
      // getData();
      getAdapters(adapterWorkflow?.endpointId, 1, 20);
      router.push(`/projects/${selectedProject?.id}/deployments/${adapterWorkflow?.endpointId}`);
      closeDrawer();
    }}
  >

    <BudWraperBox>
      <BudDrawerLayout>
        <BudStepAlert
          type="success"
          title="Adapter deployment successful"
          description={`${adapterWorkflow?.adapterName} has been successfully deployed. You can starting using the deployed adapater for your deployment.`}
        />
      </BudDrawerLayout>

    </BudWraperBox>
  </BudForm>
}