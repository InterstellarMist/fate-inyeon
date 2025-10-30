import { Button, Form, Input, Textarea, DateInput, Chip } from "@heroui/react";
import { ProfileCard } from "../components/ProfileCard";
import { ImageIcon, Mars, Save, Venus, VenusAndMars } from "lucide-react";
import { CalendarDate } from "@internationalized/date";

const profile = {
  name: "Jeonghan (정한)",
  age: 30,
  location: "Seoul, South Korea",
  profilePicture: "/profiles/jeonghan-seventeen.jpg",
  bio: "I'm a software engineer",
  birthday: "1990-01-01",
  preferences: { gender: "female", age: [28, 35] },
};

const InputStyles = {
  // Force label color to white across all states; increase specificity with important and data-state selectors
  label:
    "font-bold !text-white group-data-[focus=true]:!text-white group-data-[filled=true]:!text-white group-data-[invalid=true]:!text-white",
  inputWrapper:
    "bg-white/20 border-2 border-white data-[hover=true]:bg-white/30 focus-within:bg-white/30",
  input:
    "text-white placeholder:text-white/70 group-data-[has-value=true]:text-[#3f3f3f]",
};

const DateInputStyles = {
  label:
    "font-bold !text-white group-data-[focus=true]:!text-white group-data-[filled=true]:!text-white group-data-[invalid=true]:!text-white",
  inputWrapper:
    "bg-white/20 border-2 border-white data-[hover=true]:bg-white/30 focus-within:bg-white/30",
  input:
    "text-white placeholder:text-white/70 group-data-[has-value=true]:text-[#3f3f3f]",
};

const PreferencesChips = ({
  variant,
  value,
}: {
  variant: "gender" | "age";
  value: string;
}) => {
  switch (variant) {
    case "gender":
      switch (value) {
        case "male":
          return (
            <Chip
              color="primary"
              startContent={<Mars color="white" size={16} />}
            >
              Male
            </Chip>
          );
        case "female":
          return (
            <Chip
              color="primary"
              startContent={<Venus color="white" size={16} />}
            >
              Female
            </Chip>
          );
        default:
          return (
            <Chip
              color="primary"
              startContent={<VenusAndMars color="white" size={16} />}
            >
              Other
            </Chip>
          );
      }
    case "age":
      return <Chip color="secondary">Ages {value}</Chip>;
  }
};

export const ProfilePage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    console.log(data);
  };

  return (
    <div className="md:grid md:grid-cols-2 md:items-start flex flex-col items-center h-full w-full pt-4 pb-20 px-4 gap-8 overflow-y-auto md:overflow-y-hidden">
      <ProfileCard
        profilePicture={profile.profilePicture}
        className="min-h-0 max-h-[300px] md:max-h-[calc(100dvh-240px)] w-fit aspect-2/3 md:justify-self-end shrink-0"
        name={profile.name}
        age={profile.age}
        location={profile.location}
        bio={profile.bio}
        birthday={profile.birthday}
        preferences={profile.preferences}
        variant="small"
        isMain
      />
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 min-h-0 md:max-h-[calc(100dvh-240px)] w-fit md:overflow-y-auto md:justify-self-start md:h-full pr-4 pb-10 shrink-0"
      >
        <Input
          type="text"
          placeholder="Name"
          label="Name"
          labelPlacement="outside"
          className="w-[200px]"
          classNames={InputStyles}
        />
        <Input
          type="text"
          placeholder="Gender"
          label="Gender"
          labelPlacement="outside"
          className="w-[200px]"
          classNames={InputStyles}
        />
        <Input
          type="text"
          placeholder="Location"
          label="Location"
          labelPlacement="outside"
          className="w-[200px]"
          classNames={InputStyles}
        />
        <Textarea
          placeholder="Bio"
          label="Bio"
          className="w-[300px]"
          labelPlacement="outside"
          classNames={InputStyles}
        />
        <DateInput
          placeholderValue={new CalendarDate(1990, 1, 1)}
          label="Birthday"
          labelPlacement="outside"
          className="w-[200px]"
          classNames={DateInputStyles}
        />
        <p className="text-sm font-bold text-white">Looking For</p>
        <div className="flex flex-wrap gap-2">
          <PreferencesChips
            variant="gender"
            value={profile.preferences.gender}
          />
          <PreferencesChips
            variant="age"
            value={
              profile.preferences.age[0].toString() +
              "-" +
              profile.preferences.age[1].toString()
            }
          />
        </div>
        <Button
          type="button"
          size="md"
          className="text-[#3f3f3f] h-10 shrink-0"
          startContent={<ImageIcon color="#3f3f3f" />}
          radius="full"
        >
          Change Profile Picture
        </Button>
        <Button
          type="submit"
          size="md"
          className="text-[#3f3f3f] mt-8 h-10 shrink-0"
          startContent={<Save color="#3f3f3f" />}
          radius="full"
        >
          Save Changes
        </Button>
      </Form>
    </div>
  );
};
