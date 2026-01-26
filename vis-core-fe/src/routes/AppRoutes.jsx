import { Routes, Route } from "react-router-dom"
import Homepage from "../pages/Homepage"
import LoginPage from "../pages/LoginPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Homepage />} /> */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
