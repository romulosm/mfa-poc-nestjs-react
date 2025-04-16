import React, { useEffect, useState } from "react";
import axios from "axios";

const MePage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("http://localhost:3000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch(() => {
        setData({ error: "Token inválido ou expirado" });
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Área Logada</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default MePage;
