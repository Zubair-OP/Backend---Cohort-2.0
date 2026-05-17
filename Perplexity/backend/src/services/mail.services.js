import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
    },
});

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send emails");
    })
    .catch((error) => {
        console.error("Email transporter verification failed:", error.message || error);
    });

export async function sendEmail({ to, subject, html, text }) {
    if (!to) {
        throw new Error("Recipient email is required");
    }

    const details = await transporter.sendMail({
        from: '"Perplexity" <onboarding@resend.dev>',
        to,
        subject,
        html,
        text,
    });

    console.log("Email sent:", details.response || details.messageId);
    return details;
}
