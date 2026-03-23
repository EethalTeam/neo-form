import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appointment from "./pages/AppointmentForm";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Appointment />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
