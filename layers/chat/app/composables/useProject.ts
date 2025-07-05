import type { Project } from "../types";
import useProjects from "./useProjects";

export default function useProject(projectId: string) {
  const { projects } = useProjects();

  const project = computed(() =>
    projects.value.find((p) => p.id === projectId)
  );

  function updateProject(project: Partial<Project>) {
    if (!project.id) return;

    const index = projects.value.findIndex((p) => p.id === project.id);

    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...project,
        id: projectId,
      } as Project;
    }
  }

  return {
    project,
    updateProject,
  };
}
