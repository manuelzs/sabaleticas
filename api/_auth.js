/* Shared session check.
 *
 * One shared password, one farm — deliberately. No accounts, no roles, no database:
 * those arrive when there is a second person or a second farm, and inventing them
 * before that is inventing state nobody maintains.
 *
 * The cookie is an HMAC over an expiry, signed with a server-side secret. That is what
 * makes it a real gate rather than a speed bump: the browser cannot mint one, and the
 * password never travels again after the first POST.
 */
const crypto = require('crypto');

const COOKIE = 'tg_sesion';
const DIAS = 30;

function secreto() {
  const s = process.env.TG_SECRET || process.env.TG_PASSWORD;
  if (!s) throw new Error('falta TG_PASSWORD en el entorno');
  return s;
}

function firmar(exp) {
  return crypto.createHmac('sha256', secreto()).update(String(exp)).digest('hex');
}

function crearCookie() {
  const exp = Date.now() + DIAS * 864e5;
  const val = `${exp}.${firmar(exp)}`;
  return `${COOKIE}=${val}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`;
}

function sesionValida(req) {
  const raw = req.headers.cookie || '';
  const m = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, mac] = m[1].split('.');
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  const esperado = firmar(exp);
  // Constant-time: a length mismatch would throw, so guard it first.
  return mac.length === esperado.length &&
    crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(esperado));
}

module.exports = { COOKIE, crearCookie, sesionValida };
