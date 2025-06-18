"use client";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Avatar, ConfigProvider, Image, Popover, Tooltip } from "antd";

import { usePathname } from "next/navigation";
import { AppRequest } from "./../api/requests";
import Link from "next/link";
import {
  ExitIcon,
  GearIcon,
  PersonIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import {
  Text_10_400_B3B3B3,
  Text_12_300_B3B3B3,
  Text_14_400_757575,
  Text_14_400_B3B3B3,
  Text_14_600_EEEEEE,
  Text_15_400_B3B3B3,
} from "@/components/ui/text";
import { Icon } from "@iconify/react";
import { useShortCut } from "../../hooks/useShortCut";
import { useRouter } from "next/router";
import { useDrawer } from "src/hooks/useDrawer";
import { useOverlay } from "src/context/overlayContext";
import { useIsland } from "src/hooks/useIsland";
import BudIsland from "@/components/island/BudIsland";
import { PermissionEnum, useUser } from "src/stores/useUser";

interface LayoutProps {
  children: ReactNode;
  headerItems?: ReactNode;
}

function ShortCutComponent({
  cmd,
  action,
}: {
  cmd: string;
  action: () => void;
}) {
  const { metaKeyPressed } = useShortCut({
    key: cmd,
    action: action,
  });

  if (metaKeyPressed) {
    return (
      <div
        className="flex inline-flex justify-center items-center text-[0.625rem] py-0.5 bg-[#1F1F1F] rounded-sm text-[#B3B3B3] h-5 w-8 uppercase "
      >
        <Icon
          icon="ph:command"
          className="text-[0.625rem] mr-0.5 text-[#B3B3B3]"
        />{" "}
        {cmd}
      </div>
    );
  }

  return (
    <div
      className="flex inline-flex justify-center items-center text-[0.625rem] py-0.5 bg-[#1F1F1F] rounded-sm text-[#B3B3B3] h-5 w-8 uppercase opacity-0 opacity-100"
      style={{
        opacity: metaKeyPressed ? '1 !important' : '0 !important',
      }}
    >
      <Icon
        icon="ph:command"
        className="text-[0.625rem] mr-0.5 text-[#B3B3B3] group-hover:text-[#EEEEEE]"
      />{" "}
      {cmd}
    </div>
  );
}

const DashBoardLayout: React.FC<LayoutProps> = ({ children, headerItems }) => {
  const router = useRouter();
  const { isDrawerOpen, showMinimizedItem } = useDrawer();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHovered, setIsHovered] = useState<any>();
  const pathname = usePathname();
  const { isVisible } = useOverlay();
  const { getUser, user, hasPermission, permissions } = useUser();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [generalOpen, setGeneralOpen] = React.useState(false);
  const tabs = [
    {
      label: "Projects",
      route: "/projects",
      icon: '/images/icons/projectIcon.png',
      iconWhite: '/images/icons/projectIconWhite.png',
      cmd: "1",
      hide: !hasPermission(PermissionEnum.ProjectView),
    },
    {
      label: "Models",
      route: "/modelRepo",
      icon: '/images/icons/modelRepo.png',
      iconWhite: '/images/icons/modelRepoWhite.png',
      cmd: "2",
      hide: !hasPermission(PermissionEnum.ModelView),
    },
    {
      label: "Clusters",
      route: "/clusters",
      icon: '/images/icons/cluster.png',
      iconWhite: '/images/icons/clustersWhite.png',
      cmd: "3",
      hide: !hasPermission(PermissionEnum.ClusterView),
    },
    {
      label: "Dashboard",
      route: "/dashboard",
      icon: '/images/icons/dashboard.png',
      iconWhite: '/images/icons/dashboardWhite.png',
      cmd: "4",
    },
    // { label: 'End Points', route: '/endPoints', icon: endPointsIcon},
    {
      label: "Playground",
      route: "/playground",
      icon: '/images/icons/play.png',
      iconWhite: '/images/icons/playWhite.png',
      cmd: "5",
    },
    {
      label: "Simulation",
      route: "/simulation",
      icon: '/icons/simulations.png',
      iconWhite: '/icons/simulationsWhite.svg',
      cmd: "6",
    },
    {
      label: "API Keys",
      route: "/apiKeys",
      icon: '/images/icons/key.png',
      iconWhite: '/images/icons/keyWhite.png',
      cmd: "7",
    },
  ]

  const tabsTwo = [
    {
      label: "User management", route: "/users", icon: PersonIcon,
      hide: !hasPermission(PermissionEnum.UserManage),
    },
    { label: "Settings", route: "/settings", icon: GearIcon },
    // { label: "Help", route: "/help", icon: QuestionMarkIcon },
  ];
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && user) {
      document.documentElement.style.setProperty("--user-color", user?.color);
    }
  }, [isHydrated, user]);

  const roleMapping = {
    super_admin: "Super Admin",
    admin: "Admin",
    developer: "Developer",
    devops: "Devops",
    tester: "Tester",
  }

  // logout
  const logOut = async () => {
    try {
      localStorage.clear();
      window.location.replace("/");
      // If API call is successful, close the dialog
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    getUser();
  }, []);


  const handleOpenChange = (open) => {
    setGeneralOpen(open);
  };
  const content = (
    <>
      <div className="px-[1.35em] pt-[1rem] mb-[.65rem] tracking-[.03rem]">
        <Text_14_400_757575>General</Text_14_400_757575>
      </div>
      {pathname && (
        <>
          {/* <Text>{pathname}</Text> */}
          <div
            className="flex justify-start items-start flex-col gap-1 menuWrap pt-[0.25em]"
          >
            {tabsTwo.map((tab) => {
              const Icon = tab.icon;

              const isActive = pathname?.includes(tab.route);
              const isVisible = !tab.hide;

              return (
                <Link
                  className="linkLink mb-[.6rem] w-full"
                  onClick={(e) => !isVisible && e.preventDefault()}
                  key={tab.route}
                  href={tab.route}
                  passHref
                >
                  <div
                    className={classNames(
                      "flex items-center gap-2 group gap-x-[0.85em] rounded-md py-[0.25em] px-[1.3rem] font-light text-[#B3B3B3]",
                      "LinkDiv",
                      isVisible && "hover:font-semibold hover:text-[#EEEEEE]",
                      isActive && "!text-[#EEEEEE]"
                    )}
                  >
                    <div className="LinkIcn">
                      <Icon
                        width="1.05em"
                        height="1.05em"
                        className={classNames(
                          "w-[1.05em] h-[1.05em] 1920px:w-[1.2em] 1920px:h-[1.2em]",
                          isVisible && "group-hover:text-[#EEEEEE]",
                          (isHovered === tab.route || isActive) && "text-[#EEEEEE]"
                        )}
                      />
                    </div>
                    <Text_15_400_B3B3B3
                      className={classNames(
                        "pl-[0.25em] !text-[.875rem]",
                        isVisible && "group-hover:text-[#EEEEEE]",
                        (isHovered === tab.route || isActive) && "text-[#EEEEEE]"
                      )}
                    >
                      {tab.label}
                    </Text_15_400_B3B3B3>
                  </div>
                </Link>
              );
            })}

          </div>
        </>
      )}
      <div className="px-[1.1em] pb-[1rem]">
        <div
          className={classNames(
            "flex items-center justify-start gap-[.5] LinkDiv cursor-pointer group flex gap-x-[0.85em] rounded-md py-[0.3em] pl-[.3rem] pr-[.6em] font-light text-[#B3B3B3] hover:font-semibold hover:text-[#EEEEEE]"
          )}
          onClick={logOut}
        >
          <div className="LinkIcn">
            <ExitIcon
              width="1em"
              height="1em"
              className="w-[1em] h-[1em] 1920px:w-[1.2em] 1920px:h-[1.2em]"
            />
          </div>
          <Text_15_400_B3B3B3 className="block pl-[0.25em] !text-[0.875em] group-hover:text-[#EEEEEE]">
            Log out
          </Text_15_400_B3B3B3>
        </div>
      </div>
    </>
  );
  return (
    <div>
      {/* <Theme accentColor="iris" appearance="dark" style={{ background: 'transparent' }} className=""> */}
      <Theme accentColor="iris" appearance="dark" className="">
        <div className="dashboardWrapper flex justify-between relative">
          <div className={`dashboardOverlay absolute w-full h-full top-0 left-0 z-[1200] ${isVisible ? 'block' : 'hidden'}`}></div>
          <div
            className="flex flex-col justify-between items-start gap-[2rem] leftDiv py-[1.55em] pb-[.7em] scroll-smooth custom-scrollbar overflow-auto open-sans"
          >
            <div className="w-full 1680px:text-[1rem]">
              <div className="flex justify-center leftLogo px-[7%] pb-[1.65rem]">
                <Image
                  preview={false}
                  className="mainLogo"
                  style={{ width: 'auto', height: '1.4rem' }}
                  src="/images/logo.svg"
                  // src="/images/BudLogo.png"
                  alt="Logo"
                />
              </div>
              <div className="px-[.75rem] mb-[7%]">
                <BudIsland />
              </div>
              <div
                className="flex justify-start items-center flex-col menuWrap pt-[0.235rem] px-[.6rem]"
              >
                {tabs.map((tab) => {
                  const isActive = pathname?.includes(tab.route);
                  const isVisible = !tab.hide;

                  return (
                    <Link
                      className="linkLink mb-[.62rem]"
                      key={tab.route}
                      href={tab.route}
                      passHref
                      onMouseEnter={() => isVisible && setIsHovered(tab.route)}
                      onMouseLeave={() => isVisible && setIsHovered(false)}
                      onClick={(e) => !isVisible && e.preventDefault()}
                    >
                      <div
                        className={classNames(
                          "flex justify-between items-center gap-2 group gap-x-[0.75em] rounded-md py-[0.3em] px-[.7em] font-light text-[#B3B3B3]",
                          "LinkDiv",
                          isVisible && "hover:font-semibold hover:text-[#EEEEEE]",
                          isActive && "!text-[#EEEEEE] bg-[#1F1F1F]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="LinkIcn">
                            {/* Hovered Icon (White) */}
                            <div
                              className={classNames(
                                "icon",
                                (isHovered === tab.route || isActive) ? "visible" : "hidden"
                              )}
                            >
                              <Image
                                preview={false}
                                src={tab.iconWhite}
                                style={{ width: "1em", height: "1em" }}
                                alt="Hovered Logo"
                                className="1920px:w-[1.2em] 1920px:h-[1.2em]"
                              />
                            </div>
                            {/* Default Icon */}
                            <div
                              className={classNames(
                                "icon",
                                (isHovered !== tab.route && !isActive) ? "visible" : "hidden"
                              )}
                            >
                              <Image
                                preview={false}
                                src={tab.icon}
                                style={{ width: "1em", height: "1em" }}
                                alt="Default Logo"
                                className="1920px:w-[1.2em] 1920px:h-[1.2em]"
                              />
                            </div>
                          </div>
                          <Text_14_400_B3B3B3
                            className={classNames(
                              "pl-[0.65em] tracking-[.03rem]",
                              (isHovered === tab.route || isActive) && "!text-[#EEE]"
                            )}
                          >
                            {tab.label}
                          </Text_14_400_B3B3B3>
                        </div>

                        {/* Keyboard shortcut component */}
                        <ShortCutComponent
                          cmd={tab.cmd}
                          action={() => isVisible && router.push(tab.route)}
                        />
                      </div>
                    </Link>
                  );
                })}

              </div>
            </div>
            <div className="block w-full">
              <div className="w-full block rounded-lg profileDetailsBtnWrap">
                <ConfigProvider
                  theme={{
                    token: {
                      sizePopupArrow: 0,
                    },
                  }}
                  getPopupContainer={(trigger) => (trigger.parentNode as HTMLElement) || document.body}
                >
                  <Popover
                    open={generalOpen}
                    onOpenChange={handleOpenChange}
                    content={content}
                    title=""
                    trigger="click"
                    placement="top"
                  >
                    <div className="relative px-[.5em] pt-[.6rem] border-[#1F1F1F] border-t w-full">
                      <div className="relative px-[.6rem] py-[.6rem] flex items-center cursor-pointer hover:bg-[#1F1F1F] rounded-[0.5rem] group w-[full]">
                        <div className=" mr-3 ">
                          {user && <Tooltip
                            // key={user?.email}
                            // title={user?.name}
                            placement="top"
                          >
                            <Avatar
                              shape="square"
                              className="w-[1.8rem] h-[1.8rem]"
                              src={
                                <Image
                                  preview={false}
                                  src="/images/drawer/memoji.png"
                                  alt="memoji"
                                  className="w-full h-full rounded-full"
                                  style={{
                                    padding: "1px"
                                  }}
                                />
                              }
                              style={{
                                backgroundColor: user?.color || '#965CDE',
                              }}
                            />
                          </Tooltip>}
                        </div>
                        <div className="max-w-[65%]">
                          <div className="flex items-center mb-[1]">
                            <Text_14_600_EEEEEE className="mr-2 truncate max-w-[100%] overflow-hidden">
                              {user?.name}
                            </Text_14_600_EEEEEE>
                            {(user?.role === "admin" || user?.role === "super_admin") && (
                              <div className="bg-[#965CDE33] text-[#CFABFC] px-2 py-[3px] rounded-[50px] border border-[#CFABFC] text-[0.45rem] leading-[100%] text-nowrap">
                                {roleMapping[user?.role]}
                              </div>
                            )}
                          </div>
                          <Text_12_300_B3B3B3 className="truncate max-w-[100%] overflow-hidden">
                            {user?.email}
                          </Text_12_300_B3B3B3>
                        </div>
                        <div className="absolute w-[1.1rem] h-[1.1rem] right-[.5rem] top-[0rem] bottom-0 m-auto flex justify-center items-center">
                          <Image
                            preview={false}
                            src="/images/icons/dropIcn.svg"
                            alt="memoji"
                            className="w-[1.1rem] h-[1.1rem] rounded-full rotate-[-90deg]"
                            style={{
                              padding: "1px"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Popover>
                </ConfigProvider>
              </div>
            </div>
          </div>
          {/* Render the right side content based on the route */}
          <div className="blur-sm" />
          <div className="rightWrap py-[0.75rem] pr-[0.6875rem]">
            <div
              className={`rightDiv rounded-[17px] overflow-hidden ${isDrawerOpen && !showMinimizedItem ? "blur-sm" : ""
                // className={`rightDiv rounded-xl overflow-hidden	my-[0.5em] mr-[0.5em] ${isDrawerOpen ? "blur-sm" : ""
                }`}
            >
              {headerItems && (
                <div
                  className="headerWrap"
                >
                  <div className="pr-10">{headerItems}</div>
                </div>
              )}
              {/* Render children components here */}
              {children}
            </div>
          </div>
        </div>
        {/* Add footer or other common components here */}
      </Theme>
    </div>
  );
};

export default DashBoardLayout;
