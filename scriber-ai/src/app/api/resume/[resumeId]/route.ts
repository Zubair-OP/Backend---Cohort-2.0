import { getCurrentUser } from "@/lib/getCurrentUser";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

const allowedPersonalInfoKeys = [
  "fullname",
  "email",
  "mobile",
  "location",
  "github",
  "portfolio",
];

const sanitizeResumeUpdate = (body: Record<string, unknown>) => {
  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.summary === "string") update.summary = body.summary;

  if (body.personalInfo && typeof body.personalInfo === "object" && !Array.isArray(body.personalInfo)) {
    const personalInfo = body.personalInfo as Record<string, unknown>;
    update.personalInfo = allowedPersonalInfoKeys.reduce<Record<string, string>>((acc, key) => {
      const value = personalInfo[key];
      if (typeof value === "string") {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  if (Array.isArray(body.education)) update.education = body.education;
  if (Array.isArray(body.workExperience)) update.workExperience = body.workExperience;
  if (Array.isArray(body.projects)) update.projects = body.projects;
  if (Array.isArray(body.skills)) update.skills = body.skills;
  if (Array.isArray(body.certifications)) update.certifications = body.certifications;

  return update;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    console.log("user in get resume", userId);

    const { resumeId } = await params;
    console.log("in get resume ", resumeId);

    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user_id: userId,
    });

    console.log("resume found", resume);

    if (!resume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume fetched successfully",
        data: resume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in get resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    console.log("loggedin user", userId);

    const body = await req.json();
    console.log("body-->", body);

    const { resumeId } = await params;
    console.log("resume id", resumeId);

    const update = sanitizeResumeUpdate(body);

    if (Object.keys(update).length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No valid resume fields provided",
        },
        { status: 400 }
      );
    }

    const updatedResume = await ResumeModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId,
      },
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume failed to update",
        },
        { status: 400 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume updated successfully",
        data: updatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in updatedResume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const { resumeId } = await params;

    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: resumeId,
      user_id: userId,
    });

    if (!deletedResume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in delete resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
