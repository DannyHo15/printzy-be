import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { User } from '@app/users/entities/user.entity';
import { SignOptions } from 'jsonwebtoken';
import { genSalt, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Hàm tạo JWT token
  generateResetToken(user: User): string {
    const options: SignOptions = {
      subject: String(user.id),
      expiresIn: '5m',
    };
    return this.jwtService.sign({}, options);
  }

  async sendResetPasswordEmail(user: User): Promise<void> {
    const token = this.generateResetToken(user);
    const resetUrl = `${process.env.LINK_RESET_PASSWORD}?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: process.env.GMAIL_NAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_NAME,
      to: user.email,
      subject: 'Reset Your Password - Printzy',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
              }
              .header {
                text-align: center;
                background-color: #FF3D59;
                color: #ffffff;
                padding: 20px;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 20px;
                text-align: center;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
              }
              .content a {
                background-color: #FF3D59;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Printzy - Password Reset</h1>
              </div>
              <div class="content">
                <p>Hello</p>
                <p>You requested to reset your password for your Printzy account. Click the button below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this, you can ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Printzy. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, await genSalt());
    await this.userRepository.save({
      id: +userId,
      password: hashedPassword,
    });

    return { message: 'Password changed successfully' };
  }
}
