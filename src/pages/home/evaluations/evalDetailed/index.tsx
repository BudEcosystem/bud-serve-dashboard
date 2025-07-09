"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import React from "react";
import DashBoardLayout from "../../layout";
import { Dropdown, Tabs, Image } from "antd";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Text_10_400_B3B3B3,
  Text_10_400_D1B854,
  Text_10_400_EEEEEE,
  Text_12_400_757575,
  Text_13_400_B3B3B3,
  Text_14_400_EEEEEE,
  Text_14_400_FFFFFF,
  Text_14_600_B3B3B3,
  Text_14_600_EEEEEE,
  Text_17_600_FFFFFF,
  Text_28_600_FFFFFF,
} from "../../../../components/ui/text";
import { PrimaryButton } from "@/components/ui/bud/form/Buttons";
import { useRouter } from "next/router";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";
import BackButton from "@/components/ui/bud/drawer/BackButton";
import { CustomBreadcrumb } from "@/components/ui/bud/card/DrawerBreadCrumbNavigation";
import { color } from "echarts";
import Tags from "src/flows/components/DrawerTags";
import EvalExplorerTable from "./evalExplorerTable";
import LeaderboardTable from "./leaderboardTable";

interface EvaluationCard {
  id: string;
  title: string;
  description: string;
  type: "Text" | "Image" | "Video" | "Actions";
  subTypes?: string[];
  timestamp: string;
}

const sampletags = [
  { name: 'text', color: '#D1B854' },
  { name: 'image', color: '#D1B854' },
  { name: 'video', color: '#D1B854' },
  { name: 'actions', color: '#D1B854' },
  { name: 'embeddings', color: '#D1B854' },
  { name: 'text', color: '#D1B854' },
  { name: 'text', color: '#D1B854' },
  { name: 'text', color: '#D1B854' },
  { name: 'text', color: '#D1B854' },
  { name: 'text', color: '#D1B854' },
]

const EvalDetailed = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("4");
  const [showAllTags, setShowAllTags] = useState(false);
  const router = useRouter();


  const goBack = () => {
    router.back();
  };

  const HeaderContent = () => {
    return (
      <div className="flex justify-between items-center">
        {isMounted && (
          <div className="flex justify-start items-center">
            <BackButton onClick={goBack} />
            <CustomBreadcrumb
              urls={["/evaluations", `name`]}
              data={["Evaluations", `name`]} />
          </div>
        )}
      </div>
    );
  };


  useEffect(() => {
    setIsMounted(true)
  }, []);

  return (
    <DashBoardLayout>
      <div
        // className=" h-full w-full"
      className="temp-bg h-full w-full flex flex-col"
      >
        <div className="border-b-[1px] border-b-[#2c2654] px-[1.15rem] py-[1.05rem] flex-shrink-0">
          <HeaderContent />
        </div>
        <div className="w-full px-[3.6rem] flex-1 overflow-y-auto">
          <div className="w-full pt-[1.8rem]">
            <div className="w-full flex justify-between items-center">
              <Text_28_600_FFFFFF>LiveMathBench</Text_28_600_FFFFFF>
              <PrimaryButton>Run Evaluation</PrimaryButton>
            </div>
            <Text_14_400_FFFFFF className="leading-[140%] mt-[.5rem] max-w-[80%]">LiveMathBench can capture LLM capabilities in complex reasoning tasks, including challenging latest question sets from various mathematical competitions.</Text_14_400_FFFFFF>
            <div className="flex flex-wrap justify-start items-center gap-[.3rem] mt-[1.3rem] max-w-[80%]">
              {(showAllTags ? sampletags : sampletags.slice(0, 5)).map((item, index) => (
                <Tags
                  key={index}
                  name={item.name}
                  color={item.color}
                  classNames={showAllTags && index >= 5 ? "animate-fadeIn" : ""}
                />
              ))}
              {sampletags.length > 5 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="px-3 py-1 text-[#EEEEEE] hover:text-[#FFFFFF] transition-colors duration-200 text-[.65rem] font-[400]"
                >
                  {showAllTags ? "Show less" : `+${sampletags.length - 5} more`}
                </button>
              )}
            </div>

          </div>
          <div className="evalsTabDetail">
            <Tabs
              defaultActiveKey="2"
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              className=""
              items={[
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/details.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Details</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "1",
                  // children: <EvaluationList />,
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
                          src="/images/evaluations/icons/leader.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Leaderboard</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "2",
                  children: <LeaderboardTable />,
                },
                {
                  label: (
                    <div className="flex items-center gap-[0.375rem]">
                      <div className="flex justify-center h-[0.875rem] w-[0.875rem]">
                        <Image
                          preview={false}
                          className=""
                          style={{ width: "auto", height: "0.875rem" }}
                          src="/images/evaluations/icons/evalExp.svg"
                          alt="Logo"
                        />
                      </div>
                      <Text_14_600_B3B3B3>Evaluations Explorer</Text_14_600_B3B3B3>
                    </div>
                  ),
                  key: "3",
                  children: <EvalExplorerTable />,
                },

              ]}
            />
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default EvalDetailed;
