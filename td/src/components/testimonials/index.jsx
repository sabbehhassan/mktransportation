import { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";

const reviews = [
  {
    name: "John Doe",
    role: "Amazon Partner",
    review:
      "We rely heavily on Amazon load deliveries, and MK Transportation has never let us down. Every shipment is handled with precision.",
  },
  {
    name: "Alessandro Daluz",
    role: "Logistics Client",
    review:
      "Their team understands transportation and freight operations. Communication is clear, and planning is handled professionally.",
  },
  {
    name: "Michael Smith",
    role: "Freight Partner",
    review:
      "Dedicated lane coordination has made our transportation planning more organized. The team is responsive and easy to work with.",
  },
  {
    name: "Sarah Wilson",
    role: "Government Contractor",
    review:
      "The logistics coordination process was organized and professional, with clear communication throughout our interactions.",
  },
  {
    name: "Gysin David",
    role: "Business Owner",
    review:
      "The team is helpful, responsive, and focused on making freight coordination easier for our business.",
  },
  {
    name: "Emma Johnson",
    role: "Transport Manager",
    review:
      "Their organized approach to logistics planning and timely communication helps make day-to-day coordination smoother.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);

  const goPrevious = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, []);

  const featured = reviews[currentIndex];

  const secondaryReviews = [
    reviews[(currentIndex + 1) % reviews.length],
    reviews[(currentIndex + 2) % reviews.length],
  ];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#D4A84F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-7 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#17665B]">
              <span className="h-px w-9 bg-[#D4A84F]" />
              Client Stories
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#103C3A] sm:text-5xl lg:text-6xl">
              Good business
              <br />
              <span className="text-[#17665B]">moves on trust.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Strong logistics starts with strong relationships. Discover the
              experiences shared by our clients and transportation partners.
            </p>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-3">
            <span className="mr-2 text-sm font-semibold text-slate-500">
              <span className="text-[#103C3A]">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(reviews.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#103C3A]/15 bg-white text-[#103C3A] transition hover:border-[#17665B] hover:bg-[#17665B] hover:text-white"
            >
              <FiArrowLeft size={19} />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#103C3A] text-white transition hover:bg-[#17665B]"
            >
              <FiArrowRight size={19} />
            </button>
          </div>
        </div>

        {/* Featured testimonial */}
        <article
          key={featured.name}
          className="relative grid overflow-hidden rounded-[28px] bg-[#103C3A] shadow-xl shadow-[#103C3A]/10 md:grid-cols-[0.8fr_1.5fr]"
        >
          {/* Left identity panel */}
          <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#17665B] p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-5 -top-5 h-36 w-36 rounded-full border border-[#F0D99B]/20" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0D99B]">
                <FiCheck size={13} />
                Client perspective
              </span>
            </div>

            <div className="relative mt-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0D99B] text-2xl font-extrabold text-[#103C3A] shadow-lg">
                {featured.name.charAt(0)}
              </div>

              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {featured.name}
              </h3>

              <p className="mt-2 text-sm text-white/70">{featured.role}</p>

              <div className="mt-5 flex gap-1 text-[#F0D99B]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
            </div>
          </div>

          {/* Quote panel */}
          <div className="relative flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <FaQuoteLeft
              aria-hidden="true"
              className="mb-7 text-4xl text-[#D4A84F] sm:text-5xl"
            />

            <blockquote className="text-xl font-medium leading-9 text-white sm:text-2xl sm:leading-10 lg:text-3xl lg:leading-[1.5]">
              “{featured.review}”
            </blockquote>

            <div className="mt-9 flex items-center justify-between gap-4 border-t border-white/15 pt-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F0D99B]">
                  The relationship matters
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Built around communication and coordination.
                </p>
              </div>

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4A84F]/40 text-[#F0D99B] sm:flex">
                <FiArrowUpRight size={21} />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#17665B] via-[#D4A84F] to-[#17665B]" />
        </article>

        {/* Supporting review cards */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {secondaryReviews.map((review) => (
            <button
              key={review.name}
              type="button"
              onClick={() =>
                setCurrentIndex(
                  reviews.findIndex((item) => item.name === review.name),
                )
              }
              className="group rounded-2xl border border-slate-200/80 bg-[#F8FAF9] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/70 hover:bg-white hover:shadow-xl hover:shadow-[#103C3A]/5 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1 text-[#D4A84F]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#17665B] transition group-hover:border-[#17665B] group-hover:bg-[#17665B] group-hover:text-white">
                  <FiArrowUpRight size={17} />
                </span>
              </div>

              <p className="mt-5 text-base leading-7 text-slate-600">
                “{review.review}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-base font-bold text-[#F0D99B]">
                  {review.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-[#103C3A]">
                    {review.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {review.role}
                  </p>
                </div>

                <span className="ml-auto hidden text-xs font-semibold text-[#17665B] sm:block">
                  Read story
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show testimonial ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-9 bg-[#17665B]"
                  : "w-2 bg-[#103C3A]/20 hover:bg-[#D4A84F]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
