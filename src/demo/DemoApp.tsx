import { useState, useEffect, useRef } from 'react';
import { Home, MessageCircle, Users, FileText, MapPin, ArrowLeft, Mic, MessageSquare, X, ChevronDown, LogOut, Settings } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

// Types
interface Buddy {
  id: string;
  name: string;
  branch: string;
  era: string;
  location: string;
  interests: string[];
  avatar: string;
  status: 'online' | 'offline' | 'away';
  matchScore: number;
}

interface Benefit {
  id: string;
  name: string;
  category: string;
  eligibility: string;
  description: string;
  status: 'eligible' | 'pending' | 'applied' | 'receiving';
  estimatedValue?: string;
  deadline?: string;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: string;
  phone: string;
  rating: number;
  verified: boolean;
  services: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

// Dummy Data
const AFFIRMATIONS = [
  "Your service matters. Your story matters. You matter.",
  "Today is a new opportunity to take one small step forward.",
  "You've overcome challenges before—you have the strength to do it again.",
  "It's okay to ask for help. That's not weakness, it's wisdom.",
  "Every day you're building a new chapter of your story.",
  "You are more than your toughest days.",
  "Your experience gives you unique perspective and value.",
  "Progress, not perfection. One step at a time."
];

const BUDDIES: Buddy[] = [
  { id: '1', name: 'Marcus Johnson', branch: 'Army', era: '2010-2018', location: 'Roswell, GA', interests: ['Hiking', 'Career transition', 'Family life'], avatar: 'MJ', status: 'online', matchScore: 94 },
  { id: '2', name: 'Sarah Chen', branch: 'Navy', era: '2012-2020', location: 'Alpharetta, GA', interests: ['Running', 'Mental health', 'Entrepreneurship'], avatar: 'SC', status: 'online', matchScore: 87 },
  { id: '3', name: 'James Williams', branch: 'Marines', era: '2008-2016', location: 'Milton, GA', interests: ['Fitness', 'VA benefits', 'Motorcycles'], avatar: 'JW', status: 'away', matchScore: 82 },
  { id: '4', name: 'David Rodriguez', branch: 'Air Force', era: '2014-2022', location: 'Johns Creek, GA', interests: ['Tech careers', 'Gaming', 'Investing'], avatar: 'DR', status: 'offline', matchScore: 78 },
  { id: '5', name: 'Amanda Foster', branch: 'Army', era: '2009-2017', location: 'Roswell, GA', interests: ['Art therapy', 'Yoga', 'Community service'], avatar: 'AF', status: 'online', matchScore: 75 },
];

const BENEFITS: Benefit[] = [
  { id: '1', name: 'VA Healthcare', category: 'Healthcare', eligibility: 'Likely eligible', description: 'Comprehensive medical care at VA facilities nationwide', status: 'eligible', estimatedValue: '$5,000+/year' },
  { id: '2', name: 'Post-9/11 GI Bill', category: 'Education', eligibility: 'Eligible', description: 'Educational benefits for college, trade schools, and certifications', status: 'receiving', estimatedValue: '$26,000/year' },
  { id: '3', name: 'VA Home Loan', category: 'Housing', eligibility: 'Eligible', description: 'Zero down payment home loans with competitive rates', status: 'eligible', estimatedValue: '$15,000+ savings' },
  { id: '4', name: 'Disability Compensation', category: 'Compensation', eligibility: 'Review recommended', description: 'Monthly payments for service-connected conditions', status: 'pending', deadline: 'Dec 31, 2025' },
  { id: '5', name: 'Vocational Rehab (VR&E)', category: 'Career', eligibility: 'May be eligible', description: 'Career counseling, training, and job placement assistance', status: 'eligible' },
  { id: '6', name: 'Life Insurance (VGLI)', category: 'Insurance', eligibility: 'Eligible', description: 'Renewable term life insurance coverage', status: 'eligible', deadline: '240 days post-separation' },
];

const RESOURCES: Resource[] = [
  { id: '1', name: 'Roswell VA Clinic', type: 'Healthcare', address: '11285 Alpharetta Hwy', distance: '2.3 mi', phone: '(770) 555-0123', rating: 4.5, verified: true, services: ['Primary Care', 'Mental Health', 'Pharmacy'] },
  { id: '2', name: 'VFW Post 4346', type: 'Community', address: '1170 Warsaw Rd', distance: '3.1 mi', phone: '(770) 555-0456', rating: 4.8, verified: true, services: ['Veterans Events', 'Career Help', 'Social'] },
  { id: '3', name: 'GA Dept of Labor - Vet Services', type: 'Employment', address: '1234 Market St', distance: '4.2 mi', phone: '(770) 555-0789', rating: 4.2, verified: true, services: ['Job Placement', 'Resume Help', 'Training'] },
  { id: '4', name: 'Veteran Legal Aid Clinic', type: 'Legal', address: '567 Main St, Ste 200', distance: '5.0 mi', phone: '(770) 555-0111', rating: 4.7, verified: true, services: ['Benefits Claims', 'Discharge Review', 'Family Law'] },
  { id: '5', name: 'Mission BBQ Roswell', type: 'Veteran-Friendly', address: '800 Holcomb Bridge Rd', distance: '1.8 mi', phone: '(770) 555-0222', rating: 4.9, verified: true, services: ['Military Discounts', 'Community Events'] },
];

const EVENTS: Event[] = [
  { id: '1', title: 'Veterans Coffee Social', date: 'Tomorrow', time: '9:00 AM', location: 'VFW Post 4346', attendees: 12 },
  { id: '2', title: 'Resume Workshop', date: 'Dec 18', time: '2:00 PM', location: 'GA Dept of Labor', attendees: 8 },
  { id: '3', title: 'Peer Support Group', date: 'Dec 20', time: '6:30 PM', location: 'Roswell VA Clinic', attendees: 15 },
];

// Sub-components
function HomeView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [checkInMood, setCheckInMood] = useState<string | null>(null);
  const [streak] = useState(7);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Good morning,</p>
            <h1 className="text-white text-2xl font-bold">Michael</h1>
          </div>
          <div className="relative">
            <img 
              src="/vetty.png" 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {streak}
            </div>
          </div>
        </div>

        {/* Daily Affirmation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">Today's Affirmation</p>
          <p className="text-white text-lg font-medium leading-relaxed">"{affirmation}"</p>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-3">How are you feeling today?</h3>
          <div className="flex justify-between gap-2">
            {[
              { emoji: '😊', label: 'Great', value: 'great' },
              { emoji: '🙂', label: 'Good', value: 'good' },
              { emoji: '😐', label: 'Okay', value: 'okay' },
              { emoji: '😔', label: 'Low', value: 'low' },
              { emoji: '😢', label: 'Hard', value: 'hard' },
            ].map((mood) => (
              <button
                key={mood.value}
                onClick={() => setCheckInMood(mood.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  checkInMood === mood.value
                    ? 'bg-cyan-50 border-2 border-cyan-500 scale-105'
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-slate-600">{mood.label}</span>
              </button>
            ))}
          </div>
          {checkInMood && (
            <p className="text-center text-sm text-cyan-600 mt-3 animate-pulse">
              ✓ Thanks for checking in!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('companion')}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition-transform"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="font-semibold text-sm">Talk Now</span>
          </button>
          <button
            onClick={() => onNavigate('buddies')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl text-slate-700 border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <Users className="w-7 h-7" />
            <span className="font-semibold text-sm">Find Buddy</span>
          </button>
          <button
            onClick={() => onNavigate('benefits')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl text-slate-700 border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <FileText className="w-7 h-7" />
            <span className="font-semibold text-sm">My Benefits</span>
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl text-slate-700 border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <MapPin className="w-7 h-7" />
            <span className="font-semibold text-sm">Nearby</span>
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Upcoming Events</h3>
          <button className="text-cyan-600 text-sm font-medium">See All</button>
        </div>
        <div className="space-y-3">
          {EVENTS.slice(0, 2).map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{event.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-cyan-600">{event.date}</p>
                  <p className="text-xs text-slate-500">{event.time}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <span className="text-xs text-slate-500">+{event.attendees} attending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Buddy Matches */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Battle Buddies Online</h3>
          <button onClick={() => onNavigate('buddies')} className="text-cyan-600 text-sm font-medium">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5">
          {BUDDIES.filter(b => b.status === 'online').slice(0, 3).map((buddy) => (
            <div key={buddy.id} className="flex-shrink-0 bg-white rounded-xl p-4 border border-slate-100 shadow-sm w-36 text-center">
              <div className="relative inline-block">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  {buddy.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <p className="font-semibold text-slate-900 mt-2 text-sm truncate">{buddy.name.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">{buddy.branch}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Alert */}
      <div className="px-5 mt-6 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900">Benefit Action Needed</h4>
              <p className="text-sm text-amber-700 mt-1">Your disability claim deadline is Dec 31. Tap to review.</p>
              <button onClick={() => onNavigate('benefits')} className="mt-2 text-sm font-semibold text-amber-700 underline">
                View Benefits →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanionView() {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  // Inject engine styles once on mount
  useEffect(() => {
    const existingStyles = document.getElementById('companion-engine-styles');
    if (!existingStyles) {
      const styles = document.createElement('style');
      styles.id = 'companion-engine-styles';
      styles.textContent = `
        ${window.VeteransVoiceEngine?.getStyles?.() || ''}
        ${window.VeteransTextEngine?.getStyles?.() || ''}
      `;
      document.head.appendChild(styles);
    }
  }, []);

  // Initialize/switch engine when mode changes
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Clear container first
    container.innerHTML = '';

    const initEngine = () => {
      if (mode === 'voice' && window.VeteransVoiceEngine) {
        // Ensure text engine is cleaned up
        if (window.VeteransTextEngine?.destroy) {
          try { window.VeteransTextEngine.destroy(); } catch (e) {}
        }
        window.VeteransVoiceEngine.init(container, () => {});
        initRef.current = true;
      } else if (mode === 'text' && window.VeteransTextEngine) {
        // Ensure voice engine is cleaned up
        if (window.VeteransVoiceEngine?.destroy) {
          try { window.VeteransVoiceEngine.destroy(); } catch (e) {}
        }
        window.VeteransTextEngine.init(container, () => {});
        initRef.current = true;
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initEngine, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [mode]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (window.VeteransVoiceEngine?.destroy) {
        try { window.VeteransVoiceEngine.destroy(); } catch (e) {}
      }
      if (window.VeteransTextEngine?.destroy) {
        try { window.VeteransTextEngine.destroy(); } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="bg-slate-900 px-4 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white text-lg font-bold flex items-center gap-2">
            Vetted
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </h1>
        </div>

        {/* Mode Toggle - more compact */}
        <div className="flex bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/50">
          <button
            onClick={() => setMode('voice')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${
              mode === 'voice'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Hands-Free
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${
              mode === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Text Chat
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 flex flex-col overflow-hidden min-h-0"
      />
    </div>
  );
}

function BuddiesView({ onConnect }: { onConnect: (buddy: Buddy) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);

  const filteredBuddies = BUDDIES.filter(buddy => {
    if (filter === 'all') return true;
    if (filter === 'online') return buddy.status === 'online';
    return buddy.branch.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900 px-5 pt-4 pb-5">
        <h1 className="text-white text-xl font-bold">Battle Buddy Matching</h1>
        <p className="text-slate-400 text-sm mt-1">Connect with veterans who understand</p>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto -mx-5 px-5">
          {['All', 'Online', 'Army', 'Navy', 'Marines', 'Air Force'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.toLowerCase()
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Buddy List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-4">
          {filteredBuddies.map((buddy) => (
            <div
              key={buddy.id}
              onClick={() => setSelectedBuddy(buddy)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg">
                    {buddy.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    buddy.status === 'online' ? 'bg-emerald-500' :
                    buddy.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{buddy.name}</h3>
                    <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                      {buddy.matchScore}% match
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{buddy.branch} • {buddy.era}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{buddy.location}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {buddy.interests.slice(0, 3).map((interest) => (
                      <span key={interest} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buddy Detail Modal */}
      {selectedBuddy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10 animate-slideUp">
            <button
              onClick={() => setSelectedBuddy(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                {selectedBuddy.avatar}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-3">{selectedBuddy.name}</h2>
              <p className="text-slate-500">{selectedBuddy.branch} • {selectedBuddy.era}</p>
              <p className="text-sm text-slate-400">{selectedBuddy.location}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Shared Interests</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBuddy.interests.map((interest) => (
                  <span key={interest} className="text-sm bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onConnect(selectedBuddy);
                  setSelectedBuddy(null);
                }}
                className="py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
              >
                Connect
              </button>
              <button
                onClick={() => setSelectedBuddy(null)}
                className="py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BenefitsView() {
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const statusColors = {
    eligible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    applied: 'bg-blue-100 text-blue-700 border-blue-200',
    receiving: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  };

  const statusLabels = {
    eligible: 'Eligible',
    pending: 'Pending Review',
    applied: 'Applied',
    receiving: 'Receiving',
  };

  const eligibleCount = BENEFITS.filter(b => b.status === 'eligible').length;
  const totalValue = '$46,000+';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900 px-5 pt-4 pb-5">
        <h1 className="text-white text-xl font-bold">Benefits Navigator</h1>
        <p className="text-slate-400 text-sm mt-1">Your personalized benefits overview</p>
      </div>

      {/* Summary Cards */}
      <div className="px-5 -mt-2">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-cyan-500/25">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-cyan-100 text-sm">Estimated Annual Value</p>
              <p className="text-3xl font-bold mt-1">{totalValue}</p>
            </div>
            <div className="text-right">
              <p className="text-cyan-100 text-sm">Ready to Claim</p>
              <p className="text-3xl font-bold mt-1">{eligibleCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h3 className="font-semibold text-slate-900 mb-3">Your Benefits</h3>
        <div className="space-y-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div
                onClick={() => setExpandedBenefit(expandedBenefit === benefit.id ? null : benefit.id)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{benefit.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[benefit.status]}`}>
                        {statusLabels[benefit.status]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{benefit.category}</p>
                    {benefit.estimatedValue && (
                      <p className="text-sm font-semibold text-emerald-600 mt-1">{benefit.estimatedValue}</p>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedBenefit === benefit.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expandedBenefit === benefit.id && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 animate-fadeIn">
                  <p className="text-sm text-slate-600 mb-3">{benefit.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Eligibility: <span className="font-medium text-slate-700">{benefit.eligibility}</span></span>
                    {benefit.deadline && (
                      <span className="text-amber-600 font-medium">Due: {benefit.deadline}</span>
                    )}
                  </div>
                  <button className="w-full mt-4 py-2.5 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors">
                    {benefit.status === 'eligible' ? 'Start Application' : 'View Details'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesView() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['All', 'Healthcare', 'Community', 'Employment', 'Legal', 'Veteran-Friendly'];

  const filteredResources = RESOURCES.filter(r =>
    selectedType === 'all' || r.type.toLowerCase() === selectedType.toLowerCase()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900 px-5 pt-4 pb-5">
        <h1 className="text-white text-xl font-bold">Local Resources</h1>
        <p className="text-slate-400 text-sm mt-1">Veteran-friendly services near Roswell, GA</p>

        {/* Type Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto -mx-5 px-5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedType === type.toLowerCase()
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-5 py-4">
        <h3 className="font-semibold text-slate-900 mb-3">Upcoming Events</h3>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5">
          {EVENTS.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-64 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-4 text-white shadow-lg">
              <p className="text-cyan-100 text-xs uppercase tracking-wider">{event.date} • {event.time}</p>
              <h4 className="font-semibold mt-1">{event.title}</h4>
              <p className="text-sm text-cyan-100 mt-1">{event.location}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-cyan-100">{event.attendees} attending</span>
                <button className="text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <h3 className="font-semibold text-slate-900 mb-3">Nearby Resources</h3>
        <div className="space-y-3">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{resource.name}</h4>
                    {resource.verified && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{resource.type}</p>
                  <p className="text-sm text-slate-400 mt-1">{resource.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-cyan-600">{resource.distance}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm text-slate-600">{resource.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {resource.services.map((service) => (
                  <span key={service} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <a
                  href={`tel:${resource.phone}`}
                  className="flex-1 py-2 text-center text-sm font-semibold text-cyan-600 border border-cyan-200 rounded-xl hover:bg-cyan-50 transition-colors"
                >
                  Call
                </a>
                <button className="flex-1 py-2 text-center text-sm font-semibold text-white bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors">
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Demo App Component
interface DemoAppProps {
  onBack: () => void;
}

declare global {
  interface Window {
    VeteransVoiceEngine?: {
      init: (container: HTMLElement | null, onClose: () => void) => void;
      destroy: () => void;
      getStyles: () => string;
    };
    VeteransTextEngine?: {
      init: (container: HTMLElement | null, onClose: () => void) => void;
      destroy: () => void;
      sendMessage: (text: string) => void;
      getStyles: () => string;
    };
  }
}

export default function DemoApp({ onBack }: DemoAppProps) {
  const [currentView, setCurrentView] = useState<string>('home');
  const [showConnectionToast, setShowConnectionToast] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleConnect = (buddy: Buddy) => {
    setShowConnectionToast(buddy.name);
    setTimeout(() => setShowConnectionToast(null), 3000);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'companion', icon: MessageCircle, label: 'Companion' },
    { id: 'buddies', icon: Users, label: 'Buddies' },
    { id: 'benefits', icon: FileText, label: 'Benefits' },
    { id: 'resources', icon: MapPin, label: 'Resources' },
  ];

  // Show admin dashboard
  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col">
      {/* Status Bar Simulation */}
      <div className="bg-slate-900 h-11 flex items-center justify-between px-6 text-white text-xs font-medium flex-shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdmin(true)}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors mr-1"
            title="Admin Dashboard"
          >
            <Settings className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'home' && <HomeView onNavigate={setCurrentView} />}
        {currentView === 'companion' && <CompanionView />}
        {currentView === 'buddies' && <BuddiesView onConnect={handleConnect} />}
        {currentView === 'benefits' && <BenefitsView />}
        {currentView === 'resources' && <ResourcesView />}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 px-4 pb-6 pt-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                currentView === item.id
                  ? 'text-cyan-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] ${currentView === item.id ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
          <button
            onClick={onBack}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all text-slate-400 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px]">Exit</span>
          </button>
        </div>
      </div>

      {/* Connection Toast */}
      {showConnectionToast && (
        <div className="fixed top-20 left-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/25 animate-slideDown z-50">
          <p className="font-semibold">Connection request sent!</p>
          <p className="text-sm text-emerald-100">{showConnectionToast} will be notified</p>
        </div>
      )}
    </div>
  );
}
