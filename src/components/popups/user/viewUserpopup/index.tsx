"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  Button,
  Text,
  TextField,
  Select,
  Flex,
  Box,
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AppRequest } from "src/pages/api/requests";
import { Value } from "@radix-ui/themes/dist/cjs/components/data-list";
import Image from "next/image";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import globeIcn from "./../../../../../public/icons/Globe.png";
import { useLoader } from "src/context/appContext";
import { successToast } from "@/components/toast";
import { Text_12_400_6A6E76 } from "@/components/ui/text";
import { SelectCustomInput } from "@/components/ui/input";
import { ButtonInput } from "@/components/ui/button";

interface ViewUserPopupProps {
  onClose: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  initialValues?: ""; // Optional initial values for edit functionality
  onSubmit: (formData: { [key: string]: string }) => void;
}

const ViewUserPopup: React.FC<ViewUserPopupProps> = ({
  onClose,
  isOpen,
  onOpenChange,
  title,
  description,
  initialValues = "", // Default to empty object
  onSubmit,
}) => {
  const InitialValues = useRef(initialValues);
  const { isLoading, showLoader, hideLoader } = useLoader();

  const [userData, setUserData] = useState<any>();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userChr, setUserChr] = useState("");
  const [projectList, setProjectList] = useState<any>({});
  const [selectedProject, setSelectedProject] = useState<any>();

  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [sortedProjectPermissions, setSortedProjectPermissions] =
    useState<any>(null);
  const [sortedPermissions, setSortedPermissions] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>({});
  const [checked, setChecked] = useState<any>(false);
  const [checkedUser, setCheckedUser] = useState<any>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const totalItems = 100;
  const options = [
    { label: "View", value: "true" },
    { label: "Edit", value: "true" },
    // { label: "No access", value: 'false' },
  ];
  const getUser = useCallback(async () => {
    if (!initialValues || !isOpen) return;
    try {
      const response: any = await AppRequest.Get(`/users/${initialValues}`);
      let getData = response.data.result;
      if (getData?.name && getData.name.length >= 2) {
        const abv: string = getData.name[0] + getData.name[1];
        const name: string =
          getData.name.charAt(0).toUpperCase() + getData.name.slice(1);
        setUserData(getData);
        setUserName(name);
        setUserEmail(getData?.email);
        setUserChr(abv.toUpperCase());
      } else {
      }
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }, [initialValues, isOpen]);

  const getUserPermissions = useCallback(async () => {
    if (!initialValues || !isOpen) return;
    try {
      showLoader();
      const response: any = await AppRequest.Get(
        `/permissions/${initialValues}`
      );
      let permission = response.data.result;
      let result = {};
      for (let i = 0; i < permission.global_scopes.length; i++) {
        let permissionItem = permission.global_scopes[i];
        let key = permissionItem["name"].replace(":", ""); // Remove ':' from permission name
        result[key] = permissionItem["has_permission"];
      }
      let resultProject = [];
      for (let i = 0; i < permission.project_scopes.length; i++) {
        const permissionItem = permission.project_scopes[i];
        const projectPermissions = { ...permissionItem }; // Make a copy of permissionItem
        projectPermissions.permissions = {};

        for (let j = 0; j < permissionItem.permissions.length; j++) {
          const key = permissionItem.permissions[j]["name"].replace(":", ""); // Remove ':' from permission name
          projectPermissions.permissions[key] =
            permissionItem.permissions[j]["has_permission"];
        }

        resultProject.push(projectPermissions);
      }
      setSortedPermissions(result);
      setSortedProjectPermissions(resultProject);
      setUserPermissions(permission.global_scopes);
      hideLoader();
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }, [initialValues, isOpen]);

  const getProjects = async (page: any, limit: any) => {
    try {
      const response: any = await AppRequest.Get(
        `/projects/?page=${page}&limit=${limit}&search=false`
      );
      let data = response.data.results;
      data.forEach((element) => {
        element["label"] = element.project.name;
      });
      setProjectList(data);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  const handleChange = (key, value) => {
    let permission = value;
    setSelectedValue((prevPermissions: any) => ({
      ...prevPermissions,
      [key]: value,
    }));
    Object.entries(userPermissions).forEach(([index, value]) => {
      if (value["name"].includes(key)) {
        if (permission == "Edit") {
          if (value["name"].includes("manage")) {
            userPermissions[index].has_permission = true;
            userPermissions[Number(index) - 1].has_permission = true;
            setUserPermissions(userPermissions);
          }
        } else if (permission == "View") {
          if (value["name"].includes("view")) {
            userPermissions[index].has_permission = true;
            userPermissions[Number(index) + 1].has_permission = false;
            setUserPermissions(userPermissions);
          }
        } else {
          userPermissions[index].has_permission = false;
          setUserPermissions(userPermissions);
        }
      }
    });
    // Perform any additional actions here, such as updating the state or making an API call
  };

  const handleCheck = (type, checkVal) => {
    if (type == "project") {
      setChecked(checkVal);
      if (checkVal) {
        handleChange("project", "Edit");
        // handleChange('project', { label: "Edit", value: 'true' })
        // handleChange('project', { label: "View", value: 'true' })
      } else {
        handleChange("project", "View");
        // handleChange('project', { label: "Edit", value: 'false' })
        // handleChange('project', { label: "View", value: 'true' })
      }
    }
    if (type == "user") {
      setCheckedUser(checkVal);
      if (checkVal) {
        handleChange("user", "Edit");
      } else {
        handleChange("user", "View");
      }
    }
  };
  useEffect(() => {
    if (sortedPermissions?.["projectmanage"]) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    if (sortedPermissions?.["usermanage"]) {
      setCheckedUser(true);
    } else {
      setCheckedUser(false);
    }
  }, [sortedPermissions]);

  const handleSubmitProject = async () => {
    const payload = {
      users: [{
        user_id: initialValues,
        scopes: ["endpoint:view"],
      }],
    };
    try {
      const response = await AppRequest.Post(
        `/projects/${selectedProject?.["project"]["id"]}/add-users`,
        payload
      );
      successToast(response.data.message);
      getUserPermissions();
      setSelectedProject(null);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };
  const handleUpdateProject = async (data, val) => {
    const payload = [
      {
        user_id: initialValues,
        project_id: data["id"],
        permissions: [
          {
            name: "endpoint:view",
            has_permission: true,
          },
          {
            name: "endpoint:manage",
            has_permission: val.label == "Edit" ? true : false,
          },
        ],
      },
    ];

    try {
      const response = await AppRequest.Patch(`/permissions/project`, payload);
      successToast(response.data.message);
      getUserPermissions();
      setSelectedProject(null);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  const handleProjectChange = (data, val) => {
    handleUpdateProject(data, val);
  };

  const handleSubmit = () => {
    onSubmit(userPermissions);
  };

  useEffect(() => {
    getProjects(currentPage, pageSize);
  }, [currentPage, pageSize]);
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    getUserPermissions();
  }, []);

  const onDialogClose = useCallback(() => {
    setUserPermissions(null);
    setSortedProjectPermissions(null);
    setSortedPermissions(null);
    setChecked(false);
    setCheckedUser(false);
    setUserChr("");
    setUserEmail("");
  }, [
    setUserPermissions,
    setSortedProjectPermissions,
    setSortedPermissions,
    setChecked,
    setCheckedUser,
  ]);
  useEffect(() => {
    if (!isOpen) {
      onDialogClose();
    }
  }, [isOpen, onDialogClose]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content
        maxWidth="370px"
        className="w-[29%] p-[0.75rem] bg-[#111113] border-0 shadow-none"
      >
        <Box className="px-2">
          <Flex justify="between" align="center">
            <Dialog.Title className="text-base block p-0 pt-1 m-0">
              {title}
            </Dialog.Title>
            <Dialog.Close onClick={onClose}>
              <Button
                className="m-0 p-0 pt-[.1rem] bg-[transparent] h-[1.1rem]"
                size="1"
              >
                <Cross1Icon />
              </Button>
            </Dialog.Close>
          </Flex>
          <Dialog.Description className="text-xs text-[#44474D] pt-2" mb="3">
            {description}
          </Dialog.Description>
          <Flex
            className="profileDetails bg-[transparent] rounded-lg cursor-pointer"
            justify="start"
            align="center"
          >
            <Box
              className="rounded rounded-full border border-[#FBF3F3] border-[.5px] w-[1.25rem] h-[1.25rem]"
              style={{ backgroundColor: userData?.["color"] }}
            ></Box>
            <Box className="userName">
              <Text_12_400_6A6E76 className="">{userEmail}</Text_12_400_6A6E76>
            </Box>
          </Flex>
        </Box>
        {sortedPermissions && Object.keys(sortedPermissions).length > 0 && (
          <>
            <Flex align="center" justify="start" gap="4" className="pt-4 px-2">
              <label className="pb-1 block w-[48%]">
                <Text
                  as="div"
                  className="text-xs font-normal text-[#787B83]"
                  mb="1"
                  weight="bold"
                >
                  Model Permission
                </Text>
                <SelectCustomInput
                  size="2"
                  defaultValue={
                    sortedPermissions?.modelmanage
                      ? "Edit"
                      : sortedPermissions?.modelview
                        ? "View"
                        : "No access"
                  }
                  value={selectedValue?.["model"]}
                  onValueChange={(value) => handleChange("model", value.label)}
                  showSearch={false}
                  placeholder={`Select`}
                  selectItems={options}
                  renderItem=""
                />
              </label>
              <label className="pb-1 block w-[48%]">
                <Text
                  as="div"
                  className="text-xs font-normal text-[#787B83]"
                  mb="1"
                  weight="bold"
                >
                  Cluster Permission
                </Text>
                <SelectCustomInput
                  size="2"
                  defaultValue={
                    sortedPermissions?.clustermanage
                      ? "Edit"
                      : sortedPermissions?.clusterview
                        ? "View"
                        : "No access"
                  }
                  value={selectedValue?.["cluster"]}
                  onValueChange={(value) =>
                    handleChange("cluster", value.label)
                  }
                  showSearch={false}
                  placeholder={`Select`}
                  selectItems={options}
                  renderItem=""
                />
              </label>
            </Flex>
            <Box className="p-3 mt-3 bg-[#18191B] rounded-lg">
              <label className="pb-1 block w-full">
                <Text
                  as="div"
                  className="text-xs font-normal text-[#C7C7C7]"
                  mb="1"
                  weight="bold"
                >
                  Project Permission
                </Text>
                <Flex align="center" justify="between">
                  <Flex align="center" justify="start" gap="2" className="py-2">
                    <Image
                      width={15}
                      className="w-[0.875rem] h-[0.875rem]"
                      src={globeIcn}
                      alt="Logo"
                    />
                    <Text
                      as="div"
                      className="text-xs font-normal text-[#C7C7C7] whitespace-nowrap	"
                      weight="bold"
                    >
                      For all projects
                    </Text>
                  </Flex>
                  {/* <Select.Root
                    defaultValue={sortedPermissions?.projectmanage ? 'Edit' : sortedPermissions?.projectview ? 'View' : 'No access'}
                    onValueChange={(value) => handleChange('projectmanage', value)}
                  >
                    <Select.Trigger
                      placeholder="Select"
                      className="h-[1.75rem] text-xs font-light rounded-md outline-none bg-transparent border-none shadow-none"
                    >
                    </Select.Trigger>
                    <Select.Content>
                      {options.map((option, index) => (
                        <Select.Item key={index} value={option.label}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root> */}
                </Flex>
              </label>
              <Box>
                {/* <Text as="div" className="text-xs font-light text-[#787B83]" mb="1" weight="bold">
                  Set access for individual projects
                </Text> */}
                {Object.keys(sortedProjectPermissions).length > 0 ? (
                  <Box className="max-h-[170px] overflow-y-auto max-h-[170px]">
                    {sortedProjectPermissions.map((data, index) => (
                      <Flex
                        align="center"
                        justify="between"
                        key={index}
                        className="mb-[.2em]"
                      >
                        <Text
                          as="div"
                          className="text-xs font-normal text-[#C7C7C7] whitespace-nowrap max-w-[70%] truncate"
                          weight="bold"
                        >
                          {data.name}
                        </Text>
                        <Box className="w-30%">
                          <SelectCustomInput
                            size="2"
                            defaultValue={
                              data.permissions.endpointmanage ? "Edit" : "View"
                            }
                            // value={selectedProject?.['project']['name']}
                            onValueChange={(value) =>
                              handleProjectChange(data, value)
                            }
                            placeholder={`Select`}
                            selectItems={options}
                            renderItem=""
                            className="!min-w-[70px]"
                          />
                        </Box>
                        {/* <Select.Root
                          defaultValue={data.permissions.endpointmanage ? 'Edit' : 'View'}
                          onValueChange={(value) => handleProjectChange(data, value)}
                        >
                          <Select.Trigger
                            placeholder="Select"
                            className="h-[1.75rem] text-xs font-light rounded-md outline-none bg-transparent border-none shadow-none"
                          >
                          </Select.Trigger>
                          <Select.Content>
                            {options.map((option, index) => (
                              <Select.Item key={index} value={option.label}>
                                {option.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root> */}
                      </Flex>
                    ))}
                  </Box>
                ) : (
                  <Text>No Projects</Text>
                )}
              </Box>
              <Flex justify="between" align="center" className="mt-1.5">
                <Box className="w-[calc(100%-80px)]">
                  {projectList.length > 0 && (
                    <SelectCustomInput
                      size="2"
                      value={selectedProject?.["project"]["name"]}
                      onValueChange={(newValue) => setSelectedProject(newValue)}
                      placeholder={`Add project`}
                      selectItems={projectList}
                      renderItem=""
                    />
                  )}
                </Box>
                <ButtonInput
                  size="1"
                  className=""
                  onClick={handleSubmitProject}
                >
                  + Add
                </ButtonInput>
              </Flex>
              <Flex align="center" justify="start" gap="2" className="mt-3">
                <Checkbox.Root
                  className={`w-[0.875rem] h-[0.875rem] border rounded
                    ${checked
                      ? "bg-[transparent] border-[#965CDE]"
                      : "border-gray-300"
                    }
                    `}
                  checked={checked}
                  onCheckedChange={(checked) => handleCheck("project", checked)}
                >
                  <Checkbox.Indicator
                    className={`flex items-center justify-center mt-[-.05rem] bg-[transparent]
                      ${checked
                        ? "bg-[transparent] text-[#965CDE]"
                        : "border-gray-300"
                      }
                    `}
                  >
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Text
                  as="div"
                  className="text-xs font-light text-[#FFFFFF]"
                  weight="bold"
                >
                  Allow creation of projects
                </Text>
              </Flex>
              <Flex align="center" justify="start" gap="2" className="mt-3">
                <Checkbox.Root
                  className={`w-[0.875rem] h-[0.875rem] border rounded
                    ${checkedUser
                      ? "bg-[transparent] border-[#965CDE]"
                      : "border-gray-300"
                    }
                    `}
                  checked={checkedUser}
                  onCheckedChange={(checkedUser) =>
                    handleCheck("user", checkedUser)
                  }
                >
                  <Checkbox.Indicator
                    className={`flex items-center justify-center mt-[-.05rem] bg-[transparent]
                      ${checkedUser
                        ? "bg-[transparent] text-[#965CDE]"
                        : "border-gray-300"
                      }
                    `}
                  >
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Text
                  as="div"
                  className="text-xs font-light text-[#FFFFFF]"
                  weight="bold"
                >
                  Allow user management
                </Text>
              </Flex>
            </Box>
          </>
        )}

        <Flex gap="3" mt="4" justify="center">
          <ButtonInput size="1" className="w-full" onClick={handleSubmit}>
            Update Access
          </ButtonInput>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ViewUserPopup;
