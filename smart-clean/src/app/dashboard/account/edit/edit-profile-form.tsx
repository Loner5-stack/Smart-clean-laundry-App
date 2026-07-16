"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, User, Save, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

export function EditProfileForm({
  user,
}: {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    image: string | null;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(user.image || "");
  const [showSelector, setShowSelector] = useState(false);
  
  const AVATARS = [
    "/avatars/avatar_m_1.png",
    "/avatars/avatar_m_2.png",
    "/avatars/avatar_m_3.png",
    "/avatars/avatar_f_1.png",
    "/avatars/avatar_f_2.png",
    "/avatars/avatar_f_3.png",
  ];
  
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (!result.success) {
        setError(result.error || "Something went wrong");
      } else {
        router.push("/dashboard/account");
      }
    });
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
          <input type="hidden" name="image" value={selectedAvatar} />
          <button
            type="button"
            onClick={() => setShowSelector(!showSelector)}
            className="w-24 h-24 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0 border-4 border-brand-cobalt/20 relative group overflow-hidden transition-transform hover:scale-105"
          >
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-brand-cobalt">{getInitials(user.name)}</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-xs font-bold text-white tracking-wider uppercase">Change</span>
            </div>
          </button>
          
          {showSelector ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="w-full max-w-sm mt-2"
            >
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                <p className="text-xs font-bold text-gray-500 mb-3 text-center uppercase tracking-wider">Choose an Avatar</p>
                <div className="grid grid-cols-3 gap-3">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setShowSelector(false);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === avatar 
                          ? "border-brand-cobalt scale-105 shadow-md shadow-brand-cobalt/20" 
                          : "border-transparent hover:scale-105 hover:shadow-sm"
                      }`}
                    >
                      <img src={avatar} alt="Avatar Option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                {selectedAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAvatar("");
                      setShowSelector(false);
                    }}
                    className="w-full mt-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <p className="text-xs text-gray-400 font-medium">Tap to change avatar</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

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
                defaultValue={user.name || ""}
                disabled
                className="w-full pl-11 pr-4 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-500 dark:text-gray-400 font-medium focus:outline-none cursor-not-allowed transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <p className="text-[10px] text-gray-400 ml-1">Name cannot be changed</p>
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
                defaultValue={user.email || ""}
                disabled
                className="w-full pl-11 pr-4 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-500 dark:text-gray-400 font-medium focus:outline-none cursor-not-allowed transition-all"
                placeholder="Enter your email"
              />
            </div>
            <p className="text-[10px] text-gray-400 ml-1">Email address cannot be changed</p>
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
                defaultValue={user.phone || ""}
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
                defaultValue={user.address || ""}
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
            disabled={isPending}
            className="flex-[2] py-4 flex items-center justify-center gap-2 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </motion.div>
  );
}
