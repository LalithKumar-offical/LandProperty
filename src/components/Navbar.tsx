import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../slice/store";

import AdminNavbar from "./AdminNavbar";
import OwnerNavbar from "./OwnerNavbar";
import UserNavbar from "./UserNavbar";
import GuestNavbar from "./GuestNavbar";

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const role = user?.Role || user?.role || "Guest";

  if (!user) return <GuestNavbar />;

  if (role === "Admin") return <AdminNavbar />;
  if (role === "PropertyOwner") return <OwnerNavbar />;
  if (role === "User") return <UserNavbar />;

  return <GuestNavbar />;
};

export default Navbar;
