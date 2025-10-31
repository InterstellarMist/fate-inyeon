import { ProfileCard } from "../components/ProfileCard";
import { useTopBarTab } from "../contexts/TopBarTabContext";
import type { MatchDocument, Profile } from "../types/apiTypes";
import useSWR from "swr";

interface MatchesData {
  matches: MatchDocument[];
  profiles: Profile[];
}

export const MatchesPage = () => {
  const { selectedTab } = useTopBarTab();
  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useSWR<MatchesData>("/api/matches");
  const {
    data: likesData,
    error: likesError,
    isLoading: likesLoading,
  } = useSWR<Profile[]>("/api/likes");

  if (matchesError || likesError)
    return <div>Error: {matchesError?.message || likesError?.message}</div>;
  if (matchesLoading || likesLoading) return <div>Loading...</div>;
  if (!matchesData || !likesData) return <div>No data</div>;

  const profilesToShow =
    selectedTab === "likes" ? likesData : matchesData.profiles;

  return (
    <div className="md:w-[768px] w-full grid min-[550px]:grid-cols-3 grid-cols-2 gap-4 px-8 pt-4 pb-30 overflow-y-auto">
      {profilesToShow.map((profile, index) => (
        <div key={index} className="col-span-1 ">
          <ProfileCard
            profile={{
              picture: profile.picture,
              name: profile.name,
              birthday: profile.birthday,
              location: profile.location,
              bio: profile.bio,
            }}
            variant="small"
            disabled
            isMain
          />
        </div>
      ))}
    </div>
  );
};
