import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertTriangle, Eye, ShieldCheck } from "lucide-react";

interface ProctorRow {
  id: string;
  context: string;
  event_type: string;
  severity: "low" | "medium" | "high";
  created_at: string;
}

const SEVERITY_WEIGHT = { low: 1, medium: 2, high: 3 } as const;

const TelemetryPage = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProctorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const load = async () => {
      const { data } = await supabase
        .from("proctor_events")
        .select("id, context, event_type, severity, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(500);
      if (active && data) setRows(data as ProctorRow[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`proctor-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "proctor_events",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setRows((prev) => [...prev, payload.new as ProctorRow]);
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const stats = useMemo(() => {
    const total = rows.length;
    const weight = rows.reduce((sum, r) => sum + SEVERITY_WEIGHT[r.severity], 0);
    const high = rows.filter((r) => r.severity === "high").length;
    // Focus % — penalise weighted violations against a soft cap of 20.
    const focus = Math.max(0, Math.min(100, 100 - weight * 5));
    return { total, weight, high, focus };
  }, [rows]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.event_type, (map.get(r.event_type) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([type, count]) => ({ type: type.replace(/_/g, " "), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [rows]);

  const timeline = useMemo(() => {
    // Bucket by minute since first event.
    if (rows.length === 0) return [] as Array<{ t: string; weight: number }>;
    const start = new Date(rows[0].created_at).getTime();
    const buckets = new Map<number, number>();
    rows.forEach((r) => {
      const minute = Math.floor((new Date(r.created_at).getTime() - start) / 60000);
      buckets.set(minute, (buckets.get(minute) ?? 0) + SEVERITY_WEIGHT[r.severity]);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a - b)
      .map(([m, w]) => ({ t: `+${m}m`, weight: w }));
  }, [rows]);

  const recent = useMemo(() => [...rows].reverse().slice(0, 12), [rows]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Proctor Telemetry</h1>
          <p className="text-slate-400 text-sm">
            Live view of your session integrity. Updates in real time as you take assessments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Eye className="h-5 w-5" />} label="Focus Score" value={`${stats.focus}%`} />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Total Events" value={stats.total} />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="High Severity" value={stats.high} />
          <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Violation Weight" value={stats.weight} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Violations over time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {timeline.length === 0 ? (
                <Empty />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="t" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Top violation types</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {byType.length === 0 ? (
                <Empty />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="type" stroke="#94a3b8" interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                    <Bar dataKey="count" fill="#f472b6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-400 text-sm">Loading…</p>
            ) : recent.length === 0 ? (
              <Empty />
            ) : (
              <ul className="divide-y divide-slate-700">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          r.severity === "high"
                            ? "border-red-500 text-red-400"
                            : r.severity === "medium"
                            ? "border-amber-500 text-amber-400"
                            : "border-slate-500 text-slate-300"
                        }
                      >
                        {r.severity}
                      </Badge>
                      <span className="text-white">{r.event_type.replace(/_/g, " ")}</span>
                      <span className="text-slate-500 text-xs">{r.context}</span>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {new Date(r.created_at).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <Card className="bg-slate-800/60 border-slate-700">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </CardContent>
  </Card>
);

const Empty = () => (
  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
    No data yet — start an assessment to populate telemetry.
  </div>
);

export default TelemetryPage;