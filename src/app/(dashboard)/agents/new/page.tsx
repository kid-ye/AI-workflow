"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ArrowRight, X } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

type FormData = {
  name: string;
  description: string;
  template: string;
  // Realtime flow
  persona: string;
  scope: string;
  governance: string;
  security: string;
  model: string;
  modelId: string;
  voice: string;
  voiceId: number;
  language: string;
  voiceLanguageId: number;
  // Custom flow
  speechToText: string;
  llm: string;
  textToSpeech: string;
  sstModel: string;
  sstLanguage: string;
  vad: string;
  ttsVoice: string;
  ttsModel: string;
  ttsLanguage: string;
  pace: number;
  expressiveness: number;
  systemPrompt: string;
  customGovernance: string;
  guardrails: string;
};

type Model = {
  model_name: string;
  id: string;
};

type Voice = {
  name: string;
  provider: string;
  language: string;
  type: string;
  id: number;
};

const REALTIME_STEPS = ["Persona", "Governance", "Model"];
const CUSTOM_STEPS = ["Configuration", "SST Config", "TTS Config", "System"];

function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center mb-16">
      {steps.map((label, i) => {
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
            {i < steps.length - 1 && (
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

const inputCls = "w-full bg-input border border-border px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors rounded-lg [color-scheme:dark]";
const textareaCls = `${inputCls} resize-none`;

function Slider({ label, value, onChange, min = 0, max = 1, step = 0.1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <span className="text-sm font-mono text-foreground w-12 text-right">{value.toFixed(1)}</span>
      </div>
    </Field>
  );
}

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

function ModelSelectField({ value, onChange, models, loading }: { value: string; onChange: (modelName: string, modelId: string) => void; models: Model[]; loading: boolean }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => {
          const selectedModel = models.find(m => m.model_name === e.target.value);
          if (selectedModel) {
            onChange(selectedModel.model_name, selectedModel.id);
          }
        }}
        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
        disabled={loading}
      >
        <option value="">{loading ? "Loading models..." : "Select…"}</option>
        {models.map(model => <option key={model.id} value={model.model_name}>{model.model_name}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
    </div>
  );
}

function VoiceSelectField({ value, onChange, voices, loading }: { value: string; onChange: (voiceName: string, voiceId: number) => void; voices: Voice[]; loading: boolean }) {
  // Get unique voice names
  const uniqueVoices = Array.from(new Set(voices.map(v => v.name))).map(name => {
    return voices.find(v => v.name === name)!;
  });

  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => {
          const selectedVoice = uniqueVoices.find(v => v.name === e.target.value);
          if (selectedVoice) {
            onChange(selectedVoice.name, selectedVoice.id);
          }
        }}
        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
        disabled={loading}
      >
        <option value="">{loading ? "Loading voices..." : "Select…"}</option>
        {uniqueVoices.map(voice => <option key={voice.id} value={voice.name}>{voice.name}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
    </div>
  );
}

// Custom Flow Steps
function CustomStep1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Speech to Text">
        <SelectField
          value={data.speechToText}
          onChange={v => set("speechToText", v)}
          options={["Whisper", "Deepgram", "Google STT", "Azure STT"]}
        />
      </Field>
      <Field label="LLM">
        <SelectField
          value={data.llm}
          onChange={v => set("llm", v)}
          options={["GPT-4", "GPT-3.5", "Claude", "Gemini"]}
        />
      </Field>
      <Field label="Text to Speech">
        <SelectField
          value={data.textToSpeech}
          onChange={v => set("textToSpeech", v)}
          options={["OpenAI TTS", "ElevenLabs", "Google TTS", "Azure TTS"]}
        />
      </Field>
    </div>
  );
}

function CustomStep2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Model">
        <SelectField
          value={data.sstModel}
          onChange={v => set("sstModel", v)}
          options={["whisper-1", "nova-2", "base"]}
        />
      </Field>
      <Field label="Language">
        <SelectField
          value={data.sstLanguage}
          onChange={v => set("sstLanguage", v)}
          options={["English", "Spanish", "French", "German", "Japanese"]}
        />
      </Field>
      <Field label="VAD">
        <SelectField
          value={data.vad}
          onChange={v => set("vad", v)}
          options={["Silero", "WebRTC", "None"]}
        />
      </Field>
    </div>
  );
}

function CustomStep3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | number) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Voice">
        <SelectField
          value={data.ttsVoice}
          onChange={v => set("ttsVoice", v)}
          options={["alloy", "echo", "nova", "shimmer"]}
        />
      </Field>
      <Field label="Model">
        <SelectField
          value={data.ttsModel}
          onChange={v => set("ttsModel", v)}
          options={["tts-1", "tts-1-hd"]}
        />
      </Field>
      <Field label="Language">
        <SelectField
          value={data.ttsLanguage}
          onChange={v => set("ttsLanguage", v)}
          options={["English", "Spanish", "French", "German", "Japanese"]}
        />
      </Field>
      <Slider
        label="Pace"
        value={data.pace}
        onChange={v => set("pace", v)}
        min={0}
        max={1}
        step={0.1}
      />
      <Slider
        label="Expressiveness"
        value={data.expressiveness}
        onChange={v => set("expressiveness", v)}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  );
}

function CustomStep4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Persona">
        <input
          className={inputCls}
          placeholder="Define the agent's persona and personality"
          value={data.persona}
          onChange={e => set("persona", e.target.value)}
          autoFocus
        />
      </Field>
      <Field label="System Prompt">
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="Define the system prompt for your agent"
          value={data.systemPrompt}
          onChange={e => set("systemPrompt", e.target.value)}
        />
      </Field>
      <Field label="Governance">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Define governance policies"
          value={data.customGovernance}
          onChange={e => set("customGovernance", e.target.value)}
        />
      </Field>
      <Field label="Guardrails">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Define guardrails and safety measures"
          value={data.guardrails}
          onChange={e => set("guardrails", e.target.value)}
        />
      </Field>
    </div>
  );
}

// Realtime Flow Steps
function RealtimeStep1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
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

function RealtimeStep2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
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

function RealtimeStep3({ data, set, models, loadingModels, voices, loadingVoices }: { data: FormData; set: (k: keyof FormData, v: string | number) => void; models: Model[]; loadingModels: boolean; voices: Voice[]; loadingVoices: boolean }) {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  useEffect(() => {
    if (data.voiceId) {
      setLoadingLanguages(true);
      // Filter voices that match the selected voice name to get all language options
      const voiceOptions = voices.filter(v => v.name === data.voice);
      const languages = voiceOptions.map(v => v.language);
      setAvailableLanguages(languages);
      setLoadingLanguages(false);
      
      // Reset language selection when voice changes
      if (data.language && !languages.includes(data.language)) {
        set("language", "");
        set("voiceLanguageId", 0);
      }
    } else {
      setAvailableLanguages([]);
    }
  }, [data.voiceId, data.voice, voices]);

  const handleLanguageChange = (language: string) => {
    set("language", language);
    // Find the voice-language combination ID
    const voiceLanguageCombo = voices.find(v => v.name === data.voice && v.language === language);
    if (voiceLanguageCombo) {
      set("voiceLanguageId", voiceLanguageCombo.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Model">
        <ModelSelectField
          value={data.model}
          onChange={(modelName, modelId) => {
            set("model", modelName);
            set("modelId", modelId);
          }}
          models={models}
          loading={loadingModels}
        />
      </Field>
      <Field label="Voice (Optional)">
        <VoiceSelectField
          value={data.voice}
          onChange={(voiceName, voiceId) => {
            set("voice", voiceName);
            set("voiceId", voiceId);
          }}
          voices={voices}
          loading={loadingVoices}
        />
      </Field>
      <Field label="Language">
        <div className="relative">
          <select
            value={data.language}
            onChange={e => handleLanguageChange(e.target.value)}
            className={`${inputCls} appearance-none pr-10 cursor-pointer`}
            disabled={!data.voice || loadingLanguages}
          >
            <option value="">{!data.voice ? "Select a voice first" : loadingLanguages ? "Loading languages..." : "Select…"}</option>
            {availableLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
        </div>
      </Field>
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
    </div>
  );
}

function Step0({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
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
          options={["Realtime", "Custom", "OS"]}
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

function Step4({ data, set, models, loadingModels, voices, loadingVoices }: { data: FormData; set: (k: keyof FormData, v: string | number) => void; models: Model[]; loadingModels: boolean; voices: Voice[]; loadingVoices: boolean }) {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  useEffect(() => {
    if (data.voiceId) {
      setLoadingLanguages(true);
      // Filter voices that match the selected voice name to get all language options
      const voiceOptions = voices.filter(v => v.name === data.voice);
      const languages = voiceOptions.map(v => v.language);
      setAvailableLanguages(languages);
      setLoadingLanguages(false);
      
      // Reset language selection when voice changes
      if (data.language && !languages.includes(data.language)) {
        set("language", "");
        set("voiceLanguageId", 0);
      }
    } else {
      setAvailableLanguages([]);
    }
  }, [data.voiceId, data.voice, voices]);

  const handleLanguageChange = (language: string) => {
    set("language", language);
    // Find the voice-language combination ID
    const voiceLanguageCombo = voices.find(v => v.name === data.voice && v.language === language);
    if (voiceLanguageCombo) {
      set("voiceLanguageId", voiceLanguageCombo.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Model">
        <ModelSelectField
          value={data.model}
          onChange={(modelName, modelId) => {
            set("model", modelName);
            set("modelId", modelId);
          }}
          models={models}
          loading={loadingModels}
        />
      </Field>
      <Field label="Voice (Optional)">
        <VoiceSelectField
          value={data.voice}
          onChange={(voiceName, voiceId) => {
            set("voice", voiceName);
            set("voiceId", voiceId);
          }}
          voices={voices}
          loading={loadingVoices}
        />
      </Field>
      <Field label="Language">
        <div className="relative">
          <select
            value={data.language}
            onChange={e => handleLanguageChange(e.target.value)}
            className={`${inputCls} appearance-none pr-10 cursor-pointer`}
            disabled={!data.voice || loadingLanguages}
          >
            <option value="">{!data.voice ? "Select a voice first" : loadingLanguages ? "Loading languages..." : "Select…"}</option>
            {availableLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
        </div>
      </Field>
    </div>
  );
}

function canNext(step: number, data: FormData, isCustom: boolean): boolean {
  // Step 0 is template selection (common for both)
  if (step === 0) return !!data.name.trim() && !!data.template;
  
  if (isCustom) {
    if (step === 1) return !!data.speechToText && !!data.llm && !!data.textToSpeech;
    if (step === 2) return !!data.sstModel && !!data.sstLanguage && !!data.vad;
    if (step === 3) return !!data.ttsVoice && !!data.ttsModel && !!data.ttsLanguage;
    if (step === 4) return !!data.persona.trim() && !!data.systemPrompt.trim() && !!data.customGovernance.trim() && !!data.guardrails.trim();
  } else {
    if (step === 1) return !!data.persona.trim() && !!data.scope.trim();
    if (step === 2) return !!data.governance.trim() && !!data.security.trim();
    if (step === 3) return !!data.model && !!data.language && !!data.voiceLanguageId;
  }
  return true;
}

const defaultForm: FormData = {
  name: "", description: "", template: "",
  persona: "", scope: "",
  governance: "", security: "",
  model: "", modelId: "", voice: "", voiceId: 0, language: "", voiceLanguageId: 0,
  speechToText: "", llm: "", textToSpeech: "",
  sstModel: "", sstLanguage: "", vad: "",
  ttsVoice: "", ttsModel: "", ttsLanguage: "",
  pace: 0.5, expressiveness: 0.5,
  systemPrompt: "", customGovernance: "", guardrails: "",
};

export default function NewAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showNotification, setShowNotification] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);

  useEffect(() => {
    async function fetchModels() {
      setLoadingModels(true);
      try {
        const response = await fetch('/api/models?skip=0&limit=100');
        if (response.ok) {
          const data = await response.json();
          setModels(data);
        } else {
          console.error('Failed to fetch models:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, []);

  useEffect(() => {
    async function fetchVoices() {
      setLoadingVoices(true);
      try {
        const response = await fetch('/api/voices?skip=0&limit=100');
        if (response.ok) {
          const data = await response.json();
          setVoices(data);
        } else {
          console.error('Failed to fetch voices:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error);
      } finally {
        setLoadingVoices(false);
      }
    }
    fetchVoices();
  }, []);

  function set(k: keyof FormData, v: string | number) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const isCustomFlow = form.template === "Custom";
  const steps = isCustomFlow ? CUSTOM_STEPS : REALTIME_STEPS;
  const totalSteps = isCustomFlow ? 4 : 3; // Custom has 4 steps after template, Realtime has 3
  const isFirstStepCompleted = form.template !== "";

  function next() {
    if (!canNext(step, form, isCustomFlow)) {
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
    if (!canNext(step, form, isCustomFlow)) {
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

  const isLast = isFirstStepCompleted && step === totalSteps;

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
        {isFirstStepCompleted && <Stepper current={step - 1} steps={steps} />}

        {/* Form Card */}
        <div className="bg-card border border-border p-10 mb-10 rounded-xl">
          {step === 0 ? (
            <Step0 data={form} set={set} />
          ) : isCustomFlow ? (
            <>
              {step === 1 && <CustomStep1 data={form} set={set} />}
              {step === 2 && <CustomStep2 data={form} set={set} />}
              {step === 3 && <CustomStep3 data={form} set={set} />}
              {step === 4 && <CustomStep4 data={form} set={set} />}
            </>
          ) : (
            <>
              {step === 1 && <RealtimeStep1 data={form} set={set} />}
              {step === 2 && <RealtimeStep2 data={form} set={set} />}
              {step === 3 && <RealtimeStep3 data={form} set={set} models={models} loadingModels={loadingModels} voices={voices} loadingVoices={loadingVoices} />}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={back}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 uppercase tracking-wider"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={isLast ? create : next}
            className="group relative inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider py-3 transition-all active:translate-y-px"
          >
            {isLast ? (isCustomFlow ? "Build Context" : "Create Agent") : "Next"}
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
