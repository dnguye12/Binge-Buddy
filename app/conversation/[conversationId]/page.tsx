import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/components/EmptyState";
import ConversationHeader from "./components/ConversationHeader";
import ConversationBody from "./components/ConversationBody";
import ConversationForm from "./components/ConversationForm";

interface ConversationIdPageProps {
    params: Promise<{
        conversationId: string;
    }>;
}

const ConversationIdPage = async ({ params }: ConversationIdPageProps) => {
    const { conversationId } = await params;
    const conversation = await getConversationById(conversationId);
    const messages = await getMessages(conversationId);

    if (!conversation) {
        return (
            <div className="h-full lg:pl-80">
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="h-full lg:pl-80">
            <div className="flex h-full min-h-screen flex-col">
                <ConversationHeader conversation={conversation} />
                <ConversationBody initialMessages={messages} />
                <ConversationForm />
            </div>
        </div>
    );
};

export default ConversationIdPage;
