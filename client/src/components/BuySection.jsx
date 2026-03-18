import { Box, Typography, Container } from "@mui/material";
import CustomButton from "./CustomButton";
import createCheckoutSession from "../api/checkout";

function BuySection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Container
        maxWidth="lg"
        sx={{ textAlign: "center", px: { xs: 2, md: 0 } }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.875rem",
            color: "#e4dede",
            letterSpacing: "0.125rem",
            mb: 1.5,
            textTransform: "uppercase",
          }}
        >
          Mais que um produto, uma experiência
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "#bfb8b8",
            mb: 4,
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          Pronto para transformar sua experiência musical?
        </Typography>

        <CustomButton onClick={() => createCheckoutSession()}>
          Comprar
        </CustomButton>
      </Container>
    </Box>
  );
}

export default BuySection;
