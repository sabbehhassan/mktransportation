import {
  ShieldCheck,
  FileText,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ClipboardCheck,
  Headset,
  BadgeCheck,
} from "lucide-react";

export default function InsuranceApplicationAssistance() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Insurance Guidance",
      desc: "Understand your trucking insurance options and identify coverage that fits your operation.",
    },
    {
      icon: ClipboardCheck,
      title: "Application Support",
      desc: "Get help organizing business information and preparing the documents insurers may require.",
    },
    {
      icon: Clock3,
      title: "A Smoother Process",
      desc: "Keep your application organized with clear next steps and timely communication.",
    },
    {
      icon: BadgeCheck,
      title: "Compliance Awareness",
      desc: "Understand common insurance filing requirements before putting your truck on the road.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Discuss Your Operation",
      desc: "Tell us about your equipment, authority status, cargo, and business requirements.",
    },
    {
      number: "02",
      title: "Prepare Your Documents",
      desc: "Gather the relevant business details and insurance information for your application.",
    },
    {
      number: "03",
      title: "Review Your Options",
      desc: "Explore suitable coverage options and review the information before proceeding.",
    },
    {
      number: "04",
      title: "Move Forward With Confidence",
      desc: "Follow up on your application and confirm any outstanding requirements with your insurer.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F5F7F4] py-20 text-[#103C3A] sm:py-24 lg:py-28">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-96 w-96 rounded-full bg-[#D4A84F]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-14 grid gap-7 lg:mb-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/50 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
                Trucking Insurance Support
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Get Your Insurance Process
              <span className="mt-1 block text-[#17665B]">
                Moving in the Right Direction.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <div className="mb-4 h-1 w-16 rounded-full bg-[#D4A84F]" />
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Navigating commercial trucking insurance doesn't have to feel
              complicated. We help you understand the process, prepare your
              information, and take the next step with greater confidence.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Feature cards */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-extrabold sm:text-2xl">
                Support Built Around Your Business
              </h3>
              <ShieldCheck
                size={27}
                className="shrink-0 text-[#D4A84F]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-[#103C3A]/10 bg-white p-5 shadow-[0_8px_30px_rgba(16,60,58,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/70 hover:shadow-[0_18px_38px_rgba(16,60,58,0.09)] sm:p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B] transition-colors duration-300 group-hover:bg-[#17665B]">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <h4 className="text-lg font-extrabold text-[#103C3A]">
                      {item.title}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.desc}
                    </p>

                    <div className="mt-5 h-0.5 w-8 rounded-full bg-[#D4A84F] transition-all duration-300 group-hover:w-14" />
                  </div>
                );
              })}
            </div>

            {/* Assistance note */}
            <div className="mt-5 flex gap-4 rounded-2xl border border-[#D4A84F]/40 bg-[#F0D99B]/20 p-5">
              <Headset
                size={25}
                className="mt-1 shrink-0 text-[#17665B]"
              />
              <div>
                <h4 className="font-bold text-[#103C3A]">
                  Need help getting started?
                </h4>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Our team can help you understand the information and
                  documentation you may need for your trucking operation.
                </p>
              </div>
            </div>
          </div>

          {/* Process timeline */}
          <div className="relative rounded-3xl bg-[#103C3A] p-6 text-white shadow-[0_25px_70px_rgba(16,60,58,0.16)] sm:p-9 lg:p-10">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#D4A84F]/10 blur-3xl" />

            <div className="relative mb-9 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                  How It Works
                </span>
                <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                  A Clear Path Forward
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                  Four practical steps to help you navigate your insurance
                  application.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-[#F0D99B] sm:flex">
                <FileText size={27} />
              </div>
            </div>

            <div className="relative space-y-7">
              <div className="absolute bottom-7 left-[19px] top-7 w-px bg-gradient-to-b from-[#D4A84F] via-white/20 to-transparent" />

              {steps.map((item, index) => (
                <div
                  key={item.number}
                  className="group relative flex gap-5"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4A84F]/60 bg-[#103C3A] text-xs font-black text-[#F0D99B] transition-colors duration-300 group-hover:bg-[#D4A84F] group-hover:text-[#103C3A]">
                    {item.number}
                  </div>

                  <div className="flex-1 border-b border-white/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-lg font-bold text-white">
                        {item.title}
                      </h4>
                      <CheckCircle2
                        size={19}
                        className="mt-1 shrink-0 text-[#D4A84F]/80"
                      />
                    </div>

                    <p className="mt-2 text-sm leading-7 text-white/65">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-9 border-t border-white/15 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white">
                    Ready to take the next step?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/60">
                    Start with a conversation about your requirements.
                  </p>
                </div>

                <a
                  href="/contact"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4A84F] text-[#103C3A] transition-all duration-300 hover:bg-[#F0D99B] hover:shadow-lg"
                  aria-label="Contact our team"
                >
                  <ArrowUpRight size={23} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[#103C3A]/10 pt-7 text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#17665B]" />
            Clear Guidance
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#17665B]" />
            Organized Documentation
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#17665B]" />
            Support for Trucking Businesses
          </span>
        </div>
      </div>
    </section>
  );
};