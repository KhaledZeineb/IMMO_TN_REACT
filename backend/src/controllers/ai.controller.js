const axios = require('axios');
const db = require('../config/database');

// Smart fallback responses based on keywords
const generateSmartResponse = (message, language = 'fr') => {
  const messageLower = message.toLowerCase();
  
  // Responses in French
  const responses = {
    greeting: "Bonjour! 👋 Je suis ravi de vous aider. Je peux vous aider à trouver des propriétés, estimer des prix, ou répondre à vos questions sur l'immobilier en Tunisie.",
    search: "Pour rechercher une propriété, vous pouvez filtrer par type (appartement, villa, studio), par ville (Tunis, Sousse, Sfax...), ou par budget. Utilisez la page d'accueil pour parcourir toutes les annonces disponibles! 🏠",
    price: "Les prix varient selon la localisation et le type de bien:\n\n🏙️ Tunis Centre: 2000-3000 TND/m²\n🏖️ La Marsa: 2500-4000 TND/m²\n🌊 Gammarth: 3000-5000 TND/m²\n\nPour une estimation précise, consultez les annonces similaires sur l'application!",
    location: "Les zones les plus recherchées en Tunisie:\n\n⭐ La Marsa - Bord de mer\n⭐ Les Berges du Lac - Moderne\n⭐ La Soukra - Résidentiel\n⭐ Ennasr - Accessible\n⭐ Gammarth - Luxe",
    investment: "Investir dans l'immobilier tunisien est intéressant! 📈\n\nPoints clés:\n✅ Marché stable\n✅ Demande locative forte\n✅ Potentiel de valorisation\n\nConseil: Privilégiez les zones bien desservies et en développement.",
    rent: "Pour la location, considérez:\n\n📍 Localisation (proximité des commodités)\n💰 Prix du marché\n📝 Contrat de bail légal\n🔑 État du bien\n\nLes locations meublées sont très demandées!",
    default: "Je peux vous aider avec:\n\n🏠 Recherche de propriétés\n💰 Estimation de prix\n📍 Informations sur les quartiers\n📊 Conseils d'investissement\n📝 Processus de location/achat\n\nQue souhaitez-vous savoir?"
  };
  
  // Keyword matching
  if (messageLower.match(/bonjour|salut|hello|hi|hey/)) {
    return responses.greeting;
  }
  if (messageLower.match(/cherch|recherch|trouv|appartement|villa|maison|studio/)) {
    return responses.search;
  }
  if (messageLower.match(/prix|co[uû]t|budget|cher/)) {
    return responses.price;
  }
  if (messageLower.match(/quartier|zone|localisation|où|endroit|ville/)) {
    return responses.location;
  }
  if (messageLower.match(/invest|acheter|achat|rentab/)) {
    return responses.investment;
  }
  if (messageLower.match(/louer|location|locataire|bail/)) {
    return responses.rent;
  }
  
  return responses.default;
};

// AI Chat with OpenAI
exports.chat = async (req, res) => {
  try {
    const { message, language = 'fr' } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Try OpenAI if API key is configured
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const systemPrompt = language === 'ar'
          ? 'أنت مساعد ذكي لتطبيق عقارات تونسي اسمه IMMO_TN. ساعد المستخدمين في العثور على العقارات والإجابة على أسئلتهم حول العقارات في تونس.'
          : 'Tu es un assistant intelligent pour une application immobilière tunisienne appelée IMMO_TN. Aide les utilisateurs à trouver des propriétés et réponds à leurs questions sur l\'immobilier en Tunisie. Sois concis et utile.';

        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        const aiResponse = response.data.choices[0].message.content;
        return res.json({ response: aiResponse });
      } catch (error) {
        console.log('OpenAI not available, using fallback');
      }
    }
    
    // Fallback to smart responses
    const response = generateSmartResponse(message, language);
    res.json({ response });

  } catch (error) {
    console.error('AI chat error:', error.message);
    
    // Final fallback
    const { language = 'fr', message: userMessage } = req.body;
    const response = generateSmartResponse(userMessage || '', language);
    res.json({ response });
  }
};

// Get AI suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = {
      fr: [
        'Rechercher un appartement à Tunis',
        'Propriétés à vendre',
        'Locations saisonnières',
        'Maisons avec jardin',
        'Prix moyen à Sousse'
      ],
      ar: [
        'البحث عن شقة في تونس',
        'عقارات للبيع',
        'إيجارات موسمية',
        'منازل بحديقة',
        'السعر المتوسط في سوسة'
      ]
    };

    const { language = 'fr' } = req.query;
    res.json({ suggestions: suggestions[language] || suggestions.fr });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
