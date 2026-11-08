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
    <section className="relative overflow-hidden bg-[#F5F7F4] py-20 text-[#103C3A] sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-96 w-96 rounded-full bg-[#D4A84F]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-14 grid gap-7 lg:mb-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/50 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
                Carrier Financial Support
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Keep Your Trucking
              <span className="mt-1 block text-[#17665B]">
                Business Moving Forward.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <div className="mb-4 h-1 w-16 rounded-full bg-[#D4A84F]" />

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
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
                  The Process
                </span>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  From Application to Onboarding
                </h3>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                <ClipboardCheck size={25} />
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group relative overflow-hidden rounded-2xl border border-[#103C3A]/10 bg-white p-5 shadow-[0_8px_30px_rgba(16,60,58,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/70 hover:shadow-[0_18px_38px_rgba(16,60,58,0.09)] sm:p-6"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#D4A84F] transition-colors group-hover:bg-[#17665B]" />

                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B] transition-colors duration-300 group-hover:bg-[#17665B]">
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black tracking-widest text-[#B28A35]">
                            {item.number}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Registration Step
                          </span>
                        </div>

                        <h4 className="text-lg font-extrabold text-[#103C3A]">
                          {item.title}
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="mt-1 hidden shrink-0 text-[#B28A35] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits panel */}
          <div className="space-y-5 lg:pt-1">
            <div className="relative overflow-hidden rounded-3xl bg-[#103C3A] p-7 text-white shadow-[0_25px_70px_rgba(16,60,58,0.17)] sm:p-9">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#D4A84F]/15 blur-3xl" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4A84F]/30 bg-white/5 text-[#F0D99B]">
                  <CircleDollarSign size={29} />
                </div>

                <span className="mt-6 inline-flex rounded-full border border-[#D4A84F]/35 bg-[#D4A84F]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F0D99B]">
                  Cash Flow Solutions
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                  More Clarity.
                  <span className="block text-[#F0D99B]">
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
                    className="shrink-0 text-[#F0D99B]"
                  />

                  <p className="text-sm font-medium leading-6 text-white/85">
                    Understand the fees, advance rates, and contract terms
                    before signing.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <div className="rounded-3xl border border-[#103C3A]/10 bg-white p-6 shadow-[0_12px_35px_rgba(16,60,58,0.05)] sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#B28A35]">
                  Business Advantages
                </span>

                <h3 className="mt-2 text-2xl font-black text-[#103C3A]">
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
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#103C3A]/5 text-[#17665B] transition-colors duration-300 group-hover:bg-[#103C3A] group-hover:text-[#F0D99B]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h4 className="font-bold text-[#103C3A]">
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
        <div className="relative mt-14 overflow-hidden rounded-3xl border border-[#D4A84F]/40 bg-[#F0D99B]/20 p-7 sm:mt-16 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4A84F]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
                Ready to Get Started?
              </span>

              <h3 className="mt-3 text-2xl font-black leading-tight text-[#103C3A] sm:text-3xl">
                Take the Next Step for Your Carrier Business.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Complete your carrier application and explore the next steps
                for getting your trucking operation ready.
              </p>
            </div>

            <Link
              to="/carrier-agreement"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#103C3A] px-7 py-4 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#17665B] hover:shadow-xl"
            >
              Apply as Carrier
              <ArrowUpRight size={19} className="text-[#F0D99B]" />
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
