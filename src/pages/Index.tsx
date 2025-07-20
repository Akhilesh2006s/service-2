
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Briefcase, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-600">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              TalentFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            ✨ The Future of Talent Management
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              Connect Talent
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Build Success
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary platform connecting world-class organizations with exceptional talent. 
            Streamline hiring, accelerate growth, and build the future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 px-8 py-4 text-lg">
                Start Hiring Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                Find Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "50K+", label: "Active Professionals" },
              { icon: Briefcase, number: "10K+", label: "Projects Posted" },
              { icon: TrendingUp, number: "98%", label: "Success Rate" },
              { icon: Star, number: "4.9/5", label: "Client Rating" }
            ].map((stat, index) => (
              <Card key={index} className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
              Why Choose TalentFlow?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of talent management with cutting-edge features designed for success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Matching",
                description: "AI-powered algorithms match the perfect talent with your project requirements.",
                icon: "🤖"
              },
              {
                title: "Instant Communication",
                description: "Real-time messaging and collaboration tools keep everyone connected.",
                icon: "💬"
              },
              {
                title: "Secure Payments",
                description: "Protected transactions with milestone-based payment systems.",
                icon: "🔒"
              },
              {
                title: "Global Reach",
                description: "Access talent from around the world, 24/7 availability.",
                icon: "🌍"
              },
              {
                title: "Quality Assurance",
                description: "Verified professionals with ratings and portfolio reviews.",
                icon: "⭐"
              },
              {
                title: "Project Management",
                description: "Built-in tools to track progress and manage deliverables.",
                icon: "📊"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-black/80 to-gray-900/80 border-yellow-500/20 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-yellow-400">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CTO, TechCorp",
                content: "TalentFlow revolutionized our hiring process. We found exceptional developers in days, not months."
              },
              {
                name: "Mike Chen",
                role: "Freelance Designer",
                content: "The platform connected me with amazing clients. The project management tools make collaboration seamless."
              },
              {
                name: "Emma Davis",
                role: "Startup Founder",
                content: "As a startup, we needed top talent fast. TalentFlow delivered exactly what we needed within our budget."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-yellow-400">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of successful organizations and talented professionals already using TalentFlow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 px-8 py-4 text-lg">
                    Get Started Today
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-yellow-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-black font-bold" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  TalentFlow
                </span>
              </div>
              <p className="text-gray-400">
                Connecting exceptional talent with visionary organizations worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-4">For Organizations</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Post Projects</li>
                <li>Find Talent</li>
                <li>Manage Teams</li>
                <li>Track Progress</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-4">For Professionals</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Find Work</li>
                <li>Build Portfolio</li>
                <li>Get Paid</li>
                <li>Grow Network</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-yellow-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TalentFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
