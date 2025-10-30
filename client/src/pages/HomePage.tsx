import { EyeOff, Heart, Redo, Undo } from "lucide-react";
import { ProfileCard } from "../components/ProfileCard";

const images = [
  "/profiles/eunha-viviz.jpg",
  "/profiles/umij-viviz.jpeg",
  "/profiles/sinb-viviz.jpg",
];

export const HomePage = () => {
  return (
    <div className="grid md:grid-cols-[auto_max-content_auto] grid-cols-1 items-center gap-16 h-full w-full md:pt-4 md:pb-20 pt-4 px-16 pb-20">
      <div className="hidden md:flex flex-col items-center justify-self-end">
        <EyeOff size={32} color="white" strokeWidth={3} />
        <Undo size={64} color="white" />
      </div>
      <div className="relative md:max-h-[calc(100dvh-270px)] min-h-0 max-h-[calc(100dvh-300px)] aspect-2/3 justify-self-center">
        <ProfileCard
          profilePicture={images[2]}
          className="absolute top-0 left-0 z-10"
          rotate="right"
          name="Sinb (신비)"
          age={27}
          location="Seoul, South Korea"
          bio="I'm a software engineer"
          birthday="1990-01-01"
          preferences={{ gender: "female", age: [25, 30] }}
        />
        <ProfileCard
          profilePicture={images[1]}
          className="absolute top-0 left-0 z-20"
          rotate="left"
          name="Umji (엄지)"
          age={27}
          location="Seoul, South Korea"
          bio="I'm a software engineer"
          birthday="1990-01-01"
          preferences={{ gender: "female", age: [25, 30] }}
        />
        <ProfileCard
          profilePicture={images[0]}
          className="relative top-0 left-0 z-30"
          rotate="none"
          isMain
          name="Eunha (은하)"
          age={28}
          location="Seoul, South Korea"
          bio="I'm a software engineer"
          birthday="1990-01-01"
          preferences={{ gender: "female", age: [25, 30] }}
        />
      </div>
      <div className="hidden md:flex flex-col items-center justify-self-start">
        <Heart size={32} color="white" strokeWidth={3} />
        <Redo size={64} color="white" />
      </div>
    </div>
  );
};
