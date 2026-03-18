import { Box, Typography, Button, Container } from "@mui/material";
import waveBg from "../img/wavebg.jpg";
import CustomButton from "./CustomButton";
import createCheckoutSession from "../api/checkout";

const ContentMain = () => {
  return (
    <Box
      id="inicio"
      aria-label="Apresentação dos WavePods"
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `url(${waveBg}) center/cover no-repeat`,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      />

      <Container
        disableGutters
        sx={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pl: { xs: 3, md: 10 },
          pr: { xs: 2, md: 0 },
          ml: 2,
          pt: 10,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: 1, md: 600 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
              lineHeight: 1.1,
              letterSpacing: "0.03rem",
              mb: 3,
            }}
          >
            Experimente o<br />
            futuro do som
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "#e4dedeff",
              fontWeight: 400,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              mb: 2.5,
            }}
          >
            Tecnologia premium com conforto absoluto
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#e4dedeff",
              fontSize: "1rem",
              lineHeight: 1.6,
              letterSpacing: "0.02rem",
              maxWidth: 500,
              mb: 5,
            }}
          >
            Cancelamento ativo de ruído de 40 dB | Áudio de alta fidelidade |
            Conexão Bluetooth 5.3 | Bateria de 30 horas
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <CustomButton onClick={() => createCheckoutSession()}>
              Comprar agora
            </CustomButton>

            <CustomButton version="outlined" href="#features">
              Ver especificações
            </CustomButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContentMain;
