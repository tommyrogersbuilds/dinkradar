import { useState, useEffect, useRef } from "react";

// ============================================
// KIT (CONVERTKIT) CONFIG — PASTE YOUR INFO HERE
// ============================================
const KIT_CONFIG = {
  apiKey: "YOUR_API_KEY_HERE",       // Kit → Settings → Developer → API Key
  formId: "YOUR_FORM_ID_HERE",      // The number from your form URL
  tags: {
    // Go to Kit → Subscribers → Tags → click each tag → grab the ID from the URL
    "beginner": "TAG_ID_HERE",
    "intermediate": "TAG_ID_HERE",
    "advanced": "TAG_ID_HERE",
    "power": "TAG_ID_HERE",
    "control": "TAG_ID_HERE",
    "all-around": "TAG_ID_HERE",
    "budget-under-100": "TAG_ID_HERE",
    "budget-100-200": "TAG_ID_HERE",
    "budget-200-plus": "TAG_ID_HERE",
  },
};

// Maps quiz answer values to Kit tag keys
const ANSWER_TO_TAG = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  power: "power",
  control: "control",
  "all-around": "all-around",
  budget: "budget-under-100",
  mid: "budget-100-200",
  premium: "budget-200-plus",
};

const BRAND = {
  yellow: "#D4FF00",
  blue: "#0B0B5C",
  blueDark: "#06062E",
  blueLight: "#1A1A8C",
  white: "#F5F5F5",
  gray: "#8A8AB0",
  grayDark: "#2A2A6A",
};

const PADDLES = [
  {
    id: 1,
    name: "JOOLA Ben Johns Hyperion CAS 16",
    brand: "JOOLA",
    price: 229,
    image: "🏓",
    weight: "8.0 oz",
    core: "Reactive Polymer",
    surface: "Carbon Abrasion Surface",
    power: 9,
    control: 7,
    spin: 9,
    tags: ["power", "advanced", "heavy", "high-spin", "premium"],
    description: "Built for aggressive players who want to dominate from the baseline. The carbon surface generates insane spin while the elongated shape adds reach and power on every drive.",
  },
  {
    id: 2,
    name: "Selkirk Vanguard Power Air Invikta",
    brand: "Selkirk",
    price: 249,
    image: "🏓",
    weight: "8.2 oz",
    core: "Polypropylene X5",
    surface: "QuadFlex 4 Layer Hybrid",
    power: 10,
    control: 6,
    spin: 8,
    tags: ["power", "advanced", "heavy", "high-spin", "premium"],
    description: "The power player's dream. Air Dynamic Throat technology reduces drag while the heavy weight transfers maximum energy into every shot. Not for the faint of heart.",
  },
  {
    id: 3,
    name: "CRBN 1X Power Series",
    brand: "CRBN",
    price: 219,
    image: "🏓",
    weight: "8.0 oz",
    core: "Polypropylene Honeycomb",
    surface: "Toray Carbon Fiber",
    power: 9,
    control: 7,
    spin: 10,
    tags: ["power", "intermediate", "medium", "high-spin", "premium"],
    description: "The spin king. CRBN's raw carbon fiber face generates more RPM than almost anything on the market. Perfect for players who want to weaponize their third shot drop.",
  },
  {
    id: 4,
    name: "Engage Pursuit Pro MX",
    brand: "Engage",
    price: 189,
    image: "🏓",
    weight: "7.8 oz",
    core: "ControlPro Polymer",
    surface: "FrictionSkin",
    power: 7,
    control: 9,
    spin: 8,
    tags: ["control", "intermediate", "medium", "mid-spin", "mid"],
    description: "A surgeon's paddle. Designed for players who win by outthinking opponents, not outmuscling them. Exceptional touch at the kitchen and pinpoint placement on every shot.",
  },
  {
    id: 5,
    name: "Selkirk SLK Halo Control XL",
    brand: "Selkirk",
    price: 109,
    image: "🏓",
    weight: "7.6 oz",
    core: "Polypropylene Rev-Core",
    surface: "T700 Raw Carbon Fiber",
    power: 6,
    control: 9,
    spin: 8,
    tags: ["control", "beginner", "light", "mid-spin", "mid"],
    description: "Incredible value for a control-first paddle. The wide body and lighter weight make it forgiving for developing players while the carbon surface still delivers solid spin.",
  },
  {
    id: 6,
    name: "HEAD Radical Tour CO",
    brand: "HEAD",
    price: 159,
    image: "🏓",
    weight: "7.9 oz",
    core: "Polypropylene",
    surface: "Carbon Textured",
    power: 8,
    control: 8,
    spin: 8,
    tags: ["all-around", "intermediate", "medium", "mid-spin", "mid"],
    description: "The do-it-all workhorse. Balanced across power, control, and spin with zero weak spots. If you play both singles and doubles, this adapts to whatever the game demands.",
  },
  {
    id: 7,
    name: "JOOLA Solaire CFS 14",
    brand: "JOOLA",
    price: 179,
    image: "🏓",
    weight: "7.7 oz",
    core: "Reactive Polymer",
    surface: "Carbon Friction Surface",
    power: 7,
    control: 8,
    spin: 9,
    tags: ["all-around", "intermediate", "light", "high-spin", "mid"],
    description: "A versatile performer that leans into spin without sacrificing control. The 14mm core gives you a larger sweet spot and softer feel at the net.",
  },
  {
    id: 8,
    name: "Paddletek Bantam EX-L Pro",
    brand: "Paddletek",
    price: 145,
    image: "🏓",
    weight: "7.6 oz",
    core: "Polypropylene Smart Response",
    surface: "Textured Composite",
    power: 6,
    control: 10,
    spin: 7,
    tags: ["control", "intermediate", "light", "low-spin", "mid"],
    description: "The ultimate dinking machine. If your game is all about patience, soft hands, and winning the kitchen battle, this paddle was made for you. Unreal touch.",
  },
  {
    id: 9,
    name: "Onix Z5 Graphite",
    brand: "Onix",
    price: 89,
    image: "🏓",
    weight: "7.5 oz",
    core: "Nomex Honeycomb",
    surface: "Graphite",
    power: 7,
    control: 7,
    spin: 6,
    tags: ["all-around", "beginner", "light", "low-spin", "budget"],
    description: "The paddle that launched a thousand pickleball careers. A proven all-around performer at a price that doesn't hurt. Great starting point to figure out your play style.",
  },
  {
    id: 10,
    name: "HEAD Radical Pro",
    brand: "HEAD",
    price: 79,
    image: "🏓",
    weight: "7.8 oz",
    core: "Polypropylene",
    surface: "Ergo Grip Composite",
    power: 7,
    control: 7,
    spin: 5,
    tags: ["all-around", "beginner", "medium", "low-spin", "budget"],
    description: "Solid build quality from a trusted brand at a beginner-friendly price. A reliable everyday paddle that lets you develop your game without breaking the bank.",
  },
  {
    id: 11,
    name: "CRBN 2X Power Series",
    brand: "CRBN",
    price: 229,
    image: "🏓",
    weight: "8.3 oz",
    core: "Polypropylene Honeycomb",
    surface: "Toray Carbon Fiber",
    power: 10,
    control: 6,
    spin: 10,
    tags: ["power", "advanced", "heavy", "high-spin", "premium"],
    description: "Maximum power meets maximum spin in a wide-body frame. Built for singles players who want to overpower opponents from every position on the court.",
  },
  {
    id: 12,
    name: "Selkirk SLK Evo Soft",
    brand: "Selkirk",
    price: 69,
    image: "🏓",
    weight: "7.4 oz",
    core: "Polypropylene Rev-Core",
    surface: "Composite FiberFlex",
    power: 5,
    control: 8,
    spin: 6,
    tags: ["control", "beginner", "light", "low-spin", "budget"],
    description: "The gentlest introduction to pickleball. Lightweight, forgiving, and affordable. Perfect for new players who want to focus on learning the game, not fighting the paddle.",
  },
];

const QUESTIONS = [
  {
    id: "skill",
    question: "What's your skill level?",
    subtitle: "Be honest — we'll match accordingly.",
    options: [
      { label: "Beginner", value: "beginner", icon: "🌱" },
      { label: "Intermediate", value: "intermediate", icon: "⚡" },
      { label: "Advanced", value: "advanced", icon: "🔥" },
    ],
  },
  {
    id: "playstyle",
    question: "What's your play style?",
    subtitle: "How do you win points?",
    options: [
      { label: "Power", sublabel: "I like to drive and smash", value: "power", icon: "💥" },
      { label: "Control", sublabel: "I play smart and place my shots", value: "control", icon: "🎯" },
      { label: "All-Around", sublabel: "A mix of both", value: "all-around", icon: "⚖️" },
    ],
  },
  {
    id: "format",
    question: "Singles or doubles?",
    subtitle: "What do you play most?",
    options: [
      { label: "Mostly Singles", value: "singles", icon: "1️⃣" },
      { label: "Mostly Doubles", value: "doubles", icon: "2️⃣" },
      { label: "Both Equally", value: "both", icon: "🔄" },
    ],
  },
  {
    id: "weakness",
    question: "What's your biggest weakness?",
    subtitle: "The right paddle can help fix it.",
    options: [
      { label: "My dink game", value: "dinks", icon: "🤏" },
      { label: "My drives & power shots", value: "drives", icon: "💨" },
      { label: "My volleys at the net", value: "volleys", icon: "🧱" },
      { label: "My serve & return", value: "serve", icon: "🎾" },
    ],
  },
  {
    id: "spin",
    question: "How important is spin to you?",
    subtitle: "Some paddles are built to rip it.",
    options: [
      { label: "Very", sublabel: "I want to rip it", value: "high-spin", icon: "🌀" },
      { label: "Somewhat", sublabel: "Nice to have", value: "mid-spin", icon: "↩️" },
      { label: "Not a priority", value: "low-spin", icon: "➡️" },
    ],
  },
  {
    id: "weight",
    question: "Lighter or heavier paddle?",
    subtitle: "Light = quick hands. Heavy = more power.",
    options: [
      { label: "Light", sublabel: "Under 7.5 oz", value: "light", icon: "🪶" },
      { label: "Medium", sublabel: "7.5 – 8.2 oz", value: "medium", icon: "⚖️" },
      { label: "Heavy", sublabel: "8.2+ oz", value: "heavy", icon: "🏋️" },
      { label: "Not sure", value: "any-weight", icon: "🤷" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget?",
    subtitle: "No wrong answer. We got picks at every price.",
    options: [
      { label: "Under $100", value: "budget", icon: "💵" },
      { label: "$100 – $200", value: "mid", icon: "💰" },
      { label: "$200+", value: "premium", icon: "💎" },
    ],
  },
];

// ============================================
// BLOG POSTS — Add new posts here
// ============================================
const BLOG_POSTS = [
  {
    id: "best-pickleball-paddles-beginners-2026",
    title: "Best Pickleball Paddles for Beginners in 2026",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "8 min read",
    excerpt: "Just starting out? These paddles will help you learn faster without breaking the bank. We tested dozens to find the best options at every price point.",
    heroEmoji: "🌱",
    content: null, // Content will be added when posts are written
  },
  {
    id: "best-pickleball-paddles-under-100",
    title: "Best Pickleball Paddles Under $100",
    category: "Budget Picks",
    date: "2026-04-01",
    readTime: "7 min read",
    excerpt: "You don't need to spend $250 to get a great paddle. These budget picks compete with paddles twice their price.",
    heroEmoji: "💵",
    content: null,
  },
  {
    id: "power-vs-control-paddles",
    title: "Power vs Control Paddles: Which One Is Right for You?",
    category: "Strategy",
    date: "2026-04-01",
    readTime: "6 min read",
    excerpt: "The biggest decision in choosing a paddle. Here's how to figure out which style matches your game.",
    heroEmoji: "⚖️",
    content: null,
  },
  {
    id: "best-paddles-for-doubles",
    title: "Best Pickleball Paddles for Doubles in 2026",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "7 min read",
    excerpt: "Doubles demands different things from your paddle. Here are the best options for dominating the kitchen with a partner.",
    heroEmoji: "👥",
    content: null,
  },
  {
    id: "best-paddles-for-spin",
    title: "Best Pickleball Paddles for Spin in 2026",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "6 min read",
    excerpt: "Want to rip nasty topspin and slices? These paddles generate the most RPM on the market.",
    heroEmoji: "🌀",
    content: null,
  },
  {
    id: "how-to-choose-pickleball-paddle",
    title: "How to Choose a Pickleball Paddle: The Complete Guide",
    category: "Education",
    date: "2026-04-01",
    readTime: "10 min read",
    excerpt: "Core thickness, surface material, weight, shape — it all matters. Here's everything you need to know before buying.",
    heroEmoji: "🎓",
    content: null,
  },
  {
    id: "best-paddles-for-tennis-players",
    title: "Best Pickleball Paddles for Tennis Players Switching Over",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "6 min read",
    excerpt: "Coming from tennis? Your instincts transfer but your paddle needs are different. Here's what works.",
    heroEmoji: "🎾",
    content: null,
  },
  {
    id: "best-paddles-for-singles",
    title: "Best Pickleball Paddles for Singles in 2026",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "6 min read",
    excerpt: "Singles is a different animal. You need power, reach, and endurance. These paddles deliver.",
    heroEmoji: "1️⃣",
    content: null,
  },
  {
    id: "pickleball-paddle-weight-guide",
    title: "Pickleball Paddle Weight Guide: Light vs Medium vs Heavy",
    category: "Education",
    date: "2026-04-01",
    readTime: "5 min read",
    excerpt: "Paddle weight affects everything — power, control, fatigue, and injury risk. Here's how to find your sweet spot.",
    heroEmoji: "🏋️",
    content: null,
  },
  {
    id: "best-paddles-for-control",
    title: "Best Pickleball Paddles for Control in 2026",
    category: "Gear Guide",
    date: "2026-04-01",
    readTime: "7 min read",
    excerpt: "Win with placement, touch, and patience. These control paddles are built for the smart player.",
    heroEmoji: "🎯",
    content: null,
  },
];

const CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))];

function scorePaddle(paddle, answers) {
  let score = 0;
  if (paddle.tags.includes(answers.playstyle)) score += 30;
  if (paddle.tags.includes(answers.skill)) score += 20;
  if (paddle.tags.includes(answers.spin)) score += 15;
  if (paddle.tags.includes(answers.budget)) score += 25;
  if (answers.weight !== "any-weight" && paddle.tags.includes(answers.weight)) score += 10;
  if (answers.weakness === "dinks" && paddle.control >= 8) score += 10;
  if (answers.weakness === "drives" && paddle.power >= 8) score += 10;
  if (answers.weakness === "volleys" && paddle.control >= 7) score += 8;
  if (answers.weakness === "serve" && paddle.power >= 7 && paddle.spin >= 7) score += 8;
  if (answers.format === "singles" && paddle.power >= 8) score += 5;
  if (answers.format === "doubles" && paddle.control >= 8) score += 5;
  return score;
}

function getRecommendations(answers) {
  const scored = PADDLES.map((p) => ({ ...p, score: scorePaddle(p, answers) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

function getPlayerProfile(answers) {
  const style = answers.playstyle === "power" ? "Power Player" : answers.playstyle === "control" ? "Court Strategist" : "Versatile All-Rounder";
  const level = answers.skill.charAt(0).toUpperCase() + answers.skill.slice(1);
  const spin = answers.spin === "high-spin" ? "spin-heavy" : answers.spin === "mid-spin" ? "moderate spin" : "flat";
  const format = answers.format === "singles" ? "singles specialist" : answers.format === "doubles" ? "doubles player" : "singles and doubles player";
  return {
    title: style,
    summary: `You're a ${level.toLowerCase()} ${style.toLowerCase()} who prefers a ${spin} game as a ${format}. ${answers.weakness === "dinks" ? "You need a paddle with better touch at the kitchen." : answers.weakness === "drives" ? "You need more firepower on your drives." : answers.weakness === "volleys" ? "You need a paddle that gives you confidence at the net." : "You need a paddle that boosts your serve game."}`,
  };
}

const RadarIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <path d="M30 45 C30 45, 22 38, 18 34 C14 30, 14 24, 18 20 C22 16, 28 16, 30 22 Z" fill={BRAND.yellow} />
    <circle cx="30" cy="28" r="6" fill={BRAND.blue} stroke={BRAND.yellow} strokeWidth="1.5" />
    <circle cx="30" cy="28" r="3" fill={BRAND.yellow} />
    <path d="M20 18 A16 16 0 0 1 40 18" stroke={BRAND.yellow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M15 12 A22 22 0 0 1 45 12" stroke={BRAND.yellow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M10 6 A28 28 0 0 1 50 6" stroke={BRAND.yellow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const ProgressBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, width: "100%", maxWidth: 400, margin: "0 auto" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: i <= current ? BRAND.yellow : BRAND.grayDark,
          transition: "background 0.4s ease",
        }}
      />
    ))}
  </div>
);

const StatBar = ({ label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
    <span style={{ fontSize: 12, color: BRAND.gray, width: 60, fontFamily: "'Chakra Petch', sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
    <div style={{ flex: 1, height: 6, background: BRAND.grayDark, borderRadius: 3, overflow: "hidden" }}>
      <div
        style={{
          width: `${value * 10}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${BRAND.yellow}, ${BRAND.yellow}CC)`,
          borderRadius: 3,
          transition: "width 0.8s ease",
        }}
      />
    </div>
    <span style={{ fontSize: 12, color: BRAND.yellow, fontFamily: "'Chakra Petch', sans-serif", width: 24, textAlign: "right" }}>{value}</span>
  </div>
);

export default function DinkRadar() {
  const [page, setPage] = useState("home");
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [animateIn, setAnimateIn] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogFilter, setBlogFilter] = useState("All");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const transition = (callback) => {
    setAnimateIn(false);
    setTimeout(() => {
      callback();
      setAnimateIn(true);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }, 300);
  };

  const handleAnswer = (questionId, value) => {
    setSelectedOption(value);
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (quizStep < QUESTIONS.length - 1) {
        transition(() => setQuizStep(quizStep + 1));
      } else {
        const recs = getRecommendations(newAnswers);
        const prof = getPlayerProfile(newAnswers);
        setRecommendations(recs);
        setProfile(prof);
        transition(() => setPage("results"));
      }
    }, 400);
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleUnlock = async () => {
    if (!email || !firstName) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      // Build tag IDs array from quiz answers
      const tagIds = [];
      Object.values(answers).forEach((answer) => {
        const tagKey = ANSWER_TO_TAG[answer];
        if (tagKey && KIT_CONFIG.tags[tagKey] && KIT_CONFIG.tags[tagKey] !== "TAG_ID_HERE") {
          tagIds.push(parseInt(KIT_CONFIG.tags[tagKey]));
        }
      });

      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_CONFIG.formId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: KIT_CONFIG.apiKey,
            email: email,
            first_name: firstName,
            tags: tagIds,
            fields: {
              skill_level: answers.skill || "",
              play_style: answers.playstyle || "",
              format: answers.format || "",
              weakness: answers.weakness || "",
              spin_pref: answers.spin || "",
              weight_pref: answers.weight || "",
              budget: answers.budget || "",
            },
          }),
        }
      );

      if (response.ok) {
        setUnlocked(true);
      } else {
        setSubmitError("Something went wrong. Try again.");
      }
    } catch (err) {
      setSubmitError("Connection error. Try again.");
    }
    setSubmitting(false);
  };

  const resetQuiz = () => {
    transition(() => {
      setPage("home");
      setQuizStep(0);
      setAnswers({});
      setEmail("");
      setFirstName("");
      setUnlocked(false);
      setRecommendations([]);
      setProfile(null);
    });
  };

  const containerStyle = {
    minHeight: "100vh",
    background: `radial-gradient(ellipse at 20% 0%, ${BRAND.blueLight}33 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${BRAND.blueLight}22 0%, transparent 50%), ${BRAND.blueDark}`,
    color: BRAND.white,
    fontFamily: "'Outfit', sans-serif",
    overflow: "auto",
    position: "relative",
  };

  const fadeStyle = {
    opacity: animateIn ? 1 : 0,
    transform: animateIn ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  const blogPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Noise overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "16px 16px" : "20px 32px",
          position: "relative",
          zIndex: 10,
          borderBottom: `1px solid ${BRAND.grayDark}44`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, cursor: "pointer" }} onClick={resetQuiz}>
          <img src="/DinkRadar_Logo-2.png" alt="DinkRadar" style={{ width: isMobile ? 28 : 36, height: isMobile ? 28 : 36, objectFit: "contain" }} />
          <span
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? 16 : 22,
              color: BRAND.yellow,
              letterSpacing: isMobile ? 1 : 2,
              textTransform: "uppercase",
            }}
          >
            DinkRadar
          </span>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 16 : 28 }}>
          {["Quiz", "Blog", "Gear"].map((item) => (
            <span
              key={item}
              onClick={
                item === "Quiz" ? () => transition(() => { setPage("quiz"); setQuizStep(0); setAnswers({}); setUnlocked(false); }) :
                item === "Blog" ? () => transition(() => { setPage("blog"); setSelectedPost(null); }) :
                undefined
              }
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: isMobile ? 11 : 13,
                color: BRAND.gray,
                textTransform: "uppercase",
                letterSpacing: isMobile ? 1 : 2,
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = BRAND.yellow)}
              onMouseLeave={(e) => (e.target.style.color = BRAND.gray)}
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 5 }}>
        {/* ============ HOME ============ */}
        {page === "home" && (
          <div style={{ ...fadeStyle, textAlign: "center", padding: isMobile ? "40px 16px 40px" : "80px 24px 60px" }}>
            {/* Radar rings background */}
            <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", opacity: 0.06, pointerEvents: "none" }}>
              <svg width="600" height="600" viewBox="0 0 600 600">
                <circle cx="300" cy="300" r="100" stroke={BRAND.yellow} strokeWidth="1" fill="none" />
                <circle cx="300" cy="300" r="180" stroke={BRAND.yellow} strokeWidth="1" fill="none" />
                <circle cx="300" cy="300" r="260" stroke={BRAND.yellow} strokeWidth="1" fill="none" />
              </svg>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  border: `1px solid ${BRAND.yellow}44`,
                  borderRadius: 100,
                  fontSize: 12,
                  color: BRAND.yellow,
                  fontFamily: "'Chakra Petch', sans-serif",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 40,
                }}
              >
                Paddle Intelligence
              </div>

              <h1
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: "clamp(40px, 7vw, 72px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  marginBottom: 24,
                  color: BRAND.white,
                }}
              >
                Find the Paddle
                <br />
                <span style={{ color: BRAND.yellow }}>That Hits Different</span>
              </h1>

              <p
                style={{
                  fontSize: 18,
                  color: BRAND.gray,
                  maxWidth: 520,
                  margin: "0 auto 48px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                Answer 7 quick questions and we'll match you with the perfect paddle for your play style, skill level, and budget.
              </p>

              <button
                onClick={() => transition(() => setPage("quiz"))}
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "18px 48px",
                  background: BRAND.yellow,
                  color: BRAND.blue,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 0 30px ${BRAND.yellow}33`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 0 50px ${BRAND.yellow}55`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 0 30px ${BRAND.yellow}33`;
                }}
              >
                Take the Quiz
              </button>

              <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 16, opacity: 0.6 }}>
                Takes 60 seconds · Free · No BS
              </p>
            </div>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 24,
                maxWidth: 800,
                margin: "80px auto 0",
                padding: "0 16px",
              }}
            >
              {[
                { icon: "🎯", title: "Personalized Match", desc: "Not a generic list. Your play style drives the picks." },
                { icon: "🔬", title: "Data-Driven", desc: "30+ paddles scored across power, control, spin, and weight." },
                { icon: "💸", title: "Budget Smart", desc: "Great picks at every price point. No upsell tricks." },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: 28,
                    background: `${BRAND.grayDark}44`,
                    borderRadius: 12,
                    border: `1px solid ${BRAND.grayDark}88`,
                    textAlign: "left",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = BRAND.yellow + "44")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = BRAND.grayDark + "88")}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 8, color: BRAND.white }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: BRAND.gray, lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ QUIZ ============ */}
        {page === "quiz" && (
          <div style={{ ...fadeStyle, maxWidth: 560, margin: "0 auto", padding: isMobile ? "24px 16px 40px" : "40px 24px 60px" }}>
            <ProgressBar current={quizStep} total={QUESTIONS.length} />

            <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, color: BRAND.gray, fontFamily: "'Chakra Petch', sans-serif", letterSpacing: 1 }}>
              {quizStep + 1} / {QUESTIONS.length}
            </div>

            <div style={{ textAlign: "center", marginTop: 48 }}>
              <h2
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: 700,
                  marginBottom: 8,
                  color: BRAND.white,
                }}
              >
                {QUESTIONS[quizStep].question}
              </h2>
              <p style={{ fontSize: 15, color: BRAND.gray, marginBottom: 40, fontWeight: 300 }}>
                {QUESTIONS[quizStep].subtitle}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {QUESTIONS[quizStep].options.map((opt) => {
                const isSelected = selectedOption === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(QUESTIONS[quizStep].id, opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 24px",
                      background: isSelected ? `${BRAND.yellow}15` : `${BRAND.grayDark}55`,
                      border: `1.5px solid ${isSelected ? BRAND.yellow : BRAND.grayDark}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.25s ease",
                      transform: isSelected ? "scale(0.98)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = BRAND.yellow + "88";
                        e.currentTarget.style.background = `${BRAND.grayDark}88`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = BRAND.grayDark;
                        e.currentTarget.style.background = `${BRAND.grayDark}55`;
                      }
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 16, color: BRAND.white }}>{opt.label}</div>
                      {opt.sublabel && <div style={{ fontSize: 13, color: BRAND.gray, marginTop: 2, fontWeight: 300 }}>{opt.sublabel}</div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {quizStep > 0 && (
              <button
                onClick={() => transition(() => setQuizStep(quizStep - 1))}
                style={{
                  display: "block",
                  margin: "32px auto 0",
                  background: "none",
                  border: "none",
                  color: BRAND.gray,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'Chakra Petch', sans-serif",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* ============ RESULTS ============ */}
        {page === "results" && (
          <div style={{ ...fadeStyle, maxWidth: 680, margin: "0 auto", padding: isMobile ? "24px 16px 60px" : "40px 24px 80px" }}>
            {/* Profile */}
            {profile && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 48,
                  padding: "36px 28px",
                  background: `linear-gradient(135deg, ${BRAND.grayDark}66, ${BRAND.blueLight}33)`,
                  borderRadius: 16,
                  border: `1px solid ${BRAND.grayDark}`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 16px",
                    background: `${BRAND.yellow}18`,
                    border: `1px solid ${BRAND.yellow}44`,
                    borderRadius: 100,
                    fontSize: 11,
                    color: BRAND.yellow,
                    fontFamily: "'Chakra Petch', sans-serif",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Your Paddle DNA
                </div>
                <h2 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 28, fontWeight: 700, color: BRAND.yellow, marginBottom: 12 }}>
                  {profile.title}
                </h2>
                <p style={{ fontSize: 15, color: BRAND.gray, lineHeight: 1.7, maxWidth: 500, margin: "0 auto", fontWeight: 300 }}>
                  {profile.summary}
                </p>
              </div>
            )}

            {/* #1 Pick - Always visible */}
            {recommendations[0] && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: BRAND.blue,
                      background: BRAND.yellow,
                      padding: "4px 12px",
                      borderRadius: 4,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    #1 Match
                  </div>
                  <div style={{ fontSize: 13, color: BRAND.gray, fontFamily: "'Chakra Petch', sans-serif" }}>Best overall pick for you</div>
                </div>

                <PaddleCard paddle={recommendations[0]} rank={1} />
              </div>
            )}

            {/* #2 and #3 - Blurred or visible */}
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: BRAND.gray,
                    border: `1px solid ${BRAND.grayDark}`,
                    padding: "4px 12px",
                    borderRadius: 4,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  #2 & #3 Matches
                </div>
              </div>

              {!unlocked ? (
                <div style={{ position: "relative" }}>
                  {/* Blurred cards */}
                  <div style={{ filter: "blur(8px)", opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>
                    {recommendations.slice(1, 3).map((p, i) => (
                      <div key={i} style={{ marginBottom: 16 }}>
                        <PaddleCard paddle={p} rank={i + 2} />
                      </div>
                    ))}
                  </div>

                  {/* Unlock overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${BRAND.blueDark}BB`,
                      borderRadius: 16,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div style={{ textAlign: "center", padding: "32px 28px", maxWidth: 380 }}>
                      <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
                      <h3
                        style={{
                          fontFamily: "'Chakra Petch', sans-serif",
                          fontSize: 20,
                          fontWeight: 700,
                          color: BRAND.white,
                          marginBottom: 8,
                        }}
                      >
                        Unlock Your Full Results
                      </h3>
                      <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 24, fontWeight: 300, lineHeight: 1.6 }}>
                        Get your complete top 3, detailed breakdowns, and exclusive gear deals.
                      </p>

                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          background: `${BRAND.grayDark}88`,
                          border: `1px solid ${BRAND.grayDark}`,
                          borderRadius: 8,
                          color: BRAND.white,
                          fontSize: 15,
                          fontFamily: "'Outfit', sans-serif",
                          outline: "none",
                          marginBottom: 10,
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = BRAND.yellow + "88")}
                        onBlur={(e) => (e.target.style.borderColor = BRAND.grayDark)}
                      />

                      <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          background: `${BRAND.grayDark}88`,
                          border: `1px solid ${BRAND.grayDark}`,
                          borderRadius: 8,
                          color: BRAND.white,
                          fontSize: 15,
                          fontFamily: "'Outfit', sans-serif",
                          outline: "none",
                          marginBottom: 16,
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = BRAND.yellow + "88")}
                        onBlur={(e) => (e.target.style.borderColor = BRAND.grayDark)}
                      />

                      <button
                        onClick={handleUnlock}
                        disabled={!email || !firstName || submitting}
                        style={{
                          width: "100%",
                          fontFamily: "'Chakra Petch', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          padding: "16px",
                          background: email && firstName && !submitting ? BRAND.yellow : BRAND.grayDark,
                          color: email && firstName && !submitting ? BRAND.blue : BRAND.gray,
                          border: "none",
                          borderRadius: 8,
                          cursor: email && firstName && !submitting ? "pointer" : "not-allowed",
                          textTransform: "uppercase",
                          letterSpacing: 3,
                          transition: "all 0.2s",
                          opacity: submitting ? 0.7 : 1,
                        }}
                      >
                        {submitting ? "Unlocking..." : "Unlock My Results"}
                      </button>

                      {submitError && (
                        <p style={{ fontSize: 12, color: "#FF6B6B", marginTop: 8, textAlign: "center" }}>
                          {submitError}
                        </p>
                      )}

                      <p style={{ fontSize: 11, color: BRAND.gray, marginTop: 10, opacity: 0.5 }}>
                        No spam. Unsubscribe anytime.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {recommendations.slice(1, 3).map((p, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <PaddleCard paddle={p} rank={i + 2} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blog posts */}
            <div style={{ marginTop: 56 }}>
              <h3
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: BRAND.white,
                  marginBottom: 20,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Level Up Your Game
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {blogPosts.map((post, i) => (
                  <div
                    key={i}
                    onClick={() => transition(() => { setPage("blog"); setSelectedPost(post.content ? post : null); })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 20px",
                      background: `${BRAND.grayDark}44`,
                      border: `1px solid ${BRAND.grayDark}66`,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = BRAND.yellow + "44")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = BRAND.grayDark + "66")}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "'Chakra Petch', sans-serif",
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: BRAND.yellow,
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        {post.category}
                      </span>
                      <span style={{ fontSize: 15, color: BRAND.white, fontWeight: 500 }}>{post.title}</span>
                    </div>
                    <span style={{ color: BRAND.gray, fontSize: 18 }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retake */}
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <button
                onClick={resetQuiz}
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "12px 32px",
                  background: "transparent",
                  color: BRAND.gray,
                  border: `1px solid ${BRAND.grayDark}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = BRAND.yellow;
                  e.target.style.borderColor = BRAND.yellow + "44";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = BRAND.gray;
                  e.target.style.borderColor = BRAND.grayDark;
                }}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}

        {/* ============ BLOG LISTING ============ */}
        {page === "blog" && !selectedPost && (
          <div style={{ ...fadeStyle, maxWidth: 760, margin: "0 auto", padding: isMobile ? "24px 16px 60px" : "40px 24px 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 16px",
                  background: `${BRAND.yellow}18`,
                  border: `1px solid ${BRAND.yellow}44`,
                  borderRadius: 100,
                  fontSize: 11,
                  color: BRAND.yellow,
                  fontFamily: "'Chakra Petch', sans-serif",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                The Blog
              </div>
              <h1 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: isMobile ? 28 : 36, fontWeight: 700, color: BRAND.white, marginBottom: 12 }}>
                Gear Up. <span style={{ color: BRAND.yellow }}>Play Smarter.</span>
              </h1>
              <p style={{ fontSize: 15, color: BRAND.gray, fontWeight: 300, maxWidth: 500, margin: "0 auto" }}>
                Paddle reviews, strategy breakdowns, and everything you need to level up your pickleball game.
              </p>
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32, justifyContent: "center" }}>
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBlogFilter(cat)}
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "8px 16px",
                    background: blogFilter === cat ? BRAND.yellow : `${BRAND.grayDark}55`,
                    color: blogFilter === cat ? BRAND.blue : BRAND.gray,
                    border: `1px solid ${blogFilter === cat ? BRAND.yellow : BRAND.grayDark}`,
                    borderRadius: 100,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Blog post cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {BLOG_POSTS.filter((post) => blogFilter === "All" || post.category === blogFilter).map((post) => (
                <div
                  key={post.id}
                  onClick={() => { if (post.content) transition(() => setSelectedPost(post)); }}
                  style={{
                    display: "flex",
                    gap: isMobile ? 16 : 20,
                    padding: isMobile ? "20px 16px" : "24px 24px",
                    background: `${BRAND.grayDark}44`,
                    border: `1px solid ${BRAND.grayDark}66`,
                    borderRadius: 12,
                    cursor: post.content ? "pointer" : "default",
                    transition: "border-color 0.2s, transform 0.2s",
                    opacity: post.content ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => { if (post.content) { e.currentTarget.style.borderColor = BRAND.yellow + "44"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = BRAND.grayDark + "66"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{post.heroEmoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontFamily: "'Chakra Petch', sans-serif", textTransform: "uppercase", letterSpacing: 2, color: BRAND.yellow }}>{post.category}</span>
                      <span style={{ fontSize: 10, color: BRAND.gray }}>·</span>
                      <span style={{ fontSize: 10, color: BRAND.gray }}>{post.readTime}</span>
                      {!post.content && (
                        <>
                          <span style={{ fontSize: 10, color: BRAND.gray }}>·</span>
                          <span style={{ fontSize: 10, color: BRAND.yellow, fontFamily: "'Chakra Petch', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Coming Soon</span>
                        </>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: isMobile ? 15 : 17, fontWeight: 700, color: BRAND.white, margin: "0 0 8px 0", lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: BRAND.gray, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{post.excerpt}</p>
                  </div>
                  {post.content && <span style={{ color: BRAND.gray, fontSize: 18, alignSelf: "center", flexShrink: 0 }}>→</span>}
                </div>
              ))}
            </div>

            {/* Quiz CTA */}
            <div style={{ marginTop: 48, padding: isMobile ? "28px 20px" : "36px 32px", background: `linear-gradient(135deg, ${BRAND.grayDark}66, ${BRAND.blueLight}33)`, borderRadius: 16, border: `1px solid ${BRAND.yellow}22`, textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: BRAND.white, marginBottom: 8 }}>Not Sure Which Paddle Is Right?</h3>
              <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 20, fontWeight: 300 }}>Take the 60-second quiz and get matched with your perfect paddle.</p>
              <button
                onClick={() => transition(() => { setPage("quiz"); setQuizStep(0); setAnswers({}); setUnlocked(false); })}
                style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 14, fontWeight: 700, padding: "14px 36px", background: BRAND.yellow, color: BRAND.blue, border: "none", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3 }}
              >
                Take the Quiz
              </button>
            </div>
          </div>
        )}

        {/* ============ BLOG POST ============ */}
        {page === "blog" && selectedPost && (
          <div style={{ ...fadeStyle, maxWidth: 680, margin: "0 auto", padding: isMobile ? "24px 16px 60px" : "40px 24px 80px" }}>
            <button
              onClick={() => transition(() => setSelectedPost(null))}
              style={{ background: "none", border: "none", color: BRAND.gray, fontSize: 13, cursor: "pointer", fontFamily: "'Chakra Petch', sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 24, padding: 0 }}
            >
              ← Back to Blog
            </button>

            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontFamily: "'Chakra Petch', sans-serif", textTransform: "uppercase", letterSpacing: 2, color: BRAND.yellow, padding: "4px 10px", background: `${BRAND.yellow}15`, borderRadius: 4 }}>{selectedPost.category}</span>
                <span style={{ fontSize: 12, color: BRAND.gray }}>{selectedPost.readTime}</span>
              </div>
              <h1 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: isMobile ? 24 : 32, fontWeight: 700, color: BRAND.white, lineHeight: 1.2, marginBottom: 16 }}>{selectedPost.title}</h1>
              <p style={{ fontSize: 16, color: BRAND.gray, lineHeight: 1.7, fontWeight: 300 }}>{selectedPost.excerpt}</p>
              <div style={{ height: 1, background: `${BRAND.grayDark}88`, marginTop: 24 }} />
            </div>

            {selectedPost.content ? (
              <div style={{ fontSize: 15, color: BRAND.gray, lineHeight: 1.8, fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            ) : (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
                <p style={{ fontSize: 16, color: BRAND.gray, fontWeight: 300 }}>This article is coming soon.</p>
              </div>
            )}

            <div style={{ marginTop: 48, padding: isMobile ? "28px 20px" : "36px 32px", background: `linear-gradient(135deg, ${BRAND.grayDark}66, ${BRAND.blueLight}33)`, borderRadius: 16, border: `1px solid ${BRAND.yellow}22`, textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: BRAND.white, marginBottom: 8 }}>Find Your Perfect Paddle</h3>
              <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 20, fontWeight: 300 }}>Answer 7 quick questions and get matched with the paddle that fits your game.</p>
              <button
                onClick={() => transition(() => { setPage("quiz"); setQuizStep(0); setAnswers({}); setUnlocked(false); })}
                style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 14, fontWeight: 700, padding: "14px 36px", background: BRAND.yellow, color: BRAND.blue, border: "none", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3 }}
              >
                Take the Quiz
              </button>
            </div>

            <div style={{ marginTop: 48 }}>
              <h3 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 16, fontWeight: 700, color: BRAND.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: 2 }}>Related Articles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {BLOG_POSTS.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => { if (post.content) transition(() => setSelectedPost(post)); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: `${BRAND.grayDark}44`, border: `1px solid ${BRAND.grayDark}66`, borderRadius: 8, cursor: post.content ? "pointer" : "default", opacity: post.content ? 1 : 0.6, transition: "border-color 0.2s" }}
                    onMouseEnter={(e) => { if (post.content) e.currentTarget.style.borderColor = BRAND.yellow + "44"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BRAND.grayDark + "66"; }}
                  >
                    <div>
                      <span style={{ fontSize: 10, color: BRAND.yellow, fontFamily: "'Chakra Petch', sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{post.category}</span>
                      <div style={{ fontSize: 14, color: BRAND.white, fontWeight: 500, marginTop: 2 }}>{post.title}</div>
                    </div>
                    {post.content && <span style={{ color: BRAND.gray, fontSize: 16 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px",
          borderTop: `1px solid ${BRAND.grayDark}44`,
          position: "relative",
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <img src="/DinkRadar_Logo-2.png" alt="DinkRadar" style={{ width: 24, height: 24, objectFit: "contain" }} />
          <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14, color: BRAND.yellow, letterSpacing: 2 }}>DINKRADAR</span>
        </div>
        <p style={{ fontSize: 12, color: BRAND.gray, opacity: 0.5 }}>
          © 2026 DinkRadar. Gear up. Get out. Get pickled.
        </p>
      </footer>
    </div>
  );
}

function PaddleCard({ paddle, rank }) {
  return (
    <div
      style={{
        padding: 28,
        background: `linear-gradient(135deg, ${BRAND.grayDark}66, ${BRAND.blueLight}22)`,
        border: `1px solid ${rank === 1 ? BRAND.yellow + "44" : BRAND.grayDark}`,
        borderRadius: 14,
        transition: "border-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = BRAND.yellow + "66")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = rank === 1 ? BRAND.yellow + "44" : BRAND.grayDark)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: BRAND.gray, fontFamily: "'Chakra Petch', sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            {paddle.brand}
          </div>
          <h3 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 18, fontWeight: 700, color: BRAND.white, margin: 0, lineHeight: 1.3 }}>
            {paddle.name}
          </h3>
        </div>
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: BRAND.yellow,
          }}
        >
          ${paddle.price}
        </div>
      </div>

      <p style={{ fontSize: 14, color: BRAND.gray, lineHeight: 1.7, marginBottom: 20, fontWeight: 300 }}>
        {paddle.description}
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Weight", value: paddle.weight },
          { label: "Core", value: paddle.core },
          { label: "Surface", value: paddle.surface },
        ].map((spec, i) => (
          <div key={i} style={{ fontSize: 12 }}>
            <span style={{ color: BRAND.gray, fontFamily: "'Chakra Petch', sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{spec.label}: </span>
            <span style={{ color: BRAND.white }}>{spec.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <StatBar label="Power" value={paddle.power} />
        <StatBar label="Control" value={paddle.control} />
        <StatBar label="Spin" value={paddle.spin} />
      </div>

      <button
        style={{
          width: "100%",
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          padding: "14px",
          background: rank === 1 ? BRAND.yellow : "transparent",
          color: rank === 1 ? BRAND.blue : BRAND.yellow,
          border: rank === 1 ? "none" : `1.5px solid ${BRAND.yellow}`,
          borderRadius: 8,
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: 3,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (rank !== 1) {
            e.target.style.background = BRAND.yellow;
            e.target.style.color = BRAND.blue;
          }
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          if (rank !== 1) {
            e.target.style.background = "transparent";
            e.target.style.color = BRAND.yellow;
          }
          e.target.style.transform = "translateY(0)";
        }}
      >
        Buy Now →
      </button>
    </div>
  );
}
