"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import { Table, Tag, Popover, ConfigProvider, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  Text_12_400_EEEEEE,
  Text_16_600_FFFFFF,
  Text_12_300_EEEEEE,
  Text_12_400_B3B3B3,
} from "@/components/ui/text";
import { PrimaryButton, SecondaryButton } from "@/components/ui/bud/form/Buttons";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";
import NoDataFount from "@/components/ui/noDataFount";
import { SortIcon } from "@/components/ui/bud/table/SortIcon";
import { formatDate } from "@/utils/formatDate";
import Tags from "src/flows/components/DrawerTags";
import ProjectTags from "src/flows/components/ProjectTags";
import { capitalize } from "@/lib/utils";
import { endpointStatusMapping } from "@/lib/colorMapping";


interface ExperimentData {
  id: string;
  experimentName: string;
  models: string;
  traits: string;
  tags: string[];
  status: "Running" | "Completed" | "Failed";
  createdDate: string;
}

interface ExperimentFilters {
  status?: string[];
  tags?: string[];
}

const defaultFilter: ExperimentFilters = {
  status: [],
  tags: [],
};

const ExperimentsTable = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [experiments, setExperiments] = useState<ExperimentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<ExperimentFilters>(defaultFilter);
  const [filter, setFilter] = useState<ExperimentFilters>(defaultFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(100);
  const totalItems = 100;

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData: ExperimentData[] = [
      {
        id: "1",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Running",
        createdDate: "2024-01-13",
      },
      {
        id: "2",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Running",
        createdDate: "2024-01-13",
      },
      {
        id: "3",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Completed",
        createdDate: "2024-01-13",
      },
      {
        id: "4",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Completed",
        createdDate: "2024-01-13",
      },
      {
        id: "5",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Completed",
        createdDate: "2024-01-13",
      },
      {
        id: "6",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Failed",
        createdDate: "2024-01-13",
      },
      {
        id: "7",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Failed",
        createdDate: "2024-01-13",
      },
      {
        id: "8",
        experimentName: "name",
        models: "name",
        traits: "name",
        tags: ["tag1", "tag2"],
        status: "Failed",
        createdDate: "2024-01-13",
      },
    ];
    setExperiments(mockData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "#D1B854";
      case "Completed":
        return "#52C41A";
      case "Failed":
        return "#FF4D4F";
      default:
        return "#757575";
    }
  };

  const columns: ColumnsType<ExperimentData> = [
    {
      title: "Experiment name",
      dataIndex: "experimentName",
      key: "experimentName",
      render: (text) => <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>,
      sorter: true,
      sortOrder:
        orderBy === "experimentName"
          ? order === "-"
            ? "descend"
            : "ascend"
          : undefined,
      sortIcon: SortIcon,
    },
    {
      title: "Models",
      dataIndex: "models",
      key: "models",
      render: (text) => <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>,
    },
    {
      title: "Traits",
      dataIndex: "traits",
      key: "traits",
      render: (text) => <Text_12_400_EEEEEE>{text}</Text_12_400_EEEEEE>,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <Tags
              key={index}
              name={tag}
              color="#D1B854"
              classNames="text-center justify-center items-center"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <ProjectTags
          name={capitalize(status)}
          color={endpointStatusMapping[capitalize(status) === 'Running' ? capitalize(status) + '-yellow' : capitalize(status)]}
          textClass="text-[.75rem] py-[.22rem]"
          tagClass="py-[0rem]"
        />
      ),
      sorter: true,
      sortOrder:
        orderBy === "status" ? (order === "-" ? "descend" : "ascend") : undefined,
      sortIcon: SortIcon,
    },
    {
      title: (
        <div className="flex items-center">
          Created Date
          <svg
            className="ml-1"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7.5L6 10.5L9 7.5M3 4.5L6 1.5L9 4.5"
              stroke="#757575"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (
        <Text_12_400_EEEEEE>
          {formatDate(date)}
        </Text_12_400_EEEEEE>
      ),
      sorter: true,
      sortOrder:
        orderBy === "createdDate"
          ? order === "-"
            ? "descend"
            : "ascend"
          : undefined,
      sortIcon: SortIcon,
    },
    {
      title: "",
      key: "action",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end">
          <PrimaryButton
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/home/evaluations/experiments/${record.id}`);
            }}
            classNames="!px-4 !py-1 !text-xs opacity-0 group-hover:opacity-100"
          >
            View Experiment
          </PrimaryButton>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    let data = experiments;

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      data = data.filter(
        (exp) =>
          exp.experimentName.toLowerCase().includes(searchLower) ||
          exp.models.toLowerCase().includes(searchLower) ||
          exp.traits.toLowerCase().includes(searchLower) ||
          exp.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filter.status && filter.status.length > 0) {
      data = data.filter((exp) => filter.status.includes(exp.status));
    }

    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      data = data.filter((exp) =>
        exp.tags.some((tag) => filter.tags.includes(tag))
      );
    }

    return data;
  }, [experiments, searchValue, filter]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setOrder(sorter.order === "ascend" ? "" : "-");
      setOrderBy(sorter.field);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setFilterOpen(open);
    setTempFilter(filter);
  };

  const applyFilter = () => {
    setFilterOpen(false);
    setFilter(tempFilter);
  };

  const resetFilter = () => {
    setTempFilter(defaultFilter);
    setFilter(defaultFilter);
    setFilterOpen(false);
  };

  const removeSelectedTag = (key: string, value: string) => {
    if (key === "status") {
      setFilter({
        ...filter,
        status: filter.status.filter((s) => s !== value),
      });
    } else if (key === "tags") {
      setFilter({
        ...filter,
        tags: filter.tags.filter((t) => t !== value),
      });
    }
  };

  // Get unique tags from all experiments for filter options
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    experiments.forEach((exp) => {
      exp.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [experiments]);

  return (
    <div className="h-full w-full relative pt-[2.5rem]">
      {/* Selected Filters */}
      {/* {(filter.status?.length > 0 || filter.tags?.length > 0) && (
        <div className="flex justify-start gap-[.4rem] items-center absolute top-[4.5rem] left-[0.75rem] z-10">
          {filter.status?.map((status, index) => (
            <Tags
              key={`status-${index}`}
              name={`Status: ${status}`}
              color="#d1b854"
              closable
              onClose={() => removeSelectedTag("status", status)}
            />
          ))}
          {filter.tags?.map((tag, index) => (
            <Tags
              key={`tag-${index}`}
              name={`Tag: ${tag}`}
              color="#d1b854"
              closable
              onClose={() => removeSelectedTag("tags", tag)}
            />
          ))}
        </div>
      )} */}
      <div className="userTable evalTable relative CommonCustomPagination">
        <Table<ExperimentData>
          columns={columns}
          dataSource={filteredData}
          pagination={{
            className: 'small-pagination',
            current: currentPage,
            pageSize: pageSize,
            total: totalUsers,
            // onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          loading={loading}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => router.push(`/home/evaluations/experiments/${record.id}`),
            style: { cursor: "pointer" },
            className: 'group'
          })}
          showSorterTooltip={false}
          rowKey="id"
          className="experiments-table"
          title={() => (
            <div className="flex justify-between items-center px-[0.75rem] py-[1rem]">
              <Text_16_600_FFFFFF>Experiments</Text_16_600_FFFFFF>
              <div className="flex items-center gap-3">
                <SearchHeaderInput
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  placeholder="Search experiments..."
                />
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgElevated: "#101010",
                      colorBorder: "#1F1F1F",
                    },
                  }}
                >
                  <Popover
                    open={filterOpen}
                    onOpenChange={handleOpenChange}
                    placement="bottomRight"
                    content={
                      <div className="w-[22rem] bg-[#101010] rounded-lg">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F1F1F]">
                          <Text_16_600_FFFFFF>Filter</Text_16_600_FFFFFF>
                          <button
                            onClick={() => setFilterOpen(false)}
                            className="text-[#B3B3B3] hover:text-[#FFFFFF]"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4 space-y-4">
                          <Text_12_400_B3B3B3 className="mb-4">
                            Filter experiments by status and tags
                          </Text_12_400_B3B3B3>

                          {/* Status Filter */}
                          <div className="rounded-[6px] relative !bg-[transparent] !w-[100%]">
                            <div className="w-full">
                              <Text_12_300_EEEEEE className="absolute bg-[#101010] -top-1.5 left-[1.1rem] px-1 tracking-[.035rem] z-10">
                                Status
                              </Text_12_300_EEEEEE>
                            </div>
                            <div className="custom-select-two w-full rounded-[6px] relative">
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorTextPlaceholder: "#808080",
                                  },
                                }}
                              >
                                <Select
                                  placeholder="Select Status"
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "#EEEEEE",
                                    border: "0.5px solid #757575",
                                    width: "100%",
                                  }}
                                  value={tempFilter.status}
                                  size="large"
                                  className="drawerInp !bg-[transparent] text-[#EEEEEE] py-[.6rem] font-[300] text-[.75rem] shadow-none w-full indent-[.4rem] border-0 outline-0 hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE] h-[2.59338rem] outline-none"
                                  options={[
                                    { label: "Running", value: "Running" },
                                    { label: "Completed", value: "Completed" },
                                    { label: "Failed", value: "Failed" },
                                  ]}
                                  mode="multiple"
                                  onChange={(value) => {
                                    setTempFilter({
                                      ...tempFilter,
                                      status: value,
                                    });
                                  }}
                                  tagRender={(props) => {
                                    const { label } = props;
                                    return (
                                      <Tags
                                        name={label}
                                        color="#D1B854"
                                        classNames="text-center justify-center items-center"
                                      />
                                    );
                                  }}
                                />
                              </ConfigProvider>
                            </div>
                          </div>

                          {/* Tags Filter */}
                          <div className="rounded-[6px] relative !bg-[transparent] !w-[100%]">
                            <div className="w-full">
                              <Text_12_300_EEEEEE className="absolute bg-[#101010] -top-1.5 left-[1.1rem] px-1 tracking-[.035rem] z-10">
                                Tags
                              </Text_12_300_EEEEEE>
                            </div>
                            <div className="custom-select-two w-full rounded-[6px] relative">
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorTextPlaceholder: "#808080",
                                  },
                                }}
                              >
                                <Select
                                  placeholder="Select Tags"
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "#EEEEEE",
                                    border: "0.5px solid #757575",
                                    width: "100%",
                                  }}
                                  value={tempFilter.tags}
                                  size="large"
                                  className="drawerInp !bg-[transparent] text-[#EEEEEE] py-[.6rem] font-[300] text-[.75rem] shadow-none w-full indent-[.4rem] border-0 outline-0 hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE] h-[2.59338rem] outline-none"
                                  options={availableTags.map((tag) => ({
                                    label: tag,
                                    value: tag,
                                  }))}
                                  mode="multiple"
                                  onChange={(value) => {
                                    setTempFilter({
                                      ...tempFilter,
                                      tags: value,
                                    });
                                  }}
                                  tagRender={(props) => {
                                    const { label } = props;
                                    return (
                                      <Tags
                                        name={label}
                                        color="#D1B854"
                                        classNames="text-center justify-center items-center"
                                      />
                                    );
                                  }}
                                />
                              </ConfigProvider>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-2">
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
                      className="group h-[1.7rem] text-[#EEEEEE] mx-2 flex items-center cursor-pointer text-xs font-normal leading-3 rounded-[6px] shadow-none bg-transparent"
                      onClick={() => { }}
                    >
                      <MixerHorizontalIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                        className="text-[#B3B3B3] group-hover:text-[#FFFFFF]"
                      />
                    </label>
                  </Popover>
                </ConfigProvider>
              </div>
            </div>
          )}
          locale={{
            emptyText: <NoDataFount textMessage="No experiments found" />,
          }}
        />
      </div>
    </div>
  );
};

export default ExperimentsTable;