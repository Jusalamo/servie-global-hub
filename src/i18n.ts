
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  "Home": "Home",
  "Contact Support": "Contact Support",
  "Our team is ready to assist you with any questions or issues": "Our team is ready to assist you with any questions or issues",
  "Phone Support": "Phone Support",
  "Available 24/7 for urgent issues": "Available 24/7 for urgent issues",
  "Email Support": "Email Support",
  "Response within 24 hours": "Response within 24 hours",
  "Live Chat": "Live Chat",
  "Available during business hours": "Available during business hours",
  "Send us a message": "Send us a message",
  "Name": "Name",
  "Your name": "Your name",
  "Email": "Email",
  "Your email address": "Your email address",
  "Subject": "Subject",
  "What is your inquiry about?": "What is your inquiry about?",
  "Message": "Message",
  "How can we help you?": "How can we help you?",
  "Sending...": "Sending...",
  "Send Message": "Send Message",
  "Your message has been sent. We'll get back to you soon!": "Your message has been sent. We'll get back to you soon!"
};

// Spanish translations as an example
const esTranslations = {
  "Home": "Inicio",
  "Contact Support": "Contactar con Soporte",
  "Our team is ready to assist you with any questions or issues": "Nuestro equipo está listo para ayudarte con cualquier pregunta o problema",
  "Phone Support": "Soporte Telefónico",
  "Available 24/7 for urgent issues": "Disponible 24/7 para problemas urgentes",
  "Email Support": "Soporte por Correo",
  "Response within 24 hours": "Respuesta en 24 horas",
  "Live Chat": "Chat en Vivo",
  "Available during business hours": "Disponible durante horario laboral",
  "Send us a message": "Envíanos un mensaje",
  "Name": "Nombre",
  "Your name": "Tu nombre",
  "Email": "Correo electrónico",
  "Your email address": "Tu dirección de correo",
  "Subject": "Asunto",
  "What is your inquiry about?": "¿Sobre qué es tu consulta?",
  "Message": "Mensaje",
  "How can we help you?": "¿Cómo podemos ayudarte?",
  "Sending...": "Enviando...",
  "Send Message": "Enviar Mensaje",
  "Your message has been sent. We'll get back to you soon!": "¡Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto!"
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
