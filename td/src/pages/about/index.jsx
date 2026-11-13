import {
  FaArrowRight,
  FaTruckMoving,
  FaHandshake,
  FaShieldAlt,
  FaRoute,
  FaBullseye,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import heroBg from "../../assets/images/aboutbg.png";
import storyImg from "../../assets/images/about-story.jpg";
import missionImg from "../../assets/images/about-mission.jpg";

const values = [
  {
    number: "01",
    icon: <FaHandshake />,
    title: "Partnership First",
    description:
      "We believe successful transportation starts with understanding our partners, their goals, and their operational needs.",
  },
  {
    number: "02",
    icon: <FaShieldAlt />,
    title: "Dependable Service",
    description:
      "Clear communication, thoughtful coordination, and a consistent approach help keep freight operations organized.",
  },
  {
    number: "03",
    icon: <FaRoute />,
    title: "Smarter Coordination",
    description:
      "We focus on practical transportation solutions designed around routes, freight requirements, and business priorities.",
  },
];

const highlights = [
  "Dedicated lane coordination",
  "Amazon load support",
  "Government contract assistance",
  "Responsive freight communication",
];

const About = () => {
  return (
    <main className="overflow-hidden bg-white text-[var(--brand-black)]">
      {/* HERO */}
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[var(--brand-black)] lg:min-h-[700px]">
        <img
          src={heroBg}
          alt="MK Transportation operations"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          fetchPriority="high"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--brand-black)]/95 via-[var(--brand-black)]/85 to-[var(--brand-black)]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--brand-black)]/70 via-transparent to-transparent" />

        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:min-h-[700px] lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--brand-gold)]/35 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Get to Know Us
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Moving Freight.
              <span className="mt-2 block text-[var(--brand-gold)]">Building Trust.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              At MK Transportation, we focus on practical freight
              coordination, responsive communication, and transportation
              solutions that help businesses keep moving.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--brand-gold)] px-7 py-4 text-sm font-extrabold text-[var(--brand-black)] transition duration-300 hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)]"
              >
                Let's Work Together
                <FaArrowRight />
              </Link>

              <a
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
              >
                Discover Our Story
                <FiArrowUpRight size={18} />
              </a>
            </div>
          </div>

          {/* Hero side card */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-tr-[35px] border-r-2 border-t-2 border-[var(--brand-gold)]" />

            <div className="relative ml-auto max-w-[390px] rounded-[30px] border border-white/20 bg-[var(--brand-black)]/65 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-2xl text-[var(--brand-black)]">
                <FaTruckMoving />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Our Approach
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white">
                Logistics with a clearer direction.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Practical planning, attentive communication, and a
                partnership-focused approach to freight coordination.
              </p>

              <div className="mt-7 h-px bg-white/15" />

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-white/80">
                  Every shipment matters
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[var(--brand-gold)]">
                  <FaArrowRight />
                </span>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-8 rounded-2xl border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)] px-5 py-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-black">
                Our priority
              </p>
              <p className="mt-1 font-extrabold text-[var(--brand-black)]">
                People. Freight. Trust.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />
      </section>

      {/* INTRO STRIP */}
      <section className="border-b border-[var(--brand-black)]/10 bg-[var(--brand-light-gray)]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-9 sm:px-8 md:grid-cols-3 lg:px-10">
          {[
            {
              title: "Freight Coordination",
              description: "Support built around your transportation needs.",
            },
            {
              title: "Clear Communication",
              description: "Keeping expectations and next steps aligned.",
            },
            {
              title: "Long-Term Partnerships",
              description:
                "Focused on trust and lasting working relationships.",
            },
          ].map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-sm font-extrabold text-[var(--brand-gold)]">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-extrabold text-[var(--brand-black)]">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section
        id="our-story"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28"
      >
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-28 w-28 rounded-tl-[30px] border-l-2 border-t-2 border-[var(--brand-gold)]" />

          <div className="relative overflow-hidden rounded-[28px] bg-[var(--brand-light-gray)]">
            <img
              src={storyImg}
              alt="The story behind MK Transportation"
              loading="lazy"
              className="h-[340px] w-full object-cover sm:h-[470px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--brand-black)]/90 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Our Story
              </p>
              <p className="mt-2 max-w-sm text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                Every great journey starts with a trusted partner.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-3 h-24 w-24 rounded-br-[30px] border-b-2 border-r-2 border-[var(--brand-gold)] sm:-right-5" />
        </div>

        <div>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black">
            <span className="h-px w-9 bg-[var(--brand-gold)]" />
            Who We Are
          </p>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            More than moving freight.{" "}
            <span className="text-brand-black">We're building connections.</span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            MK Transportation is focused on helping businesses navigate
            freight coordination with a practical, service-oriented approach. We
            understand that transportation is more than getting a load from one
            place to another. It requires communication, planning, and
            dependable working relationships.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Our goal is to make logistics easier to manage by listening to our
            partners, understanding their requirements, and working toward
            transportation solutions that fit their operations.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "A partner-focused approach",
              "Solutions tailored to freight requirements",
              "Communication throughout coordination",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <FaCheckCircle className="mt-1 shrink-0 text-brand-black" />
                <span className="text-sm font-semibold text-[var(--brand-black)] sm:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-9 inline-flex items-center gap-3 border-b-2 border-[var(--brand-gold)] pb-2 font-extrabold text-[var(--brand-black)] transition hover:gap-5"
          >
            Start a Conversation
            <FaArrowRight className="text-brand-black" />
          </Link>
        </div>
      </section>

      {/* WHAT WE FOCUS ON */}
      <section className="bg-[var(--brand-light-gray)] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black">
                <span className="h-px w-9 bg-[var(--brand-gold)]" />
                What We Do
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Focused on the details that keep freight moving.
              </h2>
            </div>

            <p className="max-w-xl leading-8 text-slate-600 lg:justify-self-end">
              Different freight requirements call for different approaches. We
              focus on understanding the job, coordinating the details, and
              helping our partners navigate their transportation needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Dedicated Lanes",
                description:
                  "Coordination focused on lane requirements, planning, and consistent communication.",
              },
              {
                number: "02",
                title: "Amazon Loads",
                description:
                  "Support for Amazon-related freight opportunities and transportation coordination.",
              },
              {
                number: "03",
                title: "Government Contracts",
                description:
                  "Assistance navigating transportation requirements for government-related opportunities.",
              },
              {
                number: "04",
                title: "Partner Support",
                description:
                  "A responsive, relationship-first approach to freight communication and coordination.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="group relative overflow-hidden rounded-2xl border border-[var(--brand-black)]/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-gold)]/70 hover:shadow-xl hover:shadow-[var(--brand-black)]/5 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-[var(--brand-gold)]">
                    {item.number}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-black)] text-[var(--brand-gold)] transition group-hover:bg-[var(--brand-gold-dark)]">
                    <FaArrowRight />
                  </span>
                </div>

                <h3 className="mt-9 text-xl font-extrabold text-[var(--brand-black)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--brand-gold)] transition-all duration-300 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
        <div>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black">
            <span className="h-px w-9 bg-[var(--brand-gold)]" />
            Our Direction
          </p>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Clear purpose. Thoughtful service.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Our mission and vision guide the way we approach every
            transportation relationship.
          </p>

          <div className="mt-9 space-y-5">
            <div className="flex gap-5 rounded-2xl border border-[var(--brand-black)]/10 bg-[var(--brand-light-gray)] p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-xl text-[var(--brand-gold)]">
                <FaBullseye />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">Our Mission</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  To simplify freight coordination through responsive
                  communication, practical planning, and service built around
                  our partners' transportation needs.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-2xl border border-[var(--brand-black)]/10 bg-[var(--brand-light-gray)] p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-gold)] text-xl text-[var(--brand-black)]">
                <FaEye />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">Our Vision</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  To build lasting logistics partnerships recognized for
                  thoughtful coordination, transparency, and a dependable
                  approach to transportation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-bl-[30px] border-b-2 border-l-2 border-[var(--brand-gold)]" />

          <div className="relative overflow-hidden rounded-[28px]">
            <img
              src={missionImg}
              alt="MK Transportation mission and vision"
              loading="lazy"
              className="h-[360px] w-full object-cover sm:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-black)]/80 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                The Way We Work
              </p>
              <h3 className="mt-3 max-w-sm text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                Every detail deserves attention.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-[var(--brand-black)] py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--brand-gold)]">
              The Principles Behind Our Work
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Our values drive every connection.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">
              The way we communicate, plan, and work with our partners matters
              just as much as the transportation itself.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
            {values.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-white/15 bg-white/[0.04] p-7 transition duration-300 hover:border-[var(--brand-gold)]/60 hover:bg-white/[0.08] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-[var(--brand-gold)]">
                    {item.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-gold)] text-xl text-[var(--brand-black)]">
                    {item.icon}
                  </span>
                </div>

                <h3 className="mt-9 text-xl font-extrabold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="bg-[var(--brand-light-gray)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black">
              What You Can Expect
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              A practical approach to partnership.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[var(--brand-black)]/10 bg-white p-4"
              >
                <FaCheckCircle className="mt-1 shrink-0 text-brand-black" />
                <span className="text-sm font-bold leading-6 text-[var(--brand-black)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[var(--brand-black)] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-10 h-48 w-48 rounded-full border border-[var(--brand-gold)]/25" />
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Let's Move Forward
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Looking for a logistics partner?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Tell us about your transportation needs. Let's start a
                conversation about the right approach for your business.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[var(--brand-gold)] px-7 py-4 font-extrabold text-[var(--brand-black)] transition hover:-translate-y-1 hover:bg-[var(--brand-gold-dark)] md:self-center"
            >
              Contact Our Team
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
