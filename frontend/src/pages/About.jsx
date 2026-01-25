import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandshake, FaLeaf, FaChartLine, FaArrowRight, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
  const values = [
    {
      icon: <FaUsers size={32} />,
      title: 'Community First',
      description: 'We prioritize the well-being of farmers and consumers, building a sustainable agricultural community.',
      color: 'from-[var(--primary-400)] to-[var(--primary-600)]'
    },
    {
      icon: <FaHandshake size={32} />,
      title: 'Transparency',
      description: 'Every transaction is transparent. You know exactly where your money goes and who grows your food.',
      color: 'from-[var(--secondary-400)] to-[var(--secondary-600)]'
    },
    {
      icon: <FaLeaf size={32} />,
      title: 'Sustainability',
      description: 'We promote sustainable farming practices that protect the environment for future generations.',
      color: 'from-[var(--accent-400)] to-[var(--accent-600)]'
    },
    {
      icon: <FaChartLine size={32} />,
      title: 'Growth',
      description: 'Supporting local farmers helps grow the agricultural economy and creates opportunities for all.',
      color: 'from-[var(--info)] to-[var(--primary-600)]'
    }
  ];

  const team = [
    {
      name: 'Ndongmo W.',
      role: 'Founder & Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Visionary entrepreneur passionate about using technology to solve agricultural challenges in Cameroon.'
    },
    {
      name: 'Sarah M.',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Dedicated to building strong relationships between farmers and consumers in our network.'
    },
    {
      name: 'David K.',
      role: 'Agricultural Expert',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Agronomist with 15 years of experience helping farmers improve their sustainable practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=900&fit=crop"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
            Cultivating <span className="text-[var(--accent-400)]">Connections</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 leading-relaxed font-light"
          >
            Bridging the gap between dedicated local farmers and conscious consumers for a sustainable agricultural future in Cameroon.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-sm font-semibold mb-6">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              Empowering Farmers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)]">
                Delivering Freshness
              </span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
              AgriConnect was founded to eliminate the barriers between producers and consumers. By cutting out middlemen, we ensure that:
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Farmers receive fair compensation for their hard work',
                'Consumers get access to fresh, high-quality local produce',
                'Communities thrive through sustainable economic growth',
                'Food supply chains become transparent and traceable'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[var(--success-light)] flex items-center justify-center text-[var(--success)] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[var(--text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-[var(--primary-600)] font-bold hover:gap-4 transition-all group">
              Read our full story <FaArrowRight className="group-hover:text-[var(--accent-500)] transition-colors" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-500)] to-[var(--accent-500)] rounded-3xl transform rotate-3 opacity-20" />
            <img
              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&h=1000&fit=crop"
              alt="Farmer showing produce"
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
              <p className="text-[var(--primary-600)] font-bold text-4xl mb-1">5,000+</p>
              <p className="text-[var(--text-secondary)]">Farmers impacted across the region since 2024</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--secondary-50)] text-[var(--secondary-600)] text-sm font-semibold mb-4">
              Our Core Values
            </span>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Our principles guide every decision we make and every interaction we have within our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-[var(--bg-secondary)] p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[var(--border-light)] group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{value.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] text-sm font-semibold mb-4">
              Meet The Team
            </span>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              The Minds Behind AgriConnect
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              A passionate team of innovators, agricultural experts, and community builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <div className="flex gap-4 text-white">
                      <FaTwitter className="hover:text-[var(--accent-400)] cursor-pointer transition-colors" size={20} />
                      <FaLinkedin className="hover:text-[var(--accent-400)] cursor-pointer transition-colors" size={20} />
                      <FaGithub className="hover:text-[var(--accent-400)] cursor-pointer transition-colors" size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center transform -translate-y-4 bg-white mx-4 rounded-xl shadow-md relative z-10">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-[var(--primary-500)] mb-3 uppercase tracking-wider">{member.role}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--primary-900)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-500)] rounded-full filter blur-[100px] opacity-20 animate-pulse" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Agricultural Experience?
          </h2>
          <p className="text-xl text-[var(--primary-100)] mb-10 max-w-2xl mx-auto">
            Join thousands of farmers and consumers already benefiting from a transparent, fair, and connected marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-xl bg-[var(--accent-500)] text-[var(--primary-900)] font-bold text-lg hover:bg-[var(--accent-400)] shadow-lg hover:shadow-[var(--accent-500)]/50 transition-all transform hover:-translate-y-1">
              Join as a Consumer
            </button>
            <button className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
