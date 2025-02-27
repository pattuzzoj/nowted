import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env['MAILER_EMAIL']!,
      pass: process.env['MAILER_PASSWORD']!,
    },
  });

  async sendMail(mailOptions: Mail.Options) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info.response);
        }
      });
    })
  }

  async sendVerificationMail(email: string, token: string) {
    await this.sendMail({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Verify Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <img src="https://nowted-showcase.vercel.app/assets/logo.svg" alt="Nowted Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2>Verify Your Account</h2>
          <p>Thank you for signing up with Nowted! Please verify your email address to complete your registration.</p>
          <p>Click the link below to verify your account:</p>
          <a href="${process.env['SITE_URL']!}/auth/activate-account?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #0073e6; color: #fff; text-decoration: none; border-radius: 5px;">
            Verify Account
          </a>
          <p>If you did not sign up for Nowted, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendRecoverMail(email: string, token: string) {
    await this.sendMail({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Recover Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <img src="https://nowted-showcase.vercel.app/assets/logo.svg" alt="Nowted Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2>Recover Your Account</h2>
          <p>We received a request to recover your Nowted account. Click the link below to reset your password:</p>
          <a href="${process.env['SITE_URL']!}/auth/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #0073e6; color: #fff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendWelcomeMail(email: string) {
    await this.sendMail({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Welcome to Nowted',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <img src="https://nowted-showcase.vercel.app/assets/logo.svg" alt="Nowted Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2>Welcome to Nowted!</h2>
          <p>Your account has been created successfully. We're excited to have you on board!</p>
          <p>If you haven't already, please verify your email address to complete your registration.</p>
          <p>Thank you for choosing Nowted.</p>
        </div>
      `,
    });
  }
}
