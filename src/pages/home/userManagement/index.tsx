/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  TextField,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";

import AddUserPopup from "../../../components/popups/user/addUserPopup";
import ViewUserPopup from "../../../components/popups/user/viewUserpopup";
import GeneratePassPopup from "../../../components/popups/user/generatePasswordPopup";
import AddDeleteDialog from "../../../components/popups/user/addDeletePopup";

import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import DashBoardLayout from "../layout";
import { AppRequest } from "./../../api/requests";
import { successToast } from "./../../../components/toast";


import { TextInput } from "@/components/ui/input";
import { useLoader } from "src/context/appContext";
import { PermissionEnum, useUser } from "src/stores/useUser";
import { Button, Popover, Table, TableProps, Image, ConfigProvider, Select } from "antd";
import { Text_12_300_EEEEEE, Text_12_400_EEEEEE, Text_12_600_EEEEEE } from "@/components/ui/text";
import Tags from "src/flows/components/DrawerTags";
import NoDataFount from "@/components/ui/noDataFount";
import { PrimaryButton, SecondaryButton } from "@/components/ui/bud/form/Buttons";
import PageHeader from "@/components/ui/pageHeader";
import ProjectTags from "src/flows/components/ProjectTags";
import { capitalize } from "@/lib/utils";
import { endpointStatusMapping } from "@/lib/colorMapping";
import SearchHeaderInput from "src/flows/components/SearchHeaderInput";
import CustomPopover from "src/flows/components/customPopover";
import { UserRoles, UserStatus, useUsers } from "src/hooks/useUsers";
import { useDrawer } from "src/hooks/useDrawer";
import NoAccess from "@/components/ui/noAccess";
// type PaginationPrevious = ... & React.ComponentProps<"button">
// testing
interface FormData {
  name: string;
  author: string;
  modality: string;
  type: string;
  source: string;
  uri: string;
  // hf_token: string;
  id: string;
  [key: string]: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  id: string;
  color: string;
  action?: any;
}

const defaultFilter = {
  name: "",
  email: "",
  role: "",
  status: "",
}

export default function UserManagement() {
  const { hasPermission } = useUser();

  const { isLoading, showLoader, hideLoader } = useLoader();

  const [isAddDeleteOpen, setIsAddDeleteOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isPassModalOpen, setPassModalOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>("");

  const [UsersData, setUsersData] = useState<any>([]);

  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 100;

  const [selectedRowData, setSelectedRowData] = useState<FormData | null>(null);

  const { users, totalUsers, getUsers, getUsersDetails, userDetails, getUsersPermissions, userPermissions } = useUsers();
  const [tempFilter, setTempFilter] = useState<any>({});
  const [filter, setFilter] = useState<
    {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    }
  >(defaultFilter);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterReset, setFilterReset] = useState(false);
  const { openDrawer } = useDrawer();

  type ColumnsType<T extends object> = TableProps<T>['columns'];
  type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
  type TablePaginationPosition<T extends object> = NonNullable<
    TablePagination<T>['position']
  >[number];

  const handleOpenChange = (open) => {
    setFilterOpen(open);
    // setTempFilter(filter);
  };

  const resetFilter = () => {
    setCurrentPage(1);
    setFilterReset(true);
    setTempFilter(defaultFilter);
    setFilter(defaultFilter);
  };
  const applyFilter = () => {
    setFilterReset(false);
    setFilter(tempFilter);
    setCurrentPage(1);
    load(tempFilter);
    setFilterOpen(false);
  };

  const load = useCallback(async (filter) => {
    if (hasPermission(PermissionEnum.UserManage)) {
      showLoader();
      await getUsers({
        page: currentPage,
        limit: pageSize,
        name: filter.name,
        email: filter.email,
        role: filter.role,
        status: filter.status,
        order_by: '-created_at',
      });
      hideLoader();
    }
  }, [currentPage, pageSize, getUsers]);

  useEffect(() => {
    console.log("filter", filter);
    load(filter);
  }, [currentPage, pageSize, getUsers]);
  
  useEffect(() => {
    if(filterReset) {
      applyFilter()
    }
  }, [filterReset]);



  useEffect(() => {
    // debounce
    const timer = setTimeout(() => {
      load(filter);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filter.email]);
  
  useEffect(() => {
    console.log('tempFilter', tempFilter)
  }, [tempFilter]);

  function SortIcon({ sortOrder }: { sortOrder: string }) {
    return sortOrder ? sortOrder === 'descend' ?
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.00078 2.10938C6.27692 2.10938 6.50078 2.33324 6.50078 2.60938L6.50078 9.40223L8.84723 7.05578C9.04249 6.86052 9.35907 6.86052 9.55433 7.05578C9.7496 7.25104 9.7496 7.56763 9.55433 7.76289L6.35433 10.9629C6.15907 11.1582 5.84249 11.1582 5.64723 10.9629L2.44723 7.76289C2.25197 7.56763 2.25197 7.25104 2.44723 7.05578C2.64249 6.86052 2.95907 6.86052 3.15433 7.05578L5.50078 9.40223L5.50078 2.60938C5.50078 2.33324 5.72464 2.10938 6.00078 2.10938Z" fill="#B3B3B3" />
      </svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.00078 10.8906C6.27692 10.8906 6.50078 10.6668 6.50078 10.3906L6.50078 3.59773L8.84723 5.94418C9.04249 6.13944 9.35907 6.13944 9.55433 5.94418C9.7496 5.74892 9.7496 5.43233 9.55433 5.23707L6.35433 2.03707C6.15907 1.84181 5.84249 1.84181 5.64723 2.03707L2.44723 5.23707C2.25197 5.43233 2.25197 5.74892 2.44723 5.94418C2.64249 6.13944 2.95907 6.13944 3.15433 5.94418L5.50078 3.59773L5.50078 10.3906C5.50078 10.6668 5.72464 10.8906 6.00078 10.8906Z" fill="#B3B3B3" />
      </svg>
      : null;
  }

  const updateUser = async (password) => {
    const payload = {
      name: selectedRowData.name,
      password: password,
    };
    showLoader();
    try {
      const response: any = await AppRequest.Patch(
        `/users/${selectedRowData?.id}`,
        payload
      );
      successToast(response.data.message);
      load(filter);
      setPassModalOpen(false);
      hideLoader();
    } catch (error) {
      console.error("Error creating model:", error);
      hideLoader();
    }
  };
  const addUser = async (payload) => {
    showLoader();
    try {
      const response: any = await AppRequest.Post(`/auth/register`, payload);
      successToast(response.data.message);
      load(filter);
      hideLoader();
    } catch (error) {
      console.error("Error creating model:", error);
      hideLoader();
    }
  };
  const deleteUser = async () => {
    showLoader();
    try {
      const response: any = await AppRequest.Delete(
        `/users/${selectedRowData?.id}`
      );
      successToast(response.data.message);
      load(filter);
      handleCloseDialogAddDelete();
      setSelectedRowData(null);
      hideLoader();
    } catch (error) {
      console.error("Error Deleting user:", error);
      hideLoader();
    }
  };

  const activateUser = async () => {
    const payload = {
      user_id: selectedRowData?.id,
    };
    showLoader();
    try {
      const response: any = await AppRequest.Patch(
        `/users/${selectedRowData?.id}/reactivate`,
        payload
      );
      successToast(response.data.message);
      load(filter);
      handleCloseDialogAddDelete();
      setSelectedRowData(null);
      hideLoader();
    } catch (error) {
      console.error("Error activating user:", error);
      hideLoader();
    }
  };
  const updateUserPermission = async (userPermissions) => {
    // Call API to create model
    showLoader();
    try {
      const response: any = await AppRequest.Put(
        `/permissions/${selectedRowData?.id}/global`,
        userPermissions
      );
      // If API call is successful, close the dialog
      successToast(response.data.message);
      setModalOpen(false);
      setInitialValues("");
      hideLoader();
    } catch (error) {
      console.error("Error creating model:", error);
      hideLoader();
    }
  };
  const searchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.value;
    // getUsers(currentPage, pageSize, data);
  };

  const handleModalSubmit = (data) => {
    updateUserPermission(data);
  };
  const handleAddSubmit = (data) => {
    addUser(data);
  };
  const handlePasswordSubmit = (data) => {
    updateUser(data.password);
  };
  const openUserPermissions = (data) => {
    setInitialValues(data.id);
    setSelectedRowData(data);
    // setModalOpen(true);

    getUsersDetails(data.id)
    getUsersPermissions(data.id)
    openDrawer('view-user');
  };
  const openPasswordPopup = (data) => {
    setSelectedRowData(data);
    setPassModalOpen(true);
    setInitialValues(data.id);
  };
  const handleOpenDialog = (item: any, action: any) => {
    setSelectedRowData(item);
    if (action == "delete") {
      setSelectedRowData((prevState) => ({
        ...prevState,
        itemTitle: `Remove ${item?.name}  from Bud Inference`,
        itemDescription: `You're about to remove a user from the platform, they will have no access.`,
        buttonLabel: `Delete User`,
        action: "delete",
      }));
    } else if (action == "add") {
      setSelectedRowData((prevState) => ({
        ...prevState,
        itemTitle: `Add ${item?.name}  to Bud Inference`,
        itemDescription: `You're about to add a user back to the platform, they will get their previous access.`,
        buttonLabel: `Restore`,
        action: "add",
      }));
    }
    setIsAddDeleteOpen(true);
  };
  const handleAddDeleteUser = () => {
    if (selectedRowData.action == "delete") {
      deleteUser();
    } else if (selectedRowData.action == "add") {
      activateUser();
    }
  };
  const handleCloseDialogAddDelete = () => {
    setIsAddDeleteOpen(false);
  };
  const handleViewClose = () => {
    setInitialValues("null");
  };
  useEffect(() => {
    if (!isModalOpen) {
      setInitialValues("null");
    }
  }, [isModalOpen]);
  useEffect(() => {
    // getUsers(currentPage, pageSize);
  }, [currentPage, pageSize, getUsers]);

  useEffect(() => {
    // openDrawer('add-user');
  }, []);
  // useEffect(() => {
  //   console.log('userDetails', userDetails)
  // }, [userDetails]);
 
  useEffect(() => {
    console.log('userPermissions', userPermissions)
  }, [userPermissions]);


  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text_12_400_EEEEEE className='whitespace-nowrap'>{text}</Text_12_400_EEEEEE>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortIcon: SortIcon,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Text_12_400_EEEEEE className='whitespace-nowrap'>{text}</Text_12_400_EEEEEE>,
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortIcon: SortIcon,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <Text_12_400_EEEEEE className='whitespace-nowrap'>{capitalize(text)}</Text_12_400_EEEEEE>,
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortIcon: SortIcon,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => <div className="flex">
        <ProjectTags
          name={capitalize(text)}
          color={endpointStatusMapping[capitalize(text)]}
          textClass="text-[.75rem] py-[.22rem]"
          tagClass="py-[0rem]"
        />
      </div>,
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortIcon: SortIcon,
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => <div className="visible-on-hover">
        {hasPermission(PermissionEnum.UserManage) && (
          <>
            {/* {record.status == "active" && (
              <Button
                className="bg-transparent p-0 m-0 w-[0.875rem] h-[0.875rem] border-[0]"
                onClick={(e) => {
                  e.stopPropagation();
                  openUserPermissions(record);
                }}
              >
                <Image
                  preview={false}
                  style={{ width: '0.9375rem', height: 'auto' }}
                  className="mainLogo"
                  src="icons/lock.png"
                  alt="Logo"
                />
              </Button>
            )}
            {record.status == "active" && (
              <Button
                className="bg-transparent p-0 m-0 w-[0.875rem] h-[0.875rem]  border-[0]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDialog(record, "delete")
                }}
              >
                <Image
                  preview={false}
                  style={{ width: '0.9375rem', height: 'auto' }}
                  className="mainLogo"
                  src="icons/deleteRed.png"
                  alt="Logo"
                />
              </Button>
            )} */}
            {record.status == "deleted" && (
              <Button
                className="bg-transparent p-0 m-0 w-[0.875rem] h-[0.875rem] border-[0]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDialog(record, "add")
                }}
              >
                <Image
                  preview={false}
                  style={{ width: '0.9375rem', height: 'auto' }}
                  className="mainLogo"
                  src="icons/restore.png"
                  alt="Logo"
                />
              </Button>
            )}
          </>
        )}
      </div>,
      sortIcon: SortIcon,
    },
  ];

  const handlePageChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  return (
    <DashBoardLayout>
      <div className="boardPageView">
        <div className="boardPageTop">

          <PageHeader
            headding="User Management"
            ButtonIcon={PlusIcon}
            buttonLabel={hasPermission(PermissionEnum.UserManage) ? "Add User" : ""}
            // buttonAction={() => openFlow("project-success")}
            buttonAction={() => {
              openDrawer('add-user');
              // setAddModalOpen(true)
            }}
            rightComponent={hasPermission(PermissionEnum.UserManage) &&
              <>
                <SearchHeaderInput placeholder="Search by name or email" searchValue={
                  filter.name || filter.email || ""
                } 
                setSearchValue={(value) => {
                  setFilter({ ...filter, email: value, name: value });
                }} />

                <Popover
                  placement="bottomRight"
                  arrow={false}
                  open={filterOpen}
                  onOpenChange={handleOpenChange}
                  content={
                    <div
                      className="bg-[#111113] shadow-none  border border-[#1F1F1F] rounded-[6px] width-348">
                      <div className="p-[1.5rem] flex items-start justify-start flex-col">
                        <div className="text-[#FFFFFF] text-14 font-400">
                          Filter
                        </div>
                        <div className="text-12 font-400 text-[#757575]">Apply the following filters to find users of your choice.</div>
                      </div>
                      <div className="height-1 bg-[#1F1F1F] mb-[1.5rem] w-full"></div>
                      <div className="w-full flex flex-col gap-size-20 px-[1.5rem] pb-[1.5rem]">
                        <div
                          className={`rounded-[6px] relative !bg-[transparent] !w-[100%] mb-[0]`}
                        >
                          <div className="w-full">
                            <Text_12_300_EEEEEE className="absolute bg-[#101010] -top-1.5 left-[1.1rem] tracking-[.035rem] z-10 flex items-center gap-1 text-nowrap">
                              Role
                              <CustomPopover title="Select user role" >
                                <Image
                                  src="/images/info.png"
                                  preview={false}
                                  alt="info"
                                  style={{ width: '.75rem', height: '.75rem' }}
                                />
                              </CustomPopover>
                            </Text_12_300_EEEEEE>
                          </div>
                          <div className="custom-select-two w-full rounded-[6px] relative">
                            <ConfigProvider
                              theme={{
                                token: {
                                  colorTextPlaceholder: '#808080',
                                  boxShadowSecondary: 'none',

                                },
                              }}
                            >
                              <Select
                                variant="borderless"
                                placeholder="Select Role"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#EEEEEE",
                                  border: "0.5px solid #757575",
                                  width: "100%",
                                }}
                                size="large"
                                value={tempFilter.role || undefined}
                                className="drawerInp !bg-[transparent] text-[#EEEEEE] py-[.6rem] font-[300]  text-[.75rem] shadow-none w-full indent-[.4rem] border-0 outline-0 hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE] h-[2.5rem] outline-none"
                                options={UserRoles.map((item, index) => ({
                                  label: item.label,
                                  value: item.value,
                                }))}
                                onChange={(value) => {
                                  setTempFilter({ ...tempFilter, role: value });
                                }}
                                // tagRender={(props) => {
                                //   const { label } = props;
                                //   return (
                                //     <Tags
                                //       name={label}
                                //       color="#D1B854"
                                //     >
                                //     </Tags>
                                //   );
                                // }}
                              />
                            </ConfigProvider>
                          </div>
                        </div>
                        <div
                          className={`rounded-[6px] relative !bg-[transparent] !w-[100%] mb-[0]`}
                        >
                          <div className="w-full">
                            <Text_12_300_EEEEEE className="absolute bg-[#101010] -top-1.5 left-[1.1rem] tracking-[.035rem] z-10 flex items-center gap-1 text-nowrap">
                              Status
                              <CustomPopover title="Select user status" >
                                <Image
                                  src="/images/info.png"
                                  preview={false}
                                  alt="info"
                                  style={{ width: '.75rem', height: '.75rem' }}
                                />
                              </CustomPopover>
                            </Text_12_300_EEEEEE>
                          </div>
                          <div className="custom-select-two w-full rounded-[6px] relative">
                            <ConfigProvider
                              theme={{
                                token: {
                                  colorTextPlaceholder: '#808080',
                                },
                                components: {
                                  Select: {
                                    // multipleItemHeightSM: 16
                                  }
                                }
                              }}
                            >
                              <Select
                                placeholder="Select Status"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#EEEEEE",
                                  border: "0.5px solid #757575",
                                  width: "100%"
                                }}
                                size="large"
                                value={tempFilter.status || undefined}
                                className="drawerInp !bg-[transparent] text-[#EEEEEE] font-[300]  text-[.75rem] shadow-none w-full indent-[.5rem] border-0 outline-0 hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE]  outline-none"
                                options={UserStatus?.map((item, index) => ({
                                  label: item.label,
                                  value: item.value,
                                }))}
                                onChange={(value) => {
                                  setTempFilter({ ...tempFilter, status: value });
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
                  trigger={['click']} >
                  <label
                    className="group h-[1.7rem] text-[#FFFFFF] mr-[.7rem] ml-[.8rem] flex items-center cursor-pointer text-xs font-normal leading-3 rounded-[6px] shadow-none bg-transparent"
                    onClick={() => { }}
                  >
                    <MixerHorizontalIcon
                      style={{ width: '0.875rem', height: '0.875rem' }}
                      className="text-[#B3B3B3] group-hover:text-[#FFFFFF]"
                    />
                    {/* <Text_12_400_C7C7C7>Filter</Text_12_400_C7C7C7> */}
                  </label>
                </Popover>
              </>
            }
          />
        </div>
        <div className="searchWrap max-w-[320px] pt-4 tablePadding">
          {/* <TextInput
            textFieldSlot={
              <TextField.Slot>
                <MagnifyingGlassIcon
                  height="16"
                  width="16"
                  className={`text-[#BBBBBB] ${isFocused ? "text-[#FFFFFF]" : "hover:text-[#FFFFFF]"
                    }`}
                />
              </TextField.Slot>
            }
            name="seatch"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={searchUser}
            placeholder="Search by user email"
            maxLength={100}
            className="[text-[#FFFFFF]]"
          /> */}
          {/* <TextField.Root placeholder="Search user" className="rounded-lg shadow-none border border-[#B0B4BA] h-[1.75rem] text-sm text-[#787B83]"
            onChange={searchUser}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root> */}
        </div>
        {hasPermission(PermissionEnum.UserManage) ?
          <div className="pt-4 tablePadding userTable relative CommonCustomPagination">
            <Table<User>
              columns={columns}
              // pagination={false}
              pagination={{
                className: 'small-pagination',
                current: currentPage,
                pageSize: pageSize,
                total: totalUsers,
                onChange: handlePageChange,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
              }}
              dataSource={users}
              bordered={false}
              footer={null}
              virtual
              onRow={(record, rowIndex) => {
                return {
                  onClick: async event => {
                    event.stopPropagation();
                    // openUserPermissions(record)
                    if (hasPermission(PermissionEnum.UserManage) && record.status == "active") {
                      openUserPermissions(record)
                    }
                  }
                }
              }}
              showSorterTooltip={false}
              locale={{
                emptyText: (
                  <NoDataFount
                    classNames="h-[20vh]"
                    textMessage={`No Users`}
                  />
                ),
              }}
            />
          </div>
          : <>
            <NoAccess textMessage="You do not have access to view user management, please ask admin to give you access to manage users." />
          </>
        }
      </div>
      {isAddModalOpen && (
        <>
          <AddUserPopup
            isOpen={isAddModalOpen}
            onOpenChange={setAddModalOpen}
            title={"Add New User"}
            description={
              "Enter Information below to add a new user to  the platform"
            }
            initialValues={initialValues}
            onSubmit={handleAddSubmit}
          ></AddUserPopup>
        </>
      )}
      {isModalOpen && (
        <>
          <ViewUserPopup
            onClose={handleViewClose}
            isOpen={isModalOpen}
            onOpenChange={setModalOpen}
            title={"User Permission"}
            description={"Update access for projects"}
            initialValues={initialValues}
            onSubmit={handleModalSubmit}
          ></ViewUserPopup>
        </>
      )}
      {isPassModalOpen && (
        <>
          <GeneratePassPopup
            isOpen={isPassModalOpen}
            onOpenChange={setPassModalOpen}
            title={"Generate Password"}
            description={""}
            initialValues={initialValues}
            onSubmit={handlePasswordSubmit}
          ></GeneratePassPopup>
        </>
      )}
      {isAddDeleteOpen && (
        <>
          <AddDeleteDialog
            isOpen={isAddDeleteOpen}
            onClose={handleCloseDialogAddDelete}
            onSubmit={handleAddDeleteUser}
            itemTitle={selectedRowData?.itemTitle}
            itemDescription={selectedRowData?.itemDescription}
            buttonLabel={selectedRowData?.buttonLabel}
          />
        </>
      )}
    </DashBoardLayout>
  );
}