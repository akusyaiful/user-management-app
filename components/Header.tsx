import { CircleUser } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center gap-4 w-full py-6 px-8 shadow-md bg-white">
      <CircleUser className="w-8 h-8" />
      <p className="font-bold">User Management App</p>
    </div>
  );
};

export default Header;
