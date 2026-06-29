import { RefObject } from "react";
import { Camera, ShieldAlert, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  cameraReady: boolean;
  cameraError: string | null;
  violationScore: number;
  maxViolations: number;
}

const ProctorOverlay = ({
  videoRef,
  cameraReady,
  cameraError,
  violationScore,
  maxViolations,
}: Props) => {
  const pct = Math.min(100, (violationScore / maxViolations) * 100);
  return (
    <div className="fixed bottom-4 right-4 z-50 w-56 bg-slate-900/95 border border-slate-700 rounded-lg p-2 shadow-xl text-white text-xs">
      <div className="relative aspect-video bg-black rounded overflow-hidden mb-2">
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-red-400 text-center p-2">
            <Camera className="h-4 w-4 mr-1" />
            {cameraError ? "Camera blocked" : "Connecting..."}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1">
          {violationScore === 0 ? (
            <ShieldCheck className="h-3 w-3 text-green-400" />
          ) : (
            <ShieldAlert className="h-3 w-3 text-orange-400" />
          )}
          Overwatch
        </span>
        <span>
          {violationScore}/{maxViolations}
        </span>
      </div>
      <Progress value={pct} className="h-1" />
    </div>
  );
};

export default ProctorOverlay;