import { create } from "zustand";

export interface AIMessage {
  sender: "ai" | "user";
  text: string;
}

export interface AIChat {
  id: number;
  title: string;
  messages: AIMessage[];
}

interface AIProjectState {
  chats: AIChat[];
  selectedChatId: number;
  selectChat: (id: number) => void;
  addChat: (title: string) => void;
  addMessage: (chatId: number, message: AIMessage) => void;
}

const initialChats: AIChat[] = [
  {
    id: 1,
    title: "E-commerce Website",
    messages: [
      {
        sender: "ai",
        text: "Hi! What kind of project would you like to create today?",
      },
      { sender: "user", text: "I want to build a blog platform." },
      {
        sender: "ai",
        text: "Great! What features do you want in your blog platform?",
      },
    ],
  },
  { id: 2, title: "Portfolio App", messages: [] },
  { id: 3, title: "Task Manager", messages: [] },
];

export const useAIProjectStore = create<AIProjectState>((set) => ({
  chats: initialChats,
  selectedChatId: 1,
  selectChat: (id) => set({ selectedChatId: id }),
  addChat: (title) =>
    set((state) => {
      const newId =
        state.chats.length > 0
          ? Math.max(...state.chats.map((c) => c.id)) + 1
          : 1;
      return {
        chats: [...state.chats, { id: newId, title, messages: [] }],
        selectedChatId: newId,
      };
    }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),
}));
