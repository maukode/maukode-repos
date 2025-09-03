// Base Types - these are just data containers

export type BaseParticipant = {
  readonly id: string;
  readonly name: string;
};

export type BaseMessage = {
  readonly id: string;
  readonly text: string;
  readonly timestamp: number;
  readonly authorId: string; // Corresponds to a BaseParticipant's id
};

export type BaseConversation = {
  readonly id: string;
  readonly participants: readonly BaseParticipant[];
  readonly messages: readonly BaseMessage[];
  // We can add metadata here
  readonly title?: string; 
};

export type BaseChat = {
  readonly currentUser: BaseParticipant;
  readonly conversations: readonly BaseConversation[];
};

// Takes a conversation and a participant, returns a NEW conversation with the added participant
export const addParticipantToConversation = (
  conversation: BaseConversation,
  participant: BaseParticipant
): BaseConversation => {
  // Check to prevent duplicates
  if (conversation.participants.some(p => p.id === participant.id)) {
    return conversation; // Return original object if no change
  }
  
  return {
    ...conversation, // Copy existing properties
    participants: [...conversation.participants, participant], // Create a new participants array
  };
};

// Takes a conversation and a message, returns a NEW conversation with the added message
export const addMessageToConversation = (
  conversation: BaseConversation,
  message: BaseMessage
): BaseConversation => {
  return {
    ...conversation,
    messages: [...conversation.messages, message], // Create a new messages array
  };
};

// Takes a chat and a conversation, returns a NEW chat with the added conversation
export const addConversationToChat = (
  chat: BaseChat,
  conversation: BaseConversation
): BaseChat => {
  return {
    ...chat,
    conversations: [...chat.conversations, conversation],
  };
};

// Takes a chat and an updated conversation, returns a NEW chat state
export const updateConversationInChat = (
  chat: BaseChat,
  updatedConversation: BaseConversation
): BaseChat => {
  return {
    ...chat,
    conversations: chat.conversations.map(conv => 
      conv.id === updatedConversation.id ? updatedConversation : conv
    ),
  };
};

// A utility function from our previous discussion
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) => fns.reduce((acc, fn) => fn(acc), value);

// --- Feature-building Blocks ---

// A simple "factory" function to create a message
const createMessage = (text: string, authorId: string): BaseMessage => ({
  id: `msg_${Math.random()}`,
  text,
  authorId,
  timestamp: Date.now(),
});

// A curried function to make it easy to pipe
// It's "pre-configured" with the conversationId and the message
const addMessageToTargetConversation = (conversationId: string, message: BaseMessage) => 
  (chat: BaseChat): BaseChat => {
    const targetConversation = chat.conversations.find(c => c.id === conversationId);
    if (!targetConversation) return chat; // No change if conversation not found

    const updatedConversation = addMessageToConversation(targetConversation, message);
    return updateConversationInChat(chat, updatedConversation);
};

// --- Putting it all together to create a high-level "feature" ---

// This function represents the entire "send message" feature
const handleSendMessage = (
  initialChatState: BaseChat,
  targetConversationId: string,
  messageText: string,
): BaseChat => {
    
  // 1. Get the author from the current chat state
  const author = initialChatState.currentUser;

  // 2. Create the new message data structure
  const newMessage = createMessage(messageText, author.id);
  
  // 3. Define the transformation for our chat state
  const sendMessageTransformation = pipe(
    addMessageToTargetConversation(targetConversationId, newMessage)
    // We could pipe more operations here!
    // e.g., markAsUnreadForOthers(targetConversationId, author.id)
  );

  // 4. Apply the transformation to the initial state to get the new state
  return sendMessageTransformation(initialChatState);
};


// --- Example Usage ---
let myChat: BaseChat = { /* ... initial chat state with a conversation with id 'conv1' ... */
    currentUser: { id: 'user1', name: 'Alice' },
    conversations: [{ 
        id: 'conv1', 
        participants: [{ id: 'user1', name: 'Alice' }, { id: 'user2', name: 'Bob' }],
        messages: [] 
    }]
};

// The state before the feature is executed
console.log('Before:', myChat.conversations[0].messages);

// Execute the feature to get the new state
const newChatState = handleSendMessage(myChat, 'conv1', 'Hello, Bob!');

// The state after. Note that 'myChat' is UNCHANGED. 'newChatState' is the new version.
console.log('After:', newChatState.conversations[0].messages);

// 1. Define the enhanced type
export type ConversationWithTyping = BaseConversation & {
  readonly typingParticipantIds: readonly string[];
};

// 2. Create a "decorator" or "enhancer" function. This is a Higher-Order Function.
export const withTypingIndicator = (
  conversation: BaseConversation
): ConversationWithTyping => ({
  ...conversation,
  typingParticipantIds: [], // Add the new property
});

// 3. Create pure functions that operate on the NEW type
export const startTyping = (
  conversation: ConversationWithTyping,
  participantId: string
): ConversationWithTyping => {
  if (conversation.typingParticipantIds.includes(participantId)) {
    return conversation;
  }
  return {
    ...conversation,
    typingParticipantIds: [...conversation.typingParticipantIds, participantId],
  };
};

export const stopTyping = (
  conversation: ConversationWithTyping,
  participantId: string
): ConversationWithTyping => {
  return {
    ...conversation,
    typingParticipantIds: conversation.typingParticipantIds.filter(id => id !== participantId),
  };
};

// --- Usage ---

// Let's get a base conversation from our chat
const baseConv = newChatState.conversations[0];

// Enhance it with the new feature
let convWithTyping = withTypingIndicator(baseConv);

// Use the feature-specific functions
convWithTyping = startTyping(convWithTyping, 'user2'); // Bob is typing...
console.log(convWithTyping.typingParticipantIds); // -> ['user2']

convWithTyping = stopTyping(convWithTyping, 'user2'); // Bob stopped typing.
console.log(convWithTyping.typingParticipantIds); // -> []

// You can now use `updateConversationInChat` to put this enhanced conversation back into the main state.
const finalChatState = updateConversationInChat(newChatState, convWithTyping);

console.log(finalChatState)