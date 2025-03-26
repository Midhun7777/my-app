// Define the OTP store type
type OTPData = {
  otp: string;
  timestamp: number;
};

// Create a global OTP store
declare global {
  var otpStore: Map<string, OTPData>;
}

// Initialize the store if it doesn't exist
if (!global.otpStore) {
  global.otpStore = new Map<string, OTPData>();
}

export const otpStore = global.otpStore; 