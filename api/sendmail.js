import nodemailer from "nodemailer";

export default async function handler(req, res) {
    // Luôn set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Nếu browser gửi preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { name, email, message } = req.body;

    try {
        // Tạo account Ethereal để test
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: `"Demo Form" <${testAccount.user}>`,
            to: "receiver@example.com",
            subject: "Demo Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });

        return res.status(200).json({
            success: true,
            message: "Email sent (Ethereal)",
            previewUrl: nodemailer.getTestMessageUrl(info),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to send email" });
    }
}
