import { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/auth";

function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    loggingOut: false,
  });

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const payload = await getCurrentUser();

        if (!ignore) {
          setUser(payload.data);
          setStatus({ loading: false, error: "", loggingOut: false });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            loading: false,
            error: error.message,
            loggingOut: false,
          });
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleLogout() {
    setStatus((current) => ({ ...current, loggingOut: true, error: "" }));

    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      setStatus((current) => ({
        ...current,
        loggingOut: false,
        error: error.message,
      }));
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, rgba(0, 191, 255, 0.16), transparent 30%), #080808",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: 4,
            backgroundColor: "rgba(18, 18, 18, 0.92)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f4f7fb",
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "#00c6ff", letterSpacing: "0.16rem" }}
              >
                Área do cliente
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                Minha conta
              </Typography>
            </Box>

            {status.loading ? (
              <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                Carregando seus dados...
              </Typography>
            ) : status.error ? (
              <Stack spacing={2}>
                <Typography sx={{ color: "#ff8a80" }}>{status.error}</Typography>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{
                    py: 1.4,
                    borderRadius: 999,
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #00bfff, #1e90ff)",
                  }}
                >
                  Ir para login
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                  Você está conectada à sua conta.
                </Typography>
                <Typography>
                  <strong>Nome:</strong> {user?.name}
                </Typography>
                <Typography>
                  <strong>E-mail:</strong> {user?.email}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  disabled={status.loggingOut}
                  sx={{
                    py: 1.4,
                    borderRadius: 999,
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #00bfff, #1e90ff)",
                  }}
                >
                  {status.loggingOut ? "Saindo..." : "Sair"}
                </Button>
              </Stack>
            )}

            <Box component={RouterLink} to="/" sx={{ color: "#9fdfff" }}>
              Voltar para a home
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default AccountPage;
