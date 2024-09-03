import { create } from "zustand";

const useEmail = create((set) => ({
    emails: [],
    addEmail: (email: string) => {
        set((state: any) => ({
            emails: [...state.emails, email],
        }));
    },
}));

export default useEmail;