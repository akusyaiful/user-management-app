import { useAppDispatch } from "@/store/hooks";
import { addUser, editUser, User } from "@/store/userSlice";
import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserForm = ({
  user,
  onClose,
}: {
  user?: User | null;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const EMAIL_API_KEY = "d4d836b8e9404bf2b2acd98913747ad1";
  const PHONE_API_KEY = "2412f9cb7f0048a2a6ad7108043876d8";

  useEffect(() => {
    if (user?.id) {
      setFormData(user);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    }
  }, [user]);

  const validateData = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (formData.email) {
        const res = await axios.get(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_API_KEY}&email=${formData.email}`
        );
        if (!res.data.is_valid_format.value) {
          setError("Email is invalid");
          return false;
        }
      }

      if (formData.phone) {
        const res = await axios.get(
          `https://phonevalidation.abstractapi.com/v1/?api_key=${PHONE_API_KEY}&phone=${formData.phone}`
        );
        if (!res.data.valid) {
          setError("Phone number is invalid");
          return false;
        }
      }
      setSuccess("Valid!");
      return true;
    } catch (err) {
      setError("Failed to validating the data");
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
      toast.success("Success Update User");
    } else {
      dispatch(addUser(formData));
      toast.success("Success Add User");
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {user?.id ? "Edit User" : "Add User"}
          </h2>
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="hover:text-gray-700 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="font-medium mb-1">First Name</label>
          <input
            type="text"
            placeholder="Input first name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="border p-2 w-full rounded-lg border border-gray-500"
          />

          <label className="font-medium mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Input last name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="border p-2 w-full rounded-lg border border-gray-500"
          />

          <label className="font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Input email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border p-2 w-full rounded-lg border border-gray-500"
          />

          <label className="font-medium mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="62xxx"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border p-2 w-full rounded-lg border border-gray-500"
          />

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full font-medium"
          >
            {loading ? "Validating..." : user?.id ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
