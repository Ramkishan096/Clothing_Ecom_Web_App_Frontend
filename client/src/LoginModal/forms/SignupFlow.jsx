import { useState, useEffect } from 'react';
import { OTPInput } from '../LoginModal';

export function SignupFlow({
  styles,
  step,
  loading,
  signupData,
  setSignupData,
  onInit,
  onVerifyOtp,
  onComplete,
  onBackToDefault,
  onBackToOtp,
  onResendOtp,
  resendLoading
}) {
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 'signup-verify-otp') {
      setTimer(60);
      setCanResend(false);
    }
  }, [step]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    await onResendOtp(signupData.mobile);
    setTimer(60);
    setCanResend(false);
  };

  if (step === 'signup-verify-otp') {
    return (
      <form className={styles.form} onSubmit={onVerifyOtp}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mobile Number</label>
          <input
            type="tel"
            required
            className={styles.input}
            maxLength={10}
            disabled
            value={signupData.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setSignupData({ ...signupData, mobile: value });
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Enter OTP</label>
          <OTPInput
            value={signupData.otp}
            onChange={(val) => setSignupData({ ...signupData, otp: val })}
            disabled={loading}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Enter the 4-digit code sent to your mobile
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              style={{
                background: 'none',
                border: 'none',
                color: canResend && !resendLoading ? '#2563eb' : '#9ca3af',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: canResend && !resendLoading ? 'pointer' : 'not-allowed',
                textDecoration: canResend && !resendLoading ? 'underline' : 'none'
              }}
            >
              {resendLoading ? 'Sending...' : canResend ? 'Resend OTP' : `Resend in ${timer}s`}
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBackToDefault}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || signupData.otp.length < 4}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    );
  }

  if (step === 'signup-complete') {
    return (
      <form className={styles.form} onSubmit={onComplete}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Enter first name"
            value={signupData.firstName}
            onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter last name"
            value={signupData.lastName}
            onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Create password (min 6 characters)"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Confirm password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBackToOtp}>
            Back
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={onInit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Mobile Number</label>
        <input
          type="tel"
          required
          className={styles.input}
          placeholder="Enter mobile"
          value={signupData.mobile}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setSignupData({ ...signupData, mobile: value });
          }}
        />
      </div>

      <button 
        type="submit" 
        className={styles.submitButton} 
        disabled={loading || signupData.mobile.length < 10}
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}
