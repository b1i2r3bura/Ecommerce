/**
 * generateToken.js — JWT Token Utility
 *
 * WHAT IT IS:
 *   A small helper that creates a signed JSON Web Token (JWT).
 *
 * WHY WE NEED IT:
 *   JWTs are how we implement stateless authentication. After a user logs in,
 *   we give them a token they must include in every subsequent request to
 *   prove who they are — the server doesn't need to store session data.
 *
 * HOW IT WORKS:
 *   - jwt.sign() takes a PAYLOAD (what we embed in the token), a SECRET (used
 *     to sign it — anyone who has this secret can verify or forge tokens, so
 *     NEVER expose it), and OPTIONS (like expiry).
 *   - We embed `id` and `role` so our middleware can read the user's identity
 *     and permissions from the token without hitting the database on every request.
 *   - We NEVER put the password or other sensitive data in the payload.
 *
 * SECURITY NOTE:
 *   The JWT_SECRET must come from environment variables (.env).
 *   It should be a long, random string — never hard-coded.
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for a given user.
 *
 * @param {string} id   - MongoDB user _id
 * @param {string} role - User role ('customer' or 'admin')
 * @returns {string}    - Signed JWT string
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },               // Payload: what we encode inside the token
    process.env.JWT_SECRET,     // Secret key for signing
    { expiresIn: '30d' }        // Token expires in 30 days
  );
};

module.exports = generateToken;

