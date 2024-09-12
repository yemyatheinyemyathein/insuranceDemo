import { useState } from "react";
import InsuranceDemo from "./app/InsuranceDemo";
import LoginPage from "./components/LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="md:w-[80%] mx-auto p-6">
      {isLoggedIn ? (
        <InsuranceDemo />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
