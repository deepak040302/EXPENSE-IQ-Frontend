import React, { useState } from "react";
import "./LoginSignUpFormForSmallScreens.css";

const LoginSignUpFormForSmallScreens = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSlideClick = (isSignupClick) => {
    setIsSignup(isSignupClick);
  };

  return (
    <div className="login-signup-form">
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
              onClick={() => handleSlideClick(false)}
            >
              Login
            </label>
            <label
              htmlFor="signup"
              className="slide signup"
              onClick={() => handleSlideClick(true)}
            >
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form
              action="#"
              className="login"
              style={{ marginLeft: isSignup ? "-50%" : "0%" }}
            >
              <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Not a member?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSlideClick(true);
                  }}
                >
                  Signup now
                </a>
              </div>
            </form>
            <form action="#" className="signup">
              <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                />
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
