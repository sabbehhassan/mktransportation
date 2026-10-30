import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarrierAgreementModal from "../components/CarrierAgreementModal";

export default function MainLayout() {
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);

  return (
    <>
      <Navbar
        onApplyCarrier={() => setIsCarrierModalOpen(true)}
      />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />

      <CarrierAgreementModal
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
      />
    </>
  );
}