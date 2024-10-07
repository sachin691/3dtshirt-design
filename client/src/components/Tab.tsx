import { useState } from "react";
import { useSnapshot } from "valtio";
import { TabType } from "../config/constants";
import state from "../store";
import CustomButton from "./CustomButton";

interface TabProps {
  tab: TabType;
  isFilterTab?: boolean;
  isActiveTab?: boolean;
  isDownloadTab?: boolean;
  ButtonName?: string;
  handleClick: () => void;
}

const Tab = ({ tab, handleClick, isFilterTab, isActiveTab, isDownloadTab, ButtonName }: TabProps) => {
  const snap = useSnapshot(state);
  const [isFilePickerVisible, setFilePickerVisible] = useState(false); // State for visibility of FilePicker

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  const toggleFilePicker = () => {
    handleClick() 
    setFilePickerVisible(true);
    console.log(isFilePickerVisible)
  };

  return (
    <div>
      {ButtonName ? (
        <div onClick={toggleFilePicker}>
          <CustomButton type="filled" title={ButtonName} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
        </div>
      ) : (
        <div
          key={tab.name}
          className={`tab-btn ${isFilterTab || isDownloadTab ? "rounded-full glassmorphism" : "rounded-4"}`}
          onClick={toggleFilePicker} // Open FilePicker on click
          style={!isDownloadTab ? activeStyles : { backgroundColor: "transparent", opacity: 1 }}
        >
          <img
            src={tab.icon}
            alt={tab.name}
            className={`${isFilterTab || isDownloadTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12"} ${"object-contain"}`}
          />
        </div>
      )}

      {/* Render FilePicker if visible */}
      {/* {isFilePickerVisible && (
        <FilePicker
          file={file}
          setFile={setFile}
          readFile={(type) => console.log(`Reading file of type: ${type}`)} // Example readFile function
          onClose={closeFilePicker} // Pass close handler
        />
      )} */}
    </div>
  );
};

export default Tab;
