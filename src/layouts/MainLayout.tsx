
import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { AnimatePresence, motion } from "framer-motion";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-onlyl34ks-bg-dark text-onlyl34ks-text-light font-inter">
      <MainNavbar />
      <AnimatePresence mode="wait">
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-20" // Add padding top to account for fixed navbar
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
