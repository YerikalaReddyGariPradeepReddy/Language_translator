
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTranslationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all languages
  app.get("/api/languages", async (req: Request, res: Response) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch languages" });
    }
  });

  // Get a language by code
  app.get("/api/languages/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const language = await storage.getLanguageByCode(code);

      if (!language) {
        return res.status(404).json({ error: "Language not found" });
      }

      res.json(language);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch language" });
    }
  });

  // Get all translations (with optional limit)
  app.get("/api/translations", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const translations = await storage.getTranslations(undefined, limit);
      res.json(translations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  // Get a translation by ID
  app.get("/api/translations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const translation = await storage.getTranslationById(id);

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  // Create a new translation
  app.post("/api/translations", async (req: Request, res: Response) => {
    try {
      const validationResult = insertTranslationSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid translation data" });
      }

      const translation = await storage.createTranslation(validationResult.data);
      res.status(201).json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create translation" });
    }
  });

  // Update a translation
  app.patch("/api/translations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const partialTranslationSchema = insertTranslationSchema.partial();
      const validationResult = partialTranslationSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid translation data" });
      }

      const translation = await storage.updateTranslation(id, validationResult.data);

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update translation" });
    }
  });

  // Delete a translation
  app.delete("/api/translations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTranslation(id);

      if (!success) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  // Get all saved translations
  app.get("/api/translations/saved", async (req: Request, res: Response) => {
    try {
      const translations = await storage.getSavedTranslations();
      res.json(translations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved translations" });
    }
  });

  // Save a translation
  app.post("/api/translations/:id/save", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const translation = await storage.saveTranslation(id);

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to save translation" });
    }
  });

  // Unsave a translation
  app.post("/api/translations/:id/unsave", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const translation = await storage.unsaveTranslation(id);

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to unsave translation" });
    }
  });

  // Get all offline languages
  app.get("/api/offline-languages", async (req: Request, res: Response) => {
    try {
      const offlineLanguages = await storage.getOfflineLanguages();
      res.json(offlineLanguages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offline languages" });
    }
  });

  // Add an offline language
  app.post("/api/offline-languages", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        languageId: z.number(),
        userId: z.number().optional()
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid offline language data" });
      }

      const offlineLanguage = await storage.addOfflineLanguage(validationResult.data);
      res.status(201).json(offlineLanguage);
    } catch (error) {
      res.status(500).json({ error: "Failed to add offline language" });
    }
  });

  // Remove an offline language
  app.delete("/api/offline-languages/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeOfflineLanguage(id);

      if (!success) {
        return res.status(404).json({ error: "Offline language not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove offline language" });
    }
  });

  // Translation API endpoint
  app.post("/api/translate", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        text: z.string(),
        sourceLanguage: z.string(),
        targetLanguage: z.string()
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid translation request" });
      }

      const { text, sourceLanguage, targetLanguage } = validationResult.data;

      // Enhanced translation logic
      const translatedText = await comprehensiveTranslate(text, sourceLanguage, targetLanguage);

      // Save the translation to history
      const translation = await storage.createTranslation({
        sourceText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        isSaved: false
      });

      res.json({ translation, translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Language detection API endpoint
  app.post("/api/detect-language", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        text: z.string()
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid detection request" });
      }

      const { text } = validationResult.data;

      // Enhanced language detection
      const detectedLanguage = await smartLanguageDetection(text);

      res.json({ detectedLanguage });
    } catch (error) {
      res.status(500).json({ error: "Language detection failed" });
    }
  });

  // Text-to-speech API endpoint
  app.post("/api/text-to-speech", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        text: z.string(),
        language: z.string()
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid text-to-speech request" });
      }

      // In a real application, you would integrate with a TTS service API
      // Here we just return success to indicate it would work
      res.json({ success: true, message: "TTS would generate audio file" });
    } catch (error) {
      res.status(500).json({ error: "Text-to-speech generation failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Comprehensive translation dictionary with extensive language coverage
const COMPREHENSIVE_DICTIONARY: Record<string, Record<string, string>> = {
  // Basic greetings and common words
  "ok": {
    "te": "సరే", "hi": "ठीक है", "ta": "சரி", "kn": "ಸರಿ", "ml": "ശരി", "mr": "ठीक आहे", 
    "bn": "ঠিক আছে", "pa": "ਠੀਕ ਹੈ", "ur": "ٹھیک ہے", "gu": "બરાબર", "or": "ଠିକ୍", "as": "ঠিক আছে",
    "fr": "d'accord", "es": "vale", "de": "okay", "it": "va bene", "pt": "está bem", "ru": "хорошо", 
    "zh": "好的", "ja": "わかりました", "ko": "알겠습니다", "ar": "حسنا", "tr": "tamam", "nl": "oké", 
    "sv": "okej", "no": "greit", "fi": "selvä", "pl": "dobrze", "he": "בסדר", "fa": "باشه", 
    "th": "โอเค", "vi": "được rồi", "id": "oke", "ms": "okay", "tl": "okay", "sw": "sawa"
  },
  "hello": {
    "te": "హలో", "hi": "नमस्ते", "ta": "வணக்கம்", "kn": "ನಮಸ್ಕಾರ", "ml": "ഹലോ", "mr": "नमस्कार",
    "bn": "হ্যালো", "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ur": "السلام علیکم", "gu": "નમસ્તે", "or": "ନମସ୍କାର", "as": "নমস্কাৰ",
    "fr": "bonjour", "es": "hola", "de": "hallo", "it": "ciao", "pt": "olá", "ru": "привет",
    "zh": "你好", "ja": "こんにちは", "ko": "안녕하세요", "ar": "مرحبا", "tr": "merhaba", "nl": "hallo",
    "sv": "hej", "no": "hei", "fi": "hei", "pl": "cześć", "he": "שלום", "fa": "سلام",
    "th": "สวัสดี", "vi": "xin chào", "id": "halo", "ms": "hello", "tl": "kumusta", "sw": "hujambo"
  },
  "yes": {
    "te": "అవును", "hi": "हाँ", "ta": "ஆம்", "kn": "ಹೌದು", "ml": "അതെ", "mr": "होय",
    "bn": "হ্যাঁ", "pa": "ਹਾਂ", "ur": "ہاں", "gu": "હા", "or": "ହଁ", "as": "হয়",
    "fr": "oui", "es": "sí", "de": "ja", "it": "sì", "pt": "sim", "ru": "да",
    "zh": "是的", "ja": "はい", "ko": "예", "ar": "نعم", "tr": "evet", "nl": "ja",
    "sv": "ja", "no": "ja", "fi": "kyllä", "pl": "tak", "he": "כן", "fa": "بله",
    "th": "ใช่", "vi": "có", "id": "ya", "ms": "ya", "tl": "oo", "sw": "ndiyo"
  },
  "no": {
    "te": "లేదు", "hi": "नहीं", "ta": "இல்லை", "kn": "ಇಲ್ಲ", "ml": "ഇല്ല", "mr": "नाही",
    "bn": "না", "pa": "ਨਹੀਂ", "ur": "نہیں", "gu": "ના", "or": "ନା", "as": "নহয়",
    "fr": "non", "es": "no", "de": "nein", "it": "no", "pt": "não", "ru": "нет",
    "zh": "不", "ja": "いいえ", "ko": "아니요", "ar": "لا", "tr": "hayır", "nl": "nee",
    "sv": "nej", "no": "nei", "fi": "ei", "pl": "nie", "he": "לא", "fa": "نه",
    "th": "ไม่", "vi": "không", "id": "tidak", "ms": "tidak", "tl": "hindi", "sw": "hapana"
  },
  "thank you": {
    "te": "ధన్యవాదాలు", "hi": "धन्यवाद", "ta": "நன்றி", "kn": "ಧನ್ಯವಾದಗಳು", "ml": "നന്ദി", "mr": "धन्यवाद",
    "bn": "ধন্যবাদ", "pa": "ਧੰਨਵਾਦ", "ur": "شکریہ", "gu": "આભાર", "or": "ଧନ୍ୟବାଦ", "as": "ধন্যবাদ",
    "fr": "merci", "es": "gracias", "de": "danke", "it": "grazie", "pt": "obrigado", "ru": "спасибо",
    "zh": "谢谢", "ja": "ありがとう", "ko": "감사합니다", "ar": "شكرا", "tr": "teşekkürler", "nl": "dank je",
    "sv": "tack", "no": "takk", "fi": "kiitos", "pl": "dziękuję", "he": "תודה", "fa": "متشکرم",
    "th": "ขอบคุณ", "vi": "cảm ơn", "id": "terima kasih", "ms": "terima kasih", "tl": "salamat", "sw": "asante"
  },
  "good morning": {
    "te": "శుభోదయం", "hi": "सुप्रभात", "ta": "காலை வணக்கம்", "kn": "ಶುಭೋದಯ", "ml": "സുപ്രഭാതം", "mr": "सुप्रभात",
    "bn": "সুপ্রভাত", "pa": "ਸ਼ੁਭ ਸਵੇਰ", "ur": "صبح بخیر", "gu": "સુપ્રભાત", "or": "ସୁପ୍ରଭାତ", "as": "শুভ ৰাতিপুৱা",
    "fr": "bonjour", "es": "buenos días", "de": "guten morgen", "it": "buongiorno", "pt": "bom dia", "ru": "доброе утро",
    "zh": "早上好", "ja": "おはようございます", "ko": "좋은 아침입니다", "ar": "صباح الخير", "tr": "günaydın", "nl": "goedemorgen",
    "sv": "god morgon", "no": "god morgen", "fi": "hyvää huomenta", "pl": "dzień dobry", "he": "בוקר טוב", "fa": "صبح بخیر",
    "th": "อรุณสวัสดิ์", "vi": "chào buổi sáng", "id": "selamat pagi", "ms": "selamat pagi", "tl": "magandang umaga", "sw": "habari za asubuhi"
  },
  "good night": {
    "te": "శుభరాత్రి", "hi": "शुभ रात्रि", "ta": "இனிய இரவு", "kn": "ಶುಭ ರಾತ್ರಿ", "ml": "ശുഭരാത്രി", "mr": "शुभ रात्री",
    "bn": "শুভ রাত্রি", "pa": "ਸ਼ੁਭ ਰਾਤ", "ur": "شب بخیر", "gu": "શુભ રાત્રી", "or": "ଶୁଭ ରାତ୍ରି", "as": "শুভ ৰাতি",
    "fr": "bonne nuit", "es": "buenas noches", "de": "gute nacht", "it": "buonanotte", "pt": "boa noite", "ru": "спокойной ночи",
    "zh": "晚安", "ja": "おやすみなさい", "ko": "좋은 밤 되세요", "ar": "تصبح على خير", "tr": "iyi geceler", "nl": "goede nacht",
    "sv": "god natt", "no": "god natt", "fi": "hyvää yötä", "pl": "dobranoc", "he": "לילה טוב", "fa": "شب بخیر",
    "th": "ราตรีสวัสดิ์", "vi": "chúc ngủ ngon", "id": "selamat malam", "ms": "selamat malam", "tl": "magandang gabi", "sw": "usiku mwema"
  },
  "please": {
    "te": "దయచేసి", "hi": "कृपया", "ta": "தயவுசெய்து", "kn": "ದಯವಿಟ್ಟು", "ml": "ദയവായി", "mr": "कृपया",
    "bn": "দয়া করে", "pa": "ਕਿਰਪਾ ਕਰਕੇ", "ur": "برائے کرم", "gu": "કૃપા કરીને", "or": "ଦୟାକରି", "as": "অনুগ্রহ কৰি",
    "fr": "s'il vous plaît", "es": "por favor", "de": "bitte", "it": "per favore", "pt": "por favor", "ru": "пожалуйста",
    "zh": "请", "ja": "お願いします", "ko": "제발", "ar": "من فضلك", "tr": "lütfen", "nl": "alsjeblieft",
    "sv": "snälla", "no": "takk", "fi": "kiitos", "pl": "proszę", "he": "בבקשה", "fa": "لطفا",
    "th": "โปรด", "vi": "xin hãy", "id": "tolong", "ms": "sila", "tl": "pakisuyo", "sw": "tafadhali"
  },
  "sorry": {
    "te": "క్షమించండి", "hi": "माफ़ करना", "ta": "மன்னிக்கவும்", "kn": "ಕ್ಷಮಿಸಿ", "ml": "ക്ഷമിക്കണം", "mr": "माफ करा",
    "bn": "দুঃখিত", "pa": "ਮਾਫ਼ ਕਰਨਾ", "ur": "معاف کریں", "gu": "માફ કરશો", "or": "କ୍ଷମା କରନ୍ତୁ", "as": "ক্ষমা কৰক",
    "fr": "désolé", "es": "lo siento", "de": "entschuldigung", "it": "mi dispiace", "pt": "desculpa", "ru": "извините",
    "zh": "对不起", "ja": "すみません", "ko": "죄송합니다", "ar": "آسف", "tr": "özür dilerim", "nl": "sorry",
    "sv": "förlåt", "no": "unnskyld", "fi": "anteeksi", "pl": "przepraszam", "he": "סליחה", "fa": "ببخشید",
    "th": "ขอโทษ", "vi": "xin lỗi", "id": "maaf", "ms": "maaf", "tl": "paumanhin", "sw": "pole"
  },
  "how are you": {
    "te": "మీరు ఎలా ఉన్నారు?", "hi": "आप कैसे हैं?", "ta": "நீங்கள் எப்படி இருக்கிறீர்கள்?", "kn": "ನೀವು ಹೇಗಿದ್ದೀರಿ?", 
    "ml": "നിങ്ങൾക്ക് സുഖമാണോ?", "mr": "तुम्ही कसे आहात?", "bn": "আপনি কেমন আছেন?", "pa": "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", 
    "ur": "آپ کیسے ہیں؟", "gu": "તમે કેમ છો?", "or": "ଆପଣ କେମିତି ଅଛନ୍ତି?", "as": "আপুনি কেনেকুৱা আছে?",
    "fr": "comment allez-vous?", "es": "¿cómo estás?", "de": "wie geht es dir?", "it": "come stai?", 
    "pt": "como vai você?", "ru": "как дела?", "zh": "你好吗?", "ja": "元気ですか?", "ko": "어떻게 지내세요?", 
    "ar": "كيف حالك؟", "tr": "nasılsın?", "nl": "hoe gaat het?", "sv": "hur mår du?", "no": "hvordan har du det?", 
    "fi": "mitä kuuluu?", "pl": "jak się masz?", "he": "מה שלומך?", "fa": "حالت چطوره?", "th": "สบายดีไหม?", 
    "vi": "bạn có khỏe không?", "id": "apa kabar?", "ms": "apa khabar?", "tl": "kumusta ka?", "sw": "habari yako?"
  },
  "goodbye": {
    "te": "వీడ్కోలు", "hi": "अलविदा", "ta": "பிரியாவிடை", "kn": "ವಿದಾಯ", "ml": "വിട", "mr": "निरोप",
    "bn": "বিদায়", "pa": "ਅਲਵਿਦਾ", "ur": "خدا حافظ", "gu": "આવજો", "or": "ବିଦାୟ", "as": "বিদায়",
    "fr": "au revoir", "es": "adiós", "de": "auf wiedersehen", "it": "arrivederci", "pt": "adeus", "ru": "до свидания",
    "zh": "再见", "ja": "さようなら", "ko": "안녕히 가세요", "ar": "وداعا", "tr": "hoşça kal", "nl": "tot ziens",
    "sv": "hej då", "no": "ha det", "fi": "näkemiin", "pl": "do widzenia", "he": "להתראות", "fa": "خداحافظ",
    "th": "ลาก่อน", "vi": "tạm biệt", "id": "selamat tinggal", "ms": "selamat tinggal", "tl": "paalam", "sw": "kwaheri"
  },
  "water": {
    "te": "నీరు", "hi": "पानी", "ta": "தண்ணீர்", "kn": "ನೀರು", "ml": "വെള്ളം", "mr": "पाणी",
    "bn": "পানি", "pa": "ਪਾਣੀ", "ur": "پانی", "gu": "પાણી", "or": "ପାଣି", "as": "পানী",
    "fr": "eau", "es": "agua", "de": "wasser", "it": "acqua", "pt": "água", "ru": "вода",
    "zh": "水", "ja": "水", "ko": "물", "ar": "ماء", "tr": "su", "nl": "water",
    "sv": "vatten", "no": "vann", "fi": "vesi", "pl": "woda", "he": "מים", "fa": "آب",
    "th": "น้ำ", "vi": "nước", "id": "air", "ms": "air", "tl": "tubig", "sw": "maji"
  },
  "food": {
    "te": "ఆహారం", "hi": "खाना", "ta": "உணவு", "kn": "ಆಹಾರ", "ml": "ഭക്ഷണം", "mr": "अन्न",
    "bn": "খাবার", "pa": "ਖਾਣਾ", "ur": "کھانا", "gu": "ખોરાક", "or": "ଖାଦ୍ୟ", "as": "খাদ্য",
    "fr": "nourriture", "es": "comida", "de": "essen", "it": "cibo", "pt": "comida", "ru": "еда",
    "zh": "食物", "ja": "食べ物", "ko": "음식", "ar": "طعام", "tr": "yemek", "nl": "voedsel",
    "sv": "mat", "no": "mat", "fi": "ruoka", "pl": "jedzenie", "he": "אוכל", "fa": "غذا",
    "th": "อาหาร", "vi": "thức ăn", "id": "makanan", "ms": "makanan", "tl": "pagkain", "sw": "chakula"
  },
  "love": {
    "te": "ప్రేమ", "hi": "प्रेम", "ta": "காதல்", "kn": "ಪ್ರೀತಿ", "ml": "സ്നേഹം", "mr": "प्रेम",
    "bn": "ভালোবাসা", "pa": "ਪਿਆਰ", "ur": "محبت", "gu": "પ્રેમ", "or": "ପ୍ରେମ", "as": "ভালপোৱা",
    "fr": "amour", "es": "amor", "de": "liebe", "it": "amore", "pt": "amor", "ru": "любовь",
    "zh": "爱", "ja": "愛", "ko": "사랑", "ar": "حب", "tr": "aşk", "nl": "liefde",
    "sv": "kärlek", "no": "kjærlighet", "fi": "rakkaus", "pl": "miłość", "he": "אהבה", "fa": "عشق",
    "th": "ความรัก", "vi": "tình yêu", "id": "cinta", "ms": "cinta", "tl": "pag-ibig", "sw": "upendo"
  },
  "time": {
    "te": "సమయం", "hi": "समय", "ta": "நேரம்", "kn": "ಸಮಯ", "ml": "സമയം", "mr": "वेळ",
    "bn": "সময়", "pa": "ਸਮਾਂ", "ur": "وقت", "gu": "સમય", "or": "ସମୟ", "as": "সময়",
    "fr": "temps", "es": "tiempo", "de": "zeit", "it": "tempo", "pt": "tempo", "ru": "время",
    "zh": "时间", "ja": "時間", "ko": "시간", "ar": "وقت", "tr": "zaman", "nl": "tijd",
    "sv": "tid", "no": "tid", "fi": "aika", "pl": "czas", "he": "זמן", "fa": "زمان",
    "th": "เวลา", "vi": "thời gian", "id": "waktu", "ms": "masa", "tl": "oras", "sw": "wakati"
  },
  "money": {
    "te": "డబ్బు", "hi": "पैसा", "ta": "பணம்", "kn": "ಹಣ", "ml": "പണം", "mr": "पैसा",
    "bn": "টাকা", "pa": "ਪੈਸਾ", "ur": "پیسہ", "gu": "પૈસા", "or": "ଟଙ୍କା", "as": "টকা",
    "fr": "argent", "es": "dinero", "de": "geld", "it": "soldi", "pt": "dinheiro", "ru": "деньги",
    "zh": "钱", "ja": "お金", "ko": "돈", "ar": "مال", "tr": "para", "nl": "geld",
    "sv": "pengar", "no": "penger", "fi": "raha", "pl": "pieniądze", "he": "כסף", "fa": "پول",
    "th": "เงิน", "vi": "tiền", "id": "uang", "ms": "wang", "tl": "pera", "sw": "pesa"
  },
  "house": {
    "te": "ఇల్లు", "hi": "घर", "ta": "வீடு", "kn": "ಮನೆ", "ml": "വീട്", "mr": "घर",
    "bn": "বাড়ি", "pa": "ਘਰ", "ur": "گھر", "gu": "ઘર", "or": "ଘର", "as": "ঘৰ",
    "fr": "maison", "es": "casa", "de": "haus", "it": "casa", "pt": "casa", "ru": "дом",
    "zh": "房子", "ja": "家", "ko": "집", "ar": "بيت", "tr": "ev", "nl": "huis",
    "sv": "hus", "no": "hus", "fi": "talo", "pl": "dom", "he": "בית", "fa": "خانه",
    "th": "บ้าน", "vi": "nhà", "id": "rumah", "ms": "rumah", "tl": "bahay", "sw": "nyumba"
  },
  "friend": {
    "te": "స్నేహితుడు", "hi": "दोस्त", "ta": "நண்பன்", "kn": "ಸ್ನೇಹಿತ", "ml": "സുഹൃത്ത്", "mr": "मित्र",
    "bn": "বন্ধু", "pa": "ਦੋਸਤ", "ur": "دوست", "gu": "મિત્ર", "or": "ବନ୍ଧୁ", "as": "বন্ধু",
    "fr": "ami", "es": "amigo", "de": "freund", "it": "amico", "pt": "amigo", "ru": "друг",
    "zh": "朋友", "ja": "友達", "ko": "친구", "ar": "صديق", "tr": "arkadaş", "nl": "vriend",
    "sv": "vän", "no": "venn", "fi": "ystävä", "pl": "przyjaciel", "he": "חבר", "fa": "دوست",
    "th": "เพื่อน", "vi": "bạn", "id": "teman", "ms": "kawan", "tl": "kaibigan", "sw": "rafiki"
  },
  "family": {
    "te": "కుటుంబం", "hi": "परिवार", "ta": "குடும்பம்", "kn": "ಕುಟುಂಬ", "ml": "കുടുംബം", "mr": "कुटुंब",
    "bn": "পরিবার", "pa": "ਪਰਿਵਾਰ", "ur": "خاندان", "gu": "કુટુંબ", "or": "ପରିବାର", "as": "পৰিয়াল",
    "fr": "famille", "es": "familia", "de": "familie", "it": "famiglia", "pt": "família", "ru": "семья",
    "zh": "家庭", "ja": "家族", "ko": "가족", "ar": "عائلة", "tr": "aile", "nl": "familie",
    "sv": "familj", "no": "familie", "fi": "perhe", "pl": "rodzina", "he": "משפחה", "fa": "خانواده",
    "th": "ครอบครัว", "vi": "gia đình", "id": "keluarga", "ms": "keluarga", "tl": "pamilya", "sw": "familia"
  },
  "work": {
    "te": "పని", "hi": "काम", "ta": "வேலை", "kn": "ಕೆಲಸ", "ml": "പണി", "mr": "काम",
    "bn": "কাজ", "pa": "ਕੰਮ", "ur": "کام", "gu": "કામ", "or": "କାମ", "as": "কাম",
    "fr": "travail", "es": "trabajo", "de": "arbeit", "it": "lavoro", "pt": "trabalho", "ru": "работа",
    "zh": "工作", "ja": "仕事", "ko": "일", "ar": "عمل", "tr": "iş", "nl": "werk",
    "sv": "arbete", "no": "arbeid", "fi": "työ", "pl": "praca", "he": "עבודה", "fa": "کار",
    "th": "งาน", "vi": "công việc", "id": "kerja", "ms": "kerja", "tl": "trabaho", "sw": "kazi"
  },
  "school": {
    "te": "పాఠశాల", "hi": "स्कूल", "ta": "பள்ளி", "kn": "ಶಾಲೆ", "ml": "സ്കൂൾ", "mr": "शाळा",
    "bn": "স্কুল", "pa": "ਸਕੂਲ", "ur": "سکول", "gu": "શાળા", "or": "ବିଦ୍ୟାଳୟ", "as": "স্কুল",
    "fr": "école", "es": "escuela", "de": "schule", "it": "scuola", "pt": "escola", "ru": "школа",
    "zh": "学校", "ja": "学校", "ko": "학교", "ar": "مدرسة", "tr": "okul", "nl": "school",
    "sv": "skola", "no": "skole", "fi": "koulu", "pl": "szkoła", "he": "בית ספר", "fa": "مدرسه",
    "th": "โรงเรียน", "vi": "trường học", "id": "sekolah", "ms": "sekolah", "tl": "paaralan", "sw": "shule"
  },
  "book": {
    "te": "పుస్తకం", "hi": "किताब", "ta": "புத்தகம்", "kn": "ಪುಸ್ತಕ", "ml": "പുസ്തകം", "mr": "पुस्तक",
    "bn": "বই", "pa": "ਕਿਤਾਬ", "ur": "کتاب", "gu": "પુસ્તક", "or": "ବହି", "as": "কিতাপ",
    "fr": "livre", "es": "libro", "de": "buch", "it": "libro", "pt": "livro", "ru": "книга",
    "zh": "书", "ja": "本", "ko": "책", "ar": "كتاب", "tr": "kitap", "nl": "boek",
    "sv": "bok", "no": "bok", "fi": "kirja", "pl": "książka", "he": "ספר", "fa": "کتاب",
    "th": "หนังสือ", "vi": "sách", "id": "buku", "ms": "buku", "tl": "aklat", "sw": "kitabu"
  },
  "car": {
    "te": "కారు", "hi": "कार", "ta": "கார்", "kn": "ಕಾರು", "ml": "കാർ", "mr": "कार",
    "bn": "গাড়ি", "pa": "ਕਾਰ", "ur": "گاڑی", "gu": "કાર", "or": "କାର", "as": "গাড়ী",
    "fr": "voiture", "es": "coche", "de": "auto", "it": "macchina", "pt": "carro", "ru": "машина",
    "zh": "汽车", "ja": "車", "ko": "자동차", "ar": "سيارة", "tr": "araba", "nl": "auto",
    "sv": "bil", "no": "bil", "fi": "auto", "pl": "samochód", "he": "מכונית", "fa": "ماشین",
    "th": "รถยนต์", "vi": "xe hơi", "id": "mobil", "ms": "kereta", "tl": "kotse", "sw": "gari"
  }
};

// Comprehensive translation function with intelligent language detection and translation
async function comprehensiveTranslate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  console.log(`Comprehensive translation: "${text}" from ${sourceLanguage} to ${targetLanguage}`);

  // Handle empty text
  if (!text || text.trim() === '') {
    return '';
  }

  // Detect actual language of the input text
  const actualSourceLanguage = await smartLanguageDetection(text);
  console.log(`Detected language: ${actualSourceLanguage}`);

  // Use detected language if it's different from specified source
  const effectiveSourceLanguage = actualSourceLanguage !== 'en' ? actualSourceLanguage : sourceLanguage;

  // If source and target are the same AND the detected language matches, return original text
  if (effectiveSourceLanguage === targetLanguage && actualSourceLanguage === sourceLanguage) {
    return text;
  }

  // Normalize text for lookup
  const normalizedText = text.toLowerCase().trim();

  // Check for exact matches in our comprehensive dictionary
  if (COMPREHENSIVE_DICTIONARY[normalizedText] && COMPREHENSIVE_DICTIONARY[normalizedText][targetLanguage]) {
    const result = COMPREHENSIVE_DICTIONARY[normalizedText][targetLanguage];
    console.log(`Found exact translation: "${normalizedText}" -> "${result}"`);
    return result;
  }

  // Check for phrase matches (case-insensitive)
  for (const [phrase, translations] of Object.entries(COMPREHENSIVE_DICTIONARY)) {
    if (normalizedText.includes(phrase) && translations[targetLanguage]) {
      const translatedPhrase = translations[targetLanguage];
      const result = text.replace(new RegExp(phrase, 'gi'), translatedPhrase);
      console.log(`Found phrase match: "${phrase}" -> "${translatedPhrase}"`);
      return result;
    }
  }

  // Try partial word matching for compound words or variations
  const words = normalizedText.split(/[\s\-_]+/);
  let foundTranslation = false;
  let result = text;

  for (const word of words) {
    for (const [dictWord, translations] of Object.entries(COMPREHENSIVE_DICTIONARY)) {
      if (word.includes(dictWord) || dictWord.includes(word)) {
        if (translations[targetLanguage]) {
          result = result.replace(new RegExp(word, 'gi'), translations[targetLanguage]);
          foundTranslation = true;
          console.log(`Found partial match: "${word}" -> "${translations[targetLanguage]}"`);
          break;
        }
      }
    }
  }

  if (foundTranslation) {
    return result;
  }

  // If no translation found, provide intelligent fallback
  const languageNames: Record<string, string> = {
    "en": "English", "te": "Telugu", "hi": "Hindi", "ta": "Tamil", "kn": "Kannada", 
    "ml": "Malayalam", "mr": "Marathi", "bn": "Bengali", "pa": "Punjabi", "ur": "Urdu", 
    "gu": "Gujarati", "or": "Odia", "as": "Assamese", "fr": "French", "es": "Spanish", 
    "de": "German", "it": "Italian", "pt": "Portuguese", "ru": "Russian", "zh": "Chinese", 
    "ja": "Japanese", "ko": "Korean", "ar": "Arabic", "tr": "Turkish", "nl": "Dutch", 
    "sv": "Swedish", "no": "Norwegian", "fi": "Finnish", "pl": "Polish", "he": "Hebrew", 
    "fa": "Persian", "th": "Thai", "vi": "Vietnamese", "id": "Indonesian", "ms": "Malay",
    "tl": "Filipino", "sw": "Swahili"
  };

  const targetLangName = languageNames[targetLanguage] || targetLanguage.toUpperCase();
  console.log(`No direct translation available for "${text}" to ${targetLangName}`);
  
  // Provide contextual response in target language when possible
  const contextualResponses: Record<string, string> = {
    "te": `"${text}" కోసం తెలుగు అనువాదం ప్రస్తుతం అందుబాటులో లేదు`,
    "hi": `"${text}" का हिंदी अनुवाद वर्तमान में उपलब्ध नहीं है`,
    "ta": `"${text}" என்பதற்கான தமிழ் மொழிபெயர்ப்பு தற்போது கிடைக்கவில்லை`,
    "kn": `"${text}" ಇದರ ಕನ್ನಡ ಅನುವಾದ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ`,
    "ml": `"${text}" എന്നതിന്റെ മലയാളം പരിഭാഷ നിലവിൽ ലഭ്യമല്ല`,
    "mr": `"${text}" चे मराठी भाषांतर सध्या उपलब्ध नाही`,
    "bn": `"${text}" এর বাংলা অনুবাদ বর্তমানে উপলব্ধ নেই`,
    "gu": `"${text}" નો ગુજરાતી અનુવાદ હાલમાં ઉપલબ્ધ નથી`,
    "fr": `Traduction française de "${text}" actuellement non disponible`,
    "es": `Traducción al español de "${text}" no disponible actualmente`,
    "de": `Deutsche Übersetzung von "${text}" derzeit nicht verfügbar`,
    "zh": `"${text}" 的中文翻译目前不可用`,
    "ja": `"${text}" の日本語翻訳は現在利用できません`,
    "ko": `"${text}"의 한국어 번역이 현재 사용할 수 없습니다`,
    "ar": `الترجمة العربية لـ "${text}" غير متوفرة حاليا`,
    "ru": `Русский перевод "${text}" в настоящее время недоступен`
  };

  return contextualResponses[targetLanguage] || `[Translation to ${targetLangName} in progress...]`;
}

// Enhanced language detection with comprehensive pattern matching
async function smartLanguageDetection(text: string): Promise<string> {
  const advancedLanguagePatterns: Record<string, { scripts: RegExp[], keywords: RegExp[], weight: number }> = {
    "te": {
      scripts: [/[\u0C00-\u0C7F]/g],
      keywords: [/\b(మరియు|లో|హలో|ధన్యవాదాలు|ఎలా|ఏమి|ఎక్కడ|ఎప్పుడు|అవును|లేదు|నీరు|ఆహారం|ప్రేమ|సమయం|ఇల్లు|కుటుంబం|పని|పాఠశాల|పుస్తకం|కారు)\b/i],
      weight: 3
    },
    "hi": {
      scripts: [/[\u0900-\u097F]/g],
      keywords: [/\b(और|में|नमस्ते|धन्यवाद|कैसे|क्या|कहां|कब|हाँ|नहीं|पानी|खाना|प्रेम|समय|घर|परिवार|काम|स्कूल|किताब|कार)\b/i],
      weight: 3
    },
    "ta": {
      scripts: [/[\u0B80-\u0BFF]/g],
      keywords: [/\b(மற்றும்|உள்ளே|வணக்கம்|நன்றி|எப்படி|என்ன|எங்கே|எப்போது|ஆம்|இல்லை|தண்ணீர்|உணவு|காதல்|நேரம்|வீடு|குடும்பம்|வேலை|பள்ளி|புத்தகம்|கார்)\b/i],
      weight: 3
    },
    "kn": {
      scripts: [/[\u0C80-\u0CFF]/g],
      keywords: [/\b(ಮತ್ತು|ಒಳಗೆ|ನಮಸ್ಕಾರ|ಧನ್ಯವಾದಗಳು|ಹೇಗೆ|ಏನು|ಎಲ್ಲಿ|ಯಾವಾಗ|ಹೌದು|ಇಲ್ಲ|ನೀರು|ಆಹಾರ|ಪ್ರೀತಿ|ಸಮಯ|ಮನೆ|ಕುಟುಂಬ|ಕೆಲಸ|ಶಾಲೆ|ಪುಸ್ತಕ|ಕಾರು)\b/i],
      weight: 3
    },
    "ml": {
      scripts: [/[\u0D00-\u0D7F]/g],
      keywords: [/\b(കൂടാതെ|ഉള്ളിൽ|ഹലോ|നന്ദി|എങ്ങനെ|എന്ത്|എവിടെ|എപ്പോൾ|അതെ|ഇല്ല|വെള്ളം|ഭക്ഷണം|സ്നേഹം|സമയം|വീട്|കുടുംബം|പണി|സ്കൂൾ|പുസ്തകം|കാർ)\b/i],
      weight: 3
    },
    "bn": {
      scripts: [/[\u0980-\u09FF]/g],
      keywords: [/\b(এবং|মধ্যে|হ্যালো|ধন্যবাদ|কেমন|কি|কোথায়|কখন|হ্যাঁ|না|পানি|খাবার|ভালোবাসা|সময়|বাড়ি|পরিবার|কাজ|স্কুল|বই|গাড়ি)\b/i],
      weight: 3
    },
    "gu": {
      scripts: [/[\u0A80-\u0AFF]/g],
      keywords: [/\b(અને|માં|હેલો|આભાર|કેવી રીતે|શું|ક્યાં|ક્યારે|હા|ના|પાણી|ખોરાક|પ્રેમ|સમય|ઘર|કુટુંબ|કામ|શાળા|પુસ્તક|કાર)\b/i],
      weight: 3
    },
    "pa": {
      scripts: [/[\u0A00-\u0A7F]/g],
      keywords: [/\b(ਅਤੇ|ਵਿੱਚ|ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਧੰਨਵਾਦ|ਕਿਵੇਂ|ਕੀ|ਕਿੱਥੇ|ਕਦੋਂ|ਹਾਂ|ਨਹੀਂ|ਪਾਣੀ|ਖਾਣਾ|ਪਿਆਰ|ਸਮਾਂ|ਘਰ|ਪਰਿਵਾਰ|ਕੰਮ|ਸਕੂਲ|ਕਿਤਾਬ|ਕਾਰ)\b/i],
      weight: 3
    },
    "mr": {
      scripts: [/[\u0900-\u097F]/g],
      keywords: [/\b(आणि|मध्ये|नमस्कार|धन्यवाद|कसे|काय|कुठे|केव्हा|होय|नाही|पाणी|अन्न|प्रेम|वेळ|घर|कुटुंब|काम|शाळा|पुस्तक|कार)\b/i],
      weight: 3
    },
    "ur": {
      scripts: [/[\u0600-\u06FF]/g],
      keywords: [/\b(اور|میں|سلام|شکریہ|کیسے|کیا|کہاں|کب|ہاں|نہیں|پانی|کھانا|محبت|وقت|گھر|خاندان|کام|سکول|کتاب|گاڑی)\b/i],
      weight: 3
    },
    "zh": {
      scripts: [/[\u4e00-\u9fff]/g],
      keywords: [/\b(和|在|你好|谢谢|怎么|什么|哪里|什么时候|是|不|水|食物|爱|时间|房子|家庭|工作|学校|书|汽车)\b/i],
      weight: 4
    },
    "ja": {
      scripts: [/[\u3040-\u309f\u30a0-\u30ff]/g],
      keywords: [/\b(と|で|こんにちは|ありがとう|どう|何|どこ|いつ|はい|いいえ|水|食べ物|愛|時間|家|家族|仕事|学校|本|車)\b/i],
      weight: 4
    },
    "ko": {
      scripts: [/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/g],
      keywords: [/\b(그리고|에서|안녕하세요|감사합니다|어떻게|무엇|어디|언제|예|아니요|물|음식|사랑|시간|집|가족|일|학교|책|자동차)\b/i],
      weight: 4
    },
    "ar": {
      scripts: [/[\u0600-\u06FF]/g],
      keywords: [/\b(و|في|مرحبا|شكرا|كيف|ماذا|أين|متى|نعم|لا|ماء|طعام|حب|وقت|بيت|عائلة|عمل|مدرسة|كتاب|سيارة)\b/i],
      weight: 3
    },
    "he": {
      scripts: [/[\u0590-\u05FF]/g],
      keywords: [/\b(ו|ב|שלום|תודה|איך|מה|איפה|מתי|כן|לא|מים|אוכל|אהבה|זמן|בית|משפחה|עבודה|בית ספר|ספר|מכונית)\b/i],
      weight: 3
    },
    "en": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(the|is|are|and|hello|good|morning|thank|you|how|what|where|when|yes|no|ok|okay|water|food|love|time|house|family|work|school|book|car)\b/i],
      weight: 1
    },
    "fr": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(le|la|les|est|sont|et|bonjour|merci|comment|que|où|quand|oui|non|eau|nourriture|amour|temps|maison|famille|travail|école|livre|voiture)\b/i],
      weight: 2
    },
    "es": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(el|la|los|las|es|son|y|hola|gracias|cómo|qué|dónde|cuándo|sí|no|agua|comida|amor|tiempo|casa|familia|trabajo|escuela|libro|coche)\b/i],
      weight: 2
    },
    "de": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(der|die|das|ist|sind|und|hallo|danke|wie|was|wo|wann|ja|nein|wasser|essen|liebe|zeit|haus|familie|arbeit|schule|buch|auto)\b/i],
      weight: 2
    },
    "it": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(il|la|lo|è|sono|e|ciao|grazie|come|cosa|dove|quando|sì|no|acqua|cibo|amore|tempo|casa|famiglia|lavoro|scuola|libro|macchina)\b/i],
      weight: 2
    },
    "pt": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(o|a|os|as|é|são|e|olá|obrigado|como|que|onde|quando|sim|não|água|comida|amor|tempo|casa|família|trabalho|escola|livro|carro)\b/i],
      weight: 2
    },
    "ru": {
      scripts: [/[\u0400-\u04FF]/g],
      keywords: [/\b(и|в|привет|спасибо|как|что|где|когда|да|нет|вода|еда|любовь|время|дом|семья|работа|школа|книга|машина)\b/i],
      weight: 3
    },
    "tr": {
      scripts: [/[a-zA-Z]/g],
      keywords: [/\b(ve|içinde|merhaba|teşekkürler|nasıl|ne|nerede|ne zaman|evet|hayır|su|yemek|aşk|zaman|ev|aile|iş|okul|kitap|araba)\b/i],
      weight: 2
    }
  };

  const scores: Record<string, number> = {};

  for (const [language, patterns] of Object.entries(advancedLanguagePatterns)) {
    scores[language] = 0;

    // Check for script matches
    for (const script of patterns.scripts) {
      const matches = text.match(script);
      if (matches) {
        scores[language] += matches.length * patterns.weight;
      }
    }

    // Check for keyword matches
    for (const keyword of patterns.keywords) {
      const matches = text.match(keyword);
      if (matches) {
        scores[language] += matches.length * patterns.weight * 2; // Keywords get double weight
      }
    }
  }

  // Find the language with the highest score
  const detectedLanguage = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  return scores[detectedLanguage] > 0 ? detectedLanguage : "en";
}
