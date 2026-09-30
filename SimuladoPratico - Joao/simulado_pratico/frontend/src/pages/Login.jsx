import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function entrar(event) {
        event.preventDefault();

        setErro("");

        try {
            const resposta = await api.post("/auth/login", {
                email,
                senha
            });

            localStorage.setItem(
                "token",
                resposta.data.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(resposta.data.usuario)
            );

            navigate("/dashboard");

        } catch (error) {
            setErro(
                error.response?.data?.mensagem ||
                "Erro ao realizar login."
            );
        }
    }

    return (
        <main>
            <h1>Oficina Mecânica</h1>

            <h2>Login</h2>

            <form onSubmit={entrar}>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {erro && <p>{erro}</p>}

                <button type="submit">
                    Entrar
                </button>
            </form>
        </main>
    );
}

export default Login;