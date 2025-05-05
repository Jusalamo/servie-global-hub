
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
  "Your message has been sent. We'll get back to you soon!": "Your message has been sent. We'll get back to you soon!",
  "services": "Services",
  "shop": "Shop",
  "about": "About",
  "contact": "Contact Us",
  "signIn": "Sign in",
  "signUp": "Sign up",
  "welcome": "Welcome to Servie",
  "sort": "Sort By",
  "price_range": "Price Range",
  "rating": "Rating",
  "categories": "Categories",
  "search": "Search",
  "all_categories": "All Categories",
  "filters": "Filters",
  "reset_filters": "Reset Filters",
  "add_to_cart": "Add to Cart",
  "buy_now": "Buy Now",
  "added_to_cart": "Added to Cart",
  "proceed_to_checkout": "Proceed to Checkout",
  "continue_shopping": "Continue Shopping",
  "newest": "Newest",
  "price_low_to_high": "Price: Low to High",
  "price_high_to_low": "Price: High to Low",
  "popularity": "Popularity",
  "rating_high_to_low": "Rating: High to Low"
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
  "Your message has been sent. We'll get back to you soon!": "¡Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto!",
  "services": "Servicios",
  "shop": "Tienda",
  "about": "Acerca de", 
  "contact": "Contáctenos",
  "signIn": "Iniciar Sesión",
  "signUp": "Registrarse",
  "welcome": "Bienvenido a Servie",
  "sort": "Ordenar Por",
  "price_range": "Rango de Precios",
  "rating": "Calificación",
  "categories": "Categorías",
  "search": "Buscar",
  "all_categories": "Todas las Categorías",
  "filters": "Filtros",
  "reset_filters": "Restablecer Filtros",
  "add_to_cart": "Añadir al Carrito",
  "buy_now": "Comprar Ahora",
  "added_to_cart": "Añadido al Carrito",
  "proceed_to_checkout": "Proceder al Pago",
  "continue_shopping": "Continuar Comprando",
  "newest": "Más Nuevo",
  "price_low_to_high": "Precio: Menor a Mayor",
  "price_high_to_low": "Precio: Mayor a Menor",
  "popularity": "Popularidad",
  "rating_high_to_low": "Calificación: Mayor a Menor"
};

// French translations
const frTranslations = {
  "Home": "Accueil",
  "Contact Support": "Contacter le Support",
  "services": "Services",
  "shop": "Boutique",
  "about": "À Propos",
  "contact": "Contactez-nous",
  "signIn": "Se Connecter",
  "signUp": "S'inscrire",
  "welcome": "Bienvenue à Servie",
  "sort": "Trier Par",
  "price_range": "Gamme de Prix",
  "rating": "Évaluation",
  "categories": "Catégories",
  "search": "Rechercher",
  "all_categories": "Toutes les Catégories",
  "filters": "Filtres",
  "reset_filters": "Réinitialiser les Filtres",
  "add_to_cart": "Ajouter au Panier",
  "buy_now": "Acheter Maintenant",
  "added_to_cart": "Ajouté au Panier",
  "proceed_to_checkout": "Procéder au Paiement",
  "continue_shopping": "Continuer les Achats",
  "newest": "Plus Récent",
  "price_low_to_high": "Prix: Croissant",
  "price_high_to_low": "Prix: Décroissant",
  "popularity": "Popularité",
  "rating_high_to_low": "Évaluation: Décroissante"
};

// German translations
const deTranslations = {
  "Home": "Startseite",
  "Contact Support": "Kontakt Support",
  "services": "Dienstleistungen",
  "shop": "Shop",
  "about": "Über uns",
  "contact": "Kontakt",
  "signIn": "Anmelden",
  "signUp": "Registrieren",
  "welcome": "Willkommen bei Servie",
  "sort": "Sortieren nach",
  "price_range": "Preisbereich",
  "rating": "Bewertung",
  "categories": "Kategorien",
  "search": "Suchen",
  "all_categories": "Alle Kategorien",
  "filters": "Filter",
  "reset_filters": "Filter zurücksetzen",
  "add_to_cart": "In den Warenkorb",
  "buy_now": "Jetzt kaufen",
  "added_to_cart": "In den Warenkorb gelegt",
  "proceed_to_checkout": "Zur Kasse",
  "continue_shopping": "Weiter einkaufen",
  "newest": "Neueste",
  "price_low_to_high": "Preis: Aufsteigend",
  "price_high_to_low": "Preis: Absteigend",
  "popularity": "Beliebtheit",
  "rating_high_to_low": "Bewertung: Absteigend"
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
      },
      fr: {
        translation: frTranslations
      },
      de: {
        translation: deTranslations
      }
    },
    lng: localStorage.getItem('preferredLanguage') ? JSON.parse(localStorage.getItem('preferredLanguage')!).code : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
