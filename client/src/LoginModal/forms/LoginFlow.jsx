import { useState, useEffect } from 'react';
import { OTPInput } from '../LoginModal';

export function LoginFlow({
  styles,
  step,
  loading,
  loginMethod,
  loginData,
  setLoginData,
  onMethodChange,
  onSubmitLogin,
  onVerifyOtp,
  onBack,
  onForgotPassword,
  onResendOtp,
  resendLoading
}) {
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 'login-otp') {
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
    await onResendOtp(loginData.mobile);
    setTimer(60);
    setCanResend(false);
  };

  if (step === "login-otp") {
    return (
      <form className={styles.form} onSubmit={onVerifyOtp}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mobile Number</label>
          <input
            type="tel"
            required
            className={styles.input}
            placeholder="Enter mobile"
            maxLength={10}
            value={loginData.mobile}
            disabled
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setLoginData({ ...loginData, mobile: value });
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Enter OTP</label>
          <OTPInput
            value={loginData.otp}
            onChange={(val) => setLoginData({ ...loginData, otp: val })}
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
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || loginData.otp.length < 4}
          >
            {loading ? "Verifying..." : "Verify OTP & Login"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmitLogin}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Mobile Number</label>
        <input
          type="tel"
          required
          className={styles.input}
          placeholder="Enter mobile"
          maxLength={10}
          value={loginData.mobile}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setLoginData({ ...loginData, mobile: value });
          }}
        />
      </div>

      {loginMethod === "password" && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Enter password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
        </div>
      )}

      <button 
        type="submit" 
        className={styles.submitButton} 
        disabled={loading || loginData.mobile.length < 10}
      >
        {loading
          ? "Please wait..."
          : loginMethod === "password"
            ? "Sign In"
            : "Send OTP"}
      </button>

      <div>
        <div className={styles.switchLoginMethod}>
          {loginMethod === "password" && (
            <button
              type="button"
              className={styles.switchButton}
              onClick={() => onMethodChange("otp")}
            >
              Login with OTP
            </button>
          )}

          {loginMethod === "otp" && (
            <button
              type="button"
              className={styles.switchButton}
              onClick={() => onMethodChange("password")}
            >
              Login with Password
            </button>
          )}
        </div>
        <div className={styles.forgotPassword}>
          <span className={styles.forgotLink} onClick={onForgotPassword}>
            Forgot Password?
          </span>
        </div>
      </div>
    </form>
  );
}