import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Saludos, Ciber-Tech! Soy VoltBot 🤖. ¿En qué puedo asistirte hoy?',
      options: [
        '¿Cuáles son las modificaciones más populares?',
        '¿Cuánto tiempo tarda un mod personalizado?',
        '¿Ofrecen garantía en los trabajos?',
      ],
    },
  ]);

  const handleOptionClick = (optionText) => {
    let reply = '';
    if (optionText.includes('populares')) {
      reply = '⭐ Los kits IPS para Game Boy Color y los Joysticks Hall Effect anti-drift para DualSense PS5 son nuestros top sellers.';
    } else if (optionText.includes('tiempo')) {
      reply = '⏱ El tiempo varía entre 2 y 5 días hábiles según la complejidad del mod.';
    } else {
      reply = '✅ Todas nuestras customizaciones incluyen 6 meses de garantía en mano de obra y componentes instalados.';
    }
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: optionText },
      { sender: 'bot', text: reply },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'bot', text: '📩 Gracias por tu mensaje. Un técnico especializado revisará tu consulta pronto. También puedes usar el Cotizador interactivo.' },
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen ? (
        <button className="chatbot-btn-toggle" onClick={() => setIsOpen(true)}>
          ⚡ VoltBot Asistente
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>⚡ VOLTBOT // TECH-GARAGE</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`msg ${m.sender}`}>
                {m.text}
                {m.options && (
                  <div className="bot-options">
                    {m.options.map((opt, oIdx) => (
                      <button key={oIdx} onClick={() => handleOptionClick(opt)}>
                        ▸ {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form className="chatbot-footer" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Escribe tu duda..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
