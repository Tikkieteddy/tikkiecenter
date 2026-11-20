import nodemailer from "nodemailer";
import type { ApprovalRequest, ApprovalStatus } from "./types";
import { approvalStatusThai, riskLevelThai } from "./types";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function sendSmtp(payload: MailPayload) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "News Risk Monitor <no-reply@newsroom.local>",
    ...payload,
  });
}

async function sendProviderJson(endpoint: string, token: string, payload: MailPayload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "News Risk Monitor <no-reply@newsroom.local>",
      personalizations: [{ to: [{ email: payload.to }] }],
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      content: [{ type: "text/html", value: payload.html }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider responded with ${response.status}`);
  }
}

export async function sendNewsroomEmail(payload: MailPayload) {
  const provider = (process.env.EMAIL_PROVIDER || "mock").toLowerCase();

  if (provider === "smtp") {
    return sendSmtp(payload);
  }

  if (provider === "resend" && process.env.RESEND_API_KEY) {
    return sendProviderJson("https://api.resend.com/emails", process.env.RESEND_API_KEY, payload);
  }

  if (provider === "sendgrid" && process.env.SENDGRID_API_KEY) {
    return sendProviderJson("https://api.sendgrid.com/v3/mail/send", process.env.SENDGRID_API_KEY, payload);
  }

  console.info("[email:mock]", payload.subject, payload.to);
  return { mocked: true };
}

export async function sendApprovalRequestEmail(request: ApprovalRequest) {
  const approvalLink = `${getBaseUrl()}/approve/${request.id}`;
  const subject = `ขออนุมัติประเด็นข่าว: ${request.title}`;
  const text = [
    `ผู้ส่ง: ${request.requesterName} (${request.requesterEmail})`,
    `วันที่ส่ง: ${new Date(request.createdAt).toLocaleString("th-TH")}`,
    `หัวข้อข่าว/ประเด็น: ${request.title}`,
    `URL: ${request.newsUrl || "-"}`,
    `ผลประเมินจากระบบ: ${riskLevelThai[request.aiRiskLevel]}`,
    `เหตุผลจาก AI: ${request.aiReasoning}`,
    `หมายเหตุ: ${request.requesterNote || "-"}`,
    `ลิงก์อนุมัติ: ${approvalLink}`,
  ].join("\n");

  return sendNewsroomEmail({
    to: request.editorEmail,
    subject,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827">
        <h2 style="color:#EC5F27">ขออนุมัติประเด็นข่าว</h2>
        <p><strong>ผู้ส่ง:</strong> ${request.requesterName} (${request.requesterEmail})</p>
        <p><strong>หัวข้อ:</strong> ${request.title}</p>
        <p><strong>ผลประเมิน:</strong> ${riskLevelThai[request.aiRiskLevel]}</p>
        <p><strong>เหตุผลจาก AI:</strong> ${request.aiReasoning}</p>
        <p><strong>หมายเหตุ:</strong> ${request.requesterNote || "-"}</p>
        <p><a href="${approvalLink}" style="background:#EC5F27;color:white;padding:10px 14px;border-radius:8px;text-decoration:none">เปิดหน้าอนุมัติ</a></p>
      </div>
    `,
  });
}

export async function sendApprovalStatusEmail(request: ApprovalRequest, status: ApprovalStatus) {
  return sendNewsroomEmail({
    to: request.requesterEmail,
    subject: `ผลการอนุมัติประเด็นข่าว: ${request.title}`,
    text: `สถานะล่าสุด: ${approvalStatusThai[status]}\nความเห็นบรรณาธิการ: ${request.editorComment || "-"}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827">
        <h2 style="color:#EC5F27">สถานะการอนุมัติอัปเดตแล้ว</h2>
        <p><strong>หัวข้อ:</strong> ${request.title}</p>
        <p><strong>สถานะ:</strong> ${approvalStatusThai[status]}</p>
        <p><strong>ความเห็นบรรณาธิการ:</strong> ${request.editorComment || "-"}</p>
      </div>
    `,
  });
}
