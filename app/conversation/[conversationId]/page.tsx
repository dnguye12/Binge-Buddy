import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/components/EmptyState";

interface ConversationIdPageProps {
    params: Promise<{
        conversationId: string
    }>
}

const ConversationIdPage = async ({ params }: ConversationIdPageProps) => {
    const { conversationId } = await params
    const conversation = await getConversationById(conversationId)
    const messages = await getMessages(conversationId)

    console.log(conversation)
    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <EmptyState />
            </div>
        )
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
            </div>
        </div>
    );
}

export default ConversationIdPage;