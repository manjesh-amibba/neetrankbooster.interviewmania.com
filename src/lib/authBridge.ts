
declare global {
  interface Window {
    Android?: {
      startGoogleLogin: () => void;
      performLogout: () => void;
    };
  }
}

export const startGoogleLogin = () => {
  if (window.Android && typeof window.Android.startGoogleLogin === 'function') {
    window.Android.startGoogleLogin();
  } else {
    // For non-Android users, use JavaScript-based redirect to Google login
    window.location.href = 'https://api-neetrankbooster.interviewmania.com/auth/google';
  }
};

export const performLogout = () => {
  if (window.Android && typeof window.Android.performLogout === 'function') {
    window.Android.performLogout();
  } else {
    console.log('Android bridge not found.');
  }
};
