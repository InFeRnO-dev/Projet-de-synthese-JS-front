const serviceBaseUrlItem = "http://localhost:3333/item"

class ItemAPI extends ServiceUserAccount{
    constructor() {
        super()
    }

    getAllItem(idlist) {
        return fetchJSON(`${serviceBaseUrlItem}/${idlist}`)
    }

    getItemById(idlist, iditem) {
        return fetchJSON(`${serviceBaseUrlItem}/${idlist}/${iditem}`)
    }

    delete(idlist, iditem) {
        console.log(idlist, iditem)
        return fetch(`${serviceBaseUrlItem}/${idlist}/${iditem}`, { method: 'DELETE' })
    }

    insert(item) {
        return fetch(serviceBaseUrlItem, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    }

    update(item) {
        console.log(item)
        return fetch(serviceBaseUrlItem, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    }
}