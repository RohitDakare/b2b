// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import FlightSearch from "./components/FlightSearch";
import Contact from "./components/Contact";
import Blog from "./components/Blog";
import AdminPanel from "./pages/Admin"; // ✅ Correct import added
import FlightResults from "./components/FlightResults";
import BookingPage from "./components/BookingPage";
import BookingConfirmation from "./components/BookingConfirmation";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-0 m-0">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid gap-0">
                <FlightSearch />
                <Blog />
              </div>
            }
          />
          <Route
            path="/flights"
            element={
              <div className="grid gap-16">
                <FlightSearch />
                <Blog />
              </div>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/results" element={<FlightResults />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/" element={<FlightSearch />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
