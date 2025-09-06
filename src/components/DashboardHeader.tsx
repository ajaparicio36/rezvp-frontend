'use client';

import { useUserData } from '@/hooks/useUser';
import { clearUserSession } from '@/utils/auth';

export default function DashboardHeader() {
  const {
    user,
    business,
    loading,
    error,
    fullName,
    hasBusiness,
    needsOnboarding,
    clearData,
  } = useUserData();

  const handleSignOut = async () => {
    clearData(); // Clear context data
    await clearUserSession(); // Clear cookies and redirect
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <p className="text-red-600">Error loading profile: {error}</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome{fullName ? `, ${fullName}` : ''}!
            </h1>
            {needsOnboarding && (
              <p className="text-yellow-600 text-sm mt-1">
                Please complete your profile setup
              </p>
            )}
            {hasBusiness && (
              <p className="text-gray-600 text-sm mt-1">
                Managing: {business?.businessName}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user?.pictureUrl && (
              <img
                src={user.pictureUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}

            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
