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
  title: " Tirupati Trip",
  tagline: "A Sacred Journey of Faith & Devotion",
  // REPLACE: Add your hero image URL here
  heroImage: "https://image2url.com/images/1766064702004-44c6eba2-ad48-45e2-aa51-767962e704da.jpg",
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
    time: "Day 1 – 03 December 2025, 09:45 PM",
    title: "Journey Begins from Charlapalli",
    description:
      "Our spiritual journey began from Charlapalli as all eight of us boarded the Tirupathy Special train (07001). The excitement was high, and we spent the journey joyfully by playing hide and seek, making the train ride memorable from the very start.",
    tags: ["Travel", "Train", "Start"],
    images: [
      "https://image2url.com/images/1766462172674-6f701d19-8a8e-41a4-b005-14708aeaff65.webp",
      "https://image2url.com/images/1766462215329-a83593a8-cd38-4d33-ab74-fcdf9a298f0a.jpg",
    ],
  },

  {
    id: "2",
    time: "Day 2 – 04 December 2025, 01:00 AM",
    title: "Arrival at Tirupati",
    description:
      "We reached Tirupati early in the morning at 1:00 AM. After arriving, we prepared ourselves for the next steps of the pilgrimage and planned our darshan and trekking schedule.",
    tags: ["Arrival", "Travel"],
    images: [
      "https://image2url.com/images/1766462289930-24ecedeb-0aaa-408a-945e-e8427a797bb6.jpg",
    ],
  },

  {
    id: "3",
    time: "Day 2 – 04 December 2025, 03:30 PM",
    title: "SSD Darshan Tickets at Vishnu Vilas",
    description:
      "We went to Vishnu Vilas to obtain SSD darshan tickets. After successfully getting the tickets, we had a simple meal of curd rice, which refreshed us after the long journey.",
    tags: ["Darshan", "Food"],
    images: [
      "https://image2url.com/images/1766462417396-aec4f3cc-94b9-4955-a0cb-f1a8abcd0573.jpg",
    ],
  },

  {
    id: "4",
    time: "Day 2 – 04 December 2025, 06:45 PM",
    title: "Alipiri Steps Climb",
    description:
      "We started climbing the Alipiri steps at 6:45 PM. Until the 2100th step, the path was completely sloped, and after that, there were long flat steps that allowed us to walk comfortably while enjoying the spiritual atmosphere.",
    tags: ["Trek", "Spiritual"],
    images: [
      "https://image2url.com/images/1766462498795-e239a44d-7622-4751-bfb0-da5fbb0adedf.jpg",
      "https://image2url.com/images/1766462553549-c96bda38-b78f-4921-a64f-bae02ccd62b9.jpg",
      "https://image2url.com/images/1766462602644-fc0dfd88-e866-4dc3-b9e1-89bc58a90924.jpg",
      "https://image2url.com/images/1766462742124-c8c34b90-d41f-46d4-b4b4-3e881dd91f01.jpg",
      "https://image2url.com/images/1766462807120-c09090f1-b7f1-485c-a1a1-af10f26e11b6.jpg",
    ],
  },

  {
    id: "5",
    time: "Day 2 – Night",
    title: "Reached Tirumala & Luggage Collection",
    description:
      "After completing the Alipiri steps and reaching Tirumala, we collected our luggage from the luggage service center using the unique ID provided earlier. We then went to the CRO office for room booking, but it was closed, so we booked lockers at Venkatadri Nilayam, had food, purchased panchas, and rested for the night.",
    tags: ["Arrival", "Luggage", "Rest"],
    images: [
      "https://image2url.com/images/1766462897181-4bb2ba8f-fe0f-4d81-869e-148532abc372.jpg",
      "https://image2url.com/images/1766462954153-0879fc8c-0f50-4a33-8eea-c2c303bc0b1e.jpg",
    ],
  },

  {
    id: "6",
    time: "Day 3 – 05 December 2025, 07:00 AM",
    title: "SSD Queue & Divine Darshan",
    description:
      "We woke up early at 5:00 AM, took bath, and wore traditional pancha and shirt for darshan. After reaching the SSD queue area, the line started at 7:00 AM. We entered the line quickly and after waiting for nearly 4 hours and 30 minutes, we finally had the blessed darshan of Lord Venkateswara.",
    tags: ["Darshan", "Highlight", "Spiritual"],
    images: [
      "https://i.ytimg.com/vi/mzQW7mPezog/maxresdefault.jpg?sqp=-oaymwEoCIAKENAF8quKqQMcGADwAQH4Ac4FgAKACooCDAgAEAEYZSBYKD4wDw==&rs=AOn4CLCBqZ13F8Bvx1cLOu4mEP98voMMwg",
      "https://image2url.com/images/1766463069408-033e4deb-bb2b-47f6-a59f-6cf91eac54f4.webp",
      "https://image2url.com/images/1766463139845-dd71ad74-4856-4a61-855b-ffe8d4382e58.jpg",
      "https://image2url.com/images/1766463175666-3ecafd1f-d6fc-40ca-a9e8-93f1f95f0dfa.jpg",
    ],
  },

  {
    id: "7",
    time: "Day 3 – 05 December 2025, Afternoon",
    title: "Temple Photos, Lunch & Laddus",
    description:
      "After darshan, we took photos inside the temple premises and had lunch at Vengamamba Anna Prasadam Hall. Later, we purchased the famous Tirupati laddus, booked a room for ₹1000, shifted our luggage to the room, and went shopping at night.",
    tags: ["Food", "Prasadam", "Shopping"],
    images: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
    ],
  },

  {
    id: "8",
    time: "Day 4 – 06 December 2025, 06:00 AM",
    title: "Varaha Swamy Darshan",
    description:
      "Early in the morning at 6:00 AM, we visited the sacred Varaha Swamy Temple and had a peaceful darshan, which marked a beautiful spiritual beginning to the day.",
    tags: ["Temple", "Darshan", "Spiritual"],
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    ],
  },

  {
    id: "9",
    time: "Day 4 – Morning to Afternoon",
    title: "Visit to the 7 Sacred Places on Seventh Hill",
    description:
      "After Varaha Swamy darshan, we booked a traveller for ₹1800 and visited all the seven sacred places located on the seventh hill of Tirumala, completing our spiritual sightseeing.",
    tags: ["Srivari Padalu","Japali Anjaneya Swamy Temple","Akasha Ganga","Papavinashanam","Silathoranam","VenuGopala Swamy Temple","Chakratheertham"],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    ],
  },

  {
    id: "10",
    time: "Day 4 – Evening",
    title: "Return Journey to Vijayawada",
    description:
      "With hearts filled with devotion and unforgettable memories, we went to the railway station and returned to Vijayawada, bringing our Tirumala journey to a peaceful conclusion.",
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
  embedUrl: "https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d497698.77314518!2d78.48370047421875!3d15.3851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e0!4m5!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sCharlapally%2C%20Hyderabad%2C%20Telangana!3m2!1d17.2403!2d78.6677!4m5!1s0x3bb55a6c1e51b3ef%3A0x2f56f7743b2c2a69!2sTirupati%2C%20Andhra%20Pradesh!3m2!1d13.6288!2d79.4192!4m5!1s0x3bb4a28d70e25009%3A0x4e4d4a9fdee0adf3!2sTirumala%2C%20Andhra%20Pradesh!3m2!1d13.6833!2d79.3500!4m5!1s0x3a35f0a29c8b2ca5%3A0x2b1e8b9c8d7e6f5a!2sVijayawada%2C%20Andhra%20Pradesh!3m2!1d16.5062!2d80.6480!4m5!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sLB%20Nagar%2C%20Hyderabad%2C%20Telangana!3m2!1d17.3616!2d78.5506!4m5!1s0x3bcb91f2a7c8d9e1%3A0x3e7d9f0e2b3c4d5e!2sMaisamma%20Guda%2C%20Hyderabad%2C%20Telangana!3m2!1d17.4500!2d78.3900!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin",
  title: "Our Sacred Pilgrimage Route",
  description: "Complete journey from Hyderabad to Tirumala and back with all sacred stops",
  totalDistance: "1,423 km",
  totalDuration: "5 Days",
};

export const routeStops: RouteStop[] = [
  {
    name: "Charlapally, Hyderabad",
    description: "Journey begins - Departure point from Hyderabad",
    day: "Day 1",
    icon: "🏠",
  },
  {
    name: "Tirupati",
    description: "Arrival at the holy city - Base for our pilgrimage",
    day: "Day 1",
    icon: "�",
  },
  {
    name: "Vishnu Vilas, Tirupati",
    description: "SSD Darshan ticket booking and curd rice meal",
    day: "Day 2",
    icon: "�",
  },
  {
    name: "Alipiri, Tirupati",
    description: "Starting point of the sacred trek to Tirumala",
    day: "Day 2",
    icon: "🥾",
  },
  {
    name: "Tirumala",
    description: "Reached the sacred seven hills - Lord Venkateswara's abode",
    day: "Day 2",
    icon: "⛰️",
  },
  {
    name: "CRO Office, Tirumala",
    description: "Central Reception Office - Accommodation arrangements",
    day: "Day 2",
    icon: "🏢",
  },
  {
    name: "Vengamamba Temple, Tirumala",
    description: "Visit to the sacred Vengamamba Mata temple",
    day: "Day 3",
    icon: "🛕",
  },
  {
    name: "Srivari Padalu, Tirumala",
    description: "Sacred footprints of Lord Venkateswara",
    day: "Day 3",
    icon: "👣",
  },
  {
    name: "Silathoranam, Tirumala",
    description: "Natural rock formation - Divine architectural wonder",
    day: "Day 3",
    icon: "🪨",
  },
  {
    name: "Japali Hanuman Temple, Tirumala",
    description: "Ancient Hanuman temple with spiritual significance",
    day: "Day 3",
    icon: "🐒",
  },
  {
    name: "Venugopala Swamy Temple, Tirumala",
    description: "Beautiful Krishna temple with serene atmosphere",
    day: "Day 3",
    icon: "🎵",
  },
  {
    name: "Papavinashanam, Tirumala",
    description: "Sacred waterfall for cleansing sins",
    day: "Day 4",
    icon: "💧",
  },
  {
    name: "Akashaganga, Tirumala",
    description: "Holy waterfall - Final sacred stop in Tirumala",
    day: "Day 4",
    icon: "🌊",
  },
  {
    name: "Vijayawada",
    description: "Transit stop on return journey",
    day: "Day 4",
    icon: "🚌",
  },
  {
    name: "LB Nagar, Hyderabad",
    description: "Approaching home - Return to Hyderabad",
    day: "Day 5",
    icon: "🏙️",
  },
  {
    name: "Secunderabad",
    description: "Railway junction - Final transit point",
    day: "Day 5",
    icon: "🚉",
  },
  {
    name: "Maisammaguda, Hyderabad",
    description: "Journey ends - Safe return home with blessed memories",
    day: "Day 5",
    icon: "🏡",
  },
];

// Trip statistics
export const tripStats = {
  totalMembers: 8,
  totalPhotos: 1000,
  daysOfJourney: 5,
  templeVisits: 15,
  totalDistance: "1423 km",
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
