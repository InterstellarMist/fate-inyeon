import {
  Button,
  Form,
  Input,
  Textarea,
  Chip,
  DatePicker,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { ProfileCard } from "../components/ProfileCard";
import {
  ImageIcon,
  LogOut,
  Mars,
  Save,
  Venus,
  VenusAndMars,
} from "lucide-react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useTopBarTab } from "../contexts/TopBarTabContext";
import { useAuth } from "../contexts/AuthContext";
import useSWR from "swr";
import type { Profile } from "../types/apiTypes";
import { useEffect, useState } from "react";
import { calculateAge } from "../lib/utils";
import { uploadImageToImgBB } from "../lib/imageUpload";

const API_URL = import.meta.env.VITE_API_URL || "";

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

export const GenderSelection = ({
  gender,
  setGender,
}: {
  gender: string;
  setGender: (gender: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <p className="text-xs text-white/80 font-bold">Gender</p>
      <div className="flex flex-wrap gap-2">
        <Chip
          as="button"
          type="button"
          color={gender === "Male" ? "primary" : "default"}
          variant={gender === "Male" ? "shadow" : "flat"}
          startContent={<Mars color="white" size={16} className="ml-1" />}
          className="cursor-pointer hover:bg-white/20 transition-colors"
          onClick={() => setGender(gender === "Male" ? "" : "Male")}
        >
          Male
        </Chip>
        <Chip
          as="button"
          type="button"
          color={gender === "Female" ? "danger" : "default"}
          variant={gender === "Female" ? "shadow" : "flat"}
          startContent={<Venus color="white" size={16} className="ml-1" />}
          className="cursor-pointer hover:bg-white/20 transition-colors"
          onClick={() => setGender(gender === "Female" ? "" : "Female")}
        >
          Female
        </Chip>
        <Chip
          as="button"
          type="button"
          color={gender === "Other" ? "success" : "default"}
          variant={gender === "Other" ? "shadow" : "flat"}
          startContent={
            <VenusAndMars color="white" size={16} className="ml-1" />
          }
          className="cursor-pointer hover:bg-white/20 transition-colors"
          onClick={() => setGender(gender === "Other" ? "" : "Other")}
        >
          Other
        </Chip>
      </div>
    </div>
  );
};

export const AgeRangeSelection = ({
  age,
  setAge,
}: {
  age: [number, number];
  setAge: (age: [number, number]) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <p className="text-xs text-white/80 font-bold">Age Range</p>
      <div className="flex flex-wrap gap-2">
        {[
          { label: "18-25", range: [18, 25] },
          { label: "26-30", range: [26, 30] },
          { label: "31-35", range: [31, 35] },
          { label: "36-40", range: [36, 40] },
          { label: "41-45", range: [41, 45] },
          { label: "46+", range: [46, 60] },
        ].map((bracket) => {
          const isSelected =
            age[0] === bracket.range[0] && age[1] === bracket.range[1];
          return (
            <Chip
              key={bracket.label}
              as="button"
              type="button"
              color={isSelected ? "secondary" : "default"}
              variant={isSelected ? "shadow" : "flat"}
              className="cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setAge(bracket.range as [number, number])}
            >
              {bracket.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

// TODO: card variant should be dynamic based one media query
export const ProfilePage = () => {
  const { selectedTab } = useTopBarTab();
  const { logout, token } = useAuth();
  const { data, error, isLoading } = useSWR<Profile>("/api/users/my-profile");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState(new CalendarDate(1990, 1, 1));
  const [picture, setPicture] = useState("");
  const [prefGender, setPrefGender] = useState("");
  const [prefAge, setPrefAge] = useState<[number, number]>([28, 35]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setName(data?.name || "");
    setGender(data?.gender || "");
    setLocation(data?.location || "");
    setBio(data?.bio || "");
    setBirthday(parseDate(data?.birthday || "1990-01-01"));
    setPicture(data?.picture || "");
    setPrefGender(data?.preferences.gender || "");
    setPrefAge(data?.preferences.age || [28, 35]);
  }, [data]);

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

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
      const response = await fetch(`${API_URL}/api/users/edit-profile`, {
        method: "PUT",
        body: JSON.stringify(profileData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      console.log("Updated profile data:", updatedData);

      addToast({
        title: "Success",
        description: "Profile updated successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
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

  if (selectedTab === "profile") {
    return (
      <div className="grid grid-cols-1 justify-items-center h-full w-full pt-4 md:pb-22 pb-28 px-4">
        <ProfileCard
          profile={data}
          className="md:max-h-[calc(100dvh-300px)] max-h-[calc(100dvh-300px)] min-h-0 aspect-2/3 max-w-full"
          variant="default"
          disabled
          isMain
        />
        <Button
          type="button"
          size="md"
          color="danger"
          className="text-white h-10 shrink-0"
          startContent={<LogOut color="white" />}
          onPress={() => logout()}
          radius="full"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="md:grid md:grid-cols-2 md:items-start flex flex-col items-center h-full w-full pt-4 pb-20 px-4 gap-8 overflow-y-auto md:overflow-y-hidden">
      <ProfileCard
        profile={{
          picture: picture,
          name: name,
          location: location,
          bio: bio,
          birthday: birthday.toString(),
          preferences: { gender: prefGender, age: prefAge },
        }}
        className="min-h-0 max-h-[300px] md:max-h-[calc(100dvh-240px)] w-fit aspect-2/3 md:justify-self-end shrink-0"
        variant="small"
        disabled
        isMain
      />
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 min-h-0 md:max-h-[calc(100dvh-240px)] w-fit md:overflow-y-auto md:justify-self-start md:h-full pr-4 pb-10 shrink-0"
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
          onChange={(date) => setBirthday(date || new CalendarDate(1990, 1, 1))}
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
            id="profile-picture-upload-edit"
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
              document.getElementById("profile-picture-upload-edit")?.click()
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
          Save Changes
        </Button>
      </Form>
    </div>
  );
};
