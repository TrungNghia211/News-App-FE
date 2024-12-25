import { Input } from "antd";
import { useState } from "react";
import debounce from "lodash.debounce";

const { Search } = Input;

export default function SearchBar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = debounce((value) => {
    onSearch(value.trim());
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div>
        <Search
        placeholder="Search category"
        value={searchValue}
        onChange={handleSearchChange}
        className="flex items-center w-full max-w-sm space-x-2 dark:bg-gray-900 px-3.5 py-2"
        enterButton={
            <button
            className="bg-[#3498db] hover:bg-[#2980b9] text-white px-4 py-2 rounded flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
              />
            </svg>
          </button>
          
        }
    />
    </div>
  );
}
