"use client";
import { useState } from "react";
import React from "react";
import DashBoardLayout from "../layout";
import { Dropdown, Tabs, Image } from "antd";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Text_10_400_B3B3B3,
  Text_10_400_EEEEEE,
  Text_12_400_757575,
  Text_13_400_B3B3B3,
  Text_14_400_EEEEEE,
  Text_14_600_B3B3B3,
  Text_14_600_EEEEEE,
  Text_17_600_FFFFFF,
} from "../../../components/ui/text";
import { PrimaryButton } from "@/components/ui/bud/form/Buttons";
import { useRouter } from "next/router";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";

interface EvaluationCard {
  id: string;
  title: string;
  description: string;
  type: "Text" | "Image" | "Video" | "Actions";
  subTypes?: string[];
  timestamp: string;
}

const Evaluations = () => {
  const [activeTab, setActiveTab] = useState("1");
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Categories");

  // Mock data for evaluations
  const evaluations: EvaluationCard[] = [
    {
      id: "1",
      title: "MaritimeBench",
      description:
        "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      type: "Text",
      subTypes: ["Text", "Video"],
      timestamp: "2025-02-19",
    },
    {
      id: "2",
      title: "MM-AlignBench",
      description:
        "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      type: "Text",
      subTypes: ["Text", "Image", "Video", "Actions"],
      timestamp: "2025-02-19",
    },
    {
      id: "3",
      title: "MVBench",
      description:
        "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      type: "Image",
      subTypes: ["Image", "Actions"],
      timestamp: "2025-02-19",
    },
    {
      id: "4",
      title: "VBench",
      description:
        "InternLM 2.5 offers strong reasoning across the board as well as tool use for developers, while sitting at the sweet spot of size for those with 24GB GPUs.",
      type: "Text",
      subTypes: ["Text", "Image", "Video", "Actions", "Embeddings"],
      timestamp: "2025-02-19",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Text":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.625 3.5H11.375M7 3.5V10.5"
              stroke="#FFD700"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "Image":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="3"
              width="10"
              height="8"
              rx="1"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            <circle cx="4.5" cy="5.5" r="0.5" fill="#22C55E" />
            <path
              d="M2 8L5 6L8 8L12 5"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "Video":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="3"
              width="10"
              height="8"
              rx="1"
              stroke="#3B82F6"
              strokeWidth="1.5"
            />
            <path d="M6 5.5V8.5L8.5 7L6 5.5Z" fill="#3B82F6" />
          </svg>
        );
      case "Actions":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 2V12M2 7H12"
              stroke="#F97316"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Embeddings":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 7L4.5 4.5L7 7L9.5 4.5L12 7"
              stroke="#A855F7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      evaluation.description.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter =
      selectedFilter === "All Categories" ||
      evaluation.subTypes?.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashBoardLayout>
      <div
        className="boardPageView bg-cover bg-center bg-no-repeat overflow-x-hidden"
      // style={{ backgroundImage: `url('/images/evaluations/ui/bg.png')` }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-[3.5rem] border-b-[1px] border-[#2c2654 box-border">
          <div className="evalTab pt-[1.3rem] pb-[1rem] flex items-center justify-between">
            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={[
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/summary.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Summary</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "1",
                  children: <></>,
                },
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/leaderboard.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Leaderboard</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "2",
                  children: <></>,
                },
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/experiments.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Experiments</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "3",
                  children: <></>,
                },
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/evaluations.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Evaluations</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "4",
                  children: <></>,
                },
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/redTeam.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Red Team</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "5",
                  children: <></>,
                },
              ]}
            />
          </div>
          <PrimaryButton onClick={() => router.push("/home/evaluations/new")}>
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3V13M3 8H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              New experiment
            </span>
          </PrimaryButton>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-[3.34rem] mx-auto projectDetailsDiv px-[3.5rem]">
          <div className="flex justify-center h-[3rem] w-[3rem] m-auto">
            <Image
              preview={false}
              className=""
              style={{ width: "auto", height: "3rem" }}
              src="/budicon.png"
              alt="Logo"
            />
          </div>
          <div className="flex items-center gap-4 pt-[2rem] relative max-w-[70.4%] mx-auto">
            <SearchHeaderInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Type in anything you would like to evaluate: finance, healthcare, hindi, problem solving et"
              expanded={true}
              classNames="flex-1 border-[.5px] border-[#757575]"
            />
            <div className="flex items-center gap-6 text-[#757575] text-sm absolute right-[1rem]">
              <Text_10_400_B3B3B3>0/450</Text_10_400_B3B3B3>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-[.3rem] mt-[2.05rem] max-w-[90%] m-auto justify-between">
            <button
              className="flex items-center justify-center w-[1.125rem] h-[1.125rem] rounded-full border border-[#FFFFFF0D] backdrop-blur-[34.4px]"
              style={{ minWidth: 18, minHeight: 18 }}
              type="button"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M6.5 2L4 5L6.5 8"
                  stroke="#EEEEEE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex items-center gap-[.1rem] overflow-x-auto m-auto">
              {/* Round left button */}
              {[
                "Text",
                "Image",
                "Video",
                "Actions",
                "Audio",
                "Embeddings",
                "Omni",
                "Reasoning",
                "factuality",
                "Reasoning",
                "Dummy",
                "Reasoning",
                "factuality",
                "Reasoning",
                "Other",
              ].map((filter) => (
                <button
                  key={filter}
                  className="px-[.6rem] py-[.3rem] rounded-[0.25rem] hover:bg-[#1F1F1F] bg-[#1F1F1F] transition-colors"
                >
                  <Text_10_400_EEEEEE>{filter}</Text_10_400_EEEEEE>
                </button>
              ))}
            </div>
            <button
              className="flex items-center justify-center w-[1.125rem] h-[1.125rem] rounded-full border border-[#FFFFFF0D] backdrop-blur-[34.4px]"
              style={{ minWidth: 18, minHeight: 18 }}
              type="button"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M3.5 2L6 5L3.5 8"
                stroke="#EEEEEE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              </svg>
            </button>
          </div>
        </div>

        {/* Evaluation Cards Grid */}
        <div className="mt-[2.8rem] flex flex-wrap justify-between gap-1 w-full px-[3.5rem]">
          {filteredEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className=" w-[48.5%] bg-[#161616] border border-[#1F1F1F] rounded-lg p-6 hover:shadow-[1px_1px_6px_-1px_#2e3036] transition-all cursor-pointer"
              onClick={() => router.push(`/home/evaluations/${evaluation.id}`)}
            >
              <div className=" flex justify-between items-start mb-4">
                <Text_14_400_EEEEEE className="text-[16px]">
                  {evaluation.title}
                </Text_14_400_EEEEEE>
                <div className="flex items-center gap-3">
                  <button className="p-1.5 hover:bg-[#1F1F1F] rounded transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3V5M8 11V13M3 8H5M11 8H13"
                        stroke="#757575"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-[#1F1F1F] rounded transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 8L8 10L10 6"
                        stroke="#757575"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Type Tags */}
              <div className=" flex flex-wrap gap-2 mb-4">
                {evaluation.subTypes?.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1F1F1F] rounded-md"
                  >
                    {getTypeIcon(type)}
                    <Text_12_400_757575>{type}</Text_12_400_757575>
                  </div>
                ))}
              </div>

              {/* Description */}
              <Text_10_400_EEEEEE className=" line-clamp-2 mb-4 leading-[140%]">
                {evaluation.description}
              </Text_10_400_EEEEEE>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[#757575] text-xs">
                  <div className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 3.5V7L9 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="7"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span>{evaluation.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Evaluations;
