import { useAppDispatch } from "@/store/hooks";
import { deleteUser, User } from "@/store/userSlice";
import toast from "react-hot-toast";

const DeleteModal = ({
  user,
  onClose,
}: {
  user?: User | null;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const fullName = `${user?.firstName} ${user?.lastName}`;

  const handleDeleteUser = () => {
    if (!user?.id) return;
    dispatch(deleteUser(user.id));
    toast.success("User deleted successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        <div className="flex flex-col items-center justify-between mb-4 text-center">
          <h2 className="text-xl font-semibold">Delete User</h2>
          <p className="text-gray-500">Are you sure to delete {fullName}?</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600  w-[50%] font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600  w-[50%] font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
