export interface Preferences {
  gender: string;
  age: [number, number];
}

export interface Profile {
  accountId: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  picture: string;
  birthday: string;
  preferences: Preferences;
}

export interface MatchDocument {
  _id: string;
  profiles: string[];
}
