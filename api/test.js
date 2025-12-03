module.exports = async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Manejar OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Información de debug
  const debug = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'OK',
      message: 'API funcionando correctamente',
      debug
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      status: 'POST received',
      message: 'Datos recibidos correctamente',
      received: req.body,
      debug
    });
  }

  // Otros métodos
  res.status(405).json({
    error: `Method ${req.method} not allowed`,
    allowedMethods: ['GET', 'POST', 'OPTIONS'],
    debug
  });
};