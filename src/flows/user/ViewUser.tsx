
import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";
import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import { Text_12_300_EEEEEE, Text_12_400_757575, Text_12_400_B3B3B3, Text_12_400_EEEEEE, Text_12_600_EEEEEE, Text_14_400_EEEEEE } from "@/components/ui/text";
import React, { use, useCallback, useEffect, useState } from "react";
import { useDrawer } from "src/hooks/useDrawer";
import { CredentialDetailEndpoint, useProprietaryCredentials } from "src/stores/useProprietaryCredentials";
import { Badge, Checkbox, Dropdown, Image, Space, Table } from "antd";

import BudStepAlert from "src/flows/components/BudStepAlert";
import { successToast } from "@/components/toast";
import Tags from "../components/DrawerTags";
import CustomDropDown from "../components/CustomDropDown";
import NoDataFount from "@/components/ui/noDataFount";
import { ColumnsType } from "antd/es/table";
import type { CheckboxProps, TableColumnsType } from 'antd';
import { DownOutlined } from "@ant-design/icons";
import { useUsers } from "src/hooks/useUsers";
import { useProjects } from "src/hooks/useProjects";
import { endpointStatusMapping } from "@/lib/colorMapping";
import { capitalize } from "@/lib/utils";
import { useLoader } from "src/context/appContext";

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

interface DataType {
  key?: React.Key;
  accessLevel: string;
  view: string;
  manage: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const defaultFilter = {
  name: "",
  email: "",
  role: "",
  status: "",
}

export default function ViewUser() {
  const { isLoading, showLoader, hideLoader } = useLoader();
  const { openDrawerWithStep } = useDrawer();
  const [showConfirm, setShowConfirm] = useState(false);
  const { credentialDetails, deleteProprietaryCredential, refresh } = useProprietaryCredentials();
  const { closeDrawer } = useDrawer();
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { users, getUsers, getUsersDetails, userDetails, getUsersPermissions, userPermissions, deleteUser } = useUsers();
  const { globalProjects, getGlobalProjects, getProject, totalProjects, totalPages } = useProjects();
  const [projectList, setProjectList] = useState<any>([]);

  // for pagination
  const [currentUserDetails, setCurrentUserDetails] = useState<{ id?: string; name?: string; email?: string; role?: string; status?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const totalItems = 100;
  const [filter, setFilter] = useState<
    {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    }
  >(defaultFilter);

  useEffect(() => {
    setCurrentUserDetails(userDetails);
  }, [userDetails]);

  const load = useCallback(async (filter) => {
    showLoader();
    await getUsers({
      page: currentPage,
      limit: pageSize,
      name: filter.name,
      email: filter.email,
      role: filter.role,
      status: filter.status,
    });
    hideLoader();
  }, [currentPage, pageSize, getUsers]);

  useEffect(() => {
    console.log("filter", filter);
    load(filter);
  }, [currentPage, pageSize, getUsers]);

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  // useEffect(() => {
  //   console.log('userPermissions', userPermissions)
  // }, [userPermissions]);

  // useEffect(() => {
  //   console.log('globalProjects', globalProjects)
  // }, [globalProjects]);

  useEffect(() => {
    getGlobalProjects(1, 1000)
  }, []);



  useEffect(() => {
    let prjt = globalProjects?.map(item => {
      // const matchingPermissions = userPermissions.project_scopes.length && userPermissions.project_scopes?.find(p => {
      //   console.log(p)
      //   p.id === item.project.id;
      // });
      const matchingPermissions = userPermissions?.project_scopes?.find(p => p.id === item.project.id);

      return {
        ...item,
        permissions: matchingPermissions ? matchingPermissions.permissions : []
      };
    })
    setProjectList(prjt)
  }, [userPermissions]);


  const tagsData = [
    { name: 'user@gmail.com', color: '#D1B854' },
    { name: 'Developer', color: '#D1B854' },
    { name: 'Active', color: '#3EC564' }
  ]

  const firstLineText = `Are you sure you want to delete this user?`
  const secondLineText = `You are about to delete ${currentUserDetails?.['name']}`

  const primaryTableData = [
    {
      name: 'Model',
      view: userPermissions?.global_scopes?.find(scope => scope.name === 'model:view')?.has_permission,
      manage: userPermissions?.global_scopes?.find(scope => scope.name === 'model:manage')?.has_permission
    },
    {
      name: 'Cluster',
      view: userPermissions?.global_scopes?.find(scope => scope.name === 'cluster:view')?.has_permission,
      manage: userPermissions?.global_scopes?.find(scope => scope.name === 'cluster:manage')?.has_permission
    },
    {
      name: 'User',
      view: userPermissions?.global_scopes?.find(scope => scope.name === 'user:view')?.has_permission,
      manage: userPermissions?.global_scopes?.find(scope => scope.name === 'user:manage')?.has_permission,
    },
    {
      name: 'Projects',
      view: userPermissions?.global_scopes?.find(scope => scope.name === 'project:view')?.has_permission,
      manage: userPermissions?.global_scopes?.find(scope => scope.name === 'project:manage')?.has_permission
    }
  ]

  const expandData = [
    { name: 'Project 1' },
    { name: 'Project 2' },
    { name: 'Project 3' }
  ]

  const ExpandableTable = ({ data }: { data?: any }) => {
    const [expandedRow, setExpandedRow] = useState<boolean>(false);
    const [checkedState, setCheckedState] = useState<{ [key: number]: boolean }>({});

    const showDetail = (index: number) => {
      setExpandedRow(!expandedRow); // Toggle the row
    };

    const handleCheckboxChange = (index: any) => {
      setCheckedState(prev => ({
        ...prev,
        [index]: !prev[index] // Toggle the checkbox state for the row
      }));
    };

    return (
      <div className="table mt-[.6rem] w-full border border-[#1F1F1F]">
        <div className="tHead flex items-center px-[.55rem] bg-[#121212]">
          <div className="py-[0.688rem] min-w-[60%]">
            <Text_12_600_EEEEEE>Access Level</Text_12_600_EEEEEE>
          </div>
          <div className="py-[0.688rem] min-w-[16.5%]">
            <Text_12_400_EEEEEE>View</Text_12_400_EEEEEE>
          </div>
          <div className="py-[0.688rem]">
            <Text_12_400_EEEEEE>Manage</Text_12_400_EEEEEE>
          </div>
        </div>
        <div className="tBody">
          {primaryTableData.map((item, index) => (
            <div className="border-t-[1px] border-t-[#1F1F1F]" key={index}>
              <div className="flex items-center px-[.75rem]">
                <div className="min-h-[2.75rem] pt-[0.788rem] min-w-[60%] flex items-start">
                  <Text_12_600_EEEEEE>{item.name}</Text_12_600_EEEEEE>
                  {item.name == 'Projects' && (
                    <div className="ml-[.5rem]"
                      onClick={(event) => {
                        event.stopPropagation();
                        showDetail(index);
                      }}
                    >
                      <Image
                        src="/images/drawer/ChevronUp.png"
                        preview={false}
                        alt="info"
                        style={{ width: '1rem', height: '1rem' }}
                        className={`origin-center transform transition-transform duration-300 ${expandedRow ? "rotate-0" : "rotate-180"
                          }`}
                      />
                    </div>
                  )}

                </div>
                <div className="min-h-[2.75rem] pt-[0.788rem] min-w-[16.5%]">
                  <Checkbox
                    checked={item.view || item.name == 'User'}
                    className="AntCheckbox greayCheck text-[#757575] w-[0.875rem] h-[0.875rem] text-[0.875rem]"
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
                <div className="min-h-[2.75rem] pt-[0.788rem]">
                  <Checkbox
                    checked={item.manage}
                    className="AntCheckbox greayCheck text-[#757575] w-[0.875rem] h-[0.875rem] text-[0.875rem]"
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(index + 'x')}
                  />
                </div>
              </div>
              {item.name == 'Projects' && (
                <div className={`${expandedRow ? "block" : "hidden"}`}>
                  <SecondTable />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const SecondTable = ({ data }: { data?: any }) => {
    const [checkedState, setCheckedState] = useState<{ [key: number]: boolean }>({});
    const handleCheckboxChange = (index: any) => {
      setCheckedState(prev => ({
        ...prev,
        [index]: !prev[index] // Toggle the checkbox state for the row
      }));
    };
    return (
      <div className="table mt-[0rem] w-full">
        <div className="tBody">
          {projectList.map((item, index) => (
            <div className="" key={index}>
              <div className="flex items-center px-[1.5rem]">
                {/* <div className="min-h-[2.75rem] pt-[0.788rem] min-w-[29.7%] flex items-start"> */}
                <div className="min-h-[2.75rem] pt-[0.788rem] min-w-[60.5%] flex items-start">
                  <Text_12_600_EEEEEE>{item.project.name}</Text_12_600_EEEEEE>
                </div>
                <div className="min-h-[2.75rem] pt-[0.788rem] min-w-[17.6%]">
                  <Checkbox
                    checked={item.permissions[0]?.has_permission || false}
                    className="AntCheckbox greayCheck text-[#757575] w-[0.875rem] h-[0.875rem] text-[0.875rem]"
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
                <div className="min-h-[2.75rem] pt-[0.788rem]">
                  <Checkbox
                    checked={item.permissions[1]?.has_permission || false}
                    className="AntCheckbox greayCheck text-[#757575] w-[0.875rem] h-[0.875rem] text-[0.875rem]"
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(index + 'x')}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    )
  }


  return (
    <BudForm
      data={{
      }}
      drawerLoading={isLoading}
    >
      <BudWraperBox classNames="mt-[2.2rem]">
        {showConfirm && <BudDrawerLayout>
          <BudStepAlert
            type="warining"
            title={firstLineText}
            description={secondLineText}
            confirmText='Delete User'
            cancelText='Cancel'
            confirmAction={async () => {
              const result = await deleteUser(currentUserDetails?.id)
              if (result) {
                successToast('User deleted successfully')
                await refresh()
                closeDrawer()
              }
              setShowConfirm(false)
              closeDrawer();
              load(filter);
            }}
            cancelAction={() => {
              setShowConfirm(false)
            }}
          />
        </BudDrawerLayout>}
        <BudDrawerLayout>
          <div className="flex flex-col items-start justify-start w-full px-[1.4rem] py-[1.05rem] pb-[1.4rem] border-b-[.5px] border-b-[#1F1F1F]">
            <div className="w-full flex justify-between items-start ">
              <Text_14_400_EEEEEE className="mb-[0.35rem]">
                {currentUserDetails?.name}
              </Text_14_400_EEEEEE>
              <div className="mr-[.1rem] mt-[.2rem]">
                <CustomDropDown
                  parentClassNames="oneDrop"
                  buttonContent={
                    <div className="px-[.3rem] my-[0] py-[0.02rem]">
                      <Image
                        preview={false}
                        src="/images/drawer/threeDots.png"
                        alt="info"
                        style={{ width: '0.1125rem', height: '.6rem' }}
                      />
                    </div>
                  }
                  items={
                    [
                      {
                        key: '1',
                        label: (
                          <Text_12_400_EEEEEE>Edit</Text_12_400_EEEEEE>
                        ),
                        onClick: () => openDrawerWithStep('edit-user')
                      },
                      {
                        key: '1',
                        label: (
                          <Text_12_400_EEEEEE>Delete</Text_12_400_EEEEEE>
                        ),
                        onClick: () => {
                          setShowConfirm(true)
                        }
                      },
                      {
                        key: '3',
                        label: (
                          <Text_12_400_EEEEEE className="text-nowrap">Reset Password</Text_12_400_EEEEEE>
                        ),
                        onClick: () => {
                          openDrawerWithStep('reset-password')
                        }
                      },
                    ]
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-start flex-wrap	gap-[.4rem]">
              {/* {tagsData.map((item, index) => (
                <Tags key={index} name={item.name} color={item.color} classNames="py-[.3rem]" />
              ))} */}
              <Tags name={currentUserDetails?.email} color="#D1B854" classNames="py-[.3rem]" />
              <Tags name={capitalize(currentUserDetails?.role)} color="#D1B854" classNames="py-[.3rem]" />
              <Tags name={capitalize(currentUserDetails?.status)} color={endpointStatusMapping[capitalize(currentUserDetails?.status)]} classNames="py-[.3rem]" />
            </div>
          </div>
          <div className="px-[1.45rem]">
            <div className='flex flex-col justify-start items-start  py-[.6rem] gap-[.25rem]'>
              <Text_14_400_EEEEEE>Permissions</Text_14_400_EEEEEE>
              <Text_12_400_757575>Selected user permissions for each module</Text_12_400_757575>
            </div>
            <div className="pb-[1.6rem]">
              <ExpandableTable />
            </div>
          </div>
        </BudDrawerLayout>
      </BudWraperBox>
    </BudForm>
  );
}

