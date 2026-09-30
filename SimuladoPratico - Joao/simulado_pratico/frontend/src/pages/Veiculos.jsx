import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

function Veiculos() {
    const [veiculos, setVeiculos] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [form, setForm] = useState({
        placa: "",
        modelo: "",
        marca: "",
        ano: "",
        cliente_id: ""
    });

    async function carregarDados() {
        const [veiculosResponse, clientesResponse] =
            await Promise.all([
                api.get("/veiculos"),
                api.get("/clientes")
            ]);

        setVeiculos(veiculosResponse.data);
        setClientes(clientesResponse.data);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function alterarCampo(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function cadastrar(event) {
        event.preventDefault();

        try {
            await api.post("/veiculos", form);

            alert("Veículo cadastrado!");

            setForm({
                placa: "",
                modelo: "",
                marca: "",
                ano: "",
                cliente_id: ""
            });

            carregarDados();

        } catch (error) {
            alert(
                error.response?.data?.mensagem ||
                "Erro ao cadastrar veículo."
            );
        }
    }

    return (
        <>
            <Header />

            <main>
                <h2>Veículos</h2>

                <h3>Cadastrar veículo</h3>

                <form onSubmit={cadastrar}>
                    <input
                        name="placa"
                        placeholder="Placa"
                        value={form.placa}
                        onChange={alterarCampo}
                    />

                    <input
                        name="marca"
                        placeholder="Marca"
                        value={form.marca}
                        onChange={alterarCampo}
                    />

                    <input
                        name="modelo"
                        placeholder="Modelo"
                        value={form.modelo}
                        onChange={alterarCampo}
                    />

                    <input
                        name="ano"
                        type="number"
                        placeholder="Ano"
                        value={form.ano}
                        onChange={alterarCampo}
                    />

                    <select
                        name="cliente_id"
                        value={form.cliente_id}
                        onChange={alterarCampo}
                    >
                        <option value="">
                            Selecione o cliente
                        </option>

                        {clientes.map((cliente) => (
                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.nome}
                            </option>
                        ))}
                    </select>

                    <button type="submit">
                        Cadastrar veículo
                    </button>
                </form>

                <h3>Veículos cadastrados</h3>

                {veiculos.map((veiculo) => (
                    <div key={veiculo.id}>
                        <strong>
                            {veiculo.marca} {veiculo.modelo}
                        </strong>

                        <p>
                            Placa: {veiculo.placa}
                        </p>

                        <p>
                            Cliente: {veiculo.cliente_nome}
                        </p>
                    </div>
                ))}
            </main>
        </>
    );
}

export default Veiculos;