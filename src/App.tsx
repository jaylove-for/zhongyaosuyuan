import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { GISDashboard } from "./pages/GISDashboard";
import { TraceabilityDashboard } from "./pages/TraceabilityDashboard";
import { VRMuseum } from "./pages/VRMuseum";
import { CapacityControl } from "./pages/CapacityControl";
import { LoginPage } from "./pages/LoginPage";
import { ProductDetail } from "./pages/ProductDetail";
import { CreateTrace } from "./pages/CreateTrace";
import { AdminDashboard } from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="gis" element={<GISDashboard />} />
          <Route path="traceability" element={<TraceabilityDashboard />} />
          <Route path="vr" element={<VRMuseum />} />
          <Route path="capacity" element={<CapacityControl />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="trace/create" element={<CreateTrace />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
