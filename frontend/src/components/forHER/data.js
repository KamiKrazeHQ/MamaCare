import { C } from "./theme";

export const WEEK_DATA = {
  week: 24,
  size: "cantaloupe",
  emoji: "🍈",
  trimester: 2,
  milestone: "Baby can now hear your voice and may respond to sounds!",
  progress: (24 / 40) * 100,
};

export const MOODS = ["😊", "😌", "😴", "🤢", "😰", "🥰"];
export const MOOD_LABELS = ["Happy", "Calm", "Tired", "Nauseous", "Anxious", "Loving"];
export const MOOD_MSGS = [
  "You're glowing! 🌟 Keep embracing this joy.",
  "Peace looks beautiful on you. 🕊️ Rest when you need to.",
  "Feeling tired is normal - your body is doing amazing things. 💪",
  "Nausea is tough but temporary. Ginger tea can help! 🫚",
  "It's okay to feel anxious. Take a slow breath. You've got this. 💖",
  "That love you feel? Your baby feels it too. 🥰",
];

export const DEV_FACTS = [
  {
    emoji: "👂",
    title: "Tiny Ears",
    fact: "Your baby's inner ear is now fully developed - they can sense your voice, music, and even loud sounds from outside the womb.",
  },
  {
    emoji: "🫁",
    title: "Lung Practice",
    fact: "Baby is practising breathing movements, inhaling and exhaling amniotic fluid to strengthen those little lungs for birth day.",
  },
  {
    emoji: "🧠",
    title: "Brain Waves",
    fact: "Rapid brain development is happening! Billions of neurons are forming complex connections every single day this week.",
  },
  {
    emoji: "👁️",
    title: "Blinking Eyes",
    fact: "Eyelids are fully formed and baby is beginning to open and close them - exploring light and dark inside the womb.",
  },
  {
    emoji: "🤜",
    title: "Strong Kicks",
    fact: "Movements are now strong enough for others to feel from the outside. Ask your partner to place their hand on your belly!",
  },
  {
    emoji: "💤",
    title: "Sleep Cycles",
    fact: "Baby now has distinct sleep and wake cycles - you may notice more kicks at certain times of day (often when YOU try to rest!).",
  },
  {
    emoji: "🦷",
    title: "Tooth Buds",
    fact: "All 20 primary tooth buds are already in place beneath baby's gums, waiting patiently for the next couple of years.",
  },
];

export const APPOINTMENTS = [
  {
    id: 1,
    title: "Glucose Tolerance Test",
    doctor: "Dr. Amara Osei",
    date: new Date(Date.now() + 5 * 86400000),
    location: "City Women's Clinic",
    color: C.peach,
    emoji: "🩸",
  },
  {
    id: 2,
    title: "Anatomy Ultrasound",
    doctor: "Dr. Priya Sharma",
    date: new Date(Date.now() + 14 * 86400000),
    location: "BabyView Imaging",
    color: C.sky,
    emoji: "🩻",
  },
  {
    id: 3,
    title: "Midwife Check-in",
    doctor: "Midwife Claire B.",
    date: new Date(Date.now() + 21 * 86400000),
    location: "Home Visit",
    color: C.mint,
    emoji: "🌿",
  },
];

export const BAG_SECTIONS = [
  {
    section: "For Mama",
    color: C.peach,
    emoji: "👩",
    items: [
      "Birth plan (printed 3 copies)",
      "Insurance card & ID",
      "Comfortable nightgown / robe",
      "Non-slip socks or slippers",
      "Toiletries & hair ties",
      "Phone charger & power bank",
      "Snacks for labor",
      "Pillow from home",
    ],
  },
  {
    section: "For Baby",
    color: C.lavender,
    emoji: "👶",
    items: [
      "Going-home outfit (0-3 months)",
      "Swaddle blankets (x2)",
      "Newborn diapers (x12)",
      "Baby hat & mittens",
      "Car seat (installed!)",
      "Pacifier",
    ],
  },
  {
    section: "For Partner",
    color: C.mint,
    emoji: "🤝",
    items: ["Change of clothes", "Snacks & water", "Camera / phone fully charged", "List of people to call"],
  },
];

export const AFFIRMATIONS = [
  { text: "My body is strong, wise, and perfectly made for this journey.", author: "Daily Mantra" },
  { text: "I trust my instincts. I am already the mother my baby needs.", author: "Daily Mantra" },
  { text: "Every wave of discomfort is bringing my baby closer to me.", author: "Daily Mantra" },
  { text: "I breathe in calm, I breathe out fear. I am ready.", author: "Daily Mantra" },
  { text: "Growing a human is the most extraordinary thing I have ever done.", author: "Daily Mantra" },
  { text: "My baby feels my love even now, wrapped in warmth and safety.", author: "Daily Mantra" },
  { text: "I welcome this season of transformation with grace and courage.", author: "Daily Mantra" },
];

export const MOCK_JOBS = [
  {
    id: 1,
    title: "Remote Customer Success Manager",
    company: "Bloom Tech",
    location: "Remote - USA",
    salary: "$55,000-$70,000/yr",
    type: "Full-time",
    tags: ["Remote", "Flexible Hours", "Family Leave"],
    posted: "2 days ago",
    description:
      "Join a caring team supporting customers from the comfort of home. Generous parental leave, flexible scheduling, and a deeply supportive culture.",
    logo: "🌸",
  },
  {
    id: 2,
    title: "Part-Time Content Writer",
    company: "Gentle Media Co.",
    location: "Remote - Worldwide",
    salary: "$25-$40/hr",
    type: "Part-time",
    tags: ["Remote", "Part-time", "Async"],
    posted: "1 day ago",
    description:
      "Write heartfelt content on health and wellness. Set your own hours and work asynchronously. Perfect for parents needing flexibility.",
    logo: "✍️",
  },
  {
    id: 3,
    title: "UX Researcher (Flexible Contract)",
    company: "NurtureDesign",
    location: "Remote - Europe/US",
    salary: "$45-$65/hr",
    type: "Contract",
    tags: ["Remote", "Flexible", "Contract"],
    posted: "3 days ago",
    description:
      "Conduct user research on your own schedule. Family-first company with 100% remote culture and comprehensive health benefits.",
    logo: "🔍",
  },
  {
    id: 4,
    title: "Virtual Bookkeeper",
    company: "HomeBalance Finance",
    location: "Remote - USA",
    salary: "$38,000-$52,000/yr",
    type: "Full-time",
    tags: ["Remote", "Work from Home", "Benefits"],
    posted: "5 days ago",
    description:
      "Manage accounts for small businesses from home. Flexible 6-hour days, full health coverage, and generous maternity leave.",
    logo: "📊",
  },
];

export const MOCK_GROCERIES = [
  {
    id: 1,
    name: "Organic Spinach (Baby)",
    category: "Leafy Greens",
    price: "$3.99",
    unit: "5 oz bag",
    benefit: "Iron & Folate",
    emoji: "🥬",
    store: "Whole Foods",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Wild Blueberries (Frozen)",
    category: "Fruits",
    price: "$5.49",
    unit: "16 oz bag",
    benefit: "Antioxidants",
    emoji: "🫐",
    store: "Instacart",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Greek Yogurt (Full Fat)",
    category: "Dairy",
    price: "$4.29",
    unit: "32 oz",
    benefit: "Calcium & Protein",
    emoji: "🥛",
    store: "Target",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Prenatal DHA Omega-3",
    category: "Supplements",
    price: "$18.99",
    unit: "60 softgels",
    benefit: "Brain Development",
    emoji: "💊",
    store: "CVS",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Avocados (Organic)",
    category: "Fruits",
    price: "$6.99",
    unit: "4 ct bag",
    benefit: "Healthy Fats & Folate",
    emoji: "🥑",
    store: "Instacart",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Wild Salmon Fillets",
    category: "Proteins",
    price: "$12.99",
    unit: "1 lb",
    benefit: "Omega-3 & Protein",
    emoji: "🐟",
    store: "Trader Joe's",
    rating: 4.8,
  },
];

export const JOB_FILTERS = ["All", "Remote", "Part-time", "Flexible Hours", "Contract", "Freelance"];
export const GROCERY_CATS = [
  "All",
  "Leafy Greens",
  "Fruits",
  "Dairy",
  "Proteins",
  "Vegetables",
  "Pantry",
  "Supplements",
  "Beverages",
];
