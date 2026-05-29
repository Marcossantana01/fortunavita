"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRouteByUsuarioTipo, loginUsuario } from "@/services/auth";

import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clearSavedFields = window.setTimeout(() => {
      setEmail("");
      setSenha("");
    }, 100);

    return () => window.clearTimeout(clearSavedFields);
  }, []);

  const clearLoginFields = () => {
    setEmail("");
    setSenha("");
    setShowSenha(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setSenhaError("");
    setLoginError("");

    let hasError = false;

    if (!email) {
      setEmailError("Por favor, preencha seu e-mail.");
      hasError = true;
    }

    if (!senha) {
      setSenhaError("Por favor, preencha sua senha.");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const usuario = await loginUsuario(email, senha);

      if (!usuario) {
        setLoginError("E-mail, senha ou perfil invalido.");
        clearLoginFields();
        return;
      }

      window.localStorage.setItem("fortuna_vita_usuario", JSON.stringify(usuario));
      router.push(getRouteByUsuarioTipo(usuario.tipo));
    } catch {
      setLoginError("Nao foi possivel entrar agora. Tente novamente.");
      clearLoginFields();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#f7f7f7",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={() => router.push("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          border: "none",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          color: "#c8a96b",
          fontWeight: "600",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Voltar para o site
      </button>

      <div
        className="bg-white shadow-sm"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "18px",
          borderRadius: "22px",
          border: "1px solid #ececec",
        }}
      >
        <div className="text-center mb-3">
          <div
            style={{
              fontSize: "24px",
              marginBottom: "2px",
            }}
          >
            🔐
          </div>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "2px",
            }}
          >
            Bem-vindo(a)
          </h2>

          <p
            style={{
              color: "#7b8190",
              fontSize: "12px",
              marginBottom: "0",
            }}
          >
            Acesse sua conta para continuar
          </p>
        </div>

        <button
          style={{
            width: "100%",
            height: "42px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "14px",
            cursor: "pointer",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: "#4285f4",
              fontSize: "16px",
              fontWeight: "800",
              lineHeight: 1,
            }}
          >
            G
          </span>
          Entrar com Google
        </button>

        <div className="d-flex align-items-center mb-2">
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ececec",
            }}
          />

          <span
            style={{
              margin: "0 8px",
              color: "#9ca3af",
              fontSize: "11px",
            }}
          >
            ou
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ececec",
            }}
          />
        </div>

        <form autoComplete="off" onSubmit={handleLogin}>
          <div className="mb-2">
            <label
              style={{
                fontWeight: "600",
                marginBottom: "5px",
                display: "block",
                fontSize: "13px",
              }}
            >
              E-mail
            </label>

            <div className="position-relative">
              <i
                aria-hidden="true"
                className="bi bi-envelope"
                style={{
                  fontSize: "14px",
                  position: "absolute",
                  top: "50%",
                  left: "12px",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />

              <input
                autoComplete="off"
                name="fortuna-vita-login-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className="form-control"
                style={{
                  height: "42px",
                  borderRadius: "10px",
                  paddingLeft: "38px",
                  fontSize: "13px",
                  border: "1px solid #dfe3ea",
                }}
              />
            </div>

            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="mb-2">
            <label
              style={{
                fontWeight: "600",
                marginBottom: "5px",
                display: "block",
                fontSize: "13px",
              }}
            >
              Senha
            </label>

            <div className="position-relative">
              <i
                aria-hidden="true"
                className="bi bi-lock"
                style={{
                  fontSize: "14px",
                  position: "absolute",
                  top: "50%",
                  left: "12px",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />

              <input
                autoComplete="new-password"
                name="fortuna-vita-login-password"
                type={showSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setSenhaError("");
                }}
                className="form-control"
                style={{
                  height: "42px",
                  borderRadius: "10px",
                  paddingLeft: "38px",
                  paddingRight: "38px",
                  fontSize: "13px",
                  border: "1px solid #dfe3ea",
                }}
              />

              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="btn border-0 shadow-none position-absolute top-50 end-0 translate-middle-y"
              >
                <i
                  aria-hidden="true"
                  className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`}
                  style={{ fontSize: "14px" }}
                />
              </button>
            </div>

            {senhaError && <small className="text-danger">{senhaError}</small>}
          </div>

          <div className="text-end mb-2">
            <a
              href="#"
              style={{
                color: "#c8a96b",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "11px",
              }}
            >
              Esqueceu sua senha?
            </a>
          </div>

          {loginError && (
            <div className="mb-2">
              <small className="text-danger">{loginError}</small>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-100 text-white fw-bold"
            style={{
              height: "42px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg,#c8a96b,#d7b777)",
              fontSize: "15px",
            }}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div
          className="text-center"
          style={{
            marginTop: "12px",
            fontSize: "12px",
          }}
        >
          <span
            style={{
              color: "#7b8190",
            }}
          >
            Ainda não tem uma conta?
          </span>

          <button
            onClick={() => router.push("/cadastro")}
            style={{
              border: "none",
              background: "transparent",
              color: "#c8a96b",
              fontWeight: "700",
              marginLeft: "4px",
            }}
          >
            Cadastrar
          </button>
        </div>

        <div
          className="text-center"
          style={{
            marginTop: "12px",
            color: "#9ca3af",
            fontSize: "11px",
          }}
        >
          🔒 Seus dados protegidos com segurança.
        </div>
      </div>
    </div>
  );
}

export default Login;
