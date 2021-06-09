const setPageLocalStorage = (items) => Object.keys(items).forEach(key => localStorage.setItem(key, items[key]))
const setPageSessionStorage = (items) => Object.keys(items).forEach(key => sessionStorage.setItem(key, items[key]))

/**
 * Listener for popup messages.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    switch(request.action){
      case 'getLocalStorage':
        return sendResponse(localStorage)
      case 'getSessionStorage':
        return sendResponse(sessionStorage)
      case 'setLocalStorage':
        return sendResponse(setPageLocalStorage(request.data.items))
      case 'setSessionStorage':
        return sendResponse(setPageSessionStorage(request.data.items))
    }
})