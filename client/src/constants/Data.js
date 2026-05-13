import { b1, b2, b3, b4, s1, s2, s3 } from '@/constants/ImagePath.js';

export const services = [
  {
    keyValue: 1,
    title: 'The Signature Cut',
    price: '$55',
    image: s1,
    desc: 'A bespoke haircut tailored to your head shape and lifestyle, finished with a straight razor neck shave and styling.',
    features: ['PERSONAL CONSULTATION', 'HOT TOWEL FINISH'],
  },
  {
    keyValue: 2,
    title: 'Beard Sculpting',
    price: '$40',
    image: s2,
    desc: 'Precision beard shaping using shears and trimmers, including a sharp line-up with a straight razor and conditioning oil.',
    features: ['BEARD OIL TREATMENT', 'RAZOR LINE-UP'],
  },
  {
    keyValue: 3,
    title: 'Royal Shave',
    price: '$65',
    image: s3,
    desc: 'The ultimate relaxation. Multiple hot towels, pre-shave oil, thick lather, and a two-pass straight razor shave.',
    features: ['DOUBLE HOT TOWEL', 'POST-SHAVE BALM'],
  },
];

export const barbers = [
  {
    name: 'Elias Thorne',
    role: 'MASTER BARBER · 8 YRS',
    image: b1,
  },
  {
    name: 'Marcus Reid',
    role: 'MASTER BARBER · 6 YRS',
    image: b2,
  },
  {
    name: 'Leo Santos',
    role: 'SENIOR STYLIST · 5 YRS',
    image: b3,
  },
  {
    name: 'Victor Cole',
    role: 'SENIOR STYLIST · 4 YRS',
    image: b4,
  },
];

export const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'haircut', label: 'HAIRCUTS' },
  { id: 'shave', label: 'SHAVES' },
  { id: 'beard', label: 'BEARD GROOMING' },
  { id: 'spa', label: 'SPA TREATMENTS' },
  { id: 'package', label: 'PACKAGES' },
];

export const Haircuts = [
  {
    keyValue: 1,
    title: 'The Signature Cut',
    duration: '45 MINS',
    badge: 'POPULAR',
    price: '$55',
    description:
      'A bespoke haircut tailored to your face shape and lifestyle. Includes a detailed consultation, precision cut, and hot towel neck shave.',
    tags: ['CONSULTATION', 'HOT TOWEL', 'STYLING'],
  },

  {
    keyValue: 2,
    title: 'Classic Taper Fade',
    duration: '35 MINS',
    price: '$45',
    description:
      'A precision taper or fade, seamlessly blended and finished with a razor-sharp line-up.',
    tags: ['LINE-UP', 'BLENDED FADE', 'STYLING'],
  },

  {
    keyValue: 3,
    title: 'Buzz & Blade',
    duration: '25 MINS',
    price: '$35',
    description:
      'Single-length clipper cut with a sharp perimeter taper and straight-razor neck cleanup.',
    tags: ['CLIPPER CUT', 'NECK SHAVE'],
  },

  {
    keyValue: 4,
    title: "Kid's Cut",
    duration: '25 MINS',
    badge: 'UNDER 12',
    price: '$30',
    description: 'A patient, precise haircut for children under 12.',
    tags: ['CHILD-FRIENDLY', 'STYLING'],
  },
];

export const barberDetails = [
  {
    keyValue: 1,
    name: 'Elias Thorne',
    role: 'MASTER BARBER',
    experience: '8 YEARS EXPERIENCE',
    image: b1,
    bio: 'Specialist in classic gentleman cuts, skin fades, and luxury straight razor shaves.',
    skills: ['STRAIGHT RAZOR', 'SKIN FADES', 'CLASSIC CUTS'],
  },

  {
    keyValue: 2,
    name: 'Marcus Reid',
    role: 'SENIOR BARBER',
    experience: '6 YEARS EXPERIENCE',
    image: b2,
    bio: 'Known for precision beard sculpting and modern textured hairstyles.',
    skills: ['BEARD SCULPTING', 'TEXTURED STYLES', 'LINE-UPS'],
  },

  {
    keyValue: 3,
    name: 'Leo Santos',
    role: 'MASTER STYLIST',
    experience: '5 YEARS EXPERIENCE',
    image: b3,
    bio: 'Expert in modern taper fades and personalized styling consultations.',
    skills: ['TAPER FADES', 'CONSULTATIONS', 'STYLING'],
  },

  {
    keyValue: 4,
    name: 'Victor Cole',
    role: 'BARBER & GROOMING SPECIALIST',
    experience: '4 YEARS EXPERIENCE',
    image: b4,
    bio: 'Focused on luxury grooming rituals and premium beard treatments.',
    skills: ['HOT TOWEL', 'BEARD CARE', 'LUXURY GROOMING'],
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    cat: 'haircut',
    label: 'Signature Cut',
    img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    barber: 'Elias Thorne',
  },
  {
    id: 2,
    cat: 'shave',
    label: 'Royal Shave',
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
    barber: 'Marcus Reid',
  },
  {
    id: 3,
    cat: 'shop',
    label: 'Interior — Chair 1',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    barber: 'Iron & Oak',
  },
  {
    id: 4,
    cat: 'haircut',
    label: 'Taper Fade',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    barber: 'Leo Santos',
  },
  {
    id: 5,
    cat: 'beard',
    label: 'Beard Sculpting',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    barber: 'Marcus Reid',
  },
  {
    id: 6,
    cat: 'shop',
    label: 'Tools of the Trade',
    img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    barber: 'Iron & Oak',
  },
  {
    id: 7,
    cat: 'haircut',
    label: 'Classic Crop',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    barber: 'Victor Cole',
  },
  {
    id: 8,
    cat: 'shave',
    label: 'Hot Towel Shave',
    img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    barber: 'Elias Thorne',
  },
  {
    id: 9,
    cat: 'beard',
    label: 'Beard Line-Up',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    barber: 'Silas Kane',
  },
  {
    id: 10,
    cat: 'shop',
    label: 'The Waiting Area',
    img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    barber: 'Iron & Oak',
  },
  {
    id: 11,
    cat: 'haircut',
    label: 'Skin Fade',
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
    barber: 'Leo Santos',
  },
  {
    id: 12,
    cat: 'beard',
    label: 'Full Beard Groom',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    barber: 'Victor Cole',
  },
];

export const CATS = [
  { key: 'all', label: 'ALL' },
  { key: 'haircut', label: 'HAIRCUTS' },
  { key: 'shave', label: 'SHAVES' },
  { key: 'beard', label: 'BEARD' },
  { key: 'shop', label: 'THE SHOP' },
];

export const TEAM = [
  {
    name: 'Elias Thorne',
    role: 'Founder & Master Barber',
    exp: '8 YRS',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80',
    bio: 'Founded Iron & Oak in 2016 after training at the London Barbering School. Elias set out to create a space where technique meets atmosphere — a modern shop rooted in old-world craft.',
  },
  {
    name: 'Marcus Reid',
    role: 'Master Barber',
    exp: '6 YRS',
    img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
    bio: "Marcus specializes in texture cuts and beard architecture. His ability to translate a client's vision without a reference photo has earned him a devoted following.",
  },
  {
    name: 'Leo Santos',
    role: 'Senior Stylist',
    exp: '5 YRS',
    img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    bio: 'Trained at the Barbering Institute of New York, Leo brings contemporary energy to classic technique — his skin fades and curly-texture work are second to none.',
  },
  {
    name: 'Victor Cole',
    role: 'Senior Stylist',
    exp: '4 YRS',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Detail-driven and patient, Victor has built a loyal clientele through hard parts, precise line-ups, and expert scalp treatments.',
  },
];

export const VALUES = [
  {
    icon: 'Scissors',
    title: 'Craft First',
    desc: 'Every service begins with a consultation. We believe the best results come from listening, not guessing.',
  },
  {
    icon: 'Handshake',
    title: 'Brotherhood',
    desc: 'Iron & Oak is more than a barbershop. It is a community — a place where every man is welcome, respected, and at ease.',
  },
  {
    icon: 'Crown',
    title: 'Premium Only',
    desc: 'We use only the finest tools and products. From our straight razors to our pre-shave oils, quality is non-negotiable.',
  },
  {
    icon: 'ScrollText',
    title: 'Heritage Craft',
    desc: 'We respect the traditions of classic barbering while embracing modern techniques to serve the contemporary man.',
  },
];

export const APPOINTMENTS = [
  {
    id: 'IOK-88291',
    status: 'confirmed',
    service: 'Signature Cut & Shave',
    barber: 'Elias Thorne',
    barberImg: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100&q=80',
    date: 'Tuesday, Oct 29, 2024',
    time: '10:30 AM',
    duration: 90,
    price: 95,
  },
  {
    id: 'IOK-88105',
    status: 'confirmed',
    service: 'Beard Sculpting',
    barber: 'Marcus Reid',
    barberImg: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    date: 'Friday, Nov 8, 2024',
    time: '2:00 PM',
    duration: 35,
    price: 40,
  },
];

export const HISTORY = [
  {
    id: 'IOK-87902',
    status: 'completed',
    service: 'Classic Taper Fade',
    barber: 'Elias Thorne',
    date: 'Oct 24, 2024',
    price: 45,
    rated: true,
    rating: 5,
  },
  {
    id: 'IOK-87541',
    status: 'completed',
    service: 'Beard Sculpting',
    barber: 'Marcus Reid',
    date: 'Sep 10, 2024',
    price: 40,
    rated: true,
    rating: 5,
  },
  {
    id: 'IOK-87120',
    status: 'completed',
    service: 'Royal Straight Razor',
    barber: 'Elias Thorne',
    date: 'Aug 5, 2024',
    price: 65,
    rated: false,
    rating: null,
  },
  {
    id: 'IOK-86804',
    status: 'cancelled',
    service: 'Cut & Shave Combo',
    barber: 'Leo Santos',
    date: 'Jul 18, 2024',
    price: 95,
    rated: false,
    rating: null,
  },
];

export const statusColors = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
  completed: 'bg-[#ffb68c]/10 text-[#ffb68c] border-[#ffb68c]/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export const FAQ = [
  {
    q: 'Do you accept walk-ins?',
    a: 'Yes, walk-ins are always welcome. However, we recommend booking in advance to guarantee your preferred barber and time slot, especially on weekends.',
  },
  {
    q: 'How long does a typical appointment take?',
    a: 'A Signature Cut takes about 45 minutes. The Royal Shave takes 60 minutes. The Cut & Shave Combo runs 90 minutes. Spa add-ons extend your session by 15–20 minutes each.',
  },
  {
    q: "What's your cancellation policy?",
    a: "We offer free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may incur a 50% service fee to respect our barbers' time.",
  },
  {
    q: 'Do you offer gift cards?',
    a: 'Yes! Iron & Oak gift cards are available in-store and online in any denomination. They make the perfect gift for any occasion.',
  },
  {
    q: 'Is parking available?',
    a: 'Street parking is available on Industrial Avenue and surrounding blocks. The Steel District parking garage on Commerce St is a 3-minute walk and offers hourly rates.',
  },
];

export const SECTIONS = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us when you create an account, make a booking, or contact us. This includes your name, email address, phone number, and payment information. We also collect information about your appointments, preferences, and interactions with our services.

When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies installed on your device.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to process and manage your appointments, send you booking confirmations and reminders, personalise your experience at Iron & Oak, communicate with you about promotions and updates (with your consent), improve our services and website, and comply with legal obligations.

We use your booking history to make personalised service recommendations and to allow your barber to better serve you on each visit.`,
  },
  {
    title: 'Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided those parties agree to keep this information confidential.

We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.`,
  },
  {
    title: 'Cookies & Tracking',
    content: `We use cookies to enhance your experience on our site. Cookies are small files stored on your device that allow us to remember your preferences, keep you logged in, and understand how you use our site.

You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. Note that some features of our site may not function properly without cookies.`,
  },
  {
    title: 'Data Security',
    content: `We take the security of your personal information seriously. We implement appropriate technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction.

Your payment information is processed by our payment partner and is never stored on our servers. All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS technology.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide you with services. If you wish to cancel your account or request that we no longer use your information, please contact us at privacy@ironandoak.com.

We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal information at any time through your account settings. You may also request a copy of the data we hold about you, object to certain uses of your data, or withdraw consent where processing is based on consent.

To exercise any of these rights, please contact us at privacy@ironandoak.com. We will respond to all requests within 30 days.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated revision date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`,
  },
];

export const SERVICES = [
  {
    id: 'sig-cut',
    cat: 'Haircut',
    name: 'The Signature Cut',
    price: 55,
    duration: 45,
    desc: 'Bespoke cut tailored to your face shape. Includes consultation, precision cut, and hot towel neck shave.',
    tags: ['Consultation', 'Hot Towel', 'Styling'],
  },
  {
    id: 'taper',
    cat: 'Haircut',
    name: 'Classic Taper Fade',
    price: 45,
    duration: 35,
    desc: 'Precision taper or fade, seamlessly blended with razor-sharp line-up on hairline and temples.',
    tags: ['Line-Up', 'Blended Fade', 'Styling'],
  },
  {
    id: 'buzz',
    cat: 'Haircut',
    name: 'Buzz & Blade',
    price: 35,
    duration: 25,
    desc: 'Single-length clipper cut with sharp perimeter taper and eucalyptus straight-razor neck cleanup.',
    tags: ['Clipper Cut', 'Neck Shave'],
  },
  {
    id: 'kids',
    cat: 'Haircut',
    name: "Kid's Cut",
    price: 30,
    duration: 25,
    desc: 'Patient, precise haircut for children under 12. Barbers specialise in making young clients comfortable.',
    tags: ['Child-Friendly', 'Styling'],
  },
  {
    id: 'royal',
    cat: 'Shave',
    name: 'Royal Straight Razor',
    price: 65,
    duration: 60,
    desc: 'Multiple hot towels, pre-shave oil, artisan lather, and two passes for absolute perfection.',
    tags: ['Double Hot Towel', 'Pre-Shave Oil', 'Post Balm'],
  },
  {
    id: 'express',
    cat: 'Shave',
    name: 'Express Shave',
    price: 35,
    duration: 30,
    desc: 'Single-pass straight razor shave with hot towel prep and cooling balm finish.',
    tags: ['Hot Towel', 'Cooling Balm'],
  },
  {
    id: 'combo',
    cat: 'Shave',
    name: 'Cut & Shave Combo',
    price: 95,
    duration: 90,
    desc: 'Complete grooming session. Signature Cut followed by Royal Straight Razor Shave. Save $25.',
    tags: ['Save $25', 'All Inclusive'],
    popular: true,
  },
  {
    id: 'beard-sc',
    cat: 'Beard',
    name: 'Beard Sculpting',
    price: 40,
    duration: 35,
    desc: 'Complete beard reshaping including length, cheek line refinement, and conditioning oil.',
    tags: ['Beard Oil', 'Razor Line-Up'],
  },
  {
    id: 'beard-tr',
    cat: 'Beard',
    name: 'Beard Trim & Line-Up',
    price: 25,
    duration: 20,
    desc: 'Maintenance trim between full sculpting sessions. Includes clean razor line-up.',
    tags: ['Maintenance', 'Line-Up'],
  },
  {
    id: 'charcoal',
    cat: 'Spa',
    name: 'Charcoal Detox Mask',
    price: 25,
    duration: 15,
    desc: 'Deep pore cleansing charcoal mask followed by chilled hydration spray. Add-on to any service.',
    tags: ['Add-On', 'Pore Cleansing'],
  },
  {
    id: 'scalp',
    cat: 'Spa',
    name: 'Scalp Treatment',
    price: 30,
    duration: 20,
    desc: 'Invigorating scalp massage with nourishing argan oil serum.',
    tags: ['Argan Oil', 'Scalp Massage'],
  },
  {
    id: 'pkg-iron',
    cat: 'Package',
    name: 'The Iron & Oak',
    price: 110,
    duration: 95,
    desc: 'Cut + Beard Sculpting + Charcoal Mask + Complimentary Whiskey. Save $10.',
    tags: ['Most Popular', 'Save $10'],
    popular: true,
  },
  {
    id: 'pkg-royal',
    cat: 'Package',
    name: 'The Royal Treatment',
    price: 160,
    duration: 145,
    desc: 'Signature Cut + Royal Shave + Scalp & Face Treatment + Premium Spirits.',
    tags: ['Prestige', 'Save $25'],
  },
];

export const BARBERS = [
  {
    id: 'elias',
    name: 'Elias Thorne',
    role: 'Master Barber',
    chair: 1,
    rating: 4.9,
    reviews: 248,
    exp: '8 YRS',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&q=80',
    specialties: ['Precision Fade', 'Straight Razor', 'Classic Cuts'],
    available: true,
    nextSlot: '10:30 AM',
  },
  {
    id: 'marcus',
    name: 'Marcus Reid',
    role: 'Master Barber',
    chair: 2,
    rating: 4.8,
    reviews: 194,
    exp: '6 YRS',
    img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80',
    specialties: ['Texture Cuts', 'Beard Design', 'Tapers'],
    available: true,
    nextSlot: '1:00 PM',
  },
  {
    id: 'leo',
    name: 'Leo Santos',
    role: 'Senior Stylist',
    chair: 3,
    rating: 4.8,
    reviews: 162,
    exp: '5 YRS',
    img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
    specialties: ['Curly Texture', 'Skin Fade', 'Styling'],
    available: true,
    nextSlot: '11:30 AM',
  },
  {
    id: 'victor',
    name: 'Victor Cole',
    role: 'Senior Stylist',
    chair: 4,
    rating: 4.7,
    reviews: 138,
    exp: '4 YRS',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    specialties: ['Hard Part', 'Line-Up', 'Spa Treatments'],
    available: true,
    nextSlot: '2:30 PM',
  },
  {
    id: 'silas',
    name: 'Silas Kane',
    role: 'Barber',
    chair: 5,
    rating: 4.6,
    reviews: 89,
    exp: '3 YRS',
    img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&q=80',
    specialties: ['Undercut', 'Drop Fade', 'Street Style'],
    available: false,
    nextSlot: 'Tomorrow',
  },
  {
    id: 'any',
    name: 'Any Available',
    role: 'Fastest Slot',
    chair: null,
    rating: null,
    reviews: null,
    exp: null,
    img: null,
    specialties: [],
    available: true,
    nextSlot: 'Soonest',
  },
];

export const TIME_SLOTS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
];

export const DAYS = [
  {
    day: 'Mon',
    date: '28',
    month: 'Oct',
    full: 'October 28, 2026',
  },
  {
    day: 'Tue',
    date: '29',
    month: 'Oct',
    full: 'October 29, 2026',
  },
  {
    day: 'Wed',
    date: '30',
    month: 'Oct',
    full: 'October 30, 2026',
  },
  {
    day: 'Thu',
    date: '31',
    month: 'Oct',
    full: 'October 31, 2026',
  },
  {
    day: 'Fri',
    date: '1',
    month: 'Nov',
    full: 'November 1, 2026',
  },
  {
    day: 'Sat',
    date: '2',
    month: 'Nov',
    full: 'November 2, 2026',
  },
];
