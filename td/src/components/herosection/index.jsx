import heroBg from "../../assets/herobg.png";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--brand-black)] text-white">
      {/* Background Image */}
      <div className="absolute inset-0 -z-30">
        <img
          src={heroBg}
          alt="Professional freight truck on the highway"
          fetchPriority="high"
          className="h-full w-full object-cover object-[62%_center] sm:object-[65%_center]"
        />
      </div>

      {/* Brand Color Overlays */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[var(--brand-black)]/95 via-[var(--brand-black)]/85 to-[var(--brand-black)]/30" />

      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[var(--brand-black)]/75 via-transparent to-[var(--brand-black)]/25" />

      {/* Soft Brand Glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-[var(--brand-gold)]/25 blur-[100px]" />

      <div className="pointer-events-none absolute -right-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-[var(--brand-gold)]/10 blur-[110px]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-[680px] w-full max-w-[1440px] items-center px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[720px] lg:px-12 lg:py-16 xl:px-16">
        <div className="w-full max-w-3xl">

          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-black)]/60 px-4 py-2.5 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--brand-gold)] opacity-50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--brand-gold)]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)] sm:text-xs">
              Trusted Logistics Partner
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-[42px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px]">
            Moving Your
            <span className="mt-2 block">
              Business{" "}
              <span className="bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-gold)] to-[var(--brand-gold-dark)] bg-clip-text text-transparent">
                Forward.
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
            Reliable transportation and logistics solutions designed to keep
            your freight moving. We connect businesses with dependable carriers
            through efficient coordination and professional service.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/carrier-agreement"
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-[var(--brand-gold)] px-6 py-3.5 text-sm font-bold text-[var(--brand-black)] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)] hover:shadow-xl hover:shadow-[var(--brand-gold)]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-gold)]/40 sm:px-7 sm:text-base"
            >
              Become a Carrier
              <FiArrowUpRight className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <a
              href="#services"
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-xl border border-[var(--brand-gold)]/70 bg-transparent px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)] hover:text-[var(--brand-black)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-gold)]/40 sm:px-7 sm:text-base"
            >
              Explore Our Services
              <FiArrowRight className="text-lg text-[var(--brand-gold)] transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4 text-xs text-white/90 sm:mt-10 sm:gap-x-7 sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10">
                <FiShield className="text-lg text-[var(--brand-gold)]" />
              </span>
              <span className="font-medium">Safety-Focused Service</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-gold)] bg-[var(--brand-gold)]/30">
                <FiTruck className="text-lg text-[var(--brand-gold)]" />
              </span>
              <span className="font-medium">Reliable Freight Solutions</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-9 grid max-w-[620px] grid-cols-3 rounded-2xl border border-white/15 bg-[var(--brand-black)]/65 px-3 py-5 shadow-xl backdrop-blur-lg sm:mt-10 sm:px-5 sm:py-6">
            <div className="border-r border-white/15 pr-2 sm:pr-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <FiClock className="hidden text-xl text-[var(--brand-gold)] sm:block" />
                <span className="text-2xl font-extrabold tracking-tight text-[var(--brand-gold)] sm:text-3xl">
                  24/7
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-sm">
                Support
              </p>
            </div>

            <div className="border-r border-white/15 px-2 sm:px-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <FiCheckCircle className="hidden text-xl text-[var(--brand-gold)] sm:block" />
                <span className="text-2xl font-extrabold tracking-tight text-[var(--brand-gold)] sm:text-3xl">
                  98%
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-sm">
                On-Time Delivery
              </p>
            </div>

            <div className="pl-2 sm:pl-5">
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-[var(--brand-gold)] sm:text-3xl">
                  120+
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-sm">
                Routes Covered
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--brand-black)]/35 to-transparent" />
    </section>
  );
};

export default HeroSection;