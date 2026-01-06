import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const useUserRole = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.user) return null; // No user is logged in

  const role = String((auth.user as any)?.role || '').toLowerCase();
  return (auth.user as any)?.isSeller === true || role === 'freelancer' || role === 'seller';
};
