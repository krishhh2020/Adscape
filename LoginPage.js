import React from "react";

function LoginPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ color: "#4B0082" }}>Login</h2>
      <form style={{ marginTop: "1rem" }}>
        <input type="text" placeholder="Username" style={{ padding: "0.5rem", margin: "0.5rem" }} />
        <input type="password" placeholder="Password" style={{ padding: "0.5rem", margin: "0.5rem" }} />
        <br />
        <button style={{ padding: "0.5rem 1rem", background: "#4B0082", color: "#fff", border: "none", borderRadius: "5px" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
