/*
  - Construa uma aplicação de conversão de moedas. O HTML e CSS são os que você
    está vendo no browser;
  - Você poderá modificar a marcação e estilos da aplicação depois. No momento, 
    concentre-se em executar o que descreverei abaixo;
    - Quando a página for carregada: 
      - Popule os <select> com tags <option> que contém as moedas que podem ser
        convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
        dollar dos Estados Unidos, etc.
      - O option selecionado por padrão no 1º <select> deve ser "USD" e o option
        no 2º <select> deve ser "BRL";
      - O parágrafo com data-js="converted-value" deve exibir o resultado da 
        conversão de 1 USD para 1 BRL;
      - Quando um novo número for inserido no input com 
        data-js="currency-one-times", o parágrafo do item acima deve atualizar 
        seu valor;
      - O parágrafo com data-js="conversion-precision" deve conter a conversão 
        apenas x1. Exemplo: 1 USD = 5.0615 BRL;
      - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
        mudança nos selects;
      - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
        cada mudança nos selects e/ou no input com data-js="currency-one-times";
      - Para que o valor contido no parágrafo do item acima não tenha mais de 
        dois dígitos após o ponto, você pode usar o método toFixed: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    - Para obter as moedas com os valores já convertidos, use a Exchange rate 
      API: https://www.exchangerate-api.com/;
      - Para obter a key e fazer requests, você terá que fazer login e escolher
        o plano free. Seus dados de cartão de crédito não serão solicitados.
*/




const currenciesEl = document.querySelector('[data-js="currencies-container"]')
const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const convertedValueEl = document.querySelector('[data-js="converted-value"]')
const precisionValueEl = document.querySelector('[data-js="conversion-precision"]')
const timeCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]')

let internalExchangeRates = {}

const getUrl = currency => `https://v6.exchangerate-api.com/v6/424e0d69a2cc2e1c8fdddb09/latest/${currency}`

const getErrorMessage = function (errorType) {
  return {
    'unsupported-code': 'Moeda não encontrada em nosso banco de dados',
    'base-code-only-on-pro': 'Informações de moedas que não sejan USD ou EUR só podem ser acessadas a partir de um plano pago',
    'malformed-request': 'Alguma parte da solicitação esta fora do esperado',
    'invalid-key': 'Chave de identificação inválida',
    'quota-reached': 'Cota de solicitaçoes vencidas ',
    'not-available-on-plan': 'Seu plano não suporta esta solicitação',
  }[errorType] || 'Não foi possivel acessar as informações'

}

const fetchExtendChangeRate = async (url) => {

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Sua conexão falhou. Não foi possível obter as informações')
    }

    const exchangeRateData = await response.json()

    if (exchangeRateData.result === 'error') {
      throw new Error(getErrorMessage(exchangeRateData['error-type']))
    }


    return exchangeRateData

  } catch (err) {

    const div = document.createElement('div')
    const button = document.createElement('button')

    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show')
    div.setAttribute('role', 'alert')

    button.classList.add('btn-close')
    button.setAttribute('aria-label', 'close')
    button.setAttribute('type', 'button')
    button.addEventListener('click', () => {
      div.remove()
    })

    div.textContent = err.message
    div.appendChild(button)


    currenciesEl.insertAdjacentElement('afterend', div)

  }

}

const init = async () => {
  
  internalExchangeRates = { ...(await fetchExtendChangeRate(getUrl('USD'))) }

  const getOptions = selectedCurrency => Object.keys(internalExchangeRates.conversion_rates).map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}> ${currency} </option>`).join('')




  currencyOneEl.innerHTML = getOptions('USD')
  currencyTwoEl.innerHTML = getOptions('BRL')

  convertedValueEl.textContent = internalExchangeRates.conversion_rates[currencyTwoEl.value].toLocaleString('pt-BR',{style:'currency',currency:currencyTwoEl.value})
  precisionValueEl.textContent = ` 1 USD = ${internalExchangeRates.conversion_rates[currencyTwoEl.value]} BRL `


} 

timeCurrencyOneEl.addEventListener('input', e => {
  convertedValueEl.textContent = (e.target.value * internalExchangeRates.conversion_rates[currencyTwoEl.value]).toLocaleString('pt-BR',{style:'currency',currency:currencyTwo El.value})
})

currencyTwoEl.addEventListener('input', (e)=>{
  const currencyTwoValue = internalExchangeRates.conversion_rates[e.target.value]
  convertedValueEl.textContent = (timeCurrencyOneEl.value * currencyTwoValue).toLocaleString('pt-BR',{style:'currency', currency: currencyTwoEl.value})
  precisionValueEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRates.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`
  
})

currencyOneEl.addEventListener('input', async e => {
  
  internalExchangeRates ={ ...(await fetchExtendChangeRate(getUrl(e.target.value)))}

  convertedValueEl.textContent = (timeCurrencyOneEl.value * internalExchangeRates.conversion_rates[currencyTwoEl.value]).toLocaleString('pt-BR',{style:'currency',currency:currencyTwoEl.value})
  precisionValueEl.textContent  = `1 ${currencyOneEl.value} = ${1 * internalExchangeRates.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value} ` 
})

init()


// API


































