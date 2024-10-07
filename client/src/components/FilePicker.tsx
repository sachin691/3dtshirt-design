import React from "react";
import { CustomButton } from ".";
import { X } from 'lucide-react';

interface Props {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  readFile: (type: "logo" | "full" | "back") => void;
  onClose: () => void; // New prop to handle closing
}

const FilePicker = ({ file, setFile, readFile, onClose }: Props) => {
  return (
    <div className="absolute p-3 w-[195px] h-[220px] flex flex-col rounded-md ml-3 bg-white">
      <div className="flex-1 flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose} // Call onClose when clicked
        >
          <X size={20} /> {/* Cross icon */}
        </button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">{file === undefined ? "No file selected" : file.name}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton type="filled" title="Chest" handleClick={() => readFile("logo")} customStyles="text-xs" />
        <CustomButton type="filled" title="Full" handleClick={() => readFile("full")} customStyles="text-xs" />
        <CustomButton type="filled" title="Back" handleClick={() => readFile("back")} customStyles="text-xs" />
      </div>
    </div>
  );
};

export default FilePicker;
