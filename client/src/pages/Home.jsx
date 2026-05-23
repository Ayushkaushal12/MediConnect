import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Shield, Users, Clock } from 'lucide-react';
import Button from '../components/UI/Button';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      title: "Smart Scheduling",
      description: "Book appointments instantly with our intelligent scheduling system that respects everyone's time."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Secure Health Records",
      description: "Your medical history is encrypted and securely stored. Access your prescriptions anytime, anywhere."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Expert Doctors",
      description: "Connect with certified specialists across various fields for the best medical care possible."
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "24/7 Availability",
      description: "Emergency care and support available round the clock. Health doesn't wait, neither do we."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Experience the future of medical care with our streamlined appointment platform. 
              Connect with top doctors, manage your prescriptions, and take control of your health journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto group">
                Book Appointment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a href="#features" className="w-full sm:w-auto">
                   <Button size="lg" variant="outline" className="w-full">
                    Learn More
                  </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MediConnect?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide a comprehensive healthcare management ecosystem designed for efficiency and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
              >
                <div className="mb-4 p-3 rounded-lg bg-blue-500/10 w-fit group-hover:bg-blue-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">10k+</div>
              <div className="text-gray-500 text-sm">Active Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-500 text-sm">Certified Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">98%</div>
              <div className="text-gray-500 text-sm">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-500 text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Contact Placeholder */}
      <section id="about" className="py-24 bg-white/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied patients and doctors who trust our platform for their healthcare needs.
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>Create Account Today</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
