import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ContentMain from "./components/ContentMain";
import Features from "./components/Features";
import Motivation from "./components/Motivation";
import BuySection from "./components/BuySection";
import Footer from "./components/Footer";
import Success from "./components/Success";
import Canceled from "./components/Canceled";
import AuthPage from "./components/AuthPage";
import AccountPage from "./components/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <>
      <Header />
      <ContentMain />
      <Features />
      <Motivation />
      <BuySection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/cadastro" element={<AuthPage mode="register" />} />
        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/canceled" element={<Canceled />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
