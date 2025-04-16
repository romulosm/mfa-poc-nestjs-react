import React, { useState } from "react";
import axios from "axios";

const MfaVerifyPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return setError("Token não encontrado");

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/mfa/verify",
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro na verificação");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Verificação MFA</h1>

      <input
        type="text"
        placeholder="Código MFA"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify} style={{ marginLeft: 10 }}>
        Verificar
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MfaVerifyPage;
