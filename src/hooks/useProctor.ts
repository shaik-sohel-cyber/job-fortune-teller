import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ProctorSeverity = "low" | "medium" | "high";
export interface ProctorEvent {
  type: string;
  severity: ProctorSeverity;
  at: number;
  metadata?: Record<string, unknown>;
}

interface UseProctorOpts {
  context: string; // e.g. "aptitude" | "assessment" | "coding"
  enabled: boolean;
  maxViolations?: number;
  onDisqualify?: (events: ProctorEvent[]) => void;
}

const SEVERITY_WEIGHT: Record<ProctorSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function useProctor({
  context,
  enabled,
  maxViolations = 6,
  onDisqualify,
}: UseProctorOpts) {
  const { toast } = useToast();
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [score, setScore] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const disqualifiedRef = useRef(false);

  const log = useCallback(
    async (type: string, severity: ProctorSeverity, metadata?: Record<string, unknown>) => {
      const ev: ProctorEvent = { type, severity, at: Date.now(), metadata };
      setEvents((prev) => [...prev, ev]);
      setScore((s) => s + SEVERITY_WEIGHT[severity]);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("proctor_events").insert({
            user_id: user.id,
            context,
            event_type: type,
            severity,
            metadata: metadata ?? {},
          });
        }
      } catch {
        /* swallow */
      }
      if (severity !== "low") {
        toast({
          title: "Proctor warning",
          description: type.replace(/_/g, " "),
          variant: "destructive",
        });
      }
    },
    [context, toast],
  );

  // Camera + listeners
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      } catch (e) {
        setCameraError((e as Error).message);
        log("camera_denied", "high");
      }
    })();

    const onVis = () => {
      if (document.hidden) log("tab_hidden", "high");
    };
    const onBlur = () => log("window_blur", "medium");
    const onCopy = () => log("copy", "medium");
    const onPaste = () => log("paste", "medium");
    const onCut = () => log("cut", "medium");
    const onCtx = (e: MouseEvent) => {
      e.preventDefault();
      log("contextmenu", "low");
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a", "p", "u", "s"].includes(k)) {
        e.preventDefault();
        log(`shortcut_${k}`, "medium");
      }
      if (k === "f12" || (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k))) {
        e.preventDefault();
        log("devtools_attempt", "high");
      }
    };
    const onFs = () => {
      if (!document.fullscreenElement) log("fullscreen_exit", "high");
    };

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    document.addEventListener("cut", onCut);
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [enabled, log]);

  // Auto-disqualify
  useEffect(() => {
    if (!enabled || disqualifiedRef.current) return;
    if (score >= maxViolations) {
      disqualifiedRef.current = true;
      onDisqualify?.(events);
    }
  }, [score, maxViolations, enabled, events, onDisqualify]);

  return {
    videoRef,
    cameraReady,
    cameraError,
    events,
    violationScore: score,
    maxViolations,
    log,
  };
}