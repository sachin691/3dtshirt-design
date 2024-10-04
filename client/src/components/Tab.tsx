import { TabType } from "../config/constants";
import { useSnapshot } from "valtio";

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

const Tab = ({
  tab,
  handleClick,
  isFilterTab,
  isActiveTab,
  isDownloadTab,
  ButtonName
}: TabProps) => {
  const snap = useSnapshot(state);

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  return (
    <>
      {ButtonName ? (
        <div onClick={handleClick}>
          <CustomButton type="filled" title={ButtonName} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
        </div>
      ) : (
        <div
          key={tab.name}
          className={`tab-btn ${isFilterTab || isDownloadTab ? "rounded-full glassmorphism" : "rounded-4"}`}
          onClick={handleClick}
          style={!isDownloadTab ? activeStyles : { backgroundColor: "transparent", opacity: 1 }}
        >
          <img
            src={tab.icon}
            alt={tab.name}
            className={`${isFilterTab || isDownloadTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12"} ${"object-contain"}`}
          />
        </div>
      )}
    </>
  );
};

export default Tab;
