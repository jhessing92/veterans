import { Shield, Compass, BarChart3, Heart, Users, MapPin, TrendingUp, Lock, CheckCircle2, ExternalLink, ArrowRight, Zap, Target, Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="py-4 px-4 sm:py-6 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src="https://i.imgur.com/E6quH0d.png"
            alt="ShooflyAI"
            className="h-8 sm:h-10 w-auto"
          />
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800">
            <nav className="flex flex-col gap-3">
              <a href="#outcomes" className="text-slate-300 hover:text-white py-2">Outcomes</a>
              <a href="#solution" className="text-slate-300 hover:text-white py-2">Solution</a>
              <a href="#demo" className="text-slate-300 hover:text-white py-2">Demo</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/screenshot_2025-12-15_at_11.48.49_am.png"
            alt="American Flag with Veteran Silhouette"
            className="w-full h-full object-cover opacity-30 sm:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 sm:via-slate-950/80 to-slate-950/60 sm:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Community-Backed Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight">
              <span className="text-white">Veterans AI</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Companion Pilot</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-4 sm:mb-6 leading-relaxed">
              Private, always-available support designed to help in minutes.
            </p>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Benefits guidance, local resources, and peer connection. Running now through April 2025.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-8 sm:mt-12">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">Pilot Active</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
              <div className="text-slate-400 text-xs sm:text-sm">50-100 Veterans</div>
              <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
              <div className="text-slate-400 text-xs sm:text-sm">Roswell, GA</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-slate-500 flex items-start justify-center p-1.5 sm:p-2">
            <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>April 2025 Deliverables</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              What we're building
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Concrete outcomes backed by community partners
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { icon: Activity, title: 'Live Pilot', desc: 'A community-backed pilot operating in Roswell with real veterans' },
              { icon: BarChart3, title: 'Measurable Impact', desc: 'Early, quantifiable outcomes and lessons learned' },
              { icon: TrendingUp, title: 'Sustainable Path', desc: 'Clear path to sustained sponsorship or civic partnership' },
              { icon: Users, title: 'Repeatable Model', desc: 'A civic model that starts with veterans and scales to other groups' }
            ].map((item, i) => (
              <div key={i} className="group p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>The Challenge</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 leading-tight">
                Why this <span className="text-cyan-400">matters</span>
              </h2>
              <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Veterans face unique challenges that current systems aren't designed to address effectively.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[
                'Isolation after service and loss of trusted peer connection',
                'Benefits are confusing, fragmented, and underutilized',
                'Critical moments need private help in minutes, not appointments',
                'Existing systems are reactive rather than proactive'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                  </div>
                  <span className="text-sm sm:text-lg text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Compass className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>The Solution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              What's included
            </h2>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              A privacy-first companion designed to help in two minutes, not two hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { num: '01', title: 'AI Companion', desc: 'Private support, guidance, and next steps with safety guardrails', color: 'from-cyan-500 to-blue-500' },
              { num: '02', title: 'Battle Buddy Matching', desc: 'Connect with veterans who share similar experiences', color: 'from-teal-500 to-emerald-500' },
              { num: '03', title: 'Benefits Navigator', desc: 'Identify likely benefits and how to pursue them', color: 'from-emerald-500 to-green-500' },
              { num: '04', title: 'Local Resources', desc: 'Veteran-friendly services, events, and opportunities', color: 'from-amber-500 to-orange-500' },
              { num: '05', title: 'Admin Insights', desc: 'Aggregate, privacy-safe trend reporting', color: 'from-rose-500 to-pink-500' },
              { num: '06', title: 'Daily Affirmations', desc: 'Lightweight daily touchpoint to support consistency', color: 'from-violet-500 to-purple-500' }
            ].map((feature) => (
              <div key={feature.num} className="group relative p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden active:scale-[0.98]">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <span className={`text-4xl sm:text-5xl font-black bg-gradient-to-br ${feature.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>{feature.num}</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 sm:mt-2 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-amber-50 border-l-4 border-amber-400">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1 sm:mb-2 text-sm sm:text-base">Important Safety Note</h4>
                <p className="text-amber-800 text-sm sm:text-base">
                  Not a therapist. Not emergency services. If risk is detected, the experience guides users to the Veterans Crisis Line / 988.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Plan */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Pilot Roadmap</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              How it runs
            </h2>
          </div>

          <div className="relative">
            <div className="space-y-4 sm:space-y-8">
              {[
                { week: 'Launch', title: 'Initial Cohort', desc: '50-100 veterans recruited through community partners, local law enforcement, and veteran organizations' },
                { week: 'Week 1', title: 'Onboarding', desc: 'Launch, onboarding, and baseline check-ins with participants' },
                { week: 'Weeks 2-4', title: 'Iteration', desc: 'Weekly iteration driven by real veteran feedback' },
                { week: 'Ongoing', title: 'Evolution', desc: 'Built-in feedback loop ensures the platform evolves based on real needs' }
              ].map((item, i) => (
                <div key={i} className="relative flex gap-4 sm:gap-8">
                  <div className="flex w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                    <CheckCircle2 className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                    <span className="text-cyan-400 font-mono text-xs sm:text-sm font-bold">{item.week}</span>
                    <h3 className="text-base sm:text-xl font-bold text-white mt-1 sm:mt-2 mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Measuring Success</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                How we track <span className="text-cyan-600">impact</span>
              </h2>
              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Every metric is designed to show real, meaningful change in veterans' lives.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { metric: 'Activation', desc: 'Weekly active usage' },
                { metric: 'Check-ins', desc: 'Opt-in trends over time' },
                { metric: 'Benefits', desc: 'Actions started' },
                { metric: 'Resources', desc: 'Local contacts made' },
                { metric: 'Connections', desc: 'Battle buddy matches' }
              ].map((item, i) => (
                <div key={i} className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow ${i === 4 ? 'col-span-2' : ''}`}>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">{item.metric}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Trust & Safety</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 px-4">
            Safety and privacy are <span className="text-cyan-400">non-negotiable</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left">
            {[
              { icon: Shield, text: 'Privacy-first by default' },
              { icon: Lock, text: 'Clear role boundaries and behavioral guardrails' },
              { icon: Heart, text: 'Guided escalation to Veterans Crisis Line / 988' },
              { icon: Users, text: 'Aggregate, privacy-safe admin insights only' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <span className="text-sm sm:text-lg text-slate-300 pt-2">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scale Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Future Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 sm:mb-12 px-4">
            Built to scale <span className="text-teal-600">beyond veterans</span>
          </h2>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4">
            {['Veterans', 'Police', 'Firefighters', 'Elderly Services'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 font-medium text-sm sm:text-base">
                  {item}
                </div>
                {i < 3 && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 hidden sm:block" />}
              </div>
            ))}
          </div>

          <p className="text-base sm:text-xl text-slate-600 mt-8 sm:mt-12 max-w-2xl mx-auto px-4">
            Same infrastructure, different data feeds. Civic infrastructure, not a one-off application.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Proof of Interaction Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              See a demo <span className="text-cyan-400">(different topic, same engine)</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              This demo is from a separate high-stakes pilot in a different domain. It's relevant because it shows the exact interaction model we're reusing here: structured guidance, clear guardrails, and safety-first behavior when questions cross the line.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              { text: 'Shows how the assistant handles sensitive questions with boundaries and responsible routing' },
              { text: 'Demonstrates step-by-step "next best action" guidance instead of vague responses' },
              { text: 'Represents the same UX pattern and feedback loop the veterans pilot will be built on' }
            ].map((item, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6 font-medium">
              Demo available at: <span className="text-cyan-400">strickland-ai-chat.netlify.app</span>
            </p>
            <a
              href="https://strickland-ai-chat.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-base sm:text-lg hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>View Demo</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </a>
            <p className="text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8 max-w-xl mx-auto">
              Demo content is not veteran-specific. The veterans pilot will use veteran-focused resources, language, and escalation pathways.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://i.imgur.com/E6quH0d.png"
            alt="ShooflyAI"
            className="h-8 sm:h-10 w-auto mx-auto mb-4 sm:mb-6"
          />
          <p className="text-slate-500 text-sm sm:text-base">
            Veterans AI Companion Pilot — A Community-Backed Initiative
          </p>
          <p className="text-slate-600 text-xs sm:text-sm mt-3 sm:mt-4">
            2025 ShooFly AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
