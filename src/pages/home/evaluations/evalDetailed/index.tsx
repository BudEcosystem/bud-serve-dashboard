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
  Text_14_600_B3B3B3,
  Text_14_600_EEEEEE,
  Text_17_600_FFFFFF,
} from "../../../../components/ui/text";
import { PrimaryButton } from "@/components/ui/bud/form/Buttons";
import { useRouter } from "next/router";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";
import BackButton from "@/components/ui/bud/drawer/BackButton";
import { CustomBreadcrumb } from "@/components/ui/bud/card/DrawerBreadCrumbNavigation";

interface EvaluationCard {
  id: string;
  title: string;
  description: string;
  type: "Text" | "Image" | "Video" | "Actions";
  subTypes?: string[];
  timestamp: string;
}

const EvalDetailed = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("4");
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
        className="temp-bg h-full w-full"
      >
        <div className="">
          <HeaderContent />
        </div>
        <div className="evalTab hidden h-full">
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="h-full"
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

            ]}
          />
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default EvalDetailed;
