import api from './axios';

const getErrorMessage = (error) => {
  console.error("API Error:", error);
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Request failed'
  );
};

export const authApi = {
  
  resendOTP: async (mobile) => {
    console.log("Calling API resendOTP with mobile:", mobile);
    const res = await api.post('/auth/resend-otp', { mobile });
    console.log("Resend otp is:",res.data)
    alert("Resend otp is:"+res.data.data)
    return res.data;
  },

  initRegister: async (mobile) => {
    console.log("Calling  API initRegister with mobile:", mobile);
    const res = await api.post('/auth/register/init', { mobile });
    console.log("init register otp is :",res.data)
    alert("Init Register otp is:"+res.data.data)

    return res.data;
  },

  verifyRegisterOtp: async (mobile, otp) => {
    console.log("Calling API verifyRegisterOtp with mobile:", mobile, "and otp:", otp);
    const res = await api.post('/auth/register/verify-otp', { mobile, otp });
    return res.data;
  },

  completeRegister: async ({ mobile, firstName, lastName, password, confirmPassword }) => {
    console.log("Calling API completeRegister with data:", { mobile, firstName, lastName, password, confirmPassword });
    const res = await api.post('/auth/register/complete', {
      mobile,
      firstName,
      lastName,
      password,
      confirmPassword
    });
    return res.data;
  },

  loginWithPassword: async (mobile, password) => {
    console.log("Calling API loginWithPassword with mobile:", mobile, "and password:", password);
    const res = await api.post('/auth/login/method', {
      mobile,
      password,
      loginMethod: 'password'
    });
    return res.data;
  },

  requestLoginOtp: async (mobile) => {
    console.log("Calling API requestLoginOtp with mobile:", mobile);
    const res = await api.post('/auth/login/method', {
      mobile,
      loginMethod: 'otp'
    });
     console.log("Login otp is:",res.data)
    alert("Login otp is:"+res.data.data)

    return res.data;
  },

  verifyLoginOtp: async (mobile, otp) => {
    console.log("Calling API verifyLoginOtp with mobile:", mobile, "and otp:", otp);
    const res = await api.post('/auth/login/verify-otp', { mobile, otp });
    return res.data;
  },

  forgetPassword: async (mobile) => {
    console.log("Calling API forgetPassword with mobile:", mobile);
    const res = await api.post('/auth/forget-password', { mobile });
    console.log("Forger Password for otp is:",res.data)
    alert("Forget Password for otp is:"+res.data.data)

    return res.data;
  },

  resetPassword: async ({ mobile, otp, newPassword, confirmPassword }) => {
    console.log("Calling API resetPassword with data:", { mobile, otp, newPassword, confirmPassword });
    const res = await api.put('/auth/reset-password', {
      mobile,
      otp,
      newPassword,
      confirmPassword
    });
    return res.data;
  },

  getProfile: async () => {
    console.log("Calling API getProfile");
    const res = await api.get('/auth/profile');
    return res.data;
  },

  logout: async () => {
    console.log("Calling API logout");
    const res = await api.post('/auth/logout');
    return res.data;
  },

  addAddress:async(address,email)=>{
    const res = await api.put('/auth/profile/address', {address,email});
    return res.data;
  },
  updateAddress:async(addressId,address,email)=>{
    const res = await api.put(`/auth/profile/address/${addressId}`, {address,email});
    return res.data;
  },
   

    // ==================== ADMIN APIs ====================
  
  // Check if user is admin before sending OTP
  adminCheck: async (mobile) => {
    console.log("Checking admin status for mobile:", mobile);
    const res = await api.post('/auth/admin/check', { mobile });
    alert("Login otp is:"+res.data.data.otp)
    return res.data;
  },

  // Admin login with OTP
  adminLogin: async (mobile, otp) => {
    console.log("Admin login with mobile:", mobile);
    const res = await api.post('/auth/admin/login', { mobile, otp });
    return res.data;
  },
 
  
};

export { getErrorMessage };
