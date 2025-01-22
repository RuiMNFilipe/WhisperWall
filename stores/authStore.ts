"use client";

import { Role } from "@prisma/client";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  login: (role) =>
    set({
      isAuthenticated: true,
      role,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      role: null,
    }),
}));

export default useAuthStore;
