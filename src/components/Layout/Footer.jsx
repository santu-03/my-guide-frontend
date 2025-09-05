
// import { Link } from 'react-router-dom';
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Youtube,
//   Globe,
//   Shield,
//   Award,
//   Star,
//   ArrowRight,
//   Download
// } from 'lucide-react';
// import Button from '@/components/ui/Button';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerSections = {
//     explore: {
//       title: 'Explore',
//       links: [
//         { label: 'Destinations', href: '/search?type=place' },
//         { label: 'Activities', href: '/search?type=activity' },
//         { label: 'Food & Drink Tours', href: '/search?category=food' },
//         { label: 'Cultural Tours', href: '/search?category=cultural' },
//         { label: 'Adventure Activities', href: '/search?category=adventure' },
//         { label: 'Art & History', href: '/search?category=art' }
//       ]
//     },
//     company: {
//       title: 'Company',
//       links: [
//         { label: 'About Us', href: '/about' },
//         { label: 'How It Works', href: '/how-it-works' },
//         { label: 'Careers', href: '/careers' },
//         { label: 'Press', href: '/press' },
//         { label: 'Blog', href: '/blog' },
//         { label: 'Investor Relations', href: '/investors' }
//       ]
//     },
//     partners: {
//       title: 'Become a Partner',
//       links: [
//         { label: 'Become a Guide', href: '/become-guide' },
//         { label: 'Become an Instructor', href: '/become-instructor' },
//         { label: 'Business Solutions', href: '/business' },
//         { label: 'Affiliate Program', href: '/affiliates' },
//         { label: 'Partner Resources', href: '/partner-resources' },
//         { label: 'API Documentation', href: '/developers' }
//       ]
//     },
//     support: {
//       title: 'Support',
//       links: [
//         { label: 'Help Center', href: '/help' },
//         { label: 'Contact Us', href: '/contact' },
//         { label: 'Safety Guidelines', href: '/safety' },
//         { label: 'Cancellation Policy', href: '/cancellation-policy' },
//         { label: 'Travel Insurance', href: '/insurance' },
//         { label: 'Accessibility', href: '/accessibility' }
//       ]
//     }
//   };

//   const socialLinks = [
//     { icon: Facebook, href: 'https://facebook.com/tourguide', label: 'Facebook' },
//     { icon: Twitter, href: 'https://twitter.com/tourguide', label: 'Twitter' },
//     { icon: Instagram, href: 'https://instagram.com/tourguide', label: 'Instagram' },
//     { icon: Linkedin, href: 'https://linkedin.com/company/tourguide', label: 'LinkedIn' },
//     { icon: Youtube, href: 'https://youtube.com/tourguide', label: 'YouTube' }
//   ];

//   const trustIndicators = [
//     { icon: Shield, label: '256-bit SSL Secure' },
//     { icon: Award, label: 'Industry Leader' },
//     { icon: Star, label: '4.8 Average Rating' }
//   ];

//   const popularDestinations = [
//     'Paris', 'Rome', 'Tokyo', 'New York', 'London', 'Barcelona',
//     'Amsterdam', 'Dubai', 'Bangkok', 'Sydney', 'Mumbai', 'Delhi'
//   ];

//   const handleNewsletter = (e) => {
//     e.preventDefault();
//     // add your submit logic
//   };

//   return (
//     <footer className="bg-gray-900 text-white">
//       {/* Newsletter (compact) */}
//       <div className="border-b border-gray-800">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-6 items-center">
//             <div>
//               <h3 className="text-xl font-bold mb-2">Never miss amazing experiences</h3>
//               <p className="text-gray-300 text-sm sm:text-base">
//                 Get personalized recommendations and exclusive deals in your inbox.
//               </p>
//             </div>

//             <div className="space-y-3">
//               <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5">
//                 <div className="flex-1 relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
//                     required
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="bg-primary-600 hover:bg-primary-700 px-6 h-10"
//                 >
//                   Subscribe
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </form>

//               <p className="text-[11px] text-gray-400">
//                 By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popular Destinations (compact) */}
//       <div className="border-b border-gray-800">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h4 className="text-base font-semibold mb-3">Popular Destinations</h4>
//           <div className="flex flex-wrap gap-2">
//             {popularDestinations.map((destination) => (
//               <Link
//                 key={destination}
//                 to={`/search?q=${encodeURIComponent(destination)}`}
//                 className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
//               >
//                 {destination}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Footer (compact) */}
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
//           {/* Brand */}
//           <div className="lg:col-span-2 space-y-5">
//             <Link aria-label="TourGuide home" to="/" className="flex items-center space-x-3">
//               <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold text-base">TG</span>
//               </div>
//               <span className="font-bold text-xl">TourGuide</span>
//             </Link>

//             <p className="text-gray-300 max-w-sm text-sm">
//               Discover amazing experiences with local guides and instructors — your gateway
//               to authentic travel adventures worldwide.
//             </p>

//             {/* Contact */}
//             <div className="space-y-1.5">
//               <div className="flex items-center space-x-3 text-sm text-gray-400">
//                 <Phone className="h-4 w-4 flex-shrink-0" />
//                 <span>+1 (555) 123-4567</span>
//               </div>
//               <div className="flex items-center space-x-3 text-sm text-gray-400">
//                 <Mail className="h-4 w-4 flex-shrink-0" />
//                 <span>hello@tourguide.com</span>
//               </div>
//               <div className="flex items-center space-x-3 text-sm text-gray-400">
//                 <MapPin className="h-4 w-4 flex-shrink-0" />
//                 <span>San Francisco, CA</span>
//               </div>
//             </div>

//             {/* Social */}
//             <div className="flex space-x-3">
//               {socialLinks.map(({ icon: Icon, href, label }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
//                   aria-label={label}
//                 >
//                   <Icon className="h-4.5 w-4.5 text-gray-400 group-hover:text-white" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Link Sections */}
//           {Object.entries(footerSections).map(([key, section]) => (
//             <nav key={key} className="space-y-3">
//               <h4 className="text-base font-semibold">{section.title}</h4>
//               <ul className="space-y-1.5">
//                 {section.links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       to={link.href}
//                       className="text-gray-400 hover:text-white transition-colors text-sm"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           ))}
//         </div>

//         {/* Apps & Trust (compact) */}
//         <div className="mt-10 pt-6 border-t border-gray-800">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
//             <div>
//               <h4 className="text-base font-semibold mb-3">Download Our Apps</h4>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <a
//                   href="#"
//                   className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2.5 transition-colors group"
//                 >
//                   <Download className="h-5 w-5" />
//                   <div className="text-left">
//                     <div className="text-[11px] text-gray-400">Download on the</div>
//                     <div className="font-semibold text-sm">App Store</div>
//                   </div>
//                 </a>

//                 <a
//                   href="#"
//                   className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2.5 transition-colors group"
//                 >
//                   <Download className="h-5 w-5" />
//                   <div className="text-left">
//                     <div className="text-[11px] text-gray-400">Get it on</div>
//                     <div className="font-semibold text-sm">Google Play</div>
//                   </div>
//                 </a>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               {trustIndicators.map(({ icon: Icon, label }) => (
//                 <div key={label} className="flex items-center space-x-2 text-sm text-gray-400">
//                   <Icon className="h-4 w-4" />
//                   <span>{label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Language/Currency (compact) */}
//         <div className="mt-6 pt-6 border-t border-gray-800">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="flex flex-wrap gap-3">
//               <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
//                 <Globe className="h-4 w-4" />
//                 <span>English (US)</span>
//               </button>
//               <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
//                 <span>₹ INR</span>
//               </button>
//             </div>

//             <div className="text-sm text-gray-400">
//               Trusted by 1M+ travelers worldwide
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar (compact) */}
//       <div className="border-t border-gray-800">
//         <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
//             <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
//               <span>© {currentYear} TourGuide, Inc. All rights reserved.</span>

//               <div className="flex flex-wrap gap-4">
//                 <Link to="/privacy" className="hover:text-white transition-colors">
//                   Privacy Policy
//                 </Link>
//                 <Link to="/terms" className="hover:text-white transition-colors">
//                   Terms of Service
//                 </Link>
//                 <Link to="/cookies" className="hover:text-white transition-colors">
//                   Cookie Policy
//                 </Link>
//                 <Link to="/sitemap" className="hover:text-white transition-colors">
//                   Sitemap
//                 </Link>
//               </div>
//             </div>

//             <div className="text-xs text-gray-500">Made with ❤️ for travelers</div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Explore: [
      { label: 'Destinations', href: '/search?type=place' },
      { label: 'Activities', href: '/search?type=activity' },
      { label: 'Food & Drink Tours', href: '/search?category=food' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety Guidelines', href: '/safety' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    // newsletter logic
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-6 py-10 border-b border-gray-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Stay Inspired ✨</h3>
            <p className="text-gray-400 text-sm">
              Get exclusive travel deals & tips in your inbox.
            </p>
          </div>
          <form
            onSubmit={handleNewsletter}
            className="flex w-full max-w-md bg-gray-800 rounded-lg overflow-hidden"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-gray-800 pl-9 pr-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 px-5 text-sm font-semibold flex items-center"
            >
              Subscribe <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg">
              TG
            </div>
            <span className="font-bold text-lg text-white">TourGuide</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover authentic travel experiences with local guides and
            instructors worldwide.
          </p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Icon className="h-4 w-4 text-gray-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="font-semibold text-white mb-4">{section}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@tourguide.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> San Francisco, CA
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <span>© {currentYear} TourGuide, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
