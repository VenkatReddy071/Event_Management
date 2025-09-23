import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Home/Fottor";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
