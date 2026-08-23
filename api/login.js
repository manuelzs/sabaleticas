/* POST { clave } -> sets the session cookie. The only place the password is read. */
const crypto = require('crypto');
const { crearCookie } = require('./_auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'método' });
  const esperada = process.env.TG_PASSWORD;
  if (!esperada) return res.status(500).json({ error: 'sin TG_PASSWORD configurada' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const dada = String((body && body.clave) || '');

  // Compare over digests so the check does not leak the length of the password.
  const a = crypto.createHash('sha256').update(dada).digest();
  const b = crypto.createHash('sha256').update(esperada).digest();
  if (!crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'clave' });

  res.setHeader('Set-Cookie', crearCookie());
  res.status(200).json({ ok: true });
};
