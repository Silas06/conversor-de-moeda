



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


































