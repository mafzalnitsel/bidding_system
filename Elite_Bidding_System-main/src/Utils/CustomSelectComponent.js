import { useState } from "react";

const CustomSelect = ({ options, onChange, placeholder = "Select..." }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelected(option);
    setSearch(option.label);
    setIsOpen(false);
    onChange && onChange(option);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  return (
    <div className="relative w-64" tabIndex={0} onKeyDown={handleKeyDown}>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`p-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

// Example Usage
const options = [
  { value: "apple", label: "Apple 🍏" },
  { value: "banana", label: "Banana 🍌" },
  { value: "cherry", label: "Cherry 🍒" },
];

export default function App() {
  return (
    <div className="p-4">
      <CustomSelect
        options={options}
        onChange={(selected) => console.log("Selected:", selected)}
      />
    </div>
  );
}
