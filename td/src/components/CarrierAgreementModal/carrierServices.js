import {
  CreditCard,
  IdCard,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";

export const CARRIER_SERVICES = [
  {
    value: "Dedicated Lane Setup - $425 (Refundable after first delivery)",
    title: "ONBOARDING LANE SETUP FEE",
    price: "$425",
    description: "Dedicated route onboarding support.",
    note: "Refundable after first delivery",
    icon: Route,
    isOnboardingLaneSetup: true,
  },
  {
    value: "TWIC Card Application - $360 (Same-day processing)",
    title: "TWIC Card Application",
    price: "$360",
    description: "Guidance with TWIC application preparation.",
    note: "Application assistance",
    icon: IdCard,
  },
  {
    value: "Trailer Rental (3 months) - $500",
    title: "Trailer Rental",
    price: "$500",
    description: "Trailer rental option for a three-month period.",
    note: "3-month term",
    icon: Truck,
  },
  {
    value: "Factoring Setup - $250 (Same-day registration)",
    title: "Factoring Setup",
    price: "$250",
    description: "Support with factoring provider onboarding.",
    note: "Registration assistance",
    icon: CreditCard,
  },
  {
    value: "Insurance Assistance - $399",
    title: "Insurance Assistance",
    price: "$399",
    description: "Guidance with trucking insurance documentation.",
    note: "Application support",
    icon: ShieldCheck,
  },
];

export const ONBOARDING_LANE_SETUP_VALUE = CARRIER_SERVICES.find(
  (service) => service.isOnboardingLaneSetup,
).value;
