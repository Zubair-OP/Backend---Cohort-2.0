import axios from "axios";

export const getAllResumesApi = async () => {
  const response = await axios.get("/api/resume");
  return response.data;
};

export const getResumeByIdApi = async (resumeId: string) => {
  const response = await axios.get(`/api/resume/${resumeId}`);
  return response.data;
};

export const createResumeApi = async () => {
  const response = await axios.post("/api/resume/create");

  return response.data;
};

export const updateResumeApi = async (
  resumeId: string,
  payload: Record<string, unknown>
) => {
  const response = await axios.patch(`/api/resume/${resumeId}`, payload);

  return response.data;
};

export const deleteResumeApi = async (resumeId: string) => {
  const response = await axios.delete(`/api/resume/${resumeId}`);

  return response.data;
};

export const generateFinalResumeApi = async (resumeId: string) => {
  const response = await axios.post(`/api/resume/${resumeId}/generate`);

  return response.data;
};