export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starterCode: Record<string, string>;
}

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: "two-sum",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    description:
      "Read two integers from standard input (one per line) and print their sum.",
    inputFormat: "Two integers a and b, each on its own line.",
    outputFormat: "A single integer: a + b.",
    examples: [
      { input: "2\n3", output: "5" },
      { input: "10\n-4", output: "6" },
    ],
    testCases: [
      { input: "2\n3", expectedOutput: "5" },
      { input: "100\n200", expectedOutput: "300", hidden: true },
      { input: "-5\n5", expectedOutput: "0", hidden: true },
      { input: "999\n1", expectedOutput: "1000", hidden: true },
    ],
    starterCode: {
      javascript:
        "// Read stdin, print sum\nlet data='';\nprocess.stdin.on('data',d=>data+=d);\nprocess.stdin.on('end',()=>{\n  const [a,b]=data.trim().split('\\n').map(Number);\n  console.log(a+b);\n});\n",
      python: "a = int(input())\nb = int(input())\nprint(a + b)\n",
      java:
        "import java.util.*;\npublic class Main {\n  public static void main(String[] args){\n    Scanner s=new Scanner(System.in);\n    int a=s.nextInt(), b=s.nextInt();\n    System.out.println(a+b);\n  }\n}\n",
      cpp:
        "#include <iostream>\nusing namespace std;\nint main(){ int a,b; cin>>a>>b; cout<<a+b; return 0; }\n",
    },
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Read a single line string from input and print its reverse.",
    inputFormat: "A single line containing the string.",
    outputFormat: "The reversed string.",
    examples: [
      { input: "hello", output: "olleh" },
      { input: "JobGenisis", output: "sisineGboJ" },
    ],
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "abcd", expectedOutput: "dcba", hidden: true },
      { input: "racecar", expectedOutput: "racecar", hidden: true },
      { input: "JobGenisis", expectedOutput: "sisineGboJ", hidden: true },
    ],
    starterCode: {
      javascript:
        "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{\n  console.log(d.trim().split('').reverse().join(''));\n});\n",
      python: "s = input()\nprint(s[::-1])\n",
      java:
        "import java.util.*;\npublic class Main { public static void main(String[] a){\n  Scanner s=new Scanner(System.in);\n  System.out.println(new StringBuilder(s.nextLine()).reverse());\n}}\n",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ string s; getline(cin,s); reverse(s.begin(),s.end()); cout<<s; }\n",
    },
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz Count",
    difficulty: "Medium",
    description:
      "Given an integer N, count how many numbers from 1 to N are divisible by 3 OR 5 (inclusive). Print the count.",
    inputFormat: "A single integer N (1 <= N <= 10^6).",
    outputFormat: "Count of numbers divisible by 3 or 5.",
    examples: [
      { input: "15", output: "7", explanation: "3,5,6,9,10,12,15" },
      { input: "10", output: "5" },
    ],
    testCases: [
      { input: "15", expectedOutput: "7" },
      { input: "10", expectedOutput: "5", hidden: true },
      { input: "1", expectedOutput: "0", hidden: true },
      { input: "100", expectedOutput: "47", hidden: true },
    ],
    starterCode: {
      javascript:
        "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{\n  const n=+d.trim();let c=0;\n  for(let i=1;i<=n;i++) if(i%3===0||i%5===0) c++;\n  console.log(c);\n});\n",
      python:
        "n = int(input())\nprint(sum(1 for i in range(1, n+1) if i%3==0 or i%5==0))\n",
      java:
        "import java.util.*;\npublic class Main { public static void main(String[] a){\n  int n=new Scanner(System.in).nextInt(), c=0;\n  for(int i=1;i<=n;i++) if(i%3==0||i%5==0) c++;\n  System.out.println(c);\n}}\n",
      cpp:
        "#include <iostream>\nusing namespace std;\nint main(){ int n,c=0; cin>>n; for(int i=1;i<=n;i++) if(i%3==0||i%5==0) c++; cout<<c; }\n",
    },
  },
];

export const LANGUAGES = [
  { id: "javascript", label: "JavaScript", piston: "javascript", version: "18.15.0" },
  { id: "python", label: "Python", piston: "python", version: "3.10.0" },
  { id: "java", label: "Java", piston: "java", version: "15.0.2" },
  { id: "cpp", label: "C++", piston: "cpp", version: "10.2.0" },
] as const;

export type LangId = (typeof LANGUAGES)[number]["id"];

export function pickProblems(n = 2): CodingProblem[] {
  const arr = [...CODING_PROBLEMS].sort(() => Math.random() - 0.5);
  return arr.slice(0, n);
}