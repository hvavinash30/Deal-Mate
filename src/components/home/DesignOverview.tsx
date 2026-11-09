import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  BadgePercent, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Check, 
  HeartHandshake,
  Database,
  Cloud
} from 'lucide-react';
import { DealMateDB } from '../../services/supabaseClient';

interface DesignOverviewProps {
  onStartShopping?: (query?: string) => void;
}

export const DesignOverview: React.FC<DesignOverviewProps> = ({ onStartShopping }) => {
  const [budget, setBudget] = useState<number>(3500);
  const [productCategory, setProductCategory] = useState<'gadgets' | 'fashion' | 'shoes'>('gadgets');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatedDiscount, setNegotiatedDiscount] = useState<number>(18);
  const [dealSaved, setDealSaved] = useState(false);

  // Simple, realistic mock demo calculation
  const originalPrice = productCategory === 'gadgets' ? 4499 : productCategory === 'shoes' ? 3999 : 2499;
  const targetOffer = Math.min(budget, Math.round(originalPrice * (1 - negotiatedDiscount / 100)));
  const totalSavings = originalPrice - targetOffer;

  const handleSimulateDeal = async () => {
    setIsNegotiating(true);
    setDealSaved(false);

    setTimeout(async () => {
      const discount = Math.floor(Math.random() * 10) + 15; // 15% - 25%
      setNegotiatedDiscount(discount);
      setIsNegotiating(false);

      // Save to Supabase / Local database
      await DealMateDB.saveNegotiatedDeal({
        product_name: productCategory === 'gadgets' ? 'Noise Cancelling Wireless Earbuds' : productCategory === 'shoes' ? 'Performance Running Sneakers' : 'Classic Cotton Oversized Shirt',
        original_price: originalPrice,
        negotiated_price: Math.round(originalPrice * (1 - discount / 100)),
        savings_amount: originalPrice - Math.round(originalPrice * (1 - discount / 100)),
        savings_percentage: discount,
        coupon_code: 'DEALMATE20',
        merchant_name: 'Verified Online Partner',
        status: 'deal_secured'
      });
      setDealSaved(true);
    }, 1000);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      {/* 1. Header with clear, friendly, human words */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Shopping Made Simple & Affordable</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Never Pay Full Price Again.{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            DealMate Bargains For You.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Tell us what you want and how much you have. DealMate searches trusted stores, finds hidden coupons, and negotiates a discount so you always get the best price.
        </p>
      </div>

      {/* 2. Interactive "Try the Bargainer" Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Interactive Demo: Test Your Budget</span>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Choose what you are buying:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gadgets', label: '🎧 Wireless Earbuds' },
                { id: 'shoes', label: '👟 Sneakers' },
                { id: 'fashion', label: '👕 Casual Shirt' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategory(cat.id as any)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-medium border transition ${
                    productCategory === cat.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Your Target Budget:</span>
              <span className="font-bold text-white text-lg">₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={6000}
              step={250}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>₹1,000</span>
              <span>₹3,500</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSimulateDeal}
            disabled={isNegotiating}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isNegotiating ? (
              <span>Negotiating with Store...</span>
            ) : (
              <>
                <HeartHandshake className="w-4 h-4" />
                <span>See How Much DealMate Can Save You</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Live Result Card */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Estimated Deal</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {negotiatedDiscount}% OFF
              </span>
            </div>

            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Original Store Price</span>
                <span className="line-through text-slate-500">₹{originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white">
                <span>DealMate Final Price</span>
                <span className="text-emerald-400 text-xl font-extrabold">₹{targetOffer.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Your Total Savings:</span>
              <span className="text-emerald-400 font-bold text-sm">₹{totalSavings.toLocaleString('en-IN')}</span>
            </div>

            {dealSaved && (
              <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20 animate-in fade-in">
                <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Saved to your Supabase deal history!</span>
              </div>
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onStartShopping && onStartShopping()}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition mx-auto"
            >
              <span>Explore live product search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Three Simple Steps (Human Language) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20">
            1
          </div>
          <h4 className="text-base font-bold text-white">1. Name Your Price</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Search for sneakers, laptops, or shirts and set the budget you want to stick to.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
            2
          </div>
          <h4 className="text-base font-bold text-white">2. AI Negotiates & Finds Coupons</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            DealMate compares sellers, tests live coupons, and proposes lower counter-offers on your behalf.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
            3
          </div>
          <h4 className="text-base font-bold text-white">3. Pay Less, Shop Happier</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Checkout with your secured discount directly with verified merchants and safe payment gateways.
          </p>
        </div>
      </div>

      {/* 4. Tech & Backend Architecture Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Powered by <strong>Supabase</strong> (PostgreSQL + Realtime Deals)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>Deployable on <strong>Vercel</strong> in 1-Click</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Bank-Grade Payment Security (Razorpay)</span>
        </div>
      </div>
    </section>
  );
};
