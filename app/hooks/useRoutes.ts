import { usePathname } from "next/navigation";
import { useMemo } from "react";

import useConversation from "./useConversation";
import { MessageCircleMore } from "lucide-react";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chat",
        icon: MessageCircleMore,
        active: pathname === "/chat" || !!conversationId,
      }
    ],
    [pathname, conversationId],
  );

  return routes;
};

export default useRoutes;
