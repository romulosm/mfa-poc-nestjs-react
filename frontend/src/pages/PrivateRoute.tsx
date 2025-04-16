import React, { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    axios
      .get("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setIsValid(true))
      .catch(() => {
        localStorage.removeItem("access_token");
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    return <p>Carregando...</p>; // ou um spinner sei lá
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
