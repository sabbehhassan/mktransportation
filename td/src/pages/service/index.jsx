import {
  FaTruckMoving,
  FaRoute,
  FaClipboardCheck,
  FaArrowRight,
  FaCheckCircle,
  FaTrailer,
  FaHandshake,
} from "react-icons/fa";
import RentedTrailerProgram from "../../components/rentalTrailer";
import InsuranceApplicationAssistance from "../../components/insuranceApplication";
import TwicCardAssistance from "../../components/twicCard";
import FactoringRegistration from "../../components/factoringRegister";

import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import heroBg from "../../assets/servicesvid.mp4";
import serviceTruck from "../../assets/new/3.png";
const services = [
  {
    number: "01",
    category: "FREIGHT COORDINATION",
    icon: <FaRoute />,
    title: "Dedicated Lane Support",
    desc: "Keep recurring freight movements organized with lane-focused planning, clear communication, and coordination tailored to your transportation requirements.",
    tags: ["Lane Planning", "Freight Coordination"],
  },
  {
    number: "02",
    category: "LOAD OPPORTUNITIES",
    icon: <FaTruckMoving />,
    title: "Amazon Load Support",
    desc: "Navigate Amazon-related load opportunities with practical coordination and support designed around your freight and operational requirements.",
    tags: ["Load Coordination", "Carrier Support"],
  },
  {
    number: "03",
    category: "CONTRACT SUPPORT",
    icon: <FaClipboardCheck />,
    title: "Government Contract Assistance",
    desc: "Get guidance with transportation-related contract requirements and understand the next steps involved in preparing for freight opportunities.",
    tags: ["Requirements Guidance", "Process Support"],
  },
  {
    number: "04",
    category: "TRANSPORTATION RESOURCES",
    icon: <FaTrailer />,
    title: "Trailer & Carrier Solutions",
    desc: "Explore available transportation resources and support options that align with your equipment needs and business operations.",
    tags: ["Trailer Program", "Carrier Resources"],
  },
  {
    number: "05",
    category: "BUSINESS SUPPORT",
    icon: <FaHandshake />,
    title: "Logistics Business Assistance",
    desc: "Access support for selected logistics-related processes, helping you better understand administrative requirements and available next steps.",
    tags: ["Business Guidance", "Process Assistance"],
  },
];

const Services = () => {
  return (
    <main className="overflow-hidden bg-white text-[#103C3A]">
      {/* HERO — CINEMATIC FREIGHT */}
      <section className="relative isolate min-h-[600px] overflow-hidden bg-[#103C3A] lg:min-h-[690px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-label="Freight transportation in motion"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src={heroBg} type="video/mp4" />
        </video>

        <div className="absolute inset-0 -z-10 bg-[#103C3A]/65" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#103C3A]/95 via-[#103C3A]/75 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#103C3A]/80 via-transparent to-[#103C3A]/20" />

        <div className="mx-auto flex min-h-[600px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:min-h-[690px] lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 border-l-2 border-[#D4A84F] bg-white/10 px-4 py-3 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                Transportation Solutions
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              The right support
              <br />
              for every
              <span className="text-[#F0D99B]"> mile.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              From dedicated lanes to logistics business assistance, discover
              practical services designed around the demands of freight
              transportation.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#service-catalog"
                className="inline-flex items-center gap-3 bg-[#D4A84F] px-7 py-4 text-sm font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B]"
              >
                Explore Our Services
                <FaArrowRight />
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-white/40 px-7 py-4 text-sm font-bold text-white transition hover:border-[#F0D99B] hover:text-[#F0D99B]"
              >
                Discuss Your Needs
                <FiArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6">
              {[
                "Freight Coordination",
                "Carrier Resources",
                "Business Assistance",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-white/80"
                >
                  <FaCheckCircle className="text-[#D4A84F]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#17665B] via-[#D4A84F] to-[#17665B]" />
      </section>

      {/* EDITORIAL INTRO */}
      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1fr] md:items-end lg:px-10 lg:py-20">
        <div>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#17665B]">
            <span className="h-px w-9 bg-[#D4A84F]" />
            What We Bring to the Table
          </p>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Every operation has different demands.
          </h2>
        </div>

        <div className="md:justify-self-end md:pl-8">
          <p className="max-w-xl text-base leading-8 text-slate-600">
            That's why our services focus on specific parts of the
            transportation process. Explore the options below to find support
            that fits your business requirements.
          </p>
        </div>
      </section>

      {/* SERVICE CATALOG — ALTERNATING LAYOUT */}
      <section
        id="service-catalog"
        className="bg-[#F5F8F6] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#103C3A]/15 pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#17665B]">
                Service Directory
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Find your next solution.
              </h2>
            </div>

            <span className="text-sm font-semibold text-slate-500">
              Our service capabilities
            </span>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <article
                key={service.number}
                className="group relative grid overflow-hidden border border-[#103C3A]/10 bg-white transition duration-300 hover:border-[#D4A84F]/70 hover:shadow-xl hover:shadow-[#103C3A]/5 md:grid-cols-[100px_1fr_auto] md:items-center"
              >
                {/* Number / icon */}
                <div className="flex items-center justify-between border-b border-[#103C3A]/10 bg-[#103C3A] px-6 py-5 md:h-full md:flex-col md:justify-center md:border-b-0 md:px-4">
                  <span className="text-xs font-extrabold tracking-widest text-[#F0D99B]">
                    {service.number}
                  </span>

                  <span className="text-2xl text-white md:mt-5">
                    {service.icon}
                  </span>
                </div>

                {/* Text */}
                <div className="min-w-0 p-6 sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#17665B] sm:text-xs">
                    {service.category}
                  </p>

                  <h3 className="mt-3 text-xl font-extrabold text-[#103C3A] sm:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    {service.desc}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[#103C3A]/10 bg-[#F5F8F6] px-3 py-1.5 text-xs font-semibold text-[#17665B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between border-t border-[#103C3A]/10 px-6 py-4 md:h-full md:flex-col md:justify-center md:border-l md:border-t-0 md:px-5">
                  <span className="text-xs font-semibold text-slate-500 md:hidden">
                    Learn more
                  </span>

                  <Link
                    to="/contact"
                    aria-label={`Ask about ${service.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#103C3A]/15 text-[#103C3A] transition duration-300 hover:border-[#D4A84F] hover:bg-[#D4A84F] group-hover:border-[#D4A84F]"
                  >
                    <FiArrowUpRight size={20} />
                  </Link>
                </div>

                <div
                  className={`absolute bottom-0 left-0 h-1 bg-[#D4A84F] transition-all duration-500 ${
                    index % 2 === 0
                      ? "w-0 group-hover:w-full"
                      : "w-0 group-hover:w-2/3"
                  }`}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICE — SPLIT VISUAL */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid overflow-hidden bg-[#103C3A] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden sm:min-h-[450px]">
            <img
              src={serviceTruck}
              alt="Truck used to illustrate freight transportation services"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#103C3A]/60 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 border border-white/20 bg-[#103C3A]/85 px-4 py-3 backdrop-blur-md sm:bottom-8 sm:left-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F0D99B]">
                Built Around Your Needs
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F0D99B]">
              A More Personal Approach
            </p>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Logistics should work for your business.
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
              No two transportation requirements are exactly alike. Our approach
              starts with understanding your priorities, identifying the support
              you need, and discussing the practical steps available for your
              operation.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Discuss your freight requirements",
                "Identify relevant service options",
                "Understand the next steps",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-white/90"
                >
                  <FaCheckCircle className="mt-1 shrink-0 text-[#D4A84F]" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="mt-9 inline-flex w-fit items-center gap-3 bg-[#D4A84F] px-6 py-4 text-sm font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B]"
            >
              Talk to Our Team
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* SPECIALIZED SUPPORT */}
      <section className="border-y border-[#103C3A]/10 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#17665B]">
              Additional Resources
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Support beyond the load.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              Explore additional programs and assistance for selected
              transportation, documentation, insurance, and business
              administration needs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Rented Trailer Program",
                description:
                  "Explore trailer rental options and related program information.",
              },
              {
                number: "02",
                title: "TWIC Card Assistance",
                description:
                  "Review guidance for the TWIC-related application process.",
              },
              {
                number: "03",
                title: "Insurance Application",
                description:
                  "Get assistance understanding insurance application steps.",
              },
              {
                number: "04",
                title: "Factoring Registration",
                description:
                  "Explore registration support and related business requirements.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="border-t-2 border-[#D4A84F] bg-[#F5F8F6] p-6 transition hover:bg-[#EDF3EF] sm:p-7"
              >
                <span className="text-xs font-extrabold tracking-widest text-[#17665B]">
                  {item.number}
                </span>

                <h3 className="mt-5 text-lg font-extrabold leading-snug text-[#103C3A]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17665B]">
                  Program Details
                  <FaArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXISTING FUNCTIONAL COMPONENTS */}
      <div className="bg-[#F7F9F7]">
        <RentedTrailerProgram />
        <InsuranceApplicationAssistance />
        <TwicCardAssistance />
        <FactoringRegistration />
      </div>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden bg-[#103C3A] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-[#D4A84F]/25" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F0D99B]">
                Your Next Move Starts Here
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Let's discuss what your operation needs.
              </h2>

              <p className="mt-5 leading-7 text-white/70">
                Tell us about your transportation requirements and explore which
                services may be the right fit.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex w-fit shrink-0 items-center gap-3 bg-[#D4A84F] px-7 py-4 text-sm font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B]"
            >
              Contact Us
              <FaArrowRight />
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#17665B] via-[#D4A84F] to-[#17665B]" />
        </div>
      </section>
    </main>
  );
};

export default Services;
