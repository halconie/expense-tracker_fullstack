import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="pt-24">Home</div>
      {/* <Dashboard /> */}
    </>
  );
};

export default Home;
