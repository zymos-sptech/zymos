// Tipo da cerveja (começa vazio)
let tipoCerveja = "";

function escolherAle() {
  tipoCerveja = "Ale";

  const div_estilos = document.getElementById("div_estilos");
  div_estilos.innerHTML = `
    <button class="estilo-ativo" onclick="escolherAle()"><i class="fa-solid fa-beer-mug-empty"></i> Ale (18°C - 22°C)</button>
    <button class="estilo" onclick="escolherLager()"><i class="fa-regular fa-snowflake"></i> Lager (8°C - 13°C)</button>`;
}

function escolherLager() {
  tipoCerveja = "Lager";

  const div_estilos = document.getElementById("div_estilos");
  div_estilos.innerHTML = `
    <button class="estilo" onclick="escolherAle()"><i class="fa-solid fa-beer-mug-empty"></i> Ale (18°C - 22°C)</button>
    <button class="estilo-ativo" onclick="escolherLager()"><i class="fa-regular fa-snowflake"></i> Lager (8°C - 13°C)</button>`;
}

// Declaração da Função
function simular() {
  const ipt_litros = document.getElementById("ipt_litros");
  const ipt_custo_producao = document.getElementById("ipt_custo_producao");
  const ipt_preco_litro = document.getElementById("ipt_preco_litro");
  const ipt_taxa = document.getElementById("ipt_taxa");
  const div_exibir = document.getElementById("div_exibir");

  // Declaração das variáveis locais
  let taxaDesperdicioPadrao = 0.05;

  let producaoLitros = Number(ipt_litros.value);
  let custoProducao = Number(ipt_custo_producao.value);
  let precoLitro = Number(ipt_preco_litro.value);
  let taxaDesperdicio = Number(ipt_taxa.value);

  // Verificação de campos preenchidos
  if (tipoCerveja == "") {
    alert("Selecione o tipo da produção");
  } else if (producaoLitros == "") {
    alert("Insira o valor da produção");
  } else if (precoLitro == "") {
    alert("Insira o valor de venda por litro");
  } else if (custoProducao == "") {
    alert("Insira o custo de produção");
  } else {
    let litrosDesperdiciados = 0;

    if (taxaDesperdicio > 0) {
      litrosDesperdiciados = producaoLitros * (taxaDesperdicio / 100);
    } else {
      litrosDesperdiciados = producaoLitros * taxaDesperdicioPadrao;
    }

    // Operações aritméticas
    let dinheiroPerdido = (litrosDesperdiciados * precoLitro).toFixed(2);
    let dinheiroProducao = (custoProducao * litrosDesperdiciados).toFixed(2);
    let porcentagemPerda = (
      (litrosDesperdiciados / producaoLitros) *
      100
    ).toFixed(1);
    let litrosTexto = litrosDesperdiciados.toFixed(1);

    // Atribuição de saídas para os Cards e para o texto
    let cenarioEmpresa = `
            <div class="span-container">
                <div class="card">
                    <div class="card-topo">
                        <span class="card-titulo">Volume (Litros)</span>
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                    <span class="card-valor">${litrosTexto} L</span>
                    <p class="card-descricao">desperdiçados</p>
                </div>

                <div class="card">
                    <div class="card-topo">
                        <span class="card-titulo">Impacto Relativo</span>
                        <i class="fa-solid fa-percent"></i>
                    </div>
                    <span class="card-valor">${porcentagemPerda}%</span>
                    <p class="card-descricao">da produção perdida</p>
                </div>

                <div class="card">
                    <div class="card-topo">
                        <span class="card-titulo">Custo direto (R$)</span>
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <span class="card-valor">R$ ${dinheiroProducao}</span>
                    <p class="card-descricao">gasto em produção perdida</p>
                </div>

                <div class="card">
                    <div class="card-topo">
                        <span class="card-titulo" style="color:#BA1A1A">Vendas brutas (R$)</span>
                        <i class="fa-solid fa-arrow-trend-down" style="color:#BA1A1A"></i>
                    </div>
                    <span class="card-valor" style="color:#BA1A1A">R$ ${dinheiroPerdido}</span>
                    <p class="card-descricao">prejuízo em vendas</p>
                </div>

                <div class="resultado-texto">
                    <i class="fa-solid fa-chart-pie"></i>
                    A fermentação é a fase mais crítica da sua produção: pequenas oscilações térmicas
                    invisíveis estressam a levedura e estragam o lote. No seu cenário atual, sua empresa
                    de fabricação de cerveja do tipo
                    <b style="color: var(--color-green-light);">${tipoCerveja}</b> possui um desperdício de
                    <b style="color: var(--color-accent);">${litrosTexto} litro(s)</b>, o que representa
                    <b style="color: var(--color-accent);">${porcentagemPerda}%</b> da sua produção total.
                    Isso equivale a uma perda direta de produção de
                    <b style="color: var(--color-accent);">R$ ${dinheiroProducao}</b> e um potencial de receita
                    não realizado de <b style="color: var(--color-accent);">R$ ${dinheiroPerdido}</b>.
                </div>
            </div>`;

    div_exibir.innerHTML = cenarioEmpresa;
  }
}
