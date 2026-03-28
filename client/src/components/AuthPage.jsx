import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: 3,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0,198,255,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00c6ff",
    },
  },
};

const copyByMode = {
  login: {
    eyebrow: "Área do cliente",
    title: "Entre na sua conta",
    description:
      "Acesse sua conta para continuar acompanhando as novidades da WavePods.",
    primaryAction: "Entrar",
    alternateText: "Ainda não tem conta?",
    alternateLink: "/cadastro",
    alternateLabel: "Criar cadastro",
    successMessage: "Login realizado com sucesso!",
  },
  register: {
    eyebrow: "Comece agora",
    title: "Crie sua conta",
    description:
      "Crie sua conta para acompanhar as novidades e os próximos recursos da WavePods.",
    primaryAction: "Criar conta",
    alternateText: "Já tem conta?",
    alternateLink: "/login",
    alternateLabel: "Fazer login",
    successMessage: "Conta criada com sucesso!",
  },
};

function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const content = copyByMode[mode];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setStatus({
      loading: false,
      error: "",
      success: "",
    });
  }, [mode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      if (mode === "register") {
        await registerUser(formData);
      } else {
        await loginUser({
          email: formData.email,
          password: formData.password,
        });
      }

      setStatus({
        loading: false,
        error: "",
        success: content.successMessage,
      });

      navigate("/minha-conta");
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: "",
      });
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
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "#00c6ff", letterSpacing: "0.16rem" }}
              >
                {content.eyebrow}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {content.title}
              </Typography>
              <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.72)" }}>
                {content.description}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {mode === "register" && (
                <TextField
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    style: { color: "rgba(255,255,255,0.7)" },
                  }}
                  sx={fieldStyles}
                />
              )}
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                sx={fieldStyles}
              />
              <TextField
                label="Senha"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                sx={fieldStyles}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={status.loading}
                sx={{
                  py: 1.4,
                  borderRadius: 999,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #00bfff, #1e90ff)",
                }}
              >
                {status.loading ? "Enviando..." : content.primaryAction}
              </Button>
            </Stack>

            {status.error ? (
              <Typography sx={{ color: "#ff8a80" }}>{status.error}</Typography>
            ) : null}

            {status.success ? (
              <Typography sx={{ color: "#8df5c2" }}>
                {status.success}
              </Typography>
            ) : null}

            <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
              {content.alternateText}{" "}
              <Box
                component={Link}
                to={content.alternateLink}
                sx={{ color: "#00c6ff" }}
              >
                {content.alternateLabel}
              </Box>
            </Typography>

            <Box component={Link} to="/" sx={{ color: "#9fdfff" }}>
              Voltar para a home
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthPage;
