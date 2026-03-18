import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verificando pagamento...");

  useEffect(() => {
    async function checkPayment() {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setStatus("Nenhuma sessão encontrada.");
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout-session?session_id=${sessionId}`,
        );

        if (!res.ok) {
          setStatus("Falha ao recuperar sessão.");
          return;
        }

        const payload = await res.json();
        const data = payload.data;

        if (data.payment_status === "paid") {
          setStatus("Pagamento aprovado! Obrigado pela compra.");
        } else {
          navigate("/canceled");
        }
      } catch {
        setStatus("Falha ao verificar pagamento.");
      }
    }

    checkPayment();
  }, [location.search, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <CheckCircleIcon
            sx={{ fontSize: 70, color: "success.main", mb: 2 }}
          />

          <Typography variant="h4" fontWeight={600} gutterBottom>
            Compra realizada com sucesso!
          </Typography>

          <Typography sx={{ mb: 3 }}>{status}</Typography>

          <Button
            variant="contained"
            component={Link}
            to="/"
            size="large"
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Voltar para a loja
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Success;
