import Header from "@/components/Header";
import UserTable from "@/components/UserTable";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <UserTable />
      </div>
    </div>
  );
}
