"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Layers,
  Phone,
  MessageCircle,
  Mail,
  BarChart3,
  FileText,
  Users,
  CreditCard,
  Code,
  Shield,
  Server,
  Cloud,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ArrowLeft,
  Compass,
  Mic,
  Megaphone,
  Radio,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "User Guide",
    icon: <Compass className="w-4 h-4" />,
    children: [
      { title: "Dashboard Guide", href: "/docs/guide" },
      { title: "Getting Started", href: "/docs/guide/getting-started" },
      { title: "Scripts", href: "/docs/guide/scripts" },
      { title: "Voice Settings", href: "/docs/guide/voice" },
      { title: "Leads", href: "/docs/guide/leads" },
      { title: "Campaigns", href: "/docs/guide/campaigns" },
      { title: "Channels", href: "/docs/guide/channels" },
      { title: "Analytics", href: "/docs/guide/analytics" },
      { title: "Billing", href: "/docs/guide/billing" },
      { title: "Settings", href: "/docs/guide/settings" },
    ],
  },
  {
    title: "Getting Started",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      { title: "Overview", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Architecture", href: "/docs/architecture" },
    ],
  },
  {
    title: "Platform",
    icon: <Layers className="w-4 h-4" />,
    children: [
      { title: "Voice Calls", href: "/docs/channels/voice" },
      { title: "Telegram", href: "/docs/channels/telegram" },
      { title: "Email", href: "/docs/channels/email" },
    ],
  },
  {
    title: "API Reference",
    icon: <Code className="w-4 h-4" />,
    children: [
      { title: "Full Reference", href: "/docs/api" },
    ],
  },
  {
    title: "Deployment",
    icon: <Cloud className="w-4 h-4" />,
    children: [
      { title: "Deploy Guide", href: "/docs/deployment" },
    ],
  },
];

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

function SidebarSection({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasActiveChild = item.children?.some(
    (child) => child.href === pathname
  );
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-white/60 hover:text-white/90 transition-colors duration-200"
      >
        {item.icon}
        <span className="font-display">{item.title}</span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 ml-auto" />
        )}
      </button>
      {isOpen && item.children && (
        <div className="ml-3 border-l border-white/[0.06] pl-0">
          {item.children.map((child) => {
            const isActive = child.href === pathname;
            return (
              <Link
                key={child.href}
                href={child.href!}
                className={`block px-4 py-1.5 text-sm transition-colors duration-200 border-l-2 -ml-px ${
                  isActive
                    ? "border-[#ff4d4d] text-white bg-white/[0.04]"
                    : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20"
                }`}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-1.5 font-display font-bold text-base">
            <span className="text-white">project</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-[4px] text-[13px] leading-none font-bold">noir</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white/70 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] bg-[rgba(10,10,15,0.97)] border-r border-white/[0.06] overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-[rgba(10,10,15,0.97)] backdrop-blur-xl border-b border-white/[0.06] px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div>
              <span className="font-display font-bold text-2xl leading-none flex items-center gap-2">
                <span className="text-white">project</span>
                <span className="bg-white text-black px-2 py-1 rounded-[5px] text-[16px] leading-none font-bold">noir</span>
              </span>
              <span className="text-[10px] text-white/30 leading-none block mt-1.5">by Blackhole Research</span>
            </div>
          </Link>
        </div>

        <nav className="px-2 py-4">
          {navigation.map((item) => (
            <SidebarSection key={item.title} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="px-4 pb-6 mt-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-white/40 mb-2">Need help?</p>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Project Noir
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-[280px] pt-14 lg:pt-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[rgba(10,10,15,0.9)] backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-6 lg:px-10 h-14">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 && <span className="text-white/20">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white/70">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-white/40 hover:text-white/70 transition-colors duration-200"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            {/* Edit on GitHub */}
            <a
              href="https://github.com/void-research/project-noir"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              Edit on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Page content */}
        <div className="px-6 lg:px-16 py-8 lg:py-12 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Dark scrollbar */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        * { scrollbar-color: rgba(255,255,255,0.1) transparent; scrollbar-width: thin; }
      `}</style>
    </div>
  );
}
