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
renderTabela();
</script>
