import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("OTP Verified! You can now login.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
      <button type="submit">Verify OTP</button>
    </form>
  );
}

export default VerifyOtp;
