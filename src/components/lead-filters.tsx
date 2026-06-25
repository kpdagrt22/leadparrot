"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/types";

const STAGES = ["research", "problem-aware", "solution-aware", "buying-intent", "competitor-switching", "not-a-lead"];
const STATUSES = ["new", "saved", "contacted", "not_relevant", "won", "lost"];
const SOURCES = ["reddit", "hackernews", "rss", "manual", "web_search_placeholder"];

export function LeadFilters({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/app/leads?${params.toString()}`);
  }

  const get = (k: string) => sp.get(k) ?? "";

  return (
    <div className="card flex flex-wrap items-end gap-3 p-4">
      <Select label="Project" value={get("project")} onChange={(v) => update("project", v)}>
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </Select>
      <Select label="Score" value={get("tier")} onChange={(v) => update("tier", v)}>
        <option value="">Any score</option>
        <option value="high">High (≥70)</option>
        <option value="medium">Medium (40–69)</option>
        <option value="low">Low (&lt;40)</option>
      </Select>
      <Select label="Source" value={get("source")} onChange={(v) => update("source", v)}>
        <option value="">All sources</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      <Select label="Stage" value={get("stage")} onChange={(v) => update("stage", v)}>
        <option value="">Any stage</option>
        {STAGES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      <Select label="Status" value={get("status")} onChange={(v) => update("status", v)}>
        <option value="">Any status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </Select>
      <Select label="Sort" value={get("sort")} onChange={(v) => update("sort", v)}>
        <option value="score">Highest score</option>
        <option value="newest">Newest</option>
      </Select>
      <div className="flex-1">
        <label className="label">Search</label>
        <input
          className="input"
          defaultValue={get("q")}
          placeholder="Search title or excerpt…"
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input min-w-[140px]" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
}
