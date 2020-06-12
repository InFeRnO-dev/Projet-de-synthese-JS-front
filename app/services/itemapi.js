const serviceBaseUrlItem = "http://localhost:3333/item"

class ItemAPI extends ServiceUserAccount{
    constructor() {
        super()
    }

    getAllItem(idlist) {
        return fetchJSON(`${serviceBaseUrlItem}/${idlist}`, this.token)
    }

    getItemById(idlist, iditem) {
        return fetchJSON(`${serviceBaseUrlItem}/${idlist}/${iditem}`, this.token)
    }

    delete(idlist, iditem) {
        console.log(idlist, iditem)
        this.headers.delete('Content-Type')
        return fetch(`${serviceBaseUrlItem}/${idlist}/${iditem}`, { method: 'DELETE', headers: this.headers })
    }

    insert(item) {
        this.headers.set('Content-Type','application/json')
        return fetch(serviceBaseUrlItem, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }

    update(item) {
        console.log(item)
        this.headers.set('Content-Type','application/json')
        return fetch(serviceBaseUrlItem, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
}