import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-100 dark:bg-gray-900 py-4 px-3">
      <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} | Designed & Developed by{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200 hover:text-violet-500 transition-colors">
          Ajit Singh
        </span>
      </p>
    </footer>
  );
};

export default Footer;
