import React, { useState } from "react";
import DrawerTitleCard from "@/components/ui/bud/card/DrawerTitleCard";
import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import BudSwitch from "@/components/ui/bud/dataEntry/BudSwitch";
import TextInput from "../components/TextInput";
import TextAreaInput from "@/components/ui/bud/dataEntry/TextArea";
import { Text_12_400_EEEEEE, Text_14_600_EEEEEE } from "@/components/ui/text";
import { Image } from "antd";
import { useDrawer } from "src/hooks/useDrawer";
import { useDeployModel } from "src/stores/useDeployModel";
import DrawerCard from "@/components/ui/bud/card/DrawerCard";

export default function DeployModelConfiguration() {
  const { 
    modelConfiguration, 
    setModelConfiguration,
    updateModelConfiguration 
  } = useDeployModel();
  
  const { openDrawerWithStep } = useDrawer();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Initialize state from store or with defaults
  const [enableToolParser, setEnableToolParser] = useState(
    modelConfiguration?.enableToolParser || false
  );
  const [enableReasoningParser, setEnableReasoningParser] = useState(
    modelConfiguration?.enableReasoningParser || false
  );
  const [customToolParserEnabled, setCustomToolParserEnabled] = useState(
    modelConfiguration?.customToolParser?.enabled || false
  );
  const [toolCallPattern, setToolCallPattern] = useState(
    modelConfiguration?.customToolParser?.toolCallPattern || "<tools>(.*?)</tools>"
  );
  const [functionPattern, setFunctionPattern] = useState(
    modelConfiguration?.customToolParser?.functionPattern || '\\{"name":\\s*"([^"]+)",\\s*"arguments":\\s*({.*?})\\}'
  );
  const [stripTokens, setStripTokens] = useState(
    modelConfiguration?.customToolParser?.stripTokens?.join(', ') || "<tools>, </tools>"
  );

  const handleFormSubmit = async (values: any) => {
    // Parse strip tokens from comma-separated string to array
    const stripTokensArray = stripTokens
      ? stripTokens.split(',').map((token: string) => token.trim()).filter((token: string) => token)
      : [];

    // Prepare configuration object
    const configuration = {
      enableToolParser: enableToolParser || false,
      enableReasoningParser: enableReasoningParser || false,
      customToolParser: {
        enabled: customToolParserEnabled || false,
        toolCallPattern: toolCallPattern || "",
        functionPattern: functionPattern || "",
        stripTokens: stripTokensArray
      }
    };

    // Update store
    setModelConfiguration(configuration);
    
    // Call API to update workflow
    const result = await updateModelConfiguration();
    if (result) {
      openDrawerWithStep("deploy-model-auto-scaling");
    }
  };

  // Parse tokens for preview
  const getTokensArray = () => {
    return stripTokens
      ? stripTokens.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      : [];
  };

  return (
    <BudForm
      data={{
        enableToolParser,
        enableReasoningParser,
        customToolParserEnabled,
        toolCallPattern,
        functionPattern,
        stripTokens
      }}
      disableNext={false}
      onNext={handleFormSubmit}
      onBack={() => {
        openDrawerWithStep("deploy-model-choose-cluster");
      }}
      backText="Back"
      nextText="Next"
    >
      <BudWraperBox>
        <BudDrawerLayout>
          <DrawerTitleCard
            title="Model Configuration"
            description="Configure parsing options for your model deployment"
          />
          
          <DrawerCard>
            {/* Tool Parser Configuration */}
            <BudSwitch
              name="enableToolParser"
              label="Tool Parser"
              infoText="Enable tool parsing capabilities for function calling"
              placeholder="Enable tool parser"
              defaultValue={enableToolParser}
              onChange={(value: boolean) => setEnableToolParser(value)}
            />

            {/* Reasoning Parser Configuration */}
            <BudSwitch
              name="enableReasoningParser"
              label="Reasoning Parser"
              infoText="Enable reasoning parser for enhanced model responses"
              placeholder="Enable reasoning parser"
              defaultValue={enableReasoningParser}
              onChange={(value: boolean) => setEnableReasoningParser(value)}
            />
          </DrawerCard>

          {/* Advanced Settings - Only show when Tool Parser is enabled */}
          {enableToolParser && (
            <DrawerCard>
              <div 
                className="flex items-center justify-between mb-4 cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div>
                  <Text_14_600_EEEEEE>Advanced Settings</Text_14_600_EEEEEE>
                  <Text_12_400_EEEEEE className="mt-1">
                    Configure custom tool parser patterns
                  </Text_12_400_EEEEEE>
                </div>
                <Image
                  src="/icons/customArrow.png"
                  preview={false}
                  alt="toggle"
                  style={{ 
                    width: '0.65rem', 
                    height: 'auto',
                    transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.5s ease'
                  }}
                />
              </div>

              {showAdvanced && (
                <>
                  {/* Enable Custom Parser */}
                  <BudSwitch
                    name="customToolParserEnabled"
                    label="Use custom tool parser configuration"
                    infoText="Override default tool parser settings with custom patterns"
                    placeholder="Enable custom configuration"
                    defaultValue={customToolParserEnabled}
                    onChange={(value: boolean) => setCustomToolParserEnabled(value)}
                  />

                  {/* Custom Parser Settings - Only show when custom parser is enabled */}
                  {customToolParserEnabled && (
                    <div className="space-y-4 mt-4">
                      {/* Tool Call Pattern */}
                      <TextInput
                        name="toolCallPattern"
                        label="Tool Call Pattern"
                        placeholder="<tools>(.*?)</tools>"
                        rules={[{ required: true, message: "Please enter tool call pattern" }]}
                        defaultValue={toolCallPattern}
                        value={toolCallPattern}
                        onChange={(value: string) => setToolCallPattern(value)}
                        infoText="Regular expression pattern to match tool calls"
                        ClassNames="font-mono text-sm"
                      />

                      {/* Function Pattern */}
                      <TextAreaInput
                        name="functionPattern"
                        label="Function Pattern"
                        placeholder='\\{"name":\\s*"([^"]+)",\\s*"arguments":\\s*({.*?})\\}'
                        rules={[{ required: true, message: "Please enter function pattern" }]}
                        defaultValue={functionPattern}
                        value={functionPattern}
                        onChange={(e: any) => setFunctionPattern(e.target.value)}
                        infoText="Regular expression pattern to parse function calls"
                        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                        rows={3}
                      />

                      {/* Strip Tokens */}
                      <TextInput
                        name="stripTokens"
                        label="Strip Tokens"
                        placeholder="<tools>, </tools>"
                        rules={[{ required: true, message: "Please enter strip tokens" }]}
                        defaultValue={stripTokens}
                        value={stripTokens}
                        onChange={(value: string) => setStripTokens(value)}
                        infoText="Comma-separated list of tokens to strip from output"
                        ClassNames="font-mono text-sm"
                      />

                      {/* Configuration Preview */}
                      <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <Text_12_400_EEEEEE className="font-medium mb-2">
                          Configuration Preview:
                        </Text_12_400_EEEEEE>
                        <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
{`--tool-parser-config '{
  "tool_call_pattern": "${toolCallPattern}",
  "function_pattern": "${functionPattern}",
  "strip_tokens": ${JSON.stringify(getTokensArray())}
}'`}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              )}
            </DrawerCard>
          )}
        </BudDrawerLayout>
      </BudWraperBox>
    </BudForm>
  );
}