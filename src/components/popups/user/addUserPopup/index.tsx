import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  Button,
  Text,
  TextField,
  Select,
  Flex,
  Box,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import { Cross1Icon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { AppRequest } from "src/pages/api/requests";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import PasswordGenerator from "src/utils/randomPasswordGenerator";
import copyIcn from "./../../../../../public/icons/copy.png";
import {
  Text_12_300_44474D,
  Text_12_400_787B83,
  Text_16_600_FFFFFF,
} from "@/components/ui/text";
import {
  SelectCustomInput,
  SelectInput,
  TextInput,
} from "@/components/ui/input";
import { ButtonInput } from "@/components/ui/button";

interface AddUserPopupProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  initialValues?: ""; // Optional initial values for edit functionality
  onSubmit: (formData: { [key: string]: string }) => void;
}

const AddUserPopup: React.FC<AddUserPopupProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  initialValues = "", // Default to empty object
  onSubmit,
}) => {
  interface FormData {
    name: string;
    description: string;
    [key: string]: string;
  }
  const options = [
    { label: "View", value: "true" },
    { label: "Edit", value: "true" },
    // { label: "No access", value: 'false' },
  ];

  const roles = {
    admin: "Admin",
    developer: "Developer",
    devops: "Devops",
    tester: "Tester",
  };

  const Permissions = [
    {
      name: "model:view",
      has_permission: true,
    },
    {
      name: "model:manage",
      has_permission: false,
    },
    {
      name: "project:view",
      has_permission: true,
    },
    {
      name: "project:manage",
      has_permission: false,
    },
    {
      name: "cluster:view",
      has_permission: true,
    },
    {
      name: "cluster:manage",
      has_permission: false,
    },
    {
      name: "user:manage",
      has_permission: false,
    },
  ];

  const [addStep, setAddStep] = React.useState<any>("one");
  const [formData, setFormData] = React.useState<{ [key: string]: string }>();
  const [userPermissions, setUserPermissions] = useState<any>(Permissions);
  const [checked, setChecked] = useState<any>(false);
  const [checkedUser, setCheckedUser] = useState<any>(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState<any>("click to copy");
  const [isCopy, setIsCopy] = useState(false);

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [modelAccess, setModelAccess] = useState<any>("");
  const [clusterAccess, setClusterAccess] = useState<any>("");
  const [projectAccess, setProjectAccess] = useState<any>("");

  const isButtonDisabled =
    !formData?.email || !formData?.name || !formData?.role;

  const userPermissionsRef = useRef(userPermissions);

  useEffect(() => {
    userPermissionsRef.current = userPermissions;
  }, [userPermissions]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "email" && value.trim() === "") {
      newErrors.name = "Email is required";
    } else {
      delete newErrors.name; // Clear error if input is valid
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors(newErrors);
  };

  const handleChangeRole = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
  };
  const handlePermissionChange = useCallback(
    (key?: string, value?: { label?: string; value?: any }) => {
      const updatedPermissions = userPermissionsRef.current.map(
        (permission) => {
          if (permission["name"].includes(key)) {
            if (value["label"] === "Edit") {
              if (permission["name"].includes("manage")) {
                return {
                  ...permission,
                  has_permission: Boolean(value["value"]),
                };
              }
            } else if (value["label"] === "View") {
              if (permission["name"].includes("view")) {
                return {
                  ...permission,
                  has_permission: Boolean(value["value"]),
                };
              }
            } else {
              return { ...permission, has_permission: false };
            }
          }
          return permission;
        }
      );

      setUserPermissions((prevPermissions) => {
        const hasChanges = !prevPermissions.every(
          (permission, index) =>
            permission.has_permission ===
            updatedPermissions[index].has_permission
        );
        if (hasChanges) {
          return updatedPermissions;
        }
        return prevPermissions;
      });

      const type = key;
      const permission = value;
      setProjectAccess("No Access");
      if (permission.label === "Edit") {
        if (type === "model") {
          setModelAccess("Edit");
        }
        if (type === "cluster") {
          setClusterAccess("Edit");
        }
        if (type === "project") {
          setProjectAccess("Allowed");
        }
        if (type === "user") {
          setProjectAccess("Allowed");
        }
      } else if (permission.label === "View") {
        if (type === "model") {
          setModelAccess("View");
        }
        if (type === "cluster") {
          setClusterAccess("View");
        }
        if (type === "project") {
          setProjectAccess("Allowed");
        }
        if (type === "user") {
          setProjectAccess("Allowed");
        }
      } else {
        if (type === "model") {
          setModelAccess("No Access");
        }
        if (type === "cluster") {
          setClusterAccess("No Access");
        }
        if (type === "project") {
          setProjectAccess("No Access");
        }
        if (type === "user") {
          setProjectAccess("No Access");
        }
      }
    },
    []
  );

  const handleCheck = (type, checkVal) => {
    if (type == "project") {
      setChecked(checkVal);
      if (checkVal) {
        handlePermissionChange("project", { label: "View", value: true });
        handlePermissionChange("project", { label: "Edit", value: true });
      } else {
        handlePermissionChange("project", { label: "View", value: true });
        handlePermissionChange("project", { label: "Edit", value: false });
      }
    }
    if (type == "user") {
      setCheckedUser(checkVal);
      if (checkVal) {
        handlePermissionChange("user", { label: "Edit", value: true });
      } else {
        handlePermissionChange("user", { label: "Edit", value: false });
      }
    }
  };
  const handleSubmit = () => {
    console.log('userPermissions', userPermissions)
    const data = {
      ...formData,
      password: generatedPassword,
      permissions: userPermissions,
    };
    onSubmit(data);
  };
  const handleNext = () => {
    const newErrors = validateForm(formData);
    handleSubmit();
    if (Object.keys(newErrors).length === 0) {
      setAddStep("two");
    } else {
      setErrors(newErrors);
    }
  };

  const validateForm = (formData: { [key: string]: string }) => {
    let newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.role) {
      newErrors.name = "Role is required";
    }

    return newErrors;
  };

  const goBack = () => {
    setAddStep("one");
  };

  const handlePasswordChange = (password: string) => {
    setGeneratedPassword(password);
  };
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`
        Admin has invited you to Bud Inference Engine

      Username: ${formData.email}
      New Password: ${generatedPassword}

      Access Levels:-
      Model: ${modelAccess}
      Cluster: ${clusterAccess}
      Project Creation: ${projectAccess}

      Click this link to login: https://bud.studio
      `);
      setIsCopy(true);
      setCopyMessage("Copied..");
      setTimeout(() => {
        setCopyMessage("click to copy");
        setIsCopy(false);
      }, 10000);
    } catch (err) {
      setCopyMessage("Failed to copy: ");
    }
  };
  const onDialogClose = () => {
    setAddStep("one");
    setErrors({});
    setFormData({});
    setChecked(false);
    setCheckedUser(false);
  };
  useEffect(() => {
    if (!isOpen) {
      onDialogClose();
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isButtonDisabled) {
      handlePermissionChange("model", { label: "View", value: true });
      handlePermissionChange("cluster", { label: "View", value: true });
    } else {
      handlePermissionChange("model", { label: "View", value: false });
      handlePermissionChange("cluster", { label: "View", value: false });
    }
  }, [isButtonDisabled, handlePermissionChange]);
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {addStep == "one" ? (
        <Dialog.Content
          maxWidth="380px"
          className="w-[33%] p-[1.5rem] bg-[#111113] border-0 shadow-none"
          aria-describedby={undefined}
        >
          <Dialog.Title>
            <VisuallyHidden>Add New User</VisuallyHidden>
          </Dialog.Title>
          <Box>
            <Flex justify="between" align="center">
              <Text_16_600_FFFFFF>Add New User</Text_16_600_FFFFFF>
              <Dialog.Close>
                <Button
                  className="m-0 p-0 pt-[.1rem] bg-[transparent] h-[1.1rem]"
                  size="1"
                >
                  <Cross1Icon />
                </Button>
              </Dialog.Close>
            </Flex>
            <Text_12_300_44474D className="pt-3" mb="3">
              Enter Information below to add a new user to the platform
            </Text_12_300_44474D>
          </Box>
          <Box className="pt-2">
            <label className="pb-1 block">
              <Text_12_400_787B83 mb="1">Email</Text_12_400_787B83>
              <TextInput
                name="email"
                onChange={handleChange}
                placeholder="Enter email"
                maxLength={100}
                className="text-[#FFFFFF]"
              />
              {errors.email && (
                <Text className="text-red-500 text-[.7rem]">
                  {errors.email}
                </Text>
              )}
            </label>
            <label className="pb-1 mt-3 block">
              <Text_12_400_787B83 mb="1">Name</Text_12_400_787B83>
              <TextInput
                name="name"
                onChange={handleChange}
                placeholder="Enter name"
                maxLength={100}
                className="text-[#FFFFFF]"
              />
              {errors.name && (
                <Text className="text-red-500 text-[.7rem]">{errors.name}</Text>
              )}
            </label>
            <label className="pb-1 block">
              <Text_12_400_787B83 mb="1">Role</Text_12_400_787B83>
              <SelectCustomInput
                size="2"
                value={roles[formData?.["role"] || ""]}
                onValueChange={(newValue) => handleChangeRole("role", newValue)}
                placeholder={`Select Role`}
                showSearch={false}
                selectItems={Object.values(roles)}
                renderItem=""
              />
              {errors.role && (
                <Text className="text-red-500 text-[.7rem]">{errors.role}</Text>
              )}
            </label>
          </Box>
          <Box className="py-2 hidden">
            <Text className="text-xs text-[#787B83] font-normal	">
              Auto generated password
            </Text>
            <PasswordGenerator onPasswordChange={handlePasswordChange} />
          </Box>
          <Text_12_400_787B83 className="pt-2">
            This user will be able to view the model and cluster repository.{" "}
          </Text_12_400_787B83>
          <Text className="text-[#FFFFFF] text-xs font-normal	block mt-5">
            Would you like to give change their Access?
          </Text>
          <Flex align="center" justify="start" gap="4" className="pt-3">
            <label className="pb-1 block w-[48%]">
              <Text_12_400_787B83 mb="1">Model Permission</Text_12_400_787B83>

              <SelectInput
                size="2"
                onValueChange={(value) =>
                  handlePermissionChange("model", value)
                }
                value={modelAccess}
                showSearch={false}
                placeholder="Select"
                selectItems={options}
              />
            </label>
            <label className="pb-1 block w-[48%]">
              <Text_12_400_787B83 mb="1">Cluster Permission</Text_12_400_787B83>

              <SelectInput
                size="2"
                onValueChange={(value) =>
                  handlePermissionChange("cluster", value)
                }
                showSearch={false}
                value={clusterAccess}
                placeholder="Select"
                selectItems={options}
              />
            </label>
          </Flex>
          <Flex align="center" justify="start" gap="2" className="mt-3">
            <Checkbox.Root
              className={`w-[0.875rem] h-[0.875rem] border rounded
                    ${
                      checked
                        ? "bg-[transparent] border-[#965CDE]"
                        : "border-gray-300"
                    }
                    `}
              checked={checked}
              onCheckedChange={(checked) => handleCheck("project", checked)}
            >
              <Checkbox.Indicator
                className={`flex items-center justify-center mt-[-.05rem] bg-[transparent]
                      ${
                        checked
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
                    ${
                      checkedUser
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
                      ${
                        checkedUser
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
          <Flex gap="3" mt="4" justify="center">
            <ButtonInput
              onClick={handleNext}
              disabled={isButtonDisabled}
              className="w-full"
            >
              Create Invite
            </ButtonInput>
          </Flex>
        </Dialog.Content>
      ) : (
        <Dialog.Content
          maxWidth="370px"
          className="w-[29%] p-[1.5rem] bg-[#111113] border-0 shadow-none"
        >
          <Dialog.Title className="text-base block p-0 pt-1 m-0">
            New User Invite
          </Dialog.Title>
          <Text className="text-xs text-[#44474D] font-light">
            Copy the message below and send it to the user.
          </Text>
          <Box className="adminMessage p-3 pb-4 mt-3 bg-[#18191B] rounded-lg text-[#FFFFFF]">
            <Flex className="w-full" align="center" justify="between">
              <Text
                as="div"
                className="text-xs font-light text-[#C7C7C7]"
                mb="1"
                weight="bold"
              >
                Admin has invited you to Bud Inference Engine
              </Text>
              {/* <CopyToClipboard text={adminMessage}> */}
              <Tooltip
                content={copyMessage}
                className="text-xs"
                disableHoverableContent={true}
              >
                <button onClick={onCopy}>
                  <Image
                    width={20}
                    className="w-3.5 h-3.5"
                    src={copyIcn}
                    alt="Logo"
                  />
                </button>
              </Tooltip>
              {/* </CopyToClipboard> */}
            </Flex>
            <Box className="mt-3">
              <Text className="font-normal text-xs block">Username:</Text>
              <Text className="font-light text-xs block">{formData.email}</Text>
            </Box>
            <Box className="mt-3">
              <Text className="font-normal text-xs block">New Password:</Text>
              <Text className="font-light text-xs block">
                {generatedPassword}
              </Text>
            </Box>
            <Box className="mt-3">
              <Text className="font-normal text-xs block">Access Levels:</Text>
              <Text className="font-light text-xs block">
                Model: {modelAccess}
              </Text>
              <Text className="font-light text-xs block">
                Cluster: {clusterAccess}
              </Text>
              <Text className="font-light text-xs block">
                Project Creation: {projectAccess}
              </Text>
            </Box>
            <Box className="mt-3">
              <Text className="font-normal text-xs">
                Click this link login:{" "}
              </Text>
              <Text className="font-light text-xs">
                <a>https://bud.studio</a>
              </Text>
            </Box>
          </Box>
          <Flex gap="3" mt="4" justify="center">
            <Dialog.Close>
              <ButtonInput
                onClick={null}
                // disabled={!isCopy}
                className="w-full"
              >
                Done
              </ButtonInput>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default AddUserPopup;
