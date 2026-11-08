import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHYSICAL_ADDRESS,
  ADMIN_EMAIL,
  COMPANY_MC_NUMBER,
  COMPANY_USDOT_NUMBER,
} from "../../constants/companyDetails";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const services = [
    "International Freight",
    "Amazon Loads",
    "Dedicated Loads",
    "Truck Dispatching",
  ];

  const currentYear = new Date().getFullYear();

  const headingStyle =
    "mb-6 text-base font-bold tracking-wide text-white";

  return (
    <footer className="relative overflow-hidden bg-[#103C3A] text-white">

      {/* Top Gold Accent */}
      <div className="h-1 bg-gradient-to-r from-[#103C3A] via-[#D4A84F] to-[#103C3A]" />

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#D4A84F]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-6 lg:px-8 lg:pt-16">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Company Information */}
          <div className="flex flex-col items-center sm:items-start">
            <Link
              to="/"
              aria-label="MK Transportation home"
              className="inline-flex rounded-xl bg-white p-3 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={logo}
                alt={COMPANY_NAME}
                className="w-44 object-contain"
                loading="lazy"
              />
            </Link>

            <p className="mt-5 max-w-sm text-center text-sm leading-7 text-emerald-50/75 sm:text-left">
              MK Transportation provides dependable freight and
              transportation solutions to help keep shipments moving
              safely, efficiently, and on schedule.
            </p>

            <Link
              to="/carrier-agreement"
              className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4A84F] px-5 py-3 text-sm font-bold text-[#103C3A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E6BE70] hover:shadow-lg hover:shadow-black/10"
            >
              Become a Carrier
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className={headingStyle}>Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group flex items-center gap-3 text-sm text-emerald-50/70 transition-colors duration-300 hover:text-[#F0C879]"
                  >
                    <FaArrowRight className="shrink-0 text-[10px] text-[#D4A84F] transition-transform duration-300 group-hover:translate-x-1" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className={headingStyle}>Our Services</h3>

            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service}
                  className="group flex items-center gap-3 text-sm text-emerald-50/70 transition-colors duration-300 hover:text-[#F0C879]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84F] transition-transform duration-300 group-hover:scale-150" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className={headingStyle}>Contact Information</h3>

            <div className="space-y-5">

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D4A84F]/25 bg-white/5 text-[#F0C879]">
                  <FaMapMarkerAlt />
                </div>

                <p className="pt-1 text-sm leading-7 text-emerald-50/75">
                  <strong>{COMPANY_NAME}</strong>
                  <br />
                  MC/MX/FF: {COMPANY_MC_NUMBER} | USDOT: {COMPANY_USDOT_NUMBER}
                  <br />
                  Physical: {COMPANY_PHYSICAL_ADDRESS}
                </p>
              </div>

              {/* Emails */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D4A84F]/25 bg-white/5 text-[#F0C879]">
                  <FaEnvelope />
                </div>

                <div className="space-y-3 pt-1 text-left text-sm leading-6">
                  <a
                    href={`mailto:${ADMIN_EMAIL}`}
                    className="block break-all text-emerald-50/75 transition-colors duration-300 hover:text-[#F0C879]"
                  >
                    {ADMIN_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-emerald-50/60 sm:text-sm">
            © {currentYear} {COMPANY_NAME} All rights reserved.
          </p>

          <p className="text-sm font-medium text-emerald-50/80">
            Reliable Freight.
            <span className="ml-1 font-semibold text-[#F0C879]">
              Secure Delivery.
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;