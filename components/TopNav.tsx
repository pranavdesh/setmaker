import React from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { UserButton } from "@clerk/nextjs";

const TopNav = () => {
  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
        <h1 className="text-xl text-green-500">SetMaker</h1>
        <Button size="icon" variant="outline">
          <GaugeIcon className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>
    </div>
  );
};

export default TopNav;

function GaugeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
