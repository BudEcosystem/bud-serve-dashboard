"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import * as echarts from 'echarts';

import { Text_10_400_EEEEEE, Text_12_400_757575, Text_12_400_EEEEEE, Text_14_400_757575, Text_14_400_EEEEEE, Text_16_400_EEEEEE } from "@/components/ui/text";

import { useRouter } from "next/router";
import { Cluster, Node, useCluster } from "src/hooks/useCluster";
import Tags from "src/flows/components/DrawerTags";
import DirectionArrowChart from "@/components/charts/directionArrowChart";
import { ChevronRight } from "lucide-react";
import { useDrawer } from "src/hooks/useDrawer";
import NoDataFount from "@/components/ui/noDataFount";
import { getCategories, getChartData } from "@/lib/utils";
import { useLoaderOnLoding } from "src/hooks/useLoaderOnLoading";

type SingleGuageChartData = {
  data: number;
  label1: string;
  label2: string;
  barColor: string;
  text: string
}


const SingleGuageChart = (
  { data }:
    { data: SingleGuageChartData }
) => {

  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      const containerWidth = chartRef.current.clientWidth;
      const containerHeight = chartRef.current.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) {
        console.warn("bar Chart container has no width or height yet.");
        return;
      }
      const myChart = echarts.init(chartRef.current, null, {
        renderer: 'canvas',
        useDirtyRect: false,
      });

      const option = {
        grid: {
          top: '0%',
          left: '0%',
          bottom: '0%',
          right: '0%',
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '75%'],
            radius: '125%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 12,
            itemStyle: {
              color: data.barColor ? data.barColor : '#479D5F',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            progress: {
              show: true,
              roundCap: true,
              width: 6
            },
            pointer: {
              show: false
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 6,
                color: [
                  [1, '#1F1F1F'], // Set the gauge background color to #1F1F1F
                ],
              }
            },
            axisTick: {
              show: false,
              splitNumber: 2,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false,
            },
            title: {
              show: false
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: data.data,
              }
            ]
          }
        ]
      };



      myChart.setOption(option);

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

  return (
    <div className='relative h-full'>
      {/* <Text_12_500_FFFFFF className='block absolute top-[1.8em] left-[5em]'>{barChartData?.title}</Text_12_500_FFFFFF> */}
      {/* <Text className='block absolute -rotate-90 origin-top-left	 top-[50%] left-[.8rem] mt-[1.8rem] p-0 text-xs text-[#6A6E76] font-light h-[1rem] leading-[100%]'>{barChartData?.label1}</Text> */}
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} className='' />
      {/* <Text className='block absolute m-auto bottom-3 left-[50%] top-auto p-0 text-xs text-[#6A6E76] font-light h-[1rem] leading-[100%]'>{barChartData?.label2}</Text> */}
      <div className='absolute flex justify-between items-center w-full px-[6%] mt-[-0.35rem]'>
        <Text_12_400_EEEEEE>0</Text_12_400_EEEEEE>
        <Text_12_400_EEEEEE>99</Text_12_400_EEEEEE>
      </div>
      <div className='absolute flex flex-col justify-center items-center w-full px-[14%] mt-[-2.15rem]'>
        <Text_12_400_EEEEEE>{data.data?.toFixed(2)} %</Text_12_400_EEEEEE>
        <Text_12_400_757575 className='mt-[.1rem]'>{data.text}</Text_12_400_757575>
      </div>
    </div>
  );
};


function CompareGraph({ data }: { data: SingleGuageChartData }) {
  return <div className="flex flex-col justify-start items-center w-[12.2%]">
    <div className="max-w-[5.5rem]">
      <Text_12_400_757575 className="text-center">{data.label1} vs {data.label2}</Text_12_400_757575>
    </div>
    <div className="w-full h-[60px] 1680px:h-[72px] 1920px:h-[80px] 4k:h-[100px]">
      <SingleGuageChart data={data} />
    </div>
  </div>
}



const NodeRow = (
  { ip, data }: { data: Node, ip: string }
) => {
  const { setSelectedNode } = useCluster();
  const { openDrawer } = useDrawer()
  const tagData = [
    { name: 'CPU', color: '#D1B854', hide: !data?.cpu },
    { name: 'HPU', color: '#D1B854', hide: !data?.gpu },
    { name: 'GPU', color: '#D1B854', hide: !data?.gpu },
    { name: ip, color: '#965CDE' },
    {
      name: data?.events_count > 1 ? 'High' : 'Low',
      color: data?.events_count > 1 ? '#EC7575' : '#479D5F',
    }
  ]?.filter((item) => !item.hide);
  const chartData: SingleGuageChartData[] = [
    {
      barColor: '#479D5F',
      text: data.pods.current + ' Pods',
      data: data.pods.current / data.pods.max * 100,
      label1: 'Available',
      label2: 'Allocatable'

    },
    {
      barColor: '#D1B854',
      text: data.cpu.current + ' CPU',
      data: data.cpu.current / data.cpu.capacity * 100,
      label1: 'Requests',
      label2: 'Allocatable'
    },
    {
      barColor: '#479D5F',
      text: data.memory.current + ' GiB',
      data: data.memory.current / data.memory.capacity * 100,
      label1: 'Memory Req.',
      label2: 'Allocatable'
    }
  ]

  const statusProgress = data.status === 'Ready' ? 100 : 0;

  return (
    <div className="group flex justify-start items-start border-b-[2px] border-b-[#111111] border-t-[2px] border-t-[transparent] hover:border-t-[#3e3e3e] hover:border-b-[#3e3e3e] pt-[1rem]  pb-[.65rem]">
      <div className="w-[21.15%] ml-[.9rem]">
        <div className="flex justify-start items-center">
          <div>
            <Text_16_400_EEEEEE>
              {data.hostname}
            </Text_16_400_EEEEEE>
            <Text_14_400_757575 className="mt-[.1rem]">
              {data.system_info.os}
            </Text_14_400_757575>
          </div>
        </div>
        <div className="flex flex-wrap justify-start items-start gap-x-[.4rem] gap-y-[.4rem] mt-[.6rem] ">
          {tagData.map((item, index) => (
            <Tags
              key={index}
              name={item.name}
              color={item.color}
              textClass="text-[.75rem]"
              classNames="!py-[.26rem]"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between items-center w-[8%]">
        <div className="max-w-[5rem]">
          <Text_12_400_757575 className="text-center">Node {data.status} Status</Text_12_400_757575>
        </div>
        <div className="flex justify-center items-baseline mt-[.6rem] mb-[.7rem]">
          <Text_14_400_EEEEEE>
            {statusProgress}
          </Text_14_400_EEEEEE>
          <Text_10_400_EEEEEE>%</Text_10_400_EEEEEE>
        </div>
        <div className="flex justify-start items-start gap-[.25rem]">
          {Array.from({ length: statusProgress / 10 }).map((_, index) => (
            <div
              key={index}
              className="h-[1.5rem] w-[0.25rem] bg-[#479D5F]"
            ></div>
          ))}
        </div>
      </div>
      {chartData.map((item, index) => (
        <CompareGraph key={index} data={item} />
      ))}
      <div className="flex flex-col justify-start items-center w-[12%]">
        <div>
          <Text_12_400_757575 className="text-center">Network I/O</Text_12_400_757575>
        </div>
        <div className="flex justify-center items-baseline mt-[.85rem]">
          <Text_14_400_EEEEEE>
            {data?.network?.bandwidth[data?.network?.bandwidth.length - 1].mbps}
          </Text_14_400_EEEEEE>
          <Text_10_400_EEEEEE>
            Mbps
          </Text_10_400_EEEEEE>
        </div>
        <div className="w-full flex justify-center items-start px-[10%]">
          <DirectionArrowChart
            categories={getCategories("today", data?.network.bandwidth?.map((item) => ({ timestamp: item.timestamp, value: item.mbps })))}
            data={getChartData("today", data?.network.bandwidth?.map((item) => ({ timestamp: item.timestamp, value: item.mbps })))}
            chartAdjust={{ top: '0' }} classNames="h-[60px] pt-[5px]" />
        </div>
      </div>
      <div className="flex flex-col justify-start items-center w-[7.5%]">
        <div>
          <Text_12_400_757575 className="text-center">Events</Text_12_400_757575>
        </div>
        <div>
          <div className="w-[2rem] h-[2rem] rounded-[4px] bg-[#1F1F1F] mt-[.2rem] flex justify-center items-center mt-[.9rem]">
            <Text_12_400_EEEEEE>
              {data.events_count > 99 ? '99+' : data.events_count || 0}
            </Text_12_400_EEEEEE>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-auto justify-start items-center flex-auto pr-[.9rem]">
        <Button className="flex justify-center items-center group border-[1px] border-[#757575] bg-[#1F1F1F] max-w-[5.6rem] max-h-[1.8rem] gap-[.1rem] px-[.2rem] pl-[.6rem] pr-[.3rem] mt-[2.5rem] hover:border-[#EEEEEE] opacity-0 group-hover:opacity-100"
          onClick={() => {
            openDrawer('cluster-event');
            setSelectedNode(data);
          }}
        >
          <Text_12_400_EEEEEE>See More</Text_12_400_EEEEEE>
          <ChevronRight className="text-[#B3B3B3] w-[1rem] h-auto" />
        </Button>
      </div>
    </div>
  )
}


interface GeneralProps {
  data: Cluster;
}
const totalRequData: any = {
  categories: ["27-12-2024", "28-12-2024", "29-12-2024", "30-12-2024", "31-12-2024", "01-01-2025", "02-01-2025"],
  data: [0, 38, 16, 88, 0, 70, 30],
};

const ClusterNodes: React.FC<GeneralProps> = () => {
  const router = useRouter();
  const [nodeMetrics, setNodeMetrics] = useState<any>(null);
  const { clustersId } = router.query;
  const [loading, setLoading] = useState<boolean>(true);

  const { getClusterNodeMetrics } = useCluster();
  useLoaderOnLoding(loading);

  useEffect(() => {
    if (clustersId) {
      setLoading(true);
      getClusterNodeMetrics(clustersId as string).then((res) => {
        setNodeMetrics(res);
        setLoading(false);
      });
    }
  }, [clustersId]);

  return (
    <div className="w-full pt-[0.5rem]">
      {nodeMetrics && Object.keys(nodeMetrics).length > 0 ? Object.keys(nodeMetrics).map((key, index) => (
        <NodeRow key={index} data={nodeMetrics[key]} ip={key} />
      )) : <>
        {!loading && <NoDataFount
          classNames="h-[60vh]"
          textMessage="No nodes found"
        />}
      </>}
    </div>
  );
};

export default ClusterNodes;
