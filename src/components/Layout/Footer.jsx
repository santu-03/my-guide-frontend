import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Check
} from "lucide-react";
import Button from "@/components/ui/Button";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const currentYear = new Date().getFullYear();

  const footerSections = {
    Explore: [
      { label: "Destinations", href: "/search?type=place" },
      { label: "Activities", href: "/search?type=activity" },
      { label: "Food & Drink Tours", href: "/search?category=food" },
      { label: "Cultural Experiences", href: "/search?category=culture" },
      { label: "Adventure Tours", href: "/search?category=adventure" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Partnerships", href: "/partnerships" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Safety Guidelines", href: "/safety" },
      { label: "Booking Terms", href: "/terms/booking" },
      { label: "Cancellation Policy", href: "/cancellation" },
    ],
    "For Partners": [
      { label: "Become a Guide", href: "/auth/signup" },
      { label: "Partner Dashboard", href: "/auth/signup" },
      { label: "Marketing Resources", href: "/partners/resources" },
      { label: "API Documentation", href: "/developers" },
    ]
  };

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/myguide", 
      label: "Follow us on Facebook",
      color: "hover:text-blue-500"
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/myguide", 
      label: "Follow us on Twitter",
      color: "hover:text-sky-500"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/myguide", 
      label: "Follow us on Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/myguide", 
      label: "Follow us on LinkedIn",
      color: "hover:text-blue-600"
    },
    { 
      icon: Youtube, 
      href: "https://youtube.com/myguide", 
      label: "Subscribe to our YouTube channel",
      color: "hover:text-red-500"
    },
  ];

  const contactInfo = [
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: Mail, text: "hello@myguide.com", href: "mailto:contact@myguide.com" },
    { icon: MapPin, text: "San Francisco, CA", href: "https://maps.google.com/?q=San Francisco, CA" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail("");
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
      
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white-900 to-white text-black-300" role="contentinfo">
      
      {/* Newsletter Section */}
      

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg group-hover:scale-105 transition-transform">
                TG
              </div>
              <span className="font-bold text-2xl text-white">MyGuide</span> */}
              <img
              src="/images/LOGO2.png"   
              alt="TourGuide Logo"
              className="w-12 h-auto  group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              MyGuide
            </span>
            </Link>
            
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Discover authentic travel experiences with local guides and instructors worldwide. 
              Create memories that last a lifetime with our curated tours and activities.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 ${color} group`}
                >
                  <Icon className="h-5 w-5 text-gray-300 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Link Sections */}
          {Object.entries(footerSections).map(([section, links]) => (
            <div key={section} className="col-span-1">
              <h3 className="font-semibold text-white mb-4 text-lg">{section}</h3>
              <nav aria-label={`${section} navigation`}>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

          {/* Contact Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">Contact</h3>
            <address className="not-italic">
              <ul className="space-y-4">
                {contactInfo.map(({ icon: Icon, text, href }) => (
                  <li key={text}>
                    <a 
                      href={href}
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
                      {...(href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <Icon className="h-4 w-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                      <span>{text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>
      </div>


      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-gray-800" aria-labelledby="newsletter-heading">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Newsletter Content */}
          <div className="text-center lg:text-left">
            <h2 id="newsletter-heading" className="text-3xl font-bold text-white mb-2">
              Stay Inspired ✨
            </h2>
            <p className="text-gray-400 text-lg">
              Get exclusive travel deals, insider tips, and destination guides delivered to your inbox.
            </p>
          </div>

          {/* Newsletter Form */}
          <form 
            onSubmit={handleNewsletterSubmit} 
            className="w-full max-w-md"
            aria-label="Newsletter subscription"
          >
            <div className="flex bg-transperent border border-purple-500 rounded-xl overflow-hidden shadow-lg">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isSubscribed}
                  className="w-full bg-transparent pl-11 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset disabled:opacity-50"
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || isSubscribed}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 px-6 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                {isLoading ? (
                  "Subscribing..."
                ) : isSubscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {/* Error message */}
            {error && (
              <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            
            {/* Success message */}
            {isSubscribed && (
              <p className="mt-2 text-sm text-green-400" role="status">
                Thanks for subscribing! Check your email for confirmation.
              </p>
            )}
          </form>
        </div>
      </section>




      {/* Bottom Bar */}
      
    </footer>
  );
};

export default Footer;