const rVotoPara = document.querySelector('.esquerda .rotulo.r1 span')
const rCargo = document.querySelector('.esquerda .rotulo.r2 span')
const numeros = document.querySelector('.esquerda .rotulo.r3')
const rDescricao = document.querySelector('.esquerda .rotulo.r4')
const rMensagem = document.querySelector('.esquerda .rotulo.r4 .mensagem')
const rNomeCandidato = document.querySelector('.esquerda .rotulo.r4 .nome-candidato')
const rPartidoPolitico = document.querySelector('.esquerda .rotulo.r4 .partido-politico')
const rNomeVice = document.querySelector('.esquerda .rotulo.r4 .nome-vice')
const rRodape = document.querySelector('.tela .rodape')

const rCandidato = document.querySelector('.direita .candidato')
const rVice = document.querySelector('.direita .candidato.menor')

const votos = []

var etapaAtual = 0
var etapas = null
var numeroDigitado = ''
var votoEmBranco = false
var resposta = null
ajax('etapas.json', 'GET', (response) => {
  etapas = JSON.parse(response)
  console.log(etapas)

  comecarEtapa()
})

window.onload = () => {
  let btns = document.querySelectorAll('.teclado--botao')
  for (let btn of btns) {
    btn.onclick = () => {
      clicar(btn.innerHTML)
    }
  }

  document.querySelector('.teclado--botao.branco').onclick = () => branco()
  document.querySelector('.teclado--botao.laranja').onclick = () => corrigir()
  document.querySelector('.teclado--botao.verde').onclick = () => confirmar()
}
document.getElementById("vervotos").addEventListener("click", verVotos);
document.getElementById("zerarvotos").addEventListener("click", zerarVotos);

function verVotos(){
  console.log("VER VOTOS EM AÇÃO BABY")
  const element = document.getElementById("divPrefeitos")
  element.innerHTML=""
  const title = document.createElement("h4")
  title.innerText = "Prefeitos:"
  document.getElementById("divPrefeitos").appendChild(title);
  const tablePrefeitos = document.createElement("table")
  tablePrefeitos.id = "tablePrefeitos"
  document.getElementById("divPrefeitos").appendChild(tablePrefeitos)
  const element2 = document.getElementById("divVereadores")
  element2.innerHTML=""
  const title2 = document.createElement("h4")
  title2.innerText = "Vereadores:"
  document.getElementById("divVereadores").appendChild(title2);
  const tableVereadores = document.createElement("table")
  tableVereadores.id = "tableVereadores"
  document.getElementById("divVereadores").appendChild(tableVereadores)

  ajax('https://trabalho-final-paulo-roma.herokuapp.com/api/getvotos', 'GET', (response) => {
    resposta = JSON.parse(response)
    // console.log(resposta["prefeito"])
   
    const titulosDiv = document.createElement("tr")
    titulosDiv.innerHTML = "<th>Número</th><th>Nome</th><th>Partido</th><th>Número de votos</th>"
    document.getElementById("tablePrefeitos").appendChild(titulosDiv)
    for (candidato of resposta["prefeito"]) {
      // console.log(candidato)
      const coisa = document.createElement("tr");
      coisa.innerHTML = "<td>" + candidato["numero"] + "</td><td>" + candidato["nome"] + "</td><td>" + candidato["partido"] + "</td><td class='numVotos'><b>" + candidato["quant_votos"] + "</b></td>"
      document.getElementById("tablePrefeitos").appendChild(coisa);
    }
    
    const titulosDiv2 = document.createElement("tr")
    titulosDiv2.innerHTML = "<th>Número</th><th>Nome</th><th>Partido</th><th>Número de votos</th>"
    document.getElementById("tableVereadores").appendChild(titulosDiv2)
    for (candidato of resposta["vereador"]) {
      // console.log(candidato)
      const coisa = document.createElement("tr");
      coisa.innerHTML = "<td>" + candidato["numero"] + "</td><td>" + candidato["nome"] + "</td><td>" + candidato["partido"] + "</td><td class='numVotos'><b>" + candidato["quant_votos"] + "</b></td>"
      document.getElementById("tableVereadores").appendChild(coisa);
    }
  })
}

function zerarVotos(){
  ajax('https://trabalho-final-paulo-roma.herokuapp.com/api/resetar', 'POST', (response) => {
    console.log(response)
    verVotos()
  })
}
/**
 * Inicia a etapa atual.
 */
function comecarEtapa() {
  let etapa = etapas[etapaAtual]
  console.log('Etapa atual: ' + etapa['titulo'])

  numeroDigitado = ''
  votoEmBranco = false

  numeros.style.display = 'flex'
  numeros.innerHTML = ''
  rVotoPara.style.display = 'none'
  rCandidato.style.display = 'none'
  rVice.style.display = 'none'
  rDescricao.style.display = 'none'
  rMensagem.style.display = 'none'
  rNomeCandidato.style.display = 'none'
  rPartidoPolitico.style.display = 'none'
  rNomeVice.style.display = 'none'
  rRodape.style.display = 'none'

  for (let i = 0; i < etapa['numeros']; i++) {
    let pisca = i == 0 ? ' pisca' : ''
    numeros.innerHTML += `
      <div class="numero${pisca}"></div>
    `
  }

  rCargo.innerHTML = etapa['titulo']
}

/**
 * Procura o candidato pelo número digitado,
 * se encontrar, mostra os dados dele na tela.
 */
function atualizarInterface() {
  console.log('Número Digitado:', numeroDigitado)

  let etapa = etapas[etapaAtual]
  let candidato = null

  for (let num in etapa['candidatos']) {
    if (num == numeroDigitado) {
      candidato = etapa['candidatos'][num]
      break
    }
  }

  console.log('Candidato: ' + candidato)

  rVotoPara.style.display = 'inline'
  rDescricao.style.display = 'block'
  rNomeCandidato.style.display = 'block'
  rPartidoPolitico.style.display = 'block'

  if (candidato) {
    let vice = candidato['vice']

    rRodape.style.display = 'block'
    rNomeCandidato.querySelector('span').innerHTML = candidato['nome']
    rPartidoPolitico.querySelector('span').innerHTML = candidato['partido']

    rCandidato.style.display = 'block'
    rCandidato.querySelector('.imagem img').src = `img/${candidato['foto']}`
    rCandidato.querySelector('.cargo p').innerHTML = etapa['titulo']
    
    if (vice) {
      rNomeVice.style.display = 'block'
      rNomeVice.querySelector('span').innerHTML = vice['nome']
      rVice.style.display = 'block'
      rVice.querySelector('.imagem img').src = `img/${vice['foto']}`
    } else {
      rNomeVice.style.display = 'none'
    }

    return
  }

  if (votoEmBranco) return

  // Anular o voto
  rNomeCandidato.style.display = 'none'
  rPartidoPolitico.style.display = 'none'
  rNomeVice.style.display = 'none'

  rMensagem.style.display = 'block'
  rMensagem.classList.add('pisca')
  rMensagem.innerHTML = 'VOTO NULO'
}

/**
 * Verifica se pode usar o teclado e atualiza o número.
 */
function clicar(value) {
  console.log(value)

  let elNum = document.querySelector('.esquerda .rotulo.r3 .numero.pisca')
  if (elNum && ! votoEmBranco) {
    numeroDigitado += (value)
    elNum.innerHTML = value
    elNum.classList.remove('pisca')

    let proximoNumero = elNum.nextElementSibling
    if (proximoNumero) {
      proximoNumero.classList.add('pisca')
    } else {
      atualizarInterface()
    }

    (new Audio('audio/se1.mp3')).play()
  }
}

/**
 * Verifica se há número digitado, se não,
 * vota em branco.
 */
function branco() {
  console.log('branco')
  
  // Verifica se há algum número digitado,
  // se sim, não vota
  if (! numeroDigitado) {
    votoEmBranco = true

    numeros.style.display = 'none'
    rVotoPara.style.display = 'inline'
    rDescricao.style.display = 'block'
    rMensagem.style.display = 'block'
    rMensagem.innerHTML = 'VOTO EM BRANCO';

    (new Audio('audio/se1.mp3')).play()
  }

}

/**
 * Reinicia a etapa atual.
 */
function corrigir() {
  console.log('corrigir');
  (new Audio('audio/se2.mp3')).play()
  comecarEtapa()
}

/**
 * Confirma o numero selecionado.
 */
function confirmar() {
  console.log('confirmar')

  let etapa = etapas[etapaAtual]

  if (numeroDigitado.length == etapa['numeros']) {
    if (etapa['candidatos'][numeroDigitado]) {
      // Votou em candidato
      votos.push({
        'etapa': etapa['titulo'],
        'numero': numeroDigitado
      })
      ajax('https://trabalho-final-paulo-roma.herokuapp.com/api/votar/' + etapa['titulo'] + '/' + numeroDigitado.toString(),'POST', (response) => {
        
        console.log(response)
        verVotos()
      })
      console.log(`Votou em ${numeroDigitado}`)
    } else {
      // Votou nulo
      votos.push({
        'etapa': etapa['titulo'],
        'numero': null
      })
      ajax('https://trabalho-final-paulo-roma.herokuapp.com/api/votar/' + etapa['titulo'] + '/' + '31415923565', 'POST', (response) => {
        
        console.log(response)
        verVotos()
      })
      console.log('Votou Nulo')
    }
  } else if (votoEmBranco) {
    // Votou em branco
      votos.push({
        'etapa': etapa['titulo'],
        'numero': ''
      })
    ajax('https://trabalho-final-paulo-roma.herokuapp.com/api/votar/' + etapa['titulo'] + '/' + '31415923565', 'POST', (response) => {
      
      console.log(response)
      verVotos()
    })
      console.log('Votou em Branco')
  } else {
    // Voto não pode ser confirmado
    console.log('Voto não pode ser confirmado')
    return
  }

  if (etapas[etapaAtual + 1]) {
    etapaAtual++
  } else {
    document.querySelector('.tela').innerHTML = `
      <div class="fim">FIM</div>
    `
  }

  (new Audio('audio/se3.mp3')).play()
  comecarEtapa()
}