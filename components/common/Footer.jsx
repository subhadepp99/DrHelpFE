import React from "react";
import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Find Doctors", href: "/doctors" },
      { name: "Book Appointment", href: "/search" },
      { name: "Health Checkups", href: "#" },
      { name: "Lab Tests", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Mission", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: "#", icon: FiFacebook },
    { name: "Twitter", href: "#", icon: FiTwitter },
    { name: "Instagram", href: "#", icon: FiInstagram },
    { name: "LinkedIn", href: "#", icon: FiLinkedin },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary-400">
              HealthCare
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              Making healthcare accessible and convenient for everyone. Find
              qualified doctors, book appointments, and manage your health
              online.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-gray-300">
                <FiPhone className="h-5 w-5 mr-3" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FiMail className="h-5 w-5 mr-3" />
                <span>support@healthcare.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FiMapPin className="h-5 w-5 mr-3" />
                <span>123 Health Street, Medical City, India</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} HealthCare. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
