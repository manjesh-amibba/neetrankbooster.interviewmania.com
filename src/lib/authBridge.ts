
declare global {
  interface Window {
    Android?: {
      googleLogin: () => void;
      logout: () => void;
    };
  }
}

export const startGoogleLogin = async () => {
  if (window.Android && typeof window.Android.googleLogin === 'function') {
    window.Android.googleLogin();
  } else {
    try {
      const response = await fetch('https://api-neetrankbooster.interviewmania.com/auth/test-login', {
        credentials: 'include',
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
};

export const performLogout = async () => {
  if (window.Android && typeof window.Android.logout === 'function') {
    window.Android.logout();
  } else {
    try {
      await fetch('https://api-neetrankbooster.interviewmania.com/auth/logout', {
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback redirect even if API fails
      window.location.href = '/';
    }
  }
};
