const nodemailer = require('nodemailer');
const SMTP_USER = process.env.SMTP_USER;
const SMPT_PASSWORD = process.env.SMPT_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: SMTP_USER,
      pass: SMPT_PASSWORD,
    },
  });

  module.exports = transporter;