/**
 * Shared types and initial state for the New Order Wizard.
 */

export interface SelectedItem {
  itemId: string;
  name: string;
  emoji: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  serviceId: string;
  serviceName: string;
}

export interface BagSelection {
  serviceId: string;
  serviceName: string;
  size: "Small" | "Medium" | "Large";
  estimatedMin: number;
  estimatedMax: number;
}

export interface StainFlag {
  hasStain: boolean;
  description: string;
  stainType: string;
  imagePreview: string | null; // base64 data URL
}

export interface OrderState {
  /** Step 1 */
  serviceIds: string[];
  serviceNames: string[];

  /** Step 2 — Items + quantities */
  selectedItems: SelectedItem[];
  bagSelections: BagSelection[];

  /** Step 3 — Stain flag (attached to this order) */
  stainFlag: StainFlag;

  /** Step 4 — Pickup location */
  pickupAddress: string;
  pickupLandmark: string;

  /** Step 5 — Schedule */
  pickupDate: string;
  pickupTimeSlotId: string;

  /** Step 6 — Payment */
  paymentMethod: "card" | "bank_transfer" | "pay_on_pickup" | null;
}

export const initialOrderState: OrderState = {
  serviceIds: [],
  serviceNames: [],
  selectedItems: [],
  bagSelections: [],
  stainFlag: {
    hasStain: false,
    description: "",
    stainType: "",
    imagePreview: null,
  },
  pickupAddress: "",
  pickupLandmark: "",
  pickupDate: "",
  pickupTimeSlotId: "",
  paymentMethod: null,
};
