"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, TimerReset, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "@/components/operation/summary-card";
import { TaskList } from "@/components/operation/task-list";
import {
  buildCsv,
  filterTasks,
  getAverageCompletionTime,
  getDashboardMetrics,
  getFilterOptions,
  getTimingStatus,
  getTasksDueThisWeek,
  getTasksOverdueMoreThan3Days,
  groupCount,
  priorities,
  statuses,
} from "@/lib/operation/metrics";
import { tasks } from "@/lib/operation/mock-data";
import type { ReportFilters } from "@/lib/operation/types";
import { Trans, useLocalizedText } from "@/components/operation/language-provider";

const categoryColors = ["#1700C7", "#00A5FF", "#16008F", "#3E6DFF", "#16A34A", "#F59E0B", "#DC2626", "#64748B"];

const initialFilters: ReportFilters = {
  dateRange: "30d",
  status: "All",
  category: "All",
  requesterTeam: "All",
  priority: "All",
  assignee: "All",
};

export function ReportDashboard() {
  const t = useLocalizedText();
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [mounted, setMounted] = useState(false);
  const options = getFilterOptions();
  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [filters]);
  const metrics = getDashboardMetrics(filteredTasks);
  const statusData = groupCount(filteredTasks, (task) => task.status);
  const categoryData = groupCount(filteredTasks, (task) => task.taskCategory);
  const teamData = groupCount(filteredTasks, (task) => task.requesterTeam);
  const completedTasks = filteredTasks.filter((task) => task.status === "Done");
  const pendingTasks = filteredTasks.filter((task) => task.status !== "Done" && task.status !== "Rejected");
  const delayedTasks = filteredTasks.filter((task) => {
    const timing = getTimingStatus(task);
    return timing === "Overdue" || timing === "Completed late";
  });
  const dueThisWeek = getTasksDueThisWeek(filteredTasks);
  const overdueMoreThan3Days = getTasksOverdueMoreThan3Days(filteredTasks);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateFilter<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function exportCsv() {
    const blob = new Blob([buildCsv(filteredTasks)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tikkie-project-operation-center-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <Card className="border-brand-100">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <select value={filters.dateRange} onChange={(event) => updateFilter("dateRange", event.target.value as ReportFilters["dateRange"])}>
            <option value="7d">{t({ en: "Last 7 days", th: "7 วันที่ผ่านมา" })}</option>
            <option value="30d">{t({ en: "Last 30 days", th: "30 วันที่ผ่านมา" })}</option>
            <option value="90d">{t({ en: "Last 90 days", th: "90 วันที่ผ่านมา" })}</option>
            <option value="all">{t({ en: "All dates", th: "ทุกช่วงวันที่" })}</option>
          </select>
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value as ReportFilters["status"])}>
            <option value="All">{t({ en: "All status", th: "ทุกสถานะ" })}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="All">{t({ en: "All categories", th: "ทุกประเภท" })}</option>
            {options.categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <select value={filters.requesterTeam} onChange={(event) => updateFilter("requesterTeam", event.target.value)}>
            <option value="All">{t({ en: "All teams", th: "ทุกทีม" })}</option>
            {options.teams.map((team) => (
              <option key={team}>{team}</option>
            ))}
          </select>
          <select value={filters.priority} onChange={(event) => updateFilter("priority", event.target.value as ReportFilters["priority"])}>
            <option value="All">{t({ en: "All priorities", th: "ทุกความเร่งด่วน" })}</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <select value={filters.assignee} onChange={(event) => updateFilter("assignee", event.target.value)}>
            <option value="All">{t({ en: "All assignees", th: "ทุกผู้รับผิดชอบ" })}</option>
            {options.assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title={<Trans en="Total requests" th="คำขอทั้งหมด" />} value={filteredTasks.length} helper={<Trans en="Filtered range" th="ตามช่วงที่กรอง" />} icon={<TrendingUp />} />
        <SummaryCard title={<Trans en="Completed tasks" th="งานที่เสร็จแล้ว" />} value={completedTasks.length} helper={<Trans en="Done status" th="สถานะเสร็จแล้ว" />} tone="green" />
        <SummaryCard title={<Trans en="Pending tasks" th="งานค้างอยู่" />} value={pendingTasks.length} helper={<Trans en="Not done / not rejected" th="ยังไม่เสร็จ / ไม่ถูกปฏิเสธ" />} tone="yellow" />
        <SummaryCard title={<Trans en="Overdue tasks" th="งานเกินกำหนด" />} value={metrics.overdue} helper="current date > deadline" tone="red" />
        <SummaryCard title={<Trans en="Completed on time" th="เสร็จตรงเวลา" />} value={metrics.completedOnTime} tone="green" />
        <SummaryCard title={<Trans en="Completed late" th="เสร็จล่าช้า" />} value={metrics.completedLate} tone="red" />
        <SummaryCard title={<Trans en="Average completion" th="เวลาเฉลี่ยที่ใช้" />} value={`${getAverageCompletionTime(filteredTasks)}d`} helper={<Trans en="Created to completion" th="จากวันที่สร้างถึงวันที่เสร็จ" />} />
        <SummaryCard title={<Trans en="Due this week" th="ครบกำหนดสัปดาห์นี้" />} value={dueThisWeek.length} helper={<Trans en="Next 7 days" th="7 วันถัดไป" />} icon={<TimerReset />} tone="yellow" />
        <SummaryCard title={<Trans en="Overdue > 3 days" th="เกินกำหนด > 3 วัน" />} value={overdueMoreThan3Days.length} tone="red" />
        <SummaryCard title={<Trans en="Status groups" th="กลุ่มสถานะ" />} value={statusData.length} helper={<Trans en="Requests by status" th="คำขอตามสถานะ" />} />
        <SummaryCard title={<Trans en="Category groups" th="กลุ่มประเภท" />} value={categoryData.length} helper={<Trans en="Requests by category" th="คำขอตามประเภท" />} />
        <SummaryCard title={<Trans en="Team groups" th="กลุ่มทีม" />} value={teamData.length} helper={<Trans en="Requester teams" th="ทีมผู้ขอ" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.82fr]">
        <Card className="border-brand-100">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle><Trans en="Requests by status" th="คำขอตามสถานะ" /></CardTitle>
            <Button onClick={exportCsv} variant="outline">
              <Download aria-hidden="true" />
              <Trans en="Export CSV" th="ส่งออก CSV" />
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9DEFB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "#EDF5FF" }} />
                  <Bar dataKey="value" fill="#1700C7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartPlaceholder />
            )}
          </CardContent>
        </Card>

        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle><Trans en="Requests by category" th="คำขอตามประเภท" /></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[0.9fr_1fr] xl:grid-cols-1">
            <div className="h-72">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder />
              )}
            </div>
            <div className="grid content-center gap-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                      aria-hidden="true"
                    />
                    {item.name}
                  </span>
                  <span className="font-mono font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle><Trans en="Delayed tasks" th="งานล่าช้า" /></CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={delayedTasks.slice(0, 8)} emptyMessage={<Trans en="No delayed tasks in this filter." th="ไม่มีงานล่าช้าในตัวกรองนี้" />} compact />
          </CardContent>
        </Card>

        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle><Trans en="Completed tasks" th="งานที่เสร็จแล้ว" /></CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={completedTasks.slice(0, 8)} emptyMessage={<Trans en="No completed tasks in this filter." th="ไม่มีงานที่เสร็จแล้วในตัวกรองนี้" />} compact />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ChartPlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-lg bg-brand-50" aria-hidden="true" />;
}
