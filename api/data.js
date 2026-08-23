/* The payload, only for a valid session.
 *
 * Required, not read from disk: a static require is what makes Vercel bundle the file
 * with the function. It also means the data lives OUTSIDE public/, so there is no URL
 * that serves it without passing through here.
 */
const { sesionValida } = require('./_auth');
const payload = require('./_payload.json');

module.exports = (req, res) => {
  if (!sesionValida(req)) return res.status(401).json({ error: 'sesión' });
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json(payload);
};
