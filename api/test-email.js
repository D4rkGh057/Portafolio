import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🧪 Testing email configuration...');
    
    // Verificar variables de entorno
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      EMAIL_TO: !!process.env.EMAIL_TO,
      values: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_TO: process.env.EMAIL_TO,
        EMAIL_PASS_LENGTH: process.env.EMAIL_PASS?.length || 0
      }
    };

    console.log('Environment check:', envCheck);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      return res.status(500).json({
        success: false,
        error: 'Variables de entorno faltantes',
        envCheck
      });
    }

    // Crear transporter
    let transporter;
    if (process.env.EMAIL_USER.includes('gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Solo Gmail soportado en este test',
        emailUser: process.env.EMAIL_USER
      });
    }

    // Verificar transporter
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully!');

    res.status(200).json({
      success: true,
      message: 'Configuración de email verificada correctamente',
      envCheck,
      transporterVerified: true
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error en la prueba de email',
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}