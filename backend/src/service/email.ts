import * as Brevo from "@getbrevo/brevo";

// Initialize the API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from: string = "mubashirmh04@gmail.com" // Use your verified Brevo sender
) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      email: from,
      name: "Your App Name", // Optional but recommended
    };
    sendSmtpEmail.to = [{ email: to }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
