export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    message: '¡Hola! La API está funcionando correctamente',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    vercel: true,
    environment: process.env.NODE_ENV || 'production',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO),
    emailUser: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 8) + '***' : 'NOT_SET',
    emailTo: process.env.EMAIL_TO ? process.env.EMAIL_TO.substring(0, 8) + '***' : 'NOT_SET'
  });
}