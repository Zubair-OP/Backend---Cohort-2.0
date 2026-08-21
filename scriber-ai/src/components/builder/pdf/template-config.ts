export interface TemplateConfig {
  id: string;
  name: string;
  font: string;
  category: string;
  fontSize: {
    name: number;
    title: number;
    heading: number;
    subheading: number;
    body: number;
    small: number;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    padding: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    background: string;
  };
  layout: "single-column" | "two-column";
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  formal: {
    id: "formal",
    name: "Formal",
    font: "Times-Roman",
    category: "Professional",
    fontSize: {
      name: 24,
      title: 14,
      heading: 16,
      subheading: 12,
      body: 10,
      small: 9,
    },
    spacing: {
      sectionGap: 16,
      itemGap: 10,
      padding: 40,
    },
    colors: {
      primary: "#1e293b",
      secondary: "#475569",
      accent: "#0d9488",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      background: "#ffffff",
    },
    layout: "single-column",
  },
  creative: {
    id: "creative",
    name: "Creative",
    font: "Helvetica",
    category: "Creative",
    fontSize: {
      name: 26,
      title: 13,
      heading: 15,
      subheading: 11,
      body: 10,
      small: 9,
    },
    spacing: {
      sectionGap: 18,
      itemGap: 12,
      padding: 38,
    },
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      accent: "#0891b2",
      text: "#0f172a",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      background: "#ffffff",
    },
    layout: "single-column",
  },
  precision: {
    id: "precision",
    name: "Precision",
    font: "Times-Roman",
    category: "Modern",
    fontSize: {
      name: 22,
      title: 12,
      heading: 14,
      subheading: 11,
      body: 10,
      small: 9,
    },
    spacing: {
      sectionGap: 14,
      itemGap: 8,
      padding: 44,
    },
    colors: {
      primary: "#1e293b",
      secondary: "#475569",
      accent: "#0d9488",
      text: "#1e293b",
      textSecondary: "#94a3b8",
      border: "#f1f5f9",
      background: "#ffffff",
    },
    layout: "single-column",
  },
  capability: {
    id: "capability",
    name: "Capability",
    font: "Helvetica",
    category: "Modern",
    fontSize: {
      name: 23,
      title: 12,
      heading: 14,
      subheading: 11,
      body: 10,
      small: 9,
    },
    spacing: {
      sectionGap: 14,
      itemGap: 10,
      padding: 40,
    },
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      accent: "#0d9488",
      text: "#0f172a",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      background: "#ffffff",
    },
    layout: "two-column",
  },
  purity: {
    id: "purity",
    name: "Purity",
    font: "Times-Roman",
    category: "Minimalist",
    fontSize: {
      name: 21,
      title: 11,
      heading: 13,
      subheading: 10,
      body: 10,
      small: 9,
    },
    spacing: {
      sectionGap: 12,
      itemGap: 8,
      padding: 46,
    },
    colors: {
      primary: "#1e293b",
      secondary: "#475569",
      accent: "#0d9488",
      text: "#1e293b",
      textSecondary: "#94a3b8",
      border: "#f8fafc",
      background: "#ffffff",
    },
    layout: "single-column",
  },
};
