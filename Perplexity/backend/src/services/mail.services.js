import nodemailer from "nodemailer";

const getMailConfig = () => {
    const gmailUser = process.env.GOOGLE_USER;
    const appPassword = process.env.GOOGLE_APP_PASSWORD;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    const hasOAuthConfig = Boolean(gmailUser && clientId && clientSecret && refreshToken);
    const hasAppPasswordConfig = Boolean(gmailUser && appPassword);

    return {
        gmailUser,
        appPassword,
        clientId,
        clientSecret,
        refreshToken,
        hasOAuthConfig,
        hasAppPasswordConfig,
    };
};

const createTransporter = () => {
    const {
        gmailUser,
        appPassword,
        clientId,
        clientSecret,
        refreshToken,
        hasAppPasswordConfig,
    } = getMailConfig();

    return nodemailer.createTransport({
        service: "gmail",
        auth: hasAppPasswordConfig
            ? {
                user: gmailUser,
                pass: appPassword,
            }
            : {
                type: "OAuth2",
                user: gmailUser,
                clientId,
                clientSecret,
                refreshToken,
            },
    });
};


export async function sendEmail({ to, subject, html, text }) {
    const { gmailUser, hasOAuthConfig, hasAppPasswordConfig } = getMailConfig();

    if (!to) {
        throw new Error("Recipient email is required");
    }

    if (!hasOAuthConfig && !hasAppPasswordConfig) {
        throw new Error(
            "Email config missing. Use GOOGLE_USER + GOOGLE_APP_PASSWORD (recommended) or GOOGLE_USER + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN"
        );
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: gmailUser,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details.response || details.messageId);
}