"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./DesktopItem";
import { UserButton } from "@clerk/clerk-react"

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r lg:bg-white lg:pb-4 xl:px-6">
      <nav className="py-4 flex flex-col justify-between items-center h-screen">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>
        <div className="relative">
          <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3 z-10"></span>
          <UserButton appearance={{
            elements: {
              avatarBox: "!h-[48px] !w-[48px] shadow z-0"
            }
          }} />
        </div>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
