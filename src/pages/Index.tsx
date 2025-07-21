import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Globe,
  GraduationCap,
  Users,
  Bell,
  MapPin,
  BookOpen,
  Group,
  Circle,
} from 'lucide-react';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';

const navLinks = [
  { name: "Projects", href: "#" },
  { name: "Workspaces", href: "#" },
  { name: "Teams", href: "#" },
  { name: "Stories", href: "#" },
  { name: "Our Team", href: "#" },
];

const features = [
  {
    icon: <Globe className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Global Reach
    title: "Global Reach",
    desc: "Destinations across continents for diverse learning experiences",
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Academic Excellence
    title: "Academic Excellence",
    desc: "Rigorous educational programs designed by university experts",
  },
  {
    icon: <Users className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Community
    title: "Community",
    desc: "Connect with like-minded learners from around the world",
  },
];

const whatToExpect = [
  {
    icon: <MapPin className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Curated Destinations
    title: "Curated Destinations",
    desc: "Carefully selected locations that offer rich educational opportunities and cultural immersion. Each destination is chosen for its unique learning potential and cultural significance.",
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Expert Guidance
    title: "Expert Guidance",
    desc: "Programs led by academic professionals and local experts who provide context, insights, and mentorship throughout your educational journey.",
  },
  {
    icon: <Group className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Global Community
    title: "Global Community",
    desc: "Connect with learners and educators from diverse backgrounds, creating a global network of like-minded individuals passionate about experiential education.",
  },
  {
    icon: <BookOpen className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_16px_#ffe25a99]" />, // Cultural Immersion
    title: "Cultural Immersion",
    desc: "Deep, meaningful engagement with local cultures and communities that transforms theoretical knowledge into practical understanding and personal growth.",
  },
];

const timeline = [
  {
    icon: <Circle className="w-8 h-8 text-inka-yellow" />, // Platform Development
    title: "Platform Development",
    desc: "Building the foundation for transformative learning experiences",
    badge: { text: "Complete", color: "bg-green-600" },
  },
  {
    icon: <Circle className="w-8 h-8 text-inka-yellow" />, // Program Curation
    title: "Program Curation",
    desc: "Designing educational travel experiences with academic partners",
    badge: { text: "In Progress", color: "bg-inka-yellow text-black" },
  },
  {
    icon: <Circle className="w-8 h-8 text-gray-700" />, // Beta Launch
    title: "Beta Launch",
    desc: "Limited release to early subscribers and university partners",
    badge: { text: "Coming Soon", color: "bg-blue-900 text-blue-200" },
  },
  {
    icon: <Circle className="w-8 h-8 text-gray-700" />, // Global Launch
    title: "Global Launch",
    desc: "Full platform release with comprehensive program offerings",
    badge: { text: "2025", color: "bg-gray-800 text-gray-300" },
  },
];

const Index = () => {
  return (
    <div className="min-h-screen font-sans text-inka-text" style={{ background: '#04051f' }}>
      {/* Header */}
      <header className="w-full px-12 py-4 flex items-center justify-between sticky top-0 z-20 bg-transparent">
        <div className="flex items-center gap-10">
          <span className="text-2xl font-bold" style={{ color: '#ffe066' }}>Inkaranya</span>
          <nav className="flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#bfc2d5] hover:text-inka-yellow font-medium transition-colors"
                style={{ fontWeight: 500 }}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#bfc2d5] text-sm"><span className="text-lg">🌐</span> English</span>
          <span className="text-xl text-[#bfc2d5] cursor-pointer">🌙</span>
          <Link to="/auth">
            <Button className="bg-inka-yellow hover:bg-inka-yellowHover text-black font-semibold px-5 py-2 rounded-md shadow-none">Start a Project</Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="border-inka-yellow text-inka-yellow bg-white hover:bg-inka-yellow hover:text-black font-semibold px-5 py-2 rounded-md shadow-none">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden">
        {/* Gold radial glow background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] z-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(255,224,102,0.12) 0%, transparent 100%)",
            filter: "blur(0px)",
          }}
        />
        {/* Content */}
        <span className="inline-block mb-6 px-6 py-2 rounded-full border border-inka-yellow bg-inka-yellow/10 text-inka-yellow font-semibold text-lg font-sans">✨ Coming Soon</span>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif text-white">
          The first <span className="text-inka-yellow">global platform</span><br />for experiential learning
        </h1>
        <div className="text-lg md:text-xl text-inka-textSecondary mb-2 font-sans">
          An Initiative By <span className="text-inka-yellow font-semibold">School of Liberal Arts, Bennett University</span>
        </div>
        <p className="text-lg text-inka-textSecondary max-w-2xl mx-auto mb-10 font-sans">
          Transforming education through immersive travel experiences that bridge academic knowledge with real-world discovery.
        </p>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto justify-center relative z-10">
          {features.map((f, i) => (
            <div key={i} className="flex-1 rounded-xl p-8 flex flex-col items-center shadow-lg relative overflow-hidden bg-[rgba(20,20,30,0.8)] border border-[rgba(255,224,102,0.18)]" style={{boxShadow:'0 4px 32px 0 rgba(0,0,0,0.18)'}}>
              {f.icon}
              <div className="text-xl font-bold text-inka-yellow mb-2 font-serif">{f.title}</div>
              <div className="text-inka-textSecondary text-center font-sans">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Email Notification Card */}
      <section className="py-20 px-4 flex justify-center items-center">
        <Card className="w-full max-w-2xl border border-[rgba(255,224,102,0.18)] rounded-xl p-10 flex flex-col items-center text-center shadow-lg relative overflow-hidden bg-[rgba(20,20,30,0.8)]" style={{boxShadow:'0 4px 32px 0 rgba(0,0,0,0.18)'}}>
          <Bell className="w-10 h-10 text-inka-yellow drop-shadow-[0_0_32px_#ffe25a99] mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif text-inka-yellow">Be the First to Know</h2>
          <p className="text-inka-textSecondary mb-6">Get notified when we launch and be among the first to experience transformative learning through travel.</p>
          <form className="flex w-full max-w-md mx-auto gap-2 mb-2">
            <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-l-md bg-inka-bg2 border border-inka-yellow/30 text-white focus:outline-none" />
            <button type="submit" className="bg-inka-yellow hover:bg-inka-yellowHover text-black font-semibold px-6 py-3 rounded-r-md">Notify Me →</button>
          </form>
          <div className="text-xs text-inka-textSecondary">We respect your privacy. No spam, just launch updates and early access opportunities.</div>
        </Card>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-inka-yellow text-center mb-4 font-serif">What to Expect</h2>
          <p className="text-inka-textSecondary text-center mb-12 max-w-2xl mx-auto">
            A revolutionary approach to education that takes learning beyond the classroom
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatToExpect.map((item, i) => (
              <div key={i} className="border border-[rgba(255,224,102,0.18)] rounded-xl p-8 flex flex-col items-center shadow-lg relative overflow-hidden bg-[rgba(20,20,30,0.8)]" style={{boxShadow:'0 4px 32px 0 rgba(0,0,0,0.18)'}}>
                {item.icon}
                <div className="text-xl font-bold text-inka-yellow mb-2 font-serif">{item.title}</div>
                <div className="text-inka-textSecondary text-center font-sans">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-inka-yellow text-center mb-4 font-serif">Launch Timeline</h2>
          <p className="text-inka-textSecondary text-center mb-12 max-w-2xl mx-auto">
            Our journey to revolutionize educational experiences
          </p>
          <div className="flex flex-col gap-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-6 border border-[rgba(255,224,102,0.18)] rounded-xl p-6 shadow-lg relative overflow-hidden bg-[rgba(20,20,30,0.8)]" style={{boxShadow:'0 4px 32px 0 rgba(0,0,0,0.18)'}}>
                {item.icon}
                <div className="flex-1">
                  <div className="text-lg font-bold text-inka-yellow mb-1 font-serif">{item.title}</div>
                  <div className="text-inka-textSecondary text-sm font-sans">{item.desc}</div>
                </div>
                <span className={`ml-auto px-4 py-1 rounded-full text-xs font-semibold ${item.badge.color}`}>{item.badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#22223a] py-12 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-bold text-inka-yellow mb-2 font-serif">Inkaranya</div>
          <div className="text-white mb-2">The first global platform for experiential learning</div>
          <div className="text-inka-textSecondary mb-2">An Initiative By School of Liberal Arts, Bennett University</div>
          <div className="text-inka-textSecondary mb-2 flex flex-col md:flex-row gap-2 justify-center items-center">
            <span>info@inkaranya.com</span>
            <span className="hidden md:inline mx-2">|</span>
            <span>Bennett University</span>
          </div>
          <hr className="my-6 border-inka-yellow/20" />
          <div className="text-inka-textSecondary text-xs">© 2025 Inkaranya. All rights reserved. | Transforming education through experiential learning.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
