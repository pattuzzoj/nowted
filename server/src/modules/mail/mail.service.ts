import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  });

  async sendMail(email: string, subject: string, message: string) {
    const mailOptions = {
      from: "<no-reply@nowted.com>",
      to: email,
      subject: subject,
      html: `
      <div>
      ${message}

      - Nowted
      </div>
      `
    };
    
    await this.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        throw new Error('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return;
      }
    });
  }

  async sendVerificationMail(email: string, link: string) {
    return await this.sendMail(email, "Verify Account", `Verify Account Link: ${link}`);
  }

  async sendRecoverMail(email: string, link: string) {
    return await this.sendMail(email, "Recover Account", `Recover Account Link: ${link}`);
  }

  async sendWelcomeMail(email: string) {
    return await this.sendMail(email, "Registration completed", "Welcome to Nowted");
  }
}