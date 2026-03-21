export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display font-bold text-lg tracking-[-0.04em]">
          <span className="bg-gradient-to-r from-white via-white to-[#0090f0] bg-clip-text text-transparent">
            telephonia
          </span>
          <span className="text-[#0090f0]">.ai</span>
        </div>
        <div className="flex gap-8 text-sm text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="mailto:hello@telephonia.ai" className="hover:text-white/60 transition-colors">
            hello@telephonia.ai
          </a>
        </div>
        <div className="text-xs text-white/20">&copy; 2026 Telephonia.ai</div>
      </div>
    </footer>
  );
}
