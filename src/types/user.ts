export interface User {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  pictureUrl?: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  businessId: string;
  description?: string;
  uniqueUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  longitude?: number;
  latitude?: number;
  locationName?: string;
  timezone: string;
  operatingHours?: OperatingHours[];
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  days: string; // e.g., 'Monday', 'Monday-Friday', 'Saturday-Sunday'
  openTime: string; // e.g., '09:00'
  closeTime: string; // e.g., '17:00'
}

export interface Business {
  id: string;
  authId: string;
  businessName: string;
  businessType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean;
  subscriptionStatus: string;
  profile?: BusinessProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserContextData {
  user: User | null;
  business: Business | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearData: () => void;
}
