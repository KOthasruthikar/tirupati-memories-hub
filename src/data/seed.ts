// ============================================
// MY TIRUPATI TRIP - EDITABLE CONTENT FILE
// ============================================
// Replace all placeholder values below with your actual trip details.
// Images can be URLs or local paths from /public folder.

export interface SiteMeta {
  title: string;
  tagline: string;
  heroImage: string;
  heroDescription: string;
}

export interface TimelineEvent {
  id: string;
  time: string; // e.g., "Day 1 - Morning" or "6:00 AM"
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

export interface Member {
  id: string;
  name: string;
  photo: string;
  role: string;
  memory: string;
  bio: string;
  miniGallery?: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

// ============================================
// SITE METADATA - Edit these values
// ============================================
export const siteMeta: SiteMeta = {
  title: "My Tirupati Trip",
  tagline: "A Sacred Journey of Faith & Devotion",
  // REPLACE: Add your hero image URL here
  heroImage: "https://images.unsplash.com/photo-1621427638054-4f165f9a8f8f?w=1920&q=80",
  heroDescription: "Cherishing the divine moments spent at the holy abode of Lord Venkateswara. This trip was filled with spirituality, togetherness, and memories that will last a lifetime.",
};

// ============================================
// TRIP HIGHLIGHTS - Edit these bullet points
// ============================================
export const highlights: string[] = [
  "🙏 Special Darshan at Tirumala Temple",
  "🌅 Breathtaking sunrise from the hills",
  "🍛 Delicious prasadam and local cuisine",
  "🚶 Scenic trek through the sacred hills",
  "📸 Memorable moments with family & friends",
  "🎵 Soul-stirring temple music and chants",
];

// ============================================
// TIMELINE EVENTS - Edit or add more events
// ============================================
export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    time: "Day 1 - Early Morning",
    title: "Departure from Home",
    description: "Started our sacred journey early morning with prayers and excitement. The anticipation of visiting Lord Venkateswara filled everyone with joy. We carried prasadam packets and necessary items for the darshan.",
    tags: ["Travel", "Start"],
    // REPLACE: Add your actual travel photos
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    ],
  },
  {
    id: "2",
    time: "Day 1 - Afternoon",
    title: "Arrival at Tirupati",
    description: "Reached Tirupati after a scenic drive through the Eastern Ghats. Checked into our accommodation near the temple complex. The town was buzzing with devotees from all over the country.",
    tags: ["Travel", "Accommodation"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
  },
  {
    id: "3",
    time: "Day 1 - Evening",
    title: "Visit to Padmavathi Temple",
    description: "Visited the sacred Padmavathi Temple at Tiruchanoor. The evening aarti was mesmerizing. Offered prayers to Goddess Padmavathi, the divine consort of Lord Venkateswara.",
    tags: ["Darshan", "Temple"],
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80",
    ],
  },
  {
    id: "4",
    time: "Day 2 - Dawn",
    title: "Trek to Tirumala",
    description: "Embarked on the sacred trek up the seven hills. The 11km path through lush greenery was spiritually uplifting. Fellow devotees chanting 'Govinda Govinda' created an electrifying atmosphere.",
    tags: ["Trek", "Spiritual"],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
  },
  {
    id: "5",
    time: "Day 2 - Morning",
    title: "Divine Darshan",
    description: "The most awaited moment - standing before Lord Venkateswara. The golden vimanam, the divine fragrance, and the powerful presence of the Lord left us speechless. A truly life-changing experience.",
    tags: ["Darshan", "Spiritual", "Highlight"],
    images: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
      "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&q=80",
    ],
  },
  {
    id: "6",
    time: "Day 2 - Afternoon",
    title: "Temple Prasadam",
    description: "Relished the famous Tirupati laddu and Anna prasadam. The simplicity and taste of the temple food was divine. Shared meals with fellow devotees in the community dining hall.",
    tags: ["Food", "Prasadam"],
    images: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
    ],
  },
  {
    id: "7",
    time: "Day 3 - Morning",
    title: "Local Sightseeing",
    description: "Explored the beautiful Akasa Ganga waterfalls and the serene Silathoranam rock formation. Nature's beauty combined with spiritual significance made it unforgettable.",
    tags: ["Sightseeing", "Nature"],
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
  },
  {
    id: "8",
    time: "Day 3 - Evening",
    title: "Return Journey",
    description: "With hearts full of devotion and bags full of prasadam, we began our journey home. The memories of this sacred trip will forever remain etched in our hearts.",
    tags: ["Travel", "End"],
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    ],
  },
];

// ============================================
// TEAM MEMBERS - Edit with your trip members
// ============================================
export const members: Member[] = [
  {
    id: "1",
    // REPLACE: Add actual member photo
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    name: "Ramesh Kumar",
    role: "Trip Organizer",
    memory: "The trek up the seven hills was the most spiritual experience of my life.",
    bio: "Ramesh planned every detail of this sacred journey with utmost devotion. His organizational skills ensured everyone had a comfortable and memorable experience. He has been organizing family pilgrimages for over 10 years.",
    miniGallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    ],
  },
  {
    id: "2",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    name: "Lakshmi Devi",
    role: "Family Elder",
    memory: "Seeing everyone together at the temple brought tears of joy to my eyes.",
    bio: "Lakshmi Amma has been visiting Tirupati for over 40 years. Her devotion and knowledge of temple traditions guided the entire family throughout the trip.",
    miniGallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    ],
  },
  {
    id: "3",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    name: "Suresh Reddy",
    role: "Photographer",
    memory: "Captured moments that will be cherished for generations.",
    bio: "Suresh's passion for photography ensured every precious moment was captured beautifully. His photos tell the story of our spiritual journey.",
  },
  {
    id: "4",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    name: "Priya Sharma",
    role: "First-Time Visitor",
    memory: "My first darshan - an experience I will never forget!",
    bio: "Priya experienced the divine blessings of Lord Venkateswara for the first time. Her enthusiasm and wonder added a fresh perspective to our journey.",
  },
  {
    id: "5",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    name: "Venkat Rao",
    role: "Driver & Guide",
    memory: "Every pilgrimage to Tirumala feels like coming home.",
    bio: "Venkat's knowledge of the routes and local areas made our travel smooth and enjoyable. He shared interesting stories about the temple's history.",
  },
  {
    id: "6",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    name: "Ananya Krishnan",
    role: "Youth Representative",
    memory: "The sunrise view from the hills was absolutely magical!",
    bio: "Ananya represented the younger generation and was deeply moved by the spiritual atmosphere. She documented the trip on social media, inspiring others.",
  },
  {
    id: "7",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    name: "Gopal Menon",
    role: "Family Friend",
    memory: "The prasadam laddu was the highlight of my day!",
    bio: "Gopal joined the family trip as a close friend and brought joy with his humor and stories. His positive energy lifted everyone's spirits.",
  },
  {
    id: "8",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    name: "Meera Nair",
    role: "Temple Expert",
    memory: "Explaining the temple architecture to everyone was fulfilling.",
    bio: "Meera's deep knowledge of temple history and traditions enriched our understanding. She conducted mini-sessions about the significance of various rituals.",
  },
];

// ============================================
// GALLERY IMAGES - Add your trip photos
// ============================================
export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    // REPLACE: Add your actual gallery images
    url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    caption: "The majestic temple gopuram at sunset",
    category: "Temple",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80",
    caption: "Devotees offering prayers",
    category: "Darshan",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    caption: "The scenic trek path through the hills",
    category: "Trek",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    caption: "Breathtaking view of the seven hills",
    category: "Nature",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
    caption: "Traditional temple cuisine",
    category: "Food",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    caption: "Morning mist over the mountains",
    category: "Nature",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    caption: "Beautiful waterfall near the temple",
    category: "Nature",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    caption: "Our travel bus",
    category: "Travel",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    caption: "Our accommodation",
    category: "Accommodation",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    caption: "Road journey through scenic routes",
    category: "Travel",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&q=80",
    caption: "Traditional lamps at the temple",
    category: "Temple",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1621427638054-4f165f9a8f8f?w=800&q=80",
    caption: "Group photo at the entrance",
    category: "Group",
  },
];

// ============================================
// MAP CONFIGURATION
// ============================================
export interface RouteStop {
  name: string;
  description: string;
  day: string;
  icon: string;
}

export const mapConfig = {
  embedUrl: "https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d497698.7731259!2d79.29370047421875!3d13.5551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e0!4m5!1s0x3a4d4b0fef456031%3A0xab862ac823e8c407!2sChennai%2C%20Tamil%20Nadu!3m2!1d13.0826802!2d80.2707184!4m5!1s0x3bb55bba8d40c433%3A0x7b0681c2d5db4f7c!2sTiruchanoor%2C%20Andhra%20Pradesh!3m2!1d13.4607!2d79.4194!4m5!1s0x3bb55a6c1e51b3ef%3A0x2f56f7743b2c2a69!2sTirupati%2C%20Andhra%20Pradesh!3m2!1d13.6288!2d79.4192!4m5!1s0x3bb4a28d70e25009%3A0x4e4d4a9fdee0adf3!2sTirumala%2C%20Tirupati%2C%20Andhra%20Pradesh!3m2!1d13.6833!2d79.3500!4m5!1s0x3a4d4b0fef456031%3A0xab862ac823e8c407!2sChennai%2C%20Tamil%20Nadu!3m2!1d13.0826802!2d80.2707184!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin",
  title: "Our Journey Route",
  description: "The sacred path from Chennai to Tirumala and back",
  totalDistance: "280 km",
  totalDuration: "3 Days",
};

export const routeStops: RouteStop[] = [
  {
    name: "Chennai",
    description: "Starting point - Home city",
    day: "Day 1",
    icon: "🏠",
  },
  {
    name: "Tiruchanoor",
    description: "Padmavathi Temple - Evening Darshan",
    day: "Day 1",
    icon: "🛕",
  },
  {
    name: "Tirupati",
    description: "Overnight stay & preparations",
    day: "Day 1",
    icon: "🏨",
  },
  {
    name: "Tirumala (Trek)",
    description: "Sacred trek through seven hills",
    day: "Day 2",
    icon: "⛰️",
  },
  {
    name: "Sri Venkateswara Temple",
    description: "Divine Darshan - Main destination",
    day: "Day 2",
    icon: "🙏",
  },
  {
    name: "Akasa Ganga",
    description: "Holy waterfall visit",
    day: "Day 3",
    icon: "💧",
  },
  {
    name: "Chennai",
    description: "Return journey home",
    day: "Day 3",
    icon: "🏠",
  },
];

// Trip statistics
export const tripStats = {
  totalMembers: 8,
  totalPhotos: 150,
  daysOfJourney: 3,
  templeVisits: 4,
  totalDistance: "280 km",
};

// ============================================
// GALLERY CATEGORIES
// ============================================
export const galleryCategories = [
  "All",
  "Temple",
  "Darshan",
  "Trek",
  "Nature",
  "Food",
  "Travel",
  "Accommodation",
  "Group",
];

// ============================================
// AVAILABLE TIMELINE TAGS
// ============================================
export const availableTags = [
  "All",
  "Travel",
  "Darshan",
  "Temple",
  "Trek",
  "Spiritual",
  "Food",
  "Prasadam",
  "Sightseeing",
  "Nature",
  "Highlight",
  "Accommodation",
  "Start",
  "End",
];
