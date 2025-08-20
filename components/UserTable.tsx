"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUsers,
  loadLocalUsers,
  selectPaginatedUsers,
  User,
} from "@/store/userSlice";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import { Pagination } from "./Pagination";
import SearchBar from "./SearchBar";
import UserForm from "./UserForm";

export default function UserTable() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(selectPaginatedUsers);
  const { loading, error, page, limit, localUsers } = useAppSelector(
    (state) => state.users
  );
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

  useEffect(() => {
    dispatch(loadLocalUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, localCount: localUsers.length }));
  }, [dispatch, page, limit, localUsers]);

  return (
    <div className=" bg-white rounded-xl p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="flex gap-2 flex-col md:flex-row  justify-between mb-4">
        <SearchBar />
        <button
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          className="px-3 py-2 w-[100%] md:w-fit bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-lg font-medium"
        >
          + Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="p-3">
                  <Image
                    src={user.image || "/placeholder-profile.jpg"}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                    width={130}
                    height={130}
                  />
                </td>
                <td className="p-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3 flex gap-2 items-center min-h-[64px]">
                  <button
                    className="flex p-2 px-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg cursor-pointer font-medium"
                    onClick={() => {
                      setEditData(user);
                      setOpenForm(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex p-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer font-medium"
                    onClick={() => {
                      setOpenConfirmDelete(true);
                      setEditData(user);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
      {openForm && (
        <UserForm
          onClose={() => {
            setOpenForm(false);
            setEditData(null);
          }}
          user={editData}
        />
      )}
      {openConfirmDelete && (
        <DeleteModal
          onClose={() => {
            setOpenConfirmDelete(false);
            setEditData(null);
          }}
          user={editData}
        />
      )}
    </div>
  );
}
