import Header from "../components/Header";

function Dashboard() {
    return (
        <>
            <Header />

            <main>
                <h2>Página inicial</h2>

                <p>
                    Sistema de gerenciamento da oficina mecânica.
                </p>

                <section>
                    <h3>Recursos disponíveis</h3>

                    <ul>
                        <li>Gerenciamento de clientes</li>
                        <li>Gerenciamento de veículos</li>
                        <li>Ordens de serviço</li>
                    </ul>
                </section>
            </main>
        </>
    );
}

export default Dashboard;