"use client";

import { forwardRef } from "react";
import { IResume } from "@/types/resume.types";

interface TemplatePreviewProps {
  resume: IResume;
  templateId: string;
}

export const TemplatePreview = forwardRef<HTMLDivElement, TemplatePreviewProps>(
  ({ resume, templateId }, ref) => {
    const { personalInfo, summary, workExperience, education, skills } = resume;

    const renderTemplate = () => {
      switch (templateId) {
        case "formal":
          return renderFormal();
        case "creative":
          return renderCreative();
        case "precision":
          return renderPrecision();
        case "capability":
          return renderCapability();
        case "purity":
          return renderPurity();
        default:
          return renderFormal();
      }
    };

    const renderFormal = () => (
      <div className="bg-white p-8 min-h-[1100px]">
        {/* Header */}
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {personalInfo.fullname || "Your Name"}
            </h1>
            <p className="text-gray-600 mt-1">
              {summary || "Professional summary goes here"}
            </p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            {workExperience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {exp.position || "Position"}
                      <span className="text-gray-400 font-normal">
                        {" "}
                        · {exp.company || "Company"}
                      </span>
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  {exp.startDate} - {exp.endDate}
                </p>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-gray-800">
                  {edu.institute || "University"}
                </h3>
                <p className="text-sm text-gray-500">{edu.degree}</p>
                <p className="text-sm text-gray-400">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const renderCreative = () => (
      <div className="bg-white p-8 min-h-[1100px]">
        {/* Header with side photo */}
        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {personalInfo.fullname || "Your Name"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Professional Title
            </p>
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {summary || "Professional summary goes here"}
            </p>
            <div className="flex gap-3 mt-3 text-sm text-gray-500">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
            </div>
          </div>
          <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />
        </div>

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            {workExperience.map((exp, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold text-gray-800">
                  {exp.position || "Position"}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    · {exp.company || "Company"}
                  </span>
                </h3>
                <p className="text-sm text-gray-400">
                  {exp.startDate} - {exp.endDate}
                </p>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-gray-800">
                  {edu.institute || "University"}
                </h3>
                <p className="text-sm text-gray-500">{edu.degree}</p>
                <p className="text-sm text-gray-400">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const renderPrecision = () => (
      <div className="bg-white p-8 min-h-[1100px]">
        {/* Centered Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.fullname || "Your Name"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Job Title
          </p>
          <div className="flex justify-center gap-3 mt-2 text-xs text-gray-400">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.mobile && <span>| {personalInfo.mobile}</span>}
            {personalInfo.email && <span>| {personalInfo.email}</span>}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6">
          {summary || "Professional summary goes here"}
        </p>

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            {workExperience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">
                    {exp.position || "Position"}
                    <span className="text-gray-400 font-normal">
                      {" "}
                      · {exp.company || "Company"}
                    </span>
                  </h3>
                  <span className="text-sm text-gray-400">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{personalInfo.location}</p>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {edu.institute || "University"}
                  </h3>
                  <p className="text-sm text-gray-500">{edu.degree}</p>
                </div>
                <span className="text-sm text-gray-400">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Languages */}
        <div className="flex gap-8">
          {skills.length > 0 && (
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                Skills
              </h2>
              <ul className="text-sm text-gray-600 space-y-1">
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Languages
            </h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>English</li>
              <li>Chinese</li>
            </ul>
          </div>
        </div>
      </div>
    );

    const renderCapability = () => (
      <div className="bg-white p-8 min-h-[1100px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.fullname || "Your Name"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Job Title</p>
        </div>

        {/* Work Experience with date column */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            {workExperience.map((exp, i) => (
              <div key={i} className="mb-4 flex gap-4">
                <div className="w-24 flex-shrink-0 text-sm text-gray-400">
                  <p>{exp.startDate} -</p>
                  <p>{exp.endDate}</p>
                  <p className="mt-1">{personalInfo.location}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {exp.position || "Position"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {exp.company || "Company"}
                  </p>
                  {exp.description && (
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education with date column */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3 flex gap-4">
                <div className="w-24 flex-shrink-0 text-sm text-gray-400">
                  <p>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {edu.institute || "University"}
                  </h3>
                  <p className="text-sm text-gray-500">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Languages */}
        <div className="flex gap-8">
          {skills.length > 0 && (
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                Skills
              </h2>
              <ul className="text-sm text-gray-600 space-y-1">
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Languages
            </h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>English</li>
              <li>Chinese</li>
            </ul>
          </div>
        </div>
      </div>
    );

    const renderPurity = () => (
      <div className="bg-white p-8 min-h-[1100px]">
        {/* Centered Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.fullname || "Your Name"}
          </h1>
          <div className="flex justify-center gap-2 mt-1 text-xs text-gray-400">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.mobile && <span>| {personalInfo.mobile}</span>}
            {personalInfo.email && <span>| {personalInfo.email}</span>}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          {summary || "Professional summary goes here"}
        </p>

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            {workExperience.map((exp, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold text-gray-800">
                  {exp.position || "Position"}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    · {exp.company || "Company"}
                  </span>
                </h3>
                <p className="text-sm text-gray-400">
                  {exp.startDate} · {exp.endDate} | {personalInfo.location}
                </p>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-gray-800">
                  {edu.institute || "University"}
                </h3>
                <p className="text-sm text-gray-500">
                  {edu.degree} · {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Languages */}
        <div className="flex gap-8">
          {skills.length > 0 && (
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                Skills
              </h2>
              <ul className="text-sm text-gray-600 space-y-1">
                {skills.map((skill, i) => (
                  <li key={i}>• {skill}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              Languages
            </h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• English</li>
              <li>• Chinese</li>
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      <div ref={ref} className="max-w-[800px] mx-auto shadow-2xl">
        {renderTemplate()}
      </div>
    );
  }
);

TemplatePreview.displayName = "TemplatePreview";
