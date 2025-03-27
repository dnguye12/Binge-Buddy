import Sidebar from "@/components/sidebar/Sidebar";
import getCurrentUserConversations from "../actions/getCurrentUserConversations";
import ConversationList from "./components/ConversationList";

const ConversationLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUserConversations = await getCurrentUserConversations()

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList conversations={currentUserConversations} />
        {children}</div>
    </Sidebar>
  );
};

export default ConversationLayout;
