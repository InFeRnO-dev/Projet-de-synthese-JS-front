const serviceBaseUrlList = "http://localhost:3333/list"

class ListAPI extends ServiceUserAccount{
    constructor() {
        super()
    }
    getAllList() {
        return fetchJSON(serviceBaseUrlList, this.token)
    }
    getAllListArchived() {
        return fetchJSON(`${serviceBaseUrlList}/archived`, this.token)
    }

    getAllListCurrent() {
        return fetchJSON(`${serviceBaseUrlList}/current`, this.token)
    }

    getMaxId() {
       return fetchJSON(`${serviceBaseUrlList}/max`)
    }

    getListById(id) {
        return fetchJSON(`${serviceBaseUrlList}/${id}`, this.token)
    }

    delete(id) {
        this.headers.delete('Content-Type')
        return fetch(`${serviceBaseUrlList}/${id}`, {method: 'DELETE', headers: this.headers})
    }

    insert(list) {
        this.headers.set('Content-Type','application/json')
        return fetch(serviceBaseUrlList, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }

    update(list) {
        this.headers.set('Content-Type','application/json')
        return fetch(serviceBaseUrlList, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
}