import React, { useState, useEffect } from "react";
import "./LoginSignUpFormForSmallScreens.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

const LoginSignUpFormForSmallScreens = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [SignUpFullName, setSignUpFullName] = useState("");
  const [SignUpPassword, setSignUpPassword] = useState("");
  const [SignUpEmail, setSignUpEmail] = useState("");
  const [SignUpUsername, setSignUpUsername] = useState("");
  const [SignUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  // eslint-disable-next-line
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);

  // Password tips
  const header = <div className="font-bold mb-3">Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => ({
          name: country.name.common,
          currency: country.currencies
            ? Object.values(country.currencies)[0].symbol
            : null,
        }));
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Validation functions
  const validateFullName = (fullName) => /^[a-zA-Z ]{3,}$/.test(fullName);
  const validateUsername = (username) =>
    /^[A-Za-z][A-Za-z0-9]*$/.test(username);
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle sign-up submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Full name validation
    if (!validateFullName(SignUpFullName)) {
      validationErrors.fullName =
        "Full Name must contain only alphabets and be at least 3 characters long.";
    }

    // Username validation
    if (!validateUsername(SignUpUsername)) {
      validationErrors.username =
        "Username should start with an alphabet and only contain alphabets or numbers.";
    }

    // Password validation
    if (!validatePassword(SignUpPassword)) {
      validationErrors.password =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    } else if (SignUpPassword !== SignUpConfirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.entries(validationErrors).forEach(([key, value]) => {
        toast.warn(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, {
          autoClose: 5000,
        });
      });
      return;
    }

    // Proceed with sign-up
    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: SignUpFullName,
          username: SignUpUsername,
          password: SignUpPassword,
          email: SignUpEmail,
          country: selectedCountry,
          currencySymbol,
        }),
      });

      if (response.ok) {
        toast.success("Signup successful!");
        setTimeout(() => {
          handleLoginSubmit(null, {
            username: SignUpUsername,
            password: SignUpPassword,
          });
        }, 2000);
      } else {
        toast.error("Signup failed!");
      }
    } catch {
      toast.error("Signup Failed! Server Side Issue.");
    }
  };

  // Handle login submission
  const handleLoginSubmit = async (e, userToLogin = null) => {
    // console.log("checking");

    if (e) e.preventDefault();
    const loginData = userToLogin || { username, password };

    // console.log("e ", loginData.username + " {{ " + loginData.password);

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUsername("");
        setPassword("");
        toast.success("Login successful!");
        setTimeout(() => {
          login();
          navigate("/");
        }, 2000);
      } else if (response.status === 403) {
        toast.warn("Invalid Username or Password!!");
      } else {
        toast.error("Login failed!");
      }
    } catch {
      toast.error("SignIn Failed! Server Side Issue.");
    }
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setSelectedCountry(selectedCountry);
    const selectedCountryData = countries.find(
      (country) => country.name === selectedCountry
    );
    setCurrencySymbol(selectedCountryData?.currency || "");
  };

  const handleSlideClick = (isSignupClick) => {
    setIsSignup(isSignupClick);
  };

  return (
    <div className="login-signup-form">
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />
      <div className="wrapper">
        <div className="title-text">
          <div
            className="title login"
            style={{ marginLeft: isSignup ? "-50%" : "0%" }}
          >
            Login Form
          </div>
          <div className="title signup">Signup Form</div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input
              type="radio"
              name="slide"
              id="login"
              checked={!isSignup}
              readOnly
            />
            <input
              type="radio"
              name="slide"
              id="signup"
              checked={isSignup}
              readOnly
            />
            <label
              htmlFor="login"
              className="slide login"
              onClick={() => setIsSignup(false)}
            >
              Login
            </label>
            <label
              htmlFor="signup"
              className="slide signup"
              onClick={() => setIsSignup(true)}
            >
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            {/* Login Form */}
            <form
              onSubmit={handleLoginSubmit}
              className="login"
              style={{ marginLeft: isSignup ? "-50%" : "0%" }}
            >
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <button type="submit">Sign In</button> */}
              <div className="pass-link">
                <a href="/forgot-password">Forgot password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Not a member?{" "}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSlideClick(true);
                  }}
                >
                  Signup now
                </a>
              </div>
            </form>

            {/* Signup Form */}
            <form onSubmit={handleSignUpSubmit} className="signup">
              <div className="field">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={SignUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email"
                  value={SignUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  value={SignUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  required
                />
              </div>

              <Password
                className="custom-password"
                placeholder="Password"
                value={SignUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                header={header}
                footer={footer}
                required
                toggleMask
              />

              <Password
                className="custom-password"
                placeholder="Confirm Password"
                value={SignUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                style={{ marginTop: "-0.3rem" }}
                header={header}
                footer={footer}
                required
                toggleMask
              />

              <div className="field">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  style={{ backgroundColor: "white", marginTop: "-0.3rem" }}
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpFormForSmallScreens;
