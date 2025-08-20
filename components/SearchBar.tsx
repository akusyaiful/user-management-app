"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearch } from "@/store/userSlice";
import { Search } from "lucide-react";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.users.search);

  return (
    <div className="mb-4">
      <div className="flex items-center bg-white shadow-sm rounded-lg px-3 py-2 w-full max-w-md">
        <Search className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search user..."
          onChange={(e) => dispatch(setSearch(e.target.value))}
          value={search}
          className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;
