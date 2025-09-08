import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  try {
    // Tạo account Ethereal tự động
    let testAccount = await nodemailer.createTestAccount();

    // Config transporter dùng Ethereal
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

    res.status(200).json({
      success: true,
      message: "Email sent (Ethereal)",
      previewUrl: nodemailer.getTestMessageUrl(info), // URL xem mail online
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
}
