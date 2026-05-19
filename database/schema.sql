-- Tikkie Project Operation Center
-- PostgreSQL / Supabase-ready schema for Phase 1.
-- Phase 1 sends email only. n8n and LINE OA are intentionally not implemented.

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('Admin', 'Tikkie / Assignee', 'Requester', 'Viewer')),
  team text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  ticket_id text not null unique,
  task_title text not null,
  requester_name text not null,
  requester_team text not null,
  requester_email text not null,
  task_category text not null,
  task_detail text not null,
  attachment_url text,
  created_date date not null default current_date,
  deadline_date date not null,
  completion_date date,
  priority text not null default 'Normal' check (priority in ('Normal', 'Urgent', 'Very Urgent')),
  status text not null default 'New' check (status in ('New', 'Reviewing', 'In Progress', 'Waiting for Info', 'Done', 'Rejected')),
  assignee_id uuid references users(id) on delete set null,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  comment text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists task_status_history (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  old_status text check (old_status in ('New', 'Reviewing', 'In Progress', 'Waiting for Info', 'Done', 'Rejected')),
  new_status text not null check (new_status in ('New', 'Reviewing', 'In Progress', 'Waiting for Info', 'Done', 'Rejected')),
  changed_by uuid references users(id) on delete set null,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists email_notifications (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  recipient_email text not null,
  email_type text not null check (
    email_type in (
      'request_received',
      'status_changed',
      'waiting_for_info',
      'completed',
      'rejected',
      'overdue_notice',
      'comment_added'
    )
  ),
  subject text not null,
  body text not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  sent_at timestamptz,
  error_message text
);

create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_ticket_id on tasks(ticket_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_deadline_date on tasks(deadline_date);
create index if not exists idx_tasks_requester_email on tasks(requester_email);
create index if not exists idx_task_comments_task_id on task_comments(task_id);
create index if not exists idx_status_history_task_id on task_status_history(task_id);
create index if not exists idx_email_notifications_task_id on email_notifications(task_id);
