"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loginUser, registerUser, type LoginRequest, type RegisterRequest } from "./api";
import { getAuthSnapshot, getServerAuthSnapshot, setAuthSnapshot, subscribeAuth } from "./auth-store";

function noopSubscribe() {
  return () => {};
}

/** Auth state backed by localStorage. Hydration-safe: server/first paint always see "logged out". */
export function useAuth() {
  const auth = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const isReady = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await loginUser(data);
    setAuthSnapshot({ token: res.token, user: res.user });
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await registerUser(data);
    setAuthSnapshot({ token: res.token, user: res.user });
  }, []);

  const logout = useCallback(() => setAuthSnapshot(null), []);

  return { token: auth?.token ?? null, user: auth?.user ?? null, isReady, login, register, logout };
}
