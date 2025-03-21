"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { UserButton } from "@clerk/clerk-react"

const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) {
        return null;
    }

    return (
        <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t bg-white lg:hidden">
            {routes.map((item) => (
                <MobileItem
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={item.active}
                    onClick={item.onClick}
                />
            ))}
            <div className="w-full flex justify-center group hover:bg-gray-100 h-[56px] transition-all relative">
                <UserButton appearance={{
                    elements: {
                        avatarBox: "!h-[36px] !w-[36px] shadow"
                    }
                }} />
            </div>
        </div>
    );
};

export default MobileFooter;
