import { Activity, Club, FAQ, UserStats } from "../types";

// Array of club data. In a real application, this would come from an API or context.
export const getClubData = (name: string) => {
  const clubs: Record<string, any> = {
    "table-tennis": {
      name: "Table Tennis Club",
      emoji: "🏓",
      description: "Welcome to the Table Tennis Club at Innopolis University! We are a vibrant community of players ranging from beginners to advanced competitors. Our club focuses on improving technique, strategy, and having fun while playing this amazing sport.",
      longDescription: `Our Table Tennis Club has been serving the Innopolis University community since 2018. We provide a welcoming environment for students to learn, practice, and compete in table tennis.

Whether you're picking up a paddle for the first time or you're an experienced player looking to sharpen your skills, our club offers something for everyone. We organize regular training sessions, friendly matches, and participate in inter-university tournaments.

Join us and become part of a community that values sportsmanship, improvement, and friendship through the beautiful game of table tennis!`,
      image: "/api/placeholder/600/300",
      telegram: "@tabletennis_inno",
      leaders: [
        {
          name: "Anna Mingaleva",
          email: "a.mingaleva@innopolis.university",
          telegram: "@anna_mingaleva",
          role: "President",
          bio: "Computer Science student with 5+ years of table tennis experience",
        },
        {
          name: "Dmitry Petrov",
          email: "d.petrov@innopolis.university",
          telegram: "@dmitry_petrov_tt",
          role: "Vice President",
          bio: "Former regional champion, specializes in coaching beginners",
        },
      ],
      schedule: [
        { day: "Monday", time: "18:00 - 20:00", location: "Sports Complex - Hall A" },
        { day: "Wednesday", time: "19:00 - 21:00", location: "Sports Complex - Hall A" },
        { day: "Friday", time: "17:00 - 19:00", location: "Sports Complex - Hall A" },
      ],
      achievements: ["Inter-University Championship 2023 - 2nd Place", "Regional Tournament 2023 - 3rd Place", "University Sports Day 2023 - 1st Place"],
      memberCount: 45,
      founded: "2018",
      location: "Sports Complex - Hall A",
    },
    basketball: {
      name: "Basketball Club",
      emoji: "🏀",
      description: "The Basketball Club brings together passionate players who love the game. We focus on teamwork, skill development, and competitive play in a supportive environment.",
      longDescription: `Our Basketball Club is one of the most active sports communities at Innopolis University. We welcome players of all skill levels and provide structured training programs to help everyone improve their game.

From fundamentals like shooting and dribbling to advanced tactics and team play, our experienced coaches and senior players are here to guide your basketball journey. We compete in local leagues and organize exciting tournaments throughout the year.`,
      image: "/api/placeholder/600/300",
      telegram: "@basketball_inno",
      leaders: [
        {
          name: "Michael Johnson",
          email: "m.johnson@innopolis.university",
          telegram: "@michael_johnson_bb",
          role: "Team Captain",
          bio: "Former varsity player with extensive coaching experience",
        },
      ],
      schedule: [
        { day: "Tuesday", time: "19:00 - 21:00", location: "Sports Complex - Main Court" },
        { day: "Thursday", time: "18:00 - 20:00", location: "Sports Complex - Main Court" },
        { day: "Saturday", time: "10:00 - 12:00", location: "Sports Complex - Main Court" },
      ],
      achievements: ["University League Champions 2023", "Regional Championship Participants 2023"],
      memberCount: 32,
      founded: "2019",
      location: "Sports Complex - Main Court",
    },
    swimming: {
      name: "Swimming Club",
      emoji: "🏊‍♂️",
      description: "Dive into excellence with our Swimming Club! We offer training for all strokes and distances, from recreational swimming to competitive racing.",
      longDescription: `The Swimming Club at Innopolis University provides comprehensive aquatic training in our state-of-the-art facilities. Our program covers all four competitive strokes and various training intensities.

Whether you want to improve your fitness, learn proper technique, or compete at high levels, our certified coaches will help you achieve your goals. We emphasize proper form, endurance building, and water safety.`,
      image: "/api/placeholder/600/300",
      telegram: "@swimming_inno",
      leaders: [
        {
          name: "Elena Volkova",
          email: "e.volkova@innopolis.university",
          telegram: "@elena_volkova_swim",
          role: "Head Coach",
          bio: "Certified swimming instructor with national competition experience",
        },
      ],
      schedule: [
        { day: "Monday", time: "07:00 - 08:30", location: "Aquatic Center - Pool" },
        { day: "Wednesday", time: "19:00 - 20:30", location: "Aquatic Center - Pool" },
        { day: "Friday", time: "07:00 - 08:30", location: "Aquatic Center - Pool" },
      ],
      achievements: ["Regional Swimming Championship 2023 - Multiple medals", "University Aquatic Meet 2023 - 1st Place Team"],
      memberCount: 28,
      founded: "2020",
      location: "Aquatic Center",
    },
  };

  return (
    clubs[name || ""] || {
      name: "Sport Club",
      emoji: "🏃‍♂️",
      description: "A great sport club for fitness and competition.",
      longDescription: "Join our amazing sport community!",
      image: "/api/placeholder/600/300",
      telegram: "@sport_inno",
      leaders: [
        {
          name: "Sport Leader",
          email: "leader@innopolis.university",
          role: "President",
          bio: "Passionate about sports and community building",
        },
      ],
      schedule: [],
      achievements: [],
      memberCount: 20,
      founded: "2021",
      location: "Sports Complex",
    }
  );
};

// Retrieve the data for the requested club or fallback to default
export const clubs = [
  {
    id: 1,
    name: "Table Tennis Club",
    slug: "table-tennis",
    emoji: "🏓",
    description: "Master the art of table tennis with our passionate community of players. From beginners to advanced competitors, everyone is welcome!",
    memberCount: 45,
    location: "Sports Complex - Hall A",
    schedule: "Mon, Wed, Fri",
    telegram: "@tabletennis_inno",
    leader: "Anna Mingaleva",
    achievements: ["Inter-University Championship 2023 - 2nd Place", "Regional Tournament 2023 - 3rd Place"],
    gradient: "from-red-500 to-pink-600",
  },
  {
    id: 2,
    name: "Basketball Club",
    slug: "basketball",
    emoji: "🏀",
    description: "Join our dynamic basketball team and experience the thrill of teamwork, strategy, and athletic excellence on the court.",
    memberCount: 32,
    location: "Sports Complex - Main Court",
    schedule: "Tue, Thu, Sat",
    telegram: "@basketball_inno",
    leader: "Michael Johnson",
    achievements: ["University League Champions 2023", "Regional Championship Participants 2023"],
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    name: "Swimming Club",
    slug: "swimming",
    emoji: "🏊‍♂️",
    description: "Dive into our swimming community and improve your technique while building endurance and strength in the water.",
    memberCount: 28,
    location: "Aquatic Center - Pool",
    schedule: "Mon, Wed, Fri",
    telegram: "@swimming_inno",
    leader: "Elena Volkova",
    achievements: ["Regional Swimming Championship 2023 - Multiple medals", "University Aquatic Meet 2023 - 1st Place"],
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Volleyball Club",
    slug: "volleyball",
    emoji: "🏐",
    description: "Spike your way to success with our volleyball team. Build teamwork skills while having fun and staying fit.",
    memberCount: 24,
    location: "Sports Complex - Hall B",
    schedule: "Tue, Thu, Sun",
    telegram: "@volleyball_inno",
    leader: "Sofia Martinez",
    achievements: ["Regional Volleyball League 2023 - 3rd Place"],
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    id: 5,
    name: "Tennis Club",
    slug: "tennis",
    emoji: "🎾",
    description: "Perfect your serve and master the court with our tennis club. Individual and doubles play available for all skill levels.",
    memberCount: 20,
    location: "Tennis Courts - Outdoor",
    schedule: "Wed, Fri, Sat",
    telegram: "@tennis_inno",
    leader: "David Kim",
    achievements: ["University Tennis Tournament 2023 - Finalists"],
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 6,
    name: "Football Club",
    slug: "football",
    emoji: "⚽",
    description: "Score goals and build friendships with our football club. The beautiful game awaits players of all abilities.",
    memberCount: 35,
    location: "Outdoor Football Field",
    schedule: "Tue, Thu, Sat",
    telegram: "@football_inno",
    leader: "Carlos Rodriguez",
    achievements: ["Inter-University Football Cup 2023 - Semi-finalists"],
    gradient: "from-green-600 to-blue-600",
  },
];

// Mock data with weekly schedule and participant limits
export const mockWeeklyActivities: Activity[] = [
  // Monday
  { id: 1, time: "9:00 - 10:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Monday", currentParticipants: 8, maxParticipants: 8 },
  { id: 2, time: "14:00 - 15:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Monday", currentParticipants: 3, maxParticipants: 8 },
  { id: 3, time: "19:00 - 20:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Monday", currentParticipants: 6, maxParticipants: 8 },

  // Tuesday
  { id: 4, time: "9:00 - 10:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Tuesday", currentParticipants: 2, maxParticipants: 8 },
  { id: 5, time: "16:00 - 17:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Tuesday", currentParticipants: 8, maxParticipants: 8 },
  { id: 6, time: "21:00 - 22:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Tuesday", currentParticipants: 5, maxParticipants: 8 },

  // Wednesday
  { id: 7, time: "10:00 - 11:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 1, maxParticipants: 8 },
  { id: 8, time: "15:00 - 16:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 4, maxParticipants: 8 },
  { id: 9, time: "20:00 - 21:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 7, maxParticipants: 8 },

  // Thursday
  { id: 10, time: "9:00 - 10:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 0, maxParticipants: 8 },
  { id: 11, time: "17:00 - 18:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 3, maxParticipants: 8 },
  { id: 12, time: "21:00 - 22:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 6, maxParticipants: 8 },

  // Friday
  { id: 13, time: "11:00 - 12:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 2, maxParticipants: 8 },
  { id: 14, time: "16:00 - 17:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 5, maxParticipants: 8 },
  { id: 15, time: "19:00 - 20:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 8, maxParticipants: 8 },

  // Saturday
  { id: 16, time: "10:00 - 11:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Saturday", currentParticipants: 1, maxParticipants: 6 },
  { id: 17, time: "14:00 - 15:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Saturday", currentParticipants: 4, maxParticipants: 6 },
  { id: 18, time: "18:00 - 19:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Saturday", currentParticipants: 3, maxParticipants: 6 },

  // Sunday
  { id: 19, time: "11:00 - 12:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Sunday", currentParticipants: 0, maxParticipants: 6 },
  { id: 20, time: "15:00 - 16:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Sunday", currentParticipants: 2, maxParticipants: 6 },
];

export const mockWeeklyActivities2: Activity[] = [
  // Monday
  {
    id: 15,
    activity: "CrossFit",
    time: "08:00 - 09:00",
    dayOfWeek: "Monday",
    status: "free",
    maxParticipants: 10,
    currentParticipants: 4,
  },
  {
    id: 16,
    activity: "Swimming",
    time: "13:00 - 14:00",
    dayOfWeek: "Monday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 9,
  },
  {
    id: 17,
    activity: "Basketball",
    time: "19:00 - 20:30",
    dayOfWeek: "Monday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 6,
  },

  // Tuesday
  {
    id: 18,
    activity: "Badminton",
    time: "10:00 - 11:30",
    dayOfWeek: "Tuesday",
    status: "free",
    maxParticipants: 6,
    currentParticipants: 3,
  },
  {
    id: 19,
    activity: "Strength Training",
    time: "16:30 - 18:00",
    dayOfWeek: "Tuesday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 5,
  },

  // Wednesday
  {
    id: 20,
    activity: "Table Tennis",
    time: "14:00 - 15:30",
    dayOfWeek: "Wednesday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 8,
  },
  {
    id: 21,
    activity: "Rock Climbing",
    time: "17:00 - 19:00",
    dayOfWeek: "Wednesday",
    status: "free",
    maxParticipants: 6,
    currentParticipants: 2,
  },

  // Thursday
  {
    id: 22,
    activity: "Football",
    time: "15:30 - 17:00",
    dayOfWeek: "Thursday",
    status: "free",
    maxParticipants: 22,
    currentParticipants: 16,
  },
  {
    id: 23,
    activity: "Martial Arts",
    time: "18:30 - 20:00",
    dayOfWeek: "Thursday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 7,
  },

  // Friday
  {
    id: 24,
    activity: "Aqua Aerobics",
    time: "11:00 - 12:00",
    dayOfWeek: "Friday",
    status: "free",
    maxParticipants: 15,
    currentParticipants: 11,
  },
  {
    id: 25,
    activity: "Cycling",
    time: "16:00 - 17:30",
    dayOfWeek: "Friday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 8,
  },

  // Saturday
  {
    id: 26,
    activity: "Tennis Tournament",
    time: "09:00 - 12:00",
    dayOfWeek: "Saturday",
    status: "free",
    maxParticipants: 16,
    currentParticipants: 12,
  },
  {
    id: 27,
    activity: "Beach Volleyball",
    time: "15:00 - 16:30",
    dayOfWeek: "Saturday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 4,
  },

  // Sunday
  {
    id: 28,
    activity: "Running Club",
    time: "08:00 - 09:30",
    dayOfWeek: "Sunday",
    status: "free",
    maxParticipants: 20,
    currentParticipants: 13,
  },
  {
    id: 29,
    activity: "Stretching & Recovery",
    time: "18:00 - 19:00",
    dayOfWeek: "Sunday",
    status: "free",
    maxParticipants: 10,
    currentParticipants: 6,
  },
];

export const mockClubs: Club[] = [
  {
    id: 1,
    name: "Table Tennis",
    description: "Join our table tennis club for exciting matches and skill development. All levels welcome!",
    image: "/placeholder-table-tennis.jpg",
  },
  {
    id: 2,
    name: "Football",
    description: "Experience the thrill of football with our dedicated team. Regular training sessions and matches.",
    image: "/placeholder-football.jpg",
  },
  {
    id: 3,
    name: "Basketball",
    description: "Shoot hoops and improve your game with our basketball club. Team practice twice a week.",
    image: "/placeholder-basketball.jpg",
  },
  {
    id: 4,
    name: "Volleyball",
    description: "Spike, set, and serve with our volleyball team. Indoor and beach volleyball available.",
    image: "/placeholder-volleyball.jpg",
  },
];

export const mockFAQ: FAQ[] = [
  {
    id: 1,
    question: "How can I change the chosen sport?",
    answer: "Please contact the admin through the support section or visit the sports office during working hours.",
  },
  {
    id: 2,
    question: "How to get sport hours?",
    answer: "Attend training sessions regularly. Each session counts towards your sport hours requirement.",
  },
  {
    id: 3,
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking up to 2 hours before the scheduled time.",
  },
  {
    id: 4,
    question: "What should I bring to training?",
    answer: "Bring comfortable sportswear, appropriate footwear, and a water bottle. Equipment is provided by the club.",
  },
  {
    id: 5,
    question: "Are there any membership fees?",
    answer: "No, all sports activities are free for students. Just bring your student ID.",
  },
];

export const mockUserStats: UserStats = {
  fitnessTest: "Passed",
  pushUps: "50/50",
  crunches: "35/35",
  tiltFingers: "10/30",
  hours: "30/30",
};

export const mockActivities: Activity[] = [
  {
    id: 1,
    activity: "Basketball",
    time: "10:00 - 11:30",
    dayOfWeek: "Monday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 3,
  },
  {
    id: 2,
    activity: "Swimming",
    time: "14:00 - 15:00",
    dayOfWeek: "Monday",
    status: "booked",
    maxParticipants: 12,
    currentParticipants: 8,
  },
  {
    id: 3,
    activity: "Yoga",
    time: "18:00 - 19:00",
    dayOfWeek: "Monday",
    status: "free",
    maxParticipants: 15,
    currentParticipants: 12,
  },

  // Tuesday
  {
    id: 4,
    activity: "Tennis",
    time: "09:00 - 10:30",
    dayOfWeek: "Tuesday",
    status: "free",
    maxParticipants: 4,
    currentParticipants: 2,
  },
  {
    id: 5,
    activity: "Gym Training",
    time: "17:00 - 18:30",
    dayOfWeek: "Tuesday",
    status: "free",
    maxParticipants: 10,
    currentParticipants: 6,
  },

  // Wednesday
  {
    id: 6,
    activity: "Football",
    time: "16:00 - 17:30",
    dayOfWeek: "Wednesday",
    status: "booked",
    maxParticipants: 22,
    currentParticipants: 18,
  },
  {
    id: 7,
    activity: "Pilates",
    time: "19:00 - 20:00",
    dayOfWeek: "Wednesday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 8,
  },

  // Thursday
  {
    id: 8,
    activity: "Volleyball",
    time: "15:00 - 16:30",
    dayOfWeek: "Thursday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 12,
  },
  {
    id: 9,
    activity: "Boxing",
    time: "18:00 - 19:30",
    dayOfWeek: "Thursday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 4,
  },

  // Friday
  {
    id: 10,
    activity: "Swimming",
    time: "12:00 - 13:00",
    dayOfWeek: "Friday",
    status: "free",
    maxParticipants: 12,
    currentParticipants: 7,
  },
  {
    id: 11,
    activity: "Dance",
    time: "17:30 - 18:30",
    dayOfWeek: "Friday",
    status: "free",
    maxParticipants: 20,
    currentParticipants: 15,
  },

  // Saturday
  {
    id: 12,
    activity: "Basketball",
    time: "10:00 - 11:30",
    dayOfWeek: "Saturday",
    status: "free",
    maxParticipants: 8,
    currentParticipants: 5,
  },
  {
    id: 13,
    activity: "Hiking",
    time: "14:00 - 17:00",
    dayOfWeek: "Saturday",
    status: "free",
    maxParticipants: 25,
    currentParticipants: 12,
  },

  // Sunday
  {
    id: 14,
    activity: "Yoga",
    time: "11:00 - 12:00",
    dayOfWeek: "Sunday",
    status: "free",
    maxParticipants: 15,
    currentParticipants: 8,
  },
];
