import { Mail, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/operation/metrics";
import { users } from "@/lib/operation/mock-data";
import { Trans } from "@/components/operation/language-provider";

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Admin" th="ผู้ดูแลระบบ" />}
        title={<Trans en="User Management" th="จัดการผู้ใช้" />}
        description={
          <Trans
            en="Manage roles for Admin, Tikkie / Assignee, Requester, and Viewer. This mock page is ready for auth/database connection."
            th="จัดการบทบาท Admin, Tikkie / Assignee, Requester และ Viewer หน้านี้เตรียมพร้อมสำหรับเชื่อมต่อ auth/database จริง"
          />
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["Admin", "Tikkie / Assignee", "Requester", "Viewer"].map((role) => (
          <Card key={role} className="border-brand-100">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{role}</p>
                <p className="mt-1 text-2xl font-bold">{users.filter((user) => user.role === role).length}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-lg bg-primary !text-brand-yellow [&_*]:!text-brand-yellow">
                {role === "Admin" ? <ShieldCheck className="size-5" /> : <Users className="size-5" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="hidden overflow-hidden border-brand-100 lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead><Trans en="Name" th="ชื่อ" /></TableHead>
              <TableHead><Trans en="Email" th="อีเมล" /></TableHead>
              <TableHead><Trans en="Role" th="บทบาท" /></TableHead>
              <TableHead><Trans en="Team" th="ทีม" /></TableHead>
              <TableHead><Trans en="Created" th="วันที่สร้าง" /></TableHead>
              <TableHead><Trans en="Last login" th="เข้าสู่ระบบล่าสุด" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-semibold">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "blue" : user.role === "Requester" ? "warning" : "slate"}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.team}</TableCell>
                <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                <TableCell>{formatDateTime(user.lastLoginAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 lg:hidden">
        {users.map((user) => (
          <Card key={user.id} className="border-brand-100">
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" aria-hidden="true" />
                    {user.email}
                  </p>
                </div>
                <Badge variant={user.role === "Admin" ? "blue" : user.role === "Requester" ? "warning" : "slate"}>{user.role}</Badge>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p>
                  <strong><Trans en="Team:" th="ทีม:" /></strong> {user.team}
                </p>
                <p className="mt-1">
                  <strong><Trans en="Last login:" th="เข้าสู่ระบบล่าสุด:" /></strong> {formatDateTime(user.lastLoginAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
