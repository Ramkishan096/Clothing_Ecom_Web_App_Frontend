import { useEffect, useState } from "react";
import { Eye as EyeIcon, X, CheckCircle, Shield, Users } from "lucide-react";
import { authApi, getErrorMessage } from "../api/authApi";
import { LoginFlow } from "./forms/LoginFlow";
import { ResetFlow } from "./forms/ResetFlow";
import { SignupFlow } from "./forms/SignupFlow";
import styles from "./LoginModal.module.css";

const initialLoginData = {
  mobile: "",
  password: "",
  otp: "",
};

const initialSignupData = {
  mobile: "",
  otp: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

const initialResetData = {
  mobile: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const fullName = [rawUser.firstName, rawUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: rawUser._id || rawUser.id || rawUser.userId || "",
    name: fullName || rawUser.name || rawUser.email || rawUser.mobile || "User",
    email: rawUser.email || "",
    phone: rawUser.mobile || rawUser.phone || "",
    avatar: null,
  };
};

const persistUser = (rawUser) => {
  const user = normalizeUser(rawUser);
  if (!user) return;

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
};

// OTP Input Component
export const OTPInput = ({ value, onChange, disabled }) => {
  const [otpValues, setOtpValues] = useState(
    value ? value.split("") : ["", "", "", ""],
  );

  const handleChange = (index, val) => {
    if (val.length > 1) return;
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);
    onChange(newOtp.join(""));

    if (val && index < 3) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`,
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`,
      );
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtpValues([...newOtp, ...Array(4 - newOtp.length).fill("")]);
      onChange(pastedData);
    }
  };

  useEffect(() => {
    if (value) {
      const valArray = value.split("");
      setOtpValues([...valArray, ...Array(4 - valArray.length).fill("")]);
    }
  }, [value]);

  return (
    <div className={styles.otpContainer}>
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          type="number"
          name={`otp-${index}`}
          className={`${styles.otpInput} ${otpValues[index] ? styles.filled : ""}`}
          maxLength="1"
          value={otpValues[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};

export function LoginModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [step, setStep] = useState("default");
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");

  const [loginData, setLoginData] = useState(initialLoginData);
  const [signupData, setSignupData] = useState(initialSignupData);
  const [resetData, setResetData] = useState(initialResetData);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setStep("default");
    clearMessages();
    if (tab !== "login") {
      setLoginMethod("password");
    }
  };

  const fetchProfileAndPersist = async () => {
    try {
      const profile = await authApi.getProfile();
      persistUser(profile?.data);
    } catch {
      // ignore profile fetch failure after successful auth response
    }
  };

  const completeAuth = async (userFromResponse) => {
    if (userFromResponse) {
      persistUser(userFromResponse);
    }
    await fetchProfileAndPersist();
    onClose();
    window.location.reload();
  };

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!isOpen) {
      setStep("default");
      setLoading(false);
      setResendLoading(false);
      setError("");
      setMessage("");
      setLoginMethod("password");
      setLoginData(initialLoginData);
      setSignupData(initialSignupData);
      setResetData(initialResetData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    clearMessages();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (loginMethod === "password") {
        const response = await authApi.loginWithPassword(
          loginData.mobile,
          loginData.password,
        );
        await completeAuth(response?.data);
        return;
      }

      await authApi.requestLoginOtp(loginData.mobile);
      setStep("login-otp");
      setMessage("OTP sent for login. Please verify OTP.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOtpVerify = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await authApi.verifyLoginOtp(
        loginData.mobile,
        loginData.otp,
      );
      await completeAuth(response?.data);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.initRegister(signupData.mobile);
      setStep("signup-verify-otp");
      setMessage("OTP sent. Verify OTP to continue registration.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerifyOtp = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.verifyRegisterOtp(signupData.mobile, signupData.otp);
      setStep("signup-complete");
      setMessage("OTP verified. Complete your profile details.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupComplete = async (event) => {
    event.preventDefault();
    clearMessages();

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.completeRegister({
        mobile: signupData.mobile,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      });
      await completeAuth(response?.user);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  // 🟢 NEW: Resend OTP handler function
  const handleResendOtp = async (mobile) => {
    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setResendLoading(true);
    clearMessages();

    try {
      await authApi.resendOTP(mobile);
      setMessage("OTP resent successfully!");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetInit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.forgetPassword(resetData.mobile);
      setStep("forgot-reset");
      setMessage("Password reset OTP sent. Enter OTP and new password.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleResetComplete = async (event) => {
    event.preventDefault();
    clearMessages();

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        mobile: resetData.mobile,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });

      setMessage("Password updated successfully. Please login now.");
      setActiveTab("login");
      setStep("default");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const renderFlow = () => {
    if (activeTab === "login") {
      return (
        <LoginFlow
          styles={styles}
          step={step}
          loading={loading}
          resendLoading={resendLoading}
          loginMethod={loginMethod}
          loginData={loginData}
          setLoginData={setLoginData}
          onMethodChange={handleLoginMethodChange}
          onSubmitLogin={handleLoginSubmit}
          onVerifyOtp={handleLoginOtpVerify}
          onBack={() => setStep("default")}
          onForgotPassword={() => switchTab("reset")}
           onResendOtp={handleResendOtp}
        />
      );
    }

    if (activeTab === "signup") {
      return (
        <SignupFlow
          styles={styles}
          step={step}
          loading={loading}
          resendLoading={resendLoading}
          signupData={signupData}
          setSignupData={setSignupData}
          onInit={handleSignupInit}
          onVerifyOtp={handleSignupVerifyOtp}
          onComplete={handleSignupComplete}
          onBackToDefault={() => setStep("default")}
          onBackToOtp={() => setStep("signup-verify-otp")}
          onResendOtp={handleResendOtp}

        />
      );
    }

    return (
      <ResetFlow
        styles={styles}
        step={step}
        loading={loading}
        resendLoading={resendLoading}
        resetData={resetData}
        setResetData={setResetData}
        onInit={handleResetInit}
        onComplete={handleResetComplete}
        onBack={() => setStep("default")}
        onResendOtp={handleResendOtp}
      />
    );
  };

  // Get the appropriate image content based on active tab
  const getImageContent = () => {
    const content = {
      login: {
        title: "Welcome Back!",
        subtitle: "Sign in to your account to continue your journey",
        features: [
          "Secure Login",
          "Access Your Dashboard",
          "Manage Your Profile",
        ],
      },
      signup: {
        title: "Join Black Studio",
        subtitle: "Create your account and start your journey with us",
        features: [
          "Free Registration",
          "Exclusive Benefits",
          "Community Access",
        ],
      },
      reset: {
        title: "Reset Password",
        subtitle: "Don't worry, we'll help you reset your password",
        features: ["Secure Reset", "OTP Verification", "Quick Recovery"],
      },
    };

    return content[activeTab] || content.login;
  };

  const imageContent = getImageContent();

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        {/* Left Side - Image/Brand Section */}
        <div className={styles.modalImage}>
          <div className={styles.modalImageContent}>
            <div className={styles.logo}>
              <EyeIcon className={styles.logoIcon} />
            </div>
            <h2>{imageContent.title}</h2>
            <p>{imageContent.subtitle}</p>
            <div className={styles.imageFeatures}>
              {imageContent.features.map((feature, index) => (
                <div key={index} className={styles.imageFeature}>
                  {index === 0 && (
                    <CheckCircle className={styles.imageFeatureIcon} />
                  )}
                  {index === 1 && (
                    <Shield className={styles.imageFeatureIcon} />
                  )}
                  {index === 2 && <Users className={styles.imageFeatureIcon} />}
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className={styles.modalForm}>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>

          <div className={styles.modalHeader}>
            <h2 className={styles.title}>
              {activeTab === "login"
                ? "Sign In"
                : activeTab === "signup"
                  ? "Create Account"
                  : "Reset Password"}
            </h2>
            <p className={styles.subtitle}>
              {activeTab === "login"
                ? "Enter your credentials to access your account"
                : activeTab === "signup"
                  ? "Fill in your details to get started"
                  : "Enter your mobile to reset password"}
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${activeTab === "signup" ? styles.tabActive : ""}`}
              onClick={() => switchTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.info}>{message}</div>}

          {renderFlow()}

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine} />
          </div>

          {/* <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285F4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div> */}

          <div className={styles.footer}>
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <span
                  className={styles.footerLink}
                  onClick={() => switchTab("signup")}
                >
                  Sign up
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  className={styles.footerLink}
                  onClick={() => switchTab("login")}
                >
                  Sign in
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
