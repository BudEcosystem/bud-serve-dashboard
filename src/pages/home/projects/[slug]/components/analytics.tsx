"use client";
import { useCallback, useEffect, useState } from "react";
import { AppRequest } from "./../../../../api/requests";

import {
  Text_12_500_FFFFFF,
  Text_19_600_EEEEEE,
  Text_20_400_FFFFFF,
  Text_32_700_FFFFFF,
} from "@/components/ui/text";

import { useLoader } from "src/context/appContext";
import { useRouter } from "next/router";
import ComingSoon from "@/components/ui/comingSoon";
import { Project, useProjects } from "src/hooks/useProjects";
import { Segmented, Image } from "antd";
import NoChartData from "@/components/ui/noChartData";
import BarChart from "@/components/charts/barChart";
import { tempApiBaseUrl } from "@/components/environment";
import LegendLineChart from "@/components/charts/lineChart/LegendLineChart";

const modelDataSample = {
  data: [46.06, 34.065],
  categories: ["zephyr", "budecosystem/code-millenials-8b"],
  label1: "Usage",
  label2: "Models",
};

interface AnalyticsProps {
  data: Project;
}

const AnalyticsComponent: React.FC<AnalyticsProps> = ({ data }) => {
  const {
    getProjectMetrics,
    projectMetricsData,
    getQueingMetrics,
    averageMetricsData,
    
    getConcurrentMetrics,
    concurrentMetricsData,
  } = useProjects();
  const router = useRouter();
  const { projectId } = router.query;
  const [modelRequestInterval, setModelRequestInterval] =
    useState<any>("daily");
  const [modleRequestData, setModleRequestData] = useState<any>();
  const [modleChartData, setModleChartData] = useState<any>(null);

  const [averageInterval, setAverageInterval] = useState<any>("daily");
  const [averageRequestData, setAverageRequestData] = useState<any>();
  const [averageChartData, setAverageChartData] = useState<any>(null);

  const [concurrentInterval, setConcurrentInterval] = useState<any>("daily");
  const [concurrentRequestData, setConcurrentRequestData] = useState<any>();
  const [concurrentChartData, setConcurrentChartData] = useState<any>(null);

  const [extraChartDetails, setExtraChartDetails] = useState({
    modelUsage: {
      total_value: "",
      avg: "",
    },
    average: {
      total_value: "",
      avg: "",
    },
    concurrent: {
      total_value: "",
      avg: "",
    },
  });
  const segmentOptions = ["TODAY", "THIS WEEK", "THIS MONTH"];
  const requestOptions = [
    { label: "Today", value: "daily" },
    { label: "This week", value: "weekly" },
    { label: "This month", value: "monthly" },
  ];
  const numberOfDays = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  const handleChartFilter = (val: any) => {
    if (val === "TODAY") return "daily";
    if (val === "THIS WEEK") return "weekly";
    if (val === "THIS MONTH") return "monthly";
    return "weekly"; // Default fallback
  };

  const getDateSubtracted = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  const calculateFromDate = (daysToReduce: number) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const pastDate = new Date(today);
    pastDate.setUTCDate(today.getUTCDate() - daysToReduce);
    return pastDate.toISOString();
  };
  // model usage code block ----------------------------------
  const getModelUsageData = async () => {
    const to_date = new Date().toISOString();
    await getProjectMetrics({
      frequency: modelRequestInterval,
      filter_by: "model",
      filter_conditions: [],
      from_date: calculateFromDate(numberOfDays[modelRequestInterval]),
      top_k: 5,
      metrics: "overall",
      project_id: projectId,
      to_date: to_date,
    });
  };

  useEffect(() => {
    getModelUsageData();
  }, [modelRequestInterval, projectId]);

  useEffect(() => {
    setModleRequestData(projectMetricsData);
  }, [projectMetricsData]);

  const createModelChartData = (data) => {
    if (data?.overall_metrics?.summary_metrics?.items?.length) {
      const items = data.overall_metrics.summary_metrics.items;

      setExtraChartDetails((prev) => ({
        ...prev,
        modelUsage: {
          total_value: data.overall_metrics.summary_metrics.total_value,
          avg: data.overall_metrics.summary_metrics.delta_percentage,
        },
      }));

      setModleChartData({
        categories: items.map((item) => item.name),
        data: items.map((item) => item.total_value),
        label1: "Usage",
        label2: "Models",
        barColor: "#9462D5"
      });
    }
  };

  useEffect(() => {
    createModelChartData(modleRequestData);
  }, [modleRequestData]);

  const handleModelChange = (data) => {
    setModelRequestInterval(handleChartFilter(data));
  };
  // model usage code block ----------------------------------

  // average queing usage code block ----------------------------------
  const getAverageUsageData = async () => {
    const to_date = new Date().toISOString();
    await getQueingMetrics({
      frequency: averageInterval,
      filter_by: "model",
      filter_conditions: [],
      from_date: calculateFromDate(numberOfDays[averageInterval]),
      top_k: 5,
      metrics: "queuing_time",
      project_id: projectId,
      to_date: to_date,
    });
  };

  useEffect(() => {
    getAverageUsageData();
  }, [averageInterval, projectId]);

  useEffect(() => {
    setAverageRequestData(averageMetricsData);
  }, [averageMetricsData]);

  const createAverageChartData = (data) => {
    if (data?.queuing_time_metrics?.summary_metrics?.items?.length) {
      const items = data.queuing_time_metrics.summary_metrics.items;

      setExtraChartDetails((prev) => ({
        ...prev,
        average: {
          total_value: data.queuing_time_metrics.summary_metrics.total_value,
          avg: data.queuing_time_metrics.summary_metrics.delta_percentage,
        },
      }));

      setAverageChartData({
        categories: items.map((item) => item.name),
        data: items.map((item) => item.total_value),
        label1: "Usage",
        label2: "Models",
      });
    }
  };

  useEffect(() => {
    createAverageChartData(averageRequestData);
  }, [averageRequestData]);

  const handleAverageChange = (data) => {
    setAverageInterval(handleChartFilter(data));
  };
  // average queing code block ----------------------------------
  
  // Concurrent Requests code block ----------------------------------
  const getConcurrentMetricsData = async () => {
    const to_date = new Date().toISOString();
    await getConcurrentMetrics({
      frequency: concurrentInterval,
      filter_by: "endpoint",
      filter_conditions: [],
      from_date: calculateFromDate(numberOfDays[concurrentInterval]),
      top_k: 5,
      metrics: "concurrency",
      project_id: projectId,
      to_date: to_date,
    });
  };

  useEffect(() => {
    getConcurrentMetricsData();
  }, [concurrentInterval, projectId]);

  useEffect(() => {
    setConcurrentRequestData(concurrentMetricsData);
  }, [concurrentMetricsData]);

  const createConcurrentChartData = (data) => {
    console.log("concurrent data", data);
    if (data?.concurrency_metrics?.summary_metrics?.items?.length) {
      const items = data.concurrency_metrics.summary_metrics.items;

      setExtraChartDetails((prev) => ({
        ...prev,
        average: {
          total_value: data.concurrency_metrics.summary_metrics.total_value,
          avg: data.concurrency_metrics.summary_metrics.delta_percentage,
        },
      }));

      setConcurrentChartData({
        categories: items.map((item) => item.total_value),
        data: items.map((item) => item.name),
        label1: "",
        label2: "",
        color: "#FFC442",
        smooth: true,
      });
    }
  };

  useEffect(() => {
    createConcurrentChartData(concurrentRequestData);
  }, [concurrentRequestData]);

  const handleConcurrentChange = (data) => {
    setConcurrentInterval(handleChartFilter(data));
  };
  // Concurrent Requests code block ----------------------------------

  return (
    <div className="relative">
      {/* <ComingSoon shrink={true} scaleValue={.9} comingYpos='-20%' /> */}
      <div className="flex items-center px-[1.8rem] py-[1rem] rounded overflow-hidden bg-[#18191b] max-w-[50%] w-[19.0625rem]">
        <div className="flex justify-center items-center rounded rounded-full border border-[3px] border-[#41361c] w-[4.5rem] h-[4.5rem]">
          <Image
            preview={false}
            width={20}
            className="w-[1.5em] h-[1.5e]"
            src="/icons/yellowPencil.png"
            alt="Logo"
          />
        </div>
        <div className="flex items-baseline justify-start ml-[1.3rem] mt-[.25rem]">
          <Text_32_700_FFFFFF>
            {data?.endpoints_count ? data?.endpoints_count : 0}
          </Text_32_700_FFFFFF>
          <Text_20_400_FFFFFF className="ml-[.6rem] tracking-wider">
            {data?.endpoints_count == 1 ? "Endpoint" : "Endpoints"}
          </Text_20_400_FFFFFF>
        </div>
      </div>
      <div className="flex flex-wrap align-start justify-between gap-[1.1rem] pt-[0.9375rem] pb-[2rem]">
        <div className="cardBG w-[49.1%] cardSetTwo  py-[1.9rem] px-[1.65rem] border border-[#1F1F1F] rounded-md">
          <div className="flex justify-between align-center">
            <Text_19_600_EEEEEE>Model Usage</Text_19_600_EEEEEE>
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === modelRequestInterval
              )} // Ensure correct default selection
              onChange={(value) => {
                handleModelChange(value); // string
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
          {/* <p className="text-[0.8125rem] text-[#757575] leading-[100%] font-[400] mt-[0.95rem]">For the top 5 models</p> */}
          {modleChartData?.data?.length ? (
            <>
              <div className="flex flex-col items-start	mt-[1.3rem]">
                <p className="text-[1.625rem] text-[#EEEEEE] leading-[100%] font-[400] mb-0">
                  {Number(extraChartDetails.modelUsage.total_value).toFixed(2)}
                </p>
                <div
                  className={`flex ${
                    Number(extraChartDetails.modelUsage.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                  } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem] mt-[0.82rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.modelUsage.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.modelUsage.avg) >= 0 ? (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/greenArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  ) : (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/redArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  )}
                </div>
              </div>
              <div className="h-[232px]">
                <BarChart
                  key={modleChartData?.data.length}
                  data={modleChartData}
                />
              </div>
            </>
          ) : (
            <NoChartData
              textMessage="Once the data is available, we will populate a bar chart for you representing Number of API Calls"
              image="/images/dashboard/noData.png"
            ></NoChartData>
          )}
        </div>
        <div className="cardBG w-[49.1%] cardSetTwo  py-[1.9rem] px-[1.65rem] border border-[#1F1F1F] rounded-md">
          <div className="flex justify-between align-center">
            <Text_19_600_EEEEEE>Average Queuing time</Text_19_600_EEEEEE>
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === averageInterval
              )} // Ensure correct default selection
              onChange={(value) => {
                handleAverageChange(value); // string
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
          {averageChartData?.data?.length ? (
            <>
              <div className="flex flex-col items-start	mt-[1.3rem]">
                <p className="text-[1.625rem] text-[#EEEEEE] leading-[100%] font-[400] mb-0">
                  {Number(extraChartDetails.average.total_value).toFixed(2)}
                </p>
                <div
                  className={`flex ${
                    Number(extraChartDetails.average.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                  } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem] mt-[0.82rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.average.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.average.avg) >= 0 ? (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/greenArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  ) : (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/redArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  )}
                </div>
              </div>
              <div className="h-[232px]">
                <BarChart
                  key={averageChartData?.data.length}
                  data={averageChartData}
                />
              </div>
            </>
          ) : (
            <NoChartData
              textMessage="Once the data is available, we will populate a bar chart for you representing Number of API Calls"
              image="/images/dashboard/noData.png"
            ></NoChartData>
          )}
        </div>
        <div className="cardBG w-[49.1%] cardSetTwo  py-[1.9rem] px-[1.65rem] border border-[#1F1F1F] rounded-md">
          <div className="flex justify-between align-center">
            <div>
              <Text_19_600_EEEEEE className="leading-[140%]">
                Concurrent Requests per Endpoint
              </Text_19_600_EEEEEE>
            </div>
            {/* <div className="flex justify-end items-start ">
              <Segmented
                options={segmentOptions}
                value={segmentOptions.find(
                  (opt) => handleChartFilter(opt) === concurrentInterval
                )} // Ensure correct default selection
                onChange={(value) => {
                  handleConcurrentChange(value); // string
                }}
                className="antSegmented !h-auto rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
              />
            </div> */}
          </div>
          {concurrentChartData?.data?.length ? (
            <>
              <div className="flex flex-col items-start	mt-[1.3rem]">
                <p className="text-[1.625rem] text-[#EEEEEE] leading-[100%] font-[400] mb-0">
                  {Number(extraChartDetails.concurrent.total_value).toFixed(2)}
                </p>
                <div
                  className={`flex ${
                    Number(extraChartDetails.concurrent.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                  } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem] mt-[0.82rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.concurrent.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.concurrent.avg) >= 0 ? (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/greenArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  ) : (
                    <Image
                      preview={false}
                      width={12}
                      src="/images/dashboard/redArrow.png"
                      className="ml-[.2rem]"
                      alt=""
                    />
                  )}
                </div>
              </div>
              <div className="h-[232px]">
                {/* <BarChart
                  key={averageChartData?.data.length}
                  data={averageChartData}
                /> */}
                <LegendLineChart key={concurrentChartData?.data.length} data={concurrentChartData} />
              </div>
            </>
          ) : (
            <NoChartData
              textMessage="Once the data is available, we will populate a bar chart for you representing Number of API Calls"
              image="/images/dashboard/noData.png"
            ></NoChartData>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
