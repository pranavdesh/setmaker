"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignOutButton = () => {
  return (
    <div>
      {/* <button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
        className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Sign Out
      </button> */}

      <Button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
        size="default"
        variant="green"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutButton;
