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
        label: "Conversations",
        href: "/conversation",
        icon: MessageCircleMore,
        active: pathname === "/conversation" || !!conversationId,
      }
    ],
    [pathname, conversationId],
  );

  return routes;
};

export default useRoutes;
