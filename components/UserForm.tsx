import { useAppDispatch } from "@/store/hooks";
import { addUser, editUser, User } from "@/store/userSlice";
import axios from "axios";
import React, { useState } from "react";

const UserForm = ({ user, onClose }: { user?: User; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<User>(
    user?.id
      ? user
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        }
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const EMAIL_API_KEY = "d4d836b8e9404bf2b2acd98913747ad1";
  const PHONE_API_KEY = "2412f9cb7f0048a2a6ad7108043876d8";

  const validateData = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (formData.email) {
        const res = await axios.get(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_API_KEY}&email=${formData.email}`
        );
        if (!res.data.is_valid_format.value) {
          setError("Email tidak valid");
          return false;
        }
      }

      if (formData.phone) {
        const res = await axios.get(
          `https://phonevalidation.abstractapi.com/v1/?api_key=${PHONE_API_KEY}&phone=${formData.phone}`
        );
        if (!res.data.valid) {
          setError("Nomor telepon tidak valid");
          return false;
        }
      }
      setSuccess("Valid!");
      return true;
    } catch (err) {
      setError("Gagal memvalidasi data");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = await validateData();
    if (!isValid) {
      setLoading(false);
      return;
    }

    if (user?.id) {
      dispatch(editUser(formData));
    } else {
      dispatch(addUser(formData));
    }

    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    setLoading(false);
    onClose();
  };

  return (
    <form className="p-4 space-y-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="border p-2 w-full rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="border p-2 w-full rounded"
      />

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Validating..." : user?.id ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
