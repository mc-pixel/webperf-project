import "./styles.css";
import HomePage from "./scenes/HomePage";
import VideoGame from "./scenes/VideoGame";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game" element={<VideoGame />} />
    </Routes>
  );
}
