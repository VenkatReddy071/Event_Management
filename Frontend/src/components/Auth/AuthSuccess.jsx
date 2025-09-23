import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("userToken", token);
      navigate("/"); // navigate to main page
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Logging in...</p>;
};

export default OAuthSuccess;
