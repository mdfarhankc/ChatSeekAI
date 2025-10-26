import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useCurrentUser } from "@/hooks/useAuth";
import Loading from "./Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: authUser, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loading />
      </main>
    );
  }

  if (isError || !authUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
