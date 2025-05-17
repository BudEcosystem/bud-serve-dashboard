"use client";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Text_12_300_EEEEEE, Text_12_400_EEEEEE } from "@/components/ui/text";
import { Project, useProjects } from "src/hooks/useProjects";
import { useDrawer } from "src/hooks/useDrawer";
import { Tabs, Image, Popover, ConfigProvider, Select, Table } from "antd";
import Tags from "src/flows/components/DrawerTags";
import { CustomBreadcrumb } from "@/components/ui/bud/card/DrawerBreadCrumbNavigation";
import BackButton from "@/components/ui/bud/drawer/BackButton";
import { formatDate } from "src/utils/formatDate";
import { notification } from "antd";
import { useOverlay } from "src/context/overlayContext";
import { openWarning } from "@/components/warningMessage";
import { useEndPoints } from "src/hooks/useEndPoint";
import useHandleRouteChange from "@/lib/useHandleRouteChange";
import { useUser } from "src/stores/useUser";
import { useCluster } from "src/hooks/useCluster";
import PageHeader from "@/components/ui/pageHeader";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";
import CustomPopover from "src/flows/components/customPopover";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/bud/form/Buttons";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import NoDataFount from "@/components/ui/noDataFount";
import { SortIcon } from "@/components/ui/bud/table/SortIcon";
import ProjectTags from "src/flows/components/ProjectTags";
import { capitalize } from "@/lib/utils";
import { endpointStatusMapping } from "@/lib/colorMapping";
import DashBoardLayout from "../layout";
import { useLoader } from "src/context/appContext";
import { useBenchmarks } from "src/hooks/useBenchmark";
import { IconOnlyRender } from "src/flows/components/BudIconRender";
import { usePerfomanceBenchmark } from "src/stores/usePerfomanceBenchmark";

const defaultFilter = {
  benchmarkName: "",
  status: "",
};

interface DataType {
  key?: string;
  created_at?: string;
  model: [];
  cluster: [];
  name?: string;
  modelName?: string;
  modelImage?: string;
  clusterName?: string;
  clusterImage?: string;
  node_type?: any;
  vendor_type?: string;
  status?: string;
  concurrency?: any;
  tpot?: string;
  ttft?: string;
  id?: string;
}

const PerfomanceBenchmarks = () => {
  const { reset } = usePerfomanceBenchmark();
  const {
    benchmarks,
    totalUsers,
    getBenchmarks,
    setSelectedBenchmark,
    selectedBenchmark,
    getBenchmarkModelClusterDetails,
  } = useBenchmarks();
  const { isLoading, showLoader, hideLoader } = useLoader();
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);
  const { hasProjectPermission, hasPermission } = useUser();
  const { setOverlayVisible } = useOverlay();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("1");
  const [isHovered, setIsHovered] = useState(false);
  const { clustersId } = router.query; // Access the dynamic part of the route
  const { openDrawer } = useDrawer();
  const {
    setSelectedProjectId,
    selectedProject: selectedProjectResult,
    deleteProject,
    setProjectValues,
    projectMembers,
    selectedProjectId,
  } = useProjects();
  const {
    clusters,
    getClusters,
    setCluster,
    loading,
    deleteCluster,
    setClusterValues,
    getClusterById,
  } = useCluster();

  const { endPointsCount } = useEndPoints();
  const [selectedProject, setProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<{
    benchmarkName?: string;
    status?: string;
  }>(defaultFilter);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [tempFilter, setTempFilter] = useState<any>({});
  const [filterReset, setFilterReset] = useState(false);
  const [order, setOrder] = useState<"-" | "">("");
  const [orderBy, setOrderBy] = useState<string>("created_at");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedBenchmark) {
      getBenchmarkModelClusterDetails(selectedBenchmark.id);
    }
  }, [selectedBenchmark]);

  const handleOpenChange = (open) => {
    setFilterOpen(open);
    setTempFilter(filter);
  };

  const resetFilter = () => {
    // setFilter(defaultFilter);
    setTempFilter({ defaultFilter });
    setCurrentPage(1);
    // setFilterOpen(false);
    // load(defaultFilter);
    setFilterReset(true);
  };

  const applyFilter = () => {
    setFilterOpen(false);
    setFilter(tempFilter);
    setCurrentPage(1);
    // load(tempFilter);
    setFilterReset(false);
  };

  useEffect(() => {
    if (selectedProjectResult) {
      setProject(selectedProjectResult);
    }
  }, [selectedProjectResult]);

  useHandleRouteChange(() => {
    notification.destroy();
  });

  const goBack = () => {
    router.back();
  };

  const load = useCallback(
    async (filter) => {
      showLoader();
      await getBenchmarks({
        ...filter,
        page: currentPage,
        limit: pageSize,
        name: filter.benchmarkName || undefined,
        search: !!filter.benchmarkName,
        order_by: "-created_at",
      });
      hideLoader();
    },
    [currentPage, pageSize, getBenchmarks]
  );

  useEffect(() => {
    console.log("filter", filter);
    load(filter);
  }, [currentPage, pageSize, getBenchmarks, filter]);

  useEffect(() => {
    if (filterReset) {
      applyFilter();
    }
  }, [filterReset]);

  const HeaderContent = () => {
    return (
      <div className="flex justify-between items-center">
        {isMounted && (
          <div className="flex justify-start items-center">
            <BackButton onClick={goBack} />
            <CustomBreadcrumb
              urls={["/modelRepo", ``, ``]}
              data={["Models", `Performance Benchmarks`]}
            />
          </div>
        )}
      </div>
    );
  };
  const triggerDeleteNotification = () => {
    let description =
      endPointsCount > 0
        ? "The deployments are running and you will not be allowed to delete the project. In order to delete the project, you will have to pause or delete all deployments in order to delete the project."
        : "There are no running deployments, you can delete the project.";
    let title =
      endPointsCount > 0
        ? "You’re not allowed to delete the Project"
        : "You’re about to delete the Project";
    const updateNotificationMessage = openWarning({
      title: title, // Replace 'entityName' with the actual value
      description: description,
      deleteDisabled: endPointsCount > 0,
      onDelete: () => {
        deleteProject(selectedProjectId, router).then((result) => {
          // deleteProject('9290dfd0-2225-4f38-bee8-9d5e89c3b7', router).then((result) => {
          if (result.success) {
            setOverlayVisible(false);
            notification.destroy(`${title}-delete-notification`);
          } else {
            updateNotificationMessage("An unknown error occurred.");
          }
        });
      },
      onCancel: () => {
        setOverlayVisible(false);
      },
    });
  };

  const handlePageChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  return (
    <DashBoardLayout>
      <div className="boardPageView ">
        <div className="boardPageTop pt-0 px-0 pb-[0]">
          <div className="px-[1.2rem] pt-[1.05rem] pb-[1.15rem] mb-[2.15rem] border-b-[1px] border-b-[#1F1F1F]">
            <HeaderContent />
          </div>
          <div className="px-[3.5rem] boardPageTop pt-[0]">
            <PageHeader
              headding="Performance Benchmarks"
              text="Bud Performance benchmarking tools allows model evaluation on different clusters & Nodes to check its performance on the hardware"
              buttonLabel={"Run Another Benchmark"}
              hClass=""
              buttonAction={() => {
                reset();
                openDrawer("model_benchmark");
                // reset();
              }}
              rightComponent={
                <>
                  <SearchHeaderInput
                    classNames="mr-[1rem]"
                    placeholder="Search by name or tags"
                    searchValue={filter.benchmarkName || ""}
                    setSearchValue={(value) => {
                      setFilter({ ...filter, benchmarkName: value });
                    }}
                  />

                  <Popover
                    open={filterOpen}
                    onOpenChange={handleOpenChange}
                    content={
                      <div className="bg-[#111113] shadow-none  border border-[#1F1F1F] rounded-[6px] width-348">
                        <div className="p-[1.5rem] flex items-start justify-start flex-col">
                          <div className="text-[#FFFFFF] text-14 font-400">
                            Filter
                          </div>
                          <div className="text-12 font-400 text-[#757575]">
                            Apply the following filters to find model of your
                            choice.
                          </div>
                        </div>
                        <div className="height-1 bg-[#1F1F1F] mb-[1.5rem] w-full"></div>
                        <div className="w-full flex flex-col gap-size-20 px-[1.5rem] pb-[1.5rem]">
                          <div
                            className={`rounded-[6px] relative !bg-[transparent] !w-[100%] mb-[0]`}
                          >
                            <div className="w-full">
                              <Text_12_300_EEEEEE className="absolute bg-[#101010] -top-1.5 left-[1.1rem] tracking-[.035rem] z-10 flex items-center gap-1 text-nowrap">
                                Status
                                <CustomPopover title="This is the author">
                                  <Image
                                    src="/images/info.png"
                                    preview={false}
                                    alt="info"
                                    style={{
                                      width: ".75rem",
                                      height: ".75rem",
                                    }}
                                  />
                                </CustomPopover>
                              </Text_12_300_EEEEEE>
                            </div>
                            <div className="custom-select-two w-full rounded-[6px] relative">
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorTextPlaceholder: "#808080",
                                    boxShadowSecondary: "none",
                                  },
                                }}
                              >
                                <Select
                                  variant="borderless"
                                  placeholder="Select status"
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "#EEEEEE",
                                    border: "0.5px solid #757575",
                                    width: "100%",
                                  }}
                                  value={tempFilter.status}
                                  size="large"
                                  className="drawerInp !bg-[transparent] text-[#EEEEEE] py-[.6rem] font-[300]  text-[.75rem] shadow-none w-full indent-[.4rem] border-0 outline-0 hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE] h-[2.5rem] outline-none"
                                  options={[
                                    { label: "Success", value: "success" },
                                    { label: "Failed", value: "failed" },
                                    {
                                      label: "Processing",
                                      value: "processing",
                                    },
                                  ]}
                                  onChange={(value) => {
                                    setTempFilter({
                                      ...tempFilter,
                                      status: value,
                                    });
                                  }}
                                  tagRender={(props) => {
                                    const { label } = props;
                                    return (
                                      <Tags name={label} color="#D1B854"></Tags>
                                    );
                                  }}
                                />
                              </ConfigProvider>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <SecondaryButton
                              type="button"
                              onClick={resetFilter}
                              classNames="!px-[.8rem] tracking-[.02rem] mr-[.5rem]"
                            >
                              Reset
                            </SecondaryButton>
                            <PrimaryButton
                              type="submit"
                              onClick={applyFilter}
                              classNames="!px-[.8rem] tracking-[.02rem]"
                            >
                              Apply
                            </PrimaryButton>
                          </div>
                        </div>
                      </div>
                    }
                    trigger={["click"]}
                  >
                    <label
                      className="h-[1.7rem] text-[#FFFFFF] mx-2 flex items-center cursor-pointer text-xs font-normal leading-3 rounded-[6px] shadow-none bg-transparent"
                      onClick={() => {}}
                    >
                      <MixerHorizontalIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                        className="mr-2"
                      />
                      {/* <Text_12_400_C7C7C7>Filter</Text_12_400_C7C7C7> */}
                    </label>
                  </Popover>
                </>
              }
            />
          </div>
        </div>
        <div className="projectDetailsDiv pt-[2.6rem] CommonCustomPagination">
          <Table<DataType>
            columns={[
              {
                title: "Benchmark Name",
                dataIndex: "name",
                key: "name",
                render: (text) => (
                  <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>
                ),
                sortOrder:
                  orderBy === "name"
                    ? order === "-"
                      ? "descend"
                      : "ascend"
                    : undefined,
                sorter: true,
                sortIcon: SortIcon,
              },
              {
                title: "Date",
                dataIndex: "created_at",
                key: "created_at",
                minWidth: 150,
                render: (text) => (
                  <Text_12_400_EEEEEE className="text-nowrap">
                    {formatDate(text)}
                  </Text_12_400_EEEEEE>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Model Name",
                dataIndex: "model",
                key: "model",
                width: "auto",
                className:
                  "min-w-[280px] 1680px:min-w-[300px] 1920:min-w-[500px]",
                render: (text, record) => (
                  <div className="flex justify-start items-center gap-[.5rem]">
                    {/* {record.modelImage && (
                      <div className='w-[0.875rem] h-[0.875rem] mr-[.4rem]'>
                        <Image src={`${record.modelImage}`} preview={false}
                          style={{ width: '0.875rem' }}
                        />
                      </div>
                    )} */}
                    <div className="w-[0.875rem] h-[0.875rem]">
                      <IconOnlyRender
                        icon={text?.["icon"] || text?.provider?.["icon"]}
                        type={text?.["provider_type"]}
                        imageSize={14}
                      />
                    </div>
                    <Text_12_400_EEEEEE className="truncate">
                      {text.name}
                    </Text_12_400_EEEEEE>
                  </div>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Cluster Name",
                key: "cluster",
                dataIndex: "cluster",
                sortOrder:
                  orderBy === "status"
                    ? order === "-"
                      ? "descend"
                      : "ascend"
                    : undefined,
                sorter: true,
                render: (name, record) => (
                  <div className="flex justify-start items-center gap-[.5rem]">
                    {/* <div className='w-[0.875rem] h-[0.875rem] mr-[.4rem]'>
                    <Image src={`${name?.['icon']}`} preview={false}
                      style={{ width: '0.875rem' }}
                    />
                  </div> */}
                    <div className="w-[0.875rem] h-[0.875rem]">
                      <IconOnlyRender
                        icon={name?.["icon"]}
                        type={record?.["provider_type"]}
                        imageSize={14}
                      />
                    </div>
                    <Text_12_400_EEEEEE className="text-nowrap">
                      {name.name}
                    </Text_12_400_EEEEEE>
                  </div>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Node Type",
                dataIndex: "node_type",
                key: "node_type",
                render: (text) => (
                  <div className="flex gap-[.4rem]">
                    <Text_12_400_EEEEEE>
                      {text.toUpperCase()}
                    </Text_12_400_EEEEEE>
                  </div>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Vendor Type",
                dataIndex: "vendor_type",
                sorter: true,
                key: "vendor_type",
                minWidth: 150,
                className: "text-nowrap",
                sortOrder:
                  orderBy === "created_at"
                    ? order === "-"
                      ? "descend"
                      : "ascend"
                    : undefined,
                render: (text) => (
                  <div className="w-[auto] text-nowrap h-[1.25rem]">
                    {/* <Image src={`${text}`} preview={false}
                    style={{ height: '1.25rem', width: 'auto' }}
                  /> */}
                    <div className="w-auto h-[1.25rem] flex items-center justify-start gap-[.7rem]">
                      {text.toLowerCase().includes("intel") && (
                        <Image
                          preview={false}
                          src="/images/icons/intel.png"
                          alt="info"
                          style={{ width: "auto", height: "1.25rem" }}
                        />
                      )}
                      {text.toLowerCase().includes("amd") && (
                        <Image
                          preview={false}
                          src="/images/icons/amd.png"
                          alt="info"
                          style={{ width: "auto", height: "0.59725rem" }}
                        />
                      )}
                      {text.toLowerCase().includes("nvidia") && (
                        <Image
                          preview={false}
                          src="/images/icons/nvdia.png"
                          alt="info"
                          style={{ width: "auto", height: "1.25rem" }}
                        />
                      )}
                    </div>
                  </div>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Status",
                key: "status",
                dataIndex: "status",
                sortOrder:
                  orderBy === "status"
                    ? order === "-"
                      ? "descend"
                      : "ascend"
                    : undefined,
                sorter: true,
                render: (status) => (
                  <span>
                    <ProjectTags
                      name={capitalize(status)}
                      color={endpointStatusMapping[capitalize(status)]}
                    />
                  </span>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "Concurrent Requests",
                dataIndex: "concurrency",
                key: "concurrency",
                render: (text, record) => (
                  <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "TPOT",
                dataIndex: "tpot",
                key: "tpot",
                render: (text, record) => (
                  <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>
                ),
                sortIcon: SortIcon,
              },
              {
                title: "TTFT",
                dataIndex: "ttft",
                key: "ttft",
                render: (text, record) => (
                  <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>
                ),
                sortIcon: SortIcon,
              },
            ]}
            // loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalUsers,
              onChange: handlePageChange,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            dataSource={benchmarks}
            bordered={false}
            footer={null}
            virtual
            onRow={(record, rowIndex) => {
              return {
                onClick: async (event) => {
                  if (record.status != "processing") {
                    router.push(`/modelRepo/benchmarks-history/${record.id}`);
                    setSelectedBenchmark(record);
                  }
                },
              };
            }}
            onChange={(
              pagination,
              filters,
              sorter: {
                order: "ascend" | "descend";
                field: string;
              },
              extra
            ) => {
              setOrder(sorter.order === "ascend" ? "" : "-");
              setOrderBy(sorter.field);
            }}
            showSorterTooltip={true}
            locale={{
              emptyText: (
                <NoDataFount
                  classNames="h-[20vh] max-w-[70vw]"
                  textMessage={`No Benchmarks`}
                />
              ),
            }}
          />
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default PerfomanceBenchmarks;
