import { Phone, Mic, Volume2, Brain, Settings } from "lucide-react";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(0,0,0,0.95)] overflow-hidden my-4">
      {title && (
        <div className="px-4 py-2.5 border-b border-white/[0.06] text-xs font-mono text-white/40">
          {title}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-xs text-white/60 font-mono leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function Heading2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl font-bold text-white mt-14 mb-4 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-[#ff4d4d] transition-colors duration-200">
        {children}
      </a>
    </h2>
  );
}

export default function VoiceDocsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 text-[#ff4d4d] text-xs font-medium mb-4">
          <Phone className="w-3.5 h-3.5" />
          Voice Channel
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Voice Calls
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          AI voice agents powered by Pipecat that make phone calls indistinguishable
          from real humans. Uses Deepgram for speech-to-text, GPT-4o for conversation,
          and ElevenLabs for text-to-speech.
        </p>
      </div>

      {/* Pipeline Overview */}
      <Heading2 id="pipeline">Voice Pipeline</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The voice agent runs a real-time audio pipeline using the Pipecat framework.
        Audio streams through Twilio WebSocket and is processed in the following stages:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: <Mic className="w-5 h-5 text-blue-400" />, label: "Deepgram STT", desc: "Nova-3 speech-to-text" },
          { icon: <Brain className="w-5 h-5 text-purple-400" />, label: "GPT-4o", desc: "Via OpenRouter" },
          { icon: <Volume2 className="w-5 h-5 text-emerald-400" />, label: "ElevenLabs TTS", desc: "Natural voice synthesis" },
          { icon: <Phone className="w-5 h-5 text-[#ff4d4d]" />, label: "Twilio", desc: "Call transport" },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
            <div className="flex justify-center mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-white/80">{item.label}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock title="Pipeline Architecture">
{`Audio In (Twilio WebSocket)
    |
    v
Silero VAD (Voice Activity Detection)
    |
    v
Deepgram Nova-3 STT (Speech-to-Text)
    |
    v
LLM Context Aggregator
    |
    v
GPT-4o via OpenRouter (Conversation AI)
    |
    v
TranscriptCollector (Logs full conversation)
    |
    v
ElevenLabs TTS (Text-to-Speech)
    |
    v
Audio Out (Twilio WebSocket)`}
      </CodeBlock>

      {/* Project Structure */}
      <Heading2 id="structure">Project Structure</Heading2>
      <CodeBlock title="voice-agent/">
{`voice-agent/
├── bot.py               # Main Pipecat pipeline (STT -> LLM -> TTS)
├── server.py            # Custom server wrapper adding API routes
├── api.py               # FastAPI endpoints (/api/call, /api/config, /api/health)
├── config.py            # Agent identity, model settings, greeting templates
├── prompts.py           # System prompt generation with personality presets
├── live_config.py       # Thread-safe live config store (dashboard sync)
├── requirements.txt
└── Dockerfile           # Railway deployment (port 7860)`}
      </CodeBlock>

      {/* API Endpoints */}
      <Heading2 id="api">Voice Agent API</Heading2>
      <div className="space-y-3 mb-6">
        {[
          { method: "POST", path: "/api/call", desc: "Initiate an outbound call to a phone number" },
          { method: "POST", path: "/api/config", desc: "Sync voice configuration from dashboard" },
          { method: "GET", path: "/api/config", desc: "Get current voice configuration" },
          { method: "GET", path: "/api/health", desc: "Health check endpoint" },
        ].map((ep) => (
          <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
              {ep.method}
            </span>
            <code className="text-sm font-mono text-white/70">{ep.path}</code>
            <span className="text-xs text-white/35 ml-auto">{ep.desc}</span>
          </div>
        ))}
      </div>

      {/* Configuration */}
      <Heading2 id="configuration">Configuration</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Voice settings are managed from the dashboard and synced to the Railway service
        via the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">/api/config</code> endpoint.
      </p>

      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Setting</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Voice ID", "ElevenLabs voice identifier for TTS"],
              ["Selected Voices", "Array of available voice options"],
              ["Language", "uk (Ukrainian), en (English), or multi (multilingual)"],
              ["Personality", "Preset: professional, friendly, persuasive, etc."],
              ["Speed", "TTS speaking speed multiplier (default: 1.0)"],
            ].map(([setting, desc], i) => (
              <tr key={setting} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 text-white/70 font-medium">{setting}</td>
                <td className="px-5 py-3 text-white/45">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call Logging */}
      <Heading2 id="logging">Call Logging</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        When a call disconnects, the voice agent automatically saves a full call log
        to the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">call_logs</code> table including:
      </p>
      <ul className="list-disc list-inside space-y-2 text-white/50 mb-6">
        <li>Full transcript as JSONB array of <code className="px-1 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">{`{role, content}`}</code> pairs</li>
        <li>Flat transcription text for search</li>
        <li>Call duration in seconds</li>
        <li>Sentiment analysis (positive, neutral, negative)</li>
        <li>Call score (0-100)</li>
        <li>Recording URL (if enabled)</li>
      </ul>

      {/* Call Statuses */}
      <Heading2 id="statuses">Call Statuses</Heading2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          { status: "completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { status: "failed", color: "text-red-400 bg-red-500/10 border-red-500/20" },
          { status: "no_answer", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { status: "voicemail", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { status: "busy", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
          { status: "in_progress", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        ].map(({ status, color }) => (
          <div key={status} className={`px-3 py-2 rounded-lg border text-sm font-mono text-center ${color}`}>
            {status}
          </div>
        ))}
      </div>
    </div>
  );
}
