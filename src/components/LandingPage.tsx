"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Check, TrendingUp, Shield, Eye, Zap, Send } from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible immediately without delay
    setIsVisible(true);
  }, []);

  const tabs = [
    {
      title: "AI Studio",
      content: "Design and generate high-quality AI content including voice, audio, and automated workflows."
    },
    {
      title: "Conversational Agents",
      content: "Deploy intelligent agents that understand, respond, and act in real-time across multiple channels."
    },
    {
      title: "Developer API",
      content: "Integrate powerful AI capabilities into your applications with flexible and scalable APIs."
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Reliability",
      description: "Ensure consistent performance with enterprise-grade infrastructure."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security",
      description: "Protect your data with advanced encryption and strict access control."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Transparency",
      description: "Understand how your AI systems behave with detailed insights."
    }
  ];

  const chatMessages = [
    { text: "Can you help me with my order?", sender: "user" },
    { text: "Sure. Could you share your order ID?", sender: "ai" },
    { text: "It's #A12893", sender: "user" },
    { text: "Got it. Your request has been processed.", sender: "ai" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">RevAI</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Platform</a>
              <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
              <a href="#developers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Developers</a>
              <a href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Resources</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <a href="#contact" className="hidden sm:block text-sm font-medium text-foreground hover:text-accent transition-colors px-4 py-2">
                Contact sales
              </a>
              <a href="/login" className="text-sm font-semibold bg-accent text-accent-foreground px-5 py-2 rounded-lg hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20">
                Get started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className={`space-y-8 transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-tight">
                Build intelligent systems that feel{" "}
                <span className="text-accent">human</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Create, deploy, and scale AI-powered experiences across voice, chat, and automation. Designed for developers and enterprises.
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <a href="/login" className="group inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold text-base hover:bg-accent/90 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
                  Start building
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border border-border hover:bg-muted transition-all">
                  Talk to sales
                </a>
              </div>
            </div>

            {/* Right: Animated Sphere */}
            <div className="relative h-[500px] flex items-center justify-center z-0">
              <AnimatedSphere />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tabs Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Tabs */}
            <div className="lg:w-1/3 space-y-2">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                    activeTab === index
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="lg:w-2/3 bg-card border border-border rounded-2xl p-8 lg:p-12">
              <div
                key={activeTab}
                className="animate-fade-in"
              >
                <h3 className="text-3xl font-bold mb-4">{tabs[activeTab].title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {tabs[activeTab].content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-center">
            One platform. Endless possibilities.
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From content generation to real-time automation, build systems that operate at scale with reliability and speed.
              </p>
            </div>

            <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6">Live System Overview</h3>
              <div className="space-y-4">
                <MetricRow label="Requests processed" value="1.2M+" />
                <MetricRow label="Avg latency" value="120ms" />
                <MetricRow label="Success rate" value="98.7%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversational Demo Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI that communicates naturally
            </h2>
            <p className="text-xl text-muted-foreground">
              Enable human-like conversations across chat, voice, and messaging platforms.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  text={msg.text}
                  sender={msg.sender}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Measure and optimize performance
            </h2>
            <p className="text-xl text-muted-foreground">
              Track engagement, accuracy, and system performance in real time.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success rate</p>
                <p className="text-4xl font-bold">96.4%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <AnalyticsChart />
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-center">
            Built with trust and control
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            Start building the future with AI
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border border-border hover:bg-muted transition-all">
              Contact sales
            </a>
            <a href="/login" className="group inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold text-base hover:bg-accent/90 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
              Create your account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 bg-muted rounded-full">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Us
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Get in touch with our team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question or want to collaborate? Share your details and our team will reach out to you shortly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 RevAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Animated Sphere Component
function AnimatedSphere() {
  return (
    <div className="relative w-[400px] h-[400px] z-0">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[450px] h-[450px] bg-accent/20 rounded-full sphere-glow" />
      </div>

      {/* Main Sphere */}
      <div className="relative w-full h-full sphere-container z-0">
        <div className="absolute inset-0 sphere-rotate">
          <div className="absolute inset-0 sphere-blob overflow-hidden rounded-full">
            <div className="absolute inset-0 energy-layer-1" />
            <div className="absolute inset-0 energy-layer-2" />
            <div className="absolute inset-0 energy-layer-3" />
            <div className="absolute inset-0 bg-gradient-radial from-accent/80 via-accent/60 to-accent/20" />
            <div className="absolute inset-[30px] rounded-full bg-gradient-radial from-white/20 to-transparent inner-energy" />
            <div className="absolute inset-0 light-gloss" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 w-[200%] h-[200%] shimmer-effect" />
            </div>
            <div
              className="absolute inset-0 opacity-15 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_-15px_-15px_50px_rgba(0,0,0,0.6),inset_15px_15px_50px_rgba(255,255,255,0.15)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Row Component
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}

// Chat Bubble Component
function ChatBubble({ text, sender, delay }: { text: string; sender: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl ${
          sender === 'user'
            ? 'bg-accent text-accent-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <div
      className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Analytics Chart Component
function AnalyticsChart() {
  return (
    <div className="h-48 flex items-end gap-2">
      {[65, 72, 68, 80, 75, 85, 82, 90, 88, 96].map((height, index) => (
        <div
          key={index}
          className="flex-1 bg-accent/20 rounded-t-lg animate-chart-grow"
          style={{
            height: `${height}%`,
            animationDelay: `${index * 100}ms`
          }}
        />
      ))}
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    email: "",
    department: "",
    message: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            placeholder="Doe"
            required
          />
        </div>
      </div>

      {/* Row 2: Company Name & Job Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-muted-foreground">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            placeholder="Acme Inc."
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-muted-foreground">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            placeholder="Product Manager"
            required
          />
        </div>
      </div>

      {/* Row 3: Work Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
          Work Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
          placeholder="john.doe@company.com"
          required
        />
      </div>

      {/* Row 4: Dropdown */}
      <div className="space-y-2">
        <label htmlFor="department" className="block text-sm font-medium text-muted-foreground">
          Who are you trying to reach?
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 appearance-none cursor-pointer"
          required
        >
          <option value="">Select an option</option>
          <option value="sales">Sales Team</option>
          <option value="support">Customer Support</option>
          <option value="partnerships">Partnerships</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      {/* Row 5: Textarea */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">
          Tell us more about your inquiry
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-3.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none"
          placeholder="Type your message here..."
          required
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="mt-1 w-5 h-5 rounded border-border bg-input text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer"
          required
        />
        <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground leading-relaxed">
          I agree to receive communications and understand my data will be handled according to the{" "}
          <a href="#" className="text-accent hover:text-accent/80 underline">
            privacy policy
          </a>
          .
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="group w-full md:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
      >
        Submit
        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </form>
  );
}
