import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { getCurrentUser } from "../api/auth";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState({
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    let ignore = false;

    async function checkSession() {
      try {
        await getCurrentUser();

        if (!ignore) {
          setStatus({
            loading: false,
            authenticated: true,
          });
        }
      } catch {
        if (!ignore) {
          setStatus({
            loading: false,
            authenticated: false,
          });
        }
      }
    }

    checkSession();

    return () => {
      ignore = true;
    };
  }, []);

  if (status.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(0, 191, 255, 0.16), transparent 30%), #080808",
        }}
      >
        <CircularProgress sx={{ color: "#00c6ff" }} />
      </Box>
    );
  }

  if (!status.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
