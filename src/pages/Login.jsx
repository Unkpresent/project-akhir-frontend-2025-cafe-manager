import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Coffee } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await loginUser(username, password);
    
    if (user) {
      // Simpan sesi login ke browser
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/admin'); // Pindah ke Dashboard
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6 text-amber-700">
          <Coffee size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-amber-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-amber-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition">
            Masuk
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
            Hint: admin / 123
        </p>
      </div>
    </div>
  );
};

export default Login;