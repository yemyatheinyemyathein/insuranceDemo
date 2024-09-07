import { useState } from "react";
import InsuranceDemo from "./app/InsuranceDemo";
import LoginPage from "./components/LoginPage";

type LoginHandler = (username: string) => void;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>("");

  const handleLogin: LoginHandler = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  return (
    <div className="md:w-[80%] mx-auto p-6">
      {isLoggedIn ? (
        <InsuranceDemo username={username} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
