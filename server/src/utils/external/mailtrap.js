import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, mailgenContent }) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Barber Booking',
      link: 'https://taskmanagelink.com',
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(mailgenContent);

  const emailHtml = mailGenerator.generate(mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: 'mail.taskmanager@example.com',
    to: email,
    subject: subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      'Email service failed siliently. Make sure that you have provided your MAILTRAP credentials in the .env file',
    );
    console.error('Error: ', error);
  }
};

const emailVerificationMailgenContent = ({ username, verficationUrl }) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions: 'To verify your email please click on the following button',
        button: {
          color: '#22BC66',
          text: 'Verify your email',
          link: verficationUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = ({ username, passwordResetUrl }) => {
  return {
    body: {
      name: username,
      intro: 'We got a request to reset the password of your account',
      action: {
        instructions: 'To reset your password click on the following button or link',
        button: {
          color: '#22BC66',
          text: 'Reset password',
          link: passwordResetUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordOTPContent = ({ username, otp }) => {
  return {
    body: {
      name: username,
      intro: 'You requested to reset your password.',
      table: {
        data: [
          {
            item: 'Your OTP Code',
            description: otp,
          },
        ],
      },
      outro: 'This OTP is valid for 10 minutes. Do not share it with anyone.',
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  forgotPasswordOTPContent,
  sendEmail,
};
