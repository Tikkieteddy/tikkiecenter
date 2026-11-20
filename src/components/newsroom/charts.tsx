"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dailyChecks } from "@/lib/newsroom/mock-data";

const riskDistribution = [
  { name: "ได้", value: 58, color: "#16A34A" },
  { name: "สุ่มเสี่ยง", value: 31, color: "#D97706" },
  { name: "ห้าม", value: 11, color: "#DC2626" },
];

const approvalStats = [
  { name: "รออนุมัติ", value: 18 },
  { name: "อนุมัติแล้ว", value: 46 },
  { name: "ไม่อนุมัติ", value: 7 },
  { name: "ขอแก้ไข", value: 13 },
];

const tooltipStyle = {
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function ChartShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-lg bg-slate-100" />;
  }

  return <div className="h-72 w-full min-w-0">{children}</div>;
}

export function DailyChecksChart() {
  return (
    <ChartShell>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dailyChecks} margin={{ left: -18, right: 12, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="checks" name="ตรวจทั้งหมด" stroke="#EC5F27" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="warning" name="สุ่มเสี่ยง" stroke="#D97706" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="blocked" name="ห้าม" stroke="#DC2626" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RiskDistributionChart() {
  return (
    <ChartShell>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip contentStyle={tooltipStyle} />
          <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
            {riskDistribution.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-12 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted-foreground">
        {riskDistribution.map((item) => (
          <span key={item.name}>{item.name}: {item.value}%</span>
        ))}
      </div>
    </ChartShell>
  );
}

export function ApprovalBarChart() {
  return (
    <ChartShell>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={approvalStats} margin={{ left: -16, right: 8, top: 10 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="รายการ" fill="#EC5F27" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
