const Admin = require("../models/Admin");

/**
 * Ensures an Admin document exists matching the credentials in .env.
 * The password is hashed by the Admin model's pre-save hook — it is
 * never stored in plaintext, and .env is git-ignored.
 */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — admin login will not work until they are configured in .env");
    return;
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) return;

  await Admin.create({ email: email.toLowerCase().trim(), password });
  console.log(`Admin account created for ${email}. Change ADMIN_PASSWORD in .env to update credentials on next restart of an unused account.`);
}

module.exports = ensureAdmin;
