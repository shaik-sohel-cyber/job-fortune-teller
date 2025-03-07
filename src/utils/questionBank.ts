
// Different question categories
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuestionDifficulty;
  category: string;
}

// Large bank of questions across different categories
export const questionBank: Question[] = [
  // Programming Fundamentals
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by its index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "algorithms"
  },
  {
    id: 2,
    question: "Which of the following is NOT a principle of Object-Oriented Programming?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Compilation"],
    correctAnswer: 3,
    difficulty: "easy",
    category: "programming"
  },
  {
    id: 3,
    question: "What is the purpose of the 'useEffect' hook in React?",
    options: [
      "To manage state variables",
      "To perform side effects in functional components",
      "To define the component's template",
      "To handle events",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    category: "frontend"
  },
  
  // Web Development
  {
    id: 4,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "'==' compares values, '===' compares values and types",
      "'==' compares values and types, '===' compares values",
      "There is no difference",
      "'===' is used for strings, '==' is used for numbers",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 5,
    question: "What is the purpose of a JWT (JSON Web Token)?",
    options: [
      "To format JSON data for display",
      "To securely transmit information between parties as a JSON object",
      "To compress JSON data",
      "To convert JSON to XML",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "backend"
  },
  {
    id: 6,
    question: "Which HTTP method should be used for a request that doesn't change server state?",
    options: ["POST", "PUT", "GET", "DELETE"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "backend"
  },
  
  // JavaScript Concepts
  {
    id: 7,
    question: "Explain the concept of 'closures' in JavaScript.",
    options: [
      "Functions that are defined inside other functions",
      "Functions that have access to variables from their outer scope even after the outer function has finished executing",
      "Functions that are used to close the program",
      "Functions that are automatically executed",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 8,
    question: "What is the output of: console.log(typeof null)?",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 9,
    question: "What is event bubbling in JavaScript?",
    options: [
      "A way to create animated bubbles with JavaScript",
      "When an event on an element will trigger the same event on parent elements",
      "A memory management technique",
      "A method to sort elements",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "frontend"
  },
  
  // Data Structures
  {
    id: 10,
    question: "What is the time complexity of searching for an element in a balanced binary search tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "algorithms"
  },
  {
    id: 11,
    question: "Describe the difference between 'stack' and 'queue' data structures.",
    options: [
      "Stack is LIFO, queue is FIFO",
      "Stack is FIFO, queue is LIFO",
      "Stack and queue are the same",
      "Stack is used for numbers, queue is used for strings",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "algorithms"
  },
  {
    id: 12,
    question: "What data structure would you use to implement an undo feature in a text editor?",
    options: ["Queue", "Linked List", "Stack", "Hash Table"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "algorithms"
  },
  
  // System Design
  {
    id: 13,
    question: "What is the role of a load balancer in a distributed system?",
    options: [
      "To encrypt data between services",
      "To distribute network traffic across multiple servers",
      "To compress data before storage",
      "To validate user input",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "system-design"
  },
  {
    id: 14,
    question: "What is the CAP theorem in distributed systems?",
    options: [
      "Consistency, Availability, Partition tolerance - you can only have two out of three",
      "Caching, API, Protocol - the three pillars of web development",
      "Concurrency, Asynchrony, Parallelism - three ways to improve performance",
      "Create, Alter, Purge - the three basic database operations",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    category: "system-design"
  },
  {
    id: 15,
    question: "Which approach would be best for a real-time collaborative document editing system?",
    options: [
      "Batch processing with hourly updates",
      "WebSockets with operational transforms or CRDT",
      "Regular HTTP polling every 5 seconds",
      "Email notifications for changes",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "system-design"
  },
  
  // React
  {
    id: 16,
    question: "What is the role of the 'Virtual DOM' in React?",
    options: [
      "To replace the actual DOM",
      "To optimize DOM updates by minimizing direct manipulations",
      "To handle user events",
      "To manage component state",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 17,
    question: "What is a pure component in React?",
    options: [
      "A component written in pure JavaScript without JSX",
      "A component that only renders pure HTML without CSS",
      "A component that implements shouldComponentUpdate with a shallow comparison",
      "A component without any props or state",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 18,
    question: "Why are keys important when rendering lists in React?",
    options: [
      "They are required for styling list items",
      "They help React identify which items have changed, been added, or removed",
      "They determine the order of list items",
      "They are needed for accessibility reasons",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    category: "frontend"
  },
  
  // Database
  {
    id: 19,
    question: "What is a 'transaction' in a database system?",
    options: [
      "A fee paid for database usage",
      "A unit of work that is performed against a database and treated as a single unit",
      "The process of transferring data between tables",
      "A query that modifies data",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "database"
  },
  {
    id: 20,
    question: "What does ACID stand for in database systems?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Application, Control, Integrity, Database",
      "Access, Create, Insert, Delete",
      "Authentication, Certification, Identification, Decryption",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "database"
  },
  {
    id: 21,
    question: "What is a NoSQL database?",
    options: [
      "A database that doesn't use SQL at all",
      "A database designed to handle only simple queries",
      "A database that provides mechanisms for storage and retrieval of data that is modeled differently from the tabular relations used in relational databases",
      "A database specifically designed for network operations",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "database"
  },
  
  // Advanced JavaScript
  {
    id: 22,
    question: "Explain the concept of 'memoization' and how it can improve performance.",
    options: [
      "A technique to reduce memory usage",
      "A technique to cache the results of expensive function calls and return the cached result when the same inputs occur again",
      "A technique to compress code",
      "A technique to improve code readability",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "programming"
  },
  {
    id: 23,
    question: "What is the difference between 'asynchronous' and 'synchronous' execution?",
    options: [
      "Asynchronous execution blocks the program, synchronous execution does not",
      "Asynchronous execution does not block the program, synchronous execution blocks the program",
      "There is no difference",
      "Asynchronous is faster than synchronous",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "programming"
  },
  {
    id: 24,
    question: "What is the purpose of the `Promise.all()` method in JavaScript?",
    options: [
      "To execute promises one after another",
      "To wait for all promises to be resolved or for any to be rejected",
      "To create a new promise that never resolves",
      "To convert callbacks to promises",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "frontend"
  },
  
  // Design Patterns
  {
    id: 25,
    question: "Describe the SOLID principles of Object-Oriented Design.",
    options: [
      "Single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion",
      "Simple, organized, layered, integrated, detailed",
      "Structured, optimized, linked, interactive, dynamic",
      "Stable, observable, logical, intuitive, descriptive",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    category: "programming"
  },
  {
    id: 26,
    question: "What is the Observer design pattern?",
    options: [
      "A pattern that allows objects to watch what other objects are doing",
      "A pattern where one object notifies multiple dependent objects when its state changes",
      "A pattern that observes system performance",
      "A pattern for monitoring user behavior",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "programming"
  },
  {
    id: 27,
    question: "What is the Singleton design pattern?",
    options: [
      "A design pattern that restricts the instantiation of a class to a single instance",
      "A pattern for creating single-purpose classes",
      "A pattern that separates objects into individual components",
      "A pattern that ensures each object has exactly one responsibility",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "programming"
  },
  
  // Software Architecture
  {
    id: 28,
    question: "Explain the concept of 'microservices' and their advantages.",
    options: [
      "A software development approach where an application is structured as a collection of small, autonomous services, modeled around a business domain",
      "A technique to write very small pieces of code",
      "A way to reduce the size of the application",
      "A method to improve code readability",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    category: "system-design"
  },
  {
    id: 29,
    question: "What is the purpose of a Service Mesh in a microservices architecture?",
    options: [
      "To provide a visualization of services",
      "To create a dedicated layer for handling service-to-service communication for microservices applications",
      "To reduce the number of services needed",
      "To convert microservices back to a monolith when needed",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "system-design"
  },
  {
    id: 30,
    question: "What is the purpose of Containerization (e.g., Docker)?",
    options: [
      "To physically separate servers in a data center",
      "To package an application with all its dependencies into a standardized unit for software development",
      "To compress application code",
      "To divide a monolithic application into multiple parts",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "devops"
  },
  
  // Security
  {
    id: 31,
    question: "What is Cross-Site Scripting (XSS)?",
    options: [
      "A technique for optimizing scripts across different websites",
      "A security vulnerability that allows attackers to inject client-side scripts into web pages viewed by other users",
      "A method for sharing JavaScript code between different websites",
      "A way to run scripts on multiple sites simultaneously",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "security"
  },
  {
    id: 32,
    question: "What is SQL Injection?",
    options: [
      "A technique to optimize SQL queries",
      "A cyberattack that inserts malicious SQL code into a database query",
      "A method for importing SQL data",
      "A tool for generating SQL statements",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "security"
  },
  {
    id: 33,
    question: "What is a Man-in-the-Middle (MITM) attack?",
    options: [
      "An attack where someone physically stands between two computers",
      "An attack where the attacker secretly relays and possibly alters the communications between two parties",
      "An attack targeting middle management in organizations",
      "An attack that occurs in the middle of a transaction",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "security"
  },
  
  // DevOps
  {
    id: 34,
    question: "What is Continuous Integration (CI)?",
    options: [
      "The practice of integrating new team members continuously",
      "The practice of frequently merging code changes into a central repository, followed by automated builds and tests",
      "The continuous improvement of code quality",
      "The process of integrating multiple systems together",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "devops"
  },
  {
    id: 35,
    question: "What is the purpose of Kubernetes?",
    options: [
      "To write more efficient JavaScript code",
      "To create database queries",
      "To automate deployment, scaling, and management of containerized applications",
      "To debug application code",
    ],
    correctAnswer: 2,
    difficulty: "hard",
    category: "devops"
  },
  {
    id: 36,
    question: "What is Infrastructure as Code (IaC)?",
    options: [
      "Writing code directly on servers",
      "The practice of managing and provisioning infrastructure through code instead of manual processes",
      "Using infrastructure to improve code quality",
      "The code that runs on infrastructure",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "devops"
  },
  
  // Data Science
  {
    id: 37,
    question: "What is the difference between supervised and unsupervised learning?",
    options: [
      "Supervised learning requires human supervision, unsupervised does not",
      "Supervised learning uses labeled data for training, unsupervised learning doesn't use labeled data",
      "Supervised learning is for classification, unsupervised is for regression",
      "Supervised learning is more accurate than unsupervised learning",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "data-science"
  },
  {
    id: 38,
    question: "What is overfitting in machine learning?",
    options: [
      "When a model performs too well on the training data",
      "When a model learns the details and noise in the training data to the extent that it negatively impacts the performance on new data",
      "When a model doesn't fit all the data points",
      "When too much data is used for training",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "data-science"
  },
  {
    id: 39,
    question: "What is the purpose of regularization in machine learning?",
    options: [
      "To make all data points regular and uniform",
      "To prevent overfitting by adding a penalty to the loss function",
      "To regulate the learning rate",
      "To normalize the input data",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "data-science"
  },
  
  // Mobile Development
  {
    id: 40,
    question: "What is the difference between React Native and native mobile development?",
    options: [
      "React Native is only for Android, native development is for iOS",
      "React Native allows you to build mobile apps using JavaScript and React, while native development uses platform-specific languages",
      "React Native is faster than native development",
      "React Native requires less memory than native apps",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "mobile"
  },
  {
    id: 41,
    question: "What is 'code push' in mobile app development?",
    options: [
      "A technique to force users to update their apps",
      "A service that enables React Native and Cordova developers to deploy mobile app updates directly to users' devices",
      "A method to push code to a repository",
      "A way to compress code for faster download",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "mobile"
  },
  {
    id: 42,
    question: "What is the purpose of app sandboxing in mobile operating systems?",
    options: [
      "To provide a place for developers to test apps",
      "To limit app storage to a specific amount",
      "To restrict the app's access to files, data, and system resources for security purposes",
      "To improve performance by isolating apps",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "mobile"
  },
  
  // Performance Optimization
  {
    id: 43,
    question: "What is 'lazy loading' in web development?",
    options: [
      "When a developer is too lazy to optimize code",
      "A design pattern where resources are loaded only when they are needed rather than all at once",
      "A technique to make websites load slowly for better user experience",
      "A method of loading content at random intervals",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 44,
    question: "What does the 'defer' attribute do when loading JavaScript?",
    options: [
      "Prevents the script from loading",
      "Makes the script download after HTML parsing is complete",
      "Tells the browser to download the script while parsing HTML and execute it when the parsing is complete",
      "Defers all JavaScript execution until user interaction",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "frontend"
  },
  {
    id: 45,
    question: "What is the Critical Rendering Path?",
    options: [
      "The most visually important part of a website",
      "The sequence of steps the browser goes through to convert HTML, CSS, and JavaScript into actual pixels on the screen",
      "The path data takes from server to client",
      "The order in which JavaScript functions are executed",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "frontend"
  },
  
  // Product Management
  {
    id: 46,
    question: "What is a user story in Agile development?",
    options: [
      "A fictional narrative about users",
      "A short, simple description of a feature told from the perspective of the person who desires the new capability",
      "A bug report submitted by a user",
      "A testimonial from a satisfied user",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    category: "product"
  },
  {
    id: 47,
    question: "What is the purpose of a product roadmap?",
    options: [
      "To provide driving directions to product demonstrations",
      "A high-level visual summary that maps out the vision and direction of your product offering over time",
      "A detailed technical specification for developers",
      "A marketing document for customers",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    category: "product"
  },
  {
    id: 48,
    question: "What is the difference between an MVP and a prototype?",
    options: [
      "MVP is for sports, prototype is for technology",
      "MVP stands for Most Valuable Product, prototype is an early sample",
      "A prototype demonstrates functionality but isn't meant for real use; an MVP (Minimum Viable Product) is a product with just enough features to satisfy early customers and provide feedback",
      "They are different terms for the same concept",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "product"
  },
];

// Helper function to select relevant questions based on job title and difficulty
export const getRelevantQuestions = (
  jobTitle: string, 
  packageType: string,
  count: number
): Question[] => {
  // Determine relevant categories based on job title
  let relevantCategories: string[] = [];
  
  jobTitle = jobTitle.toLowerCase();
  
  if (jobTitle.includes("frontend") || jobTitle.includes("web developer")) {
    relevantCategories = ["frontend", "programming", "algorithms"];
  } else if (jobTitle.includes("backend") || jobTitle.includes("software engineer")) {
    relevantCategories = ["backend", "programming", "algorithms", "system-design", "database"];
  } else if (jobTitle.includes("fullstack")) {
    relevantCategories = ["frontend", "backend", "programming", "database"];
  } else if (jobTitle.includes("data scientist") || jobTitle.includes("data analyst")) {
    relevantCategories = ["data-science", "algorithms", "programming"];
  } else if (jobTitle.includes("product manager")) {
    relevantCategories = ["product", "system-design"];
  } else if (jobTitle.includes("devops") || jobTitle.includes("sre")) {
    relevantCategories = ["devops", "system-design", "security"];
  } else if (jobTitle.includes("mobile")) {
    relevantCategories = ["mobile", "programming", "frontend"];
  } else {
    // Default for generic or unknown job titles
    relevantCategories = ["programming", "algorithms", "frontend", "backend"];
  }
  
  // Filter questions by relevant categories
  let filteredQuestions = questionBank.filter(q => 
    relevantCategories.includes(q.category)
  );
  
  // Adjust difficulty based on package type
  let targetDifficulties: QuestionDifficulty[] = [];
  
  if (packageType === "entry") {
    targetDifficulties = ["easy", "medium"];
    // More easy than medium
    filteredQuestions = filteredQuestions.filter(q => 
      targetDifficulties.includes(q.difficulty)
    );
  } else if (packageType === "mid") {
    targetDifficulties = ["easy", "medium", "hard"];
    // More medium than easy or hard
    filteredQuestions = filteredQuestions.filter(q => 
      targetDifficulties.includes(q.difficulty)
    );
  } else if (packageType === "premium") {
    targetDifficulties = ["medium", "hard"];
    // More hard than medium
    filteredQuestions = filteredQuestions.filter(q => 
      targetDifficulties.includes(q.difficulty)
    );
  }
  
  // Shuffle and limit
  return shuffleQuestions(filteredQuestions).slice(0, count);
};

// Helper function to shuffle an array of questions
export const shuffleQuestions = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
