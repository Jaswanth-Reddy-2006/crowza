import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to get the current venue ID from auth state.
 * Returns the authenticated user's venue ID, or 'venue-1' as fallback.
 * Production: Venue ID is injected from Azure AD custom claims during login.
 */
export const useVenueId = (): string => {
  const user = useAppSelector((state) => state.auth.user);
  return user?.venueId || 'venue-1';
};
