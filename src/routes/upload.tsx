import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Btn, MasteryBar, NextLink, PageHeader, SargeSays } from "@/components/sarge/ui";
import { useSarge } from "@/lib/sarge-store";
import { TOPICS, WEAK_THRESHOLD } from "@/lib/sarge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Slides — Sarge Study Coach" },
      { name: "description", content: "Drop in your course slides and Sarge maps every topic." },
      { property: "og:title", content: "Upload Slides — Sarge Study Coach" },
      { property: "og:description", content: "Drop in your course slides and Sarge maps every topic." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { uploaded, setUploaded, mastery } = useSarge();
  const [reading, setReading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("MLF_Lectures_1-8.pdf");

  const start = (name?: string) => {
    if (name) setFileName(name);
    setReading(true);
    setTimeout(() => { setReading(false); setUploaded(true); }, 2000);
  };

  return (
    <div>
      <PageHeader tag="Screen 02 · Upload" title="Hand over the intel" sub="Drop your course slides. Sarge reads everything so you know exactly what you're up against." />

      {!uploaded && !reading && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); start(e.dataTransfer.files[0]?.name); }}
          className={cn("panel flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-12 text-center transition-all", drag ? "border-primary bg-primary/5" : "hover:border-primary/50")}
        >
          <input type="file" className="hidden" onChange={(e) => start(e.target.files?.[0]?.name)} />
          <UploadCloud className="h-12 w-12 text-primary" />
          <div className="stencil text-2xl">Drag slides here</div>
          <div className="text-sm text-muted-foreground">PDF or PPTX · or click to browse</div>
          <Btn variant="outline" onClick={() => start()}>Use sample slides</Btn>
        </label>
      )}

      {reading && (
        <div className="panel flex flex-col items-center gap-5 p-12 text-center">
          <div className="flex items-center gap-3 font-mono text-sm"><FileText className="h-4 w-4 text-primary" />{fileName}</div>
          <div className="stencil animate-pulse text-3xl text-primary">Sarge is reading your material</div>
          <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ animation: "slide-in 2s linear", width: "100%" }} />
          </div>
        </div>
      )}

      {uploaded && (
        <div className="space-y-6">
          <SargeSays>Six topics. Neural Network Basics is your weakest flank. We'll hit it hard.</SargeSays>
          <div className="panel p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="stencil text-xl">Topic map</div>
              <div className="label-tag">Machine Learning Foundations</div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {TOPICS.map((t, k) => (
                <div key={t} className="slide-in" style={{ animationDelay: `${k * 90}ms` }}>
                  <MasteryBar label={t} value={mastery[t]} weak={mastery[t] < WEAK_THRESHOLD} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <Btn variant="ghost" onClick={() => setUploaded(false)}>Upload again</Btn>
            <NextLink to="/plan">See battle plan</NextLink>
          </div>
        </div>
      )}
    </div>
  );
}
