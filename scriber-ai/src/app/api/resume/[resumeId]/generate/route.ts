import { getCurrentUser } from "@/lib/getCurrentUser";
import { generateAiContent } from "@/lib/gemini";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const { resumeId } = await params;

    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user_id: userId,
    });

    if (!resume)
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );

    const {
      personalInfo,
      summary,
      workExperience,
      projects,
      education,
      skills,
      certifications,
    } = resume;

    const prompt = `
    You are an expert resume writer and ATS optimization specialist.
    
    Using the candidate data below, generate a fully polished, ATS-optimized resume.
    
    Candidate Data:
    
    Personal Info:
    - Full Name: ${personalInfo?.fullname || "N/A"}
    - Email: ${personalInfo?.email || "N/A"}
    - Mobile: ${personalInfo?.mobile || "N/A"}
    - Location: ${personalInfo?.location || "N/A"}
    - GitHub: ${personalInfo?.github || "N/A"}
    - Portfolio: ${personalInfo?.portfolio || "N/A"}
    
    Professional Summary:
    ${summary || "N/A"}
    
    Work Experience:
    ${
      workExperience?.length
        ? workExperience
            .map(
              (exp: {
                company: string;
                position: string;
                startDate: string;
                endDate: string;
                description: string;
              }) =>
                `- ${exp.position} at ${exp.company} (${exp.startDate} – ${exp.endDate}): ${exp.description}`
            )
            .join("\n")
        : "N/A"
    }
    
    Projects:
    ${
      projects?.length
        ? projects
            .map(
              (p: {
                title: string;
                description: string;
                techStack: string[];
                githubUrl: string;
                liveUrl: string;
              }) =>
                `- ${p.title}: ${p.description} | Tech: ${p.techStack?.join(", ")} | GitHub: ${p.githubUrl || "N/A"} | Live: ${p.liveUrl || "N/A"}`
            )
            .join("\n")
        : "N/A"
    }
    
    Education:
    ${
      education?.length
        ? education
            .map(
              (edu: {
                institute: string;
                degree: string;
                startDate: string;
                endDate: string;
              }) =>
                `- ${edu.degree} from ${edu.institute} (${edu.startDate} – ${edu.endDate})`
            )
            .join("\n")
        : "N/A"
    }
    
    Skills:
    ${skills?.length ? skills.join(", ") : "N/A"}
    
    Certifications:
    ${certifications?.length ? certifications.join(", ") : "N/A"}
    
    Rules:
    1. Return a single valid JSON object only — no markdown, no code fences, no explanation.
    2. The JSON must follow this exact structure:
    {
      "personalInfo": {
        "fullname": string,
        "email": string,
        "mobile": string,
        "location": string,
        "github": string,
        "portfolio": string
      },
      "summary": string,
      "workExperience": [
        {
          "company": string,
          "position": string,
          "startDate": string,
          "endDate": string,
          "description": string
        }
      ],
      "projects": [
        {
          "title": string,
          "description": string,
          "techStack": string[],
          "githubUrl": string,
          "liveUrl": string
        }
      ],
      "education": [
        {
          "institute": string,
          "degree": string,
          "startDate": string,
          "endDate": string
        }
      ],
      "skills": string[],
      "certifications": string[]
    }
    3. Polish the summary to be 50-80 words, ATS-friendly, no first-person pronouns.
    4. Enhance each work experience description: use strong action verbs, quantify where possible, make it ATS-optimized.
    5. Enhance each project description: highlight impact, tech stack usage, and outcomes.
    6. Preserve all original data — do not invent or remove information.
    7. Skills must be an array of individual skill strings.
    8. Certifications must be an array of individual certification strings.
    9. Return ONLY the JSON. No text before or after.
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "AI failed to generate resume" },
        { status: 500 }
      );
    }

    // Strip any accidental markdown fences from AI output
    const cleaned = result
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    const generatedResume = JSON.parse(cleaned);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Final resume generated successfully",
        data: generatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in generate final resume api", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
