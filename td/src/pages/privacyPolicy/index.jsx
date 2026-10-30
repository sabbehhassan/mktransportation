import {
  ShieldCheck,
  FileText,
  Database,
  Lock,
  Cookie,
  ChevronRight,
  Mail,
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  MessageSquare,
  Clock3,
  Users,
} from "lucide-react";

const sections = [
  { id: "intro", label: "Introduction", icon: FileText },
  { id: "collect", label: "Information We Collect", icon: Database },
  { id: "use", label: "How We Use Information", icon: Lock },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "sharing", label: "Information Sharing", icon: Users },
  { id: "international", label: "International Transfers", icon: Globe2 },
  { id: "security", label: "Data Security", icon: ShieldCheck },
  { id: "sms", label: "SMS Communication", icon: MessageSquare },
  { id: "retention", label: "Data Retention", icon: Clock3 },
  { id: "children", label: "Children's Privacy", icon: ShieldCheck },
  { id: "rights", label: "Your Privacy Rights", icon: CheckCircle2 },
  { id: "changes", label: "Policy Updates", icon: FileText },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const SectionHeading = ({ eyebrow, title, icon: Icon }) => (
  <div className="mb-6 flex items-start gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
      <Icon size={23} strokeWidth={1.8} />
    </div>

    <div>
      {eyebrow && (
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B28A35]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-black leading-tight text-[#103C3A] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 h-1 w-12 rounded-full bg-[#D4A84F]" />
    </div>
  </div>
);

const PolicyCard = ({ id, eyebrow, title, icon, children }) => (
  <section
    id={id}
    className="scroll-mt-28 rounded-2xl border border-[#103C3A]/10 bg-white p-6 shadow-[0_8px_30px_rgba(16,60,58,0.035)] transition-shadow duration-300 hover:shadow-[0_14px_35px_rgba(16,60,58,0.07)] sm:p-8 lg:p-9"
  >
    <SectionHeading eyebrow={eyebrow} title={title} icon={icon} />
    <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
      {children}
    </div>
  </section>
);

const BulletList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <CheckCircle2
          size={18}
          className="mt-1 shrink-0 text-[#17665B]"
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const InfoBox = ({ title, children, gold = false }) => (
  <div
    className={`rounded-xl border p-5 sm:p-6 ${
      gold
        ? "border-[#D4A84F]/35 bg-[#F0D99B]/15"
        : "border-[#103C3A]/10 bg-[#F5F7F4]"
    }`}
  >
    <h3 className="mb-4 font-extrabold text-[#103C3A]">{title}</h3>
    <div className="text-sm leading-7 text-slate-600">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7F4] text-[#103C3A]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#103C3A]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#D4A84F]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#17665B]/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/40 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F0D99B]">
              <ShieldCheck size={17} />
              Legal & Privacy Center
            </div>

            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Your Privacy.
              <span className="block text-[#F0D99B]">
                Our Responsibility.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Learn how MK Transportation LLC collects, uses, shares,
              and protects information when you visit our website or
              communicate with our team.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">
                <Lock size={17} className="text-[#F0D99B]" />
                Privacy Information
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">
                <FileText size={17} className="text-[#F0D99B]" />
                Last Updated: July 2026
              </div>
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-[#D4A84F] via-[#F0D99B] to-transparent" />
      </section>

      {/* Intro strip */}
      <section className="border-b border-[#103C3A]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8 lg:px-10">
          {[
            {
              icon: ShieldCheck,
              title: "Privacy & Protection",
              desc: "Understand our stated data protection practices.",
            },
            {
              icon: Database,
              title: "Information Practices",
              desc: "Learn what information may be collected and why.",
            },
            {
              icon: Mail,
              title: "Contact & Requests",
              desc: "Find out how to reach us about privacy matters.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#103C3A]/5 text-[#17665B]">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#103C3A]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Policy content */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10 lg:px-10">
        {/* Sticky navigation */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-[#103C3A]/10 bg-white shadow-[0_10px_35px_rgba(16,60,58,0.05)]">
            <div className="bg-[#103C3A] px-5 py-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                Navigate
              </p>
              <h2 className="mt-2 text-xl font-black">Policy Contents</h2>
            </div>

            <nav
              aria-label="Privacy policy contents"
              className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              {sections.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#F5F7F4] hover:text-[#17665B]"
                  >
                    <Icon
                      size={17}
                      className="shrink-0 text-[#B28A35]"
                    />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight
                      size={15}
                      className="shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </a>
                );
              })}
            </nav>

            <div className="border-t border-[#103C3A]/10 p-4">
              <a
                href="mailto:contact@mktransportationllc.com"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D4A84F] px-4 py-3 text-sm font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B]"
              >
                Ask a Privacy Question
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </aside>

        {/* Sections */}
        <div className="min-w-0 space-y-6">
          <PolicyCard
            id="intro"
            eyebrow="01 — Overview"
            title="Introduction"
            icon={FileText}
          >
            <p>
              MK Transportation LLC values your trust and is committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information whenever you interact with our website, submit
              forms, apply as a carrier, request transportation services,
              or communicate with our team.
            </p>
            <p>
              By accessing or using our website, you agree to the practices
              described in this Privacy Policy.
            </p>
          </PolicyCard>

          <PolicyCard
            id="collect"
            eyebrow="02 — Data Collection"
            title="Information We Collect"
            icon={Database}
          >
            <p>
              Depending on your interaction with our website, we may
              collect the following categories of information:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox title="Personal Information" gold>
                <BulletList
                  items={[
                    "Full Name",
                    "Business Name",
                    "Email Address",
                    "Phone Number",
                    "ZIP Code",
                    "Mailing Address",
                  ]}
                />
              </InfoBox>

              <InfoBox title="Carrier Information">
                <BulletList
                  items={[
                    "Equipment Type",
                    "Carrier Mobile Provider",
                    "Business Details",
                    "Application Information",
                    "Supporting Documents",
                  ]}
                />
              </InfoBox>
            </div>
          </PolicyCard>

          <PolicyCard
            id="use"
            eyebrow="03 — Purpose"
            title="How We Use Your Information"
            icon={Lock}
          >
            <p>We may use the information we collect to:</p>
            <BulletList
              items={[
                "Process carrier applications.",
                "Respond to inquiries and support requests.",
                "Verify business information.",
                "Improve website functionality.",
                "Send important service updates.",
                "Maintain compliance with applicable laws.",
              ]}
            />
          </PolicyCard>

          <PolicyCard
            id="cookies"
            eyebrow="04 — Website Technology"
            title="Cookies & Tracking Technologies"
            icon={Cookie}
          >
            <p>
              Our website may use cookies and similar technologies to
              improve user experience, analyze website traffic, remember
              user preferences, and enhance website performance. You may
              disable cookies through your browser settings, although some
              website features may not function properly.
            </p>
          </PolicyCard>

          <PolicyCard
            id="sharing"
            eyebrow="05 — Disclosure"
            title="Information Sharing & Disclosure"
            icon={ShieldCheck}
          >
            <p>
              MK Transportation LLC respects your privacy and does not
              sell your personal information. We only share your
              information when it is necessary to operate our business or
              comply with legal obligations.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox title="We May Share Information With">
                <BulletList
                  items={[
                    "Our employees and dispatch team",
                    "Technology and cloud service providers",
                    "Email communication providers",
                    "Payment processing partners",
                    "Legal authorities when required by law",
                    "Business partners involved in transportation services",
                  ]}
                />
              </InfoBox>

              <InfoBox title="Our Stated Commitments" gold>
                <BulletList
                  items={[
                    "We do not sell personal information.",
                    "We do not share information for unrelated marketing.",
                    "We seek to protect confidential business data.",
                    "We do not intentionally provide customer information to unauthorized parties.",
                  ]}
                />
              </InfoBox>
            </div>
          </PolicyCard>

          <PolicyCard
            id="international"
            eyebrow="06 — Cross-Border Processing"
            title="International Data Transfers"
            icon={Globe2}
          >
            <p>
              If you access our website outside the United States, your
              information may be transferred, processed, and stored on
              servers located in different countries. By using our
              services, you consent to such transfers where permitted by
              applicable laws.
            </p>
          </PolicyCard>

          <PolicyCard
            id="security"
            eyebrow="07 — Safeguards"
            title="Data Security"
            icon={Lock}
          >
            <p>
              We use appropriate administrative, technical, and physical
              safeguards to protect your personal information from
              unauthorized access, misuse, alteration, disclosure, or
              destruction.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox title="Security Measures">
                <BulletList
                  items={[
                    "Encrypted communications",
                    "Secure hosting infrastructure",
                    "Access control policies",
                    "Routine software updates",
                    "Internal security procedures",
                  ]}
                />
              </InfoBox>

              <InfoBox title="Important Notice" gold>
                While we implement security practices, no internet
                transmission or electronic storage method can be
                guaranteed as completely secure.
              </InfoBox>
            </div>
          </PolicyCard>

          <PolicyCard
            id="sms"
            eyebrow="08 — Messaging"
            title="SMS Communication"
            icon={MessageSquare}
          >
            <p>
              By providing your mobile phone number, you consent to receive
              SMS messages related to carrier applications, dispatch
              updates, service notifications, appointment reminders, and
              other business-related communications.
            </p>

            <InfoBox title="Your Choices" gold>
              <BulletList
                items={[
                  "You may opt out of SMS communications at any time.",
                  "Standard carrier messaging rates may apply.",
                  "Marketing messages will only be sent where permitted.",
                  "Operational service messages may still be required.",
                ]}
              />
            </InfoBox>
          </PolicyCard>

          <PolicyCard
            id="retention"
            eyebrow="09 — Storage"
            title="Data Retention"
            icon={Database}
          >
            <p>
              We retain your personal information only for as long as
              necessary to provide our services, comply with legal
              obligations, resolve disputes, enforce agreements, and
              maintain business records. When information is no longer
              required, it is securely deleted or anonymized whenever
              reasonably possible.
            </p>
          </PolicyCard>

          <PolicyCard
            id="children"
            eyebrow="10 — Age Requirements"
            title="Children's Privacy"
            icon={ShieldCheck}
          >
            <p>
              Our services are intended for individuals who are at least
              eighteen (18) years of age. We do not knowingly collect
              personal information from children under the age of 18. If
              we become aware that information from a child has been
              collected, we will take reasonable steps to delete it
              promptly.
            </p>
          </PolicyCard>

          <PolicyCard
            id="rights"
            eyebrow="11 — Individual Rights"
            title="Your Privacy Rights"
            icon={CheckCircle2}
          >
            <p>
              Depending on your location and applicable privacy laws, you
              may have certain rights regarding your personal information.
            </p>

            <InfoBox title="Your Rights May Include">
              <BulletList
                items={[
                  "Request access to your personal information.",
                  "Request correction of inaccurate information.",
                  "Request deletion of personal data where applicable.",
                  "Request restriction of certain processing activities.",
                  "Withdraw consent where legally permitted.",
                ]}
              />
            </InfoBox>

            <p>
              To exercise these rights, please contact us using the
              information provided below. We will respond within a
              reasonable timeframe in accordance with applicable laws.
            </p>
          </PolicyCard>

          <PolicyCard
            id="changes"
            eyebrow="12 — Revisions"
            title="Changes to This Privacy Policy"
            icon={FileText}
          >
            <p>
              MK Transportation LLC may update this Privacy Policy from
              time to time to reflect changes in our services, technology,
              legal requirements, or business practices. Any updates will
              be posted on this page together with the revised "Last
              Updated" date. We encourage you to review this Privacy Policy
              periodically.
            </p>
          </PolicyCard>

          {/* Contact panel */}
          <section
            id="contact"
            className="scroll-mt-28 overflow-hidden rounded-2xl bg-[#103C3A] shadow-[0_20px_55px_rgba(16,60,58,0.16)]"
          >
            <div className="relative p-6 sm:p-9 lg:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4A84F]/15 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4A84F]/30 bg-white/5 text-[#F0D99B]">
                  <Mail size={24} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F0D99B]">
                  13 — Contact & Support
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Questions About Your Privacy?
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                  If you have questions about this Privacy Policy or wish
                  to exercise your privacy rights, contact MK Transportation
                  Logistics LLC using the details below.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/15 bg-white/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F0D99B]">
                      Company
                    </p>
                    <p className="mt-2 font-bold text-white">
                      MK Transportation LLC
                    </p>

                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#F0D99B]">
                      Privacy Contact
                    </p>
                    <a
                      href="mailto:contact@mktransportationllc.com"
                      className="mt-2 block break-words text-sm font-semibold leading-6 text-white transition hover:text-[#F0D99B]"
                    >
                      contact@mktransportationllc.com
                    </a>

                    <a
                      href="mailto:michael@mktransportationllc.com"
                      className="mt-2 block break-words text-sm font-semibold leading-6 text-white/80 transition hover:text-[#F0D99B]"
                    >
                      michael@mktransportationllc.com
                    </a>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F0D99B]">
                      Business Hours
                    </p>
                    <p className="mt-2 font-bold text-white">
                      Monday – Friday
                    </p>

                    <p className="mt-2 text-sm leading-7 text-white/70">
                      Professional dispatch support. Response times may
                      vary depending on the nature of your inquiry.
                    </p>

                    <a
                      href="mailto:contact@mktransportationllc.com"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4A84F] px-4 py-3 text-sm font-extrabold text-[#103C3A] transition hover:bg-[#F0D99B]"
                    >
                      Contact Us
                      <ArrowUpRight size={17} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <p className="px-2 text-xs leading-6 text-slate-500">
            This page presents the privacy policy content supplied for
            this website. Please have the final policy reviewed for
            accuracy against your actual data practices and applicable
            legal requirements before publication.
          </p>
        </div>
      </div>
    </main>
  );
};