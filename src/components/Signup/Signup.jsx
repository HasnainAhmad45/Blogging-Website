import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    password: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profilePic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ---------- Password Validation ----------
  const validatePassword = (password) => {
    const isValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password);

    if (!isValid) {
      setPasswordErrors(["Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)"]);
    } else {
      setPasswordErrors([]);
    }

    return isValid;
  };


  // ---------- Request OTP ----------
  const requestOtp = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      alert("Password does not meet the requirements!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("email", form.email);
      formData.append("password", form.password);

      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }

      await axios.post(
        "http://localhost:5000/api/auth/request-otp",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("OTP sent successfully!");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error sending OTP");
    }
  };

  // ---------- Verify OTP ----------
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: form.email,
          otp,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-slate-700 mb-2">
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {step === 1
            ? "Fill in your details to get started."
            : "Enter the OTP sent to your email."}
        </p>

        {step === 1 ? (
          <form onSubmit={requestOtp} encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
                required
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
                required
              />
            </div>

            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 mt-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
              required
            />
            <input
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full rounded-lg border border-gray-300 p-3 mt-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 p-3 mt-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => {
                handleChange(e);
                validatePassword(e.target.value);
              }}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 p-3 mt-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
              required
            />
            {passwordErrors.length > 0 && (
              <ul className="text-sm text-red-500 mt-2 list-disc list-inside">
                {passwordErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <label className="block font-medium text-gray-700 mb-2">
                Profile Picture (optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-full border shadow-sm"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Request OTP
            </button>

            <p className="text-center text-sm mt-4 text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-slate-600 cursor-pointer hover:text-slate-700 font-medium transition-colors"
              >
                Login
              </span>
            </p>
          </form>
        ) : (
          <motion.form
            onSubmit={verifyOtp}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <label className="block text-gray-700 font-medium mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Verify OTP
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}

export default Signup;
