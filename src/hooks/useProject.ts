import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "../services/api";
import type { Project } from "../types/project";

const getProjects = async () => {
  const response = await api.get("/projects/");
  return response.data.results;
};

const getProject = async (id: string) => {
  const response = await api.get(`/projects/${id}/`);
  return response.data;
};

export const useProjects = (): UseQueryResult<Project[], Error> => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useProjectById = (id: string): UseQueryResult<Project, Error> => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });
};
