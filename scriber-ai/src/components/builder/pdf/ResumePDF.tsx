import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { IResume } from "@/types/resume.types";
import { TemplateConfig, TEMPLATE_CONFIGS } from "./template-config";

interface ResumePDFProps {
  resume: IResume;
  templateId: string;
}

Font.registerHyphenationCallback((word) => [word]);

function createFormalStyles(c: TemplateConfig["colors"]) {
  return StyleSheet.create({
    page: { padding: 36, fontFamily: "Times-Roman", backgroundColor: "#ffffff", color: "#1e293b", fontSize: 10, lineHeight: 1.4 },
    headerRow: { flexDirection: "row", gap: 14, marginBottom: 14 },
    photoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#e2e8f0", flexShrink: 0 },
    headerContent: { flex: 1 },
    name: { fontSize: 18, fontWeight: "bold", color: "#1e293b", marginBottom: 1 },
    titleText: { fontSize: 10, color: "#475569", marginBottom: 4 },
    summaryText: { fontSize: 9, color: "#475569", lineHeight: 1.5, marginBottom: 4 },
    contactRow: { flexDirection: "row", gap: 8, fontSize: 8, color: "#94a3b8" },
    sectionHeading: { fontSize: 11, fontWeight: "bold", color: "#1e293b", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3, marginBottom: 8, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 },
    expItem: { marginBottom: 8 },
    expTitle: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    expCompany: { fontSize: 10, color: "#64748b" },
    expDate: { fontSize: 8, color: "#94a3b8", marginBottom: 2 },
    expDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5 },
    eduItem: { marginBottom: 6 },
    eduInstitute: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    eduDegree: { fontSize: 9, color: "#64748b" },
    eduDate: { fontSize: 8, color: "#94a3b8" },
    twoCol: { flexDirection: "row", gap: 20 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },
    skillText: { fontSize: 9, color: "#475569", marginBottom: 2 },
    langText: { fontSize: 9, color: "#475569", marginBottom: 1 },
    langSub: { fontSize: 8, color: "#94a3b8" },
    sectionGap: { marginTop: 2 },
  });
}

function createCreativeStyles(c: TemplateConfig["colors"]) {
  return StyleSheet.create({
    page: { padding: 36, fontFamily: "Helvetica", backgroundColor: "#ffffff", color: "#0f172a", fontSize: 10, lineHeight: 1.4 },
    headerRow: { flexDirection: "row", gap: 14, marginBottom: 14 },
    headerContent: { flex: 1 },
    photoCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#e2e8f0", flexShrink: 0 },
    name: { fontSize: 20, fontWeight: "bold", color: "#0f172a", marginBottom: 1 },
    titleText: { fontSize: 9, color: "#64748b", marginBottom: 6 },
    summaryText: { fontSize: 9, color: "#475569", lineHeight: 1.5, marginBottom: 4 },
    contactRow: { flexDirection: "row", gap: 8, fontSize: 8, color: "#94a3b8" },
    sectionHeading: { fontSize: 11, fontWeight: "bold", color: "#0f172a", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3, marginBottom: 8, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 },
    expItem: { marginBottom: 8 },
    expTitle: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    expCompany: { fontSize: 10, color: "#64748b" },
    expDate: { fontSize: 8, color: "#94a3b8", marginBottom: 2 },
    expDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5 },
    eduItem: { marginBottom: 6 },
    eduInstitute: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    eduDegree: { fontSize: 9, color: "#64748b" },
    eduDate: { fontSize: 8, color: "#94a3b8" },
    twoCol: { flexDirection: "row", gap: 20 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },
    skillText: { fontSize: 9, color: "#475569", marginBottom: 2 },
    langText: { fontSize: 9, color: "#475569", marginBottom: 1 },
    langSub: { fontSize: 8, color: "#94a3b8" },
    gradientBox: { height: 40, backgroundColor: "#f1f5f9", borderRadius: 4, marginTop: 10 },
  });
}

function createPrecisionStyles(c: TemplateConfig["colors"]) {
  return StyleSheet.create({
    page: { padding: 42, fontFamily: "Times-Roman", backgroundColor: "#ffffff", color: "#1e293b", fontSize: 10, lineHeight: 1.4 },
    centeredHeader: { marginBottom: 14 },
    name: { fontSize: 18, fontWeight: "bold", color: "#1e293b", textAlign: "center", marginBottom: 2 },
    titleText: { fontSize: 9, color: "#64748b", textAlign: "center", marginBottom: 4 },
    contactCenter: { flexDirection: "row", justifyContent: "center", gap: 8, fontSize: 8, color: "#94a3b8" },
    summaryText: { fontSize: 9, color: "#64748b", textAlign: "center", marginBottom: 14, lineHeight: 1.5 },
    sectionHeading: { fontSize: 11, fontWeight: "bold", color: "#1e293b", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingBottom: 3, marginBottom: 8, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 },
    expItem: { marginBottom: 8 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    expTitle: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    expCompany: { fontSize: 10, color: "#64748b" },
    expDate: { fontSize: 8, color: "#94a3b8" },
    expLocation: { fontSize: 8, color: "#94a3b8", marginBottom: 1 },
    expDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5 },
    eduItem: { marginBottom: 6 },
    eduInstitute: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    eduDegree: { fontSize: 9, color: "#64748b" },
    twoCol: { flexDirection: "row", gap: 20 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },
    skillText: { fontSize: 9, color: "#475569", marginBottom: 2 },
    langText: { fontSize: 9, color: "#475569", marginBottom: 2 },
    bulletText: { fontSize: 9, color: "#475569", marginBottom: 1 },
  });
}

function createCapabilityStyles(c: TemplateConfig["colors"]) {
  return StyleSheet.create({
    page: { padding: 38, fontFamily: "Helvetica", backgroundColor: "#ffffff", color: "#0f172a", fontSize: 10, lineHeight: 1.4 },
    name: { fontSize: 17, fontWeight: "bold", color: "#0f172a", marginBottom: 1 },
    titleText: { fontSize: 9, color: "#64748b", marginBottom: 10 },
    sectionHeading: { fontSize: 11, fontWeight: "bold", color: "#0f172a", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3, marginBottom: 8, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 },
    expRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
    dateCol: { width: 80, fontSize: 8, color: "#94a3b8", flexShrink: 0 },
    dateColLocation: { fontSize: 8, color: "#94a3b8", marginTop: 1 },
    contentCol: { flex: 1 },
    expTitle: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    expCompany: { fontSize: 9, color: "#64748b", marginBottom: 2 },
    expDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5 },
    eduInstitute: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    eduDegree: { fontSize: 9, color: "#64748b" },
    twoCol: { flexDirection: "row", gap: 20 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },
    skillText: { fontSize: 9, color: "#475569", marginBottom: 2 },
    langText: { fontSize: 9, color: "#475569", marginBottom: 2 },
  });
}

function createPurityStyles(c: TemplateConfig["colors"]) {
  return StyleSheet.create({
    page: { padding: 44, fontFamily: "Times-Roman", backgroundColor: "#ffffff", color: "#1e293b", fontSize: 10, lineHeight: 1.4 },
    centeredHeader: { marginBottom: 12 },
    name: { fontSize: 16, fontWeight: "bold", color: "#1e293b", textAlign: "center", marginBottom: 3 },
    contactCenter: { flexDirection: "row", justifyContent: "center", gap: 6, fontSize: 8, color: "#94a3b8", flexWrap: "wrap" },
    summaryText: { fontSize: 9, color: "#64748b", textAlign: "center", marginBottom: 12, lineHeight: 1.5 },
    sectionHeading: { fontSize: 10, fontWeight: "bold", color: "#1e293b", borderBottomWidth: 1, borderBottomColor: "#f8fafc", paddingBottom: 3, marginBottom: 8, marginTop: 8, textTransform: "uppercase", letterSpacing: 1 },
    expItem: { marginBottom: 7 },
    expTitle: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    expCompany: { fontSize: 10, color: "#64748b" },
    expDate: { fontSize: 8, color: "#94a3b8", marginBottom: 2 },
    expDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5 },
    eduItem: { marginBottom: 6 },
    eduInstitute: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
    eduDegree: { fontSize: 9, color: "#64748b" },
    eduDate: { fontSize: 8, color: "#94a3b8" },
    twoCol: { flexDirection: "row", gap: 20 },
    colLeft: { flex: 1 },
    colRight: { flex: 1 },
    bulletText: { fontSize: 9, color: "#475569", marginBottom: 2 },
  });
}

function FormalTemplate({ resume }: { resume: IResume; config: TemplateConfig }) {
  const s = createFormalStyles(TEMPLATE_CONFIGS.formal.colors);
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.headerRow}>
        <View style={s.photoCircle} />
        <View style={s.headerContent}>
          <Text style={s.name}>{personalInfo.fullname || "Your Name"}</Text>
          <Text style={s.titleText}>Professional Title</Text>
          <Text style={s.summaryText}>{summary || "Professional summary goes here"}</Text>
          <View style={s.contactRow}>
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.portfolio && <Text>{personalInfo.portfolio}</Text>}
          </View>
        </View>
      </View>

      {workExperience && workExperience.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Work Experience</Text>
          {workExperience.map((exp, i) => (
            <View key={i} style={s.expItem}>
              <Text>
                <Text style={s.expTitle}>{exp.position || "Position"}</Text>
                {exp.company && <Text style={s.expCompany}>{"  "}· {exp.company}</Text>}
              </Text>
              <Text style={s.expDate}>{exp.startDate} - {exp.endDate}</Text>
              {exp.description && <Text style={s.expDesc}>{exp.description}</Text>}
            </View>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={s.eduItem}>
              <Text style={s.eduInstitute}>{edu.institute || "University"}</Text>
              <Text style={s.eduDegree}>{edu.degree}</Text>
              <Text style={s.eduDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={s.sectionHeading}>Skills & Language</Text>
      <View style={s.twoCol}>
        <View style={s.colLeft}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: "#1e293b", marginBottom: 4 }}>Skills</Text>
          {skills.length > 0 ? skills.map((skill, i) => (
            <Text key={i} style={s.skillText}>{skill}</Text>
          )) : <Text style={s.skillText}>Competitor analysis</Text>}
        </View>
        <View style={s.colRight}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: "#1e293b", marginBottom: 4 }}>Language</Text>
          <Text style={s.langText}>Chinese <Text style={s.langSub}>· Native</Text></Text>
          <Text style={s.langText}>English <Text style={s.langSub}>· Professional</Text></Text>
        </View>
      </View>
    </Page>
  );
}

function CreativeTemplate({ resume }: { resume: IResume; config: TemplateConfig }) {
  const s = createCreativeStyles(TEMPLATE_CONFIGS.creative.colors);
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.headerRow}>
        <View style={s.headerContent}>
          <Text style={s.name}>{personalInfo.fullname || "Your Name"}</Text>
          <Text style={s.titleText}>Professional Title</Text>
          <Text style={s.summaryText}>{summary || "Professional summary goes here"}</Text>
          <View style={s.contactRow}>
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.portfolio && <Text>{personalInfo.portfolio}</Text>}
          </View>
        </View>
        <View style={s.photoCircle} />
      </View>

      {workExperience && workExperience.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Work Experience</Text>
          {workExperience.map((exp, i) => (
            <View key={i} style={s.expItem}>
              <Text>
                <Text style={s.expTitle}>{exp.position || "Position"}</Text>
                {exp.company && <Text style={s.expCompany}>{"  "}· {exp.company}</Text>}
              </Text>
              <Text style={s.expDate}>{exp.startDate} - {exp.endDate}</Text>
              {exp.description && <Text style={s.expDesc}>{exp.description}</Text>}
            </View>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={s.eduItem}>
              <Text style={s.eduInstitute}>{edu.institute || "University"}</Text>
              <Text style={s.eduDegree}>{edu.degree}</Text>
              <Text style={s.eduDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Skills</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {skills.map((skill, i) => (
              <Text key={i} style={{ fontSize: 8, color: "#475569", backgroundColor: "#f1f5f9", paddingHorizontal: 5, paddingVertical: 2 }}>{skill}</Text>
            ))}
          </View>
        </>
      )}

      <View style={s.gradientBox} />
    </Page>
  );
}

function PrecisionTemplate({ resume }: { resume: IResume; config: TemplateConfig }) {
  const s = createPrecisionStyles(TEMPLATE_CONFIGS.precision.colors);
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.centeredHeader}>
        <Text style={s.name}>{personalInfo.fullname || "Your Name"}</Text>
        <Text style={s.titleText}>Job Title</Text>
        <View style={s.contactCenter}>
          {personalInfo.location && <Text>{personalInfo.location}</Text>}
          {personalInfo.mobile && <Text>{personalInfo.mobile}</Text>}
          {personalInfo.email && <Text>{personalInfo.email}</Text>}
        </View>
      </View>

      {summary && <Text style={s.summaryText}>{summary}</Text>}

      {workExperience && workExperience.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Work Experience</Text>
          {workExperience.map((exp, i) => (
            <View key={i} style={s.expItem}>
              <View style={s.expHeader}>
                <Text>
                  <Text style={s.expTitle}>{exp.position || "Position"}</Text>
                  {exp.company && <Text style={s.expCompany}>{"  "}· {exp.company}</Text>}
                </Text>
                <Text style={s.expDate}>{exp.startDate} - {exp.endDate}</Text>
              </View>
              {personalInfo.location && <Text style={s.expLocation}>{personalInfo.location}</Text>}
              {exp.description && <Text style={s.expDesc}>{exp.description}</Text>}
            </View>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={s.eduItem}>
              <View style={s.expHeader}>
                <Text style={s.eduInstitute}>{edu.institute || "University"}</Text>
                <Text style={s.expDate}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={s.eduDegree}>{edu.degree}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={s.sectionHeading}>Skills & Languages</Text>
      <View style={s.twoCol}>
        <View style={s.colLeft}>
          {skills.length > 0 ? skills.map((skill, i) => (
            <Text key={i} style={s.bulletText}>• {skill}</Text>
          )) : <Text style={s.bulletText}>• Lorem ipsum dolor</Text>}
        </View>
        <View style={s.colRight}>
          <Text style={s.bulletText}>• Chinese</Text>
          <Text style={s.bulletText}>• English</Text>
        </View>
      </View>
    </Page>
  );
}

function CapabilityTemplate({ resume }: { resume: IResume; config: TemplateConfig }) {
  const s = createCapabilityStyles(TEMPLATE_CONFIGS.capability.colors);
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.name}>{personalInfo.fullname || "Your Name"}</Text>
      <Text style={s.titleText}>Job Title</Text>

      {workExperience && workExperience.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Work Experience</Text>
          {workExperience.map((exp, i) => (
            <View key={i} style={s.expRow}>
              <View style={s.dateCol}>
                <Text>{exp.startDate} - {exp.endDate}</Text>
                <Text style={s.dateColLocation}>{personalInfo.location}</Text>
              </View>
              <View style={s.contentCol}>
                <Text style={s.expTitle}>{exp.position || "Position"}</Text>
                <Text style={s.expCompany}>{exp.company || "Company"}</Text>
                {exp.description && <Text style={s.expDesc}>{exp.description}</Text>}
              </View>
            </View>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={s.expRow}>
              <View style={s.dateCol}>
                <Text>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <View style={s.contentCol}>
                <Text style={s.eduInstitute}>{edu.institute || "University"}</Text>
                <Text style={s.eduDegree}>{edu.degree}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      <Text style={s.sectionHeading}>Skills & Languages</Text>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <View style={{ flex: 1 }}>
          {skills.length > 0 ? skills.map((skill, i) => (
            <Text key={i} style={s.skillText}>{skill}</Text>
          )) : <Text style={s.skillText}>Lorem ipsum dolor</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.langText}>Chinese · English</Text>
        </View>
      </View>
    </Page>
  );
}

function PurityTemplate({ resume }: { resume: IResume; config: TemplateConfig }) {
  const s = createPurityStyles(TEMPLATE_CONFIGS.purity.colors);
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.centeredHeader}>
        <Text style={s.name}>{personalInfo.fullname || "Your Name"}</Text>
        <View style={s.contactCenter}>
          {personalInfo.location && <Text>{personalInfo.location}</Text>}
          {personalInfo.mobile && <Text>{personalInfo.mobile}</Text>}
          {personalInfo.email && <Text>{personalInfo.email}</Text>}
        </View>
      </View>

      {summary && <Text style={s.summaryText}>{summary}</Text>}

      {workExperience && workExperience.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Work Experience</Text>
          {workExperience.map((exp, i) => (
            <View key={i} style={s.expItem}>
              <Text>
                <Text style={s.expTitle}>{exp.position || "Position"}</Text>
                {exp.company && <Text style={s.expCompany}>{"  "}· {exp.company}</Text>}
              </Text>
              <Text style={s.expDate}>{exp.startDate} · {exp.endDate}</Text>
              {exp.description && <Text style={s.expDesc}>{exp.description}</Text>}
            </View>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <Text style={s.sectionHeading}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={s.eduItem}>
              <Text style={s.eduInstitute}>{edu.institute || "University"}</Text>
              <Text style={s.eduDegree}>{edu.degree} · {edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={s.sectionHeading}>Skills & Languages</Text>
      <View style={s.twoCol}>
        <View style={s.colLeft}>
          {skills.length > 0 ? skills.map((skill, i) => (
            <Text key={i} style={s.bulletText}>• {skill}</Text>
          )) : <Text style={s.bulletText}>• Lorem ipsum dolor sit amet</Text>}
        </View>
        <View style={s.colRight}>
          <Text style={s.bulletText}>• Chinese</Text>
          <Text style={s.bulletText}>• English</Text>
        </View>
      </View>
    </Page>
  );
}

const TEMPLATE_COMPONENTS: Record<string, (props: { resume: IResume; config: TemplateConfig }) => React.ReactElement> = {
  formal: FormalTemplate,
  creative: CreativeTemplate,
  precision: PrecisionTemplate,
  capability: CapabilityTemplate,
  purity: PurityTemplate,
};

export function ResumePDF({ resume, templateId }: ResumePDFProps) {
  const config = TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS.formal;
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS.formal;

  return (
    <Document title={resume.title || "Resume"}>
      <TemplateComponent resume={resume} config={config} />
    </Document>
  );
}
