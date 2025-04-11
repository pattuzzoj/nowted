import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

@Injectable()
export default class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env['MAILER_EMAIL']!,
      pass: process.env['MAILER_PASSWORD']!,
    },
  });

  async send(mailOptions: Mail.Options): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info.response);
        }
      });
    });
  }

  async sendVerificationMail(email: string, token: string) {
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Verify Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
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

  async sendEmailChangeVerificationPin(newEmail: string, pin: number) {
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: newEmail,
      subject: 'Confirm Your Email Change',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <h2>Confirm Your Email Change</h2>
          <p>We received a request to change the email associated with your Nowted account.</p>
          <p>To confirm this change, please enter the following verification code in the system:</p>
          <h3 style="font-size: 24px; font-weight: bold; color: #0073e6;">${pin}</h3>
          <p>If you did not request this change, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendRecoverMail(email: string, token: string) {
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Recover Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
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
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Welcome to Nowted',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <h2>Welcome to Nowted!</h2>
          <p>Your account has been created successfully. We're excited to have you on board!</p>
          <p>If you haven't already, please verify your email address to complete your registration.</p>
          <p>Thank you for choosing Nowted.</p>
        </div>
      `,
    });
  }

  async sendAccountSuspensionMail(email: string) {
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Your Account Has Been Suspended',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <h2>Your Account Has Been Suspended</h2>
        <p>You have successfully suspended your Nowted account.</p>
        <p>While your account is suspended, you won’t receive notifications and won’t have access to your content.</p>
        <p>To reactivate your account, simply log in again at any time.</p>
        <p>If you have any questions, we're here to help.</p>
        <p>— The Nowted Team</p>
      </div>
    `,
    });
  }

  async sendAccountReactivationMail(email: string) {
    await this.send({
      from: 'Nowted <no-reply@nowted.com>',
      to: email,
      subject: 'Your Account Has Been Reactivated',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <h2>Welcome Back!</h2>
        <p>Your Nowted account has been successfully reactivated after your recent login.</p>
        <p>You now have full access to all your content and features again.</p>
        <p>We're glad to have you back!</p>
        <p>— The Nowted Team</p>
      </div>
    `,
    });
  }
}
