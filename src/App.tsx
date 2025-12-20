import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TripDetails from "./pages/TripDetails";
import TripMap from "./pages/TripMap";
import Gallery from "./pages/Gallery";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import UploadImage from "./pages/UploadImage";
import Blessings from "./pages/Blessings";
import AccessHistory from "./pages/AccessHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trip-details" element={<TripDetails />} />
                <Route path="/map" element={<TripMap />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/members" element={<Members />} />
                <Route path="/members/:uid" element={<MemberDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upload" element={<UploadImage />} />
                <Route path="/blessings" element={<Blessings />} />
                <Route path="/access-history" element={<AccessHistory />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
