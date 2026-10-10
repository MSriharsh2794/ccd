const databaseName = 'ccd-admin-workspace'
const storeName = 'content'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function runTransaction(mode, operation) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const request = operation(transaction.objectStore(storeName))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export function loadAdminContent() {
  return runTransaction('readonly', (store) => store.getAll())
}

export function saveAdminContent(entry) {
  return runTransaction('readwrite', (store) => store.put(entry))
}

export function deleteAdminContent(id) {
  return runTransaction('readwrite', (store) => store.delete(id))
}