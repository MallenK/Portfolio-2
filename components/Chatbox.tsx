
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioContent } from '../types';
import { useCheats } from '../context/CheatContext';

interface Props {
  lang: 'es' | 'en' | 'cat';
  content: PortfolioContent;
}

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

// --- KNOWLEDGE BASE OBLIGATORIA ---
const PORTFOLIO_KNOWLEDGE = {
  profile: {
    name: "Sergi Mallén",
    role: "Full Stack Engineer & AI Integrator",
    location: "Barcelona (Colònia Güell)",
    focus: "Enterprise Scalable Products & Automation"
  },
  projects: [
    { name: "JP Preparation", key: "jpprep", tech: "React, TypeScript, PHP, CodeIgniter 4", desc: "Web y plataforma de gestión para escuela de fútbol." },
    { name: "Myker Academy", key: "myker", tech: "React, TypeScript, Tailwind, SEO", desc: "Web corporativa EdTech." },
    { name: "Cro&Txet", key: "crotxet", tech: "React, TypeScript, Tailwind, Vercel", desc: "E-commerce de bolsos hechos a mano." },
    { name: "Schneider Electric", key: "schneider", tech: "PHP, CodeIgniter, MySQL, Docker", desc: "Plataforma industrial crítica." },
    { name: "Project Architecture Planner", key: "ai", tech: "GPT, OpenAI", desc: "Asistente de arquitectura de software con IA." }
  ],
  stack: {
    frontend: "React, TypeScript, Tailwind, GSAP, Next.js",
    backend: "Node.js, PHP, SQL, Supabase",
    ai: "LLM Integration, Prompt Engineering, Automation"
  }
};

const JOKES = {
  es: [
    "¿Por qué los programadores confunden Halloween con Navidad? Porque Oct 31 == Dec 25. 🎃🎄",
    "¿Qué le dice un bit al otro? Nos vemos en el bus. 🚌",
    "Hay 10 tipos de personas: las que saben binario y las que no. 01",
    "¿Por qué Java usa gafas? Porque no ve C#. 🤓"
  ],
  en: [
    "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem. 💡",
    "A SQL query walks into a bar, walks up to two tables and asks: Can I join you? 🍻",
    "Why did the developer go broke? Because he used up all his cache. 💸"
  ],
  cat: [
    "Què fa un informàtic quan té fred? Es posa al costat de la finestra (Windows). 🪟",
    "Per què els programadors no van a la platja? Perquè tenen por dels 'bugs' de sorra. 🏖️",
    "Saps el millor de ser desenvolupador? Que pots resoldre problemes que ningú sap que existeixen. 🧠",
    "Quin és l'animal preferit d'un programador? El Python. 🐍"
  ]
};

const Chatbox: React.FC<Props> = ({ lang, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Contexto para respuestas inteligentes
  const { currentMode } = useCheats();

  useEffect(() => {
    setMounted(true);
    console.log('[UI Floating] Chatbot mounted & portal ready');
  }, []);

  // --- WELCOME MESSAGE WITH JOKE (OBLIGATORIO) ---
  useEffect(() => {
    // Resetear mensajes al cambiar idioma para saludar correctamente
    const randomJoke = JOKES[lang][Math.floor(Math.random() * JOKES[lang].length)];
    const greeting = lang === 'en' ? "Hi! I'm MallenK's virtual assistant." : "¡Hola! Soy el asistente virtual de MallenK.";
    
    setMessages([{
      id: 'init',
      sender: 'bot',
      text: `${greeting} ${randomJoke}`
    }]);
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // --- BRAIN: INTENT & CONTEXT DETECTION ---
    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      let response = "";
      
      // Context Awareness: URL Hash / Section
      const currentSection = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
      const modeSuffix = currentMode === 'retro' ? " (Processing via Legacy CLI... 📟)" : 
                         currentMode === 'future' ? " (AI Core Online ⚡)" : "";

      // INTENT 1: IDENTITY / WHO
      if (lowerInput.includes('who') || lowerInput.includes('quien') || lowerInput.includes('qui')) {
        response = lang === 'en'
          ? `I am the logic behind ${PORTFOLIO_KNOWLEDGE.profile.name}. He is a ${PORTFOLIO_KNOWLEDGE.profile.role} based in ${PORTFOLIO_KNOWLEDGE.profile.location}.`
          : `Soy la lógica detrás de ${PORTFOLIO_KNOWLEDGE.profile.name}. Es un ${PORTFOLIO_KNOWLEDGE.profile.role} ubicado en ${PORTFOLIO_KNOWLEDGE.profile.location}.`;
      }
      
      // INTENT 2: STACK / TECH
      else if (lowerInput.includes('stack') || lowerInput.includes('tech') || lowerInput.includes('tecnología') || lowerInput.includes('react')) {
        response = lang === 'en'
          ? `Solid architecture: Frontend (${PORTFOLIO_KNOWLEDGE.stack.frontend}), Backend (${PORTFOLIO_KNOWLEDGE.stack.backend}) and heavy focus on ${PORTFOLIO_KNOWLEDGE.stack.ai}.`
          : `Arquitectura sólida: Frontend (${PORTFOLIO_KNOWLEDGE.stack.frontend}), Backend (${PORTFOLIO_KNOWLEDGE.stack.backend}) y mucho foco en ${PORTFOLIO_KNOWLEDGE.stack.ai}.`;
      }
      
      // INTENT 3: PROJECTS (Context Aware)
      else if (lowerInput.includes('project') || lowerInput.includes('proyecto') || lowerInput.includes('trabajo') || lowerInput.includes('work')) {
        if (currentSection === 'projects') {
          response = lang === 'en'
            ? "You are looking at them right now! My favorite is Schneider Electric (Enterprise) and AI Exam Assistant (Innovation)."
            : "¡Los estás viendo ahora mismo! Mi favorito es Schneider Electric (Enterprise) y AI Exam Assistant (Innovación).";
        } else {
          response = lang === 'en'
            ? `Check the Projects section. Highlights: ${PORTFOLIO_KNOWLEDGE.projects[0].name} (${PORTFOLIO_KNOWLEDGE.projects[0].tech}) and ${PORTFOLIO_KNOWLEDGE.projects[3].name}.`
            : `Mira la sección Proyectos. Destacados: ${PORTFOLIO_KNOWLEDGE.projects[0].name} (${PORTFOLIO_KNOWLEDGE.projects[0].tech}) y ${PORTFOLIO_KNOWLEDGE.projects[3].name}.`;
        }
      }
      
      // INTENT 4: CONTACT
      else if (lowerInput.includes('contact') || lowerInput.includes('mail') || lowerInput.includes('email') || lowerInput.includes('contratar') || lowerInput.includes('hire')) {
        response = lang === 'en' 
          ? "Best way to reach Sergi: sergimallenweb@gmail.com. He usually replies within 24h." 
          : "La mejor forma de contactar a Sergi: sergimallenweb@gmail.com. Suele responder en 24h.";
      }
      
      // INTENT 5: JOKE
      else if (lowerInput.includes('joke') || lowerInput.includes('chiste') || lowerInput.includes('acudit')) {
        response = JOKES[lang][Math.floor(Math.random() * JOKES[lang].length)];
      }
      
      // DEFAULT / FALLBACK
      else {
        response = lang === 'en'
          ? "My neural network is trained for tech queries. Ask me about: Stack, Projects, Experience or Contact!"
          : "Mi red neuronal está entrenada para consultas técnicas. Pregúntame sobre: Stack, Proyectos, Experiencia o Contacto.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: response + modeSuffix }]);
    }, 600);
  };

  const floatingChat = (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans pointer-events-auto">
      {/* Floating Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white text-black rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center font-bold border border-zinc-200 hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 0 }}
            animate={{ opacity: 1, y: -16, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 right-0 w-[85vw] md:w-96 h-[400px] bg-[#0B0B0B] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-white">MallenK Bot {currentMode !== 'normal' && `[${currentMode.toUpperCase()}]`}</span>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 scrollbar-hide">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-[#F5C400] text-black rounded-tr-none font-medium' 
                      : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-zinc-900 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'en' ? "Ask about projects..." : "Pregunta sobre proyectos..."}
                className="flex-1 bg-black text-white text-xs rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-[#F5C400] border border-white/10 placeholder:text-white/20"
              />
              <button onClick={handleSend} className="w-10 h-10 bg-[#F5C400] text-black rounded-full flex items-center justify-center font-bold hover:bg-white transition-colors">
                ➜
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return mounted ? ReactDOM.createPortal(floatingChat, document.body) : null;
};

export default Chatbox;
