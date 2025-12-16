import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Activity, Shield, Lightbulb, MessageSquareWarning,
  TrendingUp, TrendingDown, ArrowRight, ArrowLeft, Lock, LogOut, Phone, Clock,
  AlertTriangle, CheckCircle, Target, Zap, Building2, Heart,
  DollarSign, Briefcase, Home as HomeIcon, Brain, Moon, UserPlus,
  MapPin, Calendar, ChevronRight, X, Settings
} from 'lucide-react';

// Types
interface KPICard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
}

interface NeedCategory {
  name: string;
  volume: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  recommendation: string;
}

interface AIInsight {
  title: string;
  whyItMatters: string;
  recommendations: string[];
  confidence: 'low' | 'medium' | 'high';
  icon: React.ElementType;
}

interface FeedbackItem {
  topic: string;
  count: number;
  status: 'new' | 'roadmap' | 'needs-partner' | 'ux-improvement';
}

// Dummy Data
const OVERVIEW_KPIS: KPICard[] = [
  { label: 'Total Activated Users', value: 87, change: 12, changeLabel: 'this week', icon: Users },
  { label: 'Weekly Active Users', value: 64, change: 8, changeLabel: 'vs last week', icon: Activity },
  { label: 'Sessions per User (7d)', value: '4.2', change: 0.6, changeLabel: 'vs last week', icon: BarChart3 },
  { label: 'Retention (7d)', value: '73%', change: 5, changeLabel: 'vs last week', icon: Heart },
  { label: 'Actions Taken', value: 342, change: 28, changeLabel: 'this week', icon: Target },
];

const WEEKLY_TREND = [
  { week: 'Nov 18', users: 23 },
  { week: 'Nov 25', users: 31 },
  { week: 'Dec 2', users: 38 },
  { week: 'Dec 9', users: 45 },
  { week: 'Dec 16', users: 52 },
  { week: 'Dec 23', users: 64 },
];

const TOP_ACTIONS = [
  { name: 'Benefits Flow Started', count: 89 },
  { name: 'Resources Clicked', count: 76 },
  { name: 'Buddy Requests Sent', count: 54 },
  { name: 'Daily Check-in Completed', count: 187 },
  { name: 'Voice Sessions Started', count: 42 },
];

const NEED_CATEGORIES: NeedCategory[] = [
  { name: 'Benefits Navigation', volume: 156, trend: 'up', trendPercent: 23, recommendation: 'Add step-by-step VA claim wizard' },
  { name: 'Battle Buddy Matching', volume: 89, trend: 'up', trendPercent: 15, recommendation: 'Expand matching criteria, add shared interests' },
  { name: 'Local Resources & Events', volume: 67, trend: 'stable', trendPercent: 2, recommendation: 'Partner with more Roswell-area organizations' },
  { name: 'Financial Stress / Money Basics', volume: 54, trend: 'up', trendPercent: 31, recommendation: 'Add financial literacy module, partner with USAA/Navy Fed' },
  { name: 'Daily Affirmations', volume: 187, trend: 'up', trendPercent: 8, recommendation: 'Personalize based on check-in mood' },
  { name: 'Sleep & Anxiety Support', volume: 43, trend: 'up', trendPercent: 18, recommendation: 'Add evening wind-down routine, breathing exercises' },
];

const SAFETY_METRICS = {
  highRiskFlags: 12,
  highRiskTrend: -3,
  crisisClicks: 8,
  avgResponseTime: '< 2 min',
  peakRiskPeriods: [
    { time: '10PM - 2AM', percentage: 34 },
    { time: '6AM - 8AM', percentage: 22 },
    { time: '2PM - 4PM', percentage: 18 },
  ],
};

const AI_INSIGHTS: AIInsight[] = [
  {
    title: 'Benefits Confusion is Top Friction Point',
    whyItMatters: '67% of users who start benefits flows abandon before completion, primarily at eligibility questions.',
    recommendations: [
      'Add plain-language eligibility checker before full flow',
      'Create "Am I Eligible?" quick quiz (3 questions max)',
    ],
    confidence: 'high',
    icon: AlertTriangle,
  },
  {
    title: 'Loneliness Peaks on Weekends',
    whyItMatters: 'Voice session requests increase 45% on Saturdays, with longer average session times.',
    recommendations: [
      'Send proactive check-in push on Friday evenings',
      'Promote weekend buddy meetup events',
    ],
    confidence: 'high',
    icon: Heart,
  },
  {
    title: 'Financial Stress Emerging as Key Theme',
    whyItMatters: 'Unprompted mentions of money/finances up 31% this week, often co-occurring with anxiety indicators.',
    recommendations: [
      'Add "Financial Basics for Veterans" module',
      'Partner with veteran-friendly financial advisors',
    ],
    confidence: 'medium',
    icon: DollarSign,
  },
];

const MISSING_RESOURCES = [
  'Veteran-friendly employers in Roswell area',
  'Free legal aid for discharge upgrades',
  'Childcare assistance programs',
  'Veteran small business grants',
];

const PARTNER_OPPORTUNITIES = [
  { category: 'Financial Services', examples: 'USAA, Navy Federal, Vet-focused credit unions' },
  { category: 'Employment', examples: 'Hiring Our Heroes, local employers with vet programs' },
  { category: 'Healthcare', examples: 'Community clinics, mental health providers' },
  { category: 'Housing', examples: 'Habitat for Humanity, veteran housing orgs' },
];

const FEEDBACK_ITEMS: FeedbackItem[] = [
  { topic: 'Benefits application too confusing', count: 23, status: 'roadmap' },
  { topic: 'Need more local job listings', count: 18, status: 'needs-partner' },
  { topic: 'Want to connect with more veterans', count: 15, status: 'roadmap' },
  { topic: 'Housing assistance info outdated', count: 12, status: 'ux-improvement' },
  { topic: 'Need financial planning help', count: 11, status: 'needs-partner' },
  { topic: 'PTSD resources hard to find', count: 9, status: 'ux-improvement' },
  { topic: 'Addiction support needed', count: 7, status: 'needs-partner' },
  { topic: 'Family counseling options', count: 6, status: 'new' },
];

const FEEDBACK_TAGS = [
  { tag: 'Benefits', count: 45 },
  { tag: 'Jobs', count: 32 },
  { tag: 'Housing', count: 28 },
  { tag: 'Mental Health', count: 24 },
  { tag: 'Finances', count: 21 },
  { tag: 'Family', count: 18 },
  { tag: 'PTSD', count: 15 },
  { tag: 'Addiction', count: 12 },
];

// Components
function LoginScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1776' || pin === 'admin') {
      localStorage.setItem('admin_session', 'true');
      onLogin();
    } else {
      setError('Invalid access code');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Demo
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-2">Veterans Companion Pilot Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter access code"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-lg tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Access Dashboard
          </button>
        </form>

        <p className="text-slate-500 text-xs text-center mt-6">
          Demo access code: 1776
        </p>
      </div>
    </div>
  );
}

function KPICardComponent({ kpi }: { kpi: KPICard }) {
  const Icon = kpi.icon;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-600" />
        </div>
        {kpi.change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {kpi.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {kpi.change >= 0 ? '+' : ''}{kpi.change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
      <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
    </div>
  );
}

function TrendChart({ data }: { data: { week: string; users: number }[] }) {
  const max = Math.max(...data.map(d => d.users));
  const min = Math.min(...data.map(d => d.users));
  const range = max - min;
  const padding = 20;
  const chartHeight = 120;
  const chartWidth = 280;
  
  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((d.users - min) / range) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });
  
  // Create SVG path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  // Create area path (for gradient fill under line)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-900">Weekly Active Trend</h3>
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +178%
        </span>
      </div>
      
      <div className="relative">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-36">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i / 3) * (chartHeight - padding * 2)}
              x2={chartWidth - padding}
              y2={padding + (i / 3) * (chartHeight - padding * 2)}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}
          
          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />
          
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#06b6d4" strokeWidth="2" />
              <text
                x={p.x}
                y={chartHeight + 12}
                textAnchor="middle"
                className="text-[9px] fill-slate-500"
              >
                {p.week}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
        <span>Last 6 weeks</span>
        <span className="font-medium text-slate-700">Current: {data[data.length - 1].users} users</span>
      </div>
    </div>
  );
}

function TopActionsCard({ actions }: { actions: { name: string; count: number }[] }) {
  const max = Math.max(...actions.map(a => a.count));
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-900 mb-4">Top Actions by Volume</h3>
      <div className="space-y-3">
        {actions.map((action, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">{action.name}</span>
                <span className="font-medium text-slate-900">{action.count}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  style={{ width: `${(action.count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeedCard({ need }: { need: NeedCategory }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-900">{need.name}</h4>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          need.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
          need.trend === 'down' ? 'bg-red-50 text-red-500' : 
          'bg-slate-50 text-slate-500'
        }`}>
          {need.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
           need.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
          {need.trendPercent}%
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-2">{need.volume}</p>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs text-slate-500 mb-1">Recommendation:</p>
        <p className="text-sm text-slate-700">{need.recommendation}</p>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const Icon = insight.icon;
  const confidenceColors = {
    low: 'bg-amber-50 text-amber-600',
    medium: 'bg-blue-50 text-blue-600',
    high: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 text-sm">{insight.title}</h4>
          <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${confidenceColors[insight.confidence]}`}>
            {insight.confidence} confidence
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-3">{insight.whyItMatters}</p>
      <div className="space-y-2">
        {insight.recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackItemCard({ item, onStatusChange }: { item: FeedbackItem; onStatusChange: (status: FeedbackItem['status']) => void }) {
  const statusColors = {
    'new': 'bg-slate-100 text-slate-600',
    'roadmap': 'bg-cyan-50 text-cyan-600',
    'needs-partner': 'bg-purple-50 text-purple-600',
    'ux-improvement': 'bg-amber-50 text-amber-600',
  };
  const statusLabels = {
    'new': 'New',
    'roadmap': 'Roadmap',
    'needs-partner': 'Needs Partner',
    'ux-improvement': 'UX Fix',
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm text-slate-900">{item.topic}</p>
          <p className="text-xs text-slate-500 mt-1">{item.count} mentions</p>
        </div>
        <select
          value={item.status}
          onChange={(e) => onStatusChange(e.target.value as FeedbackItem['status'])}
          className={`text-xs font-medium px-2 py-1 rounded-lg border-0 ${statusColors[item.status]}`}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Main Dashboard
export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'needs' | 'safety' | 'insights' | 'feedback'>('overview');
  const [feedbackItems, setFeedbackItems] = useState(FEEDBACK_ITEMS);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
  };

  const handleFeedbackStatusChange = (index: number, status: FeedbackItem['status']) => {
    const updated = [...feedbackItems];
    updated[index] = { ...updated[index], status };
    setFeedbackItems(updated);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} onBack={onBack} />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'needs', label: 'Needs', icon: Target },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareWarning },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 px-4 pt-3 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white text-lg font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 text-xs">Veterans Companion Pilot</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-white text-xs px-2 py-1"
            >
              Demo
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-xs px-2 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto -mx-4 px-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {OVERVIEW_KPIS.map((kpi, i) => (
                <KPICardComponent key={i} kpi={kpi} />
              ))}
            </div>
            <TrendChart data={WEEKLY_TREND} />
            <TopActionsCard actions={TOP_ACTIONS} />
          </div>
        )}

        {/* Needs Tab */}
        {activeTab === 'needs' && (
          <div className="space-y-4">
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 mb-4">
              <p className="text-sm text-cyan-800 font-medium">What do veterans need most right now?</p>
              <p className="text-xs text-cyan-600 mt-1">Ranked by interaction volume and trend direction</p>
            </div>
            {NEED_CATEGORIES.map((need, i) => (
              <NeedCard key={i} need={need} />
            ))}
          </div>
        )}

        {/* Safety Tab */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-800 font-medium">Privacy Notice</p>
                  <p className="text-xs text-amber-700 mt-1">
                    This view shows aggregate data only. No personal messages or identifiable profiles. 
                    Not a therapist. Not emergency services.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500">High-Risk Flags (7d)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{SAFETY_METRICS.highRiskFlags}</span>
                  <span className={`text-xs font-medium ${SAFETY_METRICS.highRiskTrend < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {SAFETY_METRICS.highRiskTrend < 0 ? '↓' : '↑'} {Math.abs(SAFETY_METRICS.highRiskTrend)}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500">Crisis Line Clicks</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{SAFETY_METRICS.crisisClicks}</span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500">Avg Response Time to Resources</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{SAFETY_METRICS.avgResponseTime}</span>
              </div>
            </div>

            {/* Peak Risk Periods */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3">Peak Risk Periods</h3>
              <div className="space-y-3">
                {SAFETY_METRICS.peakRiskPeriods.map((period, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{period.time}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-red-400 rounded-full"
                          style={{ width: `${period.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 w-10 text-right">{period.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-4">
              <p className="text-sm text-purple-800 font-medium">🧠 AI Operations Brief</p>
              <p className="text-xs text-purple-600 mt-1">Actionable insights from this week's interactions</p>
            </div>

            <h3 className="font-semibold text-slate-900 text-sm">Top 3 Emerging Themes</h3>
            {AI_INSIGHTS.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}

            <h3 className="font-semibold text-slate-900 text-sm mt-6">Missing Resources</h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-3">What people ask for that isn't in our database:</p>
              <div className="space-y-2">
                {MISSING_RESOURCES.map((resource, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    {resource}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 text-sm mt-6">Partner Opportunities</h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="space-y-3">
                {PARTNER_OPPORTUNITIES.map((partner, i) => (
                  <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm font-medium text-slate-900">{partner.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">{partner.examples}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-4">
              <p className="text-sm text-teal-800 font-medium">"What are you having trouble with?"</p>
              <p className="text-xs text-teal-600 mt-1">Aggregate user feedback submissions</p>
            </div>

            {/* Tag Cloud */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Top Topics</h3>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_TAGS.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700"
                    style={{ fontSize: `${Math.max(11, Math.min(16, 10 + tag.count / 5))}px` }}
                  >
                    {tag.tag} <span className="text-slate-400">({tag.count})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Feedback Items */}
            <h3 className="font-semibold text-slate-900 text-sm">All Feedback</h3>
            <div className="space-y-2">
              {feedbackItems.map((item, i) => (
                <FeedbackItemCard 
                  key={i} 
                  item={item} 
                  onStatusChange={(status) => handleFeedbackStatusChange(i, status)}
                />
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mt-6">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Weekly Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">Added step-by-step benefits wizard</p>
                    <p className="text-xs text-slate-500">In response to 23 feedback mentions</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">Improved buddy matching filters</p>
                    <p className="text-xs text-slate-500">In response to connection requests</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">Financial literacy module in progress</p>
                    <p className="text-xs text-slate-500">Targeting launch next week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

