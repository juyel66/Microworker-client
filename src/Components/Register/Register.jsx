import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useContext, useState } from "react";
import userAxiosPublic from "../Hook/userAxiosPublic";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const axiosPublic = userAxiosPublic();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await createUser(data.email, data.password);
      const loggedUser = result.user;

      await updateUserProfile(data.name, "");

      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        photoURL: "",
        role: data.role,
      };

      const res = await axiosPublic.post("/users", userInfo);
      if (res.data.insertedId) {
        reset();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "User created successfully",
          showConfirmButton: false,
          timer: 1700,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-r from-[#3d1d46] to-[#b56ac8]">
      <div className="flex flex-col items-center w-full max-w-6xl gap-10 lg:flex-row">
        <div className="text-white lg:w-1/2">
          <h1 className="mb-4 text-5xl font-bold">Register Now</h1>
          <h2 className="mb-4 text-3xl font-semibold text-yellow-300">Microworker</h2>
          <p className="text-base leading-relaxed text-gray-100">
            Microworker is a dynamic and modern platform where users can easily find short tasks or microjobs posted by clients.
            Whether you're looking to earn from home or outsource quick digital tasks, Microworker connects workers and clients efficiently.
            Register now and join a growing community of smart workers!
          </p>
        </div>

        <div className="w-full bg-white shadow-2xl lg:w-1/2 card shrink-0 rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Name */}
              <div className="form-control">
                <label className="label"><span className="label-text">Name</span></label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Enter your name"
                  className="input input-bordered"
                />
                {errors.name && <span className="text-red-700">Name is required</span>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="email"
                  className="input input-bordered"
                />
                {errors.email && <span className="text-red-700">Email is required</span>}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label"><span className="label-text">Password</span></label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters long" },
                    maxLength: { value: 20, message: "Password cannot exceed 20 characters" },
                    validate: {
                      hasLowerAndUpper: value =>
                        /[a-z]/.test(value) && /[A-Z]/.test(value) || "Must include lowercase & uppercase",
                      hasSpecialChar: value =>
                        /[!*"'?,.`~[{()}{}{^%$#@!~()_+]/.test(value) || "Must include special character",
                      hasDigit: value =>
                        /[0-9]/.test(value) || "Must include number"
                    }
                  })}
                  placeholder="password"
                  className="input input-bordered"
                />
                {errors.password && <span className="text-red-700">{errors.password.message}</span>}
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label"><span className="label-text">Confirm password</span></label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: value =>
                      value === password || "Passwords do not match"
                  })}
                  placeholder="Confirm password"
                  className="input input-bordered"
                />
                {errors.confirmPassword && <span className="text-red-700">{errors.confirmPassword.message}</span>}
              </div>
            </div>

            {/* Role */}
            <div className="mt-4 form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select defaultValue="default" {...register("role", { required: true })} className="select select-bordered">
                <option disabled value="default">Select the role</option>
                <option value="worker">Worker</option>
                <option value="taskCreator">Task Creator</option>
              </select>
              {errors.role && <span className="text-red-700">Role is required</span>}
            </div>

            {/* Submit */}
            <div className="mt-6 form-control">
              <button
                type="submit"
                disabled={loading}
                className={`btn text-white flex items-center justify-center gap-2 ${loading ? ' cursor-not-allowed' : 'bg-[#3d1d46] hover:bg-[#5e2a67]'}`}
              >
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <SocialLogin />

          <p className='pb-5 text-center'>
            Already have an account? Please <Link to='/login' className="text-blue-600 hover:underline">login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
