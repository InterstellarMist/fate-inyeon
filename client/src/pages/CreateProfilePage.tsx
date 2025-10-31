import {
  Button,
  Form,
  Input,
  Textarea,
  DatePicker,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { ProfileCard } from "../components/ProfileCard";
import { WebsiteLogo } from "../components/TopBar";
import { ImageIcon, Save } from "lucide-react";
import { CalendarDate } from "@internationalized/date";
import { useAuth } from "../contexts/AuthContext";
import useSWR from "swr";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { calculateAge } from "../lib/utils";
import { GenderSelection, AgeRangeSelection } from "./ProfilePage";
import { uploadImageToImgBB } from "../lib/imageUpload";

const API_URL = import.meta.env.VITE_API_URL || "";

// Placeholder image data URI for empty profile pictures - colorful gradient with user icon
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e41a19;stop-opacity:1' /%3E%3Cstop offset='33%25' style='stop-color:%23dc8d60;stop-opacity:1' /%3E%3Cstop offset='65%25' style='stop-color:%23dca232;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23a91cdc;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='600' fill='url(%23grad)'/%3E%3Cg transform='translate(200, 250)'%3E%3Ccircle cx='0' cy='-40' r='50' fill='rgba(255,255,255,0.3)'/%3E%3Cpath d='M -60 80 Q -60 40 -20 40 L 20 40 Q 60 40 60 80 L 60 120 L -60 120 Z' fill='rgba(255,255,255,0.3)'/%3E%3C/g%3E%3C/svg%3E";

const SelectStyles = {
  label:
    "font-bold !text-white group-data-[focus=true]:!text-white group-data-[filled=true]:!text-white group-data-[invalid=true]:!text-white",
  trigger:
    "bg-white/20 border-2 border-white data-[hover=true]:bg-white/30 data-[focus=true]:bg-white/30",
  value: "text-white group-data-[has-value=true]:text-default-800 font-medium",
};

const InputStyles = {
  label:
    "font-bold !text-white group-data-[focus=true]:!text-white group-data-[filled=true]:!text-white group-data-[invalid=true]:!text-white",
  inputWrapper:
    "bg-white/20 border-2 border-white data-[hover=true]:bg-white/30 focus-within:bg-white/30",
  input:
    "text-white placeholder:text-white/70 group-data-[has-value=true]:text-default-800 font-medium",
};

const DateInputStyles = {
  label:
    "font-bold !text-white group-data-[focus=true]:!text-white group-data-[filled=true]:!text-white group-data-[invalid=true]:!text-white",
  inputWrapper:
    "bg-white/20 border-2 border-white data-[hover=true]:bg-white/30 focus-within:bg-white/30",
  input:
    "text-white placeholder:text-white/70 group-data-[has-value=true]:text-default-800 font-medium",
  selectorIcon: "text-default-800",
};

export const CreateProfilePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { data: existingProfile, error: profileError } = useSWR<{
    accountId: string;
  }>("/api/users/my-profile");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState(new CalendarDate(2000, 1, 1));
  const [picture, setPicture] = useState(PLACEHOLDER_IMAGE);
  const [prefGender, setPrefGender] = useState("");
  const [prefAge, setPrefAge] = useState<[number, number]>([28, 35]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Redirect if profile already exists
  useEffect(() => {
    if (existingProfile && !profileError) {
      navigate("/", { replace: true });
    }
  }, [existingProfile, profileError, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profileData = {
      name: name,
      age: calculateAge(birthday),
      gender: gender,
      location: location,
      bio: bio,
      birthday: birthday.toString(),
      picture: picture,
      preferences: { gender: prefGender, age: prefAge },
    };

    try {
      const response = await fetch(`${API_URL}/api/users/new-profile`, {
        method: "POST",
        body: JSON.stringify(profileData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create profile");
      }

      const createdData = await response.json();
      console.log("Created profile data:", createdData);

      addToast({
        title: "Success",
        description: "Profile created successfully!",
        color: "success",
      });

      // Redirect to home page after successful creation
      navigate("/", { replace: true });
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create profile",
        color: "danger",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Error",
        description: "Please select a valid image file",
        color: "danger",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: "Error",
        description: "Image must be less than 5MB",
        color: "danger",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToImgBB(file);
      setPicture(imageUrl);
      addToast({
        title: "Success",
        description: "Image uploaded successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        color: "danger",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="md:grid md:grid-cols-3 flex flex-col items-center pt-8 pb-4 px-4 md:px-8">
        <WebsiteLogo isStatic className="mb-6 md:mb-0" />
        <div className="text-center justify-self-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Create Profile
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2">
            Set up your profile to get started
          </p>
        </div>
      </div>
      <div className="md:grid md:grid-cols-2 md:items-start flex flex-col items-center h-full w-full pb-8 pt-4 px-4 gap-8 overflow-y-auto md:overflow-y-hidden flex-1">
        <ProfileCard
          profile={{
            picture: picture,
            name: name || "Your Name",
            location: location || "Location",
            bio: bio || "Your bio will appear here",
            birthday: birthday.toString(),
            preferences: { gender: prefGender, age: prefAge },
          }}
          className="min-h-0 max-h-[300px] md:max-h-[calc(100dvh-180px)] w-fit aspect-2/3 md:justify-self-end shrink-0"
          variant="small"
          disabled
          isMain
        />
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 min-h-0 md:max-h-[calc(100dvh-180px)] w-fit md:overflow-y-auto md:justify-self-start md:h-full pr-4 pb-10 shrink-0"
        >
          <Input
            isRequired
            type="text"
            placeholder="Name"
            label="Name"
            labelPlacement="outside"
            className="w-[200px]"
            classNames={InputStyles}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            isRequired
            items={[
              { label: "Male", key: "Male" },
              { label: "Female", key: "Female" },
            ]}
            selectedKeys={gender ? [gender] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setGender(selectedKey || "");
            }}
            label="Gender"
            labelPlacement="outside"
            className="w-[200px]"
            classNames={SelectStyles}
          >
            <SelectItem key="Male">Male</SelectItem>
            <SelectItem key="Female">Female</SelectItem>
          </Select>
          <Input
            isRequired
            type="text"
            placeholder="Location"
            label="Location"
            labelPlacement="outside"
            className="w-[200px]"
            classNames={InputStyles}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Textarea
            isRequired
            placeholder="Bio"
            label="Bio"
            className="w-[300px]"
            labelPlacement="outside"
            classNames={InputStyles}
            value={bio}
            onValueChange={(value) => setBio(value)}
          />
          <DatePicker
            isRequired
            value={birthday}
            onChange={(date) =>
              setBirthday(date || new CalendarDate(1990, 1, 1))
            }
            label="Birthday"
            labelPlacement="outside"
            className="w-[200px]"
            classNames={DateInputStyles}
          />
          <p className="text-sm font-bold text-white">Looking For</p>
          <GenderSelection gender={prefGender} setGender={setPrefGender} />
          <AgeRangeSelection age={prefAge} setAge={setPrefAge} />

          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-picture-upload"
              disabled={uploadingImage}
            />
            <Button
              type="button"
              size="sm"
              color="primary"
              variant="solid"
              className="shrink-0"
              startContent={<ImageIcon size={20} />}
              radius="full"
              onClick={() =>
                document.getElementById("profile-picture-upload")?.click()
              }
              isLoading={uploadingImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Change Profile Picture"}
            </Button>
          </div>
          <Button
            type="submit"
            size="sm"
            color="default"
            variant="shadow"
            className="mt-8 shrink-0"
            startContent={<Save size={20} />}
            radius="full"
          >
            Create Profile
          </Button>
        </Form>
      </div>
    </div>
  );
};
