import { BellRing, Moon } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "../lib/utils";
import { Tab, Tabs } from "@heroui/react";
import { useTopBarTab } from "../contexts/TopBarTabContext";
import { useEffect } from "react";

const gridStyle =
  "justify-self-center md:col-start-2 md:row-start-1 col-start-1 row-start-2 row-span-1 col-span-2 md:col-span-1";

const tabStyles = {
  base: cn(gridStyle, "mt-6 md:mt-0"),
  tabList: "gap-6 bg-transparent",
  tabContent:
    "text-white group-data-[selected=true]:text-white text-[1.5rem] md:text-[2rem] font-bold",
  tab: "px-0 md:pb-4 pb-2 data-[selected=true]:border-white data-[selected=true]:border-b-2 md:data-[selected=true]:border-b-4 rounded-none",
  cursor: "hidden",
};

const NavBarTabs = () => {
  const { pathname } = useLocation();
  const { selectedTab, setSelectedTab } = useTopBarTab();

  // Reset tab selection when route changes
  useEffect(() => {
    switch (pathname) {
      case "/":
        setSelectedTab("home");
        break;
      case "/matches":
        setSelectedTab("matches");
        break;
      case "/messages":
        setSelectedTab("messages");
        break;
      case "/profile":
        setSelectedTab("profile");
        break;
      default:
        setSelectedTab("home");
    }
  }, [pathname, setSelectedTab]);

  switch (pathname) {
    case "/":
      return (
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={tabStyles}
        >
          <Tab key="home" title="Find Your Fate" />
        </Tabs>
      );
    case "/matches":
      return (
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={tabStyles}
        >
          <Tab key="matches" title="Matches" />
          <Tab key="likes" title="Likes" />
        </Tabs>
      );
    case "/messages":
      return (
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={tabStyles}
        >
          <Tab key="messages" title="Messages" />
        </Tabs>
      );
    case "/profile":
      return (
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={tabStyles}
        >
          <Tab key="profile" title="Your Profile" />
          <Tab key="edit" title="Edit Profile" />
        </Tabs>
      );
    default:
      return (
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={tabStyles}
        >
          <Tab key="home" title="Find Your Fate" />
        </Tabs>
      );
  }
};

export const WebsiteLogo = ({
  isStatic = false,
  className,
}: {
  isStatic?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-fit text-[2rem] md:text-[2.5rem] font-medium text-white border-2 md:border-4 border-white md:rounded-2xl rounded-xl p-2 md:p-4 leading-none",
        isStatic && "text-[2.5rem] rounded-2xl p-2 border-4 leading-none",
        className
      )}
    >
      <span className="font-nanum-gothic font-bold">인연</span> | Fate
    </div>
  );
};

export const TopBar = () => {
  return (
    <div className="flex flex-col">
      <div className="grid md:grid-cols-[minmax(240px,1fr)_auto_1fr] grid-cols-[auto_auto] w-screen md:px-8 md:pt-8 px-4 pt-4 items-center">
        <WebsiteLogo />
        <NavBarTabs />
        <div className="flex gap-2 justify-self-end">
          <div className="border-2 border-white rounded-full p-2">
            <Moon color="white" className="size-[24px] " />
          </div>
          <div className="border-2 border-white rounded-full p-2">
            <BellRing color="white" className="size-[24px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
