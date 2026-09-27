import { useState, useEffect } from 'react';
import { OTPInput } from '../LoginModal';

export function ResetFlow({
  styles,
  step,
  loading,
  resetData,
  setResetData,
  onInit,
  onComplete,
  onBack,
  onResendOtp,
  resendLoading
}) {
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 'forgot-reset') {
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
    await onResendOtp(resetData.mobile);
    setTimer(60);
    setCanResend(false);
  };

  if (step === 'forgot-reset') {
    return (
      <form className={styles.form} onSubmit={onComplete}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mobile Number</label>
          <input
            type="tel"
            required
            className={styles.input}
            value={resetData.mobile}
            disabled
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setResetData({ ...resetData, mobile: value });
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Enter OTP</label>
          <OTPInput
            value={resetData.otp}
            onChange={(val) => setResetData({ ...resetData, otp: val })}
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

        <div className={styles.formGroup}>
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Enter new password"
            value={resetData.newPassword}
            onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Confirm new password"
            value={resetData.confirmPassword}
            onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBack}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || resetData.otp.length < 4}
          >
            {loading ? 'Updating...' : 'Reset Password'}
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
          value={resetData.mobile}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setResetData({ ...resetData, mobile: value });
          }}
        />
      </div>

      <button 
        type="submit" 
        className={styles.submitButton} 
        disabled={loading || resetData.mobile.length < 10}
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}