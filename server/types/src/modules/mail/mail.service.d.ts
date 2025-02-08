export declare class MailService {
    private transporter;
    sendMail(email: string, subject: string, message: string): Promise<void>;
    sendVerificationMail(email: string, link: string): Promise<void>;
    sendRecoverMail(email: string, link: string): Promise<void>;
    sendWelcomeMail(email: string): Promise<void>;
}
//# sourceMappingURL=mail.service.d.ts.map