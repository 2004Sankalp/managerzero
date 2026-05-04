import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Clock, 
  Cpu,
  ChevronRight,
  Menu
} from "lucide-react";

// The top navbar
const Navbar = ({ onLogin, onGetStarted }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-black/20 border-b border-white/5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Zap className="text-black w-5 h-5 fill-current" />
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-white">ManagerZero</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-secondary">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onLogin} className="hidden sm:block text-sm font-medium hover:text-brand-secondary text-white transition-colors">Log in</button>
        <button onClick={onGetStarted} className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-brand-secondary transition-all transform hover:scale-105">
          Get Started
        </button>
        <Menu className="md:hidden w-6 h-6 text-white" />
      </div>
    </nav>
  );
};

// Reusable pill for the hero floating assets
const Pill = ({ children, icon: Icon, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-white transition-colors ${className}`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </motion.div>
);

const Char = ({ char, start, end, scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block relative shadow-black drop-shadow-md">
      {char}
    </motion.span>
  );
};

// High-end scroll-tied letter-by-letter fade in
const AnimatedScrollText = ({ text }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 80%", "end 45%"] // Start fading in when top of container is 80% down the viewport
  });

  const words = text.split(" ");
  const totalLetters = text.replace(/\s+/g, "").length;
  let letterCount = 0;

  return (
    <h2 ref={container} className="text-3xl md:text-5xl font-display font-medium leading-[1.2] tracking-tight flex flex-wrap justify-center">
      {words.map((word, i) => (
        <span key={i} className="inline-flex mr-[0.3em] mb-[0.2em]">
          {word.split("").map((char, j) => {
            const start = letterCount / totalLetters;
            const end = start + (1 / totalLetters);
            letterCount++;
            return (
              <Char 
                key={j} 
                char={char} 
                start={start} 
                end={end} 
                scrollYProgress={scrollYProgress} 
              />
            );
          })}
        </span>
      ))}
    </h2>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll(); // captures global scroll
  
  // Parallax bindings
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]); // deep slow zoom over full site
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]); // fades out quickly as you scroll past
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 150]); // slides down beneath content 

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden scroll-smooth">
      
      <Navbar onLogin={() => navigate('/login')} onGetStarted={() => navigate('/app')} />
      
      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 flex flex-col items-center justify-center min-h-[80vh] w-full text-center overflow-hidden border-b border-white/5">
          
          {/* Fixed Background Video Layer with Parallax Zoom */}
          <motion.div 
            style={{ scale: videoScale }}
            className="fixed inset-0 w-screen h-screen z-0 pointer-events-none select-none origin-center"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/assets/hero-loop.mp4" type="video/mp4" />
            </video>
            {/* Gradient overlays to smoothly blend the video into the black page bg */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
          </motion.div>

          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 max-w-4xl w-full flex flex-col items-center px-6 mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-brand-secondary">
                AI-Powered Chief of Staff
              </span>
              <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-10 text-white">
                The New Era of <br />
                Engineering Management
              </h1>
              <p className="text-xl md:text-2xl text-brand-secondary max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Automate daily standups, extract action items from meetings, and track sentiment. 
                Your manager tasks, handled by AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-8"
            >
              <button 
                onClick={() => navigate('/app')}
                className="group flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-brand-secondary transition-all transform hover:scale-105"
              >
                Launch Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium border-b border-white/20 pb-1 hover:border-white transition-colors text-white"
              >
                Book a Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Floating Pills - Constrained and tied to Hero fade-out */}
          <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 w-full max-w-7xl mx-auto pointer-events-none z-10">
            <div className="absolute left-10 top-1/3 hidden xl:block pointer-events-auto">
              <Pill icon={Clock} className="rotate-[-6deg]">Daily Standups</Pill>
            </div>
            <div className="absolute left-20 bottom-1/4 hidden xl:block pointer-events-auto">
              <Pill icon={MessageSquare} className="rotate-[4deg]">Action Items</Pill>
            </div>
            <div className="absolute right-16 top-1/4 hidden xl:block pointer-events-auto">
              <Pill icon={BarChart3} className="rotate-[8deg]">Sentiment Analysis</Pill>
            </div>
            <div className="absolute right-10 bottom-1/3 hidden xl:block pointer-events-auto">
              <Pill icon={Cpu} className="rotate-[-4deg]">AI Powered</Pill>
            </div>
          </motion.div>
        </section>

        {/* ── TRANSLUCENT CONTENT LAYER ── */}
        {/* This layer floats over the fixed video as you scroll */}
        <div className="relative z-10 w-full flex flex-col items-center border-t border-white/5">
          {/* Company Overview Section */}
        <section id="about" className="w-full max-w-4xl mx-auto px-6 py-32 text-center text-white">
          <AnimatedScrollText text="ManagerZero gives you a complete overview of your engineering team — from daily blockers and meeting action items to client sentiment trends. Every metric updates automatically, so you never have to chase anyone on Slack again." />
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 text-white">
          {[
            {
              title: "Automated Standups",
              desc: "No more chasing updates. AI collects and summarizes daily progress across all your tools.",
              icon: Clock
            },
            {
              title: "Meeting Intelligence",
              desc: "Extract action items and key decisions from transcripts automatically. Never miss a detail.",
              icon: MessageSquare
            },
            {
              title: "Sentiment Tracking",
              desc: "Understand team morale and client feedback trends with real-time sentiment analysis.",
              icon: BarChart3
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 80, damping: 15 }}
              className="flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-black">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-brand-secondary font-light leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Intelligence Layer Section */}
        <section id="solutions" className="w-full max-w-7xl mx-auto px-6 py-32 border-t border-white/5 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Heading */}
            <div className="lg:col-span-4">
              <motion.h2 
                initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-tight"
              >
                Scale your <br />
                impact, not <br />
                your workload.
              </motion.h2>
            </div>

            {/* Central Visual */}
            <div className="lg:col-span-4 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full max-w-[320px] aspect-square border border-white/10 rounded-sm p-8 flex flex-col items-center justify-center group bg-black shadow-[0_0_100px_rgba(255,255,255,0.05)] hover:shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-shadow duration-700"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />
                
                {/* Animated Bars */}
                <div className="flex items-end gap-1.5 h-32 mb-8">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7, 0.4].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "20%" }}
                      whileInView={{ height: `${h * 100}%` }}
                      transition={{ 
                        duration: 1.5, 
                        delay: i * 0.1, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-white/80 rounded-full"
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-1">ManagerZero</div>
                  <div className="text-[8px] uppercase tracking-[0.2em] text-brand-secondary">Intelligence Layer</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-4 flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-display font-bold mb-6">The Intelligence Layer</h3>
                <p className="text-brand-secondary font-light leading-relaxed mb-8">
                  ManagerZero isn't just a tool; it's a dedicated intelligence layer for your engineering organization. By synthesizing data from your entire stack, we provide the context you need to lead with confidence and clarity.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black text-white transition-all group">
                  Learn more
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ManagerZero OS Section - Cleaned up */}
        <section className="relative w-full border-t border-white/5 overflow-hidden text-white">
          <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
            {/* Left Sidebar Content */}
            <div className="lg:col-span-3 flex flex-col justify-between py-12 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 border border-white/10 rounded-sm flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">The Engine</h4>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  Collecting signals from GitHub, Slack, and Jira to build a unified view of progress.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24"
              >
                <h4 className="text-sm font-bold mb-2">Legacy Systems Reimagined</h4>
                <button className="text-[10px] uppercase tracking-wider text-brand-secondary hover:text-white transition-colors">Read more</button>
              </motion.div>
            </div>

            {/* Main Center Content */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center py-24 px-12 border-x border-white/5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-none mb-12">
                  Engineering <br />
                  Operating <br />
                  System
                </h2>
                <button 
                  onClick={() => navigate('/app')}
                  className="px-10 py-4 bg-white text-black font-bold rounded-sm hover:bg-brand-secondary transition-all transform hover:scale-105"
                >
                  Launch Dashboard
                </button>
              </motion.div>
            </div>

            {/* Right Sidebar Content */}
            <div className="lg:col-span-3 flex flex-col justify-between py-12 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-right lg:text-left"
              >
                <div className="text-[10px] text-brand-secondary uppercase tracking-widest mb-4">
                  Endorsed by Top <br /> Engineering Leads
                </div>
                <div className="flex -space-x-2 mb-4 justify-end lg:justify-start">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border border-white/20 bg-black" />
                  ))}
                </div>
                <div className="text-3xl font-display font-bold">500+</div>
                <div className="text-[10px] text-brand-secondary uppercase tracking-wider">Teams Trusted</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mt-24 text-right lg:text-left"
              >
                <h4 className="text-sm font-bold mt-6">Continuous Innovation</h4>
                <div className="text-[10px] text-brand-secondary uppercase tracking-wider mt-2">v2.4 // Stable</div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* END SOLID CONTENT LAYER */}
        </div>
      </main>

      <footer id="contact" className="w-full border-t border-white/5 pt-20 pb-12 px-6 md:px-12 text-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
            {/* Branding Section */}
            <div className="flex flex-col gap-6 max-w-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                <span className="text-xl font-display font-bold">ManagerZero</span>
              </div>
              <p className="text-sm text-brand-secondary leading-relaxed">
                The AI Chief of Staff tool designed specifically for engineering managers.
              </p>
            </div>

            {/* Focused Contact Us Section */}
            <div className="flex flex-col gap-4 text-right">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-white">Contact Us</h5>
              <p className="text-sm text-brand-secondary leading-relaxed">
                Have questions or want to request a demo? <br />
                Reach out to us directly at:
              </p>
              <a 
                href="mailto:2004sankalp@gmail.com" 
                className="text-lg font-display font-bold hover:text-white transition-colors mt-2"
              >
                2004sankalp@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
            <div className="text-xs text-brand-secondary">
              © 2077 ManagerZero. All rights reserved.
            </div>
            <div className="flex gap-6 text-brand-secondary">
              <a href="#" className="hover:text-white transition-colors"><Zap className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><BarChart3 className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Cpu className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
