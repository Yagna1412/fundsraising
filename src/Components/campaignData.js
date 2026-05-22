const campaigns = [
  {
    id: 1,
    title: "Help Children for Education",
    category: "Education",
    description: "Support school fees, books, meals, and uniforms for children.",
    detailedDescription:
      "Provide quality education to underprivileged children by covering tuition fees, school supplies, uniforms, and nutritious meals. Our program reaches 500+ students across 15 schools in rural areas.",
    goal: 50000,
    raised: 23000,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "500+ students",
    duration: "12 months",
    recipientType: "student",
    recipients: [
      {
        id: "edu-aanya",
        name: "Aanya Sharma",
        location: "Jaipur, Rajasthan",
        need: "Class 8 school fees and textbooks",
        target: 12000,
      },
      {
        id: "edu-rohan",
        name: "Rohan Kumar",
        location: "Patna, Bihar",
        need: "Uniform, transport, and exam fees",
        target: 9500,
      },
      {
        id: "edu-meena",
        name: "Meena Devi",
        location: "Dharwad, Karnataka",
        need: "STEM learning kit and tuition support",
        target: 15000,
      },
    ],
    fundAllocation: [
      { label: "School Fees", percentage: 40 },
      { label: "Books & Supplies", percentage: 30 },
      { label: "Meals & Nutrition", percentage: 20 },
      { label: "Administration", percentage: 10 },
    ],
    impact: [
      "100% school attendance rate",
      "Average grade improvement: 25%",
      "Dropout rate reduced to 5%",
    ],
  },
  {
    id: 2,
    title: "Emergency Medical Support",
    category: "Medical",
    description: "Help patients needing urgent treatment and medicines.",
    detailedDescription:
      "Provide critical emergency medical care to patients without financial resources. We partner with 8 major hospitals to offer free surgeries, treatments, and medications.",
    goal: 100000,
    raised: 65000,
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "1000+ patients",
    duration: "12 months",
    recipientType: "patient",
    recipients: [
      {
        id: "med-suresh",
        name: "Suresh Patel",
        location: "Ahmedabad, Gujarat",
        need: "Cardiac procedure support",
        target: 45000,
      },
      {
        id: "med-fathima",
        name: "Fathima Beevi",
        location: "Kochi, Kerala",
        need: "Post-surgery medicines",
        target: 18000,
      },
      {
        id: "med-arjun",
        name: "Arjun Das",
        location: "Kolkata, West Bengal",
        need: "Emergency trauma care",
        target: 32000,
      },
    ],
    fundAllocation: [
      { label: "Surgeries & Procedures", percentage: 45 },
      { label: "Medications", percentage: 25 },
      { label: "Hospital Bills", percentage: 20 },
      { label: "Transportation", percentage: 10 },
    ],
    impact: [
      "1000+ patients treated",
      "250+ surgeries completed",
      "98% survival rate",
    ],
  },
  {
    id: 3,
    title: "Disaster Relief Support",
    category: "Emergency",
    description: "Provide food, shelter, and emergency kits to affected families.",
    detailedDescription:
      "Immediate relief to disaster-affected families with food, shelter, water purification kits, and medical supplies. Rapid deployment team covers flood, earthquake, and cyclone affected areas.",
    goal: 75000,
    raised: 30000,
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "2000+ families",
    duration: "Ongoing",
    recipientType: "family",
    recipients: [
      {
        id: "relief-singh",
        name: "Singh Family",
        location: "Mandi, Himachal Pradesh",
        need: "Food and temporary shelter kit",
        target: 22000,
      },
      {
        id: "relief-lakra",
        name: "Lakra Family",
        location: "Ranchi, Jharkhand",
        need: "Emergency ration and clean water",
        target: 16000,
      },
      {
        id: "relief-mary",
        name: "Mary Household",
        location: "Chennai, Tamil Nadu",
        need: "Flood recovery essentials",
        target: 25000,
      },
    ],
    fundAllocation: [
      { label: "Food & Water", percentage: 35 },
      { label: "Temporary Shelter", percentage: 30 },
      { label: "Medical Supplies", percentage: 20 },
      { label: "Emergency Logistics", percentage: 15 },
    ],
    impact: [
      "2000+ families assisted",
      "10,000+ meals distributed",
      "500+ temporary shelters setup",
    ],
  },
  {
    id: 4,
    title: "Clean Water & Sanitation",
    category: "Health",
    description: "Install wells and provide clean drinking water access.",
    detailedDescription:
      "Build sustainable water infrastructure in villages lacking clean water sources. Each project includes well installation, water purification systems, and community training for maintenance.",
    goal: 60000,
    raised: 42000,
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "3000+ people",
    duration: "18 months",
    recipientType: "community",
    recipients: [
      {
        id: "water-bhilpura",
        name: "Bhilpura Village",
        location: "Udaipur, Rajasthan",
        need: "Hand pump repair and water testing",
        target: 28000,
      },
      {
        id: "water-kaveri",
        name: "Kaveri Nagar Colony",
        location: "Mysuru, Karnataka",
        need: "Community purifier installation",
        target: 35000,
      },
      {
        id: "water-ashapur",
        name: "Ashapur Hamlet",
        location: "Kutch, Gujarat",
        need: "Storage tank and sanitation kits",
        target: 24000,
      },
    ],
    fundAllocation: [
      { label: "Well Construction", percentage: 50 },
      { label: "Purification Systems", percentage: 25 },
      { label: "Community Training", percentage: 15 },
      { label: "Maintenance", percentage: 10 },
    ],
    impact: [
      "15 wells constructed",
      "Waterborne disease reduced by 60%",
      "200+ hours of training provided",
    ],
  },
  {
    id: 5,
    title: "Skills Training for Youth",
    category: "Employment",
    description: "Vocational training programs for unemployed youth.",
    detailedDescription:
      "Equip unemployed youth with practical skills through 6-month vocational courses in IT, tailoring, carpentry, and hospitality. Includes job placement assistance and entrepreneurship support.",
    goal: 80000,
    raised: 52000,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55e?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "300+ youth",
    duration: "24 months",
    recipientType: "trainee",
    recipients: [
      {
        id: "skill-naveen",
        name: "Naveen Jadhav",
        location: "Pune, Maharashtra",
        need: "Web development course fees",
        target: 20000,
      },
      {
        id: "skill-latha",
        name: "Latha Reddy",
        location: "Hyderabad, Telangana",
        need: "Tailoring machine and training",
        target: 17500,
      },
      {
        id: "skill-imran",
        name: "Imran Khan",
        location: "Lucknow, Uttar Pradesh",
        need: "Hospitality certification",
        target: 14500,
      },
    ],
    fundAllocation: [
      { label: "Trainer Salaries", percentage: 45 },
      { label: "Learning Materials", percentage: 25 },
      { label: "Job Placement", percentage: 20 },
      { label: "Certification", percentage: 10 },
    ],
    impact: [
      "300+ youth trained",
      "75% job placement rate",
      "Average income increase: 150%",
    ],
  },
  {
    id: 6,
    title: "Women Empowerment Program",
    category: "Social",
    description: "Microfinance and skill development for women.",
    detailedDescription:
      "Provide microloans and business training to underprivileged women to start self-employment ventures. Support includes literacy programs, financial literacy, and mentorship.",
    goal: 70000,
    raised: 38000,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "500+ women",
    duration: "24 months",
    recipientType: "entrepreneur",
    recipients: [
      {
        id: "women-sunita",
        name: "Sunita Pawar",
        location: "Nagpur, Maharashtra",
        need: "Microloan for food stall setup",
        target: 30000,
      },
      {
        id: "women-rekha",
        name: "Rekha Mandal",
        location: "Siliguri, West Bengal",
        need: "Self-help group seed capital",
        target: 26000,
      },
      {
        id: "women-jyoti",
        name: "Jyoti Nair",
        location: "Thiruvananthapuram, Kerala",
        need: "Financial literacy and inventory support",
        target: 19000,
      },
    ],
    fundAllocation: [
      { label: "Microloans", percentage: 50 },
      { label: "Business Training", percentage: 20 },
      { label: "Mentorship", percentage: 15 },
      { label: "Support Services", percentage: 15 },
    ],
    impact: [
      "500+ women empowered",
      "2000+ family members benefited",
      "Average business success rate: 85%",
    ],
  },
  {
    id: 7,
    title: "Environmental Conservation",
    category: "Environment",
    description: "Tree plantation and habitat restoration projects.",
    detailedDescription:
      "Plant trees, restore forests, and protect natural habitats. Our green initiative combats climate change while creating green jobs and improving air quality in urban and rural areas.",
    goal: 45000,
    raised: 18000,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "10,000+ trees",
    duration: "12 months",
    recipientType: "site",
    recipients: [
      {
        id: "env-aravali",
        name: "Aravali Restoration Patch",
        location: "Gurugram, Haryana",
        need: "Native saplings and soil restoration",
        target: 18000,
      },
      {
        id: "env-lake",
        name: "Hebbal Lake Buffer",
        location: "Bengaluru, Karnataka",
        need: "Habitat cleanup and planting",
        target: 21000,
      },
      {
        id: "env-school",
        name: "Green School Drive",
        location: "Indore, Madhya Pradesh",
        need: "Campus tree plantation kits",
        target: 12000,
      },
    ],
    fundAllocation: [
      { label: "Tree Planting", percentage: 40 },
      { label: "Maintenance", percentage: 30 },
      { label: "Community Education", percentage: 20 },
      { label: "Monitoring", percentage: 10 },
    ],
    impact: [
      "50,000+ trees planted",
      "100+ hectares restored",
      "2000+ community volunteers",
    ],
  },
  {
    id: 8,
    title: "Elderly Care & Support",
    category: "Welfare",
    description: "Healthcare and livelihood support for elderly citizens.",
    detailedDescription:
      "Provide comprehensive care to elderly citizens including healthcare, nutrition, social engagement, and pension support. Our centers offer medical checkups, activities, and community support.",
    goal: 55000,
    raised: 28000,
    image:
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1000&q=80",
    beneficiaries: "600+ elderly",
    duration: "12 months",
    recipientType: "senior",
    recipients: [
      {
        id: "elder-kamala",
        name: "Kamala Iyer",
        location: "Madurai, Tamil Nadu",
        need: "Monthly medicines and nutrition",
        target: 11000,
      },
      {
        id: "elder-abdul",
        name: "Abdul Rahman",
        location: "Bhopal, Madhya Pradesh",
        need: "Medical checkups and home care",
        target: 13500,
      },
      {
        id: "elder-tashi",
        name: "Tashi Dolma",
        location: "Gangtok, Sikkim",
        need: "Winter care and food support",
        target: 10000,
      },
    ],
    fundAllocation: [
      { label: "Healthcare", percentage: 40 },
      { label: "Nutrition & Food", percentage: 30 },
      { label: "Care Staff", percentage: 20 },
      { label: "Activities & Support", percentage: 10 },
    ],
    impact: [
      "600+ elderly supported",
      "1200+ medical checkups",
      "98% satisfaction rate",
    ],
  },
];

export const getCampaignById = (id) =>
  campaigns.find((campaign) => String(campaign.id) === String(id));

export const getRecipientById = (campaign, recipientId) =>
  campaign?.recipients?.find((recipient) => recipient.id === recipientId);

export default campaigns;
