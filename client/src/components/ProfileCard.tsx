import { calculateAge, cn } from "../lib/utils";
import { Card, CardFooter, Image } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { ChevronsUp, MapPin } from "lucide-react";
import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
  useAnimationControls,
} from "framer-motion";
import { useState, useEffect } from "react";
import type React from "react";

interface Preferences {
  gender: string;
  age: number[];
}

interface Profile {
  name: string;
  birthday: string;
  location: string;
  bio: string;
  picture: string;
  preferences?: Preferences;
}

interface ImageProps {
  rotate?: "left" | "right" | "none";
  isMain?: boolean;
  className?: string;
  variant?: "default" | "small";
  accountId?: string;
  onLike?: () => void;
  onDislike?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const SWIPE_THRESHOLD_X = 100;

export const ProfileCard = ({
  profile,
  className,
  rotate = "none",
  isMain = false,
  variant = "default",
  onLike,
  onDislike,
  disabled = false,
  style,
}: { profile: Profile } & ImageProps) => {
  const { name, birthday, location, bio, picture } = profile;
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isResetting, setIsResetting] = useState(false);

  // Motion values for real-time rotation (0.1 degrees per pixel)
  const x = useMotionValue(0);
  const rotation = useTransform(x, (latest) => latest * 0.1);
  const controls = useAnimationControls();

  // Initialize controls to center position
  useEffect(() => {
    controls.set({ x: 0, rotate: 0, opacity: 1, scale: 1 });
  }, [controls]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;

    // Horizontal swipe only
    if (offset.x > SWIPE_THRESHOLD_X || velocity.x > 1000) {
      // Swipe right - like
      setExitDirection("right");
      // Call callback after a short delay to allow animation
      setTimeout(() => {
        if (onLike) {
          onLike();
        }
      }, 300);
    } else if (offset.x < -SWIPE_THRESHOLD_X || velocity.x < -1000) {
      // Swipe left - dislike
      setExitDirection("left");
      // Call callback after a short delay to allow animation
      setTimeout(() => {
        if (onDislike) {
          onDislike();
        }
      }, 300);
    } else {
      // Swipe didn't meet threshold - reset to center
      setIsResetting(true);
      x.set(0);
      controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          onComplete: () => {
            setIsResetting(false);
          },
        },
      });
    }
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Update motion value for rotation
    x.set(info.offset.x);
  };

  const cardContent = (
    <Card
      className={cn(
        "p-1 overflow-hidden",
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
        draggable={false}
        className={cn(
          variant === "default"
            ? "md:rounded-[100px] rounded-[70px]"
            : "md:rounded-[50px] rounded-[30px]",
          "object-cover aspect-2/3 select-none"
        )}
      />
      {/* Profile information */}
      <CardFooter
        className={cn(
          "absolute bottom-1 items-start flex flex-col w-[calc(100%-8px)] text-white pt-10 px-2 z-10 bg-linear-to-b from-transparent transition-all duration-300",
          variant === "default"
            ? "md:rounded-bl-[100px] md:rounded-br-[100px] rounded-bl-[70px] rounded-br-[70px]"
            : "md:rounded-bl-[50px] md:rounded-br-[50px] rounded-bl-[30px] rounded-br-[30px]",
          isBioExpanded
            ? "pt-4 via-black/40 via-30% to-black/70"
            : "via-black/30 via-30% to-transparent"
        )}
      >
        <p
          className={cn(
            "font-bold [text-shadow:2px_2px_8px_rgba(0,0,0,0.8)]",
            variant === "default" ? "text-2xl" : "text-lg"
          )}
        >
          {name}, {calculateAge(parseDate(birthday))}
        </p>
        <p
          className={cn(
            "flex items-center gap-1 [text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]",
            variant === "default" ? "text-sm" : "text-xs"
          )}
        >
          <MapPin className="inline-block" size={16} /> {location}
        </p>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isBioExpanded ? "max-h-96 mt-2 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <p
            className={cn(
              "[text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]",
              variant === "default" ? "text-sm" : "text-xs"
            )}
          >
            {bio}
          </p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsBioExpanded((prev) => !prev);
          }}
          className={cn(
            "flex flex-col items-center gap-1 mt-10 self-center drop-shadow-[0_0_4px_rgba(0,0,0,1)] cursor-pointer hover:opacity-80 transition-opacity",
            variant === "default" ? "mt-10" : "mt-5"
          )}
        >
          <ChevronsUp
            size={24}
            className={cn(
              "transition-transform",
              isBioExpanded && "rotate-180"
            )}
          />
          <p className="text-[10px]">
            {isBioExpanded ? "Hide Bio" : "View Bio"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  if (!isMain || disabled) {
    return (
      <div className={className} style={style}>
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        cursor: exitDirection ? "default" : "grab",
        rotate: exitDirection || isResetting ? undefined : rotation,
      }}
      drag="x"
      dragConstraints={{
        left: -Infinity,
        right: Infinity,
      }}
      dragElastic={0.2}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={(event, info) => {
        handleDragEnd(event, info);
      }}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 1000 : -1000,
              rotate: exitDirection === "right" ? 30 : -30,
              opacity: 0,
              scale: 0.8,
            }
          : controls
      }
      transition={
        exitDirection
          ? {
              duration: 0.3,
              ease: "easeInOut",
            }
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
            }
      }
      whileDrag={{
        scale: 1.05,
      }}
    >
      {cardContent}
    </motion.div>
  );
};
