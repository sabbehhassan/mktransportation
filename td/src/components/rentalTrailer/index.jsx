import {
  Truck,
  ShieldCheck,
  Clock,
  CircleDollarSign,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import trailerImg from "../../assets/new/6.png";

const features = [
  {
    number: "01",
    icon: Truck,
    title: "Trailer Options",
    description:
      "Explore equipment options based on your freight requirements and transportation needs.",
  },
  {
    number: "02",
    icon: CircleDollarSign,
    title: "Budget-Conscious Planning",
    description:
      "Consider rental options as part of your equipment budget and operating cost planning.",
  },
  {
    number: "03",
    icon: Clock,
    title: "Rental Flexibility",
    description:
      "Discuss rental duration and availability to find an arrangement that fits your operation.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Equipment Requirements",
    description:
      "Review equipment condition, specifications, and applicable requirements before getting started.",
  },
];

export default function RentedTrailerProgram() {
  return (
    <section
      id="rented-trailer-program"
      className="relative overflow-hidden bg-[#103C3A] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#17665B]/35 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#D4A84F]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#F0D99B]">
              <span className="h-px w-9 bg-[#D4A84F]" />
              Equipment Solutions
            </div>

            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The right trailer.
              <span className="block text-[#D4A84F]">More room to move.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/70 sm:text-base">
            Explore trailer rental possibilities designed around your equipment
            needs, freight requirements, and business plans.
          </p>
        </div>

        {/* Main editorial layout */}
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Image panel */}
          <div className="relative min-h-[350px] overflow-hidden rounded-[28px] border border-white/10 bg-[#17665B] sm:min-h-[480px] lg:min-h-full">
            <img
              src={trailerImg}
              alt="Trailer equipment for transportation operations"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#103C3A]/95 via-[#103C3A]/10 to-[#103C3A]/15" />

            {/* Image corner label */}
            <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/20 bg-[#103C3A]/75 px-4 py-3 backdrop-blur-md sm:left-7 sm:top-7">
              <Truck size={17} className="text-[#F0D99B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Trailer Rental Program
              </span>
            </div>

            {/* Image bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                Equipment That Fits Your Needs
              </p>

              <h3 className="mt-3 max-w-md text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Plan your next move with greater flexibility.
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Equipment Options", "Rental Planning"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col justify-center">
            <p className="text-sm leading-8 text-white/70 sm:text-base">
              Acquiring equipment is an important business decision. A rental
              arrangement may provide an alternative to purchasing outright,
              depending on availability, rental terms, and your operational
              requirements.
            </p>

            <div className="mt-8 border-y border-white/15">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group grid grid-cols-[42px_1fr] gap-4 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[48px_1fr]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-[#F0D99B] transition group-hover:border-[#D4A84F] group-hover:bg-[#D4A84F] group-hover:text-[#103C3A]">
                      <Icon size={19} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest text-[#D4A84F]">
                          {item.number}
                        </span>

                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-7 text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helpful note */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#D4A84F]/25 bg-white/[0.04] p-4">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-[#D4A84F]"
              />

              <p className="text-sm leading-6 text-white/70">
                Rental availability, equipment specifications, pricing, and
                terms should be confirmed before making a commitment.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <p className="mb-4 text-sm leading-6 text-white/60">
                Interested in a trailer rental? Contact our team to discuss your
                requirements and the next steps.
              </p>

              <a
                href="/contact"
                className="group inline-flex w-full items-center justify-between gap-4 bg-[#D4A84F] px-6 py-4 font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B] sm:w-auto sm:min-w-[250px]"
              >
                <span>Discuss Rental Options</span>

                <ArrowUpRight
                  size={20}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-[#D4A84F]/50 to-transparent lg:mt-20" />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-white/45">
          <span>MK Transportation</span>
          <span>Equipment & Transportation Support</span>
        </div>
      </div>
    </section>
  );
}
