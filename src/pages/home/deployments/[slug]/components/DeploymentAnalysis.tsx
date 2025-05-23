import {
  ConfigProvider,
  Progress,
  Radio,
  Typography,
  Image,
  Segmented,
} from "antd";
import React, { use, useEffect, useRef, useState } from "react";
import NoChartData from "@/components/ui/noChartData";
import * as echarts from "echarts";
import Tags from "src/flows/components/DrawerTags";
import { getChromeColor } from "@/components/ui/bud/dataEntry/TagsInputData";
import {
  Text_12_300_B3B3B3,
  Text_12_400_B3B3B3,
  Text_12_400_EEEEEE,
  Text_12_500_FFFFFF,
  Text_13_400_757575,
  Text_14_400_EEEEEE,
  Text_16_400_757575,
  Text_19_600_EEEEEE,
  Text_20_400_EEEEEE,
  Text_22_700_EEEEEE,
  Text_26_400_EEEEEE,
  Text_26_600_FFFFFF,
} from "@/components/ui/text";
import { useRouter } from "next/router";
import { Flex } from "@radix-ui/themes";
import BarChart from "@/components/charts/barChart";
import { useCharts } from "src/hooks/useCharts";
import { tempApiBaseUrl } from "@/components/environment";
import { AppRequest } from "src/pages/api/requests";
import { formatDate } from "src/utils/formatDate";
import ComingSoon from "@/components/ui/comingSoon";
import { useEndPoints } from "src/hooks/useEndPoint";
import { useLoader } from "src/context/appContext";

const computeHoursData = {
  categories: ["2000", "2005", "2010", "2015", "2020", "2025"],
  series: [
    {
      name: "Task 1",
      data: [0, 50, 60, 80, 90, 90],
      lineColor: "#FFC442",
    },
  ],
};

const numberOfDays = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

const calculateFromDate = (daysToReduce: number) => {
  const today = new Date(); // Get today's date
  today.setUTCHours(0, 0, 0, 0);
  const pastDate = new Date(today); // Create a copy of today's date
  pastDate.setUTCDate(today.getUTCDate() - daysToReduce); // Subtract 30 days
  return pastDate.toISOString(); // Format as YYYY-MM-DD
};

function TokenUsageChart({
  data,
}: {
  data: {
    categories: string[];
    series: any;
  };
}) {
  useEffect(() => {
    const highVal = Math.max(...data?.series[0]?.data) || 80;
    const chartRef = document.getElementById("token-usage-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const option = {
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "8%",
        bottom: "15%",
        right: "8%",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.categories,

        axisLabel: {
          color: "#B3B3B3", // Set x-axis label color to white for better visibility
          fontSize: 12,
          fontWeight: 300,
          interval: function (index, value) {
            const categories = data.categories;
            // Show first and last labels only, and evenly spaced labels in between
            return (
              index === 0 ||
              index === categories.length - 1 ||
              index % Math.ceil(categories.length / 6) === 0
            );
          },
        },
        axisTick: {
          alignWithLabel: true, // Ensures ticks align with labels
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: highVal,
        interval: 20, // Adjust interval to ensure all custom labels are displayed
        axisLabel: {
          formatter: (value: number) => `${value}%`,
          color: "#EEEEEE",
          fontSize: 12,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717", // Set y-axis split line color to grey
          },
        },
      },
      series: data.series.map((item) => ({
        name: item.name,
        data: item.data,
        type: "line",
        smooth: true,
        areaStyle: {},
        opacity: 0.8,
        lineStyle: {
          color: item.lineColor, // Line color
        },
        color: new echarts.graphic.LinearGradient(0.75, 0, 0, 1, item.color),
        symbol: "none", // Remove the dots in the data lines
      })),
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, []);

  return (
    <div
      id="token-usage-chart"
      className="w-full h-[150px] 1680px:h-[190px] 1920px:h-[210px] relative"
    />
  );
}

function ComputeHoursChart({
  data,
  Legend,
}: {
  data: {
    categories: string[];
    series: any;
  };
  Legend?: boolean;
}) {
  const formatLegendText = (text: string) => {
    // Replace special characters with a space and capitalize the first letter of each word
    return text
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  useEffect(() => {
    const chartRef = document.getElementById("compute-hours-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const option = {
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "8%",
        bottom: "15%",
        right: "0%",
      },
      xAxis: {
        type: "category",
        data: data.categories,
        axisTick: {
          show: false, // Remove the tick marks from the x-axis
        },
        axisLabel: {
          color: "#B3B3B3", // Set x-axis label color to white for better visibility
          fontSize: 13,
          fontWeight: 300,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 80,
        interval: 20, // Adjust interval to ensure all custom labels are displayed
        axisLabel: {
          formatter: (value: number) => `${value}%`,
          color: "#EEEEEE",
          fontSize: 13,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717", // Set y-axis split line color to grey
          },
        },
      },
      series: data.series.map((item) => ({
        name: item.name,
        data: item.data,
        type: "line",
        smooth: true,
        areaStyle: {},
        opacity: 0.8,
        lineStyle: {
          color: item.lineColor, // Line color
        },
        color: new echarts.graphic.LinearGradient(0.75, 0, 0, 1, item.color),
      })),
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, []);

  return (
    <div
      id="compute-hours-chart"
      className="w-full relative h-[150px]  1680px:h-[190px] 1920px:h-[210px] relative"
    />
  );
}

function APICallsChart({
  data,
  Legend,
}: {
  data: {
    categories: string[];
    series: any;
  };
  Legend?: boolean;
}) {
  useEffect(() => {
    const chartRef = document.getElementById("api-calls-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const option = {
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "8%",
        bottom: "15%",
        right: "0%",
      },
      xAxis: {
        type: "category",
        data: data.categories,
        axisTick: {
          show: false, // Remove the tick marks from the x-axis
        },
        axisLabel: {
          color: "#B3B3B3", // Set x-axis label color to white for better visibility
          fontSize: 13,
          fontWeight: 300,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 80,
        interval: 20, // Adjust interval to ensure all custom labels are displayed
        axisLabel: {
          formatter: (value: number) => `${value}%`,
          color: "#EEEEEE",
          fontSize: 13,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717", // Set y-axis split line color to grey
          },
        },
      },
      series: data.series.map((item) => ({
        name: item.name,
        data: item.data,
        type: "bar",
        smooth: false,
        areaStyle: {},
        opacity: 1,
        lineStyle: {
          color: item.lineColor, // Line color
        },
        barWidth: 24,
        color: new echarts.graphic.LinearGradient(0.75, 0, 0, 1, item.color),
        symbol: "none", // Remove the dots in the data lines
        barBorderRadius: [5, 5, 0, 0],
      })),
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, []);

  return (
    <div
      id="api-calls-chart"
      className="w-full relative h-[150px] 1680px:h-[190px] 1920px:h-[210px] relative"
    />
  );
}

export function CircleProgress({
  percent,
  strokeWidth,
  trailColor,
  strokeColor,
  title,
  ToHarmfulness, // Include this here
}: {
  percent: any;
  strokeWidth: number;
  trailColor: string;
  strokeColor: string;
  title: string;
  ToHarmfulness?: (key?: string) => any; // Ensure this matches your type
}) {
  const [size, setSize] = useState(49); // Default size

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 2400) {
        setSize(85.75);
      } else if (window.innerWidth >= 1920) {
        setSize(67.37);
      } else if (window.innerWidth >= 1680) {
        setSize(61.25);
      } else if (window.innerWidth >= 1440) {
        setSize(52.0625);
      } else {
        setSize(49);
      }
    };

    updateSize(); // Set initial size
    window.addEventListener("resize", updateSize); // Listen for resize
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="bg-[#101010] p-[.9rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] flex items-center justify-center flex-auto flex-col min-w-[8.85rem] circle-progress cursor-pointer"
      onClick={ToHarmfulness ? () => ToHarmfulness() : undefined}
    >
      <Progress
        size={size}
        percent={percent}
        type="circle"
        trailColor={trailColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        format={() => (
          <Text_12_400_EEEEEE className="text-[#EEEEEE] font-medium">
            {percent}%
          </Text_12_400_EEEEEE>
        )}
      />
      <div className="mt-[.75rem]">
        <Text_12_400_B3B3B3>{title}</Text_12_400_B3B3B3>
      </div>
    </div>
  );
}

function WorkersCard({ switchTab, clusterdata }: { switchTab: (key: string) => void; clusterdata?: any }) {
  const [data, setData] = React.useState([
    {
      color: "#4077E6",
      title: "Running workers",
      value: clusterdata?.cluster?.cpu_available_workers,
    },
    {
      color: "#E36E4F",
      title: "Crashed workers",
      value: clusterdata?.cluster?.cpu_available_workers,
    },
  ]);

  return (
    <div className="group relative bg-[#101010] p-[1.45rem] pb-[1.2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] min-w-[13.75rem] w-full min-h-[7.8125rem] flex flex-col items-start justify-between flex-auto">
      <div
        className="absolute w-[.825rem] h-[.825rem] top-[.5rem] right-[1rem] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={() => switchTab("2")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width=".825rem"
          height=".825rem"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.60039 1.21875C4.32425 1.21875 4.10039 1.44261 4.10039 1.71875C4.10039 1.99489 4.32425 2.21875 4.60039 2.21875H10.5004V10.8188H4.60039C4.32425 10.8188 4.10039 11.0426 4.10039 11.3188C4.10039 11.5949 4.32425 11.8188 4.60039 11.8188H10.6004C11.0974 11.8188 11.5004 11.4158 11.5004 10.9187V2.11875C11.5004 1.62169 11.0974 1.21875 10.6004 1.21875H4.60039ZM6.35394 4.3652C6.15868 4.16993 5.8421 4.16993 5.64684 4.3652C5.45158 4.56046 5.45158 4.87704 5.64684 5.0723L6.59328 6.01875H1.40039C1.12425 6.01875 0.900391 6.24261 0.900391 6.51875C0.900391 6.79489 1.12425 7.01875 1.40039 7.01875H6.59328L5.64684 7.9652C5.45158 8.16046 5.45158 8.47704 5.64684 8.6723C5.8421 8.86757 6.15868 8.86757 6.35394 8.6723L8.15394 6.8723C8.34921 6.67704 8.34921 6.36046 8.15394 6.1652L6.35394 4.3652Z"
            fill="#B3B3B3"
          />
        </svg>
      </div>
      <Text_12_500_FFFFFF>Workers</Text_12_500_FFFFFF>
      <div className="flex flex-col justify-between gap-[.55rem] w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between w-full">
            <div className="flex items-center justify-center">
              <div
                className="w-[.5rem] h-[.5rem] rounded-full mr-[0.45rem]"
                style={{
                  background: item.color,
                }}
              />
              <Text_14_400_EEEEEE
                className="text-[#EEEEEE] text-md m-0"
                level={5}
              >
                {item.title}
              </Text_14_400_EEEEEE>
            </div>
            <Text_22_700_EEEEEE level={3}>{item.value}</Text_22_700_EEEEEE>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenUsageCard(deployment) {
  const [tokenUsageRequestData, setTokenUsageRequestData] = useState<any>();
  const [tokenUsageRequestInterval, setTokenUsageRequestInterval] =
    useState<any>("daily");
  const [tokenUsageChartData, setTokenUsageChartData] = useState<any>();
  const [extraChartDetails, setExtraChartDetails] = useState({
    apiCalls: {
      total_value: "",
      avg: "",
    },
  });

  const createTokenUsageChartData = (data) => {
    if (data) {
      setExtraChartDetails((prev) => ({
        ...prev,
        apiCalls: {
          total_value:
            data?.concurrency_metrics?.summary_metrics?.total_value || 0,
          avg:
            data?.concurrency_metrics?.summary_metrics?.delta_percentage || 0,
        },
      }));
      setTokenUsageChartData((prevState) => ({
        ...prevState,
        categories:
          data?.concurrency_metrics?.items
            .map((item) => formatDate(item.time_period))
            .reverse() || [],
        series: [
          {
            name: "Task 1",
            data: data?.concurrency_metrics?.items
              .map((period) =>
                period.items ? period.items[0].total_requests : 0
              )
              .reverse(),
            lineColor: "#479D5F",
            color: [
              {
                offset: 0, // Corresponds to 42.97%
                color: getChromeColor("#479D5F"),
              },
            ],
          },
        ],
      }));
    }
  };

  useEffect(() => {
    createTokenUsageChartData(tokenUsageRequestData);
  }, [tokenUsageRequestData]);

  const getTokenUsageData = async (freq?: any, endDate?: any) => {
    const to_date = new Date().toISOString();
    try {
      const url = `${tempApiBaseUrl}/metrics/analytics/request-counts`;
      const response: any = await AppRequest.Post(url, {
        frequency: "daily",
        filter_by: "endpoint",
        filter_conditions: [deployment.deploymentId],
        from_date: calculateFromDate(100),
        metrics: "concurrency",
        to_date: to_date,
      });
      setTokenUsageRequestData(response.data);
      // successToast(response.message);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  useEffect(() => {
    getTokenUsageData();
  }, []);

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="flex items-center w-full w-full flex-col">
        <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
          Concurrent Requests
        </Text_19_600_EEEEEE>
        {/* <Text_13_400_757575 className='w-full'>
                    For the top 5 models
                </Text_13_400_757575>             */}
      </div>
      <div className="flex items-center justify-between flex-col w-full mt-[1.25rem]">
        <Text_26_400_EEEEEE className="text-[#EEEEEE] font-medium w-full leading-[26px]">
          {extraChartDetails.apiCalls.total_value
            ? Number(extraChartDetails.apiCalls.total_value).toFixed(2)
            : 0}
          %
        </Text_26_400_EEEEEE>
        <div className="flex items-center justify-between w-full mt-[.95rem]">
          {/* <Tags name={ */}
          <Flex
            className={`${
              Number(extraChartDetails.apiCalls.avg) >= 0
                ? "text-[#479D5F] bg-[#122F1140]"
                : "bg-[#861A1A33] text-[#EC7575]"
            } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem]`}
          >
            <span className="font-[400] text-[0.8125rem] leading-[100%]">
              Avg.{" "}
              {extraChartDetails.apiCalls.avg
                ? Number(extraChartDetails.apiCalls.avg).toFixed(2)
                : 0}
              %{" "}
            </span>
            {Number(extraChartDetails.apiCalls.avg) >= 0 ? (
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
          </Flex>
          {/* } classNames="w-fit !py-[.25rem]" color="#479D5F" /> */}
        </div>
      </div>
      <div className="w-full flex flex-col justify-end">
        {tokenUsageChartData && <TokenUsageChart data={tokenUsageChartData} />}
      </div>
    </div>
  );
}

function ComputeHoursCard() {
  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col relative">
      <ComingSoon shrink={true} scaleValue={0.9} comingYpos="0%" />
      <div className="flex items-center justify-start w-full flex-col">
        <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
          Compute Hours
        </Text_19_600_EEEEEE>
        <Text_13_400_757575 className="w-full">
          For the top 5 models
        </Text_13_400_757575>
      </div>
      <div className="flex items-center justify-between flex-col w-full mt-[1.25rem]">
        <Text_26_600_FFFFFF className="text-[#EEEEEE] font-medium w-full leading-[26px]">
          13%
        </Text_26_600_FFFFFF>
        <div className="flex items-center justify-between w-full mt-[.95rem]">
          <Tags
            name={
              <div className="flex items-center justify-between gap-1">
                <div className="text-[0.8125rem] text-[#479D5F] font-[400]">
                  Avg. +21.01%
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width=".75rem"
                  height=".75rem"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11.8919 3.07815H9.49077C8.96251 3.07815 8.96251 3.87854 9.49077 3.87854H10.8554L7.5017 6.92797L6.16908 5.59535C6.02501 5.45128 5.7929 5.43926 5.63282 5.56733L1.23464 9.17306C0.822431 9.51322 1.33469 10.1255 1.74289 9.79337L5.86087 6.41969L7.20553 7.76435C7.3576 7.91642 7.59772 7.92043 7.7578 7.77635L11.4916 4.3827V5.87949C11.4916 6.40775 12.292 6.40775 12.292 5.87949V3.47832C12.292 3.27421 12.1159 3.07812 11.8918 3.07812L11.8919 3.07815Z"
                    fill="#479D5F"
                  />
                </svg>
              </div>
            }
            classNames="w-fit !py-[.25rem]"
            color="#479D5F"
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-end">
        <ComputeHoursChart data={computeHoursData} />
      </div>
    </div>
  );
}

function APICallsCard(endpoint) {
  const [apiChartData, setApiChartData] = useState<any>();
  const [requestCounts, setRequestCounts] = useState();
  const [apiRequestInterval, setApiRequestInterval] = useState<any>("weekly");
  const segmentOptions = ["TODAY", "THIS WEEK", "THIS MONTH"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    apiCalls: {
      total_value: "",
      avg: "",
    },
  });

  const load = async () => {
    try {
      const url = `${tempApiBaseUrl}/metrics/analytics/request-counts`;
      const response: any = await AppRequest.Post(url, {
        frequency: apiRequestInterval,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[apiRequestInterval]),
        top_k: 5,
        metrics: "overall",
      });
      setRequestCounts(response.data);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  useEffect(() => {
    if (requestCounts) createApiChartData(requestCounts);
  }, [requestCounts]);

  const createApiChartData = (data) => {
    if (data) {
      setExtraChartDetails((prev) => ({
        ...prev,
        apiCalls: {
          total_value: data?.overall_metrics?.summary_metrics?.total_value,
          avg: data?.overall_metrics?.summary_metrics?.delta_percentage,
        },
      }));
      setApiChartData((prevState) => ({
        ...prevState,
        categories:
          data?.overall_metrics?.summary_metrics?.items.map(
            (item) => item.name
          ) || [],
        data:
          data?.overall_metrics?.summary_metrics?.items.map(
            (item) => item.total_value
          ) || [],
      }));
    }
  };

  useEffect(() => {
    load();
  }, [apiRequestInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "TODAY") return "daily";
    if (val === "THIS WEEK") return "weekly";
    if (val === "THIS MONTH") return "monthly";
    return "weekly"; // Default fallback
  };

  const handleApiRequestChange = (data) => {
    setApiRequestInterval(handleChartFilter(data));
  };

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="w-full">
        <div className="flex items-start justify-start flex-row w-full">
          <div className="flex items-center justify-start w-full flex-col">
            <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
              Number of API Calls
            </Text_19_600_EEEEEE>
            <Text_13_400_757575 className="w-full">
              For the top 5 models
            </Text_13_400_757575>
          </div>
          <div className="flex items-start justify-end w-full mt-[0.1rem]">
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === apiRequestInterval
              )} // Ensure correct default selection
              onChange={(value) => {
                handleApiRequestChange(value); // string
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
        </div>

        {apiChartData?.data?.length ? (
          <>
            <div className="flex items-center justify-between flex-col w-full mt-[1.95rem]">
              <Text_26_400_EEEEEE className="text-[#EEEEEE] font-medium w-full leading-[26px]">
                {Number(extraChartDetails.apiCalls.total_value).toFixed(2)}
              </Text_26_400_EEEEEE>
              <div className="flex items-center justify-between w-full mt-[.95rem]">
                {/* <Tags name={ */}
                <Flex
                  className={`${
                    Number(extraChartDetails.apiCalls.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                  } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.apiCalls.avg).toFixed(2)}%{" "}
                  </span>
                  $
                  {Number(extraChartDetails.apiCalls.avg) >= 0 ? (
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
                </Flex>
                {/* } classNames="w-fit !py-[.25rem]" color="#479D5F" /> */}
              </div>
            </div>
            <div className="w-full relative h-[180px] 1680px:h-[210px] 1920px:h-[230px] relative">
              <BarChart data={apiChartData} />
            </div>
            {/* {apiCallsData && <APICallsChart data={apiCallsData} />} */}
          </>
        ) : (
          <NoChartData
            //   textMessage="Once the data is available, we will populate a bar chart for you representing Number of API Calls"
            image="/images/dashboard/noData.png"
          ></NoChartData>
        )}
      </div>
    </div>
  );
}

function PlaceholderCard() {
  return (
    <div className="p-[1.067rem] w-[50%] flex items-center justify-center flex-col"></div>
  );
}

export default function DeploymentAnalysis({
  switchTab,
}: {
  switchTab: (key: string) => void;
}) {
  const { isLoading, showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const { projectId, clustersId, deploymentId } = router.query;
  const {
    getInferenceQualityAnalytics,
    inferenceQualityAnalytics,
    setPromptPage,
    getInferenceQualityPrompts,
    clusterDetails
  } = useEndPoints();
  const navigateToHarmfulness = (key, title) => {
    if (deploymentId) {
      setPromptPage(key, title);
      router.push(
        `/projects/${projectId || clustersId}/deployments/${deploymentId}/${key}`
      );
    }
  };
  useEffect(()=> {
    console.log('getInferenceQualityAnalytics', inferenceQualityAnalytics)
  }, [inferenceQualityAnalytics])
  const [data, setData] = React.useState([
    {
      title: "Harmfulness",
      key: "harmfulness",
      name: "harmfulness_score",
      percent:
        Number(inferenceQualityAnalytics?.harmfulness_score * 100).toFixed(0) ||
        0,
      size: 49,
      strokeWidth: 4,
      trailColor: "#1F1F1F",
      strokeColor: "#FFA800",
    },
    {
      title: "Hallucinations",
      key: "hallucination",
      name: "hallucination_score",
      percent:
        Number(inferenceQualityAnalytics?.hallucination_score * 100).toFixed(
          0
        ) || 0,
      size: 49,
      strokeWidth: 4,
      trailColor: "#1F1F1F",
      strokeColor: "#479D5F",
    },
    {
      title: "Sensitive Information",
      key: "sensitive_info",
      name: "sensitive_info_score",
      percent:
        Number(inferenceQualityAnalytics?.sensitive_info_score * 100).toFixed(
          0
        ) || 0,
      size: 49,
      strokeWidth: 4,
      trailColor: "#1F1F1F",
      strokeColor: "#4077E6",
    },
    {
      title: "Prompt Injection",
      key: "prompt_injection",
      name: "prompt_injection_score",
      percent:
        Number(inferenceQualityAnalytics?.prompt_injection_score * 100).toFixed(
          0
        ) || 0,
      size: 49,
      strokeWidth: 4,
      trailColor: "#1F1F1F",
      strokeColor: "#E36E4F",
    },
  ]);

  const load = async () => {
    getInferenceQualityAnalytics(deploymentId as string);
  };

  useEffect(() => {
    if (deploymentId) {
      load();
    }
  }, [deploymentId]);

  useEffect(() => {
    setData((prevState) =>
      prevState.map((item) => ({
        ...item,
        percent: Number(inferenceQualityAnalytics?.[item.name] * 100).toFixed(
          0
        ),
      }))
    );
  }, [inferenceQualityAnalytics]);

  return (
    <div className="flex flex-col gap-[.75rem] p-[.25rem] px-[0rem] pb-[0]">
      <div>
        <Text_20_400_EEEEEE className="w-full mb-[.1rem] tracking-[.025rem]">
          Deployment Analytics
        </Text_20_400_EEEEEE>
        <Text_16_400_757575>
          Start adding the cluster by entering the details{" "}
        </Text_16_400_757575>
      </div>
      <div className="flex gap-[.75rem] mt-[.5rem] justify-between items-stretch	">
        {/* {inferenceQualityAnalytics?.harmfulness_score != undefined && ( */}
          <>
            {data.map((item, index) => (
              <CircleProgress
                key={index}
                {...item}
                ToHarmfulness={() =>{
                  console.log("ToHarmfulness", item)
                  navigateToHarmfulness(item.key, item.title)
                }}
              />
            ))}
          </>
        {/* )} */}

        <WorkersCard switchTab={switchTab} clusterdata={clusterDetails}/>
      </div>
      <div className="flex  gap-[.8rem]">
        {deploymentId && <TokenUsageCard deploymentId={deploymentId} />}
        {/* <ComputeHoursCard /> */}
        {deploymentId && <APICallsCard deploymentId={deploymentId} />}
      </div>
      {/* <div className="flex  gap-[.8rem]">
        {deploymentId && <APICallsCard deploymentId={deploymentId} />}
        <PlaceholderCard />
      </div> */}
    </div>
  );
}
