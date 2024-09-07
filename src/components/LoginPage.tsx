import React, { useState } from "react";
import { motion } from "framer-motion";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center">
      <p className="text-gray-500 mb-2">
        <span className="font-semibold text-gray-600">Notice: </span>You must
        fill in this data!
      </p>
      <span className="text-center py-2 text-gray-400 border border-yellow-400 rounded-xl">
        This Agent name will be included. Please keep your password safe! Thank you.
      </span>
      <h1 className="text-2xl font-bold my-4 text-yellow-400">Login</h1>
      <form onSubmit={handleSubmit}>
        <motion.div
          className="w-full"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={inputVariants}
        >
          <label htmlFor="username" className="block mb-2">
            Agent Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Agent Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded outline-none px-2 border border-gray-400"
          />
        </motion.div>
        <motion.div
          className="my-4 w-full"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          variants={inputVariants}
        >
          <label htmlFor="Password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="Password"
            name="Password"
            placeholder="Agent Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded outline-none px-2 border border-gray-400"
          />
        </motion.div>
        <button
          type="submit"
          className="w-full bg-yellow-400 p-2 font-semibold text-white rounded-lg mt-4"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
