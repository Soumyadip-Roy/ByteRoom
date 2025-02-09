import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [],
  users: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setUsers: (users) => set({ users }),
  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;
