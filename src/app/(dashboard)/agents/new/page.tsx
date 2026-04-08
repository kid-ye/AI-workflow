"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ArrowRight, X } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

type FormData = {
  name: string;
  description: string;
  template: string;
  persona: string;
  scope: string;
  governance: string;
  security: string;
  model: string;
  voice: string;
  language: string;
};

const STEPS = ["Basic", "Persona", "Governance", "Model"];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-16">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-10 h-10 border-2 flex items-center justify-center text-sm font-mono uppercase tracking-wider transition-all duration-150 rounded-lg
                  ${done ? "bg-accent border-accent text-accent-foreground" : active ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
              >
                {done ? <Check className="w-5 h-5" strokeWidth={2} /> : i + 1}
              </div>
              <span className={`text-xs font-mono uppercase tracking-widest transition-colors ${active ? "text-foreground" : done ? "text-accent" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-24 h-px mx-4 transition-colors ${i < current ? "bg-accent" : "bg-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-input border border-border px-4 py-3 text-base text-background placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors rounded-lg";
const textareaCls = `${inputCls} resize-none`;

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
    </div>
  );
}

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Agent Name">
        <input
          className={inputCls}
          placeholder="Enter agent name"
          value={data.name}
          onChange={e => set("name", e.target.value)}
          autoFocus
        />
      </Field>
      <Field label="Description">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Briefly describe what this agent does"
          value={data.description}
          onChange={e => set("description", e.target.value)}
        />
      </Field>
      <Field label="Template">
        <SelectField
          value={data.template}
          onChange={v => set("template", v)}
          options={["Realtime", "Async", "Batch", "Custom"]}
        />
      </Field>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground italic tracking-tight leading-relaxed">
        Define the agent's personality and operational boundaries
      </p>
      <Field label="Persona">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Describe the agent's tone, personality, and communication style"
          value={data.persona}
          onChange={e => set("persona", e.target.value)}
          autoFocus
        />
      </Field>
      <Field label="Scope">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Define what this agent is allowed and not allowed to do"
          value={data.scope}
          onChange={e => set("scope", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Governance Policy">
        <input
          className={inputCls}
          placeholder="e.g. GDPR, HIPAA, internal compliance rules"
          value={data.governance}
          onChange={e => set("governance", e.target.value)}
          autoFocus
        />
      </Field>
      <Field label="Security">
        <input
          className={inputCls}
          placeholder="e.g. PII masking, restricted topics, auth requirements"
          value={data.security}
          onChange={e => set("security", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Model">
        <SelectField
          value={data.model}
          onChange={v => set("model", v)}
          options={["GPT-4o", "GPT-4 Turbo", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"]}
        />
      </Field>
      <Field label="Voice (Optional)">
        <SelectField
          value={data.voice}
          onChange={v => set("voice", v)}
          options={["Echo", "Alloy", "Nova", "Shimmer", "Onyx"]}
        />
      </Field>
      <Field label="Language">
        <SelectField
          value={data.language}
          onChange={v => set("language", v)}
          options={["English", "German", "French", "Spanish", "Japanese"]}
        />
      </Field>
    </div>
  );
}

function canNext(step: number, data: FormData): boolean {
  if (step === 0) return !!data.name.trim() && !!data.template;
  if (step === 1) return !!data.persona.trim() && !!data.scope.trim();
  if (step === 2) return !!data.governance.trim() && !!data.security.trim();
  if (step === 3) return !!data.model && !!data.language;
  return true;
}

const defaultForm: FormData = {
  name: "", description: "", template: "",
  persona: "", scope: "",
  governance: "", security: "",
  model: "", voice: "", language: "",
};

export default function NewAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showNotification, setShowNotification] = useState(false);

  function set(k: keyof FormData, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function next() {
    if (!canNext(step, form)) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setStep(s => s + 1);
  }

  function back() {
    setStep(s => s - 1);
  }

  function create() {
    if (!canNext(step, form)) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    const newAgent = {
      id: Date.now(),
      name: form.name,
      createdBy: "You",
      createdAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
    };

    const existingAgents = JSON.parse(localStorage.getItem("agents") || "[]");
    localStorage.setItem("agents", JSON.stringify([newAgent, ...existingAgents]));

    router.push("/agents");
  }

  const isLast = step === 3;

  return (
    <>
      <DashboardNavbar />

      <div className="max-w-[860px] mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mb-16 border-b border-border pb-8">
          <h1 className="text-5xl font-semibold tracking-tighter leading-none text-foreground">New Agent</h1>
          <p className="text-base text-muted-foreground mt-2 tracking-tight">Create and configure your agent</p>
        </div>

        {/* Stepper */}
        <Stepper current={step} />

        {/* Form Card */}
        <div className="bg-card border border-border p-10 mb-10 rounded-xl">
          {step === 0 && <Step1 data={form} set={set} />}
          {step === 1 && <Step2 data={form} set={set} />}
          {step === 2 && <Step3 data={form} set={set} />}
          {step === 3 && <Step4 data={form} set={set} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 uppercase tracking-wider"
          >
            Back
          </button>
          <button
            onClick={isLast ? create : next}
            className="group relative inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider py-3 transition-all active:translate-y-px"
          >
            {isLast ? "Create Agent" : "Next"}
            {!isLast && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-100 group-hover:scale-x-110 transition-transform origin-left"></span>
          </button>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-8 left-8 bg-accent text-accent-foreground text-xs font-mono uppercase tracking-wider px-6 py-3 flex items-center gap-3 border-2 border-accent rounded-lg">
            <span>Please fill all required fields</span>
            <button onClick={() => setShowNotification(false)} className="hover:opacity-70">
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
