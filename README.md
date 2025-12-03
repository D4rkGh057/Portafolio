# 💼 Portafolio Daniel Fuelpaz

Portafolio web profesional de Daniel Fuelpaz - FullStack Developer y Software Engineer. Sitio web moderno con diseño bento box, soporte multiidioma (Español/Inglés) y sistema de contacto integrado.

## 📖 Descripción del Proyecto

Este es un portafolio web completo que incluye:

- **🎨 Diseño moderno** con concepto "bento boxes" 
- **🌐 Multiidioma** (Español e Inglés)
- **📧 Sistema de contacto** con backend Node.js + Nodemailer
- **🚀 Optimizado para Vercel** con serverless functions
- **📱 Responsive design** compatible con dispositivos móviles
- **⚡ Animaciones** con AOS (Animate On Scroll)
- **🛡️ Protección anti-spam** con rate limiting

### 🎯 Características principales:

- Secciones: Inicio, Sobre mí, Experiencia, Proyectos, Contacto
- Galería de proyectos con filtros isotope
- Integración con redes sociales
- CV descargable
- Formulario de contacto funcional
- SEO optimizado con meta tags y JSON-LD

## 📁 Estructura de Carpetas

```
📦 Portafolio/
├── 🌐 Frontend
│   ├── index.html              # Página principal (Español)
│   ├── index-en.html           # Página en inglés
│   ├── css/
│   │   └── style.css          # Estilos principales
│   ├── js/
│   │   ├── script.js          # Scripts principales
│   │   ├── script-simple.js   # Scripts simplificados
│   │   ├── contact-form.js    # Formulario ES
│   │   ├── contact-form-en.js # Formulario EN
│   │   ├── anti-formbricks.js # Protección de formularios
│   │   ├── plugins.js         # Plugins adicionales
│   │   └── scroll-animate.js  # Animaciones de scroll
│   └── images/                # Recursos gráficos
│
├── 🔧 Backend
│   ├── server.js              # Servidor Express (desarrollo)
│   ├── api/
│   │   ├── send-email.js      # Serverless function (Vercel)
│   │   └── test.js            # Función de prueba
│   └── vercel.json            # Configuración Vercel
│
├── ⚙️ Configuración
│   ├── package.json           # Dependencias y scripts
│   ├── .env                   # Variables de entorno
│   ├── .env.example          # Ejemplo de configuración
│   └── .gitignore            # Archivos excluidos de Git
│
└── 📚 Documentación
    ├── README.md              # Este archivo
    └── DEPLOY-VERCEL.md       # Guía de deploy
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** 16 o superior
- **npm** o **yarn**
- Cuenta de **Gmail** con App Password configurado
- **Git** (opcional, para clonar el repo)

### 1. Clonar el repositorio

```bash
git clone https://github.com/D4rkGh057/Portafolio.git
cd Portafolio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
```

Completa el archivo `.env` con tus datos:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de Gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_TO=tucorreo@outlook.com

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 4. Configurar App Password de Gmail

1. Ve a [Cuenta de Google](https://myaccount.google.com/)
2. **Seguridad** → **Verificación en 2 pasos** (debe estar activada)
3. **Contraseñas de aplicaciones** → Generar
4. Selecciona **"Correo"** y **"Otro"**
5. Usa la contraseña generada en `EMAIL_PASS`

## 📦 Dependencias

### Dependencias principales (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",           // Servidor web
    "nodemailer": "^6.9.7",        // Envío de emails
    "cors": "^2.8.5",              // Control de CORS
    "dotenv": "^16.3.1",           // Variables de entorno
    "helmet": "^7.1.0",            // Headers de seguridad
    "express-rate-limit": "^7.1.5" // Rate limiting
  },
  "devDependencies": {
    "nodemon": "^3.0.2"            // Auto-restart en desarrollo
  }
}
```

### Librerías Frontend (CDN)

- **Bootstrap 5.3.2** - Framework CSS
- **Bootstrap Icons** - Iconografía  
- **AOS 2.3.4** - Animaciones on scroll
- **Swiper** - Carruseles y sliders
- **Isotope** - Filtros y layouts
- **Lightbox** - Galerías de imágenes
- **jQuery 1.11.0** - Manipulación DOM (legacy)

## ⚡ Ejecución

### Desarrollo Local

#### Opción A: Servidor Express (Tradicional)
```bash
# Desarrollo con auto-restart
npm run dev

# Producción
npm start
```

Accede a: `http://localhost:3000`

#### Opción B: Vercel CLI (Serverless)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desarrollo local con serverless functions
vercel dev
```

Accede a: `http://localhost:3000`

### Deploy en Producción

#### Vercel (Recomendado)

1. **Conectar con GitHub:**
   - Sube tu código a GitHub
   - Ve a [vercel.com](https://vercel.com)
   - Import Project → Conecta tu repo

2. **Configurar variables de entorno en Vercel:**
   ```
   Settings → Environment Variables:
   
   EMAIL_USER = tu_email@gmail.com
   EMAIL_PASS = tu_app_password  
   EMAIL_TO = danielfuelpaz@outlook.com
   ```

3. **Deploy automático** ✅

#### Otros proveedores

- **Netlify:** Compatible con adaptaciones menores
- **Railway:** Soporte para Node.js
- **Heroku:** Requiere configuración adicional

## 🧪 Pruebas

### Test local del formulario

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Prueba la API:**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Test de email
   curl -X POST http://localhost:3000/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Test User",
       "email": "test@example.com", 
       "mensaje": "Mensaje de prueba"
     }'
   ```

3. **Test desde el navegador:**
   - Abre `http://localhost:3000`
   - Ve a la sección Contacto
   - Completa y envía el formulario
   - Revisa la consola del navegador (F12)

### Debug y logs

El sistema incluye logs detallados:

```javascript
// En la consola del navegador verás:
🛡️ Anti-Formbricks protection loaded
🚀 Contact form initialized - Using backend: [URL]/api/send-email
✅ Form event listeners attached
📧 Form submitted - preventing default behavior
📤 Sending to: [URL]/api/send-email
📊 Data: {nombre: "...", email: "...", mensaje: "..."}
```

## 🛡️ Seguridad

### Protecciones implementadas

- **Rate Limiting:** 5 emails por IP cada 15 minutos
- **Validación de entrada:** Nombres, emails y mensajes
- **Sanitización HTML:** Prevención XSS
- **Headers de seguridad:** Helmet.js
- **CORS configurado:** Dominios permitidos
- **Anti-Formbricks:** Protección contra envíos accidentales

### Variables sensibles

- ✅ `.env` excluido de Git
- ✅ App Passwords en lugar de contraseñas reales
- ✅ Variables de entorno en Vercel Dashboard
- ✅ No hay API keys hardcodeadas

## 📋 Scripts Disponibles

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm test           # Placeholder para tests
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Daniel Fuelpaz**
- 🌐 Portfolio: [danielfuelpaz.com](https://danielfuelpaz.com)
- 📧 Email: danielfuelpaz@outlook.com
- 💼 LinkedIn: [daniel-fuelpaz](https://linkedin.com/in/daniel-fuelpaz)
- 🐙 GitHub: [@D4rkGh057](https://github.com/D4rkGh057)

## 🆘 Soporte y Troubleshooting

### Errores comunes

| Error | Causa | Solución |
|-------|--------|----------|
| 405 Method Not Allowed | Función serverless mal configurada | Verificar `api/send-email.js` |
| EAUTH | App Password incorrecto | Regenerar App Password de Gmail |
| CORS Error | Dominio no permitido | Agregar dominio a `ALLOWED_ORIGINS` |
| 429 Rate Limited | Demasiados envíos | Esperar 15 min o reiniciar servidor |

### Logs útiles

```bash
# Logs del servidor
npm run dev

# Logs de Vercel (producción)
vercel logs
```

### Recursos adicionales

- 📖 [Guía de Deploy en Vercel](DEPLOY-VERCEL.md)
- 📧 [Documentación Nodemailer](https://nodemailer.com/)
- 🎨 [Bootstrap Documentation](https://getbootstrap.com/)

---

⭐ **¡Si te gustó este proyecto, no olvides darle una estrella!** ⭐