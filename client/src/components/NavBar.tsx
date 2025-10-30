import { Route, Routes, useLocation } from "react-router";
import { HomePage } from "../pages/HomePage";
import { cn, Tab, Tabs } from "@heroui/react";
import { CircleUserRound, Heart, House, MessageCircle } from "lucide-react";
import { MatchesPage } from "../pages/MatchesPage";
import { ProfilePage } from "../pages/ProfilePage";

export const NavBar = () => {
  const { pathname } = useLocation();

  const orangeGradientText =
    "group-data-[selected=true]:bg-linear-to-b group-data-[selected=true]:from-[rgba(228,112,112,1)] group-data-[selected=true]:to-[rgba(220,142,98,1)] group-data-[selected=true]:text-transparent group-data-[selected=true]:bg-clip-text";

  return (
    <div className="flex flex-col items-center justify-items-center flex-1">
      <div className="h-[calc(100vh-115px)] w-screen flex justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/messages" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <Tabs
        radius="full"
        selectedKey={pathname}
        aria-label="Tabs"
        classNames={{
          base: "fixed bottom-0 left-1/2 -translate-x-1/2 z-100",
          tabList: "my-6 md:w-[450px] min-w-[330px] p-2 bg-[#f4f4f5]/80",
          tab: "h-full",
        }}
      >
        <Tab
          key="/"
          href="/"
          title={
            <div className="flex flex-col items-center gap-1">
              <House className="group-data-[selected=true]:text-[rgba(228,112,112,1)]" />
              <p className={cn("text-xs", orangeGradientText)}>Home</p>
            </div>
          }
        />
        <Tab
          key="/matches"
          href="/matches"
          title={
            <div className="flex flex-col items-center gap-1">
              <Heart className="group-data-[selected=true]:text-[rgba(228,112,112,1)]" />
              <p className={cn("text-xs", orangeGradientText)}>Matches</p>
            </div>
          }
        />
        <Tab
          key="/messages"
          href="/messages"
          title={
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="group-data-[selected=true]:text-[rgba(228,112,112,1)]" />
              <p className={cn("text-xs", orangeGradientText)}>Messages</p>
            </div>
          }
        />
        <Tab
          key="/profile"
          href="/profile"
          title={
            <div className="flex flex-col items-center gap-1">
              <CircleUserRound className="group-data-[selected=true]:text-[rgba(228,112,112,1)]" />
              <p className={cn("text-xs", orangeGradientText)}>Profile</p>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
