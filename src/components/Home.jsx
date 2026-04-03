import React, { useState, useEffect } from 'react';

export default function Home() {
  const [memberCount, setMemberCount] = useState(0);
  // Update this URL to your actual Render/Backend URL
  const API_URL = "https://api-myapp.onrender.com"; 

  useEffect(() => {
    // Fetch ONLY the number of members for better performance
    const fetchMemberCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/count`);
        if (response.ok) {
          const data = await response.json();
          // Use the count property from the new backend route
          setMemberCount(data.count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch member count:", err);
        setMemberCount(0);
      }
    };

    fetchMemberCount();
  }, []);

  return (
    <div className="animate-fade-in space-y-32 pb-10">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center space-y-8 pt-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[120px] -z-10"></div>
        
        {/* Animated Logo Container */}
        <div className="inline-block p-[2px] rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-transparent animate-pulse-slow mb-4">
           <div className="bg-[#0f172a] rounded-full p-5 backdrop-blur-3xl">
              <img src="/logo.png" alt="EPC Logo" className="w-20 h-20 object-contain" />
           </div>
        </div>

        <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
           Engineering Pioneers Club
        </h1>

        <div className="max-w-3xl mx-auto glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"></div>
          
          <p className="text-slate-300 text-xl leading-relaxed font-light tracking-wide">
             "is a student-led scientific club that aims to develop engineering skills, promote innovation, and organize events like workshops and conferences to help students grow academically and professionally."
          </p>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] animate-pulse">Database Registry</span>
            <span className="text-3xl font-mono font-black text-white tracking-widest">
              Total Members: {memberCount}
            </span>
          </div>
        </div>
      </section>

      {/* --- ABOUT US --- */}
      <section className="grid lg:grid-cols-2 gap-16 items-center px-4 max-w-6xl mx-auto">
        <div className="space-y-8 order-2 lg:order-1 animate-slide-up">
          <div>
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] mb-2">Our Identity</h2>
            <h3 className="text-6xl font-bold text-white tracking-tighter">Who We Are</h3>
          </div>
          <p className="text-slate-400 leading-loose text-lg font-light border-l-2 border-cyan-500/30 pl-8">
            The <span className="text-white font-bold underline decoration-cyan-500/50 underline-offset-8">Engineering Pioneers Club (EPC)</span> is a premier scientific organization at ENPO-MA. 
            We operate at the intersection of academic theory and industrial reality, preparing the next generation of engineers to lead with creative precision.
          </p>
        </div>
        <div className="relative order-1 lg:order-2 group">
          <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[3.5rem] blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-700"></div>
          <img src="/epc_team.jpg" className="relative rounded-[3rem] border border-white/10 shadow-2xl grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000" alt="EPC Team" />
        </div>
      </section>

      {/* --- EVENTS ARCHIVE --- */}
      <section className="space-y-20 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Archive of Impact</h2>
          <p className="text-slate-500 mt-2 font-mono uppercase tracking-[0.2em] text-xs">Major Events & Milestones</p>
        </div>

        <div className="grid gap-24">
          {/* Event 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center hover:translate-y-[-5px] transition-transform duration-500">
            <div className="space-y-6">
              <span className="bg-cyan-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Flagship Expo</span>
              <h3 className="text-4xl font-bold text-white tracking-tight">INAPI Expo 2025</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                Co-organized by EPC and INAPI, the Innovation Fair is a premier collaborative platform designed to unite researchers, industry leaders, and young creators to turn ideas into solutions.
              </p>
            </div>
            <div className="group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl glass-effect">
              <img src="/salon_inov.jpg" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" alt="INAPI Expo" />
            </div>
          </div>

          {/* Event 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center hover:translate-y-[-5px] transition-transform duration-500">
            <div className="group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl glass-effect lg:order-1 order-2">
              <img src="/cancer.jpg" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" alt="Hospital Visit" />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">Humanitarian</span>
              <h3 className="text-4xl font-bold text-white tracking-tight">Healing with Heart</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                Guided by community and compassion, we shared moments of joy and encouragement with young fighters at the children’s cancer hospital.
              </p>
            </div>
          </div>

          {/* Event 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center hover:translate-y-[-5px] transition-transform duration-500">
            <div className="space-y-6">
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">Legacy</span>
              <h3 className="text-4xl font-bold text-white tracking-tight">Best Club 2024-2025</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                For the second consecutive year, EPC has been honored with the Best Club Award, recognizing our unwavering dedication and professionalism.
              </p>
            </div>
            <div className="group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl glass-effect">
              <img src="/first.jpg" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" alt="Best Club Award" />
            </div>
          </div>

          {/* Event 4 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center hover:translate-y-[-5px] transition-transform duration-500">
            <div className="group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl glass-effect lg:order-1 order-2">
              <img src="/blood_donation.jpg" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" alt="Blood Drive" />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">Civic Duty</span>
              <h3 className="text-4xl font-bold text-white tracking-tight">38 Lives Saved</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                Our annual blood donation drive reinforcing the human element of engineering, resulting in significant life-saving contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="pt-32 pb-12 px-8 border-t border-white/5 bg-[#0a0f1d]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-16 mb-24 text-left">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-4 group cursor-default">
                <img src="/logo.png" className="w-14 h-14 grayscale brightness-200 group-hover:grayscale-0 transition-all duration-500" alt="Footer Logo" />
                <div className="h-10 w-[1px] bg-white/10"></div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">EPC ENPO-MA</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-loose text-sm font-light">
              The leading catalyst for student innovation in Algeria. Inspiring a community of pioneers technically proficient and socially conscious.
            </p>
          </div>
          
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Internal Systems</h5>
            <ul className="text-slate-400 text-sm space-y-3 font-medium uppercase tracking-tighter">
              <li className="hover:text-cyan-400 cursor-pointer transition-all">Digital Archive</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-all">Global Feed</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Connect</h5>
            <ul className="text-slate-400 text-sm space-y-3 font-medium uppercase tracking-tighter">
              <li>
                <a href="https://www.instagram.com/engineering_pioneers_club/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">Instagram</a>
              </li>
              <li>
                <a href="https://www.facebook.com/epc.enpo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">Facebook</a>
              </li>
              <li className="hover:text-white cursor-pointer transition-all">LinkedIn</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          <p>© 2026 Engineering Pioneers Club • Oran, Algeria</p>
          <div className="flex gap-10">
            <span>Privacy Protocol</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}