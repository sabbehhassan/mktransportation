import {
  FaGlobeAmericas,
  FaUsers,
  FaKey,
  FaBoxes,
} from "react-icons/fa";

import {
  FiArrowUpRight,
  FiTrendingUp,
} from "react-icons/fi";

import jbHunt from "../../assets/images/jb-hunt.png";
import oldDominion from "../../assets/images/old-dominion.png";
import southernFreight from "../../assets/images/southern-freight.png";
import fedex from "../../assets/images/fedex.png";

const partners = [
  { image: jbHunt, alt: "J.B. Hunt" },
  { image: oldDominion, alt: "Old Dominion" },
  { image: southernFreight, alt: "Southern Freight" },
  { image: fedex, alt: "FedEx" },
];

const stats = [
  {
    icon: <FaBoxes />,
    value: "+15,000",
    title: "Monthly Shipments",
    description: "Coordinated freight movement",
  },
  {
    icon: <FaGlobeAmericas />,
    value: "+40",
    title: "States Served",
    description: "Connecting businesses nationwide",
  },
  {
    icon: <FaUsers />,
    value: "98%",
    title: "Client Satisfaction",
    description: "Focused on dependable service",
  },
  {
    icon: <FaKey />,
    value: "24/7",
    title: "Support Availability",
    description: "Help when your business needs it",
  },
];

const Industries = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[var(--brand-gold)]/8 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[var(--brand-gold)]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/15 bg-[var(--brand-gold)]/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-black">
                Our Logistics Network
              </span>
            </div>

            <h2 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--brand-black)] sm:text-4xl md:text-5xl">
              Strong Connections.
              <span className="mt-1 block text-brand-black">
                Reliable Deliveries.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Reliable logistics starts with strong relationships. We focus
              on professional coordination, dependable freight solutions, and
              service that helps businesses keep moving.
            </p>

            <a
              href="#services"
              className="group mt-5 inline-flex items-center gap-2 font-bold text-brand-black transition-colors hover:text-[var(--brand-black)]"
            >
              Explore Our Services
              <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>

        </div>

        {/* Partner Logos */}
        <div className="mt-14 sm:mt-16">

          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-[var(--brand-black)]">
              Our Partner Network
            </p>

            <div className="h-px flex-1 bg-gradient-to-r from-[var(--brand-gold)]/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {partners.map((partner) => (
              <div
                key={partner.alt}
                className="group flex h-28 items-center justify-center rounded-2xl border border-[var(--brand-black)]/10 bg-[var(--brand-light-gray)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-gold)]/70 hover:bg-white hover:shadow-xl hover:shadow-[var(--brand-black)]/8 sm:h-32 sm:p-7"
              >
                <img
                  src={partner.image}
                  alt={partner.alt}
                  loading="lazy"
                  className="max-h-12 max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-14"
                />
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Partner logos are shown for identification purposes. Confirm
            current business relationships and permissions before publication.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mt-20 overflow-hidden rounded-3xl bg-[var(--brand-black)] sm:mt-24">

          {/* Stats Header */}
          <div className="relative border-b border-white/10 px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:items-end lg:justify-between lg:px-12">

            <div className="pointer-events-none absolute -right-12 -top-28 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-2 -top-20 h-44 w-44 rounded-full border border-[var(--brand-gold)]/20" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                <FiTrendingUp className="text-base" />
                Performance at a Glance
              </div>

              <h3 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                Built Around Your Business Needs
              </h3>
            </div>

            <p className="relative mt-4 max-w-md text-sm leading-7 text-white/70 lg:mt-0 lg:max-w-xs">
              Our focus is simple: responsive support, careful coordination,
              and dependable logistics service.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden bg-[var(--brand-black)] p-6 transition-colors duration-300 hover:bg-[var(--brand-dark-gray)] sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--brand-gold)] transition-transform duration-300 group-hover:scale-x-100" />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/10 text-xl text-[var(--brand-gold)] transition-all duration-300 group-hover:bg-[var(--brand-gold-dark)] group-hover:text-[var(--brand-black)]">
                  {item.icon}
                </div>

                <h4 className="mt-7 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {item.value}
                </h4>

                <p className="mt-3 font-bold text-[var(--brand-gold)]">
                  {item.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="h-1.5 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />
        </div>

      </div>
    </section>
  );
};

export default Industries;