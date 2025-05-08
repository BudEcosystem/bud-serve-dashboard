
import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import React, { } from "react";
import { useDrawer } from "src/hooks/useDrawer";
import { useDeployModel } from "src/stores/useDeployModel";
import CommonStatus from "../components/CommonStatus";
import { successToast } from "@/components/toast";
import BudStepAlert from "../components/BudStepAlert";

export default function EndpointDeleteStatus() {
    const { currentWorkflow } = useDeployModel();
    const { closeDrawer } = useDrawer();
    const [showAlert, setShowAlert] = React.useState(false);
    const [isFailed, setIsFailed] = React.useState(false);

    return (
        <BudForm
            data={{}}
            onBack={() => {
                if (isFailed) {
                    closeDrawer();
                } else {
                    setShowAlert(true);
                }
            }}
            backText={isFailed ? "Close" : "Cancel"}
        >
            <BudWraperBox>
                {showAlert && <BudDrawerLayout>
                    <BudStepAlert
                        type="warining"
                        title="You're about to cancel the endpoint deletion"
                        description="Please note that if you cancel now, you will have to start the process again."
                        cancelText="Continue Deleting"
                        confirmText="Cancel Anyways"
                        confirmAction={() => {
                            // TODO: Add cancel action
                            closeDrawer()
                        }}
                        cancelAction={() => {
                            setShowAlert(false)
                        }}
                    />
                </BudDrawerLayout>}
                <CommonStatus
                    workflowId={currentWorkflow?.workflow_id}
                    events_field_id="delete_endpoint_events"
                    onCompleted={() => {
                        closeDrawer();
                        successToast("Cluster deleted successfully");
                    }}
                    onFailed={() => {
                        setIsFailed(true);
                    }}
                    success_payload_type="endpoint_deletion"
                    title={"Deleting Deployment"}
                    description="We are deleting the deployment from the repository."
                />
            </BudWraperBox>
        </BudForm>
    );
}
