import React from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  User, 
  Clock, 
  ChevronRight, 
  Play, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowLeft,
  Menu,
  Timer,
  ChevronLeft,
  Search,
  Filter,
  LogOut,
  Settings,
  HelpCircle,
  MessageCircle,
  CreditCard,
  X,
  Moon,
  Sun,
  History,
  Award,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { startGoogleLogin, performLogout as bridgeLogout } from './lib/authBridge';
import { cn, predictNeetRank, getDaysLeft } from './lib/utils';

// --- Types ---

type Screen = 'onboarding' | 'dashboard' | 'test-list' | 'test-instructions' | 'test-interface' | 'analytics' | 'focus-area' | 'pricing' | 'history' | 'settings' | 'faqs' | 'help' | 'privacy-policy' | 'terms-of-service' | 'test-analysis' | 'post-login';

interface Question {
  id: number;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface Test {
  id: number;
  title: string;
  questionsCount: number;
  durationMinutes: number;
  status: 'locked' | 'available' | 'completed';
  score?: number;
  rank?: number | string;
  date?: string;
}

// --- Mock Data ---

const MOCK_TESTS: Test[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `NEET Full Mock Test ${i + 1}`,
  questionsCount: 200,
  durationMinutes: 200,
  status: i === 0 ? 'completed' : i < 5 ? 'available' : 'locked',
  score: i === 0 ? 645 : undefined,
  rank: i === 0 ? predictNeetRank(645) : undefined,
  date: i === 0 ? '2026-03-10' : undefined,
}));

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: 'Biology',
    text: 'Which of the following is not a characteristic of living organisms?',
    options: ['Growth', 'Reproduction', 'Metabolism', 'Crystallization'],
    correctOption: 3,
    explanation: 'Living organisms exhibit growth, reproduction, and metabolism. Crystallization is a physical process observed in non-living substances like minerals.',
  },
  {
    id: 2,
    subject: 'Physics',
    text: 'The dimensional formula for gravitational constant (G) is:',
    options: ['[M⁻¹L³T⁻²]', '[ML³T⁻²]', '[M⁻¹L²T⁻²]', '[ML²T⁻²]'],
    correctOption: 0,
    explanation: 'From F = G m₁m₂ / r², we get G = Fr² / m₁m₂. Dimensional formula: [MLT⁻²][L²] / [M²] = [M⁻¹L³T⁻²].',
  },
  {
    id: 3,
    subject: 'Chemistry',
    text: 'Which of the following has the highest electronegativity?',
    options: ['Oxygen', 'Fluorine', 'Nitrogen', 'Chlorine'],
    correctOption: 1,
    explanation: 'Fluorine is the most electronegative element in the periodic table with a value of 4.0 on the Pauling scale.',
  }
];

// --- Components ---

const Header = ({ onMenuClick, onNavigate, user, title = "NEET Rank Booster" }: { onMenuClick: () => void, onNavigate?: (s: Screen) => void, user?: any, title?: string }) => (
  <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-40 border-b border-gray-50 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <button onClick={onMenuClick} className="p-1 -ml-1 text-gray-600 active:scale-95 transition-transform">
        <Menu size={24} />
      </button>
      <button 
        onClick={() => onNavigate?.('dashboard')}
        className="text-lg font-bold text-gray-900 active:opacity-70 transition-opacity"
      >
        {title}
      </button>
    </div>
    <button 
      onClick={() => onNavigate?.('settings')}
      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden active:scale-95 transition-transform"
    >
      <img src={user?.photo ? `https://api-neetrankbooster.interviewmania.com${user.photo}` : "https://picsum.photos/seed/user/100/100"} alt="Profile" referrerPolicy="no-referrer" />
    </button>
  </div>
);

const SideMenu = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onLogout,
  isDarkMode,
  toggleDarkMode,
  user
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onNavigate: (s: Screen) => void,
  onLogout: () => void,
  isDarkMode: boolean,
  toggleDarkMode: () => void,
  user?: any
}) => {
  const [isPro, setIsPro] = React.useState(false); // Toggle for demo purposes

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'test-list', label: 'Test Series', icon: BookOpen },
    { id: 'history', label: 'Test History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'pricing', label: 'Subscription Plan', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 left-0 w-4/5 max-w-xs z-[70] shadow-2xl flex flex-col transition-colors duration-300",
              isDarkMode ? "bg-gray-900" : "bg-white"
            )}
          >
            <div className={cn(
              "p-5 border-b relative overflow-hidden",
              isDarkMode ? "border-gray-800" : "border-gray-100"
            )}>
              <div className="flex items-center gap-3 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-xl overflow-hidden shadow-sm border shrink-0",
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-100"
                )}>
                  <img src={user?.photo ? `https://api-neetrankbooster.interviewmania.com${user.photo}` : "https://picsum.photos/seed/user/100/100"} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={cn(
                    "text-base font-bold truncate",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{user?.name || "Aman Sharma"}</h2>
                  <p className={cn(
                    "text-[10px] font-medium leading-tight",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>{user?.email || "aman.sharma@example.com"}</p>
                  
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border w-fit mt-1",
                    isPro 
                      ? (isDarkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-100")
                      : (isDarkMode ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-600 border-gray-200")
                  )}>
                    {isPro ? <Zap size={10} fill="currentColor" /> : <Activity size={10} />}
                    {isPro ? "Pro Plan" : "Free Plan"}
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className={cn(
                    "p-1.5 rounded-lg active:scale-95 transition-all self-start",
                    isDarkMode ? "text-gray-500 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as Screen);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-2.5 transition-colors",
                    isDarkMode 
                      ? "text-gray-300 active:bg-gray-800" 
                      : "text-gray-700 active:bg-gray-50"
                  )}
                >
                  <item.icon size={18} className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}

              {!isPro && (
                <div className="px-4 mt-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="font-bold text-sm mb-1">Unlock All Tests</h4>
                      <p className="text-[10px] text-emerald-50 leading-tight mb-3">
                        Get Pro Plan for just <span className="font-bold">₹299</span> <span className="line-through opacity-60">₹999</span>. 
                        That's less than ₹10 per test!
                      </p>
                      <button 
                        onClick={() => {
                          onNavigate('pricing');
                          onClose();
                        }}
                        className="w-full bg-white text-emerald-700 py-2 rounded-xl text-[10px] font-bold active:scale-95 transition-transform shadow-sm"
                      >
                        Upgrade Now
                      </button>
                    </div>
                    <Zap size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
                  </div>
                </div>
              )}
            </div>

            <div className={cn(
              "p-6 border-t space-y-4",
              isDarkMode ? "border-gray-800" : "border-gray-100"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-700">
                  {isDarkMode ? <Moon size={20} className="text-gray-400" /> : <Sun size={20} className="text-gray-400" />}
                  <span className="text-sm font-semibold">Dark Mode</span>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    isDarkMode ? "bg-emerald-600" : "bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                    isDarkMode ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 text-red-600 active:scale-95 transition-transform"
              >
                <LogOut size={20} />
                <span className="text-sm font-bold">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BottomNav = ({ activeTab, onTabChange }: { activeTab: Screen, onTabChange: (s: Screen) => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'test-list', label: 'Tests', icon: BookOpen },
    { id: 'analytics', label: 'Stats', icon: BarChart2 },
    { id: 'focus-area', label: 'Focus', icon: Zap },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 pb-safe">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as Screen)}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            activeTab === tab.id ? "text-emerald-600" : "text-gray-400"
          )}
        >
          <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const Card = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div 
    {...props}
    className={cn("bg-white rounded-2xl p-4 shadow-sm border border-gray-50 active:scale-[0.98] transition-transform", className)}
  >
    {children}
  </div>
);

// --- Screens ---

const TestInstructionsScreen = ({ onStart, onBack, onNavigate, onMenuClick, user }: { onStart: () => void, onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="flex flex-col bg-gray-50 min-h-screen">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Test Instruction" />

    <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
        <h3 className="font-bold text-emerald-900 mb-4">Exam Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Duration</p>
            <p className="text-sm font-bold text-emerald-900">3h 20m</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Questions</p>
            <p className="text-sm font-bold text-emerald-900">200 Qs</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Max Marks</p>
            <p className="text-sm font-bold text-emerald-900">720 Marks</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Pattern</p>
            <p className="text-sm font-bold text-emerald-900">NEET 2026</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Marking Scheme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">+4</div>
            <p className="text-sm text-gray-600">For each correct answer</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">-1</div>
            <p className="text-sm text-gray-600">For each incorrect answer</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Section Details</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Each subject has two sections:
          <br /><br />
          <span className="font-bold text-gray-900">Section A:</span> 35 compulsory questions.
          <br /><br />
          <span className="font-bold text-gray-900">Section B:</span> 15 questions, attempt any 10. If more than 10 are attempted, only the first 10 will be evaluated.
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          Answer Carefully: Choose the best correct option for each question. Once submitted, you cannot change your answers.
        </p>
      </div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
      <button 
        onClick={onStart}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
      >
        Start Test
      </button>
    </div>
  </div>
);

const OnboardingScreen = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (s: Screen) => void }) => (
  <div className="h-screen bg-white flex flex-col p-6 justify-between overflow-hidden">
    <div className="mt-4 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <Target className="text-emerald-600" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">NEET Rank Booster</h1>
      <p className="text-sm text-gray-500 font-medium">Practice. Improve. Rank Higher.</p>
    </div>

    <div className="flex-1 flex flex-col justify-center space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <User size={16} />
          </div>
          <p className="text-xs text-gray-600 font-medium">Created by previous NEET Rankers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Zap size={16} />
          </div>
          <p className="text-xs text-gray-600 font-medium">Every Test Brings You Closer to Your Rank</p>
        </div>
      </div>

      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-2 mb-0.5">
          <Clock size={16} className="text-emerald-600" />
          <span className="font-bold text-emerald-900 text-sm">{getDaysLeft()} Days Left</span>
        </div>
        <p className="text-[10px] text-emerald-700">Target: May 3, 2026. Time to accelerate.</p>
      </div>
    </div>

    <div className="space-y-3 pb-2">
      <button 
        onClick={onLogin}
        className="w-full bg-white border border-gray-200 py-3 rounded-2xl flex items-center justify-center gap-3 active:bg-gray-50 transition-colors shadow-sm"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
        <span className="font-semibold text-sm text-gray-700">Continue with Google</span>
      </button>
      
      <p className="text-[9px] text-center text-gray-400 px-4 leading-relaxed">
        By continuing, you agree to our <button onClick={() => onNavigate('terms-of-service')} className="text-emerald-600 font-bold underline decoration-emerald-600/30 underline-offset-1">Terms</button> and <button onClick={() => onNavigate('privacy-policy')} className="text-emerald-600 font-bold underline decoration-emerald-600/30 underline-offset-1">Privacy</button>.
      </p>
    </div>
  </div>
);

const DashboardScreen = ({ onNavigate, onMenuClick, user }: { onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="pb-24 bg-gray-50/50 min-h-screen">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Dashboard" />
    
    <div className="px-6 pt-4">
      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white flex items-center justify-between overflow-hidden relative shadow-xl shadow-gray-900/20">
        <div className="relative z-10">
          <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-2">Countdown to NEET</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black">{getDaysLeft()}</span>
            <span className="text-sm text-gray-400 font-bold">Days</span>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-2">Tests Done</p>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-4xl font-black">01</span>
            <span className="text-sm text-gray-400 font-bold">/30</span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -left-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>

    {/* Quick Stats */}
    <div className="px-6 grid grid-cols-2 gap-4 mt-6">
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white shadow-lg shadow-emerald-500/20 p-5">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
          <TrendingUp size={22} className="text-white" />
        </div>
        <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Predicted Rank</p>
        <p className="text-xl font-black text-white">#{predictNeetRank(645)}</p>
      </Card>
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg shadow-blue-500/20 p-5">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
          <Target size={22} className="text-white" />
        </div>
        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Avg. Score</p>
        <p className="text-xl font-black text-white">645/720</p>
      </Card>
    </div>

    {/* Featured Test */}
    <div className="px-6 mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">Next Recommended Test</h3>
        <button onClick={() => onNavigate('test-list')} className="text-xs font-bold text-emerald-600">View All</button>
      </div>
      <Card className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <BookOpen size={24} className="text-gray-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Full Mock Test 02</h4>
            <p className="text-[10px] text-gray-500">200 Qs • 200 Mins • NEET Pattern</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('test-interface')}
          className="bg-emerald-600 text-white p-2 rounded-lg active:scale-95 transition-transform"
        >
          <Play size={16} fill="white" />
        </button>
      </Card>
    </div>

    {/* Weak Topics */}
    <div className="px-6 mt-6">
      <h3 className="font-bold text-gray-900 mb-3">Focus Areas</h3>
      <div className="space-y-2">
        {[
          { subject: 'Physics', topic: 'Rotational Motion', color: 'bg-red-50 text-red-700 border-red-100' },
          { subject: 'Chemistry', topic: 'Organic Mechanisms', color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { subject: 'Biology', topic: 'Genetics & Evolution', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        ].map((item, i) => (
          <div key={i} className={cn("p-3 rounded-xl border flex items-center justify-between", item.color)}>
            <div className="flex items-center gap-3">
              <AlertCircle size={16} />
              <div>
                <p className="text-[10px] font-bold uppercase opacity-70">{item.subject}</p>
                <p className="text-sm font-bold">{item.topic}</p>
              </div>
            </div>
            <ChevronRight size={16} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestListScreen = ({ onNavigate, onMenuClick, user }: { onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filteredTests = MOCK_TESTS.filter(test => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Attempted') return test.status === 'completed';
    if (activeFilter === 'Unattempted') return test.status === 'available';
    if (activeFilter === 'Locked') return test.status === 'locked';
    return true;
  });

  return (
    <div className="pb-24">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Mock Tests" />
      
      {/* Promo Banner */}
      <div className="px-6 pt-4">
        <button 
          onClick={() => onNavigate('pricing')}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform overflow-hidden relative"
        >
          <div className="relative z-10 text-left">
            <h4 className="font-black text-sm uppercase tracking-wider">Unlock All 30 Tests</h4>
            <p className="text-[10px] font-bold text-emerald-100">Master NEET with full mock series for just ₹299</p>
          </div>
          <div className="relative z-10 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-sm border border-white/20">
            BUY NOW
          </div>
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
        </button>
      </div>

      <div className="bg-white px-6 pt-4 pb-4 sticky top-[73px] z-30 border-b border-gray-50">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Attempted', 'Unattempted', 'Locked'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                activeFilter === filter ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-4 space-y-3">
        {filteredTests.map((test) => (
          <Card 
            key={test.id} 
            className={cn("flex items-center justify-between", test.status === 'locked' && "opacity-60")}
            onClick={() => {
              if (test.status === 'available' || test.status === 'completed') onNavigate('test-instructions');
              if (test.status === 'locked') onNavigate('pricing');
            }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                test.status === 'completed' ? "bg-emerald-50 text-emerald-600" : 
                test.status === 'available' ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
              )}>
                {test.status === 'completed' ? <CheckCircle2 size={24} /> : 
                 test.status === 'available' ? <Play size={24} fill="currentColor" /> : <Lock size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{test.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 font-medium">{test.questionsCount} Qs • {test.durationMinutes} Mins</span>
                  {test.score && <span className="text-[10px] font-bold text-emerald-600">Score: {test.score}</span>}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Card>
        ))}
        {filteredTests.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold text-sm">No tests found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TestInterfaceScreen = ({ onExit }: { onExit: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(200 * 60); // 200 mins
  const [showQuestionMap, setShowQuestionMap] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  };

  const handleNext = () => {
    if (currentQuestion < 199) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(userAnswers[currentQuestion + 1] ?? null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(userAnswers[currentQuestion - 1] ?? null);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the test?')) {
      setIsSubmitted(true);
      setCurrentQuestion(0);
    }
  };

  const question = MOCK_QUESTIONS[currentQuestion % MOCK_QUESTIONS.length];

  if (isSubmitted) {
    const score = Object.keys(userAnswers).length * 4; // Simplified score calculation for demo
    const rank = predictNeetRank(score);
    
    return (
      <div className="fixed inset-0 bg-gray-50 z-[100] overflow-y-auto pb-24">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <h3 className="text-sm font-bold text-gray-900">Detailed Analysis</h3>
          <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
          {/* Summary Card */}
          <Card className="bg-emerald-600 text-white p-8 border-none shadow-xl shadow-emerald-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Final Score</p>
                  <h2 className="text-5xl font-black italic">{score}<span className="text-xl opacity-50 font-bold"> / 720</span></h2>
                </div>
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                  <Award size={32} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">Predicted Rank</p>
                  <p className="text-xl font-black">#{rank}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">Improvement</p>
                  <p className="text-xl font-black">+14% <TrendingUp size={18} className="inline ml-1" /></p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Accuracy</p>
              <p className="text-2xl font-black text-emerald-600">85%</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Speed</p>
              <p className="text-2xl font-black text-blue-600">48s/q</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Time Taken</p>
              <p className="text-2xl font-black text-gray-900">2:45:12</p>
            </Card>
          </div>

          {/* Performance Analysis */}
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              Performance Improvement
            </h4>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                You've shown significant improvement in <span className="font-bold text-emerald-600">Organic Chemistry</span> and <span className="font-bold text-emerald-600">Genetics</span> compared to your last test. However, your speed in <span className="font-bold text-red-600">Physics Mechanics</span> has decreased slightly.
              </p>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">AI Recommendation</p>
                <p className="text-xs text-gray-700 font-medium">Focus on solving 50+ questions from Rotational Motion to boost your Physics score by an estimated 20-30 marks.</p>
              </div>
            </div>
          </Card>

          {/* Solutions List */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Question-wise Solutions</h4>
            {MOCK_QUESTIONS.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctOption;
              const isUnanswered = userAnswer === undefined;

              return (
                <Card key={q.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">Question {idx + 1}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded uppercase",
                      isCorrect ? "bg-emerald-50 text-emerald-600" : 
                      isUnanswered ? "bg-gray-50 text-gray-400" : "bg-red-50 text-red-600"
                    )}>
                      {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-4">{q.text}</p>
                  <div className="grid gap-2 mb-4">
                    {q.options.map((opt, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "p-3 rounded-xl border text-sm flex items-center gap-3",
                          i === q.correctOption ? "border-emerald-200 bg-emerald-50 text-emerald-900" :
                          i === userAnswer ? "border-red-200 bg-red-50 text-red-900" : "border-gray-100 bg-white text-gray-600"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                          i === q.correctOption ? "bg-emerald-600 text-white" :
                          i === userAnswer ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-medium">{opt}</span>
                        {i === q.correctOption && <CheckCircle2 size={14} className="ml-auto text-emerald-600" />}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Explanation</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col">
      {/* Header - Clean & Focused */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Full Mock Test 02</h3>
            <div className="flex items-center gap-2 text-emerald-600">
              <Timer size={14} />
              <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowQuestionMap(!showQuestionMap)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
          >
            <Layers size={20} />
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / 200) * 100}%` }}
          className="h-full bg-emerald-500"
        />
      </div>

      {/* Section Jump Navigation */}
      <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scrollbar px-4 py-2 gap-2">
        {[
          { name: 'Physics', start: 0 },
          { name: 'Chemistry', start: 50 },
          { name: 'Botany', start: 100 },
          { name: 'Zoology', start: 150 },
        ].map((section) => {
          const isActive = currentQuestion >= section.start && currentQuestion < (section.start + 50);
          return (
            <button
              key={section.name}
              onClick={() => {
                setCurrentQuestion(section.start);
                setSelectedOption(userAnswers[section.start] ?? null);
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                isActive 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              {section.name}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Question Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
                  Question {currentQuestion + 1}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">
                  <Award size={12} /> +4
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">
                  <AlertCircle size={12} /> -1
                </div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl font-medium text-gray-900 mb-12 leading-relaxed">
              {question.text}
            </p>

            <div className="grid gap-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(i)}
                  className={cn(
                    "group w-full p-5 rounded-2xl border-2 text-left flex items-center gap-5 transition-all duration-200",
                    selectedOption === i 
                      ? "border-emerald-600 bg-emerald-50 shadow-md" 
                      : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors",
                    selectedOption === i 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={cn(
                    "font-semibold text-lg",
                    selectedOption === i ? "text-emerald-900" : "text-gray-700"
                  )}>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Map Sidebar (Desktop) or Overlay (Mobile) */}
        <AnimatePresence>
          {showQuestionMap && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed md:relative inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-50 p-6 flex flex-col shadow-2xl md:shadow-none"
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-900">Question Palette</h4>
                <button onClick={() => setShowQuestionMap(false)} className="md:hidden"><X size={20} /></button>
              </div>
              
              <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 content-start">
                {Array.from({ length: 200 }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setCurrentQuestion(i);
                      setSelectedOption(userAnswers[i] ?? null);
                      setShowQuestionMap(false);
                    }}
                    className={cn(
                      "aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all",
                      currentQuestion === i ? "bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-500/20" : 
                      userAnswers[i] !== undefined ? "bg-emerald-100 text-emerald-700" :
                      "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls - Floating Style */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <button className="hidden md:flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            <Activity size={18} />
            Mark for Review
          </button>
          
          <div className="flex-1 flex gap-3">
            <button 
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="flex-1 md:flex-none p-4 border border-gray-200 rounded-2xl text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="flex-[3] md:flex-1 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2"
            >
              {currentQuestion === 199 ? 'Finish' : 'Save & Next'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestHistoryScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="pb-24 bg-gray-50 min-h-screen">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Test History" />
    
    <div className="px-6 mt-6 space-y-4">
      {MOCK_TESTS.filter(t => t.status === 'completed').map((test) => (
        <Card key={test.id} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{test.title}</h4>
                <p className="text-[10px] text-gray-500 font-medium">{test.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-600">{test.score}/720</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">#{test.rank}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Rank</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">89%</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">2h 45m</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Time</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('test-analysis')}
            className="w-full mt-4 py-2 bg-gray-50 text-emerald-600 rounded-xl text-xs font-bold active:bg-emerald-50 transition-colors"
          >
            View Analytics & Solutions
          </button>
        </Card>
      ))}
    </div>
  </div>
);

const SettingsScreen = ({ onBack, onNavigate, isDarkMode, toggleDarkMode, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, isDarkMode: boolean, toggleDarkMode: () => void, onMenuClick: () => void, user?: any }) => {
  const [pushNotifications, setPushNotifications] = React.useState(true);

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Settings" />

      <div className="px-6 mt-6 space-y-6">
        <section>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Preference</h3>
          <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <span className="text-sm font-semibold text-gray-700">Dark Mode</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  isDarkMode ? "bg-emerald-600" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                  isDarkMode ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  <MessageCircle size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Push Notifications</span>
              </div>
              <button 
                onClick={() => setPushNotifications(!pushNotifications)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  pushNotifications ? "bg-emerald-600" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                  pushNotifications ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </Card>
        </section>

      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Account</h3>
        <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <User size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </Card>
      </section>

      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Support</h3>
        <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
          <button 
            onClick={() => onNavigate('faqs')}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-700">FAQs</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <button 
            onClick={() => onNavigate('help')}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <HelpCircle size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </Card>
      </section>

      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">More</h3>
        <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
          <button 
            onClick={() => onNavigate('privacy-policy')}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Privacy Policy</span>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <button 
            onClick={() => onNavigate('terms-of-service')}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Terms of Service</span>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </Card>
      </section>

      <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold active:bg-red-100 transition-colors">
        Delete Account
      </button>
    </div>
  </div>
  );
};

const TestAnalysisScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const score = 645;
  const rank = predictNeetRank(score);
  const userAnswers: Record<number, number> = { 0: 3, 1: 1 }; // Mock answers for demo

  return (
    <div className="pb-24 bg-gray-50 min-h-screen overflow-y-auto">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Detailed Analysis" />
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-[73px] z-50">
        <div className="w-1" />
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Summary Card */}
        <Card className="bg-emerald-600 text-white p-8 border-none shadow-xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Final Score</p>
                <h2 className="text-5xl font-black italic">{score}<span className="text-xl opacity-50 font-bold"> / 720</span></h2>
              </div>
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                <Award size={32} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">Predicted Rank</p>
                <p className="text-xl font-black">#{rank}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">Improvement</p>
                <p className="text-xl font-black">+14% <TrendingUp size={18} className="inline ml-1" /></p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Accuracy</p>
            <p className="text-2xl font-black text-emerald-600">85%</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Speed</p>
            <p className="text-2xl font-black text-blue-600">48s/q</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Time Taken</p>
            <p className="text-2xl font-black text-gray-900">2:45:12</p>
          </Card>
        </div>

        {/* Performance Analysis */}
        <Card className="p-6">
          <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-emerald-600" />
            Performance Improvement
          </h4>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              You've shown significant improvement in <span className="font-bold text-emerald-600">Organic Chemistry</span> and <span className="font-bold text-emerald-600">Genetics</span> compared to your last test. However, your speed in <span className="font-bold text-red-600">Physics Mechanics</span> has decreased slightly.
            </p>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">AI Recommendation</p>
              <p className="text-xs text-gray-700 font-medium">Focus on solving 50+ questions from Rotational Motion to boost your Physics score by an estimated 20-30 marks.</p>
            </div>
          </div>
        </Card>

        {/* Solutions List */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Question-wise Solutions</h4>
          {MOCK_QUESTIONS.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctOption;
            const isUnanswered = userAnswer === undefined;

            return (
              <Card key={q.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">Question {idx + 1}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded uppercase",
                    isCorrect ? "bg-emerald-50 text-emerald-600" : 
                    isUnanswered ? "bg-gray-50 text-gray-400" : "bg-red-50 text-red-600"
                  )}>
                    {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-900 mb-4">{q.text}</p>
                <div className="grid gap-2 mb-4">
                  {q.options.map((opt, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "p-3 rounded-xl border text-sm flex items-center gap-3",
                        i === q.correctOption ? "border-emerald-200 bg-emerald-50 text-emerald-900" :
                        i === userAnswer ? "border-red-200 bg-red-50 text-red-900" : "border-gray-100 bg-white text-gray-600"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        i === q.correctOption ? "bg-emerald-600 text-white" :
                        i === userAnswer ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-medium">{opt}</span>
                      {i === q.correctOption && <CheckCircle2 size={14} className="ml-auto text-emerald-600" />}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Explanation</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FaqsScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const [search, setSearch] = React.useState('');
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    { q: "What is NEET Rank Booster?", a: "NEET Rank Booster is an AI-powered platform designed to help medical aspirants master mock tests and predict their ranks with high accuracy." },
    { q: "How is the rank predicted?", a: "Our AI model analyzes your scores, accuracy, speed, and difficulty level of tests compared to previous years' NEET data to provide a realistic rank range. Note: Your rank solely depends on your understanding of the subject and your performance in the actual exam." },
    { q: "Can I get a refund?", a: "No, all purchases are non-refundable and subscriptions cannot be cancelled once activated." },
    { q: "How many mock tests are available in the Pro plan?", a: "The Pro plan gives you unlimited access to 30+ full-length mock tests and 100+ topic-wise practice tests." },
    { q: "What is the validity of the Pro plan?", a: "The Pro plan is valid until the date of the NEET 2026 entrance examination." },
    { q: "Does the app provide solutions and explanations?", a: "Absolutely! After every test, you get detailed step-by-step solutions and conceptual explanations for every question." },
    { q: "How do I upgrade to the Pro plan?", a: "You can upgrade by clicking the 'Upgrade to Pro' button in the side menu or by visiting the Subscription Plan page." },
    { q: "What if I face a technical issue during a test?", a: "Our app automatically saves your progress. You can resume the test from where you left off if the app closes unexpectedly." },
    { q: "Is there any negative marking in the tests?", a: "Yes, we follow the standard NEET marking scheme: +4 for correct and -1 for incorrect answers." },
    { q: "How can I contact support?", a: "You can reach out to us via the 'Help & Support' page in the app or email us at support@neetrankbooster.com." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="FAQs" />
      <div className="bg-white px-6 pt-4 pb-4 sticky top-[73px] z-40 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="px-6 mt-6 space-y-3">
        {filteredFaqs.map((faq, i) => (
          <Card key={i} className="p-0 overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-900 pr-4">{faq.q}</span>
              <ChevronRight size={18} className={cn("text-gray-300 transition-transform", openIndex === i && "rotate-90")} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
};

const HelpScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Help & Support" />

      <div className="px-6 mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-3">
          <Card className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Email Support</h4>
              <p className="text-[10px] text-gray-500 font-medium">Response in 24 hours</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-gray-300" />
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Send us a message</h3>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Message Sent!</h4>
              <p className="text-xs text-gray-500">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-emerald-600 font-bold text-sm">Send another message</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>Technical Issue</option>
                  <option>Payment/Subscription</option>
                  <option>Content/Questions</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-gray-900/20 active:scale-95 transition-transform">
                Submit Message
              </button>
            </form>
          )}
        </Card>

        <div className="text-center pb-6">
          <p className="text-[10px] text-gray-400 font-medium">App Version 1.2.4 (Build 20260311)</p>
          <p className="text-[10px] text-gray-400 font-medium mt-1">© 2026 NEET Rank Booster. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicyScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="pb-24 bg-gray-50 min-h-screen">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Privacy Policy" />
    <div className="px-6 mt-6 space-y-8 pb-12">
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Your Privacy Matters</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">We are committed to protecting your personal data and your right to privacy.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="font-bold text-gray-900">1. Information We Collect</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Personal Data: Name, email address, and profile picture.</li>
              <li>Performance Data: Test scores, accuracy, speed, and rank predictions.</li>
              <li>Device Data: IP address, browser type, and operating system.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Activity size={18} />
            </div>
            <h3 className="font-bold text-gray-900">2. How We Use Your Data</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>We use personal information collected via our App for a variety of business purposes described below:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To provide you with personalized analytics and rank predictions.</li>
              <li>To send you administrative information and marketing communications.</li>
              <li>To protect our Services and for legal reasons.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="font-bold text-gray-900">3. Data Security</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <h3 className="font-bold text-gray-900">4. Contact Us</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you have questions or comments about this policy, you may email us at <span className="font-bold text-emerald-600">support@neetrankbooster.com</span>.
          </p>
        </section>
      </div>
    </div>
  </div>
);

const TermsOfServiceScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="pb-24 bg-gray-50 min-h-screen">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Terms of Service" />
    <div className="px-6 mt-6 space-y-8 pb-12">
      <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Terms of Use</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Please read these terms carefully before using our platform.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="font-bold text-gray-900">1. Acceptance of Terms</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            By accessing or using NEET Rank Booster, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
          </p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Target size={18} />
            </div>
            <h3 className="font-bold text-gray-900">2. Performance Disclaimer</h3>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-4">
            <p className="text-xs text-amber-900 font-bold leading-relaxed">
              IMPORTANT: Your predicted rank and performance metrics are estimates based on our AI models. Your actual NEET rank solely depends on your understanding of the subject and your performance in the actual examination.
            </p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We do not guarantee any specific rank or score in the actual NEET exam.
          </p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <h3 className="font-bold text-gray-900">3. Subscriptions & Refunds</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>Certain parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring or one-time basis.</p>
            <p className="font-bold text-red-600">All payments made for the Pro Plan are non-refundable and cannot be cancelled once the subscription is activated.</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} />
            </div>
            <h3 className="font-bold text-gray-900">4. User Accounts</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
          </p>
        </section>
      </div>
    </div>
  </div>
);

const PostLoginScreen = ({ onNavigate, user }: { onNavigate: (s: Screen) => void, user?: any }) => {
  React.useEffect(() => {
    // Automatically navigate to dashboard after a short delay
    const timer = setTimeout(() => {
      onNavigate('dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-black text-gray-900 text-center mb-4"
      >
        Welcome Back!
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-center mb-12 leading-relaxed"
      >
        {user?.name || 'User'}, you have successfully logged in. <br />
        Preparing your personalized dashboard...
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 text-emerald-600 font-bold"
      >
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Redirecting...</span>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={() => onNavigate('dashboard')}
        className="mt-12 text-sm text-gray-400 underline underline-offset-4"
      >
        Click here if not redirected
      </motion.button>
    </div>
  );
};

const AnalyticsScreen = ({ onNavigate, onMenuClick, user }: { onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const performanceData = [
    { name: 'Test 1', score: 420 },
    { name: 'Test 2', score: 480 },
    { name: 'Test 3', score: 510 },
    { name: 'Test 4', score: 590 },
    { name: 'Test 5', score: 645 },
  ];

  const subjectData = [
    { subject: 'Biology', score: 92, full: 100 },
    { subject: 'Chemistry', score: 84, full: 100 },
    { subject: 'Physics', score: 71, full: 100 },
  ];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="My Profile" />
      
      <div className="px-6 mt-4 space-y-6">
        {/* Main Score Overview */}
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none shadow-xl shadow-emerald-500/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-1">Current Standing</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black italic">645</span>
                <span className="text-sm text-emerald-200 font-bold">/ 720</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <Award size={28} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              <span>Performance Level: Advanced</span>
              <span>89% Accuracy</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '89%' }}
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-emerald-900/30 p-3 rounded-xl border border-emerald-500/20">
              <TrendingUp size={14} className="text-emerald-300" />
              <span>You've improved by <span className="font-bold text-white">+12%</span> since last week</span>
            </div>
          </div>
        </Card>

        {/* Progress Tracking Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Score Progress</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last 5 Mock Tests</p>
            </div>
            <Calendar size={20} className="text-gray-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide domain={[0, 720]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 gap-4">
          <h3 className="font-bold text-gray-900 px-1">Performance Insights</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-emerald-50 border-emerald-100 p-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-emerald-900 mb-1">Top Strength</h4>
              <p className="text-sm font-black text-emerald-600">Biology</p>
              <p className="text-[10px] text-emerald-700 mt-1">92% Accuracy</p>
            </Card>
            
            <Card className="bg-red-50 border-red-100 p-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h4 className="text-xs font-bold text-red-900 mb-1">Needs Focus</h4>
              <p className="text-sm font-black text-red-600">Physics</p>
              <p className="text-[10px] text-red-700 mt-1">71% Accuracy</p>
            </Card>
          </div>

          <Card className="p-5">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Timer size={16} className="text-emerald-500" />
              Avg Time per Question
            </h4>
            <div className="space-y-4">
              {[
                { subject: 'Physics', time: '92 sec', color: 'bg-amber-500' },
                { subject: 'Chemistry', time: '54 sec', color: 'bg-blue-500' },
                { subject: 'Biology', time: '31 sec', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-xs font-bold text-gray-700">{item.subject}</span>
                  </div>
                  <span className="text-xs font-black text-gray-900">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Layers size={16} className="text-purple-500" />
              Chapter-Level Heatmap
            </h4>
            <div className="space-y-6">
              {[
                { 
                  subject: 'Physics', 
                  chapters: [
                    { name: 'Mechanics', score: 65 },
                    { name: 'Optics', score: 82 },
                    { name: 'Modern Physics', score: 91 },
                    { name: 'Thermodynamics', score: 45 }
                  ] 
                },
                { 
                  subject: 'Chemistry', 
                  chapters: [
                    { name: 'Organic', score: 88 },
                    { name: 'Inorganic', score: 72 },
                    { name: 'Physical', score: 79 }
                  ] 
                },
                { 
                  subject: 'Biology', 
                  chapters: [
                    { name: 'Genetics', score: 95 },
                    { name: 'Ecology', score: 89 },
                    { name: 'Human Phys.', score: 92 }
                  ] 
                },
              ].map((sub, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{sub.subject}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sub.chapters.map((ch, j) => (
                      <div 
                        key={j} 
                        className={cn(
                          "p-3 rounded-xl border flex flex-col gap-1",
                          ch.score > 85 ? "bg-emerald-50 border-emerald-100" :
                          ch.score > 70 ? "bg-blue-50 border-blue-100" :
                          "bg-amber-50 border-amber-100"
                        )}
                      >
                        <span className="text-[10px] font-bold text-gray-900 truncate">{ch.name}</span>
                        <div className="flex items-center justify-between">
                          <div className="h-1 flex-1 bg-black/5 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-current opacity-50" style={{ width: `${ch.score}%` }} />
                          </div>
                          <span className="text-[8px] font-black">{ch.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              Subject Breakdown
            </h4>
            <div className="space-y-4">
              {subjectData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">{item.subject}</span>
                    <span className="text-xs font-black text-gray-900">{item.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={cn(
                        "h-full rounded-full",
                        item.score > 85 ? "bg-emerald-500" : item.score > 75 ? "bg-blue-500" : "bg-amber-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Targeted Improvement */}
        <Card className="bg-gray-900 text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold mb-2">Targeted Improvement Plan</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Based on your Physics performance, we recommend focusing on <span className="text-emerald-400 font-bold">Rotational Motion</span> and <span className="text-emerald-400 font-bold">Thermodynamics</span> this week.
            </p>
            <button className="w-full bg-emerald-600 py-3 rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
              View Study Plan
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        </Card>
      </div>
    </div>
  );
};

const FocusAreaScreen = ({ onNavigate, onMenuClick, user }: { onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => (
  <div className="pb-24">
    <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Focus Areas" />
    
    <div className="px-6 mt-4 space-y-6">
      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
        <h2 className="text-xl font-bold text-emerald-900 mb-2">Focus Areas</h2>
        <p className="text-sm text-emerald-700">Based on your recent tests, these topics need immediate attention.</p>
      </div>

      <div className="space-y-4">
        {[
          { subject: 'Physics', topic: 'Rotational Motion', priority: 'High', color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle },
          { subject: 'Chemistry', topic: 'Organic Mechanisms', priority: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Zap },
          { subject: 'Biology', topic: 'Genetics & Evolution', priority: 'High', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Target },
          { subject: 'Physics', topic: 'Thermodynamics', priority: 'Low', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: BookOpen },
        ].map((item, i) => (
          <Card key={i} className={cn("flex items-center justify-between p-4", item.color)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase opacity-70">{item.subject}</p>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/50 font-bold uppercase">{item.priority} Priority</span>
                </div>
                <p className="text-sm font-bold">{item.topic}</p>
              </div>
            </div>
            <ChevronRight size={18} className="opacity-50" />
          </Card>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
        <h3 className="font-bold mb-2">Want to improve?</h3>
        <p className="text-xs text-gray-400 mb-4">Take a topic-wise practice test to master these weak areas.</p>
        <button className="w-full bg-emerald-600 py-3 rounded-xl text-xs font-bold active:scale-95 transition-transform">
          Start Practice Test
        </button>
      </div>
    </div>
  </div>
);

const PricingScreen = ({ onBack, onNavigate, onMenuClick, user }: { onBack: () => void, onNavigate: (s: Screen) => void, onMenuClick: () => void, user?: any }) => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Successful!</h1>
        <p className="text-gray-500 mb-8">Welcome to the Pro Plan. You now have unlimited access to all tests and analytics.</p>
        <button 
          onClick={onBack}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Header onMenuClick={onMenuClick} onNavigate={onNavigate} user={user} title="Pro Plan" />
      
      <div className="p-6 space-y-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="text-emerald-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unlock Full Series</h1>
          <p className="text-gray-500 text-sm">Get access to all 30 full-length mock tests and advanced analytics.</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/30 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200 mb-4">Limited Time Offer</p>
            <h3 className="text-5xl font-black mb-2 flex items-baseline gap-2">
              ₹299
              <span className="text-xl text-emerald-300/50 line-through font-bold">₹999</span>
            </h3>
            <p className="text-emerald-100 font-bold text-lg mb-6">That's less than ₹10 per test!</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-xs font-medium leading-relaxed">
                Join <span className="font-bold text-white">15,000+ aspirants</span> who improved their rank by an average of <span className="font-bold text-white">24%</span> using our Pro Mock Series.
              </p>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="space-y-6 mb-12">
          <h4 className="font-bold text-gray-900 text-lg px-2">Why Go Pro?</h4>
          <div className="grid gap-4">
            {[
              { title: '30 Full Mock Tests', desc: 'Strictly based on latest NTA pattern', icon: BookOpen },
              { title: 'AI Rank Predictor', desc: 'Know your standing among 20L+ students', icon: TrendingUp },
              { title: 'Weak Topic Analysis', desc: 'Identify exactly where you lose marks', icon: Target },
              { title: 'Step-by-Step Solutions', desc: 'Master concepts with detailed explanations', icon: Zap },
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <feat.icon size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900">{feat.title}</h5>
                  <p className="text-[10px] text-gray-500 font-medium">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setIsSuccess(true)}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
        >
          Upgrade Now
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-4">Secure payment via UPI, Cards, or NetBanking</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('onboarding');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('https://api-neetrankbooster.interviewmania.com/auth/check', {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success && data.code === 'SESSION_ACTIVE') {
          setIsLoggedIn(true);
          setUser(data.user);
          setCurrentScreen('post-login');
          if (data.settings && data.settings.dark_mode === '1') {
            setIsDarkMode(true);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = () => {
    startGoogleLogin();
  };

  const handleLogout = () => {
    bridgeLogout();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding': return <OnboardingScreen onLogin={handleLogin} onNavigate={setCurrentScreen} />;
      case 'dashboard': return <DashboardScreen onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'test-list': return <TestListScreen onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'test-instructions': return <TestInstructionsScreen onStart={() => setCurrentScreen('test-interface')} onBack={() => setCurrentScreen('test-list')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'test-interface': return <TestInterfaceScreen onExit={() => setCurrentScreen('test-list')} />;
      case 'analytics': return <AnalyticsScreen onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'focus-area': return <FocusAreaScreen onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'pricing': return <PricingScreen onBack={() => setCurrentScreen('test-list')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'history': return <TestHistoryScreen onBack={() => setCurrentScreen('dashboard')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'test-analysis': return <TestAnalysisScreen onBack={() => setCurrentScreen('history')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'settings': return <SettingsScreen onNavigate={setCurrentScreen} onBack={() => setCurrentScreen('dashboard')} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'faqs': return <FaqsScreen onBack={() => setCurrentScreen('settings')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'help': return <HelpScreen onBack={() => setCurrentScreen('settings')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'privacy-policy': return <PrivacyPolicyScreen onBack={() => setCurrentScreen(isLoggedIn ? 'settings' : 'onboarding')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'terms-of-service': return <TermsOfServiceScreen onBack={() => setCurrentScreen(isLoggedIn ? 'settings' : 'onboarding')} onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
      case 'post-login': return <PostLoginScreen onNavigate={setCurrentScreen} user={user} />;
      default: return <DashboardScreen onNavigate={setCurrentScreen} onMenuClick={() => setIsMenuOpen(true)} user={user} />;
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 font-medium animate-pulse">Checking session...</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "max-w-md mx-auto min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden transition-colors duration-300",
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        user={user}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {isLoggedIn && currentScreen !== 'test-interface' && (
        <BottomNav activeTab={currentScreen} onTabChange={setCurrentScreen} />
      )}
    </div>
  );
}
