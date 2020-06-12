class ModelPartage {
    constructor() {
        this.apipartage = new PartageAPI ()
    }
    async getAllPartageByIdList(idlist) {
        let partages = []
        for (let partage of await this.apipartage.getAllPartageByIdList(idlist)) {
            partages.push(Object.assign(new Partage(), partage))

        }
        return partages
    }
    async getAllPartageByIdUser(iduser) {
        let partages = []
        for (let partage of await this.apipartage.getAllPartageByIdUser(iduser)) {
            partages.push(Object.assign(new Partage(), partage))

        }
        return partages
    }
    async getLoginById(iduser) {
        try {
            return await this.apipartage.getLoginById(iduser)
        }
        catch (e) {
            if (e === 404) return null
            console.log(e)
            return undefined
        }
    }
    async getListById(idlist) {
        try {
            const list = Object.assign(new List(), await this.apipartage.getListById(idlist))
            list.date = new Date(list.date)
            return list
        } catch (e) {
            if (e === 404) return null
            console.log(e)
            return undefined
        }
    }
    async getPartageById(idpartage) {
        try {
            const partage = Object.assign(new Partage(), await this.apipartage.getPartageById(idpartage))
            return partage
        }
        catch (e) {
            if (e === 404) return null
            console.log(e)
            return undefined
        }
    }
    async getUserByLogin(login) {
        let iduser = await this.apipartage.getUserByLogin(login)
        return iduser.id_user
    }
    updateList(obj) {
        return this.apipartage.updateList(obj).then(res=> res.status)
    }
    insert(obj) {
        return this.apipartage.insert(obj).then(res => res.status)
    }
    update(obj) {
        return this.apipartage.update(obj).then(res => res.status)
    }
    delete(obj) {
        return this.apipartage.delete(obj).then(res => res.status)
    }
}