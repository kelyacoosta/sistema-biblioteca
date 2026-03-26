import { useEffect, useState } from "react";

export default function Home() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [livros, setLivros] = useState<any[]>([]);
  const [emprestimos, setEmprestimos] = useState<any[]>([]);
  const [aviso, setAviso] = useState({ texto: "", tipo: "sucesso" });

  const [formUsuario, setFormUsuario] = useState({ nome: "", email: "", telefone: "" });
  const [formLivro, setFormLivro] = useState({ titulo: "", genero: "", autor: "", quantidade: "" });
  const [formEmprestimo, setFormEmprestimo] = useState({ usuarioId: "", livrosIds: [] as any[], dataEmprestimo: "" });
  const [formDevolucao, setFormDevolucao] = useState({ emprestimoId: "", livrosIds: [] as any[] });

  async function buscarDados() {
    try {
      const resUsuarios = await fetch("/api/list/usuarios");
      const dados1 = await resUsuarios.json();
      setUsuarios(dados1.usuarios || []);

      const resLivros = await fetch("/api/list/livros");
      const dados2 = await resLivros.json();
      setLivros(dados2.livros || []);

      const resEmprestimos = await fetch("/api/list/emprestimos");
      const dados3 = await resEmprestimos.json();
      setEmprestimos(dados3.emprestimos || []);
    } catch (e) {
      console.error("Erro ao buscar dados");
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  async function salvar(url: string, dados: any) {
    if (url === "/api/emprestar") {
      for (const id of dados.livrosIds) {
        const livroNoEstoque = livros.find(l => l.id === id);
        if (livroNoEstoque && livroNoEstoque.quantidade <= 0) {
          setAviso({ texto: `O livro "${livroNoEstoque.titulo}" não tem mais exemplares no momento!`, tipo: "erro" });
          return;
        }
      }
    }

    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const resultado = await resposta.json();
    if (resposta.ok) {
      if (url === "/api/devolver") {
        setFormDevolucao({ emprestimoId: "", livrosIds: [] });
      }
      setAviso({ texto: resultado.mensagem || "Sucesso!", tipo: "sucesso" });
      buscarDados();
      if (url === "/api/emprestar") setFormEmprestimo({ ...formEmprestimo, livrosIds: [] });
    } else {
      setAviso({ texto: resultado.mensagem || "Erro no processo.", tipo: "erro" });
    }
  }

  function clicarNoLivro(livro: any) {
    if (livro.quantidade <= 0 && !formEmprestimo.livrosIds.includes(livro.id)) {
      setAviso({ texto: "Este livro está esgotado!", tipo: "erro" });
      return;
    }

    let novaLista = [...formEmprestimo.livrosIds];
    const index = novaLista.indexOf(livro.id);
    if (index > -1) novaLista.splice(index, 1);
    else novaLista.push(livro.id);
    setFormEmprestimo({ ...formEmprestimo, livrosIds: novaLista });
  }

  function selecionarEmprestimo(e: any) {
    const id = e.target.value;
    const achei = emprestimos.find(emp => emp.id === id);
    setFormDevolucao({ emprestimoId: id, livrosIds: achei ? achei.livrosIds : [] });
  }

  const cores = {
    fundo: "#FAF7F2",
    texto: "#2D2424",
    primaria: "#829460",
    borda: "#D6CCC2",
    card: "#FFFFFF",
    devolucao: "#FFF4E5"
  };

  const cardStyle = {
    border: `1px solid ${cores.borda}`,
    padding: 24,
    borderRadius: 16,
    backgroundColor: cores.card,
    color: cores.texto,
    boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column" as "column"
  };

  const inputStyle = {
    width: "100%",
    marginBottom: 12,
    padding: "12px",
    borderRadius: 8,
    border: `2px solid ${cores.borda}`,
    backgroundColor: "#FFFFFF",
    color: cores.texto,
    fontSize: "15px",
    boxSizing: "border-box" as "border-box",
    accentColor: cores.primaria
  };

  const botaoStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: cores.primaria,
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as "bold",
    fontSize: "15px",
    marginTop: "auto"
  };

  return (
    <div style={{ backgroundColor: cores.fundo, minHeight: "100vh", width: "100%", color: cores.texto }}>
      <style>{`
        div::-webkit-scrollbar { width: 8px; }
        div::-webkit-scrollbar-track { background: #FAF7F2; }
        div::-webkit-scrollbar-thumb { background: #829460; border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(56%) sepia(11%) saturate(1054%) hue-rotate(42deg) brightness(91%) contrast(85%);
        }
        input:focus, select:focus { outline: none; border-color: #829460 !important; }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", fontFamily: "Arial, sans-serif" }}>

        <h1 style={{ textAlign: "center", marginBottom: 40, fontSize: "2.5rem", color: cores.texto }}>
          📚 Sistema de Biblioteca
        </h1>

        {aviso.texto && (
          <div style={{ backgroundColor: aviso.tipo === "erro" ? "#F8D7DA" : "#D4EDDA", color: aviso.tipo === "erro" ? "#842029" : "#155724", border: "2px solid", borderColor: aviso.tipo === "erro" ? "#F5C2C7" : "#C3E6CB", padding: 16, borderRadius: 12, marginBottom: 24, textAlign: "center", fontWeight: "bold" }}>
            {aviso.texto}
          </div>
        )}

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ marginBottom: 20, textAlign: "center", color: cores.texto }}>Cadastrar Usuário</h2>
              <input style={inputStyle} placeholder="Nome" value={formUsuario.nome} onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })} />
              <input style={inputStyle} placeholder="Email" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} />
              <input style={inputStyle} placeholder="Telefone" value={formUsuario.telefone} onChange={(e) => setFormUsuario({ ...formUsuario, telefone: e.target.value })} />
            </div>
            <button style={botaoStyle} onClick={() => salvar("/api/create/usuarios", formUsuario)}>SALVAR USUÁRIO</button>
          </div>

          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ marginBottom: 20, textAlign: "center", color: cores.texto }}>Cadastrar Livro</h2>
              <input style={inputStyle} placeholder="Título" value={formLivro.titulo} onChange={(e) => setFormLivro({ ...formLivro, titulo: e.target.value })} />
              <input style={inputStyle} placeholder="Autor" value={formLivro.autor} onChange={(e) => setFormLivro({ ...formLivro, autor: e.target.value })} />
              <input style={inputStyle} placeholder="Gênero" value={formLivro.genero} onChange={(e) => setFormLivro({ ...formLivro, genero: e.target.value })} />
              <input style={inputStyle} type="number" placeholder="Quantidade" value={formLivro.quantidade} onChange={(e) => setFormLivro({ ...formLivro, quantidade: e.target.value })} />
            </div>
            <button style={botaoStyle} onClick={() => salvar("/api/create/livros", formLivro)}>SALVAR LIVRO</button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", marginTop: 24 }}>
          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ marginBottom: 20, textAlign: "center", color: cores.texto }}>Empréstimo</h2>
              <select style={inputStyle} value={formEmprestimo.usuarioId} onChange={(e) => setFormEmprestimo({ ...formEmprestimo, usuarioId: e.target.value })}>
                <option value="">Selecione o Usuário</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
              <input style={inputStyle} type="date" value={formEmprestimo.dataEmprestimo} onChange={(e) => setFormEmprestimo({ ...formEmprestimo, dataEmprestimo: e.target.value })} />
              <div style={{ maxHeight: 180, overflowY: "auto", border: `2px solid ${cores.borda}`, padding: 8, borderRadius: 8 }}>
                {livros.map(l => {
                  const marcado = formEmprestimo.livrosIds.includes(l.id);
                  const semEstoque = l.quantidade <= 0;
                  return (
                    <div key={l.id} onClick={() => clicarNoLivro(l)} style={{ padding: "10px", marginBottom: 5, borderRadius: 8, backgroundColor: marcado ? "#F0EBE5" : (semEstoque ? "#FEE2E2" : "#F8F9FA"), cursor: semEstoque ? "not-allowed" : "pointer", border: marcado ? `2px solid ${cores.primaria}` : (semEstoque ? "1px solid #FECACA" : "1px solid #EEE"), display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", opacity: semEstoque && !marcado ? 0.6 : 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input type="checkbox" checked={marcado} readOnly style={{ width: 18, height: 18, accentColor: cores.primaria }} />
                        <span style={{ fontSize: "14px", color: marcado ? cores.primaria : (semEstoque && !marcado ? "#991B1B" : cores.texto), fontWeight: marcado ? "bold" : "normal" }}>
                          {l.titulo} {semEstoque && "(ESGOTADO)"}
                        </span>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: semEstoque ? "#DC2626" : "inherit" }}>Qtd: {l.quantidade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button style={botaoStyle} onClick={() => salvar("/api/emprestar", formEmprestimo)}>CONFIRMAR</button>
          </div>

          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ marginBottom: 20, textAlign: "center", color: cores.texto }}>Devolução</h2>
              <select style={inputStyle} value={formDevolucao.emprestimoId} onChange={selecionarEmprestimo}>
                <option value="">Selecione o Empréstimo</option>
                {emprestimos.map(e => e.status === "ativo" && <option key={e.id} value={e.id}>Cod: {e.id.substring(0, 6)}</option>)}
              </select>
              <div style={{ maxHeight: 180, overflowY: "auto", border: `2px solid ${cores.borda}`, padding: 8, borderRadius: 8 }}>
                {formDevolucao.livrosIds.map(id => (
                  <div key={id} style={{ padding: "10px", marginBottom: 5, borderRadius: 8, backgroundColor: cores.devolucao, border: "1px solid #FFD8A8", display: "flex", alignItems: "center", gap: "12px" }}>
                    <input type="checkbox" checked={true} readOnly style={{ width: 18, height: 18, accentColor: cores.primaria }} />
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: cores.texto }}>{livros.find(l => l.id === id)?.titulo || "Livro"}</span>
                  </div>
                ))}
              </div>
            </div>
            <button style={botaoStyle} onClick={() => salvar("/api/devolver", formDevolucao)}>DEVOLVER</button>
          </div>
        </div>

        <div style={{ marginTop: 40, backgroundColor: "#FFF", padding: 30, borderRadius: 16, border: `1px solid ${cores.borda}` }}>
          <h2 style={{ textAlign: "center", marginBottom: 30, color: cores.texto }}>Usuários Cadastrados no Sistema</h2>

          <h3 style={{ marginBottom: 15, color: cores.primaria, textAlign: "center" }}>👥 Lista de Usuários</h3>
          <div style={{ border: `1px solid ${cores.borda}`, borderRadius: 8, overflow: "hidden", marginBottom: 30 }}>
            {usuarios.map(u => (
              <div key={u.id} style={{ padding: "12px 20px", borderBottom: "1px solid #EEE", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FCFBFA" }}>
                <span style={{ color: cores.texto }}><strong>{u.nome}</strong> <br /> {u.email}</span>
                <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: "#E0F2FE", color: "#075985" }}>USUÁRIO</span>
              </div>
            ))}
          </div>
          <h2 style={{ textAlign: "center", marginBottom: 30, color: cores.texto }}>Livros Cadastrados no Sistema</h2>
          <h3 style={{ marginBottom: 15, color: cores.primaria, textAlign: "center" }}>📚 Livros</h3>
          <div style={{ border: `1px solid ${cores.borda}`, borderRadius: 8, overflow: "hidden", marginBottom: 30 }}>
            {livros.map(l => {
              const semEstoque = l.quantidade <= 0;
              return (
                <div key={l.id} style={{ padding: "12px 20px", borderBottom: "1px solid #EEE", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FCFBFA" }}>
                  <span style={{ color: cores.texto }}><strong>{l.titulo}</strong> <br /> Autor: {l.autor}</span>
                  <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: semEstoque ? "#FEE2E2" : "#D1FAE5", color: semEstoque ? "#991B1B" : "#065F46" }}>
                    {semEstoque ? "ESGOTADO" : `Qtd: ${l.quantidade}`}
                  </span>
                </div>
              );
            })}
          </div>
          <h2 style={{ textAlign: "center", marginBottom: 30, color: cores.texto }}>Empréstimos</h2>
          <h3 style={{ marginBottom: 15, color: cores.primaria, textAlign: "center" }}>📄 Histórico de Empréstimos</h3>
          <div style={{ border: `1px solid ${cores.borda}`, borderRadius: 8, overflow: "hidden" }}>
            {emprestimos.map(e => {
              const usuario = usuarios.find(u => u.id === e.usuarioId);
              return (
                <div key={e.id} style={{ padding: "12px 20px", borderBottom: "1px solid #EEE", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FCFBFA" }}>
                  <span style={{ color: cores.texto }}>ID: <strong>{e.id.substring(0, 8)}</strong> <br /> Usuário: <strong>{usuario?.nome || "Desconhecido"}</strong></span>
                  <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: e.status === "ativo" ? "#FEF3C7" : "#D1FAE5", color: e.status === "ativo" ? "#92400E" : "#065F46" }}>
                    {e.status === "ativo" ? "EM EMPRÉSTIMO" : "DEVOLVIDO"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}