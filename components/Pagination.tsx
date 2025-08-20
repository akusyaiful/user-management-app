import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPaginatedUsers, setPage } from "@/store/userSlice";
import React from "react";

export const Pagination = () => {
  const dispatch = useAppDispatch();
  const { page } = useAppSelector((state) => state.users);
  const { totalPages } = useAppSelector(selectPaginatedUsers);

  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <button
        onClick={() => dispatch(setPage(page - 1))}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg transition ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Prev
      </button>

      <span className="text-gray-700 font-medium">
        Page <span className="font-bold">{page}</span> of {totalPages}
      </span>

      <button
        onClick={() => dispatch(setPage(page + 1))}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-lg transition ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Next
      </button>
    </div>
  );
};
