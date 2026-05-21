"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Phase, Project } from "@/types/timeline";
import { detectPhaseStatus, makeId } from "@/types/timeline";

const STORAGE_KEY = "timeline_projects";

const seedProjects: Project[] = [];

function normalizeProject(project: Project): Project {
  return {
    ...project,
    phases: project.phases.map((phase) => ({
      ...phase,
      progress: Math.max(0, Math.min(100, Math.round(phase.progress))),
      status: phase.status || detectPhaseStatus(phase),
    })),
  };
}

function readProjects() {
  if (typeof window === "undefined") return seedProjects;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProjects));
    return seedProjects;
  }

  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedProjects;

    const realProjects = parsed.filter((project) => !project.id.startsWith("project-seed-")).map(normalizeProject);
    if (realProjects.length !== parsed.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(realProjects));
    }

    return realProjects;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProjects));
    return seedProjects;
  }
}

export function useTimelineProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(readProjects());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [hydrated, projects]);

  const addProject = useCallback((project: Project) => {
    setProjects((current) => [
      normalizeProject({
        ...project,
        id: project.id || makeId("project"),
        createdAt: project.createdAt || new Date().toISOString(),
      }),
      ...current,
    ]);
  }, []);

  const updateProject = useCallback((project: Project) => {
    setProjects((current) => current.map((item) => (item.id === project.id ? normalizeProject(project) : item)));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }, []);

  const updatePhase = useCallback((projectId: string, phase: Phase) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;

        return normalizeProject({
          ...project,
          phases: project.phases.map((item) => (item.id === phase.id ? { ...phase, status: phase.status || detectPhaseStatus(phase) } : item)),
        });
      }),
    );
  }, []);

  return useMemo(
    () => ({
      hydrated,
      projects,
      addProject,
      updateProject,
      deleteProject,
      updatePhase,
    }),
    [addProject, deleteProject, hydrated, projects, updatePhase, updateProject],
  );
}

