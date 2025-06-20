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

// Format date based on the scale
const formatDateByScale = (dateStr: string, scale: string): string => {
  // The API returns time without timezone indicator, so we need to treat it as UTC
  // Append 'Z' to indicate UTC if not already present
  const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || dateStr.includes('-');
  const utcDateStr = hasTimezone ? dateStr : `${dateStr}Z`;
  
  const date = new Date(utcDateStr);
  
  // Debug logging
  console.log('Original dateStr:', dateStr);
  console.log('UTC dateStr:', utcDateStr);
  console.log('Parsed date:', date.toString());
  console.log('UTC time:', date.toUTCString());
  console.log('Local timezone offset (minutes):', date.getTimezoneOffset());
  
  if (scale === "hourly") {
    // For hourly data (24hrs view), show only time without date
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    console.log('Formatted time:', formattedTime);
    return formattedTime;
  } else if (scale === "daily") {
    // For daily data, show date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  } else if (scale === "weekly") {
    // For weekly data, show week range
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  return formatDate(dateStr);
};
import ComingSoon from "@/components/ui/comingSoon";
import { useEndPoints } from "src/hooks/useEndPoint";
import { useLoader } from "src/context/appContext";
import { convertToObservabilityRequest, convertObservabilityResponse } from "@/utils/metricsAdapter";

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
  daily: 1,    // Last 24 hours
  weekly: 7,   // Last 7 days
  monthly: 30  // Last 30 days
};

const calculateFromDate = (daysToReduce: number) => {
  const now = new Date(); // Get current date and time
  const pastDate = new Date(now); // Create a copy
  pastDate.setUTCDate(now.getUTCDate() - daysToReduce); // Subtract days
  return pastDate.toISOString(); // Return full ISO string with time
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
    const dataValues = data?.series?.[0]?.data || [];
    const highVal = dataValues.length > 0 ? Math.max(...dataValues) : 80;
    const chartRef = document.getElementById("token-usage-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const option = {
      animation: false,
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
  }, [data]);

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

function APICallsTimeSeriesChart({
  data,
}: {
  data: {
    categories: string[];
    data: number[];
  };
}) {
  useEffect(() => {
    if (!data || !data.categories || !data.data) return;
    
    const chartRef = document.getElementById("api-calls-time-series-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const maxValue = Math.max(...data.data) || 100;
    const yAxisMax = Math.ceil(maxValue * 1.2); // Add 20% padding

    const option = {
      animation: false,
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "12%",
        bottom: "15%",
        right: "5%",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.categories,
        axisLabel: {
          color: "#B3B3B3",
          fontSize: 12,
          fontWeight: 300,
          interval: function (index, value) {
            const categories = data.categories;
            // Show first and last labels, and evenly spaced labels in between
            return (
              index === 0 ||
              index === categories.length - 1 ||
              index % Math.ceil(categories.length / 5) === 0
            );
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: yAxisMax,
        axisLabel: {
          formatter: (value: number) => `${value}`,
          color: "#EEEEEE",
          fontSize: 12,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717",
          },
        },
      },
      series: [
        {
          name: "API Calls",
          data: data.data,
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#9462D5",
              },
              {
                offset: 1,
                color: "rgba(148, 98, 213, 0)",
              },
            ]),
          },
          lineStyle: {
            color: "#9462D5",
            width: 2,
          },
          itemStyle: {
            color: "#9462D5",
          },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
        formatter: function (params) {
          if (!params || !Array.isArray(params) || params.length === 0) {
            return '';
          }
          const param = params[0];
          if (!param) return '';
          return `${param.name || ''}<br/>API Calls: ${param.value || 0}`;
        },
      },
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
  }, [data]);

  return (
    <div
      id="api-calls-time-series-chart"
      className="w-full h-full"
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
      value: clusterdata?.running_worker_count || '-',
    },
    {
      color: "#E36E4F",
      title: "Crashed workers",
      value: clusterdata?.crashed_worker_count || '-',
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
  const [tokenUsageChartData, setTokenUsageChartData] = useState<any>(null);
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
                period.items && period.items.length > 0 ? 
                  period.items[0].total_value || 0 : 0
              )
              .reverse(),
            lineColor: "#479D5F",
            color: [
              {
                offset: 0,
                color: "#479D5F",
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
      // For concurrent requests, we want more granular data over a longer period
      const params = {
        frequency: "daily",
        filter_by: "endpoint",
        filter_conditions: [deployment.deploymentId],
        from_date: calculateFromDate(30), // Last 30 days of daily data
        metrics: "concurrency",
        to_date: to_date,
      };
      
      // Convert to new format
      const observabilityRequest = convertToObservabilityRequest(params);
      
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      // Convert response back to old format
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setTokenUsageRequestData(convertedData);
    } catch (error) {
      console.error("Error fetching concurrent requests:", error);
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
            className={`${Number(extraChartDetails.apiCalls.avg) >= 0
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
        {tokenUsageChartData?.series?.length > 0 && tokenUsageChartData?.categories?.length > 0 && (
          <TokenUsageChart data={tokenUsageChartData} />
        )}
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
  const segmentOptions = ["LAST 24 HRS", "LAST 7 DAYS", "LAST 30 DAYS"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    apiCalls: {
      total_value: "",
      avg: "",
    },
  });

  const load = async () => {
    try {
      const to_date = new Date().toISOString();
      
      // Map interval to appropriate frequency
      let frequency = apiRequestInterval;
      if (apiRequestInterval === "daily") {
        frequency = "hourly"; // Last 24 hrs -> hourly data
      } else if (apiRequestInterval === "weekly") {
        frequency = "daily"; // Last 7 days -> daily data
      } else if (apiRequestInterval === "monthly") {
        frequency = "weekly"; // Last 30 days -> weekly data
      }
      
      const params = {
        frequency: frequency,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[apiRequestInterval]),
        top_k: 5,
        metrics: "overall",
        to_date: to_date,
      };
      
      // Convert to new format
      const observabilityRequest = convertToObservabilityRequest(params);
      
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      // Convert response back to old format
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setRequestCounts(convertedData);
    } catch (error) {
      console.error("Error fetching request counts:", error);
    }
  };

  useEffect(() => {
    if (requestCounts) createApiChartData(requestCounts);
  }, [requestCounts, apiRequestInterval]);

  const createApiChartData = (data) => {
    console.log("API Chart Data received:", data);
    
    if (data?.overall_metrics?.items?.length) {
      // Create time series data
      const categories = [];
      const counts = [];
      let totalCount = 0;
      
      // Determine the scale based on the interval
      let scale = "daily";
      if (apiRequestInterval === "daily") {
        scale = "hourly";
      } else if (apiRequestInterval === "weekly") {
        scale = "daily";
      } else if (apiRequestInterval === "monthly") {
        scale = "weekly";
      }
      
      // Process each time period
      data.overall_metrics.items.forEach((timePeriod) => {
        // Format the date based on scale
        const dateLabel = formatDateByScale(timePeriod.time_period, scale);
        categories.push(dateLabel);
        
        // Sum all requests for this time period
        let periodTotal = 0;
        timePeriod.items.forEach((item) => {
          // Check different possible fields for the count value
          const count = item.total_requests || item.total_value || item.request_count || item.count || 0;
          periodTotal += count;
        });
        
        counts.push(periodTotal);
        totalCount += periodTotal;
      });
      
      console.log("Time series data:", { categories, counts, totalCount, scale });
      
      setExtraChartDetails((prev) => ({
        ...prev,
        apiCalls: {
          total_value: totalCount.toString(),
          avg: data?.overall_metrics?.summary_metrics?.delta_percentage || 0,
        },
      }));
      
      // Reverse arrays to show oldest to newest
      setApiChartData({
        categories: categories.reverse(),
        data: counts.reverse(),
        label1: "Requests",
        label2: "Date",
        barColor: "#9462D5"
      });
    } else {
      // No data available
      setExtraChartDetails((prev) => ({
        ...prev,
        apiCalls: {
          total_value: "0",
          avg: "0",
        },
      }));
      
      setApiChartData(null);
    }
  };

  useEffect(() => {
    load();
  }, [apiRequestInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "LAST 24 HRS") return "daily";
    if (val === "LAST 7 DAYS") return "weekly";
    if (val === "LAST 30 DAYS") return "monthly";
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
              Over time
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
                  className={`${Number(extraChartDetails.apiCalls.avg) >= 0
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
              <APICallsTimeSeriesChart data={apiChartData} />
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

// TTFT Card Component
function TTFTCard(endpoint) {
  const [ttftData, setTtftData] = useState<any>();
  const [requestData, setRequestData] = useState();
  const [ttftInterval, setTtftInterval] = useState<any>("weekly");
  const segmentOptions = ["LAST 24 HRS", "LAST 7 DAYS", "LAST 30 DAYS"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    ttft: {
      total_value: "",
      avg: "",
    },
  });

  const load = async () => {
    try {
      const to_date = new Date().toISOString();
      
      // Map interval to appropriate frequency
      let frequency = ttftInterval;
      if (ttftInterval === "daily") {
        frequency = "hourly"; // Last 24 hrs -> hourly data
      } else if (ttftInterval === "weekly") {
        frequency = "daily"; // Last 7 days -> daily data
      } else if (ttftInterval === "monthly") {
        frequency = "weekly"; // Last 30 days -> weekly data
      }
      
      const params = {
        frequency: frequency,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[ttftInterval]),
        metrics: "ttft",
        to_date: to_date,
      };
      
      // Convert to new format
      const observabilityRequest = convertToObservabilityRequest(params);
      
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      // Convert response back to old format
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setRequestData(convertedData);
    } catch (error) {
      console.error("Error fetching TTFT data:", error);
    }
  };

  useEffect(() => {
    if (requestData) createTtftChartData(requestData);
  }, [requestData, ttftInterval]);

  const createTtftChartData = (data) => {
    console.log("TTFT Chart Data received:", data);
    
    if (data?.ttft_metrics?.items?.length) {
      // Create time series data
      const categories = [];
      const values = [];
      let totalValue = 0;
      let count = 0;
      
      // Determine the scale based on the interval
      let scale = "daily";
      if (ttftInterval === "daily") {
        scale = "hourly";
      } else if (ttftInterval === "weekly") {
        scale = "daily";
      } else if (ttftInterval === "monthly") {
        scale = "weekly";
      }
      
      // Process each time period
      data.ttft_metrics.items.forEach((timePeriod) => {
        // Format the date based on scale
        const dateLabel = formatDateByScale(timePeriod.time_period, scale);
        categories.push(dateLabel);
        
        // Get average TTFT for this time period
        let periodSum = 0;
        let periodCount = 0;
        if (timePeriod.items && timePeriod.items.length > 0) {
          timePeriod.items.forEach((item) => {
            const ttftValue = item.avg_ttft_ms || item.total_value || 0;
            periodSum += ttftValue;
            periodCount++;
          });
        }
        
        const periodValue = periodCount > 0 ? periodSum / periodCount : 0;
        values.push(periodValue);
        totalValue += periodValue;
        count++;
      });
      
      const overallAvg = count > 0 ? totalValue / count : 0;
      
      setExtraChartDetails((prev) => ({
        ...prev,
        ttft: {
          total_value: overallAvg.toFixed(2),
          avg: data?.ttft_metrics?.summary_metrics?.delta_percentage || 0,
        },
      }));
      
      // Reverse arrays to show oldest to newest
      setTtftData({
        categories: categories.reverse(),
        data: values.reverse(),
      });
    } else {
      // No data available
      setExtraChartDetails((prev) => ({
        ...prev,
        ttft: {
          total_value: "0",
          avg: "0",
        },
      }));
      
      setTtftData(null);
    }
  };

  useEffect(() => {
    load();
  }, [ttftInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "LAST 24 HRS") return "daily";
    if (val === "LAST 7 DAYS") return "weekly";
    if (val === "LAST 30 DAYS") return "monthly";
    return "weekly"; // Default fallback
  };

  const handleIntervalChange = (data) => {
    setTtftInterval(handleChartFilter(data));
  };

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="w-full">
        <div className="flex items-start justify-start flex-row w-full">
          <div className="flex items-center justify-start w-full flex-col">
            <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
              TTFT
            </Text_19_600_EEEEEE>
            <Text_13_400_757575 className="w-full">
              Average response time
            </Text_13_400_757575>
          </div>
          <div className="flex items-start justify-end w-full mt-[0.1rem]">
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === ttftInterval
              )}
              onChange={(value) => {
                handleIntervalChange(value);
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
        </div>

        {ttftData?.data?.length ? (
          <>
            <div className="flex items-center justify-between flex-col w-full mt-[1.95rem]">
              <Text_26_400_EEEEEE className="text-[#EEEEEE] font-medium w-full leading-[26px]">
                {Number(extraChartDetails.ttft.total_value).toFixed(2)} ms
              </Text_26_400_EEEEEE>
              <div className="flex items-center justify-between w-full mt-[.95rem]">
                <Flex
                  className={`${Number(extraChartDetails.ttft.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                    } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.ttft.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.ttft.avg) >= 0 ? (
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
              </div>
            </div>
            <div className="w-full relative h-[180px] 1680px:h-[210px] 1920px:h-[230px] relative">
              <MetricTimeSeriesChart 
                data={ttftData} 
                color="#32D583"
                unit="ms"
                metricName="TTFT"
              />
            </div>
          </>
        ) : (
          <NoChartData
            image="/images/dashboard/noData.png"
          ></NoChartData>
        )}
      </div>
    </div>
  );
}

// Latency Card Component
function LatencyCard(endpoint) {
  const [latencyData, setLatencyData] = useState<any>();
  const [requestData, setRequestData] = useState();
  const [latencyInterval, setLatencyInterval] = useState<any>("weekly");
  const segmentOptions = ["LAST 24 HRS", "LAST 7 DAYS", "LAST 30 DAYS"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    latency: {
      total_value: "",
      avg: "",
    },
  });

  const load = async () => {
    try {
      const to_date = new Date().toISOString();
      
      // Map interval to appropriate frequency
      let frequency = latencyInterval;
      if (latencyInterval === "daily") {
        frequency = "hourly";
      } else if (latencyInterval === "weekly") {
        frequency = "daily";
      } else if (latencyInterval === "monthly") {
        frequency = "weekly";
      }
      
      const params = {
        frequency: frequency,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[latencyInterval]),
        metrics: "latency",
        to_date: to_date,
      };
      
      const observabilityRequest = convertToObservabilityRequest(params);
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setRequestData(convertedData);
    } catch (error) {
      console.error("Error fetching latency data:", error);
    }
  };

  useEffect(() => {
    if (requestData) createLatencyChartData(requestData);
  }, [requestData, latencyInterval]);

  const createLatencyChartData = (data) => {
    if (data?.latency_metrics?.items?.length) {
      const categories = [];
      const values = [];
      let totalValue = 0;
      let count = 0;
      
      let scale = "daily";
      if (latencyInterval === "daily") {
        scale = "hourly";
      } else if (latencyInterval === "weekly") {
        scale = "daily";
      } else if (latencyInterval === "monthly") {
        scale = "weekly";
      }
      
      data.latency_metrics.items.forEach((timePeriod) => {
        const dateLabel = formatDateByScale(timePeriod.time_period, scale);
        categories.push(dateLabel);
        
        // If there are multiple items (endpoints), we take the first one or sum them
        // For now, we'll take the average of all endpoints for that time period
        let periodSum = 0;
        let periodCount = 0;
        if (timePeriod.items && timePeriod.items.length > 0) {
          timePeriod.items.forEach((item) => {
            const latencyValue = item.avg_latency_ms || item.total_value || 0;
            periodSum += latencyValue;
            periodCount++;
          });
        }
        
        const periodValue = periodCount > 0 ? periodSum / periodCount : 0;
        values.push(periodValue);
        totalValue += periodValue;
        count++;
      });
      
      const overallAvg = count > 0 ? totalValue / count : 0;
      
      setExtraChartDetails((prev) => ({
        ...prev,
        latency: {
          total_value: overallAvg.toFixed(2),
          avg: data?.latency_metrics?.summary_metrics?.delta_percentage || 0,
        },
      }));
      
      setLatencyData({
        categories: categories.reverse(),
        data: values.reverse(),
      });
    } else {
      setExtraChartDetails((prev) => ({
        ...prev,
        latency: {
          total_value: "0",
          avg: "0",
        },
      }));
      
      setLatencyData(null);
    }
  };

  useEffect(() => {
    load();
  }, [latencyInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "LAST 24 HRS") return "daily";
    if (val === "LAST 7 DAYS") return "weekly";
    if (val === "LAST 30 DAYS") return "monthly";
    return "weekly";
  };

  const handleIntervalChange = (data) => {
    setLatencyInterval(handleChartFilter(data));
  };

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="w-full">
        <div className="flex items-start justify-start flex-row w-full">
          <div className="flex items-center justify-start w-full flex-col">
            <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
              Latency
            </Text_19_600_EEEEEE>
            <Text_13_400_757575 className="w-full">
              End-to-end response time
            </Text_13_400_757575>
          </div>
          <div className="flex items-start justify-end w-full mt-[0.1rem]">
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === latencyInterval
              )}
              onChange={(value) => {
                handleIntervalChange(value);
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
        </div>

        {latencyData?.data?.length ? (
          <>
            <div className="flex items-center justify-between flex-col w-full mt-[1.95rem]">
              <Text_26_400_EEEEEE className="text-[#EEEEEE] font-medium w-full leading-[26px]">
                {Number(extraChartDetails.latency.total_value).toFixed(2)} ms
              </Text_26_400_EEEEEE>
              <div className="flex items-center justify-between w-full mt-[.95rem]">
                <Flex
                  className={`${Number(extraChartDetails.latency.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                    } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.latency.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.latency.avg) >= 0 ? (
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
              </div>
            </div>
            <div className="w-full relative h-[180px] 1680px:h-[210px] 1920px:h-[230px] relative">
              <MetricTimeSeriesChart 
                data={latencyData} 
                color="#4A90E2"
                unit="ms"
                metricName="Latency"
              />
            </div>
          </>
        ) : (
          <NoChartData
            image="/images/dashboard/noData.png"
          ></NoChartData>
        )}
      </div>
    </div>
  );
}

// Throughput Card Component
function ThroughputCard(endpoint) {
  const [throughputData, setThroughputData] = useState<any>();
  const [requestData, setRequestData] = useState();
  const [throughputInterval, setThroughputInterval] = useState<any>("weekly");
  const segmentOptions = ["LAST 24 HRS", "LAST 7 DAYS", "LAST 30 DAYS"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    throughput: {
      total_value: "",
      avg: "",
    },
  });

  const load = async () => {
    try {
      const to_date = new Date().toISOString();
      
      let frequency = throughputInterval;
      if (throughputInterval === "daily") {
        frequency = "hourly";
      } else if (throughputInterval === "weekly") {
        frequency = "daily";
      } else if (throughputInterval === "monthly") {
        frequency = "weekly";
      }
      
      const params = {
        frequency: frequency,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[throughputInterval]),
        metrics: "throughput",
        to_date: to_date,
      };
      
      const observabilityRequest = convertToObservabilityRequest(params);
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setRequestData(convertedData);
    } catch (error) {
      console.error("Error fetching throughput data:", error);
    }
  };

  useEffect(() => {
    if (requestData) createThroughputChartData(requestData);
  }, [requestData, throughputInterval]);

  const createThroughputChartData = (data) => {
    if (data?.throughput_metrics?.items?.length) {
      const categories = [];
      const values = [];
      let totalValue = 0;
      let count = 0;
      
      let scale = "daily";
      if (throughputInterval === "daily") {
        scale = "hourly";
      } else if (throughputInterval === "weekly") {
        scale = "daily";
      } else if (throughputInterval === "monthly") {
        scale = "weekly";
      }
      
      data.throughput_metrics.items.forEach((timePeriod) => {
        const dateLabel = formatDateByScale(timePeriod.time_period, scale);
        categories.push(dateLabel);
        
        let periodSum = 0;
        let periodCount = 0;
        if (timePeriod.items && timePeriod.items.length > 0) {
          timePeriod.items.forEach((item) => {
            const throughputValue = item.avg_throughput || item.total_value || 0;
            periodSum += throughputValue;
            periodCount++;
          });
        }
        
        const periodValue = periodCount > 0 ? periodSum / periodCount : 0;
        values.push(periodValue);
        totalValue += periodValue;
        count++;
      });
      
      const overallAvg = count > 0 ? totalValue / count : 0;
      
      setExtraChartDetails((prev) => ({
        ...prev,
        throughput: {
          total_value: overallAvg.toFixed(2),
          avg: data?.throughput_metrics?.summary_metrics?.delta_percentage || 0,
        },
      }));
      
      setThroughputData({
        categories: categories.reverse(),
        data: values.reverse(),
      });
    } else {
      setExtraChartDetails((prev) => ({
        ...prev,
        throughput: {
          total_value: "0",
          avg: "0",
        },
      }));
      
      setThroughputData(null);
    }
  };

  useEffect(() => {
    load();
  }, [throughputInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "LAST 24 HRS") return "daily";
    if (val === "LAST 7 DAYS") return "weekly";
    if (val === "LAST 30 DAYS") return "monthly";
    return "weekly";
  };

  const handleIntervalChange = (data) => {
    setThroughputInterval(handleChartFilter(data));
  };

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="w-full">
        <div className="flex items-start justify-start flex-row w-full">
          <div className="flex items-center justify-start w-full flex-col">
            <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
              Throughput
            </Text_19_600_EEEEEE>
            <Text_13_400_757575 className="w-full">
              Tokens per second
            </Text_13_400_757575>
          </div>
          <div className="flex items-start justify-end w-full mt-[0.1rem]">
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === throughputInterval
              )}
              onChange={(value) => {
                handleIntervalChange(value);
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
        </div>

        {throughputData?.data?.length ? (
          <>
            <div className="flex items-center justify-between flex-col w-full mt-[1.95rem]">
              <Text_26_400_EEEEEE className="text-[#EEEEEE] font-medium w-full leading-[26px]">
                {Number(extraChartDetails.throughput.total_value).toFixed(2)} tokens/s
              </Text_26_400_EEEEEE>
              <div className="flex items-center justify-between w-full mt-[.95rem]">
                <Flex
                  className={`${Number(extraChartDetails.throughput.avg) >= 0
                      ? "text-[#479D5F] bg-[#122F1140]"
                      : "bg-[#861A1A33] text-[#EC7575]"
                    } rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem]`}
                >
                  <span className="font-[400] text-[0.8125rem] leading-[100%]">
                    Avg. {Number(extraChartDetails.throughput.avg).toFixed(2)}%{" "}
                  </span>
                  {Number(extraChartDetails.throughput.avg) >= 0 ? (
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
              </div>
            </div>
            <div className="w-full relative h-[180px] 1680px:h-[210px] 1920px:h-[230px] relative">
              <MetricTimeSeriesChart 
                data={throughputData} 
                color="#F39C12"
                unit="tokens/s"
                metricName="Throughput"
              />
            </div>
          </>
        ) : (
          <NoChartData
            image="/images/dashboard/noData.png"
          ></NoChartData>
        )}
      </div>
    </div>
  );
}

// Token Metrics Card Component
function TokenMetricsCard(endpoint) {
  const [tokenData, setTokenData] = useState<any>();
  const [requestData, setRequestData] = useState();
  const [tokenInterval, setTokenInterval] = useState<any>("weekly");
  const segmentOptions = ["LAST 24 HRS", "LAST 7 DAYS", "LAST 30 DAYS"];
  const [extraChartDetails, setExtraChartDetails] = useState({
    tokens: {
      input_total: "",
      output_total: "",
      input_avg: "",
      output_avg: "",
    },
  });

  const load = async () => {
    try {
      const to_date = new Date().toISOString();
      
      let frequency = tokenInterval;
      if (tokenInterval === "daily") {
        frequency = "hourly";
      } else if (tokenInterval === "weekly") {
        frequency = "daily";
      } else if (tokenInterval === "monthly") {
        frequency = "weekly";
      }
      
      const params = {
        frequency: frequency,
        filter_by: "endpoint",
        filter_conditions: [endpoint.deploymentId],
        from_date: calculateFromDate(numberOfDays[tokenInterval]),
        metrics: "input_output_tokens",
        to_date: to_date,
      };
      
      const observabilityRequest = convertToObservabilityRequest(params);
      const url = `${tempApiBaseUrl}/metrics/analytics`;
      const response: any = await AppRequest.Post(url, observabilityRequest);
      
      const convertedData = convertObservabilityResponse(
        response.data,
        params.metrics,
        params.filter_by
      );
      
      setRequestData(convertedData);
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  useEffect(() => {
    if (requestData) createTokenChartData(requestData);
  }, [requestData, tokenInterval]);

  const createTokenChartData = (data) => {
    if (data?.input_output_tokens_metrics?.items?.length) {
      const categories = [];
      const inputValues = [];
      const outputValues = [];
      let totalInput = 0;
      let totalOutput = 0;
      let count = 0;
      
      let scale = "daily";
      if (tokenInterval === "daily") {
        scale = "hourly";
      } else if (tokenInterval === "weekly") {
        scale = "daily";
      } else if (tokenInterval === "monthly") {
        scale = "weekly";
      }
      
      data.input_output_tokens_metrics.items.forEach((timePeriod) => {
        const dateLabel = formatDateByScale(timePeriod.time_period, scale);
        categories.push(dateLabel);
        
        let periodInput = 0;
        let periodOutput = 0;
        if (timePeriod.items && timePeriod.items.length > 0) {
          timePeriod.items.forEach((item) => {
            periodInput += item.input_tokens || 0;
            periodOutput += item.output_tokens || 0;
          });
        }
        
        inputValues.push(periodInput);
        outputValues.push(periodOutput);
        totalInput += periodInput;
        totalOutput += periodOutput;
        count++;
      });
      
      const avgInput = count > 0 ? totalInput / count : 0;
      const avgOutput = count > 0 ? totalOutput / count : 0;
      
      setExtraChartDetails((prev) => ({
        ...prev,
        tokens: {
          input_total: totalInput.toString(),
          output_total: totalOutput.toString(),
          input_avg: data?.input_output_tokens_metrics?.summary_metrics?.input_tokens_delta_percentage || 0,
          output_avg: data?.input_output_tokens_metrics?.summary_metrics?.output_tokens_delta_percentage || 0,
        },
      }));
      
      setTokenData({
        categories: categories.reverse(),
        inputData: inputValues.reverse(),
        outputData: outputValues.reverse(),
      });
    } else {
      setExtraChartDetails((prev) => ({
        ...prev,
        tokens: {
          input_total: "0",
          output_total: "0",
          input_avg: "0",
          output_avg: "0",
        },
      }));
      
      setTokenData(null);
    }
  };

  useEffect(() => {
    load();
  }, [tokenInterval]);

  const handleChartFilter = (val: any) => {
    if (val === "LAST 24 HRS") return "daily";
    if (val === "LAST 7 DAYS") return "weekly";
    if (val === "LAST 30 DAYS") return "monthly";
    return "weekly";
  };

  const handleIntervalChange = (data) => {
    setTokenInterval(handleChartFilter(data));
  };

  return (
    <div className="bg-[#101010] p-[1.55rem] py-[2rem] rounded-[6.403px] border-[1.067px] border-[#1F1F1F] w-[50%] h-[23.664375rem] flex items-center justify-between flex-col">
      <div className="w-full">
        <div className="flex items-start justify-start flex-row w-full">
          <div className="flex items-center justify-start w-full flex-col">
            <Text_19_600_EEEEEE className="mb-[1.3rem] w-full">
              Token Metrics
            </Text_19_600_EEEEEE>
            <Text_13_400_757575 className="w-full">
              Input and output tokens
            </Text_13_400_757575>
          </div>
          <div className="flex items-start justify-end w-full mt-[0.1rem]">
            <Segmented
              options={segmentOptions}
              value={segmentOptions.find(
                (opt) => handleChartFilter(opt) === tokenInterval
              )}
              onChange={(value) => {
                handleIntervalChange(value);
              }}
              className="antSegmented rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0]"
            />
          </div>
        </div>

        {tokenData?.categories?.length ? (
          <>
            <div className="flex items-center justify-between flex-col w-full mt-[1.95rem]">
              <div className="flex justify-between w-full">
                <div>
                  <Text_14_400_EEEEEE className="text-[#B3B3B3]">Input</Text_14_400_EEEEEE>
                  <Text_20_400_EEEEEE className="text-[#EEEEEE] font-medium">
                    {Number(extraChartDetails.tokens.input_total).toLocaleString()} tokens
                  </Text_20_400_EEEEEE>
                </div>
                <div>
                  <Text_14_400_EEEEEE className="text-[#B3B3B3]">Output</Text_14_400_EEEEEE>
                  <Text_20_400_EEEEEE className="text-[#EEEEEE] font-medium">
                    {Number(extraChartDetails.tokens.output_total).toLocaleString()} tokens
                  </Text_20_400_EEEEEE>
                </div>
              </div>
            </div>
            <div className="w-full relative h-[180px] 1680px:h-[210px] 1920px:h-[230px] relative">
              <TokenTimeSeriesChart 
                data={tokenData}
              />
            </div>
          </>
        ) : (
          <NoChartData
            image="/images/dashboard/noData.png"
          ></NoChartData>
        )}
      </div>
    </div>
  );
}

// Generic Metric Time Series Chart Component
function MetricTimeSeriesChart({
  data,
  color,
  unit,
  metricName
}: {
  data: {
    categories: string[];
    data: number[];
  };
  color: string;
  unit: string;
  metricName: string;
}) {
  useEffect(() => {
    if (!data || !data.categories || !data.data) return;
    
    const chartRef = document.getElementById(`${metricName}-time-series-chart`);
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const maxValue = Math.max(...data.data) || 100;
    const yAxisMax = Math.ceil(maxValue * 1.2); // Add 20% padding

    const option = {
      animation: false,
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "12%",
        bottom: "15%",
        right: "5%",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.categories,
        axisLabel: {
          color: "#B3B3B3",
          fontSize: 12,
          fontWeight: 300,
          interval: function (index, value) {
            const categories = data.categories;
            return (
              index === 0 ||
              index === categories.length - 1 ||
              index % Math.ceil(categories.length / 5) === 0
            );
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: yAxisMax,
        axisLabel: {
          formatter: (value: number) => `${value}${unit ? ' ' + unit : ''}`,
          color: "#EEEEEE",
          fontSize: 12,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717",
          },
        },
      },
      series: [
        {
          name: metricName,
          data: data.data,
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: color,
              },
              {
                offset: 1,
                color: `${color}00`,
              },
            ]),
          },
          lineStyle: {
            color: color,
            width: 2,
          },
          itemStyle: {
            color: color,
          },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
        formatter: function (params) {
          if (!params || !Array.isArray(params) || params.length === 0) {
            return '';
          }
          const param = params[0];
          if (!param) return '';
          return `${param.name || ''}<br/>${metricName}: ${param.value || 0} ${unit}`;
        },
      },
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
  }, [data, color, unit, metricName]);

  return (
    <div
      id={`${metricName}-time-series-chart`}
      className="w-full h-full"
    />
  );
}

// Token Time Series Chart Component
function TokenTimeSeriesChart({
  data
}: {
  data: {
    categories: string[];
    inputData: number[];
    outputData: number[];
  };
}) {
  useEffect(() => {
    if (!data || !data.categories) return;
    
    const chartRef = document.getElementById("token-time-series-chart");
    const myChart = echarts.init(chartRef, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    const allValues = [...data.inputData, ...data.outputData];
    const maxValue = Math.max(...allValues) || 100;
    const yAxisMax = Math.ceil(maxValue * 1.2);

    const option = {
      animation: false,
      backgroundColor: "transparent",
      grid: {
        top: "10%",
        left: "12%",
        bottom: "15%",
        right: "5%",
      },
      legend: {
        data: ['Input Tokens', 'Output Tokens'],
        textStyle: {
          color: '#B3B3B3',
        },
        bottom: 0,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.categories,
        axisLabel: {
          color: "#B3B3B3",
          fontSize: 12,
          fontWeight: 300,
          interval: function (index, value) {
            const categories = data.categories;
            return (
              index === 0 ||
              index === categories.length - 1 ||
              index % Math.ceil(categories.length / 5) === 0
            );
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: yAxisMax,
        axisLabel: {
          formatter: (value: number) => value.toLocaleString(),
          color: "#EEEEEE",
          fontSize: 12,
          fontWeight: 300,
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#171717",
          },
        },
      },
      series: [
        {
          name: "Input Tokens",
          data: data.inputData,
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#4077E6",
              },
              {
                offset: 1,
                color: "rgba(64, 119, 230, 0)",
              },
            ]),
          },
          lineStyle: {
            color: "#4077E6",
            width: 2,
          },
          itemStyle: {
            color: "#4077E6",
          },
          symbol: "circle",
          symbolSize: 6,
        },
        {
          name: "Output Tokens",
          data: data.outputData,
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#E36E4F",
              },
              {
                offset: 1,
                color: "rgba(227, 110, 79, 0)",
              },
            ]),
          },
          lineStyle: {
            color: "#E36E4F",
            width: 2,
          },
          itemStyle: {
            color: "#E36E4F",
          },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
        formatter: function (params) {
          if (!params || !Array.isArray(params) || params.length === 0) {
            return '';
          }
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += `${param.seriesName}: ${param.value?.toLocaleString() || 0} tokens<br/>`;
          });
          return result;
        },
      },
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
  }, [data]);

  return (
    <div
      id="token-time-series-chart"
      className="w-full h-full"
    />
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
  useEffect(() => {
    console.log('projectId', projectId)
    console.log('projectId', projectId)
  }, [router.isReady]);
  const navigateToHarmfulness = (key, title) => {
    if (deploymentId) {
      setPromptPage(key, title);
      router.push(
        `/${projectId ? 'projects' : 'clusters'}/${projectId ? projectId : clustersId}/deployments/${deploymentId}/${key}`
      );
    }
  };
  useEffect(() => {
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
              ToHarmfulness={() => {
                console.log("ToHarmfulness", item)
                navigateToHarmfulness(item.key, item.title)
              }}
            />
          ))}
        </>
        {/* )} */}
        {clusterDetails && (
          <WorkersCard switchTab={switchTab} clusterdata={clusterDetails} />
        )}
      </div>
      <div className="flex  gap-[.8rem]">
        {deploymentId && <APICallsCard deploymentId={deploymentId} />}
        {deploymentId && <TTFTCard deploymentId={deploymentId} />}
      </div>
      <div className="flex  gap-[.8rem]">
        {deploymentId && <LatencyCard deploymentId={deploymentId} />}
        {deploymentId && <ThroughputCard deploymentId={deploymentId} />}
      </div>
      <div className="flex  gap-[.8rem]">
        {deploymentId && <TokenMetricsCard deploymentId={deploymentId} />}
        <PlaceholderCard />
      </div>
    </div>
  );
}
