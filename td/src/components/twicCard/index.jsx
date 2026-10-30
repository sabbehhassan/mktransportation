import {
  ShieldCheck,
  FileCheck2,
  UserCheck,
  ClipboardList,
  ArrowUpRight,
  CheckCircle2,
  Ship,
  Headset,
  Fingerprint,
} from "lucide-react";

export default function TwicCardAssistance() {
  const features = [
    {
      icon: ClipboardList,
      title: "Application Guidance",
      desc: "Understand the TWIC application process and learn which information you need to prepare.",
    },
    {
      icon: UserCheck,
      title: "Eligibility Information",
      desc: "Get guidance on the general eligibility requirements and identity verification process.",
    },
    {
      icon: Fingerprint,
      title: "Enrollment Preparation",
      desc: "Learn what to expect when scheduling enrollment, providing fingerprints, and completing identity checks.",
    },
    {
      icon: FileCheck2,
      title: "Document Checklist",
      desc: "Organize the required identification and supporting documents before your enrollment appointment.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Understand the Requirements",
      desc: "Review the TWIC program requirements and determine which identification documents apply to you.",
    },
    {
      number: "02",
      title: "Prepare Your Information",
      desc: "Gather your identity documents and the information needed to complete your application.",
    },
    {
      number: "03",
      title: "Apply and Complete Enrollment",
      desc: "Follow the official application process and complete the required enrollment procedures.",
    },
    {
      number: "04",
      title: "Track Your Application",
      desc: "Use official TWIC resources to check your application status and follow any further instructions.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F5F7F4] py-20 text-[#103C3A] sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-36 -top-28 h-96 w-96 rounded-full bg-[#D4A84F]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-28 h-96 w-96 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-14 grid gap-7 lg:mb-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/50 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
                TWIC Card Assistance
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Prepare for Your
              <span className="mt-1 block text-[#17665B]">
                TWIC Card Application.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <div className="mb-4 h-1 w-16 rounded-full bg-[#D4A84F]" />
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Planning to work in port facilities or other secure maritime
              locations? Get practical guidance on the Transportation Worker
              Identification Credential (TWIC) application and enrollment
              process.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Feature cards */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold sm:text-2xl">
                Know What to Expect
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

            {/* Information note */}
            <div className="mt-5 flex gap-4 rounded-2xl border border-[#D4A84F]/40 bg-[#F0D99B]/20 p-5">
              <Headset
                size={25}
                className="mt-1 shrink-0 text-[#17665B]"
              />

              <div>
                <h4 className="font-bold text-[#103C3A]">
                  Not sure where to begin?
                </h4>

                <p className="mt-1 text-sm leading-7 text-slate-600">
                  We can help you understand the application steps and
                  prepare for the official enrollment process.
                </p>
              </div>
            </div>
          </div>

          {/* Process panel */}
          <div className="relative overflow-hidden rounded-3xl bg-[#103C3A] p-6 text-white shadow-[0_25px_70px_rgba(16,60,58,0.16)] sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#D4A84F]/10 blur-3xl" />

            <div className="relative mb-9 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                  Application Roadmap
                </span>

                <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                  Your Next Steps
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                  A straightforward overview to help you prepare for the TWIC
                  application process.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-[#F0D99B] sm:flex">
                <Ship size={27} />
              </div>
            </div>

            <div className="relative space-y-7">
              <div className="absolute bottom-7 left-[19px] top-7 w-px bg-gradient-to-b from-[#D4A84F] via-white/20 to-transparent" />

              {steps.map((item) => (
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

            {/* CTA */}
            <div className="relative mt-9 border-t border-white/15 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white">
                    Need TWIC application guidance?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    Talk to our team about the next steps.
                  </p>
                </div>

                <a
                  href="/contact"
                  aria-label="Contact our team about TWIC assistance"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4A84F] text-[#103C3A] transition-all duration-300 hover:bg-[#F0D99B] hover:shadow-lg"
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
            Application Guidance
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#17665B]" />
            Enrollment Preparation
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#17665B]" />
            Clear Next Steps
          </span>
        </div>

        {/* Official information */}
        <p className="mt-6 text-center text-xs leading-6 text-slate-500">
          TWIC eligibility, enrollment, application decisions, and credential
          issuance are determined by the relevant official authorities.
          Assistance does not guarantee approval.
        </p>
      </div>
    </section>
  );
};