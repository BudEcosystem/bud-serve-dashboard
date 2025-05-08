"use client";
import { useEffect, useState } from "react";
import { Image, Segmented } from "antd";

import {
  Text_13_400_757575,
  Text_15_600_EEEEEE,
  Text_19_600_EEEEEE,
  Text_26_400_EEEEEE,
  Text_38_400_EEEEEE,
} from "@/components/ui/text";

import {
  Cluster,
  ClusterFilter,
  ClusterMetrics,
  MetricType,
  useCluster,
} from "src/hooks/useCluster";
import Tags from "src/flows/components/DrawerTags";
import GuageChart from "@/components/charts/GuageChart";
import BarChart from "@/components/charts/barChart";
import LineChart from "@/components/charts/lineChart";
import {
  formatStorageSize,
  getCategories,
  getChartData,
} from "@/lib/utils";
import { useRouter } from "next/router";
import ComingSoon from "@/components/ui/comingSoon";
import { useLoaderOnLoding } from "src/hooks/useLoaderOnLoading";
import CardWithBgAndTag from "@/components/ui/CardWithBgAndTag";

const segmentOptions = ["today", "7days", "month"];
const segmentOptionsMap = {
  today: "Today",
  "7days": "7 Days",
  month: "This Month",
};

type GaugeChartProps = {
  title?: string;
  description?: string;
  average: string;
  percentage: string;
  chartData?: any;
  metricType: MetricType;
  field: string;
};

type ChartUsageCardProps = {
  title: string;
  description: string;
  value: string | number;
  percentage: number;
  chartData: any;
  arrow?: boolean;
  metricType: MetricType;
};

interface GeneralProps {
  data: Cluster;
}

type GeneralCardsProps = {
  name: string;
  bg: string;
  value: string | number;
  tag?: {
    value: string;
    tagColor: string;
  };
};

const ChartUsageCard = ({
  data,
  onChange,
  comingSoon,
}: {
  data: ChartUsageCardProps;
  onChange: (value: ClusterMetrics, segment: ClusterFilter) => void;
  comingSoon?: boolean;
}) => {
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");
  const { clustersId } = useRouter().query;
  const { getClusterMetrics } = useCluster();

  useEffect(() => {
    if (clustersId) {
      getClusterMetrics(
        clustersId as string,
        selectedSegment,
        data?.metricType
      ).then((res) => {
        onChange(res, selectedSegment);
      });
    }
  }, [selectedSegment, clustersId]);

  return (
    <div
      className={`cardBG w-[49.1%] h-[23.75rem] py-[2rem] pb-[.5rem] px-[1.5rem] border border-[#1F1F1F] rounded-md relative`}
    >
      {comingSoon && <ComingSoon />}
      <div className="flex justify-between align-center">
        <div>
          <Text_19_600_EEEEEE>{data?.title}</Text_19_600_EEEEEE>
        </div>
        {segmentOptions && (
          <Segmented
            options={segmentOptions?.map((item) => ({
              label: segmentOptionsMap[item],
              value: item,
            }))}
            onChange={(value) => {
              setSelectedSegment(value as ClusterFilter);
            }}
            className="antSegmented general rounded-md text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] p-[0] mt-[.05rem]"
          />
        )}
      </div>
      {data?.description && (
        <div className="mt-[.7rem]">
          <Text_13_400_757575>{data?.description}</Text_13_400_757575>
        </div>
      )}
      <div className="flex flex-col items-start mt-[1.7rem]">
        <Text_26_400_EEEEEE className="">{data?.value}</Text_26_400_EEEEEE>
        <div
          className="flex  rounded-md items-center px-[.45rem] mb-[.1rem] h-[1.35rem] mt-[0.35rem]"
          style={{
            backgroundColor: data?.percentage > 0 ? "#122F1140" : "#2D0D0D40",
            color: data?.percentage > 0 ? "#479D5F" : "#E36E4F",
          }}
        >
          <span className=" font-[400] text-[0.8125rem] leading-[100%]">{`Avg. ${data?.percentage}`}</span>
          {data?.arrow &&
            (data?.percentage > 0 ? (
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
            ))}
        </div>
      </div>
      <div className="h-[11.25rem]">{data?.chartData}</div>
    </div>
  );
};

function NetworkInUsage() {
  const [data, setData] = useState<ClusterMetrics>(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");

  return (
    <ChartUsageCard
      onChange={(value, segment) => {
        setData(value);
        setSelectedSegment(segment);
      }}
      data={{
        title: "Network In",
        description: "Amount of data over time",
        value: `${
          data?.cluster_summary?.network_in?.inbound_mbps?.toFixed(2) || 0
        } Mbps`,
        percentage: 0,
        chartData: (
          <LineChart
            data={{
              color: "#FFC442",
              categories: getCategories(
                selectedSegment,
                data?.cluster_summary?.network_in?.time_series
              ),
              data: getChartData(
                selectedSegment,
                data?.cluster_summary?.network_in?.time_series
              ),
              label1: "",
              label2: "",
              smooth: true,
            }}
          />
        ),
        arrow: true,
        metricType: MetricType.NETWORK_IN,
      }}
    />
  );
}

function NetworkOutUsage() {
  const [data, setData] = useState<ClusterMetrics>(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");
  return (
    <ChartUsageCard
      onChange={(value, segment) => {
        setData(value);
        setSelectedSegment(segment);
      }}
      data={{
        title: "Network Out",
        description: "Amount of data over time",
        value: `${
          data?.cluster_summary?.network_out?.outbound_mbps?.toFixed(2) || 0
        } Mbps`,
        percentage: 0,
        chartData: (
          <LineChart
            data={{
              color: "#FFC442",
              categories: getCategories(
                selectedSegment,
                data?.cluster_summary?.network_out?.time_series
              ),
              data: getChartData(
                selectedSegment,
                data?.cluster_summary?.network_out?.time_series
              ),
              label1: "",
              label2: "",
              smooth: true,
            }}
          />
        ),
        arrow: true,
        metricType: MetricType.NETWORK_OUT,
      }}
    />
  );
}

function NetworkBandwidthUsage() {
  const [data, setData] = useState<ClusterMetrics>(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");

  return (
    <ChartUsageCard
      onChange={(value, segment) => {
        setData(value);
        setSelectedSegment(segment);
      }}
      data={{
        title: "Network Bandwidth",
        description: "% Bandwidth used vs total bandwidth",
        value: `${
          data?.cluster_summary?.network_bandwidth?.total_mbps?.toFixed(2) || 0
        } Mbps`,
        percentage: 0,
        chartData: (
          <LineChart
            data={{
              color: "#FFC442",
              categories: getCategories(
                selectedSegment,
                data?.cluster_summary?.network_bandwidth?.time_series
              ),
              data: getChartData(
                selectedSegment,
                data?.cluster_summary?.network_bandwidth?.time_series
              ),
              label1: "",
              label2: "",
              smooth: true,
            }}
          />
        ),
        arrow: true,
        metricType: MetricType.NETWORK_BANDWIDTH,
      }}
    />
  );
}

function PowerConsumption() {
  const [data, setData] = useState<ClusterMetrics>(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");
  return (
    <ChartUsageCard
      onChange={(value, segment) => {
        setData(value);
        setSelectedSegment(segment);
      }}
      data={{
        title: "Power Consumption",
        description: "Power consumption per Node",
        value: "0 W",
        percentage: 0,
        chartData: (
          <BarChart
            data={{
              categories: []?.map((item) => item.name),
              data: []?.map((item) => item.power_consumption),
              label1: "W",
              label2: "Node",
            }}
          />
        ),
        arrow: false,
        metricType: MetricType.ALL,
      }}
    />
  );
}

const GuageCharts = ({
  title,
  description,
  average,
  percentage,
  metricType,
  field,
}: GaugeChartProps) => {
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");
  const [metrics, setMetrics] = useState<ClusterMetrics>(null);

  const { clustersId } = useRouter().query;
  const { getClusterMetrics } = useCluster();

  useEffect(() => {
    if (clustersId) {
      getClusterMetrics(clustersId as string, selectedSegment, metricType).then(
        (res) => {
          setMetrics(res);
        }
      );
    }
  }, [selectedSegment, clustersId]);
  
  useEffect(() => {
    console.log("metrics", metrics);
  }, [metrics]);

  return (
    <div className=" w-[49.1%] cardSetTwo h-[23.75rem]  py-[2rem] px-[1.5rem] border border-[#1F1F1F] rounded-md bg-[#101010]">
      {/* <div className="cardBG w-[49.1%] cardSetTwo h-[385px]  py-[1.9rem] px-[1.65rem] border border-[#1F1F1F] rounded-md"> */}
      <div className="flex justify-between align-center">
        <Text_19_600_EEEEEE className="tracking-[.005rem]">
          {title}
        </Text_19_600_EEEEEE>
        <Segmented
          options={segmentOptions?.map((item) => ({
            label: segmentOptionsMap[item],
            value: item,
          }))}
          onChange={(value) => {
            setSelectedSegment(value as ClusterFilter);
          }}
          className="antSegmented general text-[#EEEEEE] font-[400] bg-[transparent] border border-[#4D4D4D] border-[.53px] rounded-[5px] p-[0] mt-[.05rem]"
        />
      </div>
      <div className="mt-[.7rem]">
        <Text_13_400_757575>{description}</Text_13_400_757575>
      </div>

      {/* <div className="h-[232px]"> */}
      <div className="h-[14.5rem]">
        <GuageChart
          data={{
            percentage: Number(
              metrics?.cluster_summary?.[field]?.[percentage]?.toFixed(2)
            ),
            average: Number(
              metrics?.cluster_summary?.[field]?.[average]?.toFixed(2)
            ),
          }}
        />
      </div>
    </div>
  );
};

const ClusterGeneral: React.FC<GeneralProps> = ({
  data,
}: {
  data?: Cluster;
}) => {
  const [selectedSegment, setSelectedSegment] =
    useState<ClusterFilter>("today");
  const router = useRouter();
  const { clustersId } = router.query;
  const [metrics, setMetrics] = useState<ClusterMetrics>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { getClusterMetrics } = useCluster();
  useLoaderOnLoding(loading);
  useEffect(() => {
    if (router.isReady && clustersId) {
      setLoading(true);
      getClusterMetrics(clustersId as string, selectedSegment, MetricType.ALL)
        .then((res) => {
          setMetrics(res);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [router.isReady, clustersId]);
  const GeneralCardData: GeneralCardsProps[] = data && [
    {
      name: "Nodes",
      bg: "/images/cluster/bignode.png",
      value: data?.total_nodes || 0,
      tag: {
        value: `${data?.available_nodes || 0} Available`,
        tagColor: "#479D5F",
      },
    },
    {
      name: "Deployments",
      bg: "/images/cluster/bg-deployment.png",
      value: data?.total_endpoints_count || 0,
      tag: {
        value: `${data?.running_endpoints_count || 0} Running`,
        tagColor: "#479D5F",
      },
    },
    {
      name: "Workers",
      bg: "/images/cluster/bg-workers.png",
      value: data?.total_workers_count,
      tag: {
        value: `${data?.active_workers_count || 0} Active`,
        tagColor: "#479D5F",
      },
    },
    {
      name: "Disk Space",
      bg: "/images/cluster/bg-disk.png",
      value: formatStorageSize(
        metrics?.cluster_summary?.storage.total_gib || 0,
        "GB"
      ), //
      tag: {
        value: `${formatStorageSize(
          metrics?.cluster_summary?.storage?.available_gib || 0,
          "GB"
        )} Available`,
        tagColor: "#4077E6",
      },
    }, // TODO: Change the value to actual data
    {
      name: "VRAM",
      bg: "/images/cluster/bg-vram.png",
      value: formatStorageSize(
        metrics?.cluster_summary?.memory?.total_gib || 0,
        "GB"
      ),
    },
    {
      name: "RAM",
      bg: "/images/cluster/bg-ram.png",
      value: formatStorageSize(
        metrics?.cluster_summary?.memory?.total_gib || 0,
        "GB"
      ),
    },
    { name: "TFLOPs", bg: "/images/cluster/bg-flop.png", value: "0" }, // TODO: Change the value to actual data
    {
      name: "Device Types",
      bg: "/images/cluster/bg-device.png",
      value: data?.hardware_type?.join(", ") || "N/A",
    },
  ];

  const GeneralCards = ({ name, bg, value, tag }: GeneralCardsProps) => {
    return (
      <div className="relative w-[24%] rounded-[8px] px-[1.6rem] pt-[2rem] pb-[1.5rem] border-[1.5px] border-[#1c1c1c] min-h-[172px] bg-[#101010]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            preview={false}
            src={bg}
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-start">
          <Text_15_600_EEEEEE>{name}</Text_15_600_EEEEEE>
          <Text_38_400_EEEEEE className="pt-[3.2rem]">
            {value}
          </Text_38_400_EEEEEE>
          {tag && (
            <div className="flex mt-[.85rem]">
              <Tags
                name={tag.value}
                color={tag.tagColor}
                textClass="text-[0.8125rem]"
                classNames="!py-[.2rem]"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const GuageChartCardData: GaugeChartProps[] = [
    data?.hardware_type?.includes("CPU") && {
      title: "CPU Utilization",
      description: "CPU Utilization within a period of time",
      average: "change_percent",
      percentage: "usage_percent",
      chartData: <div>Chart</div>, // Pass your chart data here,
      metricType: MetricType.CPU,
      field: "cpu",
    },
    data?.hardware_type?.includes("GPU") && {
      title: "GPU Utilization",
      description: "GPU  Utilization within a period of time",
      average: "change_percent",
      percentage: "usage_percent",
      chartData: <div>Chart</div>, // Pass your chart data here
      metricType: MetricType.GPU,
      field: "gpu",
    },
    data?.hardware_type?.includes("HPU") && {
      title: "HPU Utilization",
      description: "HPU Utilization within a period of time",
      average: "change_percent",
      percentage: "usage_percent",
      chartData: <div>Chart</div>, // Pass your chart data here
      metricType: MetricType.HPU,
      field: "hpu",
    },
    {
      title: "Memory Utilization",
      description: "Memory Utilization within a period of time",
      average: "change_percent",
      percentage: "usage_percent",
      chartData: <div>Chart</div>, // Pass your chart data here
      metricType: MetricType.MEMORY,
      field: "memory",
    },
    {
      title: "Storage Utilization",
      description: "Storage Utilization within a period of time",
      average: "change_percent",
      percentage: "usage_percent",
      chartData: <div>Chart</div>, // Pass your chart data here
      metricType: MetricType.DISK,
      field: "storage",
    },
    // {
    //   title: "Disk Utilization",
    //   description: "Disk Utilization within a period of time",
    //   average: "change_percent",
    //   percentage: "usage_percent",
    //   chartData: <div>Chart</div>, // Pass your chart data here
    //   metricType: MetricType.DISK,
    //   field: "storage",
    // },
  ]?.filter(Boolean) as GaugeChartProps[];

  return (
    <div className="relative pb-[3rem]">
      <div className="flex flex-wrap justify-between items-top gap-[.8rem] mt-[.5rem]">
        {GeneralCardData?.map((item, index) => (
          <CardWithBgAndTag key={index} {...item} />
        ))}
      </div>
      <div className="mt-[1.55rem]">
        <div className="flex justify-between flex-wrap gap-x-[.8rem] gap-y-[1.4rem] ">
          <PowerConsumption />
          <NetworkInUsage />
          <NetworkOutUsage />
          <NetworkBandwidthUsage />
        </div>
        <div className="flex justify-between flex-wrap gap-x-[.8rem] gap-y-[1.4rem] mt-[1.4rem]">
          {GuageChartCardData.map((item, index) => (
            <GuageCharts key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClusterGeneral;
