// @ts-nocheck
import React from "react";

export function Landing({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0e7490", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif" }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{ width: 72, height: 72, background: "#fff", color: "#0e7490", borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, marginBottom: 28, fontFamily: "Georgia, serif" }}>C</div>
        <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, fontFamily: "Georgia, serif" }}>CareCover</h1>
        <p style={{ fontSize: 20, opacity: 0.92, marginBottom: 28 }}>Cover, sorted — before it becomes a crisis.</p>
        <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, marginBottom: 36 }}>
          CareCover is built for care and nursing agencies, care homes, and any team that sends staff out to clients. When a carer calls off sick, it instantly finds qualified, available cover — matched by skill, area, and who's free — and reassigns the visit in one tap. Training, leave and holidays are handled automatically, and one live board keeps the whole team in step.
        </p>
        <button onClick={onEnter} style={{ background: "#fff", color: "#0e7490", fontSize: 17, fontWeight: 700, border: "none", padding: "15px 40px", borderRadius: 12, cursor: "pointer" }}>Enter CareCover →</button>
      </div>
    </div>
  );
}

export default Landing;
