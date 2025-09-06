'use client';

import { useUserContext } from '@/contexts/UserContext';

export function useUser() {
  const { user, loading, error, refreshUser, clearData } = useUserContext();

  return {
    user,
    loading,
    error,
    refreshUser,
    clearData,
    isAuthenticated: !!user,
    hasProfile: !!user,
    fullName: user ? `${user.firstName} ${user.lastName}` : null,
    displayName: user ? user.firstName : null,
  };
}

export function useBusiness() {
  const { business, loading, error, refreshBusiness, clearData } =
    useUserContext();

  return {
    business,
    loading,
    error,
    refreshBusiness,
    clearData,
    hasBusiness: !!business,
    isVerified: business?.isVerified || false,
    subscriptionStatus: business?.subscriptionStatus || 'trial',
    businessName: business?.businessName || null,
  };
}

export function useUserData() {
  const context = useUserContext();

  return {
    ...context,
    isAuthenticated: !!context.user,
    hasProfile: !!context.user,
    hasBusiness: !!context.business,
    fullName: context.user
      ? `${context.user.firstName} ${context.user.lastName}`
      : null,
    needsOnboarding: !context.user || !context.business,
  };
}
