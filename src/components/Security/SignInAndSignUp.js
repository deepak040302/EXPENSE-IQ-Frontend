import React, { useState, useEffect } from "react";
import "./SignUpSignIn.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

const SignUpSignIn = () => {
  const { login } = useAuth();
  const naviagte = useNavigate();
  const [isRightPanelActive, setRightPanelActive] = useState(false);
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

  // for login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // for sign-up
  const [SignUpFullName, setSignUpFullName] = useState("");
  const [SignUpPassword, setSignUpPassword] = useState("");
  const [SignUpEmail, setSignUpEmail] = useState("");
  const [SignUpUsername, setSignUpUsername] = useState("");
  const [SignUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  // for validation errors
  const [errors, setErrors] = useState({});

  // Countries state
  const [countries, setCountries] = useState([]);

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  // Fetch country list on component mount
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
  const validateFullName = (fullName) => {
    return /^[a-zA-Z ]{3,}$/.test(fullName);
  };

  const validateUsername = (username) => {
    return /^[A-Za-z][A-Za-z0-9]*$/.test(username);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    console.log("name " + SignUpFullName);
    console.log("email " + SignUpEmail);
    console.log("username " + SignUpUsername);
    console.log("pass " + SignUpPassword);
    console.log("count " + selectedCountry);
    console.log("symbol " + currencySymbol);
    console.log();

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
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. Abcdef@012";
    } else {
      if (SignUpPassword !== SignUpConfirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match.";
      }
    }

    // If any validation errors exist, update state and show error toast
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      for (const [key, value] of Object.entries(errors)) {
        toast.warn(
          key.toString().charAt(0).toUpperCase() + key.slice(1) + " : " + value,
          {
            autoClose: 5000,
          }
        );
      }
      return;
    }

    // Proceed with form submission
    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: SignUpFullName,
          username: SignUpUsername,
          password: SignUpPassword,
          email: SignUpEmail,
          country: selectedCountry,
          currencySymbol: currencySymbol,
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
    } catch (e) {
      toast.error("Signup Failed!");
      toast.error("Server Side Issue. Please try after sometime.");
    }
  };

  const handleLoginSubmit = async (e, userToLogin = null) => {
    // e.preventDefault();
    if (e) e.preventDefault();

    const loginData = userToLogin || { username, password };
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUsername("");
        setPassword("");
        toast.success("Login successful!");
        setTimeout(() => {
          login(); // Call login function from context
          naviagte("/");
        }, 2000);
      } else if (response.status === 403) {
        toast.warn("Invalid Username or Password !!");
      } else {
        toast.error("Login failed!");
      }
    } catch (e) {
      toast.error("SignIn Failed!");
      toast.error("Server Side Issue. Please try after sometime.");
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setSelectedCountry(selectedCountry);

    // Find the corresponding currency symbol
    const selectedCountryData = countries.find(
      (country) => country.name === selectedCountry
    );
    if (selectedCountryData && selectedCountryData.currency) {
      setCurrencySymbol(selectedCountryData.currency); // Set currency symbol
    } else {
      setCurrencySymbol(""); // Set default or empty if no currency symbol
    }
  };

  return (
    <div className="login-sign-up-body">
      <ToastContainer position="top-right" autoClose={1500} />

      <div
        className={`login-container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="login-container"
      >
        <div className="login-form-container sign-up-container">
          <form className="login-form" onSubmit={handleSignUpSubmit}>
            <h1 className="login-h1" style={{ margin: "1rem" }}>
              Create new account
            </h1>
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={SignUpFullName}
              onChange={(e) => setSignUpFullName(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={SignUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="text"
              placeholder="Create a Username"
              value={SignUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
              required
              toogleMask
            />

            <Password
              placeholder="Create a password"
              value={SignUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              header={header}
              footer={footer}
              toggleMask
              required
            />

            <Password
              placeholder="Confirm Password"
              value={SignUpConfirmPassword}
              onChange={(e) => setSignUpConfirmPassword(e.target.value)}
              header={header}
              footer={footer}
              toggleMask
              required
            />

            {/* Country Dropdown */}
            <select
              className="login-input"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              <option value=""> Select Country </option>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <button
              className="login-button"
              type="submit"
              style={{ margin: "1rem" }}
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="login-form-container login-sign-in-container">
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <h1 className="login-h1" style={{ margin: "10px" }}>
              Sign in
            </h1>
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a className="login-a" href="/forgot-password">
              Forgot your password?
            </a>
            <button className="login-button" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="login-h1">Welcome Back !</h1>
              <p className="login-p">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="login-button ghost"
                id="signIn"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="login-h1">Hello, Friend !</h1>
              <p className="login-p">
                Enter your personal details and start journey with us
              </p>
              <button
                className="login-button ghost"
                id="signUp"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSignIn;
