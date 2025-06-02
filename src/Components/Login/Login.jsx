import { useContext, useEffect, useState } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
// import { AuthContext } from '../../Provider/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { AuthContext } from '../AuthProvider/AuthProvider';
import SocialLogin from '../SocialLogin/SocialLogin';
// import SocialLogin from '../../SocialLogin/SocialLogin';


const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [disable, setDisable] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Loading state

  const handleLogin = event => {
    console.log('hello')
    event.preventDefault();
    setIsLoggingIn(true); // Start loading
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const value = { email, password };
    console.log(value);

    signIn(email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Login success",
          showConfirmButton: false,
          timer: 1100
        });
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.error(error)
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Invalid user and password",
          showConfirmButton: false,
          timer: 1100
        });
      })
      .finally(() => {
        setIsLoggingIn(false); // End loading
      });
  }

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, [])

  const handleValidateCaptcha = (e) => {
    const user_captcha_value = e.target.value;
    if (validateCaptcha(user_captcha_value)) {
      setDisable(false);
    }
    else {
      setDisable(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-r from-[#b56ac8] to-[#3d1d46]">
      <div className="flex flex-col items-center w-full max-w-6xl gap-10 lg:flex-row">

        {/* left side: Form */}
        <div className="w-full shadow-2xl lg:w-1/2 card shrink-0 bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <div className="grid grid-cols-1 gap-6">
              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>

              {/* CAPTCHA */}
              <div className="form-control">
                <label className="label">
                  <LoadCanvasTemplate />
                </label>
                <input
                  onBlur={handleValidateCaptcha}
                  type="text"
                  name="captcha"
                  placeholder="Type the text above"
                  className="input input-bordered"
                  required
                />
                <p className="mt-2 btn btn-outline btn-xs">Validate</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 form-control">
              <button
                disabled={disable || isLoggingIn}
                type="submit"
                className="flex items-center justify-center gap-2 btn btn-primary"
              >
                {isLoggingIn ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          {/* Social Login */}
          <SocialLogin />

          {/* Register Redirect */}
          <p className="pb-5 text-center">
            Don't have an account? Please{" "}
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </div>

        {/* right side: Title and Info */}
        <div className="text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-4 text-5xl font-bold text-gray-300">Login now!</h1>
          <h2 className="mb-4 text-3xl font-semibold text-amber-300 ">Welcome Back</h2>

          <p className="text-base leading-relaxed text-gray-200">
            Enter your credentials to access your Microworker account. If you don’t have an account yet,
            you can register and start completing microjobs or posting tasks today!
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
