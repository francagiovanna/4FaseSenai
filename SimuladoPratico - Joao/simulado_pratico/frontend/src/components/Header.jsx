import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/");
    }

    return (
        <header>
            <h1>Oficina Mecânica</h1>

            <nav>
                <button onClick={() => navigate("/dashboard")}>
                    Início
                </button>

                <button onClick={() => navigate("/clientes")}>
                    Clientes
                </button>

                <button onClick={() => navigate("/veiculos")}>
                    Veículos
                </button>

                <button onClick={() => navigate("/ordens-servico")}>
                    Ordens de Serviço
                </button>

                <span>
                    Olá, {usuario?.nome}
                </span>

                <button onClick={sair}>
                    Sair
                </button>
            </nav>
        </header>
    );
}

export default Header;