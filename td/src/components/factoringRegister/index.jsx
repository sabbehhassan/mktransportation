import { Link } from "react-router-dom";
import {
  FileText,
  Truck,
  CheckCircle2,
  ArrowUpRight,
  Wallet,
  Clock3,
  TrendingUp,
  ClipboardCheck,
  Handshake,
  CircleDollarSign,
} from "lucide-react";

export default function FactoringRegistration() {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Share Your Business Details",
      desc: "Prepare your carrier information, business documents, and the details requested by your chosen factoring company.",
    },
    {
      number: "02",
      icon: ClipboardCheck,
      title: "Complete the Review",
      desc: "The factoring provider reviews your application, business information, and any required supporting documents.",
    },
    {
      number: "03",
      icon: Handshake,
      title: "Review Your Agreement",
      desc: "Understand the provider's fees, terms, and services before deciding whether to proceed.",
    },
    {
      number: "04",
      icon: CircleDollarSign,
      title: "Start Managing Invoices",
      desc: "Once approved and onboarded, submit eligible invoices according to your provider's procedures.",
    },
  ];

  const benefits = [
    {
      icon: Wallet,
      title: "Improve Cash Flow",
      desc: "Access funds for eligible invoices without relying solely on standard payment cycles.",
    },
    {
      icon: Truck,
      title: "Support Daily Operations",
      desc: "Plan for fuel, maintenance, and other operating expenses with better cash-flow visibility.",
    },
    {
      icon: Clock3,
      title: "Reduce Payment Waiting",
      desc: "Invoice factoring may help you receive funds sooner than waiting for a customer's full payment term.",
    },
    {
      icon: TrendingUp,
      title: "Plan for Growth",
      desc: "Explore funding options that align with your workload, operating costs, and business goals.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--brand-light-gray)] py-20 text-[var(--brand-black)] sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-96 w-96 rounded-full bg-[var(--brand-gold)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-14 grid gap-7 lg:mb-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/50 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-black">
                Carrier Financial Support
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Keep Your Trucking
              <span className="mt-1 block text-brand-black">
                Business Moving Forward.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <div className="mb-4 h-1 w-16 rounded-full bg-[var(--brand-gold)]" />

            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Managing invoices and waiting for customer payments can put
              pressure on your operation. Explore factoring registration
              support to better understand your options and prepare for
              onboarding with a factoring provider.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Registration steps */}
          <div>
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-black">
                  The Process
                </span>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  From Application to Onboarding
                </h3>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-[var(--brand-gold)]">
                <ClipboardCheck size={25} />
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--brand-black)]/10 bg-white p-5 shadow-[0_8px_30px_rgba(8,9,11,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-gold)]/70 hover:shadow-[0_18px_38px_rgba(8,9,11,0.09)] sm:p-6"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[var(--brand-gold)] transition-colors group-hover:bg-[var(--brand-gold-dark)]" />

                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-[var(--brand-gold)] transition-colors duration-300 group-hover:bg-[var(--brand-gold-dark)]">
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black tracking-widest text-brand-black">
                            {item.number}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Registration Step
                          </span>
                        </div>

                        <h4 className="text-lg font-extrabold text-[var(--brand-black)]">
                          {item.title}
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="mt-1 hidden shrink-0 text-brand-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits panel */}
          <div className="space-y-5 lg:pt-1">
            <div className="relative overflow-hidden rounded-3xl bg-[var(--brand-black)] p-7 text-white shadow-[0_25px_70px_rgba(8,9,11,0.17)] sm:p-9">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[var(--brand-gold)]/15 blur-3xl" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--brand-gold)]/30 bg-white/5 text-[var(--brand-gold)]">
                  <CircleDollarSign size={29} />
                </div>

                <span className="mt-6 inline-flex rounded-full border border-[var(--brand-gold)]/35 bg-[var(--brand-gold)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                  Cash Flow Solutions
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                  More Clarity.
                  <span className="block text-[var(--brand-gold)]">
                    Better Cash-Flow Planning.
                  </span>
                </h3>

                <p className="mt-5 text-sm leading-8 text-white/75 sm:text-base">
                  Factoring providers may advance funds against eligible
                  invoices in exchange for fees. Comparing terms carefully
                  can help you choose an option that fits your trucking
                  business.
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-6">
                  <CheckCircle2
                    size={21}
                    className="shrink-0 text-[var(--brand-gold)]"
                  />

                  <p className="text-sm font-medium leading-6 text-white/85">
                    Understand the fees, advance rates, and contract terms
                    before signing.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <div className="rounded-3xl border border-[var(--brand-black)]/10 bg-white p-6 shadow-[0_12px_35px_rgba(8,9,11,0.05)] sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-black">
                  Business Advantages
                </span>

                <h3 className="mt-2 text-2xl font-black text-[var(--brand-black)]">
                  How Factoring May Help
                </h3>
              </div>

              <div className="space-y-5">
                {benefits.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex items-start gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)]/5 text-brand-black transition-colors duration-300 group-hover:bg-[var(--brand-black)] group-hover:text-[var(--brand-gold)]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h4 className="font-bold text-[var(--brand-black)]">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-sm leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-14 overflow-hidden rounded-3xl border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/20 p-7 sm:mt-16 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--brand-gold)]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-black">
                Ready to Get Started?
              </span>

              <h3 className="mt-3 text-2xl font-black leading-tight text-[var(--brand-black)] sm:text-3xl">
                Take the Next Step for Your Carrier Business.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Complete your carrier application and explore the next steps
                for getting your trucking operation ready.
              </p>
            </div>

            <Link
              to="/carrier-agreement"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[var(--brand-black)] px-7 py-4 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)] hover:shadow-xl"
            >
              Apply as Carrier
              <ArrowUpRight size={19} className="text-[var(--brand-gold)]" />
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-6 text-slate-500">
          Factoring availability, advance rates, fees, eligibility, and
          payment timing depend on the selected provider and the terms of
          your agreement.
        </p>
      </div>
    </section>
  );
};
