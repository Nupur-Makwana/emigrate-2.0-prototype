import React, { useState, useEffect, useRef } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { SupportedLanguage } from '../types/emigrate';
import {
  Languages,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Target,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';

interface TutorialStepTranslation {
  title: string;
  desc: string;
  highlightTag?: string;
}

export const PortalTutorialModal: React.FC = () => {
  const { tutorialOpen, setTutorialOpen, language, setLanguage, activeView, setActiveView } = useEmigrate();

  // Step 0: Language Selection & Welcome
  // Step 1: Top Bar (Language, Text Size, Theme, Help)
  // Step 2: Login for Registered Users (Officers: PoE, Mission, PGE)
  // Step 3: Primary Navigation Menu (Emigrant, Employer, Recruiting Agent)
  // Step 4: If you are an Emigrant (Application, ECR, Digital QR Contract)
  // Step 5: Quick Services & Verification (Track ARN, MRW Wages, Licensed Agents)
  // Step 6: Officer File Review & Explainer Broadcast (OCR & AI Triage)
  // Step 7: Need Help? Ask Mitra (24x7 Multilingual AI & Helpdesk)
  // Step 8: You are ready!
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [arrowDirection, setArrowDirection] = useState<'up' | 'down' | 'center'>('up');

  // Supported languages list with native scripts
  const languagesList: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  ];

  // Multilingual content for all 8 supported languages
  const translations: Record<
    SupportedLanguage,
    {
      welcomeTitle: string;
      welcomeDesc: string;
      chooseLang: string;
      stepLabel: string;
      btnNext: string;
      btnBack: string;
      btnSkip: string;
      btnStart: string;
      readyTitle: string;
      readyDesc: string;
      steps: TutorialStepTranslation[];
    }
  > = {
    en: {
      welcomeTitle: 'Welcome to eMigrate 2.0',
      welcomeDesc:
        'eMigrate helps Indian workers go abroad safely and helps officers check files faster. This visual, step-by-step tour highlights key portal sections. You can skip anytime or re-open it from "Site Walkthrough".',
      chooseLang: 'Choose your preferred language for the tutorial and portal:',
      stepLabel: 'Step',
      btnNext: 'Next',
      btnBack: 'Back',
      btnSkip: 'Skip',
      btnStart: 'Start using eMigrate',
      readyTitle: 'You are ready',
      readyDesc: 'Start from the Home page, or open Emigrant to begin an application.',
      steps: [
        {
          title: 'Top bar: language, text size, theme',
          desc: 'Use the dropdowns on the left for About Us and Help. On the right, choose your language, make text larger (A+) or smaller (A-), and switch light or dark mode.',
          highlightTag: 'Top Navigation Bar',
        },
        {
          title: 'Login for registered users',
          desc: "Officers sign in with 'Registered User Login'. Each officer goes straight to their own dashboard: Port of Emigration (PoE), Embassy / Mission, or PGE/OE Executive. Demo IDs are provided on the login dialog.",
          highlightTag: 'Officer Access Portal',
        },
        {
          title: 'The main menu',
          desc: 'Emigrant, Employer, and Recruiting Agent each open only their own application form. Directory lets you search employees, agents, Minimum Referral Wages and Project Exporters. Welfare Schemes, RTI and Alerts are here too.',
          highlightTag: 'Primary Services Menu',
        },
        {
          title: 'If you are an Emigrant',
          desc: "Open Emigrant, fill the form in six steps (personal, passport, visa and employment, nominee, PBBY insurance, documents) and submit. You receive an ARN. After officers grant clearance, your digital contract appears with a signed QR code that airport officers can scan even offline.",
          highlightTag: 'Worker Emigration Hub',
        },
        {
          title: 'Quick Services & Verification',
          desc: 'Track your application status by ARN (Emigrant, Employer, or RA), verify statutory Minimum Referral Wages (MRW) across 18 countries, or authenticate licensed Recruiting Agents (Rule 25).',
          highlightTag: 'Sovereign Verification Grid',
        },
        {
          title: 'How officers review files',
          desc: 'An AI engine reads uploaded documents (OCR) and gives each file a confidence score. It never approves anything. PoE officers inspect information, OCR output and AI insights, then forward the file to the Higher Officer (PGE) for statutory grant.',
          highlightTag: 'AI Triage & Video Review',
        },
        {
          title: 'Need help? Ask Mitra',
          desc: 'The 24x7 chat assistant works in English, Hindi, and regional languages. You can type, tap a prompt, or use the mic. If it cannot answer, it frames your query and generates an official PBSK Helpdesk ticket.',
          highlightTag: '24x7 Help Assistant',
        },
      ],
    },
    hi: {
      welcomeTitle: 'ई-माइग्रेट 2.0 में आपका स्वागत है',
      welcomeDesc:
        'ई-माइग्रेट भारतीय कामगारों को सुरक्षित रूप से विदेश जाने में मदद करता है, और अधिकारियों को फाइलों की तेजी से जांच करने में सहायता करता है। यह विज़ुअल टूर पोर्टल के सभी मुख्य भागों को हाइलाइट करता है। आप इसे कभी भी छोड़ सकते हैं।',
      chooseLang: 'ट्यूटोरियल और पोर्टल के लिए अपनी पसंदीदा भाषा चुनें:',
      stepLabel: 'चरण',
      btnNext: 'आगे',
      btnBack: 'पीछे',
      btnSkip: 'छोड़ें',
      btnStart: 'ई-माइग्रेट का उपयोग शुरू करें',
      readyTitle: 'आप तैयार हैं',
      readyDesc: 'मुख्य पृष्ठ से शुरुआत करें, या नया आवेदन शुरू करने के लिए "उत्प्रवासी" खोलें।',
      steps: [
        {
          title: 'शीर्ष पट्टी: भाषा, टेक्स्ट आकार और थीम',
          desc: 'बाईं ओर "हमारे बारे में" और "सहायता" के लिए ड्रॉपडाउन का उपयोग करें। दाईं ओर, अपनी भाषा चुनें, टेक्स्ट को बड़ा (A+) या छोटा (A-) करें, और लाइट या डार्क मोड बदलें।',
          highlightTag: 'शीर्ष नेविगेशन बार',
        },
        {
          title: 'पंजीकृत उपयोगकर्ताओं के लिए लॉगिन',
          desc: 'अधिकारी "पंजीकृत उपयोगकर्ता लॉगिन" से साइन इन करते हैं। प्रत्येक अधिकारी सीधे अपने डैशबोर्ड पर जाता है: उत्प्रवासी संरक्षक (PoE), दूतावास / मिशन, या PGE कार्यकारी। डेमो आईडी लॉगिन बॉक्स पर दिखाई गई हैं।',
          highlightTag: 'अधिकारी लॉगिन पोर्टल',
        },
        {
          title: 'मुख्य मेनू',
          desc: 'उत्प्रवासी (Emigrant), नियोक्ता (Employer), और भर्ती एजेंट (RA) प्रत्येक अपना आवेदन फॉर्म खोलते हैं। निर्देशिका आपको एजेंटों, न्यूनतम संदर्भ वेतन (MRW) और प्रोजेक्ट निर्यातकों को खोजने की अनुमति देती है।',
          highlightTag: 'मुख्य सेवा मेनू',
        },
        {
          title: 'यदि आप एक उत्प्रवासी कामगार हैं',
          desc: 'उत्प्रवासी खोलें, छह चरणों (व्यक्तिगत, पासपोर्ट, वीजा व रोजगार, नॉमिनी, PBBY बीमा, दस्तावेज) में फॉर्म भरें। मंजूरी मिलने पर, आपका डिजिटल अनुबंध हस्ताक्षरित QR कोड के साथ दिखाई देगा जिसे हवाई अड्डे के अधिकारी ऑफलाइन भी स्कैन कर सकते हैं।',
          highlightTag: 'कामगार उत्प्रवास हब',
        },
        {
          title: 'त्वरित सेवाएं और सत्यापन',
          desc: 'ARN द्वारा आवेदन की स्थिति ट्रैक करें (उत्प्रवासी, नियोक्ता, या एजेंट), 18 देशों में न्यूनतम संदर्भ वेतन (MRW) की जांच करें, या लाइसेंस प्राप्त भर्ती एजेंटों को सत्यापित करें।',
          highlightTag: 'सत्यापन ग्रिड',
        },
        {
          title: 'अधिकारी फाइलों की समीक्षा कैसे करते हैं',
          desc: 'एक AI इंजन अपलोड किए गए दस्तावेजों (OCR) को पढ़ता है और विश्वास स्कोर देता है। यह कभी कुछ स्वीकृत नहीं करता। PoE अधिकारी फाइल और AI इनसाइट्स जांचते हैं, फिर इसे अंतिम स्वीकृति के लिए उच्च अधिकारी (PGE) को अग्रेषित करते हैं।',
          highlightTag: 'AI समीक्षा व वीडियो',
        },
        {
          title: 'मदद चाहिए? मित्र से पूछें',
          desc: '24x7 चैट सहायक अंग्रेजी, हिंदी और क्षेत्रीय भाषाओं में काम करता है। आप टाइप कर सकते हैं, प्रॉम्प्ट चुन सकते हैं या माइक का उपयोग कर सकते हैं। यदि उत्तर न मिले, तो यह सहायता केंद्र को टिकट भेजता है।',
          highlightTag: '24x7 मित्र सहायक',
        },
      ],
    },
    ta: {
      welcomeTitle: 'இ-மைக்ரேட் 2.0-க்கு வரவேற்கிறோம்',
      welcomeDesc:
        'இந்திய பணியாளர்கள் பாதுகாப்பாக வெளிநாடு செல்லவும், அதிகாரிகள் விரைவாக கோப்புகளை சரிபார்க்கவும் இ-மைக்ரேட் உதவுகிறது. இந்த வழிகாட்டி முக்கிய பகுதிகளை சுட்டிக்காட்டுகிறது.',
      chooseLang: 'வழிகாட்டி மற்றும் தளத்திற்கான மொழியைத் தேர்ந்தெடுக்கவும்:',
      stepLabel: 'படி',
      btnNext: 'அடுத்து',
      btnBack: 'பின்செல்',
      btnSkip: 'தவிர்',
      btnStart: 'இ-மைக்ரேட்டைப் பயன்படுத்துங்கள்',
      readyTitle: 'நீங்கள் தயாராகிவிட்டீர்கள்',
      readyDesc: 'முகப்புப் பக்கத்திலிருந்து தொடங்கவும், அல்லது விண்ணப்பிக்க "பணியாளர்" பகுதியைத் திறக்கவும்.',
      steps: [
        {
          title: 'மேல் பட்டி: மொழி, எழுத்து அளவு, தீம்',
          desc: 'இடதுபுறத்தில் எங்களைப் பற்றி மற்றும் உதவிப் பிரிவுகள் உள்ளன. வலதுபுறத்தில் மொழியைத் தேர்ந்தெடுக்கவும், எழுத்து அளவை மாற்றவும்.',
          highlightTag: 'மேல் வழிசெலுத்தல் பட்டி',
        },
        {
          title: 'பதிவு செய்த பயனர்களுக்கான உள்நுழைவு',
          desc: 'அதிகாரிகள் உள்நுழைய "பதிவு செய்த பயனர் உள்நுழைவு" பயன்படுத்தவும். PoE, தூதரகம் அல்லது PGE டாஷ்போர்டுகளுக்கு செல்லலாம்.',
          highlightTag: 'அதிகாரி உள்நுழைவு',
        },
        {
          title: 'முதன்மை மெனு',
          desc: 'பணியாளர், முதலாளி மற்றும் ஆட்சேர்ப்பு முகவர் விண்ணப்ப படிவங்கள் இங்கு உள்ளன.',
          highlightTag: 'முதன்மை சேவைகள் மெனு',
        },
        {
          title: 'நீங்கள் ஒரு பணியாளர் என்றால்',
          desc: 'விண்ணப்பத்தை 6 படிகளில் நிரப்பி சமர்ப்பிக்கவும். ஒப்புதலுக்குப் பிறகு QR குறியீட்டுடன் கூடிய டிஜிட்டல் ஒப்பந்தம் தோன்றும்.',
          highlightTag: 'பணியாளர் மையம்',
        },
        {
          title: 'விரைவு சேவைகள் மற்றும் சரிபார்ப்பு',
          desc: 'ARN மூலம் விண்ணப்ப நிலையை கண்காணிக்கவும், குறைந்தபட்ச ஊதியத்தை சரிபார்க்கவும், உரிமம் பெற்ற முகவர்களை சரிபார்க்கவும்.',
          highlightTag: 'சரிபார்ப்பு கட்டம்',
        },
        {
          title: 'அதிகாரிகள் கோப்புகளை எவ்வாறு மதிப்பாய்வு செய்கிறார்கள்',
          desc: 'AI இயந்திரம் ஆவணங்களை படித்து மதிப்பெண் தருகிறது. PoE அதிகாரிகள் சரிபார்த்து உயர் அதிகாரிக்கு (PGE) அனுப்புகிறார்கள்.',
          highlightTag: 'AI மதிப்பாய்வு',
        },
        {
          title: 'உதவி தேவையா? மித்ராவிடம் கேளுங்கள்',
          desc: '24x7 அரட்டை உதவியாளர் பல மொழிகளில் வேலை செய்கிறது. பதில் கிடைக்கவில்லை என்றால் அதிகாரப்பூர்வ டிக்கெட்டை உருவாக்கும்.',
          highlightTag: '24x7 மித்ரா உதவியாளர்',
        },
      ],
    },
    te: {
      welcomeTitle: 'ఇ-మైగ్రేట్ 2.0 కి స్వాగతం',
      welcomeDesc:
        'భారతీయ కార్మికులు సురక్షితంగా విదేశాలకు వెళ్లడానికి మరియు అధికారులు ఫైళ్లను త్వరగా తనిఖీ చేయడానికి ఇ-మైగ్రేట్ సహాయపడుతుంది.',
      chooseLang: 'ట్యుటోరియల్ మరియు పోర్టల్ కోసం మీ భాషను ఎంచుకోండి:',
      stepLabel: 'దశ',
      btnNext: 'తర్వాత',
      btnBack: 'వెనుకకు',
      btnSkip: 'దాటవేయి',
      btnStart: 'ఇ-మైగ్రేట్ ఉపయోగించండి',
      readyTitle: 'మీరు సిద్ధంగా ఉన్నారు',
      readyDesc: 'హోమ్ పేజీ నుండి ప్రారంభించండి లేదా దరఖాస్తు చేసుకోవడానికి "వలసదారు" తెరవండి.',
      steps: [
        {
          title: 'ఎగువ పట్టీ: భాష, టెక్స్ట్ పరిమాణం, థీమ్',
          desc: 'ఎడమ వైపున మా గురించి మరియు సహాయం మెనూలు ఉన్నాయి. కుడి వైపున భాష మరియు టెక్స్ట్ పరిమాణం మార్చుకోండి.',
          highlightTag: 'ఎగువ నావిగేషన్ బార్',
        },
        {
          title: 'నమోదిత వినియోగదారుల లాగిన్',
          desc: 'అధికారులు తమ PoE, ఎంబసీ లేదా PGE డ్యాష్‌బోర్డ్‌లోకి నేరుగా వెళ్లడానికి లాగిన్ అవ్వండి.',
          highlightTag: 'అధికారుల లాగిన్',
        },
        {
          title: 'ప్రధాన మెనూ',
          desc: 'వలసదారు, యజమాని మరియు రిక్రూటింగ్ ఏజెంట్ దరఖాస్తు ఫారమ్‌లు ఇక్కడ అందుబాటులో ఉన్నాయి.',
          highlightTag: 'ప్రధాన సేవల మెనూ',
        },
        {
          title: 'మీరు వలస కార్మికులైతే',
          desc: 'దరఖాస్తును 6 దశల్లో పూర్తి చేయండి. ఆమోదం తర్వాత QR కోడ్‌తో కూడిన డిజిటల్ కాంట్రాక్ట్ లభిస్తుంది.',
          highlightTag: 'వలసదారుల కేంద్రం',
        },
        {
          title: 'త్వరిత సేవలు మరియు ధృవీకరణ',
          desc: 'ARN ద్వారా స్థితిని ట్రాక్ చేయండి, కనీస వేతనాలను ధృవీకరించండి మరియు ఏజెంట్లను తనిఖీ చేయండి.',
          highlightTag: 'ధృవీకరణ గ్రిడ్',
        },
        {
          title: 'అధికారులు ఫైళ్లను ఎలా సమీక్షిస్తారు',
          desc: 'AI ఇంజిన్ పత్రాలను చదివి స్కోర్ ఇస్తుంది. అధికారులు పరిశీలించి ఉన్నతాధికారికి పంపుతారు.',
          highlightTag: 'AI సమీక్ష',
        },
        {
          title: 'సహాయం కావాలా? మిత్రను అడగండి',
          desc: 'చాట్ అసిస్టెంట్ మీ ప్రశ్నలకు సమాధానమిస్తుంది మరియు హెల్ప్‌డెస్క్ టికెట్ రూపొందిస్తుంది.',
          highlightTag: '24x7 మిత్ర సహాయకుడు',
        },
      ],
    },
    kn: {
      welcomeTitle: 'ಇ-ಮೈಗ್ರೇಟ್ 2.0 ಗೆ ಸುಸ್ವಾಗತ',
      welcomeDesc:
        'ಭಾರತೀಯ ಕಾರ್ಮಿಕರು ಸುರಕ್ಷಿತವಾಗಿ ವಿದೇಶಕ್ಕೆ ಹೋಗಲು ಮತ್ತು ಅಧಿಕಾರಿಗಳು ಕಡತಗಳನ್ನು ವೇಗವಾಗಿ ಪರಿಶೀಲಿಸಲು ಇ-ಮೈಗ್ರೇಟ್ ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
      chooseLang: 'ಟ್ಯುಟೋರಿಯಲ್ ಮತ್ತು ಪೋರ್ಟಲ್‌ಗಾಗಿ ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      stepLabel: 'ಹಂತ',
      btnNext: 'ಮುಂದೆ',
      btnBack: 'ಹಿಂದೆ',
      btnSkip: 'ಬಿಟ್ಟುಬಿಡಿ',
      btnStart: 'ಇ-ಮೈಗ್ರೇಟ್ ಬಳಸಲು ಪ್ರಾರಂಭಿಸಿ',
      readyTitle: 'ನೀವು ಸಿದ್ಧರಿದ್ದೀರಿ',
      readyDesc: 'ಮುಖಪುಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ ಅಥವಾ ಅರ್ಜಿಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ವಲಸಿಗರನ್ನು ತೆರೆಯಿರಿ.',
      steps: [
        {
          title: 'ಮೇಲಿನ ಬಾರ್: ಭಾಷೆ, ಪಠ್ಯ ಗಾತ್ರ, ಥೀಮ್',
          desc: 'ಎಡಭಾಗದಲ್ಲಿ ನಮ್ಮ ಬಗ್ಗೆ ಮತ್ತು ಸಹಾಯಕ್ಕಾಗಿ ಡ್ರಾಪ್‌ಡೌನ್‌ಗಳಿವೆ. ಬಲಭಾಗದಲ್ಲಿ ಭಾಷೆ ಮತ್ತು ಪಠ್ಯ ಗಾತ್ರವನ್ನು ಆರಿಸಿ.',
          highlightTag: 'ಮೇಲಿನ ನ್ಯಾವಿಗೇಷನ್ ಬಾರ್',
        },
        {
          title: 'ನೋಂದಾಯಿತ ಬಳಕೆದಾರರ ಲಾಗಿನ್',
          desc: 'ಅಧಿಕಾರಿಗಳು ತಮ್ಮ PoE, ರಾಯಭಾರ ಕಚೇರಿ ಅಥವಾ PGE ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಲಾಗಿನ್ ಆಗುತ್ತಾರೆ.',
          highlightTag: 'ಅಧಿಕಾರಿಗಳ ಲಾಗಿನ್',
        },
        {
          title: 'ಮುಖ್ಯ ಮೆನು',
          desc: 'ವಲಸಿಗ, ಉದ್ಯೋಗದಾತ ಮತ್ತು ನೇಮಕಾತಿ ಏಜೆಂಟ್ ಅರ್ಜಿ ನಮೂನೆಗಳು ಇಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
          highlightTag: 'ಮುಖ್ಯ ಸೇವೆಗಳ ಮೆನು',
        },
        {
          title: 'ನೀವು ವಲಸಿಗರಾಗಿದ್ದರೆ',
          desc: 'ಅರ್ಜಿಯನ್ನು 6 ಹಂತಗಳಲ್ಲಿ ಸಲ್ಲಿಸಿ. ಅನುಮೋದನೆಯ ನಂತರ QR ಕೋಡ್ ಹೊಂದಿರುವ ಡಿಜಿಟಲ್ ಒಪ್ಪಂದ ಲಭ್ಯವಾಗುತ್ತದೆ.',
          highlightTag: 'ವಲಸಿಗರ ಕೇಂದ್ರ',
        },
        {
          title: 'ತ್ವರಿತ ಸೇವೆಗಳು ಮತ್ತು ಪರಿಶೀಲನೆ',
          desc: 'ARN ಮೂಲಕ ಅರ್ಜಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಕನಿಷ್ಠ ವೇತನವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಏಜೆಂಟರನ್ನು ದೃಢೀಕರಿಸಿ.',
          highlightTag: 'ಪರಿಶೀಲನಾ ಗ್ರಿಡ್',
        },
        {
          title: 'ಅಧಿಕಾರಿಗಳು ಕಡತಗಳನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುತ್ತಾರೆ',
          desc: 'AI ಎಂಜಿನ್ ದಾಖಲೆಗಳನ್ನು ಓದಿ ಸ್ಕೋರ್ ನೀಡುತ್ತದೆ. ಅಧಿಕಾರಿಗಳು ಪರಿಶೀಲಿಸಿ ಅನುಮೋದನೆಗೆ ಕಳುಹಿಸುತ್ತಾರೆ.',
          highlightTag: 'AI ವಿಮರ್ಶೆ',
        },
        {
          title: 'ಸಹಾಯ ಬೇಕೇ? ಮಿತ್ರನನ್ನು ಕೇಳಿ',
          desc: 'ಚಾಟ್ ಸಹಾಯಕ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುತ್ತದೆ ಮತ್ತು ಹೆಲ್ಪ್‌ಡೆಸ್ಕ್‌ಗೆ ಟಿಕೆಟ್ ಕಳುಹಿಸುತ್ತದೆ.',
          highlightTag: '24x7 ಮಿತ್ರ ಸಹಾಯಕ',
        },
      ],
    },
    bn: {
      welcomeTitle: 'ই-মাইগ্রেট ২.০-তে স্বাগতম',
      welcomeDesc:
        'ই-মাইগ্রেট ভারতীয় কর্মীদের নিরাপদে বিদেশে যেতে সাহায্য করে এবং কর্মকর্তাদের দ্রুত ফাইল যাচাইয়ে সহায়তা করে।',
      chooseLang: 'টিউটোরিয়াল ও পোর্টালের জন্য ভাষা নির্বাচন করুন:',
      stepLabel: 'ধাপ',
      btnNext: 'পরবর্তী',
      btnBack: 'পূর্ববর্তী',
      btnSkip: 'এড়িয়ে যান',
      btnStart: 'ই-মাইগ্রেট ব্যবহার শুরু করুন',
      readyTitle: 'আপনি প্রস্তুত',
      readyDesc: 'হোম পেজ থেকে শুরু করুন বা আবেদন করতে "অভিবাসী" খুলুন।',
      steps: [
        {
          title: 'শীর্ষ বার: ভাষা, পাঠ্যের আকার, থিম',
          desc: 'বাম পাশে আমাদের সম্পর্কে এবং সহায়তা রয়েছে। ডান পাশে ভাষা নির্বাচন এবং টেক্সটের আকার পরিবর্তন করুন।',
          highlightTag: 'শীর্ষ নেভিগেশন বার',
        },
        {
          title: 'নিবন্ধিত ব্যবহারকারীদের জন্য লগইন',
          desc: 'কর্মকর্তারা PoE, দূতাবাস বা PGE ড্যাশবোর্ডে লগইন করে কাজ করেন।',
          highlightTag: 'কর্মকর্তা লগইন',
        },
        {
          title: 'প্রধান মেনু',
          desc: 'অভিবাসী, নিয়োগকর্তা এবং রিক্রুটিং এজেন্টের আবেদন ফর্ম এখান থেকে পাওয়া যাবে।',
          highlightTag: 'প্রধান সেবা মেনু',
        },
        {
          title: 'আপনি যদি একজন অভিবাসী হন',
          desc: 'ফর্মটি পূরণ করুন এবং জমা দিন। অনুমোদনের পর স্বাক্ষরিত QR কোডসহ ডিজিটাল চুক্তিপত্র পাবেন।',
          highlightTag: 'অভিবাসী কেন্দ্র',
        },
        {
          title: 'দ্রুত সেবা ও যাচাইকরণ',
          desc: 'ARN দ্বারা আবেদনের স্থিতি ট্র্যাক করুন, ন্যূনতম মজুরি যাচাই করুন এবং অনুমোদিত এজেন্ট খুঁজুন।',
          highlightTag: 'যাচাইকরণ গ্রিড',
        },
        {
          title: 'কর্মকর্তারা কীভাবে ফাইল পর্যালোচনা করেন',
          desc: 'AI ইঞ্জিন নথি যাচাই করে স্কোর দেয়। PoE কর্মকর্তা দেখে উচ্চপদস্থ কর্মকর্তার কাছে পাঠান।',
          highlightTag: 'AI পর্যালোচনা',
        },
        {
          title: 'সাহায্য দরকার? মিত্রকে জিজ্ঞাসা করুন',
          desc: 'চ্যাট সহকারী উত্তর দেয় এবং প্রয়োজনে সহায়তা কেন্দ্রে টিকিট তৈরি করে।',
          highlightTag: '২৪x৭ মিত্র সহকারী',
        },
      ],
    },
    mr: {
      welcomeTitle: 'ई-मायग्रेट २.० मध्ये आपले स्वागत आहे',
      welcomeDesc:
        'ई-मायग्रेट भारतीय कामगारांना सुरक्षितपणे परदेशात जाण्यास मदत करते आणि अधिकाऱ्यांना फाइल्स जलद तपासण्यास मदत करते. हा व्हिज्युअल टूर पोर्टलच्या सर्व भागांची ओळख करून देतो.',
      chooseLang: 'ट्युटोरिअल आणि पोर्टलसाठी तुमची पसंतीची भाषा निवडा:',
      stepLabel: 'टप्पा',
      btnNext: 'पुढे',
      btnBack: 'मागे',
      btnSkip: 'सोडून द्या',
      btnStart: 'ई-मायग्रेट वापरणे सुरू करा',
      readyTitle: 'तुम्ही तयार आहात',
      readyDesc: 'मुख्य पृष्ठावरून सुरुवात करा किंवा अर्ज भरण्यासाठी "उत्प्रवासी" उघडा.',
      steps: [
        {
          title: 'शीर्ष पट्टी: भाषा, मजकूर आकार आणि थीम',
          desc: 'डावीकडे आमच्याबद्दल आणि मदतीसाठी मेनू वापरा. उजवीकडे भाषा निवडा, मजकूर मोठा/लहान करा आणि थीम बदला.',
          highlightTag: 'शीर्ष नेव्हिगेशन पट्टी',
        },
        {
          title: 'नोंदणीकृत वापरकर्त्यांसाठी लॉगिन',
          desc: 'अधिकारी "नोंदणीकृत वापरकर्ता लॉगिन" द्वारे साइन इन करतात: PoE, दूतावास किंवा PGE डॅशबोर्ड.',
          highlightTag: 'अधिकारी लॉगिन पोर्टल',
        },
        {
          title: 'मुख्य मेनू',
          desc: 'उत्प्रवासी, नियोक्ता आणि भरती एजंट अर्ज फॉर्म येथे उपलब्ध आहेत. निर्देशिका आणि योजना देखील येथे आहेत.',
          highlightTag: 'मुख्य सेवा मेनू',
        },
        {
          title: 'तुम्ही उत्प्रवासी कामगार असल्यास',
          desc: '६ चरणांमध्ये फॉर्म भरा. मंजुरी मिळाल्यावर स्वाक्षरी केलेला QR कोड असलेला डिजिटल करार उपलब्ध होतो.',
          highlightTag: 'कामगार उत्प्रवास हब',
        },
        {
          title: 'जलद सेवा आणि पडताळणी',
          desc: 'ARN द्वारे अर्जाची स्थिती तपासा, किमान वेतन पडताळा आणि परवानाधारक एजंट तपासा.',
          highlightTag: 'पडताळणी ग्रिड',
        },
        {
          title: 'अधिकारी फाइल्सचे पुनरावलोकन कसे करतात',
          desc: 'AI इंजिन कागदपत्रे वाचते (OCR) आणि स्कोअर देते. अधिकारी पडताळणी करून उच्च अधिकाऱ्याकडे पाठवतात.',
          highlightTag: 'AI पुनरावलोकन',
        },
        {
          title: 'मदत हवी आहे? मित्राला विचारा',
          desc: '२४x७ चॅट सहाय्यक प्रश्न सोडवतो आणि आवश्यक असल्यास मदत केंद्राकडे तिकीट पाठवतो.',
          highlightTag: '२४x७ मित्र सहाय्यक',
        },
      ],
    },
    gu: {
      welcomeTitle: 'ઇ-માઇગ્રેટ ૨.૦ માં તમારું સ્વાગત છે',
      welcomeDesc:
        'ઇ-માઇગ્રેટ ભારતીય કામદારોને સુરક્ષિત રીતે વિદેશ જવા માટે અને અધિકારીઓને ફાઇલો ઝડપથી ચકાસવા માટે મદદ કરે છે. આ વિઝ્યુઅલ ટૂર પોર્ટલના મુખ્ય વિભાગો દર્શાવે છે.',
      chooseLang: 'ટ્યુટોરીયલ અને પોર્ટલ માટે તમારી પસંદગીની ભાષા પસંદ કરો:',
      stepLabel: 'તબક્કો',
      btnNext: 'આગળ',
      btnBack: 'પાછળ',
      btnSkip: 'છોડો',
      btnStart: 'ઇ-માઇગ્રેટ શરૂ કરો',
      readyTitle: 'તમે તૈયાર છો',
      readyDesc: 'મુખ્ય પૃષ્ઠથી શરૂ કરો અથવા અરજી કરવા માટે "ઉત્પ્રવાસી" ખોલો.',
      steps: [
        {
          title: 'ટોચની પટ્ટી: ભાષા, ફોન્ટ સાઇઝ, થીમ',
          desc: 'ડાબી બાજુ અમારા વિશે અને મદદ માટે મેનુ છે. જમણી બાજુ ભાષા, ફોન્ટ સાઇઝ અને થીમ બદલો.',
          highlightTag: 'ટોચની નેવિગેશન પટ્ટી',
        },
        {
          title: 'નોંધાયેલા વપરાશકર્તાઓ માટે લૉગિન',
          desc: 'અધિકારીઓ PoE, દૂતાવાસ અથવા PGE ડૅશબોર્ડ માટે લૉગિન કરે છે.',
          highlightTag: 'અધિકારી લૉગિન',
        },
        {
          title: 'મુખ્ય મેનૂ',
          desc: 'ઉત્પ્રવાસી, નોકરીદાતા અને એજન્ટ અરજી ફોર્મ અહીં ઉપલબ્ધ છે.',
          highlightTag: 'મુખ્ય સેવાઓ મેનૂ',
        },
        {
          title: 'જો તમે ઉત્પ્રવાસી કામદાર હોવ',
          desc: '૬ તબક્કામાં અરજી ભરો. મંજૂરી બાદ QR કોડવાળો ડિજિટલ કરાર મળશે જે ઓફલાઇન પણ સ્કેન કરી શકાય છે.',
          highlightTag: 'કામદાર ઉત્પ્રવાસ કેન્દ્ર',
        },
        {
          title: 'ઝડપી સેવાઓ અને ચકાસણી',
          desc: 'ARN દ્વારા સ્થિતિ ટ્રેક કરો, લઘુત્તમ વેતન ચકાસો અને લાયસન્સ ધરાવતા એજન્ટોની પુષ્ટિ કરો.',
          highlightTag: 'ચકાસણી ગ્રીડ',
        },
        {
          title: 'અધિકારીઓ ફાઇલ કેવી રીતે તપાસે છે',
          desc: 'AI એન્જિન દસ્તાવેજો વાંચે છે (OCR) અને સ્કોર આપે છે. અધિકારીઓ ચકાસીને આગળ મોકલે છે.',
          highlightTag: 'AI તપાસ અને વિડિઓ',
        },
        {
          title: 'મદદ જોઈએ છે? મિત્રને પૂછો',
          desc: '૨૪x૭ ચેટ આસિસ્ટન્ટ પ્રશ્નોના ઉત્તર આપે છે અને સહાય કેન્દ્રની ટિકિટ બનાવે છે.',
          highlightTag: '૨૪x૭ મિત્ર આસિસ્ટન્ટ',
        },
      ],
    },
  };

  const t = translations[language] || translations.en;

  // Map step index to DOM target element ID
  const targetIds: (string | null)[] = [
    null, // Step 0: Welcome & Language Selector
    'tour-top-strip', // Step 1: Top bar
    'tour-login-btn', // Step 2: Login button
    'tour-main-nav', // Step 3: Main navigation
    'tour-emigrant-hero', // Step 4: Emigrant card/hero
    'tour-services-grid', // Step 5: Quick Services grid
    'tour-video-review', // Step 6: Officer review & video
    'tour-mitra-fab', // Step 7: Mitra floating button
    null, // Step 8: You are ready
  ];

  // Reset to Step 0 when opened
  useEffect(() => {
    if (tutorialOpen) {
      setCurrentStep(0);
    }
  }, [tutorialOpen]);

  // Update target rect on step change or resize/scroll
  useEffect(() => {
    if (!tutorialOpen) return;

    // Switch view to 'home' if on another view and step requires home elements
    if (currentStep >= 4 && currentStep <= 6 && activeView !== 'home') {
      setActiveView('home');
    }

    const updateRect = () => {
      const targetId = targetIds[currentStep];
      if (!targetId) {
        setTargetRect(null);
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        // Scroll target into view with margin
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        // Determine arrow orientation relative to screen position
        const windowHeight = window.innerHeight;
        if (currentStep === 1 || currentStep === 2 || currentStep === 3) {
          setArrowDirection('up');
        } else if (currentStep === 7) {
          setArrowDirection('down');
        } else {
          if (rect.top < windowHeight * 0.45) {
            setArrowDirection('up');
          } else {
            setArrowDirection('down');
          }
        }
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 300);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [currentStep, tutorialOpen, activeView, setActiveView]);

  if (!tutorialOpen) return null;

  const handleClose = () => {
    localStorage.setItem('emigrate_tutorial_seen', 'true');
    setTutorialOpen(false);
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Compute popover style dynamically so it never collides or overflows
  const getPopoverStyle = () => {
    if (!targetRect || currentStep === 0 || currentStep === 8) {
      // Centered on screen for Welcome and Final screens
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        maxWidth: '520px',
        width: 'calc(100vw - 32px)',
      };
    }

    const { top, bottom, left, width } = targetRect;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const popoverWidth = Math.min(480, windowWidth - 32);

    let popoverTop = 0;
    // Align horizontally with target center, bounded by screen edges
    const targetCenterX = left + width / 2;
    let popoverLeft = Math.max(16, Math.min(targetCenterX - popoverWidth / 2, windowWidth - popoverWidth - 16));

    if (arrowDirection === 'up') {
      // Popover is below target
      popoverTop = Math.min(bottom + 18, windowHeight - 260);
    } else {
      // Popover is above target
      popoverTop = Math.max(16, top - 240);
    }

    // Special case for Mitra FAB in bottom-right corner
    if (currentStep === 7) {
      popoverTop = Math.max(20, top - 230);
      popoverLeft = Math.max(16, windowWidth - popoverWidth - 24);
    }

    return {
      top: `${popoverTop}px`,
      left: `${popoverLeft}px`,
      width: `${popoverWidth}px`,
      position: 'fixed' as const,
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* 1. Backdrop Overlay:
          - If step 0 or 8 (modal views), use a full uniform dark backdrop.
          - If steps 1 to 7 with targetRect, the target box uses a massive box-shadow (0 0 0 9999px)
            to darken everywhere outside the target, leaving the real portal element 100% visible and bright!
      */}
      {(currentStep === 0 || currentStep === 8 || !targetRect) && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 2. Highlight Box around targeted element (Genuine Spotlight Cutout) */}
      {targetRect && currentStep >= 1 && currentStep <= 7 && (
        <div
          className="fixed pointer-events-none transition-all duration-300 ease-out z-50 rounded-xl border-3 border-amber-400 ring-4 ring-amber-400/40 animate-pulse"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            boxShadow: '0 0 0 9999px rgba(10, 25, 47, 0.72)',
          }}
        >
          {/* Target Section Beacon Badge */}
          <div className="absolute -top-3.5 left-4 bg-amber-500 text-navy-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-lg flex items-center gap-1.5 border border-amber-300 whitespace-nowrap">
            <Target className="w-3 h-3 text-navy-950 animate-spin" />
            <span>
              {t.steps[currentStep - 1]?.highlightTag || 'Highlighted Section'}
            </span>
          </div>
        </div>
      )}

      {/* 3. Popover Card (Visual Walkthrough Guide) */}
      <div
        style={getPopoverStyle()}
        className="z-50 bg-navy-900 text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-navy-700 overflow-visible transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
      >
        {/* Tricolor Ribbon on top of card */}
        <div className="tricolor-stripe rounded-t-2xl" />

        {/* Dynamic Pointing Arrow */}
        {targetRect && currentStep >= 1 && currentStep <= 7 && (
          <>
            {arrowDirection === 'up' ? (
              /* Arrow pointing UP toward the highlighted section */
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div className="w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-amber-400 filter drop-shadow-md" />
              </div>
            ) : (
              /* Arrow pointing DOWN toward the highlighted section */
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-400 filter drop-shadow-md" />
              </div>
            )}
          </>
        )}

        {/* STEP 0: LANGUAGE SELECTION & WELCOME SCREEN */}
        {currentStep === 0 && (
          <div className="p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-navy-950 font-bold shadow-xs">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-400 block">
                    Select Language • भाषा चुनें
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Official eMigrate 2.0 Walkthrough
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition"
                title={t.btnSkip}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {t.chooseLang}
                </label>
                <span className="text-[10px] text-amber-400/90 font-mono">
                  8 Official Languages
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {languagesList.map((langItem) => {
                  const isSelected = language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      onClick={() => setLanguage(langItem.code)}
                      className={`p-2.5 rounded-xl text-left transition border text-xs flex flex-col justify-center relative ${
                        isSelected
                          ? 'bg-amber-500 text-navy-950 font-black border-amber-400 shadow-lg ring-2 ring-amber-300/60 scale-[1.02]'
                          : 'bg-navy-800/90 text-slate-200 hover:bg-navy-700 border-navy-700/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-tight">
                          {langItem.native}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-navy-950 fill-amber-300" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-navy-900 opacity-80' : 'text-slate-400'
                        }`}
                      >
                        {langItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Welcome Description Box */}
            <div className="bg-navy-950/80 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm sm:text-base text-white">
                  {t.welcomeTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {t.welcomeDesc}
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-navy-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition"
              >
                {t.btnSkip}
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs rounded-xl transition flex items-center gap-2 shadow-lg"
              >
                <span>{t.btnNext}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEPS 1 to 7: HIGHLIGHTED WALKTHROUGH STEPS */}
        {currentStep >= 1 && currentStep <= 7 && (
          <div className="p-5 sm:p-6 space-y-3.5">
            {/* Header: Step Counter & Language Quick Switch & Close */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold font-mono tracking-wider">
                  {t.stepLabel} {currentStep} of 7
                </span>
                {/* Arrow indicator chip */}
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 hidden sm:inline-flex">
                  {arrowDirection === 'up' ? (
                    <>
                      <ArrowUp className="w-3 h-3 text-amber-400" /> Pointing to target above
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3 h-3 text-amber-400" /> Pointing to target below
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mini Language Switcher during tutorial */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="bg-navy-800 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-navy-700 focus:outline-none cursor-pointer"
                >
                  {languagesList.map((l) => (
                    <option key={l.code} value={l.code} className="bg-navy-900 text-white">
                      {l.native}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-navy-800 transition"
                  title={t.btnSkip}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Title */}
            <h3 className="font-black text-sm sm:text-base text-white leading-snug flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{t.steps[currentStep - 1]?.title}</span>
            </h3>

            {/* Step Description */}
            <div className="bg-navy-950/70 p-3.5 rounded-xl border border-navy-800/80">
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
                {t.steps[currentStep - 1]?.desc}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentStep(s)}
                  className={`h-1.5 rounded-full transition-all ${
                    s === currentStep
                      ? 'w-6 bg-amber-400'
                      : s < currentStep
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-navy-700'
                  }`}
                  title={`Go to Step ${s}`}
                />
              ))}
            </div>

            {/* Walkthrough Navigation Controls (Skip, Back, Next) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-navy-800 text-xs">
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white font-medium text-xs transition"
              >
                {t.btnSkip}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-lg font-semibold text-xs border border-navy-700 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{t.btnBack}</span>
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-md"
                >
                  <span>{t.btnNext}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: COMPLETION SCREEN ("You are ready") */}
        {currentStep === 8 && (
          <div className="p-6 sm:p-7 space-y-4 max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white">{t.readyTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                {t.readyDesc}
              </p>
            </div>

            <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800 text-xs text-slate-300 text-left space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Tip:</span>
              </div>
              <p className="text-[11px] text-slate-300">
                You can retake this guided tour anytime by clicking <strong>&quot;Re-take Tutorial&quot;</strong> in the top bar or <strong>&quot;Guided Portal Walkthrough&quot;</strong> on the home page.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2.5 border-t border-navy-800">
              <button
                onClick={handleBack}
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-navy-800 rounded-lg transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{t.btnBack}</span>
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setActiveView('home');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>{t.btnStart}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
