import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com"
    }
  })

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
  const emailHtml = mailGenerator.generate(options.mailgenContent)

  const {
    MAILTRAP_SMTP_HOST,
    MAILTRAP_SMTP_PORT,
    MAILTRAP_SMTP_USER,
    MAILTRAP_SMTP_PASS,
  } = process.env;

  const missingCredentials = [
    !MAILTRAP_SMTP_HOST && "MAILTRAP_SMTP_HOST",
    !MAILTRAP_SMTP_PORT && "MAILTRAP_SMTP_PORT",
    !MAILTRAP_SMTP_USER && "MAILTRAP_SMTP_USER",
    !MAILTRAP_SMTP_PASS && "MAILTRAP_SMTP_PASS",
  ].filter(Boolean);

  if (missingCredentials.length) {
    throw new Error(
      `Missing MAILTRAP credentials in .env: ${missingCredentials.join(", ")}`
    );
  }

  const transporter = nodemailer.createTransport({
    host: MAILTRAP_SMTP_HOST,
    port: Number(MAILTRAP_SMTP_PORT),
    secure: Number(MAILTRAP_SMTP_PORT) === 465,
    auth: {
      user: MAILTRAP_SMTP_USER,
      pass: MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed. Make sure you have provided your MAILTRAP credentials in the .env file"
    );
    console.error("Error:", error.message || error);
  }
}


const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "WElcome to our App! we are excited to have you on board",
      action: {
        instructions: "To verify your email please click on the following button",
        button: {
          color: "#22bc66",
          text: "Verify your email",
          link: verificationUrl
        }
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  }
}

const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "we got a request to reset the password of your account",
      action: {
        instructions: "To reset your password click on the following button or link",
        button: {
          color: "#de1515",
          text: "Click to reset password",
          link: passwordResetUrl
        }
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  }
}

export { forgotPasswordMailGenContent, emailVerificationMailGenContent, sendEmail };