import React, { useEffect } from "react";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "./App.css";
import Header from "./components/common/Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  Home,
  Booking,
  AboutUs,
  Contact,
  PageNotFound,
  Room,
  RoomDetail,
  Services,
  Team,
  Testimonial,
  DashBoard,

} from "./pages/index";
import Footer from "./components/common/Footer";
import RoomList from "./components/dashboard/rooms/RoomList";
import RoomPage from "./pages/dashboard/RoomPage";
import CreateRoom from "./components/dashboard/rooms/CreateRoom";

export default function App() {


  return (
    <>
      <div>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking/:roomName" element={<Booking />} />
            <Route path="/team" element={<Team />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms" element={<Room />} />
            <Route path="/rooms/:roomName" element={<RoomDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/dashboard" element={<DashBoard />}>

              <Route path="rooms" element={<RoomPage />}>
                <Route index element={<RoomList />} />
                <Route path="list" element={<RoomList />} />
                <Route path="add" element={<CreateRoom />} />
                <Route path=":roomId'" element={<RoomDetail />} />
                <Route path="remove" />
              </Route>
            </Route>
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </>
  );
}
