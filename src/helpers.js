const setValue = (name, value) => chrome.storage.sync.set(name, value)
const getValue = async (name) => await chrome.storage.sync.get(name)

const setPageLocalStorage = (items) => Object.keys(items).forEach(key => localStorage.setItem(key, items[key]))
const setPageSessionStorage = (items) => Object.keys(items).forEach(key => sessionStorage.setItem(key, items[key]))

const sendMessage = (tabId, action, data) => (
  new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(parseInt(tabId), {action, data}, response => resolve(response))
  })
)

const getLocalStorage = (tabId) => sendMessage(tabId, 'getLocalStorage')
const getSessionStorage = (tabId) => sendMessage(tabId, 'getSessionStorage')
const setLocalStorage = (tabId, items) => sendMessage(tabId, 'setLocalStorage', {items})
const setSessionStorage = (tabId, items) => sendMessage(tabId, 'setSessionStorage', {items})

const createCheckboxItem = (type, name) => {
  const temp = document.getElementById('template-checkbox-item')
  const clone = temp.content.cloneNode(true)
  const input = clone.querySelector("input")
  const span = clone.querySelector("span")

  input.classList.add(`${type}-checkbox`)
  input.dataset.storage = type
  input.dataset.key = name
  span.innerText = name

  return clone
}
const createLocalCheckbox = (name) => createCheckboxItem('local', name)
const createSessionCheckbox = (name) => createCheckboxItem('session', name)

const checkAll = (name) => Array.from(document.getElementsByClassName(`${name}-checkbox`)).forEach(e => e.checked = true)
const uncheckAll = (name) => Array.from(document.getElementsByClassName(`${name}-checkbox`)).forEach(e => e.checked = false)

const pasteToClipboard = (content) => navigator.clipboard.writeText(content)