export type AptitudeDifficulty = "easy" | "medium" | "hard";

export interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: AptitudeDifficulty;
  category: "quantitative" | "logical" | "verbal";
}

export const aptitudeBank: AptitudeQuestion[] = [
  {
    id: 1,
    question: "If a train travels 360 km in 4 hours, what is its average speed?",
    options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "quantitative",
  },
  {
    id: 2,
    question: "What is 15% of 240?",
    options: ["24", "30", "36", "40"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "quantitative",
  },
  {
    id: 3,
    question: "A sum of money doubles itself in 8 years at simple interest. The rate of interest is:",
    options: ["8%", "10%", "12.5%", "15%"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "quantitative",
  },
  {
    id: 4,
    question: "If 3x + 7 = 22, what is x?",
    options: ["3", "5", "7", "15"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "quantitative",
  },
  {
    id: 5,
    question: "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?",
    options: ["15", "20", "25", "45"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "quantitative",
  },
  {
    id: 6,
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "48"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "logical",
  },
  {
    id: 7,
    question: "If CAT = 24, DOG = 26, what is BAT?",
    options: ["20", "22", "23", "27"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "logical",
  },
  {
    id: 8,
    question: "All roses are flowers. Some flowers fade quickly. Therefore:",
    options: [
      "All roses fade quickly",
      "Some roses fade quickly",
      "No roses fade quickly",
      "None of the above can be concluded",
    ],
    correctAnswer: 3,
    difficulty: "hard",
    category: "logical",
  },
  {
    id: 9,
    question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Mother", "Sister", "Daughter", "Grandmother"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "logical",
  },
  {
    id: 10,
    question: "Which word is the odd one out?",
    options: ["Apple", "Mango", "Carrot", "Banana"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "logical",
  },
  {
    id: 11,
    question: "Choose the synonym of 'Abundant':",
    options: ["Scarce", "Plentiful", "Empty", "Limited"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "verbal",
  },
  {
    id: 12,
    question: "Choose the antonym of 'Benevolent':",
    options: ["Kind", "Generous", "Malevolent", "Friendly"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "verbal",
  },
  {
    id: 13,
    question: "Fill in the blank: She is good ___ mathematics.",
    options: ["in", "at", "on", "with"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "verbal",
  },
  {
    id: 14,
    question: "Identify the correctly spelled word:",
    options: ["Recieve", "Receive", "Receeve", "Receeve"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "verbal",
  },
  {
    id: 15,
    question: "Choose the word that best completes the analogy: Book : Author :: Painting : ?",
    options: ["Brush", "Canvas", "Artist", "Gallery"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "verbal",
  },
  {
    id: 16,
    question: "A shopkeeper sells an item for $150 with a 25% profit. What was the cost price?",
    options: ["$100", "$112.50", "$120", "$125"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "quantitative",
  },
  {
    id: 17,
    question: "The average of 5 numbers is 27. If one number is excluded, the average becomes 25. What is the excluded number?",
    options: ["30", "33", "35", "40"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "quantitative",
  },
  {
    id: 18,
    question: "Find the missing letter: A, C, F, J, ?",
    options: ["M", "N", "O", "P"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "logical",
  },
  {
    id: 19,
    question: "If TODAY is coded as UPEBZ, how is MONDAY coded?",
    options: ["NPOEBZ", "NPMEBZ", "NPOBEZ", "NPOEAZ"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "logical",
  },
  {
    id: 20,
    question: "Choose the meaning of the idiom: 'Bite the bullet'",
    options: [
      "To be angry",
      "To face a difficult situation bravely",
      "To eat quickly",
      "To give up",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "verbal",
  },
];

export const getAptitudeQuestions = (count = 10): AptitudeQuestion[] => {
  const shuffled = [...aptitudeBank].sort(() => Math.random() - 0.5);
  // Try to balance categories
  const byCat: Record<string, AptitudeQuestion[]> = { quantitative: [], logical: [], verbal: [] };
  shuffled.forEach((q) => byCat[q.category].push(q));
  const perCat = Math.ceil(count / 3);
  const picked = [
    ...byCat.quantitative.slice(0, perCat),
    ...byCat.logical.slice(0, perCat),
    ...byCat.verbal.slice(0, perCat),
  ];
  return picked.sort(() => Math.random() - 0.5).slice(0, count);
};