"use client";

import {useEffect } from 'react';
// import { useApi } from '@/hooks/use-api'; // Not used in this component
import { showToast } from '@/lib/toast';
import styles from './login.module.css';
import PublicRoute from '@/components/public-route';
import { LoginLayout } from './login-layout';
import { GoogleLogin } from '@/components/google-login';

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginLayout>
        <LoginContent />
      </LoginLayout>
    </PublicRoute>
  );
}

function LoginContent() {

  // Check for OAuth callback errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error) {
      let errorMsg = 'Authentication failed. Please try again.';

      if (error === 'google_auth_failed') {
        errorMsg = 'Google sign-in failed. Please try again or use OTP login.';
      }

      showToast(errorMsg, 'error');

      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);
  return (
    <>
      <div className={styles.loginHeader}>
        <h2>Welcome Back</h2>
        <p>Sign in to access your MedAI Content dashboard</p>
      </div>

      <GoogleLogin
        onSuccess={() => {
          // Optional: additional success handling
        }}
        onError={(errorMsg) => {
          // Optional: additional error handling using errorMsg
          console.error('Google login error:', errorMsg);
        }}
      />

      <div className={styles.poweredBy}>
        Powered by <a href="https://medvarsity.com" target="_blank">Medvarsity</a>
      </div>
    </>
  );
}