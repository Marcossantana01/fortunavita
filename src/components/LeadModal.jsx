import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

function LeadModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ABRIR MODAL APÓS 30 SEGUNDOS
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  // FECHAR
  function closeModal() {
    setOpen(false);
  }

  // NÃO MOSTRA NADA
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      {/* MODAL */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* FECHAR */}
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#f3f4f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaTimes color="#111827" />
        </button>

        {/* TÍTULO */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "34px",
              color: "#111827",
              marginBottom: "12px",
              lineHeight: "42px",
            }}
          >
            Conheça nossa metodologia
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "28px",
            }}
          >
            Descubra como a Fortuna Vita ajuda pessoas a construir patrimônio
            com estratégia e segurança.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/cadastro");
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input type="text" placeholder="Nome completo" style={inputStyle} />

          <input type="text" placeholder="Telefone" style={inputStyle} />

          <input type="email" placeholder="E-mail" style={inputStyle} />

          {/* BOTÃO */}
          <button
            type="submit"
            style={{
              height: "56px",
              border: "none",
              borderRadius: "14px",
              backgroundColor: "#c8a96b",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Quero conhecer
          </button>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={() => router.push("/cadastro")}
            style={{
              height: "56px",
              border: "1px solid #d1d5db",
              borderRadius: "14px",
              backgroundColor: "#ffffff",
              color: "#111827",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Continuar com Google
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "56px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  padding: "0 16px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default LeadModal;
