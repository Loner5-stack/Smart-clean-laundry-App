"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, User, Save } from "lucide-react";
import { mockUser } from "@/data/mock-dashboard";
import { useState } from "react";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: "+234 800 123 4567", // Mock phone
    address: mockUser.homeAddress,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to the backend
    console.log("Saved data:", formData);
    // You could also redirect or show a success toast here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6 pb-12"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/account"
          className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-brand-cobalt hover:border-brand-cobalt/30 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Edit Profile
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
          <div className="w-24 h-24 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0 border-4 border-brand-cobalt/20 relative group cursor-pointer">
            <span className="text-3xl font-bold text-brand-cobalt">{mockUser.avatarInitials}</span>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full overflow-hidden">
              <span className="text-xs font-bold text-white tracking-wider uppercase">Change</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium">Tap to change avatar</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt/50 transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt/50 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt/50 transition-all"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Home Address */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Home Address</label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-gray-400">
                <MapPin size={18} />
              </div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt/50 transition-all resize-none"
                placeholder="Enter your full home address"
                required
              />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <Link
            href="/dashboard/account"
            className="flex-1 py-4 text-center font-bold text-gray-500 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-[2] py-4 flex items-center justify-center gap-2 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

      </form>
    </motion.div>
  );
}
