import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

export const useAuthForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { error: authError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
      case 'identifier':
        return validateEmail(value) ? '' : 'Invalid email address';
      case 'password':
        return validatePassword(value) ? '' : 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Passwords do not match';
      case 'firstName':
      case 'lastName':
        return validateName(value) ? '' : 'Name must be at least 2 characters';
      default:
        return '';
    }
  };

  const validateForm = (fields) => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    authError,
    handleChange,
    validateForm
  };
};