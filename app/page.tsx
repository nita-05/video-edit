'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Upload, Sparkles, Download, Mail, Star, Zap, Video, Clock, Users, Award, Menu, X } from 'lucide-react'
import PaymentModal from '../components/PaymentModal'
import ContactSalesModal from '../components/ContactSalesModal'
import FooterModal from '../components/FooterModal'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    plan: any;
  }>({
    isOpen: false,
    plan: null
  });

  const [contactSalesModal, setContactSalesModal] = useState(false);
  const [footerModal, setFooterModal] = useState<{
    isOpen: boolean;
    content: string;
    title: string;
  }>({
    isOpen: false,
    content: '',
    title: ''
  });

  const handlePlanClick = (plan: string) => {
    if (plan === 'Professional') {
      const professionalPlan = {
        name: 'Professional',
        price: '$29',
        period: 'month',
        description: 'For content creators and professionals',
        features: [
          'Unlimited videos',
          'All AI features',
          '4K export',
          'Priority support',
          'Team collaboration'
        ],
        buttonText: 'Start Free Trial',
        popular: true
      };
      setPaymentModal({ isOpen: true, plan: professionalPlan });
    } else if (plan === 'Starter') {
      window.location.href = '/auth';
    } else if (plan === 'Enterprise') {
      setContactSalesModal(true);
    }
  };

  const handleFooterLink = (link: string) => {
    if (link === 'Pricing') {
      const element = document.getElementById('pricing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (link === 'Contact Us') {
      setContactSalesModal(true);
    } else {
      setFooterModal({
        isOpen: true,
        title: link,
        content: `This is the ${link} page content. More information about ${link} will be available soon.`
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace(/\s+/g, '-').toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">V</span>
              </div>
              <span className="text-white font-bold text-xl lg:text-2xl">VEDIT</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how it works')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('templates')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Templates
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              {/* Desktop Sign In Button */}
              <button 
                onClick={() => window.location.href = '/auth'}
                className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Sign In
              </button>
              
              {/* Mobile Sign In Button */}
              <button 
                onClick={() => window.location.href = '/auth'}
                className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm"
              >
                Sign In
              </button>
            </div>
        </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 bg-gray-900 border-b border-gray-700 z-40 md:hidden"
        >
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => {
                scrollToSection('features');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
            >
              Features
            </button>
            <button 
              onClick={() => {
                scrollToSection('how it works');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
            >
              How it Works
            </button>
            <button 
              onClick={() => {
                scrollToSection('pricing');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
            >
              Pricing
            </button>
            <button 
              onClick={() => {
                scrollToSection('templates');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
            >
              Templates
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight"
          >
            AI-Powered
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Video Editing
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto px-4"
          >
            Transform your raw footage into professional-quality videos 10x faster with our intelligent AI editor
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
            >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Start Editing Free</span>
            </button>
            <button 
              onClick={() => scrollToSection('see it in action')}
              className="border border-gray-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>See it in Action</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">Powerful AI Features</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300">Everything you need to create professional videos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Smart Auto-Cut",
                description: "AI automatically removes dead time and boring parts from your videos",
                backgroundImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Intelligent Filters",
                description: "Apply professional-grade filters and color correction with one click",
                backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: "Text & Subtitles",
                description: "Generate and add captions, titles, and text overlays automatically",
                backgroundImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Voice Commands",
                description: "Control your editing with natural voice commands",
                backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Work together with your team in real-time",
                backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Export Anywhere",
                description: "Export in any format for any platform",
                backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `url(${feature.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">Get started in minutes, not hours</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Video",
                description: "Drag and drop your video file or record directly in the browser",
                backgroundVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              },
              {
                step: "02", 
                title: "AI Analyzes Content",
                description: "Our AI automatically detects scenes, faces, and key moments",
                backgroundVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              },
              {
                step: "03",
                title: "Apply AI Suggestions",
                description: "Choose from smart suggestions or use voice commands to edit",
                backgroundVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group"
              >
                {/* Background Video */}
                <video
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  <source src={step.backgroundVideo} type="video/mp4" />
                </video>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Video Templates</h2>
            <p className="text-xl text-gray-300">Ready-to-use templates for every occasion</p>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Social Media",
                description: "TikTok, Instagram, YouTube Shorts templates",
                icon: <Video className="w-8 h-8" />,
                count: "50+ Templates",
                backgroundImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                title: "Business",
                description: "Corporate presentations, product demos",
                icon: <Award className="w-8 h-8" />,
                count: "30+ Templates",
                backgroundImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                title: "Creative",
                description: "Artistic intros, transitions, effects",
                icon: <Sparkles className="w-8 h-8" />,
                count: "40+ Templates",
                backgroundImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              }
            ].map((template, index) => (
                      <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 text-center overflow-hidden group h-full min-h-[300px]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `url(${template.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="text-purple-400 mb-4 flex justify-center">{template.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{template.title}</h3>
                  <p className="text-gray-300 mb-4">{template.description}</p>
                  <span className="text-purple-400 font-medium">{template.count}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
        </div>
      </section>

      {/* Professional Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
                <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 mb-6"
            >
              <Award className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-300 font-medium">Professional Features</span>
                        </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Professionals</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered tools designed for content creators, agencies, and businesses who demand the highest quality video production.
            </p>
                  </div>
                  
          {/* All Professional Features in One Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: "Multi-Track Timeline",
                description: "Professional-grade timeline with unlimited tracks, keyframes, and advanced editing controls.",
                backgroundImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Voice Cloning",
                description: "Create personalized voiceovers with our advanced AI voice cloning technology.",
                backgroundImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Auto Publishing",
                description: "Schedule and publish across all major platforms with intelligent optimization.",
                backgroundImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Real-time collaboration tools for teams with role-based permissions and version control.",
                backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "SOC 2 compliant with end-to-end encryption and advanced security protocols.",
                backgroundImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "API Integration",
                description: "Powerful REST API and webhooks for seamless integration with your existing workflow.",
                backgroundImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Priority Support",
                description: "24/7 dedicated support with dedicated account managers and priority response times.",
                backgroundImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
              }
            ].map((feature, index) => (
                      <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group h-full min-h-[280px]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `url(${feature.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-purple-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed flex-grow">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
              </div>

          {/* CTA Section */}
              <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Go Professional?
              </h3>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust VEDIT for their video production needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handlePlanClick('Professional')}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Star className="w-5 h-5" />
                  <span>Start Free Trial</span>
                </button>
                <button
                  onClick={() => setContactSalesModal(true)}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Sales</span>
                </button>
                  </div>
                </div>
              </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for getting started",
                features: ["5 videos per month", "Basic AI features", "HD export", "Community support"],
                buttonText: "Get Started",
                popular: false
              },
              {
                name: "Professional",
                price: "$29",
                description: "For content creators and professionals",
                features: ["Unlimited videos", "All AI features", "4K export", "Priority support", "Team collaboration"],
                buttonText: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large teams and organizations",
                features: ["Everything in Professional", "Custom integrations", "Dedicated support", "Advanced analytics", "White-label options"],
                buttonText: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-gray-800/50 rounded-xl p-8 border ${
                  plan.popular ? 'border-blue-500' : 'border-gray-700'
                } hover:border-blue-500/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                  <div className="text-5xl font-bold text-white mb-3 leading-tight">{plan.price}</div>
                  <p className="text-gray-300 text-base leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-8 text-left">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-300 justify-start">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                </div>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full py-4 rounded-lg font-semibold text-base transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                      : 'border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">V</span>
                </div>
                  <span className="text-white font-bold text-2xl">VEDIT</span>
          </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  The future of video editing is here. Create professional videos with AI-powered tools that make editing effortless.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  {[
                    { name: 'Twitter', icon: '𝕏', color: 'hover:text-blue-400' },
                    { name: 'LinkedIn', icon: 'in', color: 'hover:text-blue-500' },
                    { name: 'YouTube', icon: '▶', color: 'hover:text-red-500' },
                    { name: 'GitHub', icon: '⚡', color: 'hover:text-gray-300' }
                  ].map((social) => (
                    <button
                      key={social.name}
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700 hover:scale-110`}
                      title={social.name}
                    >
                      <span className="text-sm font-semibold">{social.icon}</span>
                    </button>
            ))}
          </div>
        </div>

              {/* Product Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6">Product</h3>
                <ul className="space-y-4">
                  {[
                    { name: 'Features', desc: 'AI-powered editing tools' },
                    { name: 'Pricing', desc: 'Flexible plans for everyone' },
                    { name: 'Templates', desc: 'Ready-to-use designs' },
                    { name: 'API', desc: 'Developer resources' }
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleFooterLink(item.name)}
                        className="group text-left"
                      >
                        <div className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {item.name}
        </div>
                        <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300 whitespace-nowrap">
                          {item.desc}
        </div>
                      </button>
                    </li>
                  ))}
                </ul>
            </div>
            
              {/* Support Links */}
            <div>
                <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                <ul className="space-y-4">
                  {[
                    { name: 'Help Center', desc: 'Documentation & guides' },
                    { name: 'Contact Us', desc: 'Get in touch with us' },
                    { name: 'Community', desc: 'Join our community' },
                    { name: 'Status', desc: 'System status page' }
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleFooterLink(item.name)}
                        className="group text-left"
                      >
                        <div className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {item.name}
                        </div>
                        <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300 whitespace-nowrap">
                          {item.desc}
                        </div>
                      </button>
                  </li>
                ))}
              </ul>
            </div>
            
              {/* Company Links */}
            <div>
                <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                <ul className="space-y-4">
                  {[
                    { name: 'About Us', desc: 'Our story & mission' },
                    { name: 'Careers', desc: 'Join our team' },
                    { name: 'Blog', desc: 'Latest news & updates' },
                    { name: 'Press', desc: 'Media resources' }
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleFooterLink(item.name)}
                        className="group text-left"
                      >
                        <div className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {item.name}
                        </div>
                        <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300 whitespace-nowrap">
                          {item.desc}
                        </div>
                      </button>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="py-12 border-t border-gray-700/50">
            <div className="max-w-3xl mx-auto text-center px-4">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-8 text-sm">
                Get the latest updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="py-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 VEDIT. All rights reserved. Made with ❤️ for creators worldwide.
              </div>
              
              <div className="flex space-x-6">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleFooterLink(item)}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, plan: null })}
        plan={paymentModal.plan}
      />
      
      <ContactSalesModal
        isOpen={contactSalesModal}
        onClose={() => setContactSalesModal(false)}
      />
      
      <FooterModal
        isOpen={footerModal.isOpen}
        onClose={() => setFooterModal({ isOpen: false, content: '', title: '' })}
        title={footerModal.title}
        content={footerModal.content}
      />
    </div>
  );
}