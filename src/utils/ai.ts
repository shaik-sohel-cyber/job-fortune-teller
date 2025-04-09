
import OpenAI from 'openai';

// Initialize OpenAI client
// In a production environment, this should be handled by a backend service
// For development purposes only:
let openai: OpenAI | null = null;

// Function to initialize OpenAI with an API key
export const initializeOpenAI = (apiKey: string) => {
  try {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
    
    // Store API key in localStorage (not recommended for production)
    localStorage.setItem('openai_api_key', apiKey);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return false;
  }
};

// Check if OpenAI is initialized
export const isOpenAIInitialized = (): boolean => {
  return !!openai || !!localStorage.getItem('openai_api_key');
};

// Get or initialize OpenAI client
export const getOpenAIClient = (): OpenAI | null => {
  if (openai) return openai;
  
  const storedApiKey = localStorage.getItem('openai_api_key');
  if (storedApiKey) {
    return new OpenAI({
      apiKey: storedApiKey,
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
  }
  
  return null;
};

// Analyze resume text
export const analyzeResume = async (resumeText: string): Promise<any> => {
  const client = getOpenAIClient();
  if (!client) throw new Error('OpenAI not initialized');

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional resume analyzer. Extract key information from this resume and provide insights on skills, experience, and job match potential."
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      analysis: response.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Resume analysis failed:', error);
    return {
      analysis: null,
      success: false,
      error: error
    };
  }
};

// Generate interview questions based on job role and resume
export const generateInterviewQuestions = async (
  role: string,
  resumeSummary: string,
  round: number,
  previousAnswers: { question: string; answer: string }[] = []
): Promise<string[]> => {
  const client = getOpenAIClient();
  if (!client) throw new Error('OpenAI not initialized');

  const roundDescriptions = {
    1: "technical skills assessment",
    2: "problem-solving abilities",
    3: "cultural fit and soft skills"
  };

  let prompt = `Generate 5 professional interview questions for a ${role} position. `;
  prompt += `This is round ${round} which focuses on ${roundDescriptions[round as keyof typeof roundDescriptions] || "general assessment"}. `;
  
  if (resumeSummary) {
    prompt += `The candidate's resume shows: ${resumeSummary}. `;
  }
  
  if (previousAnswers && previousAnswers.length > 0) {
    prompt += "Based on their previous answers: ";
    previousAnswers.forEach(qa => {
      prompt += `Q: ${qa.question} A: ${qa.answer}. `;
    });
    prompt += "Ask follow-up questions that dig deeper or explore new relevant areas.";
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate concise, challenging and relevant interview questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    // Parse the response to extract questions
    const content = response.choices[0].message.content || "";
    const questions = content
      .split(/\d+\./)
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    return questions.slice(0, 5); // Ensure we only return up to 5 questions
  } catch (error) {
    console.error('Failed to generate interview questions:', error);
    return [
      "Tell me about your experience with this technology stack.",
      "Describe a challenging project you worked on recently.",
      "How do you approach problem-solving?",
      "What are your strengths and weaknesses?",
      "Why are you interested in this position?"
    ];
  }
};

// Evaluate interview answers
export const evaluateInterviewAnswer = async (
  question: string,
  answer: string,
  role: string
): Promise<{ score: number; feedback: string }> => {
  const client = getOpenAIClient();
  if (!client) throw new Error('OpenAI not initialized');

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer for ${role} positions. Evaluate the candidate's answer to the given question. Provide a score from 1-10 and brief constructive feedback.`
        },
        {
          role: "user",
          content: `Question: ${question}\n\nAnswer: ${answer}\n\nPlease score this answer from 1-10 and provide brief feedback.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content || "";
    // Extract score using regex (assuming format like "Score: 8" or "8/10")
    const scoreMatch = content.match(/Score:?\s*(\d+)\/?\d*|(\d+)\/10/);
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 5;

    // Extract feedback (anything after the score)
    let feedback = content.replace(/Score:?\s*\d+\/?\d*|(\d+)\/10/, "").trim();
    if (!feedback) feedback = "No specific feedback provided.";

    return { score, feedback };
  } catch (error) {
    console.error('Failed to evaluate answer:', error);
    return { 
      score: 5, 
      feedback: "Unable to evaluate answer due to an error. Please try again."
    };
  }
};

// Generate final assessment and job match probability
export const generateFinalAssessment = async (
  role: string,
  resumeSummary: string,
  interviewRounds: Array<{
    questions: string[];
    answers: string[];
    scores: number[];
  }>
): Promise<{
  overallScore: number;
  strengths: string[];
  areasOfImprovement: string[];
  matchProbability: number;
  feedback: string;
}> => {
  const client = getOpenAIClient();
  if (!client) throw new Error('OpenAI not initialized');

  // Calculate average score from all rounds
  const allScores = interviewRounds.flatMap(round => round.scores);
  const avgScore = allScores.length > 0 
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
    : 0;

  // Prepare interview data for the prompt
  let interviewData = '';
  interviewRounds.forEach((round, index) => {
    interviewData += `Round ${index + 1}:\n`;
    round.questions.forEach((question, qIndex) => {
      if (round.answers[qIndex]) {
        interviewData += `Q: ${question}\nA: ${round.answers[qIndex]}\nScore: ${round.scores[qIndex] || 'N/A'}\n\n`;
      }
    });
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert hiring manager. Provide a comprehensive assessment of this candidate based on their interview performance and resume."
        },
        {
          role: "user",
          content: `Please provide a final assessment for a candidate applying for a ${role} position.
          
Resume summary: ${resumeSummary}

Interview performance:
${interviewData}

Please provide:
1. An overall score from 1-100
2. 3-5 key strengths
3. 2-3 areas for improvement
4. Match probability for this role (0-100%)
5. Brief overall feedback (2-3 sentences)`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content || "";

    // Parse the response to extract structured data
    // This is a basic implementation - could be improved with more robust parsing
    const overallScoreMatch = content.match(/overall score:?\s*(\d+)/i);
    const overallScore = overallScoreMatch ? parseInt(overallScoreMatch[1]) : Math.round(avgScore * 10);

    const strengthsMatch = content.match(/strengths:([^]*?)(?=areas|match|improvement)/is);
    const strengths = strengthsMatch 
      ? strengthsMatch[1].split(/\d+\.|\n-/).map(s => s.trim()).filter(s => s.length > 0)
      : ["Communication skills", "Technical knowledge"];

    const improvementMatch = content.match(/(?:areas for improvement|improvements):([^]*?)(?=match|probability|feedback|$)/is);
    const areasOfImprovement = improvementMatch
      ? improvementMatch[1].split(/\d+\.|\n-/).map(s => s.trim()).filter(s => s.length > 0)
      : ["Could improve specific technical skills"];

    const matchMatch = content.match(/match probability:?\s*(\d+)/i);
    const matchProbability = matchMatch ? parseInt(matchMatch[1]) : Math.round(avgScore * 10);

    const feedbackMatch = content.match(/(?:feedback|overall|assessment):([^]*?)$/is);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Candidate shows potential for the role.";

    return {
      overallScore,
      strengths,
      areasOfImprovement,
      matchProbability,
      feedback
    };
  } catch (error) {
    console.error('Failed to generate final assessment:', error);
    // Return default values if API call fails
    return {
      overallScore: Math.round(avgScore * 10),
      strengths: ["Technical knowledge", "Communication skills"],
      areasOfImprovement: ["Could improve in some technical areas"],
      matchProbability: Math.round(avgScore * 10),
      feedback: "Based on the interview, the candidate shows potential for the role."
    };
  }
};
