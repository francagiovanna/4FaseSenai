import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [termo, setTermo] = useState("");

    const [form, setForm] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: ""
    });

    async function carregarClientes() {
        try {
            const resposta = await api.get("/clientes");

            setClientes(resposta.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarClientes();
    }, []);

    async function buscar() {
        if (!termo) {
            carregarClientes();
            return;
        }

        const resposta = await api.get(
            `/clientes/buscar?termo=${termo}`
        );

        setClientes(resposta.data);
    }

    function alterarCampo(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function cadastrar(event) {
        event.preventDefault();

        try {
            await api.post("/clientes", form);

            alert("Cliente cadastrado!");

            setForm({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                endereco: ""
            });

            carregarClientes();

        } catch (error) {
            alert(
                error.response?.data?.mensagem ||
                "Erro ao cadastrar cliente."
            );
        }
    }

    return (
        <>
            <Header />

            <main>
                <h2>Clientes</h2>

                <section>
                    <h3>Cadastrar cliente</h3>

                    <form onSubmit={cadastrar}>
                        <input
                            name="nome"
                            placeholder="Nome"
                            value={form.nome}
                            onChange={alterarCampo}
                        />

                        <input
                            name="cpf"
                            placeholder="CPF"
                            value={form.cpf}
                            onChange={alterarCampo}
                        />

                        <input
                            name="telefone"
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={alterarCampo}
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={alterarCampo}
                        />

                        <input
                            name="endereco"
                            placeholder="Endereço"
                            value={form.endereco}
                            onChange={alterarCampo}
                        />

                        <button type="submit">
                            Cadastrar
                        </button>
                    </form>
                </section>

                <section>
                    <h3>Buscar cliente</h3>

                    <input
                        placeholder="Digite nome, telefone ou e-mail"
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                    />

                    <button onClick={buscar}>
                        Buscar
                    </button>
                </section>

                <section>
                    <h3>Clientes cadastrados</h3>

                    {clientes.map((cliente) => (
                        <div key={cliente.id}>
                            <strong>{cliente.nome}</strong>

                            <p>
                                Telefone: {cliente.telefone}
                            </p>

                            <p>
                                E-mail: {cliente.email}
                            </p>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

export default Clientes;