"use client";

import { useEffect, useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const STORAGE_KEY = "yogsadhak_registration_draft";

function loadDraft(): Record<string, unknown> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

export function usePersistedForm<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  defaultValues?: Record<string, unknown>
) {
  const draft = loadDraft();

  const form = useForm({
    resolver: zodResolver(schema as never) as never,
    defaultValues: (draft || defaultValues || {}) as never,
  });

  const values = form.watch();

  useEffect(() => {
    const vals = form.getValues();
    if (vals && typeof vals === "object") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vals));
      } catch {
      }
    }
  });

  const clearSavedDraft = useCallback(() => clearDraft(), []);

  return { ...form, clearSavedDraft };
}
