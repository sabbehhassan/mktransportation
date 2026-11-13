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
      <div className="hidden bg-[var(--brand-black)] text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="group flex items-center gap-2 text-white/80 transition-colors duration-300 hover:text-[var(--brand-gold)]"
            >
              <FiMail className="text-[var(--brand-gold)] transition-transform duration-300 group-hover:scale-110" />
              {COMPANY_EMAIL}
            </a>
            <span
              aria-hidden="true"
              className="hidden h-4 border-l border-[var(--brand-gold)]/40 xl:block"
            />

            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="hidden items-center gap-2 text-white/80 transition-colors duration-300 hover:text-[var(--brand-gold)] xl:flex"
            >
              <FiMail className="text-[var(--brand-gold)]" />
              {ADMIN_EMAIL}
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-5 text-white/80">
            <span className="hidden items-center gap-2 xl:flex">
              <FiMapPin className="shrink-0 text-[var(--brand-gold)]" />
              {COMPANY_MAILING_ADDRESS}
            </span>
            <span
              aria-hidden="true"
              className="hidden h-4 border-l border-[var(--brand-gold)]/40 xl:block"
            />
            <span className="flex items-center gap-2">
              <FiClock className="text-[var(--brand-gold)]" />
              Monday – Friday
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-[var(--brand-light-gray)] bg-white">
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
                      ? "bg-[var(--brand-light-gray)] text-brand-black"
                      : "text-[var(--brand-gray)] hover:bg-[var(--brand-light-gray)] hover:text-brand-black"
                  }`}
                >
                  {item.name}

                  <span
                    className={`absolute bottom-1 left-3 right-3 h-[2px] origin-left rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-gold)] transition-transform duration-300 ${
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
                    ? "border-[var(--brand-gold)] bg-[var(--brand-light-gray)] text-brand-black"
                    : "border-[var(--brand-gold)]/70 bg-white text-brand-black hover:border-[var(--brand-gold-dark)] hover:bg-[var(--brand-light-gray)]"
                }`}
              >
                <FiSearch className="text-base" />
                Track Agreement
              </Link>

              <Link
                to="/carrier-agreement"
                onClick={handleApplyCarrier}
                className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--brand-gold)] px-4 py-3 text-sm font-bold text-[var(--brand-black)] shadow-md shadow-[var(--brand-gold)]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-gold-dark)] hover:shadow-lg hover:shadow-[var(--brand-gold)]/25 focus:outline-none focus:ring-4 focus:ring-[var(--brand-gold)]/40"
              >
                Apply as Carrier
                <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-light-gray)] bg-[var(--brand-light-gray)] text-brand-black transition-all duration-300 hover:border-[var(--brand-gold)] hover:bg-[var(--brand-gold-dark)] lg:hidden"
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
            <div className="border-t border-[var(--brand-light-gray)] bg-white px-4 pb-5 pt-4 sm:px-6">
              <div className="space-y-1.5">
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-lg border-l-2 px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? "border-[var(--brand-gold)] bg-[var(--brand-light-gray)] text-brand-black"
                        : "border-transparent text-[var(--brand-gray)] hover:border-[var(--brand-gold)] hover:bg-[var(--brand-light-gray)] hover:text-brand-black"
                    }`}
                  >
                    {item.name}

                    <FiArrowRight
                      className={`transition-all duration-300 group-hover:translate-x-1 ${
                        isActive(item.path)
                          ? "text-brand-black"
                          : "text-[var(--brand-gray)] group-hover:text-brand-black"
                      }`}
                    />
                  </Link>
                ))}
              </div>

              {/* Mobile Track Agreement Button */}
              <Link
                to="/track-agreement"
                onClick={handleTrackingClick}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--brand-gold)] bg-white px-4 py-3.5 text-sm font-bold text-brand-black transition-all duration-300 hover:bg-[var(--brand-light-gray)]"
              >
                <FiSearch className="text-base" />
                Track Agreement
                <FiArrowRight />
              </Link>

              {/* Mobile Apply as Carrier Button */}
              <Link
                to="/carrier-agreement"
                onClick={handleApplyCarrier}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-gold)] px-4 py-3.5 text-sm font-bold text-[var(--brand-black)] shadow-md shadow-[var(--brand-gold)]/15 transition-all duration-300 hover:bg-[var(--brand-gold-dark)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-gold)]/40"
              >
                Apply as Carrier
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Mobile Contact Information */}
              <div className="mt-5 space-y-3 border-t border-[var(--brand-light-gray)] pt-4">
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-start gap-2.5 break-all text-xs leading-5 text-[var(--brand-gray)] transition-colors hover:text-brand-black"
                >
                  <FiMail className="mt-0.5 shrink-0 text-brand-black" />
                  {COMPANY_EMAIL}
                </a>

                <a
                  href={`mailto:${ADMIN_EMAIL}`}
                  className="flex items-start gap-2.5 break-all text-xs leading-5 text-[var(--brand-gray)] transition-colors hover:text-brand-black"
                >
                  <FiMail className="mt-0.5 shrink-0 text-brand-black" />
                  {ADMIN_EMAIL}
                </a>

                <p className="flex items-center gap-2.5 text-xs text-[var(--brand-gray)]">
                  <FiClock className="text-brand-black" />
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
