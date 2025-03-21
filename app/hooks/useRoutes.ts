import { usePathname } from "next/navigation";
import { useMemo } from "react";

import useConversation from "./useConversation";
import { MessageCircleMore, UsersRound } from "lucide-react";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: MessageCircleMore,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: UsersRound,
        active: pathname === "/users",
      },
    ],
    [pathname, conversationId],
  );

  return routes;
};

export default useRoutes;
