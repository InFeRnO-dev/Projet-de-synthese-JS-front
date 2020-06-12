const serviceBaseUrlPartage = "http://localhost:3333/partage"

class PartageAPI extends ServiceUserAccount{
    constructor() {
        super();
    }
    getAllPartageByIdList(idlist) {
        return fetchJSON(`${serviceBaseUrlPartage}list/${idlist}`)
    }
    getAllPartageByIdUser(iduser) {
        return fetchJSON(`${serviceBaseUrlPartage}user/${iduser}`)
    }
    getPartageById(idpartage) {
        return fetchJSON(`${serviceBaseUrlPartage}/${idpartage}`)
    }
    getListById(idlist) {
        return fetchJSON(`${serviceBaseUrlPartage}/list/${idlist}`)
    }
    getUserByLogin(login) {
        return fetchJSON(`${serviceBaseUrlPartage}/user/${login}`)
    }
    getLoginById(id) {
        return fetchJSON(`${serviceBaseUrlPartage}/user/id/${id}`)
    }
    delete(idpartage) {
        return fetch(`${serviceBaseUrlPartage}/${idpartage}`, { method: 'DELETE' })
    }
    updateList(list) {
        return fetch(`${serviceBaseUrlPartage}/list`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })
    }

    insert(partage) {
        return fetch(serviceBaseUrlPartage, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partage)
        })
    }
    update(partage) {
        return fetch(serviceBaseUrlPartage, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partage)
        })
    }
}