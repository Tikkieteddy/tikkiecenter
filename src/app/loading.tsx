import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-5 lg:px-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-brand-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-brand-100">
            <CardContent className="space-y-3 p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-8 w-16 animate-pulse rounded bg-brand-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
