"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearch } from "@/store/userSlice";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.users.search);
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(inputValue));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, dispatch]);

  return (
    <div className="flex items-center bg-white border p-2 border border-gray-500 rounded-lg px-3 py-2 w-[100%] md:w-[50%]">
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Search user..."
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
