import "@/styles/globals.css";
import "@/styles/globals.scss";
import "@radix-ui/themes/styles.css";
import "antd/dist/reset.css"; // Ant Design's base CSS reset

import type { AppProps } from "next/app";
import Toast, { errorToast } from "./../components/toast";
import { useRouter } from "next/router";
import {
  AuthNavigationProvider,
  LoaderProvider,
  useLoader,
} from "../context/appContext";
import { Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import loaderIcn from "public/icons/loader.gif";
import Head from "next/head";
import BudDrawer from "@/components/ui/bud/drawer/BudDrawer";
import { NotificationBell, NovuProvider, PopoverNotificationCenter } from "@novu/notification-center";
import { apiBaseUrl, novuAppId, novuBackendUrl, novuSocketUrl } from "@/components/environment";
import axios from "axios";
import { OverlayProvider } from "src/context/overlayContext";
import BudIsland from "@/components/island/BudIsland";
import { useUser } from "src/stores/useUser";

const primaryColor = "white";
const secondaryColor = "#1F1F1F";
const primaryTextColor = "#0C0404";
const secondaryTextColor = "#494F55";
const unreadBackGroundColor = "#AFE1AF";
const primaryButtonBackGroundColor = unreadBackGroundColor;
const secondaryButtonBackGroundColor = "#C6DFCD";
const popupBgColor = '#101010'

const axiosInstance = axios.create({
  baseURL: apiBaseUrl
});

export const styles = {
  bellButton: {
    root: {
      svg: {
        color: "#EEE",
        fill: "",
        maxHeight: "20px",
        maxWidth: "20px"
      }
    },
    dot: {
      rect: {
        fill: "white",
        strokeWidth: "0",
        width: "10px",
        height: "10px",
        x: 0,
        y: 2
      }
    }
  },
  unseenBadge: {
    root: { color: primaryTextColor, background: '#fff' }
  },
  popover: {
    arrow: {
      backgroundColor: popupBgColor,
    },
    dropdown: {
      borderRadius: "10px",
      border: '#1F1F1F'
    }
  },
  layout: {
    root: {
      background: popupBgColor,
      borderColor: '#1F1F1F'
    }
  },
  loader: {
    root: {
      stroke: primaryColor
    }
  },
  notifications: {
    root: {
      ".nc-notifications-list-item": {
        backgroundColor: secondaryColor
      }
    },
    listItem: {
      layout: {
        borderRadius: "7px",
        color: '#FFF',
        fontSize: '.85rem',
        "div:has(> .mantine-Avatar-root)": {
          border: "none",
          width: "20px",
          height: "20px",
          minWidth: "20px"
        },
        ".mantine-Avatar-root": {
          width: "20px",
          height: "20px",
          minWidth: "20px"
        },
        ".mantine-Avatar-image": {
          width: "20px",
          height: "20px",
          minWidth: "20px"
        }
      },
      timestamp: { color: secondaryTextColor, fontWeight: "bold", fontSize: '.65rem' },
      dotsButton: {
        display: 'none',
        path: {
          fill: secondaryTextColor
        }
      },
      unread: {
        "::before": { background: unreadBackGroundColor }
      },
      buttons: {
        primary: {
          background: primaryButtonBackGroundColor,
          color: primaryTextColor,
          display: 'none',
          "&:hover": {
            background: primaryButtonBackGroundColor,
            color: secondaryTextColor
          }
        },
        secondary: {
          background: secondaryButtonBackGroundColor,
          color: secondaryTextColor,
          display: 'none',
          "&:hover": {
            background: secondaryButtonBackGroundColor,
            color: secondaryTextColor
          }
        }
      }
    }
  },
  actionsMenu: {
    // item: { "&:hover": { backgroundColor: secondaryColor } },
    dropdown: {
      transform: 'translateX(-10px)'
    },
    arrow: {
      borderTop: "0",
      borderLeft: "0"
    }
  },
}

function App(
  {
    Component,
    pageProps,
  }: {
    Component: any;
    pageProps: any;
  }
) {
  const { showLoader, hideLoader } = useLoader();
  const { user, getUser: fetchUser } = useUser();
  const router = useRouter();

  const getUser = async () => {
    showLoader();
    try {
      const userData: any = await fetchUser();
      if (!userData && router.pathname !== "/login") {
        return router.push("/login");
      }
      if(userData?.data?.result?.status === "invited"  && router.pathname !== "/login"){
        errorToast(`Please complete your registration by setting your password`);
        return router.push("/login");
      }
      if (userData && (router.pathname === "/" || router.pathname === '/auth/logIn')) {
        return router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error  fetching user", error);
      return router.push("/login");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (!user?.id) {
      getUser();
    }
  }, [router.pathname]);

  return (
    <NovuProvider backendUrl={novuBackendUrl} socketUrl={novuSocketUrl} subscriberId={user?.id} applicationIdentifier={novuAppId} styles={styles}>
      <Toast />
      <LoaderWrapper />
      <Component className="z-[999]" {...pageProps} />
      <BudDrawer />
    </NovuProvider>
  )
}

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <AuthNavigationProvider>
      <OverlayProvider>
        <LoaderProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Bud Serve</title>
          </Head>
          <App
            Component={Component}
            pageProps={pageProps}
          />
        </LoaderProvider>
      </OverlayProvider>

    </AuthNavigationProvider>
  );
}
const LoaderWrapper = () => {
  const { isLoading } = useLoader();

  return isLoading ? (
    <Box className="z-[1000] fixed top-0 left-0 w-screen h-screen flex justify-center items-center	backdrop-blur-[2px]">
      {/* <Spinner size="3" className="z-[1000] relative w-[20px] h-[20px] block" /> */}
      <Image
        width={20}
        className="w-[25px] h-[25px]"
        src={loaderIcn}
        alt="Logo"
      />
    </Box>
  ) : null;
};

export default MyApp;
