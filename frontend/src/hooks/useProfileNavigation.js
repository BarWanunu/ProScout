import { useState, useCallback } from "react";

export default function useProfileNavigation() {
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);

  // Navigate to a profile
  const navigateToProfile = useCallback(
    (profileType, profileId) => {
      // Add current profile to navigation stack if exists
      if (currentProfile) {
        setNavigationStack((prev) => [...prev, currentProfile]);
      }

      // Set new current profile
      setCurrentProfile({ type: profileType, id: profileId });
    },
    [currentProfile]
  );

  // Go back to previous profile or close profile view
  const goBack = useCallback(() => {
    if (navigationStack.length > 0) {
      // Go back to previous profile in stack
      const previousProfile = navigationStack[navigationStack.length - 1];
      setNavigationStack((prev) => prev.slice(0, -1));
      setCurrentProfile(previousProfile);
    } else {
      // Close profile view
      setCurrentProfile(null);
    }
  }, [navigationStack]);

  // Clear navigation and close profile view
  const closeProfile = useCallback(() => {
    setNavigationStack([]);
    setCurrentProfile(null);
  }, []);

  return {
    currentProfile,
    navigationStack,
    navigateToProfile,
    goBack,
    closeProfile,
    isProfileOpen: !!currentProfile,
  };
}
