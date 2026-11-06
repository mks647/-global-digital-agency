
require("dotenv").config();

const transporter = require("./config/email");

async function testEmail() {
    try {
        await transporter.verify();

        console.log("SMTP Connection Successful!");

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Global Digital Agency - Email Test",
            text: "Your email notification system is working successfully!"
        });

        console.log("Test Email Sent:", info.messageId);

    } catch (error) {
        console.error("Email Test Failed:", error.message);
    }
}

testEmail();
