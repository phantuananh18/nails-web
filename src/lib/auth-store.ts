"use client";

import type { UserDto } from "./api";

const STORAGE_KEY = "2incorner.auth";

export interface StoredAuth {
  token: string;
  user: UserDto;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function readFromStorage(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Read once at module load (client only) so useSyncExternalStore has a snapshot from the first client render.
let snapshot: StoredAuth | null = readFromStorage();

export function getAuthSnapshot() {
  return snapshot;
}

export function getServerAuthSnapshot(): StoredAuth | null {
  return null;
}

export function subscribeAuth(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAuthSnapshot(value: StoredAuth | null) {
  snapshot = value;
  if (typeof window !== "undefined") {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((listener) => listener());
}
