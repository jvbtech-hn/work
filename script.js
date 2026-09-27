// ============ Menú móvil ============
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ============ Año dinámico en el footer ============
document.querySelectorAll('.year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============ Asistente (respuestas guiadas, no IA real) ============
// Nota para el dueño del sitio: este asistente responde con reglas fijas.
// Para respuestas realmente generadas por IA se necesita un servidor propio
// que llame a la API de forma segura (la llave nunca puede vivir en el navegador).
const WHATSAPP_NUMBER = '504XXXXXXXX';

const ASSISTANT_ANSWERS = {
  precios: 'Cada trabajo se cotiza según el equipo o el proyecto — no cobramos nada sin darte un precio claro primero. Cuéntanos qué necesitas y te respondemos con un estimado.',
  horarios: 'Normalmente respondemos el mismo día. Escríbenos por WhatsApp y coordinamos la hora que te acomode.',
  servicios: 'Damos soporte técnico a laptops y PC, y desarrollamos páginas web y software a la medida. Puedes ver el detalle completo en la sección Productos.',
  humano: 'Con gusto, te paso directo con el equipo por WhatsApp:'
};

const FALLBACK_ANSWER = 'Puedo orientarte con precios, horarios o servicios. Para algo más específico, lo mejor es escribirnos directo:';

const assistantToggle = document.getElementById('assistantToggle');
const assistantPanel = document.getElementById('assistantPanel');
const assistantMessages = document.getElementById('assistantMessages');
const assistantChips = document.getElementById('assistantChips');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const assistantClose = document.getElementById('assistantClose');

function openAssistant() {
  assistantPanel.removeAttribute('hidden');
  assistantToggle.setAttribute('aria-expanded', 'true');
  assistantInput && assistantInput.focus();
}

function closeAssistant() {
  assistantPanel.setAttribute('hidden', '');
  assistantToggle.setAttribute('aria-expanded', 'false');
}

function addMessage(text, from) {
  const bubble = document.createElement('div');
  bubble.className = `assistant__msg assistant__msg--${from}`;
  bubble.textContent = text;
  assistantMessages.appendChild(bubble);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return bubble;
}

function addWhatsAppLink(bubble) {
  const link = document.createElement('a');
  link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'assistant__wa-link';
  link.textContent = 'Abrir WhatsApp →';
  bubble.after(link);
}

function answerFor(key) {
  return ASSISTANT_ANSWERS[key] || FALLBACK_ANSWER;
}

function matchKeyword(text) {
  const t = text.toLowerCase();
  if (t.includes('precio') || t.includes('cuesta') || t.includes('cotiza')) return 'precios';
  if (t.includes('horario') || t.includes('hora') || t.includes('abierto')) return 'horarios';
  if (t.includes('servicio') || t.includes('ofrece') || t.includes('hacen')) return 'servicios';
  if (t.includes('humano') || t.includes('persona') || t.includes('alguien')) return 'humano';
  return null;
}

if (assistantToggle && assistantPanel) {
  assistantToggle.addEventListener('click', () => {
    const isHidden = assistantPanel.hasAttribute('hidden');
    isHidden ? openAssistant() : closeAssistant();
  });
}

if (assistantClose) {
  assistantClose.addEventListener('click', closeAssistant);
}

// Cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && assistantPanel && !assistantPanel.hasAttribute('hidden')) {
    closeAssistant();
  }
});

if (assistantChips) {
  assistantChips.addEventListener('click', (e) => {
    const key = e.target.dataset && e.target.dataset.q;
    if (!key) return;
    addMessage(e.target.textContent, 'user');
    const bubble = addMessage(answerFor(key), 'bot');
    if (key === 'humano') addWhatsAppLink(bubble);
  });
}

if (assistantForm) {
  assistantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = assistantInput.value.trim();
    if (!value) return;
    addMessage(value, 'user');
    const key = matchKeyword(value);
    const bubble = addMessage(answerFor(key), 'bot');
    if (!key) addWhatsAppLink(bubble);
    assistantInput.value = '';
  });
}