const axios = require("axios");

// SMS GATEWAY CONFIG (Sync with your PHP credentials)
const SMS_CONFIG = {
  username: "NEWCYBER",
  apikey: "4d84f1c522557793ebf9",
  senderid: "JUMBOX",
  templateid: "1707176416922923689",
  baseUrl: "https://smslogin.co/v3/api.php",
};

/**
 * Normalize phone to 12 digits (Adds 91 prefix)
 */
const normalizePhone = (phone) => {
  let p = phone.replace(/\D/g, ""); // 
  if (p.length === 10) return "91" + p;
  if (p.length === 12 && p.startsWith("91")) return p;
  return null;
};

/**
 * Send OTP via smslogin.co API
 */
const sendSMS = async (mobile, otpCode) => {
  const intlMobile = normalizePhone(mobile);
  if (!intlMobile) throw new Error("Invalid phone number format");

  // YOUR DLT TEMPLATE MESSAGE LOGIC
  const message = `Your OTP for Jumbo Xerox order verification is ${otpCode}. Valid for 5 minutes.`;

  console.log(`[DEBUG-SMS] Sending OTP ${otpCode} to ${intlMobile}...`);

  try {
    const response = await axios.get(SMS_CONFIG.baseUrl, {
      params: {
        username: SMS_CONFIG.username,
        apikey: SMS_CONFIG.apikey,
        senderid: SMS_CONFIG.senderid,
        mobile: intlMobile,
        message: message,
        templateid: SMS_CONFIG.templateid,
      },
    });

    console.log("[DEBUG-SMS-RES]:", response.data);
    return response.data;
  } catch (error) {
    console.error("[DEBUG-SMS-ERR]:", error.message);
    throw new Error("SMS Gateway Connection Failed");
  }
};

module.exports = { sendSMS };
