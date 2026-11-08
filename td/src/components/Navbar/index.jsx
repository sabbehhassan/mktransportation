import { useState } from "react";
import {
  FiMail,
  FiClock,
  FiArrowRight,
  FiSearch,
  FiMapPin,
} from "react-icons/fi";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import {
  COMPANY_EMAIL,
  COMPANY_MAILING_ADDRESS,
  ADMIN_EMAIL,
  COMPANY_NAME,
} from "../../constants/companyDetails";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleApplyCarrier = () => {
    setMenuOpen(false);
  };

  const handleTrackingClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top Contact Bar */}
      <div className="hidden bg-[#103C3A] text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="group flex items-center gap-2 text-emerald-50/80 transition-colors duration-300 hover:text-[#F0C879]"
            >
              <FiMail className="text-[#F0C879] transition-transform duration-300 group-hover:scale-110" />
              {COMPANY_EMAIL}
            </a>

            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="hidden items-center gap-2 text-emerald-50/80 transition-colors duration-300 hover:text-[#F0C879] xl:flex"
            >
              <FiMail className="text-[#F0C879]" />
              {ADMIN_EMAIL}
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-5 text-emerald-50/80">
            <span className="hidden items-center gap-2 xl:flex">
              <FiMapPin className="shrink-0 text-[#F0C879]" />
              {COMPANY_MAILING_ADDRESS}
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="text-[#F0C879]" />
              Monday – Friday
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-[#DCE9E4] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[78px] items-center justify-between gap-3 lg:h-[88px]">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="group shrink-0"
            >
              <img
                src={logo}
                alt={COMPANY_NAME}
                className="h-18 w-auto max-w-[155px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-24 sm:max-w-[180px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex xl:gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative rounded-lg px-3 py-3 text-sm font-semibold transition-all duration-300 xl:px-3 ${
                    isActive(item.path)
                      ? "bg-[#EAF4EF] text-[#17665B]"
                      : "text-[#4B625D] hover:bg-[#F2F7F4] hover:text-[#17665B]"
                  }`}
                >
                  {item.name}

                  <span
                    className={`absolute bottom-1 left-3 right-3 h-[2px] origin-left rounded-full bg-gradient-to-r from-[#17665B] to-[#D4A84F] transition-transform duration-300 ${
                      isActive(item.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                to="/tracking"
                onClick={handleTrackingClick}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-bold transition-all duration-300 ${
                  isActive("/track-agreement")
                    ? "border-[#17665B] bg-[#EAF4EF] text-[#17665B]"
                    : "border-[#DCE9E4] bg-white text-[#17665B] hover:border-[#17665B] hover:bg-[#F2F7F4]"
                }`}
              >
                <FiSearch className="text-base" />
                Track Agreement
              </Link>

              <Link
                to="/carrier-agreement"
                onClick={handleApplyCarrier}
                className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#17665B] to-[#218477] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#17665B]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#17665B]/25 focus:outline-none focus:ring-4 focus:ring-[#17665B]/20"
              >
                Apply as Carrier
                <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#F0C879]" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DCE9E4] bg-[#F4F8F5] text-[#17665B] transition-all duration-300 hover:border-[#17665B] hover:bg-[#EAF4EF] lg:hidden"
            >
              {menuOpen ? (
                <HiX className="text-2xl" />
              ) : (
                <HiOutlineMenuAlt3 className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:hidden ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-[#DCE9E4] bg-white px-4 pb-5 pt-4 sm:px-6">
              <div className="space-y-1.5">
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-lg border-l-2 px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? "border-[#17665B] bg-[#EAF4EF] text-[#17665B]"
                        : "border-transparent text-[#4B625D] hover:border-[#D4A84F] hover:bg-[#F4F8F5] hover:text-[#17665B]"
                    }`}
                  >
                    {item.name}

                    <FiArrowRight
                      className={`transition-all duration-300 group-hover:translate-x-1 ${
                        isActive(item.path)
                          ? "text-[#17665B]"
                          : "text-[#94AAA1] group-hover:text-[#17665B]"
                      }`}
                    />
                  </Link>
                ))}
              </div>

              {/* Mobile Track Agreement Button */}
              <Link
                to="/track-agreement"
                onClick={handleTrackingClick}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#17665B] bg-[#EAF4EF] px-4 py-3.5 text-sm font-bold text-[#17665B] transition-all duration-300 hover:bg-[#DCEFE5]"
              >
                <FiSearch className="text-base" />
                Track Agreement
                <FiArrowRight />
              </Link>

              {/* Mobile Apply as Carrier Button */}
              <Link
                to="/carrier-agreement"
                onClick={handleApplyCarrier}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#17665B] to-[#218477] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-[#17665B]/15 transition-all duration-300 hover:from-[#103C3A] hover:to-[#17665B] focus:outline-none focus:ring-4 focus:ring-[#17665B]/20"
              >
                Apply as Carrier
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Mobile Contact Information */}
              <div className="mt-5 space-y-3 border-t border-[#E5EEE9] pt-4">
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-start gap-2.5 break-all text-xs leading-5 text-[#61766E] transition-colors hover:text-[#17665B]"
                >
                  <FiMail className="mt-0.5 shrink-0 text-[#17665B]" />
                  {COMPANY_EMAIL}
                </a>

                <a
                  href={`mailto:${ADMIN_EMAIL}`}
                  className="flex items-start gap-2.5 break-all text-xs leading-5 text-[#61766E] transition-colors hover:text-[#17665B]"
                >
                  <FiMail className="mt-0.5 shrink-0 text-[#17665B]" />
                  {ADMIN_EMAIL}
                </a>

                <p className="flex items-center gap-2.5 text-xs text-[#61766E]">
                  <FiClock className="text-[#17665B]" />
                  Monday – Friday
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
