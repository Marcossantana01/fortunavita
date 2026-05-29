import {
  FiSearch,
  FiBell,
} from "react-icons/fi";

function Header() {
  return (
    <div
      style={{
        width: "100%",
        height: "85px",
        background: "#ffffff",
        borderBottom: "1px solid #eef1f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
      }}
    >
      {/* TEXTO */}
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#7b8190",
            fontWeight: "500",
          }}
        >
          Gerencie sua operação com eficiência
        </p>
      </div>

      {/* RIGHT */}
      <div
        className="d-flex align-items-center gap-4"
      >
        {/* SEARCH */}
        <div
          style={{
            width: "320px",
            height: "44px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: "10px",
          }}
        >
          <FiSearch color="#7b8190" />

          <input
            type="text"
            placeholder="Buscar..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: "14px",
            }}
          />

          <span
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "3px 8px",
              fontSize: "11px",
              color: "#7b8190",
            }}
          >
            Ctrl K
          </span>
        </div>

        {/* NOTIFICAÇÃO */}
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <FiBell size={18} />

          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#d4b06a",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: "700",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            3
          </div>
        </div>

        {/* USER */}
        <div
          className="d-flex align-items-center gap-3"
        >
          <div
            className="text-end"
          >
            <h6
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Arthur Santana
            </h6>

            <small
              style={{
                color: "#7b8190",
                fontSize: "12px",
              }}
            >
              Administrador
            </small>
          </div>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#d4b06a",
              color: "#ffffff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "700",
            }}
          >
            A
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;