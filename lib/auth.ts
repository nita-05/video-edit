export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  loginTime: string;
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('vedit_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const setCurrentUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('vedit_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

export const clearUser = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('vedit_user');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
