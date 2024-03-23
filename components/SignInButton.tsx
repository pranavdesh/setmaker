"use client";
import React from "react";
import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <div>
      <button
        onClick={() => {
          signIn("spotify", { callbackUrl: "/tracks" });
        }}
        className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Sign in with Spotify
      </button>
    </div>
  );
};

export default SignInButton;
