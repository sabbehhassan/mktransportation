import { CheckCircle2, Mail, Headset, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AgreementSuccessStep({ trackingId }) {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    navigate("/contact");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-[#F5F8F5] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#DCE7DF] bg-white shadow-[0_24px_70px_rgba(16,60,58,0.10)]">
        {/* Brand accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

        <div className="px-5 py-10 text-center sm:px-10 sm:py-12">
          {/* Success icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5EB]">
            <CheckCircle2
              size={46}
              strokeWidth={1.8}
              className="text-[#17665B]"
            />
          </div>

          {/* Success heading */}
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#103C3A] sm:text-3xl">
            Agreement Submitted Successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
            Your carrier agreement has been submitted successfully. Your
            Tracking ID has been sent to your registered email address.
          </p>

          {trackingId && (
            <div className="mt-6 rounded-xl border border-[#17665B]/20 bg-[#EAF4EF] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#61766E]">
                Agreement Tracking ID
              </p>
              <p className="mt-2 break-all text-lg font-black text-[#17665B]">
                {trackingId}
              </p>
            </div>
          )}

          {/* Email notice */}
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#D4A84F]/40 bg-[#FBF6E9] p-4 text-left sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4A84F]/20 text-[#806020]">
              <Mail size={22} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#72541D] sm:text-base">
                Check Your Email
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#806B43]">
                Please check your inbox for your Tracking ID. If you cannot find
                the email, check your Spam or Junk folder.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleContactSupport}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#103C3A] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#17665B] sm:flex-1"
            >
              <Headset size={18} />
              Contact Support
            </button>

            <button
              type="button"
              onClick={handleBackHome}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE7DF] bg-white px-5 py-3.5 text-sm font-bold text-[#103C3A] transition hover:border-[#17665B] hover:bg-[#F5F8F5] sm:flex-1"
            >
              <Home size={18} />
              Back to Home
            </button>
          </div>

          <p className="mt-6 text-xs leading-5 text-gray-400">
            Thank you for choosing MK Transportation.
          </p>
        </div>
      </div>
    </div>
  );
}
