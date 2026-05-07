import nodemailer from "nodemailer";

function getMailConfig() {
    const gmailUser = process.env.GOOGLE_USER;
    const appPassword = process.env.GOOGLE_APP_PASSWORD;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    return {
        gmailUser,
        appPassword,
        clientId,
        clientSecret,
        refreshToken,
        hasAppPasswordConfig: Boolean(gmailUser && appPassword),
        hasOAuthConfig: Boolean(gmailUser && clientId && clientSecret && refreshToken),
    };
}

function createTransporter() {
    const {
        gmailUser,
        appPassword,
        clientId,
        clientSecret,
        refreshToken,
        hasAppPasswordConfig,
        hasOAuthConfig,
    } = getMailConfig();

    if (hasAppPasswordConfig) {
        console.log("Mail transporter auth mode: app-password");
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmailUser,
                pass: appPassword,
            },
        });
    }

    if (hasOAuthConfig) {
        console.log("Mail transporter auth mode: oauth2");
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: gmailUser,
                clientId,
                clientSecret,
                refreshToken,
            },
        });
    }

    throw new Error(
        "Email config missing. Use GOOGLE_USER + GOOGLE_APP_PASSWORD, or configure full OAuth2 credentials."
    );
}

function explainMailError(error) {
    if (error?.code === "EAUTH" && error?.command === "AUTH XOAUTH2") {
        return new Error(
            "Gmail OAuth authorization failed. Your GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN combo is not authorized for Gmail SMTP. Use GOOGLE_APP_PASSWORD instead, or regenerate OAuth credentials with Gmail API access and a valid refresh token."
        );
    }

    return error;
}

const transporter = createTransporter();

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send emails");
    })
    .catch((error) => {
        const explainedError = explainMailError(error);
        console.error("Email transporter verification failed:", explainedError.message || explainedError);
    });

export async function sendEmail({ to, subject, html, text }) {
    if (!to) {
        throw new Error("Recipient email is required");
    }

    const { gmailUser } = getMailConfig();

    try {
        const details = await transporter.sendMail({
            from: `"Perplexity" <${gmailUser}>`,
            to,
            subject,
            html,
            text,
        });

        console.log("Email sent:", details.response || details.messageId);
        return details;
    } catch (error) {
        throw explainMailError(error);
    }
}
