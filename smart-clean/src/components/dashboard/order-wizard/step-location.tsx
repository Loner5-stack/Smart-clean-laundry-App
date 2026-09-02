"use client";
import { useEffect } from "react";
import { MapPin, Check, Calendar, Home, PenLine } from "lucide-react";
import { timeSlots } from "@/data/order-wizard-data";
import type { OrderState } from "@/types/order-wizard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";

interface Props {
  order: OrderState;
  onChange: (patch: Partial<OrderState>) => void;
  userAddress: string;
}

/** Returns array of available date strings starting from tomorrow */
function getAvailableDates(count = 7): { label: string; value: string }[] {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let daysAdded = 0;
  let i = 1;
  while (daysAdded < count) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    i++;
    if (d.getDay() === 0) continue; // Skip Sunday

    const label = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    const value = d.toISOString().split("T")[0];
    dates.push({ label, value });
    daysAdded++;
  }
  return dates;
}

export function StepLocation({ order, onChange, userAddress }: Props) {
  const availableDates = getAvailableDates(7);
  const homeAddress = userAddress || "No address on profile";
  const isUsingHomeAddress = order.pickupAddress === homeAddress;

  // Auto-select the user's home address and tomorrow's date when the step first loads
  useEffect(() => {
    const patch: Partial<OrderState> = {};
    if (!order.pickupAddress) patch.pickupAddress = homeAddress;
    if (!order.pickupDate) patch.pickupDate = availableDates[0].value;
    if (Object.keys(patch).length > 0) onChange(patch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        Pickup Details
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Where and when should our rider collect your items?
      </p>

      {/* ── Location Section ── */}
      <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
        Pickup Location
      </p>

      {/* Home address card (from profile) */}
      <button
        onClick={() => onChange({ pickupAddress: homeAddress })}
        className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 mb-3 ${
          isUsingHomeAddress
            ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10"
            : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#111827] hover:border-brand-cobalt/40"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isUsingHomeAddress ? "bg-brand-cobalt" : "bg-gray-100 dark:bg-white/10"
          }`}
        >
          <Home size={14} className={isUsingHomeAddress ? "text-white" : "text-gray-400"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Home</p>
            <span className="text-[10px] font-semibold text-brand-cobalt bg-brand-cobalt/10 px-1.5 py-0.5 rounded-full">
              From your profile
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{homeAddress}</p>
        </div>
        {isUsingHomeAddress && (
          <div className="w-5 h-5 rounded-full bg-brand-cobalt flex items-center justify-center shrink-0 mt-0.5">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <PenLine size={11} /> use a different address
        </span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
      </div>

      {/* Address input */}
      <div className="space-y-3 mb-8">
        <input
          type="text"
          value={isUsingHomeAddress ? "" : order.pickupAddress}
          onChange={(e) => onChange({ pickupAddress: e.target.value })}
          placeholder="Start typing your address..."
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
        />
        <input
          type="text"
          value={order.pickupLandmark}
          onChange={(e) => onChange({ pickupLandmark: e.target.value })}
          placeholder="Landmark (optional) — e.g. Near GTBank..."
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
        />
      </div>

      {/* ── Schedule Section ── */}
      <div className="flex items-center gap-3 mt-10 mb-5 pt-8 border-t border-gray-100 dark:border-white/10">
        <div className="w-9 h-9 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-brand-cobalt" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">Schedule Pickup</h3>
          <p className="text-xs text-gray-400 mt-0.5">Select when we should arrive</p>
        </div>
      </div>

      <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
        Pickup Date
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {availableDates.map((d) => {
          const isSelected = order.pickupDate === d.value;
          return (
            <button
              key={d.value}
              onClick={() => onChange({ pickupDate: d.value })}
              className={`shrink-0 px-4 py-3 rounded-2xl border text-center transition-all duration-200 ${
                isSelected
                  ? "bg-brand-cobalt text-white border-brand-cobalt shadow-md"
                  : "bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-brand-cobalt/40"
              }`}
            >
              <p className="text-xs font-bold whitespace-nowrap">{d.label}</p>
            </button>
          );
        })}

        {/* Shadcn Calendar Popover for future dates */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`shrink-0 flex flex-col items-center justify-center px-4 py-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer relative ${
                order.pickupDate && !availableDates.find((d) => d.value === order.pickupDate)
                  ? "bg-brand-cobalt text-white border-brand-cobalt shadow-md"
                  : "bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-brand-cobalt/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span className="text-xs font-bold whitespace-nowrap">
                  {order.pickupDate && !availableDates.find((d) => d.value === order.pickupDate)
                    ? format(parseISO(order.pickupDate), "d MMM")
                    : "More dates"}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
            <CalendarComponent
              mode="single"
              selected={order.pickupDate ? parseISO(order.pickupDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  // Adjust to local date string yyyy-mm-dd
                  const dateString = format(date, "yyyy-MM-dd");
                  onChange({ pickupDate: dateString });
                }
              }}
              disabled={(date) => {
                // Disable dates before tomorrow and Sundays
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date <= today || date.getDay() === 0;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
        Time Slot
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {timeSlots.map((slot) => {
          const isSelected = order.pickupTimeSlotId === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => onChange({ pickupTimeSlotId: slot.id })}
              className={`flex flex-col gap-1 p-3 rounded-2xl border transition-all duration-200 text-left ${
                isSelected
                  ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10"
                  : "bg-white dark:bg-[#111827] border-gray-100 dark:border-white/10 hover:border-brand-cobalt/40"
              }`}
            >
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{slot.label}</p>
              <p className="text-[10px] text-gray-400">{slot.range}</p>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-brand-cobalt flex items-center justify-center mt-1">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
