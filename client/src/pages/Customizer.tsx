import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../store";

import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes, DownloadTab } from "../config/constants";

import { slideAnimation } from "../config/motion";

import { Tab, ColorPicker, FilePicker, CustomButton } from "../components";
interface StateType {
  intro: boolean;
  color: string;
  isLogoTexture: boolean;
  isFullTexture: boolean;
  isBackLogo: boolean;
  isRightShoulderLogo: boolean;
  isLeftShoulderLogo: boolean;
  logoDecal: string;
  fullDecal: string;
  mode: string;
}
type FilterTabNames = "logoShirt" | "stylishShirt" | "leftShoulder" | "rightShoulder" | "back";

type BooleanStateKeys = {
  [K in keyof StateType]: StateType[K] extends boolean ? K : never;
}[keyof StateType];

type StringStateKeys = {
  [K in keyof StateType]: StateType[K] extends string ? K : never;
}[keyof StateType];
const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState<File>();
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
    leftShoulder: false, // New left shoulder tab
    rightShoulder: false, // New right shoulder tab
    back: false, // New back tab
  });

  // Show tab content depending on the showing tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      default:
        return null;
    }
  };

  const handleDecals = (
    type: "logo" | "full" | "leftShoulder" | "rightShoulder" | "back",
    result: string | ArrayBuffer | null
  ) => {
    let decalType: {
      stateProperty: BooleanStateKeys;
      filterTab: FilterTabNames;
      imageProperty: StringStateKeys;
    };

    switch (type) {
      case "logo":
        decalType = { stateProperty: "isLogoTexture", filterTab: "logoShirt", imageProperty: "logoDecal" };
        break;
      case "full":
        decalType = { stateProperty: "isFullTexture", filterTab: "stylishShirt", imageProperty: "fullDecal" };
        break;
      case "leftShoulder":
        decalType = { stateProperty: "isLeftShoulderLogo", filterTab: "leftShoulder", imageProperty: "logoDecal" };
        break;
      case "rightShoulder":
        decalType = { stateProperty: "isRightShoulderLogo", filterTab: "rightShoulder", imageProperty: "logoDecal" };
        break;
      case "back":
        decalType = { stateProperty: "isBackLogo", filterTab: "back", imageProperty: "logoDecal" };
        break;
      default:
        return;
    }

    if (typeof result === "string") {
      state[decalType.imageProperty] = result;

      if (!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab);
      }
    }
  };

  const handleActiveFilterTab = (tabName: string) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      case "leftShoulder":
        state.isLeftShoulderLogo = !activeFilterTab[tabName];
        break;

      case "rightShoulder":
        state.isRightShoulderLogo = !activeFilterTab[tabName];
        break;

      case "back":
        console.log(activeFilterTab[tabName]);
        state.isBackLogo = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName as "logoShirt" | "stylishShirt"],
    }));
  };

  const readFile = (type: "logo" | "full") => {
    if (!file) return;
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Editor Tabs on top left */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10 p-2 flex flex-row items-center space-x-4 sm:space-x-6"
            {...slideAnimation("left")}
          >
            <div className="flex flex-row space-x-4">
              {EditorTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  handleClick={() => {
                    setActiveEditorTab(tab.name);
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 bottom-5 px-4 py-2 rounded-2xl left-0 right-0 flex justify-center items-center gap-4 bg-white shadow-md w-[20rem] sm:w-auto md:max-w-max mx-auto overflow-x-auto shadow-md"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                ButtonName={tab.ButtonName}
                isFilterTab
                isActiveTab={
                  activeFilterTab[tab.name as "logoShirt" | "stylishShirt" | "leftShoulder" | "rightShoulder" | "back"]
                }
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
            <Tab key={DownloadTab.name} tab={DownloadTab} isDownloadTab handleClick={() => downloadCanvasToImage()} />
          </motion.div>

          <motion.div className="absolute top-5 right-5 z-10" {...slideAnimation("right")}>
            <CustomButton
              type="filled"
              title="Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
