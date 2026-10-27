import { notFound } from "next/navigation";
import { ProjectHub } from "@/components/hub/project-hub";

export function generateStaticParams() {
  return [{ group: "personal" }, { group: "business" }];
}

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (group !== "personal" && group !== "business") notFound();
  return <ProjectHub group={group} />;
}
