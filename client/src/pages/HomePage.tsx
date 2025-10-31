import { EyeOff, Flame, Heart, Redo, Undo } from "lucide-react";
import { ProfileCard } from "../components/ProfileCard";
import type { Profile } from "../types/apiTypes";
import { useState, useCallback, useEffect } from "react";
import { likeCandidate, dislikeCandidate } from "../lib/dataFetch";
import { useAuth } from "../contexts/AuthContext";
import useSWR from "swr";
import { addToast } from "@heroui/react";

// Mock profiles removed - using actual API data via useSWR

export const HomePage = () => {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState<(Profile & { accountId: string })[]>(
    []
  );

  const { data, error, isLoading } = useSWR<Profile[]>("/api/candidates");

  useEffect(() => {
    if (data) {
      setProfiles(data);
    }
  }, [data]);

  const handleLike = useCallback(
    async (accountId: string) => {
      console.log("Liking candidate:", accountId);
      try {
        const response = await likeCandidate(accountId, token);
        if (response.message === "Match found") {
          console.log("Match found:", response.match);
          addToast({
            title: "Match found",
            description: "You have a match!",
            icon: <Flame size={24} color="white" strokeWidth={3} />,
            color: "success",
          });
        } else {
          addToast({
            title: "Liked candidate successfully",
            description: "You liked a candidate!",
            icon: <Heart size={24} color="white" strokeWidth={3} />,
            color: "danger",
          });
        }
        setProfiles((prev) => prev.filter((p) => p.accountId !== accountId));
      } catch (error) {
        console.error("Failed to like candidate:", error);
        addToast({
          title: "Error",
          description: "Failed to like candidate",
          color: "danger",
        });
      }
    },
    [token]
  );

  const handleDislike = useCallback(
    async (accountId: string) => {
      console.log("Disliking candidate:", accountId);
      try {
        const response = await dislikeCandidate(accountId, token);
        console.log("Response:", response);
        if (response.message === "Disliked candidate successfully") {
          addToast({
            title: "Disliked candidate successfully",
            description: "You disliked a candidate!",
            color: "success",
          });
        } else {
          addToast({
            title: "Error",
            description: "Failed to dislike candidate",
            color: "danger",
          });
        }
        setProfiles((prev) => prev.filter((p) => p.accountId !== accountId));
      } catch (error) {
        console.error("Failed to dislike candidate:", error);
        addToast({
          title: "Error",
          description: "Failed to dislike candidate",
          color: "danger",
        });
      }
    },
    [token]
  );

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // Calculate z-index and rotation for each card in the stack
  const getCardProps = (index: number, total: number) => {
    const isMain = index === total - 1;
    const zIndex = (index + 1) * 10;
    let rotate: "left" | "right" | "none" = "none";

    if (!isMain) {
      // Alternate rotation for cards behind
      rotate = index % 2 === 0 ? "right" : "left";
    }

    return {
      isMain,
      zIndex,
      rotate,
      className: isMain ? "relative top-0 left-0" : "absolute top-0 left-0",
    };
  };

  return (
    <div className="grid md:grid-cols-[auto_max-content_auto] grid-cols-1 items-center gap-16 h-full w-full md:pt-4 md:pb-20 pt-4 px-16 pb-20">
      {profiles.length > 0 && (
        <>
          <div className="hidden md:flex flex-col items-center justify-self-end">
            <EyeOff size={32} color="white" strokeWidth={3} />
            <Undo size={64} color="white" />
          </div>
          <div className="relative md:max-h-[calc(100dvh-270px)] min-h-0 max-h-[calc(100dvh-300px)] aspect-2/3 justify-self-center">
            {profiles.map((profile, index) => {
              const { isMain, zIndex, rotate, className } = getCardProps(
                index,
                profiles.length
              );
              return (
                <ProfileCard
                  key={profile.accountId}
                  profile={profile}
                  className={className}
                  style={{ zIndex }}
                  rotate={rotate}
                  isMain={isMain}
                  disabled={!isMain}
                  onLike={
                    isMain ? () => handleLike(profile.accountId) : undefined
                  }
                  onDislike={
                    isMain ? () => handleDislike(profile.accountId) : undefined
                  }
                />
              );
            })}
          </div>
          <div className="hidden md:flex flex-col items-center justify-self-start">
            <Heart size={32} color="white" strokeWidth={3} />
            <Redo size={64} color="white" />
          </div>
        </>
      )}
      {profiles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p className="text-xl">No more profiles</p>
        </div>
      )}
    </div>
  );
};
