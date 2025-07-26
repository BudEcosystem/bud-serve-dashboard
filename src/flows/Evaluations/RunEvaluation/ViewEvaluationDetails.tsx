import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import { Text_10_400_FFFFFF, Text_12_400_757575, Text_12_400_B3B3B3, Text_12_400_EEEEEE, Text_12_400_FFFFFF, Text_12_600_EEEEEE, Text_14_400_757575, Text_14_400_EEEEEE, Text_8_300_FFFFFF } from "@/components/ui/text";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { useDrawer } from "src/hooks/useDrawer";
import { ConfigProvider, Image } from "antd"; // Added Checkbox import
import Tags, { DropDownContent } from "src/flows/components/DrawerTags";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Model, useModels } from "src/hooks/useModels";
import { assetBaseUrl } from "@/components/environment";
import { successToast } from "@/components/toast";
import { BudFormContext } from "@/components/ui/bud/context/BudFormContext";
import { useDeployModel } from "src/stores/useDeployModel";
import { PermissionEnum, useUser } from "src/stores/useUser";
import { useMemo } from 'react';
import ModelTags from "src/flows/components/ModelTags";
import { PrimaryButton } from "@/components/ui/bud/form/Buttons";
import { SpecificationTableItem } from "src/flows/components/SpecificationTableItem";
import { getSpecValueWidthOddEven } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { BranchType } from "src/flows/ViewModel/Advanced/Advanced";
import DrawerCard from "@/components/ui/bud/card/DrawerCard";




export default function ViewEvaluationDetails() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasPermission } = useUser();
  const { isExpandedViewOpen } = useContext(BudFormContext);
  const { openDrawerWithStep, openDrawer, openDrawerWithExpandedStep } =
    useDrawer();
  const { reset } = useDeployModel();

  const handleScrollToContainer = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const data: Model = {
    id: "model-1",
    name: "GPT-4o",
    author: "OpenAI",
    limitations: [
      "InternLM 2.5 offers strong reasoning across the board as well as tool",
      "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      "InternLM",
    ],
    strengths: [
      "InternLM 2.5 offers strong reasoning across the board as well as tool",
      "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      "InternLM",
    ],
    provider: {
      id: "provider-1",
      name: "OpenAI",
      icon: "/images/providers/openai.png",
      description: "OpenAI Provider",
      type: "cloud",
    },
    provider_type: "cloud_model",
    modality: {
      text: { input: true, output: true, label: "Text" },
      image: { input: true, output: false, label: "Image" },
      audio: { input: false, output: false, label: "Audio" }
    },
    supported_endpoints: {
      chat: { path: "/v1/chat/completions", enabled: true, label: "Chat" },
      completion: { path: "/v1/completions", enabled: true, label: "Completion" },
      image_generation: { path: "/v1/images/generations", enabled: false, label: "Image Generation" },
      audio_transcription: { path: "/v1/audio/transcriptions", enabled: false, label: "Audio Transcription" },
      audio_speech: { path: "/v1/audio/speech", enabled: false, label: "Audio Speech" },
      embedding: { path: "/v1/embeddings", enabled: true, label: "Embedding" },
      batch: { path: "/v1/batches", enabled: true, label: "Batch" },
      response: { path: "/v1/response", enabled: false, label: "Response" },
      rerank: { path: "/v1/rerank", enabled: false, label: "Rerank" },
      moderation: { path: "/v1/moderations", enabled: true, label: "Moderation" }
    },
    source: "OpenAI",
    uri: "openai/gpt-4o",
    model_size: 1000000000000, // 1T parameters
    tasks: [
      { name: "Chat Completion", color: "#4CAF50" },
      { name: "Text Generation", color: "#2196F3" },
      { name: "Code Generation", color: "#FF9800" }
    ],
    description: "GPT-4o is OpenAI's most advanced multimodal model",
    icon: "🤖",
    tags: [
      { name: "multimodal", color: "#9C27B0" },
    ],
    languages: ["en"],
    use_cases: [],
    family: "GPT",
    kv_cache_size: 0,
    bud_verified: true,
    scan_verified: false,
    eval_verified: false,
    created_at: new Date().toISOString()
  };

  const specs = [
    {
      icon: "/images/drawer/tag.png",
      name: "Device Name",
      value: data?.minimum_requirements?.device_name,
      type: "text",
    },
    {
      icon: "/images/drawer/tag.png",
      name: "Memory",
      value: data?.minimum_requirements?.memory,
      type: "text",
    },
    {
      icon: "/images/drawer/tag.png",
      name: "Number of Cores",
      value: data?.minimum_requirements?.core,
      type: "text",
    },
    {
      icon: "/images/drawer/tag.png",
      name: "RAM",
      value: data?.minimum_requirements?.RAM,
      type: "text",
    },
  ]?.filter((item) => item.value);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  const toggleDescription = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsOverflowing(element.scrollHeight > 50);
    }
  }, [data?.description]);

  const onDerivedCardClick = (branch: BranchType) => {
    openDrawerWithExpandedStep("derived-model-list", {
      selectedBranch: branch,
      model: data,
    });
  };

  const SpecificationItem: React.FC<{
    name: string;
    data: React.ReactNode;
  }> = ({ name, data }) => {
    return (
      <div
        className={`flex items-center justify gap-[.4rem]`}
        style={{
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <div className={`flex justify-start items-center ${"min-w-[32%]"}`}>
          <div className="h-[.75rem] flex justify-start items-start">
            <div className="!mr-[.4rem] w-[0.75rem] flex justify-start items-start">
              <Image
                preview={false}
                src="/images/drawer/tag.png"
                alt="info"
                style={{ height: ".75rem" }}
              />
            </div>
          </div>
          <Text_12_400_B3B3B3 className="ml-[.1rem] mr-[.4rem] text-nowrap">
            {name}
          </Text_12_400_B3B3B3>
        </div>
        <div
          className={`flex flex-row gap-[.4rem] max-w-full max-w-[50%]} text-left min-h-[1.5rem]`}
        >
          {data}
        </div>
      </div>
    );
  };

  return (
    <BudForm
      data={{}}
      // disableNext={!selectedModel?.id}
      // onNext={async () => {
      //   openDrawerWithStep("Benchmark-Configuration");
      // }}
      onBack={async () => {
        openDrawerWithStep("select-traits");
      }
      }
      backText="Back"
      onNext={() => {
        openDrawerWithStep("evaluation-summary");
      }}
      nextText="Next"
    >

      <BudWraperBox>
        <BudDrawerLayout>
          <DrawerCard>
            <div className="pt-[.25rem]">
              <div>
                <Text_14_400_EEEEEE className="mb-[0.65rem] leading-[140%]">
                  {data?.name}
                </Text_14_400_EEEEEE>
                <ModelTags model={data} maxTags={3} />
                <div className="mt-[1.5rem]">
                  <ModelTags model={data} maxTags={3} />
                </div>
              </div>
              <div className="">
                {data?.description ? (
                  <>
                    <div className="pt-[1.3rem]">
                      <div
                        ref={descriptionRef}
                        className={`leading-[1.05rem] tracking-[.01em max-w-[100%] ${isExpanded ? "" : "line-clamp-2"
                          } overflow-hidden`}
                        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
                      >
                        <Text_12_400_757575 className="leading-[180%]">
                          {data?.description}
                        </Text_12_400_757575>
                      </div>
                      {isOverflowing && (
                        <div className="flex justify-end">
                          <Text_12_600_EEEEEE
                            className="cursor-pointer leading-[1.05rem] tracking-[.01em] mt-[.3rem]"
                            onClick={toggleDescription}
                          >
                            {isExpanded ? "See less" : "See more"}
                          </Text_12_600_EEEEEE>
                        </div>
                      )}
                    </div>
                    <div className="hR mt-[1.1rem]"></div>
                  </>
                ) : (
                  hasPermission(PermissionEnum.ModelManage) && (
                    <>
                      <div className="flex justify-between items-center pt-[1.3rem]">
                        <div>
                          <Text_14_400_EEEEEE>Description</Text_14_400_EEEEEE>
                          <Text_12_400_757575 className="pt-[.45rem]">
                            Description not available
                          </Text_12_400_757575>
                        </div>
                      </div>
                      <div className="hR mt-[1.5rem]"></div>
                    </>
                  )
                )}
                {data?.strengths?.length > 0 && (
                  <>
                    <div className="pt-[1.5rem] mb-[1.4rem]">
                      <div>
                        <Text_14_400_EEEEEE>Advantages</Text_14_400_EEEEEE>
                        <Text_12_400_757575 className="pt-[.45rem]">
                          Following is the list of advantages of the evaluation
                        </Text_12_400_757575>
                      </div>
                      <ul className="custom-bullet-list mt-[.9rem]">
                        {data?.strengths?.map((item, index) => (
                          <li key={index}>
                            <Text_12_400_EEEEEE className="leading-[1.3rem] indent-0 pl-[.5rem]">
                              {item}
                            </Text_12_400_EEEEEE>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="hR"></div>
                  </>
                )}
                {data?.limitations?.length > 0 && (
                  <>
                    <div className="pt-[1.5rem] mb-[1.4rem]">
                      <div>
                        <Text_14_400_EEEEEE>Disadvantages</Text_14_400_EEEEEE>
                        <Text_12_400_757575 className="pt-[.45rem]">
                          Following is the list of disadvantages of the evaluation
                        </Text_12_400_757575>
                      </div>
                      <ul className="custom-bullet-list mt-[.9rem]">
                        {data?.limitations?.map((item, index) => (
                          <li key={index}>
                            <Text_12_400_EEEEEE className="leading-[1.3rem] indent-0 pl-[.5rem]">
                              {item}
                            </Text_12_400_EEEEEE>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="hR"></div>
                  </>
                )}

                
                {specs.length > 0 && (
                  <div className="mt-[1.4rem] mb-[1.4rem]">
                    <Text_14_400_EEEEEE>
                      Minimum Hardware Specification
                    </Text_14_400_EEEEEE>
                    <Text_12_400_757575 className="pt-[.45rem]">
                      Here you can see the minimum hardware you require for optimal
                      performance
                    </Text_12_400_757575>
                    <div className="pt-[.8rem] flex justify-between items-center flex-wrap gap-y-[1.5rem]">
                      {specs.map((item, index) => (
                        <SpecificationTableItem
                          key={index}
                          item={item}
                          valueWidth={getSpecValueWidthOddEven(specs, index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="hR"></div>

    

                {data?.examples?.length > 0 && (
                  <>
                    <div className="hR"></div>
                    <div className="mt-[1.4rem] mb-[1.4rem]">
                      <Text_14_400_EEEEEE>Examples</Text_14_400_EEEEEE>
                      <Text_12_400_757575 className="pt-[.9rem]">
                        These could input output text or Images, Audio or video. This
                        section is only shown if its available.
                      </Text_12_400_757575>
                      {data?.examples?.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-[8px] mt-[.7rem] px-[.9rem] py-[1.1rem] bg-[#FFFFFF08]"
                        >
                          <div>
                            <Text_12_400_EEEEEE>Prompt</Text_12_400_EEEEEE>
                            {item.prompt_type == "string" && (
                              <div className="flex justify-between items-center px-[.9rem] py-[.7rem] border border-[#757575] rounded-[8px] mt-[.4rem]">
                                <Text_12_400_B3B3B3 className="leading-[1.05rem]">
                                  {item?.prompt}
                                </Text_12_400_B3B3B3>
                              </div>
                            )}
                          </div>
                          <div className="mt-[1.7rem]">
                            <Text_12_400_EEEEEE>Output</Text_12_400_EEEEEE>
                            {item.response_type == "string" && (
                              <div className="flex justify-between items-center px-[.9rem] py-[.7rem] border border-[#757575] rounded-[8px] mt-[.4rem]">
                                <Text_12_400_B3B3B3 className="leading-[1.05rem]">
                                  {item?.response}
                                </Text_12_400_B3B3B3>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </DrawerCard>
        </BudDrawerLayout>
      </BudWraperBox>
    </BudForm>
  );
}
