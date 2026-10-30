import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import ScrollToTop from "../components/scrollToTop";

import Home from "../pages/home";
import About from "../pages/about";
import Services from "../pages/service";
import Contact from "../pages/contact";
import PrivacyPolicy from "../pages/privacyPolicy";
import CarrierForm from "../components/CarrierAgreementModal";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TrackingPage from "../pages/tracking";

const withScrollToTop = (element) => (
  <>
    <ScrollToTop />
    {element}
  </>
);

const router = createBrowserRouter([
  // Carrier Form
  {
    path: "/carrier-form",
    element: <CarrierForm />,
  },

  // Admin Panel
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  
  // Main Website
  {
    path: "/",
    element: withScrollToTop(<MainLayout />),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "tracking",
        element: <TrackingPage />,
      }

    ],
  },
]);

export default router;
