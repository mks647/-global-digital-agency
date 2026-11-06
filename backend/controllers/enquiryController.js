
const transporter = require("../config/email");
const pool = require("../config/db");

exports.createEnquiry = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      business_name,
      service_type,
      message
    } = req.body;

    // Basic validation
    if (!full_name || !email || !service_type || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    // Insert enquiry into database
    const sql = `
      INSERT INTO customer_enquiries
      (full_name, email, phone, business_name, service_type, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      full_name.trim(),
      email.trim(),
      phone || null,
      business_name || null,
      service_type,
      message.trim()
    ];

    const [result] = await pool.execute(sql, values);

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: "New Customer Enquiry - Global Digital Agency",
        text: `
New Customer Enquiry Received!

Enquiry ID: ${result.insertId}
Name: ${full_name}
Email: ${email}
Phone: ${phone || "Not provided"}
Business: ${business_name || "Not provided"}
Service: ${service_type}

Message:
${message}
`
      });

      console.log("Enquiry Email Notification Sent!");

    } catch (mailError) {
      console.error("Enquiry Email Failed:", mailError.message);
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      enquiry_id: result.insertId
    });

  } catch (error) {
    console.error("Enquiry Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit enquiry."
    });
  }
};
