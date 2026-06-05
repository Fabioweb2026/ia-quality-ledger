<script>
let totalNotas = 0;
let qtdAval = 0;
let dados = JSON.parse(localStorage.getItem('iaLedger')) || [];

function renderTabela() {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  totalNotas = 0;
  qtdAval = 0;

  dados.forEach(item => {
    const row = `<tr>
      <td>${item.data}</td>
      <td>${item.promptId}</td>
      <td>${item.resposta}</td>
      <td>${item.nota}</td>
      <td>${item.tipoErro}</td>
      <td>${item.comentario}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
    totalNotas += Number(item.nota);
    qtdAval += 1;
  });

  document.getElementById('mediaNota').innerText = qtdAval? (totalNotas / qtdAval).toFixed(2) : 0;
}

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const novo = {
    data: new Date().toLocaleDateString('pt-BR'),
    promptId: document.getElementById('promptId').value,
    resposta: document.getElementById('resposta').value,
    nota: document.getElementById('nota').value,
    tipoErro: document.getElementById('tipoErro').value,
    comentario: document.getElementById('comentario').value
  };
  dados.push(novo);
  localStorage.setItem('iaLedger', JSON.stringify(dados));
  renderTabela();
  e.target.reset();
});

// Botão exportar CSV
function exportCSV() {
  let csv = 'Data,Prompt ID,Resposta,Nota,Tipo Erro,Comentario\n';
  dados.forEach(d => {
    csv += `"${d.data}","${d.promptId}","${d.resposta}","${d.nota}","${d.tipoErro}","${d.comentario}"\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ia_quality_ledger.csv';
  a.click();
}

// Carrega dados ao abrir a página
// Nova função que decide quais registros devem aparecer na tela
function filtrarRegistros() {
  const termoBusca = document.getElementById('buscaPrompt').value.toLowerCase();
  const notaSelecionada = document.getElementById('filtroNota').value;
  const erroSelecionado = document.getElementById('filtroErro').value;

  // Filtra o array principal com base nos 3 critérios ao mesmo tempo
  const registrosFiltrados = registros.filter(reg => {
    const bateuPrompt = reg.promptId.toLowerCase().includes(termoBusca);
    const bateuNota = notaSelecionada === "" || reg.nota === Number(notaSelecionada);
    const bateuErro = erroSelecionado === "" || reg.tipoErro === erroSelecionado;

    return bateuPrompt && bateuNota && bateuErro;
  });

  // Passa os itens filtrados para serem desenhados na tabela
  renderizarTabela(registrosFiltrados);
}

// Função de desenho atualizada para aceitar listas filtradas
function renderizarTabela(listaParaExibir = registros) {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = ""; // Limpa a tabela antes de redesenhar

  listaParaExibir.forEach(reg => {
    let classeBadge = "badge-sem-erro";
    if (reg.tipoErro.includes("Factualidade")) classeBadge = "badge-factualidade";
    if (reg.tipoErro.includes("Idioma")) classeBadge = "badge-idioma";
    if (reg.tipoErro.includes("Segurança")) classeBadge = "badge-seguranca";
    if (reg.tipoErro.includes("Instrução")) classeBadge = "badge-instrucao";
    if (reg.tipoErro.includes("Formato")) classeBadge = "badge-formato";

    const row = `<tr>
      <td>${reg.data}</td>
      <td><strong>${reg.promptId}</strong></td>
      <td>${reg.resposta}</td>
      <td><strong>${reg.nota}</strong>/5</td>
      <td><span class="badge ${classeBadge}">${reg.tipoErro}</span></td>
      <td>${reg.comentario}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}
</script>
