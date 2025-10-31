import { ProfileCard } from "../components/ProfileCard";
import { useTopBarTab } from "../contexts/TopBarTabContext";

const allProfiles = [
  {
    name: "Eunha (은하)",
    age: 28,
    location: "Seoul, South Korea",
    picture: "/profiles/eunha-viviz.jpg",
  },
  {
    name: "Umji (엄지)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/umij-viviz.jpeg",
  },
  {
    name: "Sinb (신비)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/sinb-viviz.jpg",
  },
  {
    name: "Liz (리즈)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/liz-ive.jpg",
  },
  {
    name: "Rei (레이)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/rei-ive.jpeg",
  },
  {
    name: "Wonyoung (원영)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/wonyoung-ive.jpeg",
  },
  {
    name: "Leeseo (이서)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/leeseo-ive.jpg",
  },
  {
    name: "Gaeul (거을)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/gaeul-ive.jpg",
  },
  {
    name: "Yujin (유진)",
    age: 27,
    location: "Seoul, South Korea",
    picture: "/profiles/yujin-ive.jpeg",
  },
];

// Example: Liked profiles might be a subset
const likedProfiles = allProfiles.slice(0, 4);

export const MatchesPage = () => {
  const { selectedTab } = useTopBarTab();
  const profilesToShow = selectedTab === "likes" ? likedProfiles : allProfiles;

  return (
    <div className="md:w-[768px] w-full grid min-[550px]:grid-cols-3 grid-cols-2 gap-4 px-8 pt-4 pb-30 overflow-y-auto">
      {profilesToShow.map((profile, index) => (
        <div key={index} className="col-span-1 ">
          <ProfileCard
            picture={profile.picture}
            name={profile.name}
            age={profile.age}
            location={profile.location}
            variant="small"
            isMain
          />
        </div>
      ))}
    </div>
  );
};
