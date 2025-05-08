
import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudFormContext } from "@/components/ui/bud/context/BudFormContext";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import DeploymentSpecificationConfig from "@/components/ui/bud/deploymentDrawer/DeploymentSpecificationConfig";
import DeployModelSpecificationInfo from "@/components/ui/bud/deploymentDrawer/DeployModelSpecificationInfo";
import React, { useContext } from "react";
import { useDrawer } from "src/hooks/useDrawer";
import { useDeployModel } from "src/stores/useDeployModel";

export default function DeployModelSpecification() {
  const { selectedTemplate } = useDeployModel()
  const { deploymentSpecifcation, updateDeploymentSpecification, currentWorkflow } = useDeployModel()
  const { openDrawer, openDrawerWithStep, closeDrawer } = useDrawer();
  const {form} = useContext(BudFormContext);

  return (
    <BudForm
      data={{
        deployment_name: deploymentSpecifcation.deployment_name || selectedTemplate?.name,
        concurrent_requests: deploymentSpecifcation.concurrent_requests || 0,
        avg_context_length: deploymentSpecifcation.avg_context_length,
        avg_sequence_length: deploymentSpecifcation.avg_sequence_length,
        per_session_tokens_per_sec: deploymentSpecifcation.per_session_tokens_per_sec,
        ttft: deploymentSpecifcation.ttft,
        e2e_latency: deploymentSpecifcation.e2e_latency,
      }}
      disableNext={!deploymentSpecifcation.deployment_name || !deploymentSpecifcation.concurrent_requests || !deploymentSpecifcation.avg_sequence_length }
      onNext={async (values) => {
        form.submit();
        if (currentWorkflow) {
          const result = await updateDeploymentSpecification();
          if (result) {
            openDrawerWithStep("deploy-cluster-status");
          }
          return;
        }
        openDrawer("deploy-model");
      }}
      onBack={() => {
        openDrawerWithStep("deploy-model-template");
      }}
      backText="Back"
      nextText="Next"
    >
      <BudWraperBox>
        <BudDrawerLayout>
          <DeployModelSpecificationInfo
            showDeployInfo={false}
          />
        </BudDrawerLayout>
        <BudDrawerLayout>
          <DeploymentSpecificationConfig />
        </BudDrawerLayout>
      </BudWraperBox>
    </BudForm>
  );
}
