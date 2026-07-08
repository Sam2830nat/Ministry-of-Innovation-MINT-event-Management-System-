"use client";

import { useEffect, useState } from "react";
import { CategoryPicker } from "./CategoryPicker";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useUserPreferences } from "@/features/events/api/useUserPreferences";
import { AnimatePresence } from "framer-motion";

interface OnboardingGateProps {
  children: React.ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { profile, _hasHydrated } = useAuthStore();
  const { data: preferences, isLoading: isLoadingPrefs } = useUserPreferences();
  const [showPicker, setShowPicker] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);

  useEffect(() => {
    // Wait for auth to hydrate before checking anything
    if (!_hasHydrated) return;

    // Only guests get the onboarding flow
    const isGuest = profile !== null && (
      profile.role?.toUpperCase() === "GUEST" || 
      profile.roles?.some(r => r.toUpperCase() === "GUEST") ||
      profile.user_roles?.some((ur: any) => ur.role?.name?.toUpperCase() === "GUEST")
    );
    
    // Explicitly check for an empty array after loading is complete
    // Also check that we haven't skipped it in this session
    const hasNoInterests = !isLoadingPrefs && Array.isArray(preferences) && preferences.length === 0;

    if (isGuest && hasNoInterests && !hasSkipped) {
      setShowPicker(true);
    } else if (!isLoadingPrefs) {
      // Close picker if preferences are loaded and exist, or if not a guest, or if skipped
      setShowPicker(false);
    }
  }, [profile, preferences, isLoadingPrefs, _hasHydrated, hasSkipped]);

  if (!_hasHydrated || isLoadingPrefs) return null;

  // If we should show the picker and haven't skipped/completed yet, block the children
  if (showPicker) {
    return (
      <AnimatePresence>
        <CategoryPicker onComplete={() => {
          setShowPicker(false);
          setHasSkipped(true);
        }} />
      </AnimatePresence>
    );
  }

  return <>{children}</>;
}
