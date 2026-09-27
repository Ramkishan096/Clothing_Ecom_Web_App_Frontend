// // src/pages/AdminLogin/AdminLogin.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import styles from './AdminLogin.module.css';

// const AdminLogin = () => {
//   const navigate = useNavigate();
//   const { requestLoginOTP, verifyLoginOTP, loading } = useAuth();
  
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1); // 1 = mobile, 2 = otp
//   const [error, setError] = useState('');

//   // Handle Send OTP - Same as normal user
//   const handleSendOTP = async () => {
//     // Validation
//     if (!mobile || mobile.length !== 10) {
//       setError('Please enter a valid 10-digit mobile number');
//       return;
//     }

//     // Admin number check
//     // if (mobile !== '9999999999') {
//     //   setError('Invalid admin number. Only 9999999999 is allowed');
//     //   return;
//     // }

//     setError('');
//     try {
//       // Same API as normal user - requestLoginOTP
//       await requestLoginOTP(mobile);
//       setStep(2);
//       // Backend se OTP alert mein aayega
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   // Handle Verify OTP - Same as normal user
//   const handleVerifyOTP = async () => {
//     if (!otp || otp.length !== 4) {
//       setError('Please enter a valid 4-digit OTP');
//       return;
//     }

//     setError('');
//     try {
//       // Same API as normal user - verifyLoginOtp
//       await verifyLoginOTP(mobile, otp);
      
//       // Admin flag set karo
//       localStorage.setItem('isAdmin', 'true');
      
//       // Dashboard pe navigate karo
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Invalid OTP');
//     }
//   };

//   // Enter key press handler
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       if (step === 1) {
//         handleSendOTP();
//       } else {
//         handleVerifyOTP();
//       }
//     }
//   };

//   return (
//     <div className={styles.adminLogin}>
//       {/* Left Panel - Branding */}
//       <div className={styles.leftPanel}>
//         <div className={styles.brand}>
//           <Shield size={48} className={styles.icon} />
//           <h1>BLACK STUDIO</h1>
//           <p>Admin Panel</p>
//         </div>
//         <div className={styles.features}>
//           <div>📦 Manage Products</div>
//           <div>👥 Handle Orders</div>
//           <div>📊 View Analytics</div>
//           <div>⚙️ Store Settings</div>
//         </div>
//       </div>

//       {/* Right Panel - Login Form */}
//       <div className={styles.rightPanel}>
//         <div className={styles.loginCard}>
//           <div className={styles.header}>
//             <Shield size={32} />
//             <h2>Admin Login</h2>
//             <p>Enter admin credentials to continue</p>
//           </div>

//           {error && <div className={styles.error}>{error}</div>}

//           {step === 1 ? (
//             // Step 1: Mobile Number
//             <div className={styles.form}>
//               <div className={styles.inputGroup}>
//                 <Phone size={20} />
//                 <input
//                   type="tel"
//                   placeholder="Enter admin mobile number"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   maxLength={10}
//                   disabled={loading}
//                   autoFocus
//                 />
//               </div>
//               <button 
//                 onClick={handleSendOTP} 
//                 disabled={loading}
//                 className={styles.btn}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={18} className={styles.spinner} />
//                     Sending OTP...
//                   </>
//                 ) : (
//                   <>
//                     Send OTP
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>              
//             </div>
//           ) : (
//             // Step 2: OTP Verification
//             <div className={styles.form}>
//               <div className={styles.otpInfo}>
//                 <p>OTP sent to <strong>{mobile}</strong></p>
//               </div>
//               <div className={styles.inputGroup}>
//                 <Lock size={20} />
//                 <input
//                   type="text"
//                   placeholder="Enter 6-digit OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   maxLength={6}
//                   disabled={loading}
//                   autoFocus
//                 />
//               </div>
//               <button 
//                 onClick={handleVerifyOTP} 
//                 disabled={loading}
//                 className={styles.btn}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={18} className={styles.spinner} />
//                     Verifying...
//                   </>
//                 ) : (
//                   <>
//                     Verify & Login
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>
//               <div className={styles.actions}>
//                 <button 
//                   onClick={() => {
//                     setStep(1);
//                     setOtp('');
//                     setError('');
//                   }} 
//                   className={styles.backBtn}
//                 >
//                   ← Change Number
//                 </button>
//                 <button 
//                   onClick={handleSendOTP} 
//                   className={styles.resendBtn}
//                   disabled={loading}
//                 >
//                   Resend OTP
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;









// src/pages/AdminLogin/AdminLogin.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AdminLogin.module.css';
import { FaBoxOpen, FaShoppingCart, FaTachometerAlt, FaUsers } from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminCheck, adminLogin, loading } = useAuth();
  
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Timer effect for resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    
    try {
      // First check if user is admin from backend
      await adminCheck(mobile);
      
      // If admin, send OTP
      // Note: Your backend should send OTP in response
      // For demo, we're using the adminCheck response
      setStep(2);
      startTimer();
      // alert(`OTP sent to ${mobile}`);
      
    } catch (err) {
      setError(err?.response?.data?.message || 'You are not authorized as admin');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setError('');
    
    try {
      await adminLogin(mobile, otp);
      localStorage.setItem('isAdmin', 'true');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setError('');
    try {
      await adminCheck(mobile);
      startTimer();
      // alert(`OTP resent to ${mobile}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminLogin}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <Shield size={48} className={styles.icon} />
          <h1>BLACK STUDIO</h1>
          <p>Admin Panel</p>
        </div>
        <div className={styles.features}>
  <div className={styles.featureCard}>
    <FaTachometerAlt className={styles.icon} />
    <span>Dashboard Overview</span>
  </div>

  <div className={styles.featureCard}>
    <FaBoxOpen className={styles.icon} />
    <span>Manage Products</span>
  </div>

  <div className={styles.featureCard}>
    <FaShoppingCart className={styles.icon} />
    <span>Manage Orders</span>
  </div>

  <div className={styles.featureCard}>
    <FaUsers className={styles.icon} />
    <span>Manage Users</span>
  </div>
</div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <Shield size={32} />
            <h2>Admin Login</h2>
            <p>Enter admin credentials to continue</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {step === 1 ? (
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <Phone size={20} />
                <input
                  type="tel"
                  placeholder="Enter admin mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={10}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button 
                onClick={handleSendOTP} 
                disabled={loading}
                className={styles.btn}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Checking...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className={styles.form}>
              <div className={styles.otpInfo}>
                <p>OTP sent to <strong>{mobile}</strong></p>
              </div>
              <div className={styles.inputGroup}>
                <Lock size={20} />
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={4}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button 
                onClick={handleVerifyOTP} 
                disabled={loading}
                className={styles.btn}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              <div className={styles.actions}>
                <button 
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setError('');
                    setTimer(0);
                    setCanResend(true);
                  }} 
                  className={styles.backBtn}
                >
                  ← Change Number
                </button>
                <button 
                  onClick={handleResendOTP} 
                  className={styles.resendBtn}
                  disabled={!canResend || loading}
                >
                  {!canResend ? (
                    `Resend in ${formatTime(timer)}`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;