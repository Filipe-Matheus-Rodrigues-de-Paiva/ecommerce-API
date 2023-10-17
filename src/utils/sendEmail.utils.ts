import { createTransport } from "nodemailer";
import { IEmailRequest } from "../types/user.types";
import "dotenv/config";
import Mailgen from "mailgen";
import AppError from "../error";

class EmailService {
  async sendEmail({ to, subject, text }: IEmailRequest) {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter
      .sendMail({
        from: "felipe@kenzie.com.br",
        to,
        subject,
        html: text,
      })
      .then(() => {
        console.log("email send with sucess");
      })
      .catch((err: any) => {
        console.log(err);
        throw new AppError("Error sending email, try again later", 500);
      });
  }

  resetPasswordTemplate(
    userEmail: string,
    userName: string,
    resetToken: string
  ) {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "M6 T16",
        link: "http://localhost:3001/users",
      },
    });

    const email = {
      body: {
        name: userName,
        intro:
          "You have received this email because a password reset request for your account was received.",
        action: {
          instructions: "Click the button below to reset your password:",
          button: {
            color: "#DC4D2F",
            text: "Reset your password",
            link: `http://localhost:3001/users/resetPassword/${resetToken}`,
          },
        },
        outro:
          "If you did not request a password reset, no further action is required on your part.",
      },
    };

    const emailBody = mailGenerator.generate(email);
    const emailTemplate = {
      to: userEmail,
      subject: "Reset password",
      text: emailBody,
    };

    return emailTemplate;
  }
}

const emailService = new EmailService();

export { emailService };
