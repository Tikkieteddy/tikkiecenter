"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Phase, Project } from "@/types/timeline";
import { detectPhaseStatus, makeId } from "@/types/timeline";

const STORAGE_KEY = "timeline_projects";

const seedProjects: Project[] = [
  {
    id: "project-seed-web-relaunch",
    name: "รีดีไซน์หน้าเว็บศูนย์บริการ",
    description: "ปรับหน้าเว็บหลักให้รองรับ mobile-first พร้อม flow สำหรับส่งคำขอและติดตามสถานะ",
    startDate: "2026-05-01",
    team: "dev",
    teamMembers: [
      { initials: "TK", color: "#185FA5" },
      { initials: "MA", color: "#1D9E75" },
      { initials: "NO", color: "#BA7517" },
    ],
    externalLinks: [
      { icon: "Git", label: "GitHub", url: "https://github.com/Tikkieteddy/tikkiecenter" },
      { icon: "Jira", label: "Jira", url: "https://example.com/jira/tikkie-web" },
    ],
    phases: [
      {
        id: "phase-web-01",
        name: "เก็บ Requirement",
        description: "รวบรวม pain point จากทีม requester และกำหนด scope งาน",
        startDate: "2026-05-01",
        deadline: "2026-05-04",
        progress: 100,
        status: "done",
        externalLink: { label: "Brief", url: "https://example.com/brief/web-relaunch" },
      },
      {
        id: "phase-web-02",
        name: "Wireframe",
        description: "วาง layout หน้า timeline, dashboard และ form หลัก",
        startDate: "2026-05-05",
        deadline: "2026-05-09",
        progress: 100,
        status: "done",
        externalLink: { label: "Figma", url: "https://example.com/figma/web-wireframe" },
      },
      {
        id: "phase-web-03",
        name: "Develop",
        description: "พัฒนา component หลักและเชื่อม state mock data ก่อนต่อฐานข้อมูลจริง",
        startDate: "2026-05-10",
        deadline: "2026-05-18",
        progress: 72,
        status: "active",
        externalLink: { label: "GitHub", url: "https://github.com/Tikkieteddy/tikkiecenter" },
      },
      {
        id: "phase-web-04",
        name: "QA",
        description: "ตรวจ responsive, browser console, และข้อมูล demo",
        startDate: "2026-05-19",
        deadline: "2026-05-23",
        progress: 0,
        status: "pending",
      },
      {
        id: "phase-web-05",
        name: "Launch",
        description: "deploy production และตรวจ URL จริง",
        startDate: "2026-05-24",
        deadline: "2026-05-26",
        progress: 0,
        status: "pending",
      },
    ],
    createdAt: "2026-05-01T09:00:00+07:00",
  },
  {
    id: "project-seed-content-system",
    name: "ระบบคอนเทนต์แคมเปญรายเดือน",
    description: "จัดตารางผลิตคอนเทนต์ สรุปสถานะ และส่งลิงก์ตรวจงานให้ทีม marketing",
    startDate: "2026-04-26",
    team: "design",
    teamMembers: [
      { initials: "NT", color: "#E24B4A" },
      { initials: "PL", color: "#185FA5" },
      { initials: "BB", color: "#6D5BD0" },
    ],
    externalLinks: [
      { icon: "Fig", label: "Figma", url: "https://example.com/figma/content-system" },
      { icon: "Doc", label: "Brief", url: "https://example.com/docs/content-calendar" },
    ],
    phases: [
      {
        id: "phase-content-01",
        name: "Content Plan",
        description: "กำหนดธีมรายเดือนและ key message สำหรับแต่ละช่องทาง",
        startDate: "2026-04-26",
        deadline: "2026-04-30",
        progress: 100,
        status: "done",
      },
      {
        id: "phase-content-02",
        name: "Visual Draft",
        description: "ทำภาพ key visual และ template สำหรับ social set",
        startDate: "2026-05-01",
        deadline: "2026-05-06",
        progress: 100,
        status: "delayed_done",
        externalLink: { label: "Figma", url: "https://example.com/figma/visual-draft" },
      },
      {
        id: "phase-content-03",
        name: "Copy Review",
        description: "รอทีม legal ตรวจคำเคลมและเงื่อนไขท้ายโพสต์",
        startDate: "2026-05-07",
        deadline: "2026-05-14",
        progress: 55,
        status: "delayed_active",
        externalLink: { label: "Sheet", url: "https://example.com/sheets/copy-review" },
      },
      {
        id: "phase-content-04",
        name: "Schedule",
        description: "ตั้งเวลาเผยแพร่และตรวจ preview ทุกช่องทาง",
        startDate: "2026-05-15",
        deadline: "2026-05-22",
        progress: 20,
        status: "active",
      },
    ],
    createdAt: "2026-04-26T10:30:00+07:00",
  },
];

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
    return parsed.map(normalizeProject);
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

  const resetSeedData = useCallback(() => {
    setProjects(seedProjects);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProjects));
  }, []);

  return useMemo(
    () => ({
      hydrated,
      projects,
      addProject,
      updateProject,
      deleteProject,
      updatePhase,
      resetSeedData,
    }),
    [addProject, deleteProject, hydrated, projects, resetSeedData, updatePhase, updateProject],
  );
}
