'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { User, Business, UserContextData } from '@/types/user';
import { useApiCall } from '@/hooks/useApiCall';
import { logger } from '@/utils/logger';

const UserContext = createContext<UserContextData | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userApiCall = useApiCall<User>();
  const businessApiCall = useApiCall<Business>();

  const clearData = useCallback(() => {
    setUser(null);
    setBusiness(null);
    setError(null);
    setLoading(false);
    userApiCall.reset();
    businessApiCall.reset();
  }, [userApiCall, businessApiCall]);

  const refreshUser = useCallback(async () => {
    try {
      const result = await userApiCall.call('/user');

      if (result.success && result.data) {
        setUser(result.data);
        setError(null);
        logger.info('User data fetched successfully', undefined, {
          userId: result.data.id,
        });
      } else if (result.error?.statusCode === 404) {
        // User doesn't exist yet - this is normal for new accounts
        setUser(null);
        logger.info('User profile not found - likely new account');
      } else {
        const errorMessage =
          result.error?.message || 'Failed to fetch user data';
        setError(errorMessage);
        logger.error('Failed to fetch user data', JSON.stringify(result.error));
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch user data';
      setError(errorMessage);
      logger.error(
        'User data fetch error',
        JSON.stringify({
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        }),
      );
    }
  }, [userApiCall]);

  const refreshBusiness = useCallback(async () => {
    try {
      const result = await businessApiCall.call('/business');

      if (result.success && result.data) {
        setBusiness(result.data);
        setError(null);
        logger.info('Business data fetched successfully', undefined, {
          businessId: result.data.id,
        });
      } else if (result.error?.statusCode === 404) {
        // Business doesn't exist - this is normal
        setBusiness(null);
        logger.info('No business found for user');
      } else {
        const errorMessage =
          result.error?.message || 'Failed to fetch business data';
        setError(errorMessage);
        logger.error(
          'Failed to fetch business data',
          JSON.stringify(result.error),
        );
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch business data';
      setError(errorMessage);
      logger.error(
        'Business data fetch error',
        JSON.stringify({
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        }),
      );
    }
  }, [businessApiCall]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both user and business data in parallel
      await Promise.all([refreshUser(), refreshBusiness()]);
    } catch (err) {
      const errorMessage = 'Failed to load user data';
      setError(errorMessage);
      logger.error(
        'Context data fetch error',
        JSON.stringify({
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [refreshUser, refreshBusiness]);

  // Initial data fetch on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const contextValue: UserContextData = {
    user,
    business,
    loading,
    error,
    refreshUser,
    refreshBusiness,
    refreshAll,
    clearData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
}
