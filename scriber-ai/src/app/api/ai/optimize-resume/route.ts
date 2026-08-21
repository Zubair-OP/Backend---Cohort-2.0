import { generateAiContent } from "@/lib/gemini";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userData, templateId } = body;

    if (!userData || !templateId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Missing userData or templateId" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert ATS resume writer and career optimization specialist.

Given the following raw user data, rewrite and optimize ALL text content for maximum ATS (Applicant Tracking System) compatibility while keeping it natural and professional.

TEMPLATE: ${templateId}

USER DATA:
${JSON.stringify(userData, null, 2)}

YOUR TASKS:
1. SUMMARY: Write a compelling, ATS-optimized professional summary (50-80 words). Use strong action verbs, industry keywords, and quantifiable achievements. No first-person pronouns.
2. WORK EXPERIENCE: For each work experience entry, rewrite the description as 2-4 concise bullet points (use bullet character "•"). Each bullet should start with a strong action verb, include measurable impact where possible, and contain relevant ATS keywords. Keep company names, positions, and dates EXACTLY as provided.
3. PROJECTS: For each project, rewrite the description to highlight technical impact, technologies used, and outcomes. Keep title, techStack, URLs EXACTLY as provided.
4. SKILLS: Review and return the skills list. Add 2-3 highly relevant ATS keywords if missing. Remove any irrelevant or duplicate skills.
5. PERSONAL INFO: Return EXACTLY as provided. Do NOT modify any personal information.
6. EDUCATION: Return EXACTLY as provided. Do NOT modify any education details.
7. CERTIFICATIONS: Return EXACTLY as provided.

CRITICAL RULES:
- Return ONLY valid JSON matching the exact structure below. No markdown, no code fences, no explanations.
- Do NOT invent fake data. Only optimize what the user has provided.
- If a field is empty, return it as empty (do not fill with placeholder text).
- Keep all dates, names, URLs, and factual information unchanged.

REQUIRED JSON STRUCTURE:
{
  "title": "string",
  "summary": "string",
  "personalInfo": {
    "fullname": "string",
    "email": "string",
    "mobile": "string",
    "location": "string",
    "github": "string",
    "linkedIn": "string",
    "portfolio": "string"
  },
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "githubUrl": "string",
      "liveUrl": "string",
      "techStack": ["string"]
    }
  ],
  "skills": ["string"],
  "education": [
    {
      "institute": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "certifications": ["string"]
}
`;

    const result = await generateAiContent(prompt);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "AI generation failed" },
        { status: 500 }
      );
    }

    // Parse the AI response - strip any markdown code fences if present
    let cleaned = result.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const optimizedData = JSON.parse(cleaned);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume optimized successfully",
        data: optimizedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in optimize-resume API:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to optimize resume" },
      { status: 500 }
    );
  }
}
