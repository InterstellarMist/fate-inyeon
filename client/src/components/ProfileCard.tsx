import { cn } from "../lib/utils";
import { Card, CardFooter, Image } from "@heroui/react";
import { ChevronsUp, MapPin } from "lucide-react";

interface Preferences {
  gender: string;
  age: number[];
}

interface Profile {
  name: string;
  age: number;
  location: string;
  bio?: string;
  picture: string;
  birthday?: string;
  preferences?: Preferences;
}

interface ImageProps {
  rotate?: "left" | "right" | "none";
  isMain?: boolean;
  className?: string;
  variant?: "default" | "small";
}

export const ProfileCard = ({
  picture,
  age,
  className,
  rotate = "none",
  isMain = false,
  name,
  location,
  variant = "default",
}: Profile & ImageProps) => {
  return (
    <Card
      className={cn(
        "p-1",
        className,
        variant === "default"
          ? "md:rounded-[100px] rounded-[70px]"
          : "md:rounded-[50px] rounded-[30px]",
        rotate === "left"
          ? "rotate-350 -translate-y-5 -translate-x-10"
          : rotate === "right"
          ? "rotate-10 -translate-y-5 translate-x-10"
          : "",
        isMain ? "rainbow-gradient" : "blur-[2px] p-0"
      )}
    >
      <Image
        src={picture}
        alt={name}
        className={cn(
          variant === "default"
            ? "md:rounded-[100px] rounded-[70px]"
            : "md:rounded-[50px] rounded-[30px]",
          "object-cover aspect-2/3"
        )}
      />
      {/* Profile information */}
      <CardFooter className="absolute bottom-1 items-start flex flex-col w-full text-white p-2 z-10">
        <p
          className={cn(
            "font-bold",
            variant === "default" ? "text-2xl" : "text-lg"
          )}
        >
          {name}, {age}
        </p>
        <p
          className={cn(
            "flex items-center gap-1",
            variant === "default" ? "text-sm" : "text-xs"
          )}
        >
          <MapPin className="inline-block" size={16} /> {location}
        </p>
        <div
          className={cn(
            "flex flex-col items-center gap-1 mt-10 self-center",
            variant === "default" ? "mt-10" : "mt-5"
          )}
        >
          <ChevronsUp size={24} />
          <p className="text-[10px]">Swipe Up</p>
        </div>
      </CardFooter>
    </Card>
  );
};
