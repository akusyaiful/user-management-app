"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteUser,
  fetchUsers,
  loadLocalUsers,
  selectPaginatedUsers,
  User,
} from "@/store/userSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";
import UserForm from "./UserForm";

export default function UserTable() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(selectPaginatedUsers);
  const { loading, error, page, limit, localUsers } = useAppSelector(
    (state) => state.users
  );
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<User>(Object);

  useEffect(() => {
    dispatch(loadLocalUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, localCount: localUsers.length }));
  }, [dispatch, page, limit, localUsers]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <button
        onClick={() => {
          setEditData(Object);
          setOpenForm(true);
        }}
        className="px-3 py-2 bg-blue-600 text-white rounded"
      >
        + Add User
      </button>
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
              <td className="p-3 flex gap-2 items-center h-full">
                <button
                  className="px-2 py-1 bg-yellow-400 rounded"
                  onClick={() => {
                    setEditData(user);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => dispatch(deleteUser(String(user.id)))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
      {openForm && (
        <UserForm onClose={() => setOpenForm(false)} user={editData} />
      )}
    </div>
  );
}
