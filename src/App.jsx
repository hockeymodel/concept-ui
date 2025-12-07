import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, TrendingUp, Users, Lock, Info, Bell, 
  Menu, X, ChevronRight, ChevronDown, CheckCircle, 
  AlertTriangle, DollarSign, BarChart2, Star, User, 
  ArrowRight, ShieldCheck, Home, ArrowUpRight
} from 'lucide-react';

// --- MOCK DATA ---

const GAMES = [
  {
    id: 1,
    home: 'TOR',
    away: 'BOS',
    time: '7:00 PM ET',
    homeScore: null,
    awayScore: null,
    homeProb: 62,
    awayProb: 38,
    confidence: 'High',
    isFree: true,
    ev: 12.5,
    bestBet: 'TOR ML (-110)',
    bestBook: 'DraftKings',
    reasoning: ['Home Ice Advantage', 'BOS on B2B', 'Matthews Returning']
  },
  {
    id: 2,
    home: 'NYR',
    away: 'NJD',
    time: '7:30 PM ET',
    homeScore: null,
    awayScore: null,
    homeProb: 53,
    awayProb: 47,
    confidence: 'Medium',
    isFree: false,
    ev: 4.2,
    bestBet: 'Over 6.5',
    bestBook: 'FanDuel',
    reasoning: ['Starting Goalies Rested', 'High Tempo Matchup']
  },
  {
    id: 3,
    home: 'EDM',
    away: 'CGY',
    time: '10:00 PM ET',
    homeScore: null,
    awayScore: null,
    homeProb: 71,
    awayProb: 29,
    confidence: 'High',
    isFree: false,
    ev: 8.9,
    bestBet: 'McDavid Over 1.5 Pts',
    bestBook: 'BetMGM',
    reasoning: ['EDM PP Efficiency', 'CGY Penalty Trouble']
  },
  {
    id: 4,
    home: 'VGK',
    away: 'COL',
    time: '10:30 PM ET',
    homeScore: null,
    awayScore: null,
    homeProb: 48,
    awayProb: 52,
    confidence: 'Low',
    isFree: false,
    ev: -1.2,
    bestBet: 'Avoid ML',
    bestBook: 'N/A',
    reasoning: ['Goalie Uncertainty', 'Key Injuries on both sides']
  }
];

const PROPS = [
  { id: 1, player: 'A. Matthews', team: 'TOR', prop: 'Anytime Goal', line: '-120', prob: '58%', ev: '+8.2%', badge: 'High Value' },
  { id: 2, player: 'C. McDavid', team: 'EDM', prop: 'Over 3.5 Shots', line: '+105', prob: '52%', ev: '+4.1%', badge: 'Good' },
  { id: 3, player: 'I. Shesterkin', team: 'NYR', prop: 'Over 28.5 Saves', line: '-110', prob: '60%', ev: '+10.5%', badge: 'High Value' },
  { id: 4, player: 'J. Hughes', team: 'NJD', prop: 'Over 0.5 Assists', line: '-140', prob: '65%', ev: '+2.0%', badge: 'Neutral' },
  { id: 5, player: 'N. MacKinnon', team: 'COL', prop: 'Under 1.5 Pts', line: '+150', prob: '45%', ev: '+12.5%', badge: 'Risky but +EV' },
];

const EDGE_FINDER = [
  { game: 'TOR vs BOS', type: 'Moneyline', pick: 'TOR', odds: '-110', myProb: '62%', bookProb: '52.4%', ev: 12.5, kelly: '4.2%', book: 'DraftKings' },
  { game: 'NYR vs NJD', type: 'Total', pick: 'Over 6.5', odds: '+100', myProb: '53%', bookProb: '50.0%', ev: 6.0, kelly: '2.1%', book: 'FanDuel' },
  { game: 'EDM vs CGY', type: 'Puck Line', pick: 'EDM -1.5', odds: '+145', myProb: '45%', bookProb: '40.8%', ev: 10.2, kelly: '3.0%', book: 'BetMGM' },
  { game: 'TBL vs FLA', type: 'Prop', pick: 'Kucherov Goal', odds: '+160', myProb: '41%', bookProb: '38.5%', ev: 6.5, kelly: '1.8%', book: 'Caesars' },
];

// --- HELPER COMPONENTS ---

// Simple SVG Line Chart for Performance
const PerformanceChart = () => {
  // Mock data: cumulative profit over 12 weeks
  const data = [0, 150, 320, 280, 450, 580, 890, 850, 1100, 1350, 1420, 1650];
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  // Generate path
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / (max - min)) * 80 - 10; // keep padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-white font-bold text-lg">Model Bankroll Growth</h3>
           <p className="text-slate-400 text-xs">Based on $100/unit, Kelly Criterion sizing</p>
        </div>
        <div className="flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded text-sm font-bold border border-green-900/50">
          <TrendingUp size={16} className="mr-1" /> All-Time High
        </div>
      </div>

      <div className="relative h-48 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
           {/* Gradient Defs */}
           <defs>
             <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
               <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
               <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
             </linearGradient>
           </defs>
           
           {/* Grid lines */}
           <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
           <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
           <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />

           {/* Area Fill */}
           <path d={`M0,100 ${points} L100,100 Z`} fill="url(#chartGradient)" />
           
           {/* Line */}
           <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
           
           {/* End Dot */}
           <circle cx="100" cy="19" r="2" fill="#3b82f6" stroke="white" strokeWidth="0.5" />
        </svg>
        
        {/* Tooltip Overlay (Static for demo) */}
        <div className="absolute top-[10%] right-[5%] bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 shadow-lg">
          <span className="text-slate-400 block">Current Profit</span>
          <span className="font-bold font-mono text-green-400">+$1,650</span>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
        <span>Week 1</span>
        <span>Week 4</span>
        <span>Week 8</span>
        <span>Week 12</span>
      </div>
    </div>
  );
};

// 1. Navigation (Responsive)
const Navigation = ({ activePage, setPage, userTier, setUserTier }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ page, icon: Icon, label }) => (
    <button
      onClick={() => setPage(page)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        activePage === page ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setPage('landing')}>
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <BarChart2 className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">HockeyModel</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavItem page="dashboard" icon={Home} label="Dashboard" />
                <NavItem page="edges" icon={TrendingUp} label="Market Edge" />
                <NavItem page="props" icon={Target} label="Player Props" />
                <NavItem page="contests" icon={Trophy} label="Contests" />
              </div>
            </div>

            {/* User Tier Toggle (For Prototype Demo) */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
                <button 
                  onClick={() => setUserTier('free')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${userTier === 'free' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Free View
                </button>
                <button 
                  onClick={() => setUserTier('premium')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${userTier === 'premium' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Premium View
                </button>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <User size={16} className="text-slate-300" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 pb-3 px-2 pt-2 border-b border-slate-800">
            <div className="flex flex-col space-y-1">
              <NavItem page="dashboard" icon={Home} label="Dashboard" />
              <NavItem page="edges" icon={TrendingUp} label="Market Edge" />
              <NavItem page="props" icon={Target} label="Player Props" />
              <NavItem page="contests" icon={Trophy} label="Contests" />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around py-3 z-50 pb-safe">
        <button onClick={() => setPage('dashboard')} className={`flex flex-col items-center ${activePage === 'dashboard' ? 'text-blue-500' : 'text-slate-500'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setPage('edges')} className={`flex flex-col items-center ${activePage === 'edges' ? 'text-blue-500' : 'text-slate-500'}`}>
          <Target size={20} />
          <span className="text-[10px] mt-1">Picks</span>
        </button>
        <button onClick={() => setPage('contests')} className={`flex flex-col items-center ${activePage === 'contests' ? 'text-blue-500' : 'text-slate-500'}`}>
          <Trophy size={20} />
          <span className="text-[10px] mt-1">Contests</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <User size={20} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </>
  );
};

// 2. Landing Page
const LandingPage = ({ setPage }) => (
  <div className="bg-slate-950 min-h-screen">
    {/* Hero */}
    <div className="relative overflow-hidden pt-16 pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <CheckCircle size={14} className="text-green-500" />
          <span className="text-sm font-mono text-green-400">85.2% Accuracy Last 30 Days</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          Win More Bets with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Data-Driven Hockey AI</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Stop guessing. Get probability-based predictions, market edge detection, and transparent explainability for every NHL game.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => setPage('dashboard')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all">
            Start Free
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-medium text-lg transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </div>

    {/* Social Proof Ticker */}
    <div className="bg-slate-900 border-y border-slate-800 overflow-hidden py-3">
      <div className="flex space-x-12 animate-marquee whitespace-nowrap text-sm font-mono text-slate-400">
        <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> TOR vs BOS: Predicted 62% BOS Win ✅</span>
        <span className="flex items-center"><TrendingUp size={14} className="text-blue-500 mr-2" /> Matthews Goal (+140) Hit 💰</span>
        <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> EDM -1.5 Spread Correct ✅</span>
        <span className="flex items-center"><Users size={14} className="text-purple-500 mr-2" /> 12,405 Predictions Made This Season</span>
      </div>
    </div>

    {/* Historical Performance Section */}
    <div className="bg-slate-950 py-20 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold mb-4 uppercase tracking-wider text-sm">
              <TrendingUp size={18} />
              <span>Performance Track Record</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Proven Results, <br/>
              <span className="text-green-400">Real Profitability.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We track every single prediction. Our model consistently outperforms the market, generating steady ROI for disciplined bettors who follow our Kelly Criterion sizing recommendations.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-green-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                   <div className="text-sm text-slate-500">Season ROI</div>
                   <ArrowUpRight size={16} className="text-green-500" />
                </div>
                <div className="text-3xl font-mono font-bold text-green-400">+14.2%</div>
                <div className="text-xs text-slate-500 mt-1">Return on Investment</div>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                   <div className="text-sm text-slate-500">Profit (1u = $100)</div>
                   <DollarSign size={16} className="text-slate-400" />
                </div>
                <div className="text-3xl font-mono font-bold text-white">+$1,650</div>
                <div className="text-xs text-slate-500 mt-1">Total Unit Profit</div>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                 <div className="flex items-center justify-between mb-2">
                   <div className="text-sm text-slate-500">Win Rate (ML)</div>
                   <Target size={16} className="text-blue-400" />
                </div>
                <div className="text-3xl font-mono font-bold text-blue-400">58.4%</div>
                <div className="text-xs text-slate-500 mt-1">Straight Up Winners</div>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                 <div className="flex items-center justify-between mb-2">
                   <div className="text-sm text-slate-500">Total Picks</div>
                   <BarChart2 size={16} className="text-slate-400" />
                </div>
                <div className="text-3xl font-mono font-bold text-white">1,240</div>
                <div className="text-xs text-slate-500 mt-1">Verified Predictions</div>
              </div>
            </div>
          </div>
          
          {/* Graph Component */}
          <div className="relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
               <PerformanceChart />
          </div>
        </div>
      </div>
    </div>

    {/* Feature Grid */}
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Win Predictions', desc: 'Know who wins before puck drop with precise probability modeling.' },
          { icon: TrendingUp, title: 'Market Edge Finder', desc: 'We compare our odds against sportsbooks to find +EV opportunities.' },
          { icon: Info, title: 'Transparent AI', desc: 'No black boxes. We show you exactly why a prediction was made.' }
        ].map((feature, i) => (
          <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <feature.icon className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. Game Card Component
const GameCard = ({ game, tier, onExplain }) => {
  const isLocked = !game.isFree && tier === 'free';

  return (
    <div className={`relative bg-slate-800 rounded-xl border ${game.confidence === 'High' && !isLocked ? 'border-blue-500/50 shadow-lg shadow-blue-900/20' : 'border-slate-700'} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-slate-700/50 bg-slate-800/50">
        <span className="text-xs font-mono text-slate-400">{game.time}</span>
        {!isLocked && game.confidence === 'High' && (
          <span className="flex items-center text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
            <Star size={12} className="mr-1 fill-blue-400" /> High Confidence
          </span>
        )}
      </div>

      {/* Teams & Probabilities */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Home */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-600">
                {game.home}
              </div>
              <span className="font-bold text-lg text-white">{game.home}</span>
            </div>
            <div className="text-right">
              {isLocked ? (
                <div className="h-6 w-12 bg-slate-700 rounded animate-pulse" />
              ) : (
                <span className={`font-mono font-bold text-lg ${game.homeProb > 50 ? 'text-white' : 'text-slate-500'}`}>
                  {game.homeProb}%
                </span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
            {isLocked ? (
               <div className="w-full h-full bg-slate-600" />
            ) : (
              <>
                <div style={{ width: `${game.homeProb}%` }} className="h-full bg-blue-500" />
                <div style={{ width: `${game.awayProb}%` }} className="h-full bg-red-500" />
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-600">
                {game.away}
              </div>
              <span className="font-bold text-lg text-white">{game.away}</span>
            </div>
            <div className="text-right">
              {isLocked ? (
                <div className="h-6 w-12 bg-slate-700 rounded animate-pulse" />
              ) : (
                <span className={`font-mono font-bold text-lg ${game.awayProb > 50 ? 'text-white' : 'text-slate-500'}`}>
                  {game.awayProb}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis / Locked State */}
      <div className="relative p-5 bg-slate-900/50 border-t border-slate-700">
        {isLocked ? (
          // Locked Overlay
          <div className="absolute inset-0 backdrop-blur-md bg-slate-900/60 z-10 flex flex-col items-center justify-center text-center p-4">
            <Lock className="text-amber-500 mb-2" size={24} />
            <span className="text-white font-bold mb-1">Unlock +EV Data</span>
            <span className="text-xs text-slate-300 mb-3">See win probability & market edge</span>
            <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-colors">
              Go Premium
            </button>
          </div>
        ) : (
          // Unlocked Content
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">Best Edge</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{game.bestBet}</span>
                  {game.ev > 0 ? (
                    <span className="text-xs font-bold text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/50">+{game.ev}% EV</span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded border border-red-900/50">{game.ev}% EV</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block mb-0.5">Sportsbook</span>
                <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">{game.bestBook}</span>
              </div>
            </div>
            <button 
              onClick={() => onExplain(game)}
              className="w-full mt-2 flex items-center justify-center space-x-1 py-2 rounded border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all text-sm"
            >
              <Info size={14} />
              <span>Explain this prediction</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Explainability Modal/View
const ExplanationView = ({ game, onBack }) => {
  const [scenarioActive, setScenarioActive] = useState(false);
  const baseProb = 50;
  // Simple logic to mimic interactive waterfall
  const factors = [
    { name: 'Home Ice Advantage', val: 8, type: 'pos' },
    { name: 'Opponent on B2B', val: 5, type: 'pos' },
    { name: 'Goalie Matchup', val: -3, type: 'neg' },
    { name: 'Recent Form (L10)', val: 4, type: 'pos' }
  ];
  
  // Scenario modifier
  const scenarioMod = scenarioActive ? -10 : 0;
  const finalProb = baseProb + factors.reduce((acc, curr) => acc + curr.val, 0) + scenarioMod;

  return (
    <div className="bg-slate-900 min-h-screen p-4 md:p-8">
      <button onClick={onBack} className="mb-6 flex items-center text-slate-400 hover:text-white">
        <ArrowRight className="rotate-180 mr-2" size={18} /> Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{game.home} vs {game.away} Prediction</h2>
            <p className="text-slate-400">Deep dive into why our model favors the home team.</p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-slate-500 uppercase tracking-wider">Win Probability</span>
            <span className={`text-4xl font-mono font-bold ${finalProb > 50 ? 'text-green-400' : 'text-slate-300'}`}>
              {finalProb}%
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Visual: Waterfall */}
          <div className="md:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Probability Waterfall</h3>
            <div className="space-y-3 relative pb-10">
              {/* Base */}
              <div className="flex items-center">
                <span className="w-32 text-sm text-slate-400">Base Prob</span>
                <div className="flex-1 h-8 bg-slate-700/30 rounded relative mx-2">
                   <div style={{ width: '50%' }} className="h-full bg-slate-600 rounded-l" />
                </div>
                <span className="w-12 text-sm font-mono text-white text-right">50%</span>
              </div>
              {/* Factors */}
              {factors.map((f, i) => (
                <div key={i} className="flex items-center animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms`}}>
                  <span className="w-32 text-sm text-slate-300 truncate">{f.name}</span>
                  <div className="flex-1 h-8 relative mx-2">
                     <div 
                      className={`h-full rounded ${f.type === 'pos' ? 'bg-green-500/80' : 'bg-red-500/80'}`}
                      style={{ 
                        width: `${Math.abs(f.val)}%`,
                        marginLeft: `${50 + factors.slice(0, i).reduce((a,c) => a+c.val, 0)}%`
                      }} 
                     />
                  </div>
                  <span className={`w-12 text-sm font-mono text-right ${f.type === 'pos' ? 'text-green-400' : 'text-red-400'}`}>
                    {f.type === 'pos' ? '+' : ''}{f.val}%
                  </span>
                </div>
              ))}
               {/* Scenario */}
               {scenarioActive && (
                 <div className="flex items-center">
                  <span className="w-32 text-sm text-amber-400 truncate">Star Player Out</span>
                  <div className="flex-1 h-8 relative mx-2">
                     <div 
                      className="h-full rounded bg-amber-500/80"
                      style={{ 
                        width: '10%',
                        marginLeft: `${50 + factors.reduce((a,c) => a+c.val, 0) - 10}%`
                      }} 
                     />
                  </div>
                  <span className="w-12 text-sm font-mono text-right text-amber-400">-10%</span>
                </div>
               )}
            </div>
          </div>

          {/* Controls & Scenarios */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Top Factors</h3>
              <ul className="space-y-3">
                {game.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-300">
                    <CheckCircle size={16} className="text-blue-500 mr-2 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Scenario Simulator</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Star Player Injury?</span>
                <button 
                  onClick={() => setScenarioActive(!scenarioActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${scenarioActive ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${scenarioActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">Toggle to see how the model adjusts probability if key players are scratched.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Market Edge Finder (Table)
const MarketEdgeFinder = ({ tier }) => {
  if (tier === 'free') return (
    <div className="min-h-[600px] flex flex-col items-center justify-center text-center p-8 bg-slate-900 border-x border-slate-800">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md shadow-2xl">
        <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
        <p className="text-slate-400 mb-6">Unlock the full Market Edge Finder to see +EV bets across all major sportsbooks compared to our model's probability.</p>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors">Upgrade Now</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Market Edge Finder</h2>
          <p className="text-slate-400 text-sm mt-1">Comparing Model Probability vs Sportsbook Implied Probability</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-sm hover:text-white">Moneyline</button>
          <button className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-sm hover:text-white">Puck Line</button>
          <button className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-sm hover:text-white">Totals</button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Matchup</th>
                <th className="px-6 py-4 font-medium">Bet Type</th>
                <th className="px-6 py-4 font-medium">Selection</th>
                <th className="px-6 py-4 font-medium text-right">Model Prob</th>
                <th className="px-6 py-4 font-medium text-right">Implied Prob</th>
                <th className="px-6 py-4 font-medium text-right text-blue-400">Edge (EV)</th>
                <th className="px-6 py-4 font-medium text-center">Best Odds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {EDGE_FINDER.map((row, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{row.game}</td>
                  <td className="px-6 py-4 text-slate-400">{row.type}</td>
                  <td className="px-6 py-4 text-white font-bold">{row.pick}</td>
                  <td className="px-6 py-4 text-right text-slate-300 tabular-nums">{row.myProb}</td>
                  <td className="px-6 py-4 text-right text-slate-500 tabular-nums">{row.bookProb}</td>
                  <td className="px-6 py-4 text-right font-bold tabular-nums text-green-400">+{row.ev}%</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center bg-slate-900 border border-slate-700 rounded px-2 py-1">
                      <span className="text-white font-bold">{row.odds}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{row.book}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. Contests
const ContestPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-8">
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-slate-700 mb-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Weekly Prediction Challenge</h2>
        <p className="text-slate-300 mb-6">Predict 5 games correctly to win a $50 Amazon Gift Card. Current Entries: 342</p>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-800" />)}
          </div>
          <span className="text-sm text-slate-400">+339 others joined</span>
        </div>
      </div>
      <Trophy className="absolute -right-6 -bottom-6 text-white/5 w-48 h-48 rotate-12" />
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Your Picks for Week 15</h3>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-300 font-bold border border-slate-600">TOR</div>
            <span className="text-slate-500 text-sm">vs</span>
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-300 font-bold border border-slate-600">BOS</div>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Pick Winner</span>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-sm">TOR</button>
                    <button className="px-3 py-1 rounded text-slate-400 hover:text-white text-xs font-medium">BOS</button>
                </div>
            </div>
            
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Confidence</span>
                <div className="flex text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} className="text-slate-700" />
                    <Star size={14} className="text-slate-700" />
                </div>
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.01]">
        Submit Picks
      </button>
    </div>
  </div>
);

// 7. Player Props Explorer (Compact Grid)
const PlayerProps = ({ tier }) => {
    if (tier === 'free') return <MarketEdgeFinder tier="free" />; // Re-use lock screen for speed
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-6">Player Props Explorer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROPS.map(prop => (
                    <div key={prop.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                    <User size={20} className="text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{prop.player}</h3>
                                    <span className="text-xs text-slate-500">{prop.team}</span>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                prop.badge === 'High Value' 
                                ? 'bg-green-900/20 text-green-400 border-green-900/50' 
                                : 'bg-slate-700 text-slate-400 border-slate-600'
                            }`}>
                                {prop.badge}
                            </span>
                        </div>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">{prop.prop}</span>
                                <span className="text-white font-mono">{prop.line}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: prop.prob }} />
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-blue-400 font-bold">{prop.prob} Prob</span>
                                <span className="text-green-400 font-bold">{prop.ev} EV</span>
                            </div>
                        </div>
                        
                        <button className="w-full py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-colors">
                            Compare Odds
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 8. Main Dashboard Container
const Dashboard = ({ tier, setPage, setExplanationGame }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Premium Header Carousel */}
    {tier === 'premium' && (
      <div className="mb-10">
        <h2 className="flex items-center text-lg font-bold text-white mb-4">
          <TrendingUp className="text-green-400 mr-2" size={20} /> 
          Today's Best Edges
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
             <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700/50 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp size={48} />
                </div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/50">+12.5% EV</span>
                    <span className="text-xs text-slate-500">DraftKings</span>
                </div>
                <div className="font-bold text-white text-lg mb-1">TOR Moneyline</div>
                <div className="text-sm text-slate-400">vs Boston Bruins</div>
             </div>
          ))}
        </div>
      </div>
    )}

    {/* Games Grid */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Upcoming Games</h2>
      <div className="flex items-center space-x-2 text-sm text-slate-400">
        <span>Sort by:</span>
        <select className="bg-slate-800 border-none rounded text-white text-sm focus:ring-1 focus:ring-blue-500">
            <option>Time</option>
            <option>Confidence</option>
            <option>Edge %</option>
        </select>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 pb-20">
      {GAMES.map(game => (
        <GameCard 
            key={game.id} 
            game={game} 
            tier={tier} 
            onExplain={(g) => {
                setExplanationGame(g);
                setPage('explanation');
            }} 
        />
      ))}
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [activePage, setActivePage] = useState('landing');
  const [userTier, setUserTier] = useState('free'); // 'free' or 'premium'
  const [explanationGame, setExplanationGame] = useState(null);

  // Simple Router
  const renderPage = () => {
    switch(activePage) {
      case 'landing': return <LandingPage setPage={setActivePage} />;
      case 'dashboard': return <Dashboard tier={userTier} setPage={setActivePage} setExplanationGame={setExplanationGame} />;
      case 'explanation': return explanationGame ? <ExplanationView game={explanationGame} onBack={() => setActivePage('dashboard')} /> : <Dashboard tier={userTier} />;
      case 'edges': return <MarketEdgeFinder tier={userTier} />;
      case 'props': return <PlayerProps tier={userTier} />;
      case 'contests': return <ContestPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200 selection:bg-blue-500/30">
      {activePage !== 'landing' && (
        <Navigation 
          activePage={activePage} 
          setPage={setActivePage} 
          userTier={userTier} 
          setUserTier={setUserTier} 
        />
      )}
      
      <main>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4 opacity-50">
            <BarChart2 size={20} />
            <span className="font-bold">HockeyModel</span>
        </div>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Gambling problem? Call 1-800-GAMBLER. <br/>
            This platform is for informational purposes only. Past performance does not guarantee future results. 
            All predictions are probability-based estimates.
        </p>
        <p className="text-xs text-slate-700 mt-4">&copy; 2024 HockeyModel Analytics Inc.</p>
      </footer>
    </div>
  );
};

export default App;