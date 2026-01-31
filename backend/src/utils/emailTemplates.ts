export const newSignUpTemplate = (
  sanitizedFirstName: string,
  normalisedEmail: string
) => {
  return {
    to: normalisedEmail,
    subject: "Welcome to Our Service!",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to Our Logistics/Shipping Service!</h2>
        <p>Hello ${sanitizedFirstName},</p>
        <p>Thank you for registering with our service. We're excited to have you on board!</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `,
  };
};

export const verifyEmailTemplate = (
  normalisedEmail: string,
  verificationCode: string
) => {
  return {
    to: normalisedEmail,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>
        <p>Please verify your email with the following verification code:</p>
        <h3 style="background-color: #f0f0f0; padding: 10px; letter-spacing: 2px;">${verificationCode}</h3>
        <p>Please note that this code will expire in 15 minutes.</p>
      </div>
    `,
  };
};

export const resetPasswordTemplate = (
  normalisedEmail: string,
  resetCode: string
) => {
  return {
    to: normalisedEmail,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>Please reset your password using the following code:</p>
        <h3 style="background-color: #f0f0f0; padding: 10px; letter-spacing: 2px;">${resetCode}</h3>
        <p>Please note that this code will expire in 15 minutes.</p>
      </div>
    `,
  };
};
