import type { BaseChat, BaseConversation, BaseParticipant } from "../types";

export const createBaseChat = (_currentUser: BaseParticipant): BaseChat => {
    const conversations: BaseConversation[] = []
    let currentConversation: BaseConversation | null = null
    
    const startConversation = (conversation: BaseConversation) => {
        conversations.push(conversation)
    }

    const currentUser = _currentUser

    const changeConversation = (conversationId: string) => {
        const selectedConversation = conversations.find(conversation => conversation.id === conversationId)
        if (selectedConversation) currentConversation = selectedConversation
    }

    return {
        conversations,
        currentConversation,
        currentUser,
        startConversation,
        changeConversation
    }
}