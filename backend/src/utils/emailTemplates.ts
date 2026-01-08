
export const newSignUpTemplate = (sanitizedFirstName: string, normalisedEmail: string) => {
  const subject = 'Welcome to Our Service!';
  const text = `Hello ${sanitizedFirstName},\n\nThank you for registering with our service. We're excited to have you on board!\n\nBest regards,\nThe Team`;
  const from = "mubashirmh04@gmail.com"
  const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>Welcome to Our Logistics/Shipping Service!</h2>
    <p>Hello ${sanitizedFirstName},</p>
    <p>Thank you for registering with our service. We're excited to have you on board!</p>
    <p>Best regards,<br>The Team</p>
  </div>`
  const to = normalisedEmail
;

 return { subject, text, from, html, to };
}


export const verifyEmailTemplate = (normalisedEmail: string, verificationCode: string) => {
  const subject = 'Verify Email';
  const text = `Please verify your email`;
  const from = "mubashirmh04@gmail.com"
  const html = `
  <div style="font-family: Arial, sans-serif;">
    <p>Please verify your email with the following verification code ${verificationCode}</p>
    <p>Please note that this code will expire in 15minutes</p>
  </div>`
  const to = normalisedEmail;

 return { subject, text, from, html, to };
}