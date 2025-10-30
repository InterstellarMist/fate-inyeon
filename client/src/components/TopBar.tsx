import { BellRing, Moon } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "../lib/utils";

const NavBarTab = ({
  className,
  title,
}: {
  className?: string;
  title: string;
}) => {
  return (
    <div
      className={cn(
        "size-fit text-white text-[1.5rem] md:text-[2rem] font-bold md:border-b-4 border-b-2 border-white mt-6 md:mt-0",
        className
      )}
    >
      {title}
    </div>
  );
};

const NavBarTabs = () => {
  const { pathname } = useLocation();

  const gridStyle =
    "justify-self-center md:col-start-2 md:row-start-1 col-start-1 row-start-2 row-span-1 col-span-2 md:col-span-1";

  switch (pathname) {
    case "/":
      return <NavBarTab className={gridStyle} title="Find Your Fate" />;
    case "/matches":
      return (
        <div className={cn(gridStyle, "flex gap-6")}>
          <NavBarTab title="Matches" />
          <NavBarTab title="Likes" />
        </div>
      );
    case "/messages":
      return <NavBarTab className={gridStyle} title="Messages" />;
    case "/profile":
      return (
        <div className={cn(gridStyle, "flex gap-8")}>
          <NavBarTab title="Your Profile" />
          <NavBarTab title="Edit Profile" />
        </div>
      );
    default:
      return <NavBarTab className={gridStyle} title="Find Your Fate" />;
  }
};

export const TopBar = () => {
  return (
    <div className="flex flex-col">
      <div className="grid md:grid-cols-[minmax(240px,1fr)_auto_1fr] grid-cols-[auto_auto] w-screen md:px-8 md:pt-8 px-4 pt-4 items-center">
        <div className="w-fit text-[2rem] md:text-[2.5rem] font-medium text-white border-2 md:border-4 border-white md:rounded-2xl rounded-xl p-2 md:p-4 leading-none">
          <span className="font-nanum-gothic font-bold">인연</span> | Fate
        </div>
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
