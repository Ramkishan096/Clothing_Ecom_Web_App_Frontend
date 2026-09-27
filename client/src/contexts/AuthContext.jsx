// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  clearCustomer,
  setCustomer as setReduxCustomer,
  setLoading as setReduxLoading,
  setError as setReduxError,
  clearError as clearReduxError,
  selectCustomer,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../redux/slices/authSlice';

const AuthContext = createContext(null);

export const useAuth = () => {
  console.log("use Auth fucntion call.....")
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  
  const customer = useAppSelector(selectCustomer);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [initialized, setInitialized] = useState(false);

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong'
    );
  };

  // ==================== ADMIN METHODS ====================
  
  const adminCheck = async (mobile) => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());
      
      const response = await authApi.adminCheck(mobile);
      return response;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      dispatch(setReduxError(errorMsg));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const adminLogin = async (mobile, otp) => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());
      
      const response = await authApi.adminLogin(mobile, otp);
      
      if (response?.data) {
        const adminData = {
          ...response.data,
          isAdmin: true
        };
        dispatch(setReduxCustomer(adminData));
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      return response;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      dispatch(setReduxError(errorMsg));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  // ==================== OTHER METHODS ====================

  const checkAuth = async () => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());

      const response = await authApi.getProfile();
      const profile = response?.data ?? response;

      if (profile) {
        dispatch(setReduxCustomer(profile));
      } else {
        dispatch(clearCustomer());
      }
      
      return profile;
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch(clearCustomer());
      dispatch(setReduxError(getErrorMessage(error)));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        dispatch(setReduxLoading(true));
        dispatch(clearReduxError());

        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            if (userData.isAdmin) {
              localStorage.setItem('isAdmin', 'true');
            }
            dispatch(setReduxCustomer(userData));
          } catch (error) {
            console.log("error:",error)
          }
        }

        const response = await authApi.getProfile();
        const profile = response?.data ?? response;

        if (!isMounted) return;

        if (profile) {
          dispatch(setReduxCustomer(profile));
        } else {
          dispatch(clearCustomer());
        }
      } catch (authError) {
        if (!isMounted) return;
        console.error('Auth initialization failed:', authError);
        dispatch(clearCustomer());
        dispatch(setReduxError(getErrorMessage(authError)));
      } finally {
        if (isMounted) {
          dispatch(setReduxLoading(false));
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // ==================== EXISTING METHODS ====================

  const requestLoginOTP = async (mobile) => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());
      const response = await authApi.requestLoginOtp(mobile);
      return response;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      dispatch(setReduxError(errorMsg));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const verifyLoginOTP = async (mobile, otp) => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());
      const response = await authApi.verifyLoginOtp(mobile, otp);
      if (response?.data) {
        dispatch(setReduxCustomer(response.data));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      dispatch(setReduxError(errorMsg));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const logout = async () => {
    try {
      dispatch(setReduxLoading(true));
      dispatch(clearReduxError());

      await authApi.logout();
      dispatch(clearCustomer());
      
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      dispatch(setReduxError(errorMsg));
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const value = {
    customer,
    isAuthenticated,
    loading,
    error,
    initialized,
    
    // Admin methods
    adminCheck,
    adminLogin,
    
    // Existing methods
    requestLoginOTP,
    verifyLoginOTP,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};