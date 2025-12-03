import nodemailer from 'nodemailer';

// Configuración de rate limiting simple (en memoria)
const rateLimit = new Map();

export default async function handler(req, res) {
  console.log('🚀 Function started - Method:', req.method);
  console.log('📧 Environment check:', {
    emailUser: !!process.env.EMAIL_USER,
    emailPass: !!process.env.EMAIL_PASS,
    emailTo: !!process.env.EMAIL_TO,
    nodeEnv: process.env.NODE_ENV
  });

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

  // Endpoint de salud para GET
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API de contacto funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  }
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting básico por IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    
    if (rateLimit.has(ip)) {
      const attempts = rateLimit.get(ip).filter(time => now - time < windowMs);
      if (attempts.length >= 5) {
        return res.status(429).json({
          success: false,
          error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.'
        });
      }
      attempts.push(now);
      rateLimit.set(ip, attempts);
    } else {
      rateLimit.set(ip, [now]);
    }

    const { nombre, email, mensaje } = req.body;

    // Validación
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    if (nombre.length < 2 || mensaje.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Nombre muy corto o mensaje insuficiente'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Verificar variables de entorno primero
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.error('❌ Missing environment variables:', {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        EMAIL_TO: !!process.env.EMAIL_TO
      });
      return res.status(500).json({
        success: false,
        error: 'Configuración de email incompleta',
        missing: {
          EMAIL_USER: !process.env.EMAIL_USER,
          EMAIL_PASS: !process.env.EMAIL_PASS,
          EMAIL_TO: !process.env.EMAIL_TO
        }
      });
    }

    console.log('📧 Configuring transporter for:', process.env.EMAIL_USER);

    // Configurar Nodemailer
    let transporter;
    
    // Gmail
    if (process.env.EMAIL_USER?.includes('gmail.com')) {
      console.log('🔧 Using Gmail configuration');
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    // Outlook
    else if (process.env.EMAIL_USER?.includes('outlook.com') || process.env.EMAIL_USER?.includes('hotmail.com')) {
      transporter = nodemailer.createTransporter({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    // Configuración personalizada
    else {
      transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // Verificar configuración
    console.log('🔍 Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');

    // Configurar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'danielfuelpaz@outlook.com',
      subject: `📩 Nuevo mensaje desde el portafolio - ${nombre}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #1a1d42 0%, #2d3068 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">💼 Nuevo Contacto</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Mensaje desde tu portafolio web</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f1f3f4;">
              <h3 style="color: #1a1d42; margin: 0 0 10px 0; display: flex; align-items: center;">
                👤 Datos del Contacto
              </h3>
              <p style="margin: 5px 0; color: #555;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</p>
            </div>
            
            <div>
              <h3 style="color: #1a1d42; margin: 0 0 15px 0;">
                💬 Mensaje
              </h3>
              <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #1a1d42; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${mensaje}</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              📧 Para responder, simplemente responde a este email<br>
              🌐 Enviado desde: danielfuelpaz.com
            </p>
          </div>
        </div>
      `,
      replyTo: email
    };

    // Enviar email
    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Email enviado correctamente',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Errores más específicos para debugging
    let errorMessage = 'Error interno del servidor';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación de email. Verifica las credenciales.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Error de conexión. Verifica la configuración del servidor.';
    } else if (error.message?.includes('Invalid login')) {
      errorMessage = 'Credenciales de email inválidas.';
    } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      errorMessage = 'Variables de entorno de email no configuradas.';
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      code: error.code || 'UNKNOWN',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      envCheck: {
        emailUser: !!process.env.EMAIL_USER,
        emailPass: !!process.env.EMAIL_PASS,
        emailTo: !!process.env.EMAIL_TO
      }
    });
  }
}