import { useEffect, useState } from 'react';
import InteractiveBackground from "@/components/animations/InteractiveBackground";
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useStore } from '../store/useStore';
import GlassShapes from "@/components/animations/GlassShapes";
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem
} from '../components/animations/AnimatedSection';
import { 
  ParticleField,
  ScrollIndicator 
} from '../components/ScrollProgress';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase, 
  Globe, 
  ArrowRight,
  Building2,
  Handshake,
  ChartLine,
  Newspaper,
  ChevronRight,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Navigation Component
const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Partners', id: 'partners' },
    { name: 'Services', id: 'services' },
    { name: 'Trends', id: 'trends' },
    { name: 'News', id: 'news' },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] py-3' 
          : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Handshake className="w-5 h-5 text-[var(--bg-primary)]" />
          </motion.div>
          <div>
            <span className="text-xl font-bold text-[var(--text-primary)]">Franchise</span>
            <span className="text-xl font-bold text-[var(--primary-color)]">It</span>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="relative px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {link.name}
              <motion.span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--primary-color)] rounded-full"
                whileHover={{ width: '60%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Dashboard
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.button 
                onClick={() => navigate('/login')}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm px-4 py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="btn-primary"
                >
                  Get Started
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  const stats = [
    { value: '10K+', label: 'Active Franchisees', icon: Users },
    { value: '2,500+', label: 'Franchise Brands', icon: Building2 },
    { value: '95%', label: 'Match Success Rate', icon: Target },
    { value: '₹500Cr+', label: 'Investment Facilitated', icon: ChartLine },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
        style={{ 
          background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
          filter: 'blur(60px)',
          y: springY1,
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15"
        style={{ 
          background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)',
          filter: 'blur(80px)',
          y: springY2,
        }}
      />
      
      {/* Particle Field */}
      <ParticleField count={25} className="opacity-50" />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
        style={{ opacity }}
      >
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
          style={{ 
            background: 'rgba(var(--primary-rgb), 0.1)',
            borderColor: 'rgba(var(--primary-rgb), 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4 text-[var(--primary-color)]" />
          <span className="text-sm text-[var(--primary-color)]">India&apos;s 1st Franchise Matching Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-[var(--text-primary)]">Connect.</span>{' '}
          <span className="text-[var(--text-primary)]">Match.</span>{' '}
          <span className="gradient-text">Grow.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          The intelligent platform that connects franchisees with the perfect franchisors. 
          Powered by AI-driven matching algorithms and comprehensive business analytics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-6 text-lg"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--card-bg)] px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={0.1}>
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="text-center p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: 'var(--primary-color)',
                  boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.2)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  <stat.icon className="w-6 h-6 text-[var(--primary-color)] mx-auto mb-3" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Scroll Indicator */}
        <div className="mt-16">
          <ScrollIndicator />
        </div>
      </motion.div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const features = [
    { icon: Target, title: 'AI-Powered Matching', description: 'Our advanced ML algorithms analyze over 50 data points to find your perfect franchise match.' },
    { icon: Shield, title: 'Verified Network', description: 'Every franchisee and franchisor undergoes rigorous verification for secure partnerships.' },
    { icon: ChartLine, title: 'Market Intelligence', description: 'Real-time market trends and analytics to make informed franchise decisions.' },
    { icon: Zap, title: 'End-to-End Support', description: 'From initial match to final agreement, we guide you through every step.' },
  ];

  const stats = [
    { value: '8+', label: 'Years Experience' },
    { value: '50+', label: 'Industry Sectors' },
    { value: '200+', label: 'Cities Covered' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slideLeft">
            <motion.span 
              className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              About Us
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-6">
              Building Bridges in the <span className="gradient-text">Franchise World</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-6">
              FranchiseIt is India&apos;s premier platform connecting ambitious franchisees with 
              established franchisors. We understand that finding the right franchise partner 
              is crucial for business success.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Our platform leverages cutting-edge technology and deep industry expertise to 
              create meaningful connections that drive growth and prosperity for both parties.
            </p>

            <StaggerContainer className="grid grid-cols-2 gap-6" staggerDelay={0.1}>
              {stats.map((item, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="border-l-2 border-[var(--primary-color)] pl-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{item.value}</div>
                    <div className="text-sm text-[var(--text-muted)]">{item.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6" staggerDelay={0.15}>
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <motion.div 
                  className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl h-full"
                  whileHover={{ 
                    scale: 1.03, 
                    borderColor: 'var(--primary-color)',
                    y: -5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <feature.icon className="w-6 h-6 text-[var(--primary-color)]" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

// Partners Section
const PartnersSection = () => {
  const partners = [
    { name: 'McDonald\'s', category: 'Food & Beverage' },
    { name: 'Subway', category: 'Quick Service' },
    { name: 'Domino\'s', category: 'Food Delivery' },
    { name: 'KFC', category: 'Fast Food' },
    { name: 'Pizza Hut', category: 'Restaurant' },
    { name: 'Baskin Robbins', category: 'Desserts' },
    { name: 'Amul', category: 'Dairy' },
    { name: 'Titan', category: 'Retail' },
  ];

  return (
    <section id="partners" className="py-24 relative">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
        style={{ 
          background: 'radial-gradient(ellipse, var(--primary-color) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">Top Partners</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Trusted by Industry <span className="gradient-text">Leaders</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
            We partner with some of the most recognized brands across various industries 
            to bring you the best franchise opportunities.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
          {partners.map((partner, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-center"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: 'var(--primary-color)',
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Building2 className="w-8 h-8 text-[var(--primary-color)]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{partner.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{partner.category}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="mt-12 text-center" delay={0.5}>
          <motion.button 
            className="inline-flex items-center gap-2 text-[var(--primary-color)]"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm">View all 2,500+ partners</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Services Section (What We Do)
const ServicesSection = () => {
  const services = [
    {
      icon: Briefcase,
      title: 'For Franchisees',
      description: 'Find the perfect franchise opportunity that matches your investment capacity, location preferences, and business goals.',
      features: ['Psychometric Assessment', 'Brand Preferences', 'Investment Matching', 'Location Analysis']
    },
    {
      icon: Building2,
      title: 'For Franchisors',
      description: 'Connect with qualified franchisees who align with your brand values and expansion strategy.',
      features: ['Qualified Leads', 'Profile Verification', 'Expansion Planning', 'Performance Tracking']
    },
    {
      icon: Globe,
      title: 'Market Insights',
      description: 'Access comprehensive market data and trends to make informed franchise decisions.',
      features: ['Industry Reports', 'Location Analytics', 'Competition Analysis', 'Growth Forecasting']
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Comprehensive <span className="gradient-text">Franchise Solutions</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
            Whether you are looking to start a franchise or expand your brand, 
            we provide end-to-end solutions for your success.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl h-full"
                whileHover={{ 
                  scale: 1.02, 
                  borderColor: 'var(--primary-color)',
                  y: -10,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--gradient-primary)' }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <service.icon className="w-7 h-7 text-[var(--bg-primary)]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{service.title}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, fIndex) => (
                    <motion.li 
                      key={fIndex} 
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: fIndex * 0.1 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--primary-color)]" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

// USP Section
const USPSection = () => {
  const usps = [
    { title: 'Smart Matching Algorithm', description: 'Our proprietary ML model analyzes 50+ parameters to ensure the highest compatibility between franchisees and franchisors.', stat: '95%', statLabel: 'Match Success' },
    { title: 'Verified Profiles Only', description: 'Every profile undergoes a rigorous 5-step verification process including background checks and financial validation.', stat: '100%', statLabel: 'Verified Users' },
    { title: 'End-to-End Support', description: 'From initial match to agreement signing, our experts guide you through legal, financial, and operational aspects.', stat: '24/7', statLabel: 'Expert Support' },
    { title: 'Market Intelligence', description: 'Access real-time data on market trends, competition analysis, and growth opportunities across 50+ industries.', stat: '50+', statLabel: 'Industries Covered' },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Our Unique <span className="gradient-text">Advantages</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 gap-8" staggerDelay={0.15}>
          {usps.map((usp, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl flex gap-6"
                whileHover={{ 
                  scale: 1.02, 
                  borderColor: 'var(--primary-color)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div 
                    className="w-20 h-20 rounded-xl flex flex-col items-center justify-center"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}
                  >
                    <span className="text-2xl font-bold text-[var(--primary-color)]">{usp.stat}</span>
                    <span className="text-xs text-[var(--text-muted)]">{usp.statLabel}</span>
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{usp.title}</h3>
                  <p className="text-[var(--text-secondary)]">{usp.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

// Market Trends Section
const TrendsSection = () => {
  const trends = [
    { title: 'QSR Sector Growth', value: '+23%', description: 'Quick Service Restaurants showing highest growth in Tier 2 & 3 cities', trend: 'up' },
    { title: 'Retail Franchise Expansion', value: '+18%', description: 'Retail franchises expanding rapidly with focus on omnichannel presence', trend: 'up' },
    { title: 'Education Sector', value: '+31%', description: 'Ed-tech and coaching centers seeing unprecedented demand', trend: 'up' },
    { title: 'Healthcare Services', value: '+15%', description: 'Diagnostic centers and pharmacy chains leading the growth', trend: 'up' },
  ];

  return (
    <section id="trends" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">Market Intelligence</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Latest <span className="gradient-text">Market Trends</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
            Stay ahead with real-time insights into the franchise industry&apos;s performance and growth patterns.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {trends.map((trend, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: 'var(--primary-color)',
                  y: -5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-6 h-6 text-[var(--primary-color)]" />
                  <motion.span 
                    className="text-2xl font-bold text-[var(--success-color)]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {trend.value}
                  </motion.span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{trend.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{trend.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="mt-12" delay={0.4}>
          <motion.div 
            className="p-8 rounded-2xl border"
            style={{ 
              background: 'rgba(var(--primary-rgb), 0.05)',
              borderColor: 'rgba(var(--primary-rgb), 0.2)',
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Get Detailed Market Reports</h3>
                <p className="text-[var(--text-secondary)]">Access comprehensive industry analysis and location-specific insights.</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="btn-primary whitespace-nowrap">
                  Download Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// News Section
const NewsSection = () => {
  const news = [
    { title: 'Franchise Industry to Reach $100B by 2025', excerpt: 'The Indian franchise sector is poised for exponential growth driven by digital transformation and expanding middle class.', date: 'Mar 10, 2024', category: 'Industry News' },
    { title: 'Top 10 Franchise Opportunities for 2024', excerpt: 'From food and beverage to education, discover the most promising franchise sectors this year.', date: 'Mar 8, 2024', category: 'Opportunities' },
    { title: 'How to Choose the Right Franchise Partner', excerpt: 'Expert tips on evaluating franchise opportunities and making informed investment decisions.', date: 'Mar 5, 2024', category: 'Guide' },
    { title: 'New Government Policies Boost Franchise Growth', excerpt: 'Recent regulatory changes are creating a more favorable environment for franchise businesses.', date: 'Mar 2, 2024', category: 'Policy' },
  ];

  return (
    <section id="news" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--primary-color)] text-sm font-medium tracking-wider uppercase">Latest Updates</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Top Business <span className="gradient-text">News</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {news.map((item, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl cursor-pointer h-full"
                whileHover={{ 
                  scale: 1.03, 
                  borderColor: 'var(--primary-color)',
                  y: -8,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.span 
                    className="px-3 py-1 text-[var(--primary-color)] text-xs rounded-full"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.category}
                  </motion.span>
                </div>
                <motion.h3 
                  className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                  whileHover={{ color: 'var(--primary-color)' }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{item.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Newspaper className="w-3 h-3" />
                  {item.date}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-16 border-t border-[var(--border-color)] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <motion.div 
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Handshake className="w-5 h-5 text-[var(--bg-primary)]" />
              </div>
              <div>
                <span className="text-xl font-bold text-[var(--text-primary)]">Franchise</span>
                <span className="text-xl font-bold text-[var(--primary-color)]">It</span>
              </div>
            </motion.div>
            <p className="text-[var(--text-secondary)] max-w-md mb-6">
              India&apos;s most trusted platform connecting franchisees with franchisors. 
              We make franchise partnerships simple, secure, and successful.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                <motion.button 
                  key={social} 
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--border-color)]"
                  whileHover={{ 
                    scale: 1.1, 
                    borderColor: 'var(--primary-color)',
                    background: 'rgba(var(--primary-rgb), 0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Globe className="w-5 h-5 text-[var(--text-muted)]" />
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'How It Works', 'Success Stories', 'Pricing', 'Contact'].map((link) => (
                <li key={link}>
                  <motion.button 
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">For Users</h4>
            <ul className="space-y-3">
              {[
                { label: 'Franchisee Signup', action: () => navigate('/signup') },
                { label: 'Franchisor Signup', action: () => navigate('/signup') },
                { label: 'Login', action: () => navigate('/login') },
                { label: 'Help Center', action: () => {} },
              ].map((link) => (
                <li key={link.label}>
                  <motion.button 
                    onClick={link.action}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © 2024 FranchiseIt. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <motion.button 
                key={link} 
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-sm"
                whileHover={{ y: -2 }}
              >
                {link}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <InteractiveBackground />
    
      <div className="relative z-10">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <PartnersSection />
      <ServicesSection />
      <USPSection />
      <TrendsSection />
      <NewsSection />
      <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
