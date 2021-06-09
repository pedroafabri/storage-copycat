let localStorage = []
let sessionStorage = []

/**
 * DOM Elements
 */
const tabSelect = document.getElementById('tab-select')
const storageTable = document.getElementById('storage-table-body')
const tableContainer = document.getElementById('table-container')
const buttonsContainer = document.getElementById('buttons-container')
const copyToPageButton = document.getElementById('copy-to-page')
const copyToClipboardButton = document.getElementById('copy-to-clipboard')

/**
 * Executed as soon as the extension page opens.
 */
const onWindowLoad = async () => {
  const filter = { active: false, currentWindow: true }
  const tabs = await chrome.tabs.query(filter)
  tabs.forEach(tab => {
      const option = document.createElement('option')
      option.text = tab.title
      option.value = tab.id
      tabSelect.add(option)
    })
}

/**
 * Executed when a tab is selected from the select
 */
const onTabSelection = async () => {
  storageTable.innerHTML = ''
  localStorage = await getLocalStorage(tabSelect.value)
  sessionStorage = await getSessionStorage(tabSelect.value)
  const localStorageKeys = Object.keys(localStorage)
  const sessionStorageKeys = Object.keys(sessionStorage)

  const rowCount = localStorageKeys.length > sessionStorageKeys.length 
    ? localStorageKeys.length 
    : sessionStorageKeys.length

  for(var i = 0; i < rowCount; i++) {
    const row = storageTable.insertRow()
    localStorageKeys[i] && row.insertCell().appendChild(createLocalCheckbox(localStorageKeys[i])) 
    sessionStorageKeys[i] && row.insertCell().appendChild(createSessionCheckbox(sessionStorageKeys[i]))
  }

  tableContainer.style.display = rowCount ? 'flex' : 'hidden'
  buttonsContainer.style.display = rowCount ? 'flex' : 'hidden'
}

/**
 * Handle clicks on the table
 */
const onTableClick = (event) => {
  const target = event.target
  // Only process checkbox clicks
  if(target.tagName.toLowerCase() !== 'input' || target.type.toLowerCase() !== 'checkbox') return

  // If it's a generic checkbox and it's false, disable check-all
  if(target.dataset.storage && !target.checked) {
    return Array.from(document.getElementsByClassName('check-all'))
      .find(e => e.dataset.target === target.dataset.storage)
      .checked = false
  }

  // If it's a 'check-all' checkbox
  if(target.dataset.target){
    return target.checked ? checkAll(target.dataset.target) : uncheckAll(target.dataset.target)
  }
}

/**
 * Returns an object with both selected localStorage and sessionStorage keys
 */
const getCheckedValues = () => {
  let local = {}
  let session = {}
  const inputs = Array.from(document.getElementsByTagName('input'))
  for(const input of inputs){
    const {dataset, type, checked} = input
    const {storage, key} = dataset

    if(
      type.toLowerCase() !== 'checkbox' || // If not checkbox
      !checked || // or not checked
      !storage // or not generic
    ) continue

    switch(storage) {
      case 'local':
        local[key] = localStorage[key]
        break
      case 'session':
        session[key] = sessionStorage[key]
        break
    }
  }

  return {
    localStorage: local,
    sessionStorage: session
  }
}

/**
 * When button clicked, paste values on page storages
 */
const copyToPage = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const {localStorage: newLocal, sessionStorage: newSession} = getCheckedValues()
  await setLocalStorage(tab.id, newLocal)
  await setSessionStorage(tab.id, newSession)
  window.close()
}

/**
 * When button clicked, paste values on clipboard
 */
const copyToClipboard = async () =>{ 
  await pasteToClipboard(JSON.stringify(getCheckedValues()))
  window.close()
}

// Event Listeners
window.addEventListener('load', onWindowLoad)
tabSelect.addEventListener('change', onTabSelection)
tableContainer.addEventListener('click', onTableClick)
copyToPageButton.addEventListener('click', copyToPage)
copyToClipboardButton.addEventListener('click', copyToClipboard)