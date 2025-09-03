export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'
export type MessageStatus = 'sent' | 'read' | 'sending' | 'deliver' | 'failed'
export type ParticipantStatus = 'online' | 'offline'

/** general input state */
export interface InputState {
    value: string
    isDisabled: boolean
    isTyping: boolean
}

/** tracking if other participant is typing */
export type TypingTracking = string[]

export interface ParticipantStatusFeature {
    status: ParticipantStatus
}

export interface AvatarFeature {
    avatarUrl: string
}

export interface TimestampFeature {
    timestamp: number
}


export interface Attachment {
    id: string
    filename: string
    mimeType: string
    url: string
}

export interface AttachmentFeature {
    attachments: Attachment[]
}

/** interface for shared id property */
export interface Base {
    id: string
}

/** at least, participant should have id and name */
export interface BaseParticipant extends Base {
    name: string
}

/** at least, message should have id, authorId and text */
export interface BaseMessage extends Base {
    authorId: string
    text: string
    status: MessageStatus
    error: Error | null
}

export interface BaseConversation extends Base {
    participants: BaseParticipant[]
    messages: BaseMessage[]
    /** controlling input message field */
    inputState: InputState
    /** track if any participants typing */
    typingTracking: TypingTracking
    sendMessage: (message: BaseMessage, onSend: () => Promise<void>) => void
    addParticipant: (participant: BaseParticipant) => void
}

export interface BaseChat {
    /** main conversations */
    conversations: BaseConversation[]
    /** currently focus conversation */
    currentConversation: BaseConversation | null
    /** current user */
    currentUser: BaseParticipant
    /** function to start new conversation */
    startConversation: (conversation: BaseConversation) => void
    /** change focused conversation */
    changeConversation: (conversationId: string) => void
}