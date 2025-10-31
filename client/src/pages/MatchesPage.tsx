import { ProfileCard } from "../components/ProfileCard";
import { useTopBarTab } from "../contexts/TopBarTabContext";

const allProfiles = [
  {
    name: "Eunha (은하)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/eunha-viviz.jpg",
    bio: "Soft heart, sharp wit. I love rainy days, cozy playlists, and people who make time slow down.",
  },
  {
    name: "Umji (엄지)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/umij-viviz.jpeg",
    bio: "I look chill, but my friends say I’m secretly the chaos. Coffee before conversation.",
  },
  {
    name: "Sinb (신비)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/sinb-viviz.jpg",
    bio: "I look chill, but my friends say I’m secretly the chaos. Coffee before conversation.",
  },
  {
    name: "Liz (리즈)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/liz-ive.jpg",
    bio: "Can’t start the day without music and iced Americano. Looking for someone to match my energy (or at least pretend to).",
  },
  {
    name: "Rei (레이)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/rei-ive.jpeg",
    bio: "Introvert with extrovert hobbies. Let’s go for long walks and talk about everything and nothing.",
  },
  {
    name: "Wonyoung (원영)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/wonyoung-ive.jpeg",
    bio: "Introvert with extrovert hobbies. Let’s go for long walks and talk about everything and nothing.",
  },
  {
    name: "Leeseo (이서)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/leeseo-ive.jpg",
    bio: "Introvert with extrovert hobbies. Let’s go for long walks and talk about everything and nothing.",
  },
  {
    name: "Gaeul (거을)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/gaeul-ive.jpg",
    bio: "Introvert with extrovert hobbies. Let’s go for long walks and talk about everything and nothing.",
  },
  {
    name: "Yujin (유진)",
    birthday: "1990-01-01",
    location: "Seoul, South Korea",
    picture: "/profiles/yujin-ive.jpeg",
    bio: "Introvert with extrovert hobbies. Let’s go for long walks and talk about everything and nothing.",
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
            birthday={profile.birthday}
            location={profile.location}
            bio={profile.bio}
            variant="small"
            isMain
          />
        </div>
      ))}
    </div>
  );
};
