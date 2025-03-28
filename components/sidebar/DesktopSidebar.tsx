"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./DesktopItem";
import { UserButton } from "@clerk/clerk-react";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r lg:bg-white lg:pb-4 xl:px-6">
      <nav className="flex h-screen flex-col items-center justify-between py-4">
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
          <span className="absolute top-0 right-0 z-10 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3"></span>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "!h-[48px] !w-[48px] shadow z-0",
              },
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
