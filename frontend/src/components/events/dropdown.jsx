import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-40 px-4 py-2 bg-white border rounded-xl shadow-sm hover:shadow-md focus:outline-none"
      >
        <span>{selected}</span>
        <FaChevronDown
          className={`ml-2 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border z-10">
          <ul className="flex flex-col">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-600"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
