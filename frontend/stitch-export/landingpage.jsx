import React from 'react';
import { Star, ChevronRight, Play } from 'lucide-react';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans text-gray-900">
      <TopNavBar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 md:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold tracking-widest uppercase">
            <span>🔥</span> Fresh from the oven
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Revolutionize Your <br />
            <span className="text-red-600 italic">Kitchen Workflow</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0">
            The ultimate Pizza SaaS platform designed for high-velocity kitchens. 
            Real-time ingredient tracking, dynamic wizards, and automated delivery logistics.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <button className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95">
              Build Your Dream Pizza
            </button>
            <button className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
              Watch Demo <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full"></div>
          <img 
            src="{{DATA:IMAGE:IMAGE_1}}" 
            alt="Hero Pizza" 
            className="relative w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-float"
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Trending This Week</h2>
            <p className="text-gray-500">The most loved configurations from our top-performing kitchens.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Card */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl aspect-[16/9]">
              <img src="{{DATA:IMAGE:IMAGE_2}}" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Mediterranean Tech" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                <span className="w-fit px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full mb-4">Best Seller</span>
                <h3 className="text-4xl font-bold text-white mb-2">The Mediterranean Tech</h3>
                <p className="text-white/70 max-w-md mb-6">Roasted red peppers, Kalamata olives, feta, and a drizzle of balsamic glaze on a sourdough crust.</p>
                <button className="flex items-center gap-2 text-white font-bold group">
                  Customize Now <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            
            <div className="space-y-8">
              {[
                { title: 'Classic API Margherita', img: '{{DATA:IMAGE:IMAGE_3}}', desc: 'Pure, simple, reliable.' },
                { title: 'Hot-Reload Buffalo', img: '{{DATA:IMAGE:IMAGE_4}}', desc: 'For those who like a little kick.' }
              ].map((item) => (
                <div key={item.title} className="relative group overflow-hidden rounded-3xl aspect-[4/3]">
                  <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-8 flex flex-col justify-end">
                    <h4 className="text-xl font-bold text-white">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;