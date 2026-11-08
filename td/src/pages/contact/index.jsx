import { useState } from "react";
import axios from "axios";
import {
  Mail,
  MapPin,
  Clock3,
  ArrowUpRight,
  Headset,
  Send,
  CheckCircle2,
  Truck,
  MessageSquare,
  LoaderCircle,
} from "lucide-react";

import contactHero from "../../assets/images/contactus.png";
import {
  COMPANY_EMAIL,
  COMPANY_MAILING_ADDRESS,
  ADMIN_EMAIL,
} from "../../constants/companyDetails";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    if (status) setStatus(null);

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setStatus(null);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
        formData
      );

      setStatus({
        type: "success",
        message:
          response.data?.message ||
          "Your message has been sent successfully. Our team will contact you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus({
        type: "error",
        message:
          "We couldn't send your message right now. Please email our team directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Our Team",
      description: "Send us your questions or inquiries",
      value: COMPANY_EMAIL,
      href: `mailto:${COMPANY_EMAIL}`,
    },
    {
      icon: Mail,
      title: "Administration",
      description: "For administrative correspondence",
      value: ADMIN_EMAIL,
      href: `mailto:${ADMIN_EMAIL}`,
    },
    {
      icon: MapPin,
      title: "Our Mailing Address",
      description: "Get in touch with our business office",
      value: COMPANY_MAILING_ADDRESS,
      href: "https://www.google.com/maps/search/?api=1&query=PO+Box+419+Croydon+PA+19021",
    },
    {
      icon: Clock3,
      title: "Customer Support",
      description: "Here to help with your logistics questions",
      value: "Contact us for support availability",
      href: `mailto:${COMPANY_EMAIL}`,
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-[#103C3A]/15 bg-[#F7F9F7] px-4 py-3.5 text-sm text-[#103C3A] outline-none transition duration-300 placeholder:text-slate-400 hover:border-[#17665B]/50 focus:border-[#17665B] focus:bg-white focus:ring-4 focus:ring-[#17665B]/10";

  return (
    <main className="overflow-hidden bg-[#F5F7F4] text-[#103C3A]">
      {/* Hero */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-[#103C3A] sm:min-h-[480px] lg:min-h-[540px]">
        <img
          src={contactHero}
          alt="MK Transportation logistics"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#103C3A]/95 via-[#103C3A]/85 to-[#103C3A]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#103C3A]/70 via-transparent to-black/10" />

        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#D4A84F]/15 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F0D99B]/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F0D99B] backdrop-blur-md sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />
              We're Here to Help
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Let's Talk
              <span className="block text-[#F0D99B]">
                Logistics.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Have a question about our services, carrier support, or
              transportation solutions? Connect with our team and let's
              discuss how we can help your business move forward.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#D4A84F] px-6 py-4 text-sm font-extrabold text-[#103C3A] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#F0D99B]"
              >
                Send an Inquiry
                <ArrowUpRight size={19} />
              </a>

              <a
                href="mailto:contact@mktransportationgroup.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
              >
                <Mail size={18} />
                Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#D4A84F] via-[#F0D99B] to-transparent" />
      </section>

      {/* Contact section */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#17665B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#D4A84F]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Intro */}
          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/50 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#17665B]">
              <MessageSquare size={15} />
              Get in Touch
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              How Can We
              <span className="text-[#17665B]"> Help You?</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              From general inquiries to carrier-related questions, we're
              ready to hear from you. Choose your preferred contact method
              or send us a message using the form below.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            {/* Contact information */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                  <Headset size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Reach out to our team
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.title === "Our Mailing Address" ? "_blank" : undefined}
                      rel={item.title === "Our Mailing Address" ? "noreferrer" : undefined}
                      className="group flex items-start gap-4 rounded-2xl border border-[#103C3A]/10 bg-white p-5 shadow-[0_8px_28px_rgba(16,60,58,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/70 hover:shadow-[0_16px_35px_rgba(16,60,58,0.08)] sm:p-6"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B] transition-colors duration-300 group-hover:bg-[#17665B]">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-[#103C3A]">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {item.description}
                        </p>

                        <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#17665B]">
                          {item.value}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="mt-1 shrink-0 text-[#B28A35] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </a>
                  );
                })}
              </div>

              {/* Support panel */}
              <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#103C3A] p-6 text-white sm:p-7">
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A84F]/15 blur-2xl" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4A84F]/30 bg-white/5 text-[#F0D99B]">
                    <Truck size={23} />
                  </div>

                  <h4 className="mt-5 text-xl font-extrabold">
                    Let's Keep Your Business Moving
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    Tell us what you need, and our team will help direct
                    your inquiry to the appropriate contact.
                  </p>

                  <a
                    href="mailto:contact@mktransportationgroup.com"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#F0D99B] transition hover:text-white"
                  >
                    Contact Our Team
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div
              id="contact-form"
              className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-[#103C3A]/10 bg-white shadow-[0_25px_70px_rgba(16,60,58,0.09)]"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

              <div className="p-6 sm:p-9 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#B28A35]">
                      Send Us a Message
                    </span>

                    <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                      Start a Conversation
                    </h3>

                    <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                      Complete the form below with your details and
                      inquiry. We'll get back to you as soon as possible.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B] sm:flex">
                    <Send size={22} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {status && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                        status.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {status.type === "success" && (
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                      )}

                      <p>{status.message}</p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-bold text-[#103C3A]"
                    >
                      Full Name <span className="text-[#B28A35]">*</span>
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-bold text-[#103C3A]"
                      >
                        Email Address <span className="text-[#B28A35]">*</span>
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor="contact-phone"
                        className="mb-2 block text-sm font-bold text-[#103C3A]"
                      >
                        Phone Number <span className="text-[#B28A35]">*</span>
                      </label>

                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-sm font-bold text-[#103C3A]"
                    >
                      How Can We Help?{" "}
                      <span className="text-[#B28A35]">*</span>
                    </label>

                    <textarea
                      id="contact-message"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your inquiry..."
                      required
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#103C3A] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17665B] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Sending Your Message...
                      </>
                    ) : (
                      <>
                        Send Your Message
                        <ArrowUpRight
                          size={19}
                          className="text-[#F0D99B] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-6 text-slate-500">
                    Your information will be submitted to our team so we
                    can respond to your inquiry.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-[#103C3A]/10 bg-white p-3 shadow-[0_18px_50px_rgba(16,60,58,0.08)] sm:mt-16 sm:p-4">
            <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                  <MapPin size={22} />
                </div>

                <div>
                  <h3 className="font-extrabold">Our Mailing Location</h3>
                  <p className="mt-1 text-sm text-slate-500">
                      {COMPANY_MAILING_ADDRESS}
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=PO+Box+419+Croydon+PA+19021"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#17665B] hover:text-[#103C3A] sm:self-center"
              >
                Open in Maps
                <ArrowUpRight size={17} />
              </a>
            </div>

            <iframe
              title="MK Transportation Group mailing location in Croydon, Pennsylvania"
              src="https://www.google.com/maps?q=PO+Box+419+Croydon,+PA+19021&output=embed"
              className="h-[280px] w-full rounded-2xl border-0 sm:h-[360px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;