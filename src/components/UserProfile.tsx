'use client';

import { useUser, useBusiness } from '@/hooks/useUser';
import { useApiCall } from '@/hooks/useApiCall';

export default function UserProfile() {
  const {
    user,
    loading: userLoading,
    hasProfile,
    fullName,
    refreshUser,
  } = useUser();

  const { business, hasBusiness, businessName, isVerified, refreshBusiness } =
    useBusiness();

  const createUserApi = useApiCall();

  const handleCreateProfile = async () => {
    const formData = new FormData();
    formData.append('firstName', 'John');
    formData.append('lastName', 'Doe');
    formData.append('phone', '+1234567890');

    const result = await createUserApi.call('/user/create', {
      method: 'POST',
      body: formData,
    });

    if (result.success) {
      // Refresh user data after creation
      await refreshUser();
    }
  };

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {hasProfile ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <p>Name: {fullName}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone || 'Not provided'}</p>
            <p>Language: {user?.preferredLanguage}</p>
          </div>

          {hasBusiness ? (
            <div>
              <h3 className="text-lg font-semibold">Business Information</h3>
              <p>Business: {businessName}</p>
              <p>Type: {business?.businessType}</p>
              <p>Contact: {business?.contactName}</p>
              <p>Status: {isVerified ? 'Verified' : 'Pending'}</p>
            </div>
          ) : (
            <div>
              <p>No business profile found.</p>
              <button
                onClick={() => (window.location.href = '/business/create')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create Business Profile
              </button>
            </div>
          )}

          <button
            onClick={refreshUser}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Refresh Profile
          </button>
        </div>
      ) : (
        <div>
          <p>No user profile found. Please complete your profile setup.</p>
          <button
            onClick={handleCreateProfile}
            disabled={createUserApi.loading}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {createUserApi.loading ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      )}
    </div>
  );
}
