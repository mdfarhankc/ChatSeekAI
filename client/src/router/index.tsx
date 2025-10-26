import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ChatsPage from "@/pages/ChatsPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
