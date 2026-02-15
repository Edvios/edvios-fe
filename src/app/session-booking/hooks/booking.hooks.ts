
'use client';

import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '../api/bookings.api';
import { AppToast } from '@/utils/toast-utils';
import { AxiosError } from 'axios';

export const useBooking = () => {
  const [agentURL, setAgentURL] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentURL = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getCalendlyLink();
      setAgentURL(data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message
        || (err instanceof Error ? err.message : 'Failed to load booking link');
      setError(message);
      AppToast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAgentURL();
  }, [fetchAgentURL]);

  useEffect(() => {
    const userSession = sessionStorage.getItem("user-session");
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        if (parsed && typeof parsed === "object") {
          if (parsed.firstName && typeof parsed.firstName === "string") {
            if (parsed.lastName && typeof parsed.lastName === "string") {
              setUserName(`${parsed.firstName} ${parsed.lastName}`);
            } else {
              setUserName(parsed.firstName);
            }
          }
          if (parsed.email && typeof parsed.email === "string") {
            setUserEmail(parsed.email);
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  return {
    agentURL,
    userName,
    userEmail,
    loading,
    error,
  };
};
