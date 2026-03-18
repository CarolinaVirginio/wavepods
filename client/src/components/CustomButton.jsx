import Button from "@mui/material/Button";

const variants = {
  comprar: {
    color: "#fff",
    background: "linear-gradient(90deg, #00bfff, #1e90ff)",
    fontSize: "0.9rem",
    px: 2,
    py: 1.5,
    borderRadius: 50,
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 0 15px rgba(30, 144, 255, 0.6)",
    "&:hover": {
      boxShadow: "0 0 25px rgba(30, 144, 255, 0.9)",
      transform: "translateY(-2px)",
      background: "linear-gradient(90deg, #1e90ff, #00bfff)",
    },
  },

  outlined: {
    color: "#00c6ff",
    border: "2px solid #00c6ff",
    fontSize: "0.95rem",
    px: 2,
    py: 1.5,
    borderRadius: 50,
    fontWeight: 600,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 0 15px rgba(0, 198, 255, 0.6)",
      transform: "translateY(-2px)",
    },
  },

  newsletter: {
    color: "#00c6ff",
    border: "2px solid #00c6ff",
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
    px: 4,
    py: 1,
    borderRadius: 50,
    fontWeight: 600,
    transition: "all 0.3s ease",
    minWidth: { xs: "100%", sm: 120 },
    alignSelf: { xs: "stretch", sm: "center" },
    "&:hover": {
      boxShadow: "0 0 15px rgba(0, 198, 255, 0.6)",
    },
  },
};

const CustomButton = ({
  version = "comprar",
  children,
  onClick: handleClick,
  sx: sxFromProps,
  ...props
}) => {
  const sx = { ...variants[version], ...(sxFromProps || {}) };

  return (
    <Button sx={sx} {...props} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default CustomButton;
