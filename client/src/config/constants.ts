import { swatch, fileIcon, download } from "../assets";

export interface TabType {
  name:
    | "colorpicker"
    | "filepicker"
    | "aipicker"
    | "stylishShirt"
    | "logoShirt"
    | "download"
    | "leftShoulder" // New left shoulder tab
    | "rightShoulder" // New right shoulder tab
    | "back" // New back tab
    | "preview"
  icon?: string; // Icon as a string, assuming the path or identifier for the icon
  ButtonName?: string;
}


export const EditorTabs : TabType[] = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
];

export const FilterTabs: TabType[] = [
  {
    name: "logoShirt",
    ButtonName: "Chest",
  },
  {
    name: "stylishShirt",
    ButtonName: "Full",
  },
  // {
  //   name: "leftShoulder",
  //   ButtonName: "Left", // Replace with actual icon import
  // },
  // {
  //   name: "rightShoulder",
  //   ButtonName: "Right", // Replace with actual icon import
  // },
  {
    name: "back",
    ButtonName: "Back", // Replace with actual icon import
  }
];

export const DownloadTab : TabType = {
  name : "download", 
  icon : download
}

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal" as const, // Ensure it's a literal type
    filterTab: "logoShirt" as const,
  },
  full: {
    stateProperty: "fullDecal" as const,
    filterTab: "stylishShirt" as const,
  },
  leftShoulder: {
    stateProperty: "isLeftShoulderLogo" as const,
    filterTab: "leftShoulder" as const,
  },
  rightShoulder: {
    stateProperty: "isRightShoulderLogo" as const,
    filterTab: "rightShoulder" as const,
  },
  back: {
    stateProperty: "isBackLogo" as const,
    filterTab: "back" as const,
  },
} as const; // This ensures that the entire object is treated as literal types

