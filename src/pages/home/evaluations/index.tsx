"use client";
import { useState } from "react";
import React from "react";
import DashBoardLayout from "../layout";
import { Dropdown, Tabs, Image } from "antd";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
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
        <div className="mt-[3.34rem] mx-auto projectDetailsDiv ">
          <div className="flex justify-center h-[3rem] w-[3rem] m-auto">
            <Image
              preview={false}
              className=""
              style={{ width: "auto", height: "3rem" }}
              src="/budicon.png"
              alt="Logo"
            />
          </div>
          <div className="flex items-center gap-4 pt-[2rem]">
            <SearchHeaderInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Type in anything you would like to evaluate: finance, healthcare, hindi, problem solving et"
              expanded={true}
              classNames="flex-1 border-[.5px] border-[#757575]"
            />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-6 text-[#757575] text-sm">
                <span>0/450</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-3 mt-4">
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
                className="px-3 py-1.5 bg-[#1F1F1F] text-[#B3B3B3] text-xs rounded-full hover:bg-[#2A2A2A] hover:text-white transition-colors"
              >
                {filter}
              </button>
            ))}
            <ChevronDownIcon className="w-4 h-4 text-[#757575]" />
          </div>
        </div>

        {/* Evaluation Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-[#161616] border border-[#1F1F1F] rounded-lg p-6 hover:shadow-[1px_1px_6px_-1px_#2e3036] transition-all cursor-pointer"
              onClick={() => router.push(`/home/evaluations/${evaluation.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <Text_14_600_EEEEEE className="text-[16px]">
                  {evaluation.title}
                </Text_14_600_EEEEEE>
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
              <div className="flex flex-wrap gap-2 mb-4">
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
              <Text_13_400_B3B3B3 className="line-clamp-2 mb-4">
                {evaluation.description}
              </Text_13_400_B3B3B3>

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

        {/* Empty State */}
        {filteredEvaluations.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-20 h-20 bg-[#1F1F1F] rounded-full flex items-center justify-center mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8V16M16 20V20.01"
                  stroke="#757575"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="#757575"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <Text_14_400_EEEEEE className="mb-2">
              No evaluations found
            </Text_14_400_EEEEEE>
            <Text_13_400_B3B3B3>
              Try adjusting your search or filters
            </Text_13_400_B3B3B3>
          </div>
        )}
      </div>
    </DashBoardLayout>
  );
};

export default Evaluations;
