import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Page = ({ title }: { title: string }) => (
  <div style={{ padding: 40 }}>
    <h1>{title}</h1>
    <p>MandaStrong Studios 2025</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#0b0618", color: "white" }}>
        
        {/* TOP RIGHT MENU */}
        <nav style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          gap: 12,
          zIndex: 1000
        }}>
          {[...Array(21)].map((_, i) => (
            <Link
              key={i}
              to={`/page${i + 1}`}
              style={{ color: "#b388ff", textDecoration: "none" }}
            >
              Page {i + 1}
            </Link>
          ))}
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={
            <div style={{ padding: 80 }}>
              <h1 style={{ fontSize: 48, color: "#b388ff" }}>
                MANDASTRONG STUDIOS 2025
              </h1>
              <p style={{ fontSize: 20 }}>
                Build Your Own Movie • Scripts • Video • Audio • Editing
              </p>
              <p>
                A CineCraft-style platform to create full-length movies using AI tools.
              </p>
            </div>
          } />

          <Route path="/page1" element={<Page title="Page 1 – Welcome / Background Video" />} />
          <Route path="/page2" element={<Page title="Page 2 – Getting Started" />} />
          <Route path="/page3" element={<Page title="Page 3 – Tool Board" />} />
          <Route path="/page4" element={<Page title="Page 4 – Script Tools" />} />
          <Route path="/page5" element={<Page title="Page 5 – Storyboards" />} />
          <Route path="/page6" element={<Page title="Page 6 – Scene Builder" />} />
          <Route path="/page7" element={<Page title="Page 7 – Character Creator" />} />
          <Route path="/page8" element={<Page title="Page 8 – Audio Tools" />} />
          <Route path="/page9" element={<Page title="Page 9 – Video Tools" />} />
          <Route path="/page10" element={<Page title="Page 10 – Upload Doxy Movie" />} />
          <Route path="/page11" element={<Page title="Page 11 – Media Window" />} />
          <Route path="/page12" element={<Page title="Page 12 – Timeline Editor" />} />
          <Route path="/page13" element={<Page title="Page 13 – Effects & Transitions" />} />
          <Route path="/page14" element={<Page title="Page 14 – Music & Sound" />} />
          <Route path="/page15" element={<Page title="Page 15 – Voice & Lip Sync" />} />
          <Route path="/page16" element={<Page title="Page 16 – Legal / Disclaimers" />} />
          <Route path="/page17" element={<Page title="Page 17 – Terms & Safety" />} />
          <Route path="/page18" element={<Page title="Page 18 – Community Hub" />} />
          <Route path="/page19" element={<Page title="Page 19 – Projects" />} />
          <Route path="/page20" element={<Page title="Page 20 – Export Movie" />} />
          <Route path="/page21" element={<Page title="Page 21 – Video Demo / User Guide" />} />
        </Routes>

        {/* FOOTER (FROM PAGE 3 ONWARD VISUALLY) */}
        <footer style={{
          marginTop: 120,
          padding: 20,
          textAlign: "center",
          color: "#777"
        }}>
          © 2025 MandaStrong Studios
        </footer>
      </div>
    </Router>
  );
}
