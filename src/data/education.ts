export type EducationEntry = {
  level: string;
  institution: string;
  degree?: string;
  branch?: string;
  year?: string;
  score: string;
  scoreLabel: string;
};

export const education: EducationEntry[] = [
  {
    level: "Class 10",
    institution: "Assembly of Christ School, Barrackpore",
    score: "91.75%",
    scoreLabel: "Marks",
  },
  {
    level: "Class 12",
    institution: "Assembly of Christ School, Barrackpore",
    score: "92.25%",
    scoreLabel: "Marks",
  },
  {
    level: "Undergraduate",
    institution: "Institute of Engineering and Management, Kolkata",
    degree: "Bachelor of Technology",
    branch:
      "Computer Science and Engineering (Artificial Intelligence)",
    year: "3rd Year",
    score: "9.36",
    scoreLabel: "Overall GPA",
  },
];
