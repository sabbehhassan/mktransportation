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
    <section className="relative isolate w-full overflow-hidden bg-[#103C3A] text-white">
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
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#082C2A]/95 via-[#103C3A]/85 to-[#103C3A]/30" />

      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#082C2A]/75 via-transparent to-[#103C3A]/25" />

      {/* Soft Brand Glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-[#17665B]/25 blur-[100px]" />

      <div className="pointer-events-none absolute -right-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-[#D4A84F]/10 blur-[110px]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-[680px] w-full max-w-[1440px] items-center px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[720px] lg:px-12 lg:py-16 xl:px-16">
        <div className="w-full max-w-3xl">

          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#D4A84F]/40 bg-[#103C3A]/60 px-4 py-2.5 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#D4A84F] opacity-50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#D4A84F]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0D99B] sm:text-xs">
              Trusted Logistics Partner
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-[42px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px]">
            Moving Your
            <span className="mt-2 block">
              Business{" "}
              <span className="bg-gradient-to-r from-[#D4A84F] via-[#F0D99B] to-white bg-clip-text text-transparent">
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
              to="/carrier-form"
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#17665B] to-[#218575] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#17665B]/30 sm:px-7 sm:text-base"
            >
              Become a Carrier
              <FiArrowUpRight className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <a
              href="#services"
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-xl border border-[#D4A84F]/50 bg-[#103C3A]/55 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A84F] hover:bg-[#17665B]/50 sm:px-7 sm:text-base"
            >
              Explore Our Services
              <FiArrowRight className="text-lg text-[#F0D99B] transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4 text-xs text-white/90 sm:mt-10 sm:gap-x-7 sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4A84F]/30 bg-[#D4A84F]/10">
                <FiShield className="text-lg text-[#F0D99B]" />
              </span>
              <span className="font-medium">Safety-Focused Service</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#17665B] bg-[#17665B]/30">
                <FiTruck className="text-lg text-[#7DD3B8]" />
              </span>
              <span className="font-medium">Reliable Freight Solutions</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-9 grid max-w-[620px] grid-cols-3 rounded-2xl border border-white/15 bg-[#082C2A]/65 px-3 py-5 shadow-xl backdrop-blur-lg sm:mt-10 sm:px-5 sm:py-6">
            <div className="border-r border-white/15 pr-2 sm:pr-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <FiClock className="hidden text-xl text-[#D4A84F] sm:block" />
                <span className="text-2xl font-extrabold tracking-tight text-[#F0D99B] sm:text-3xl">
                  24/7
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-sm">
                Support
              </p>
            </div>

            <div className="border-r border-white/15 px-2 sm:px-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <FiCheckCircle className="hidden text-xl text-[#D4A84F] sm:block" />
                <span className="text-2xl font-extrabold tracking-tight text-[#F0D99B] sm:text-3xl">
                  98%
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-sm">
                On-Time Delivery
              </p>
            </div>

            <div className="pl-2 sm:pl-5">
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-[#F0D99B] sm:text-3xl">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#103C3A]/35 to-transparent" />
    </section>
  );
};

export default HeroSection;