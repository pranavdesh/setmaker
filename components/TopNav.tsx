import React from "react";
import SignOutButton from "./SignOutButton";

const TopNav = () => {
  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl text-green-500 pl-8">SetMaker</h1>
        <div className="pr-3">
          <SignOutButton />
        </div>
      </header>
    </div>
  );
};

export default TopNav;
