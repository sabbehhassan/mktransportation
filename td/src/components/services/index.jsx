import { FaKey, FaAmazon, FaBuilding } from "react-icons/fa";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

import service1 from "../../assets/new/dedicatedlane.png";
import service2 from "../../assets/new/amazonloads.png";
import service3 from "../../assets/new/govtcontract.png";

const servicesData = [
  {
    number: "01",
    icon: <FaKey />,
    image: service1,
    title: "Dedicated Lanes",
    category: "Consistent Freight",
    desc: "Reliable trucking routes designed for consistent delivery performance and long-term freight partnerships.",
    features: ["Route Coordination", "Reliable Scheduling"],
  },
  {
    number: "02",
    icon: <FaAmazon />,
    image: service2,
    title: "Amazon Loads",
    category: "Freight Solutions",
    desc: "Efficient Amazon freight coordination focused on timely pickups, secure transportation, and dependable deliveries.",
    features: ["Pickup Coordination", "Delivery Planning"],
  },
  {
    number: "03",
    icon: <FaBuilding />,
    image: service3,
    title: "Government Contracts",
    category: "Contract Logistics",
    desc: "Professional logistics support for government transportation projects and organized freight operations.",
    features: ["Contract Coordination", "Freight Management"],
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[var(--brand-light-gray)] py-20 sm:py-24 lg:py-28"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[var(--brand-gold)]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[var(--brand-gold)]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* New Split Header */}
        <div className="grid gap-8 border-b border-[var(--brand-black)]/10 pb-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:pb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/20 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-xs font-bold uppercase tracking-[0.17em] text-brand-black">
                Our Expertise
              </span>
            </div>

            <h2 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-[var(--brand-black)] sm:text-5xl lg:text-6xl">
              Transportation
              <span className="block text-brand-black">
                Made Simpler.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              From dedicated trucking lanes to specialized freight
              coordination, our services are designed around dependable
              communication and your transportation needs.
            </p>

            <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[var(--brand-black)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gold)]/10 text-brand-black">
                <FiCheckCircle className="text-lg" />
              </span>
              Dependable coordination. Professional service.
            </div>
          </div>
        </div>

        {/* New Service Layout */}
        <div className="mt-10 space-y-5 lg:mt-12 lg:space-y-6">
          {servicesData.map((service) => (
            <article
              key={service.number}
              className="group grid overflow-hidden rounded-2xl border border-[var(--brand-black)]/10 bg-white transition-all duration-300 hover:border-[var(--brand-gold)]/60 hover:shadow-[0_20px_50px_rgba(8,9,11,0.10)] md:grid-cols-[0.85fr_1.15fr] lg:min-h-[300px]"
            >
              {/* Service Image Panel */}
              <div className="relative min-h-[230px] overflow-hidden md:min-h-[300px]">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-black)]/80 via-[var(--brand-black)]/15 to-[var(--brand-black)]/10 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[var(--brand-black)]/30" />

                {/* Number Badge */}
                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--brand-gold)]/50 bg-[var(--brand-black)]/90 text-sm font-extrabold text-[var(--brand-gold)] shadow-lg backdrop-blur-md">
                  {service.number}
                </div>

                {/* Icon Badge */}
                <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-[var(--brand-gold)] text-2xl text-[var(--brand-gold)] shadow-xl transition-colors duration-300 group-hover:bg-[var(--brand-gold-dark)] group-hover:text-[var(--brand-black)]">
                  <span className="flex h-7 w-7 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                    {service.icon}
                  </span>
                </div>
              </div>

              {/* Service Information */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-brand-black">
                    {service.category}
                  </span>

                  <span className="h-px w-12 bg-[var(--brand-gold)] transition-all duration-300 group-hover:w-20" />
                </div>

                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--brand-black)] transition-colors duration-300 group-hover:text-brand-black sm:text-3xl">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {service.desc}
                </p>

                {/* Feature Chips */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-gold)]/10 bg-[var(--brand-light-gray)] px-3 py-2 text-xs font-medium text-[var(--brand-black)] sm:text-sm"
                    >
                      <FiCheckCircle className="shrink-0 text-brand-black" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="mt-7 flex items-center justify-between border-t border-[var(--brand-black)]/10 pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Logistics Solutions
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-gold)]/10 text-brand-black transition-all duration-300 group-hover:bg-[var(--brand-gold-dark)] group-hover:text-white">
                    <FiArrowUpRight className="text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Contact Banner */}
        <div className="relative mt-12 overflow-hidden rounded-2xl bg-[var(--brand-black)] p-7 sm:mt-16 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-16 h-44 w-44 rounded-full border border-[var(--brand-gold)]/20" />

          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.17em] text-[var(--brand-gold)]">
              Let's Work Together
            </span>

            <h3 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              Need a logistics solution for your business?
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Get in touch with our team to discuss your freight coordination needs.
            </p>
          </div>

          <a
            href="/contact"
            className="group relative mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold text-[var(--brand-black)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)] hover:shadow-lg lg:mt-0"
          >
            Contact Our Team
            <FiArrowUpRight className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Services;