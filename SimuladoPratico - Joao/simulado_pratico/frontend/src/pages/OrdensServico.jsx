import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

function OrdensServico() {
    const [ordens, setOrdens] = useState([]);

    async function carregarOrdens() {
        try {
            const resposta = await api.get(
                "/ordens-servico"
            );

            setOrdens(resposta.data);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarOrdens();
    }, []);

    return (
        <>
            <Header />

            <main>
                <h2>Ordens de Serviço</h2>

                {ordens.map((ordem) => (
                    <article key={ordem.id}>
                        <h3>
                            Ordem #{ordem.id}
                        </h3>

                        <p>
                            <strong>
                                Data:
                            </strong>{" "}
                            {new Date(
                                ordem.data_agendamento
                            ).toLocaleDateString("pt-BR")}
                        </p>

                        <p>
                            <strong>
                                Cliente:
                            </strong>{" "}
                            {ordem.cliente_nome}
                        </p>

                        <p>
                            <strong>
                                Veículo:
                            </strong>{" "}
                            {ordem.veiculo_modelo}
                            {" - "}
                            {ordem.veiculo_placa}
                        </p>

                        <p>
                            <strong>
                                Serviço:
                            </strong>{" "}
                            {ordem.descricao}
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {ordem.status}
                        </p>

                        <p>
                            <strong>
                                Valor:
                            </strong>{" "}
                            R$ {Number(ordem.valor).toFixed(2)}
                        </p>
                    </article>
                ))}
            </main>
        </>
    );
}

export default OrdensServico;