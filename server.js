const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - máximo 5 emails por IP cada 15 minutos
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 requests por IP
  message: {
    error: 'Demasiados intentos de envío. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuración de Nodemailer
const createTransporter = () => {
  // Configuración para Gmail
  if (process.env.EMAIL_USER?.includes('gmail.com')) {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Configuración para Outlook/Hotmail
  if (process.env.EMAIL_USER?.includes('outlook.com') || process.env.EMAIL_USER?.includes('hotmail.com')) {
    return nodemailer.createTransporter({
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
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Función de validación de entrada
const validateInput = (nombre, email, mensaje) => {
  const errors = [];
  
  if (!nombre || nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Email inválido');
  }
  
  if (!mensaje || mensaje.trim().length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres');
  }
  
  return errors;
};

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Portfolio Contact API'
  });
});

// Endpoint principal para envío de correos
app.post('/send-email', emailLimiter, async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    
    console.log('Intento de envío de email:', { nombre, email: email?.substring(0, 5) + '***' });
    
    // Validar entrada
    const validationErrors = validateInput(nombre, email, mensaje);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: validationErrors
      });
    }
    
    // Crear transporter
    const transporter = createTransporter();
    
    // Verificar configuración
    await transporter.verify();
    console.log('Configuración de email verificada correctamente');
    
    // Configurar el email
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
                <span style="margin-right: 10px;">👤</span> Datos del Contacto
              </h3>
              <p style="margin: 5px 0; color: #555;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</p>
            </div>
            
            <div>
              <h3 style="color: #1a1d42; margin: 0 0 15px 0; display: flex; align-items: center;">
                <span style="margin-right: 10px;">💬</span> Mensaje
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
    
    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', info.messageId);
    
    res.json({
      success: true,
      message: 'Email enviado correctamente',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('Error al enviar email:', error);
    
    let errorMessage = 'Error interno del servidor';
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación de email';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión con el servidor de correo';
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? 'Sí' : 'No'}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  ADVERTENCIA: Variables de email no configuradas');
  }
});

module.exports = app;