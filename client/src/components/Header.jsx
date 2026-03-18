import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Headphones } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import CustomButton from "./CustomButton";
import createCheckoutSession from "../api/checkout";

const links = [
  { label: "Login", href: "/login" },
  { label: "Cadastro", href: "/cadastro" },
];

const Header = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(10, 10, 10, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        px: 4,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Headphones size={32} strokeWidth={2.2} color="#fff" />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: "#fff",
              letterSpacing: "0.08rem",
              fontWeight: 700,
            }}
          >
            WavePods
          </Typography>
        </Box>

        <nav>
          {links.map((item) => (
            <Box
              key={item.label}
              component={RouterLink}
              to={item.href}
              sx={{
                color: "#fff",
                mr: 3,
                fontWeight: 500,
                letterSpacing: "0.05rem",
                transition: "color 0.3s",
                textDecoration: "none",
                "&:hover": {
                  color: "#00bfff",
                },
              }}
            >
              {item.label}
            </Box>
          ))}
        </nav>

        <CustomButton onClick={createCheckoutSession}>Comprar</CustomButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
