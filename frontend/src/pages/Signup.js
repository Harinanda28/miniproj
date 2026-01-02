import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: signup, 2: enter OTP
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post('/auth/signup', { email, password });
      setStep(2); // move to OTP step
    } catch (err) {
      alert(err.response?.data?.error || 'Error during signup');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await API.post('/auth/verify-otp', { email, otp });
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP');
    }
  };

  /**return (
    <div style={{ padding: '20px' }}>
      {step === 1 ? (
        <>
          <h2>Signup</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br/>
          <button onClick={handleSignup}>Signup</button>
          <p>
            Already have an account?{' '}
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </>
      ) : (
        <>
          <h2>Enter OTP</h2>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          /><br/>
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );*/
  return (
  <div className="auth-container">
    {step === 1 ? (
      <>
        <h2>Create Account</h2>
        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleSignup}>Send OTP</button>

        <p className="auth-text">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </>
    ) : (
      <>
        <h2>Enter OTP</h2>
        <input
          className="auth-input"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="auth-btn" onClick={handleVerifyOtp}>
          Verify OTP
        </button>
      </>
    )}
  </div>
);

}
