import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaQuoteLeft } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from "react-icons/fi";

// Sample testimonial data
const reviews = [
  {
    id: 1,
    name: "Freya",
    role: "Amazon Partner",
    rating: 4.5,
    review:
      "Working with the team has been a great experience. Their communication, professionalism, and attention to detail made the entire process smooth and efficient.",
  },
  {
    id: 2,
    name: "Zaria Harriet",
    role: "Logistics Client",
    rating: 3.5,
    review:
      "The team provided reliable logistics support and helped us manage our transportation requirements with better coordination.",
  },
  {
    id: 3,
    name: "Autumn Kelley",
    role: "Freight Partner",
    rating: 4,
    review:
      "A professional team that understands freight operations. Their support and communication helped make our experience straightforward.",
  },
  {
    id: 4,
    name: "Sarah Harriet",
    role: "Government Contractor",
    rating: 3,
    review:
      "The overall experience was good. The team was helpful and provided the necessary assistance throughout the process.",
  },
  {
    id: 5,
    name: "Gysin David",
    role: "Business Owner",
    rating: 4.5,
    review:
      "Excellent service and professional communication. Their commitment to providing transportation solutions made a positive impression on our business.",
  },
  {
    id: 6,
    name: "Bode Farley",
    role: "Transport Manager",
    rating: 4,
    review:
      "A dependable transportation partner with a professional approach. We appreciated their coordination and support.",
  },
];

// Reusable star rating component
const RatingStars = ({ rating, size = 14 }) => {
  return (
    <div className="flex items-center gap-1 text-[#D4A84F]">
      {[...Array(5)].map((_, index) => {
        const difference = rating - index;

        return (
          <span key={index}>
            {difference >= 1 ? (
              <FaStar size={size} />
            ) : difference >= 0.5 ? (
              <FaStarHalfAlt size={size} />
            ) : (
              <FaStar size={size} className="text-white/20" />
            )}
          </span>
        );
      })}
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = reviews[currentIndex];

  const secondaryReviews = [
    reviews[(currentIndex + 1) % reviews.length],
    reviews[(currentIndex + 2) % reviews.length],
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#103C3A] px-5 py-20 md:px-10 lg:px-20">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#17665B]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#D4A84F]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#D4A84F]/30 bg-[#D4A84F]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[3px] text-[#F0D99B]">
            Testimonials
          </span>

          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            What Our Clients <span className="text-[#D4A84F]">Say</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            Discover what our partners and clients have to say about their
            experience working with us.
          </p>
        </div>

        {/* Testimonials Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Featured Testimonial */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-md transition duration-500 hover:border-[#D4A84F]/40 md:p-10">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4A84F]/15 text-[#D4A84F]">
                  <FaQuoteLeft size={20} />
                </div>

                <span className="text-xs font-medium tracking-widest text-white/40">
                  FEATURED REVIEW
                </span>
              </div>

              <p className="min-h-[140px] text-lg leading-9 text-white/90 transition-all duration-300 md:text-xl">
                "{featured.review}"
              </p>

              <div className="mt-7">
                <RatingStars rating={featured.rating} size={16} />

                <p className="mt-2 text-xs text-white/60">
                  {featured.rating.toFixed(1)} out of 5
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {featured.name}
                </h3>

                <p className="mt-1 text-sm text-[#F0D99B]">{featured.role}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#D4A84F] hover:bg-[#D4A84F] hover:text-[#103C3A]"
                >
                  <FiChevronLeft size={21} />
                </button>

                <button
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#D4A84F] hover:bg-[#D4A84F] hover:text-[#103C3A]"
                >
                  <FiChevronRight size={21} />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Reviews */}
          <div className="flex flex-col gap-6">
            {secondaryReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-[#D4A84F]/40 md:p-7"
              >
                <div className="mb-5 flex items-center justify-between">
                  <FaQuoteLeft size={18} className="text-[#D4A84F]" />

                  <RatingStars rating={review.rating} size={13} />
                </div>

                <p className="text-sm leading-7 text-white/75">
                  "{review.review}"
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <div>
                    <h3 className="font-semibold text-white">{review.name}</h3>

                    <p className="mt-1 text-xs text-[#F0D99B]">{review.role}</p>
                  </div>

                  <FiArrowUpRight size={20} className="text-[#D4A84F]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="mt-10 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-9 bg-[#D4A84F]"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
