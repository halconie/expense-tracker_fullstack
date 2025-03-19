import React, { useState } from "react";
import logo from "../assets/logoMusicart.png";
import TextBox from "../components/TextBox";
import "../styles/login.css";
import Loader from "../components/Loader";
import { registerUser } from "../api/service";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Init states
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  // const [error, setError] = useState(""); // New state for handling error

  const navigate = useNavigate();

  // Improved validation with specific error messages
  /* const validateForm = () => {
    // Reset error state
    setError("");

    // Check for empty fields
    if (!name || !mobileNumber || !email || !password || !confirmPassword) {
      setError("All fields are mandatory!");
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be 10 digits.");
      return false;
    }

    // Password strength check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    // Password matching
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  }; */

  const register = (event) => {
    event.preventDefault();
    // Activate the loader
    setLoader(true);
    // Create a new user
    if (name !== "" && mobileNumber !== "" && email !== "" && password !== "") {
      if (password !== confirmPassword) {
        setLoader(false);
        alert("Passwords do not match");
      } else {
        setLoader(false);
        const user = {
          name: name,
          mobile: Number(mobileNumber),
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        };
        setName("");
        setEmail("");
        setMobileNumber("");
        setPassword("");
        setConfirmPassword("");
        registerUser(user)
          .then((req, res) => {
            // navigate("/");
            console.log(req.data);
            const { status, message } = req.data;
            console.log(status, message);
            if (status === "failed") {
              alert(message);
            } else {
              // alert(message);
              navigate("/");
            }
          })
          .catch((error) => {
            alert("Error in creating user " + error.message);
          });
      }
    } else {
      setLoader(false);
      alert("All fields are mandatory!");
    }
  };

  // Handle form submission
  /* const register = async (event) => {
    event.preventDefault();
    
    // First validate the form
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    // Activate the loader
    setLoader(true);
    
    // Create user object
    const user = {
      name: name,
      mobile: Number(mobileNumber),
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    
    try {
      // Make API call
      const response = await registerUser(user);
      const { status, message } = response.data;
      
      if (status === "failed") {
        // Show error message from server
        setError(message);
      } else {
        // Only clear form on success
        setName("");
        setEmail("");
        setMobileNumber("");
        setPassword("");
        setConfirmPassword("");
        
        // Navigate to login page on success
        navigate("/");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Registration error:", error);
      setError(`Registration failed: ${error.message || "Unknown error"}`);
    } finally {
      // Always turn off the loader when done
      setLoader(false);
    }
  }; */

  return (
    <div className="flex flex-col items-center">
      {loader && (
        <div className="z-10 absolute flex flex-row items-center justify-center h-full w-full">
          <Loader />
        </div>
      )}
      <div className="flex mt-12 sm:mt-6">
        {/* <img src={logo} alt="logo" className="inline w-10 h-10" /> */}
        <h1 className=" text-[#2E0052] text-3xl ml-1 flex flex-row items-center font-semibold">
          Expense Tracker
        </h1>
      </div>
      <form
        onSubmit={register}
        className="p-6 bg-white flex flex-col items-start border mt-12 sm:mt-6 border-[#D9D9D9] border-3px w-5/6 sm:w-1/3 rounded-xl"
      >
        <p className="text-2xl ml-2">Create Account</p>

        {/* Display error message if any */}
        {error && (
          <div className="w-full p-2 mt-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <TextBox
          text="text-md text-black"
          width="w-full"
          height="h-12"
          hint="Name"
          backgroundColor="bg-white"
          position="left-2 sm:left-3 top-2.5"
          border="border-gray border-2"
          span="px-1"
          input="px-3 sm:px-4"
          div="mt-8"
          type="text"
          setState={setName}
          value={name}
        />
        <TextBox
          text="text-md text-black"
          width="w-full"
          height="h-12"
          hint="Mobile Number"
          backgroundColor="bg-white"
          position="left-2 sm:left-3 top-2.5"
          border="border-gray border-2"
          span="px-1"
          input="px-3 sm:px-4"
          div="mt-6"
          type="tel"
          setState={setMobileNumber}
          value={mobileNumber}
        />
        <TextBox
          text="text-md text-black"
          width="w-full"
          height="h-12"
          hint="Email ID"
          backgroundColor="bg-white"
          position="left-2 sm:left-3 top-2.5"
          border="border-gray border-2"
          span="px-1"
          input="px-3 sm:px-4"
          div="mt-6"
          type="email"
          setState={setEmail}
          value={email}
        />
        <TextBox
          text="text-md text-black"
          width="w-full"
          height="h-12"
          hint="Password"
          backgroundColor="bg-white"
          position="left-2 sm:left-3 top-2.5"
          border="border-gray border-2"
          span="px-1"
          input="px-3 sm:px-4"
          div="mt-6"
          type="password"
          setState={setPassword}
          value={password}
        />
        <TextBox
          text="text-md text-black"
          width="w-full"
          height="h-12"
          hint="Confirm Password"
          backgroundColor="bg-white"
          position="left-2 sm:left-3 top-2.5"
          border="border-gray border-2"
          span="px-1"
          input="px-3 sm:px-4"
          div="mt-6"
          type="password"
          setState={setConfirmPassword}
          value={confirmPassword}
        />
        <button
          type="submit"
          className="w-full mb-4 text-white hover:text-[#2E0052] hover:border-[#2E0052] hover:border bg-[#2E0052] hover:bg-white rounded-lg h-12 mt-8"
        >
          Register
        </button>
        <p className="text-sm text-left mx-1">
          By creating an account, you agree to Expense Tracker's privacy notice and conditions of use.
        </p>
      </form>

      <div className="mt-8 text-xs md:text-sm sm:w-1/2 lg:w-1/3 flex items-center w-full md:px-1 px-9">
        <hr className="border-t w-full border-gray-300 flex-grow" />
        <span className="text-gray-500 w-full">Already have an account?</span>
        <hr className="border-t w-full border-gray-300 flex-grow" />
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-4/5 lg:w-1/3 sm:w-1/2 mb-4 text-[#2E0052] hover:text-white border-gray-700 border bg-white hover:bg-[#2E0052] rounded-lg h-12 mt-8"
      >
        Sign in to your account
      </button>

      <div className="relative bottom-0 bg-[#2E0052] flex flex-col items-center w-full h-10 pt-2">
        <span className="text-white">Expense Tracker | All rights reserved</span>
      </div>
    </div>
  );
};

export default Register;
