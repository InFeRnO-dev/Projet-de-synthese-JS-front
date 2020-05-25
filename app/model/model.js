class Model {
    constructor() {
        this.apilist = new ListAPI ()
    }
    async getAllList() {
        let lists = []
        for (let list of await this.apilist.getAllList()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))

        }
        return lists
    }
    async getAllListCurrent() {
        let lists = []
        for (let list of await this.apilist.getAllListCurrent()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))

        }
        return lists
    }
    async getListById(id) {
        try {
            const list = Object.assign(new List(), await this.apilist.getListById(id))
            list.date = new Date(list.date)
            return list
        } catch (e) {
            if (e === 404) return null
            console.log(e)
            return undefined
        }
    }
    async getMaxId() {
            return await this.apilist.getMaxId()
    }
    delete(id) {
        return this.apilist.delete(id).then(res => res.status)
    }
    insert(obj) {
        return this.apilist.insert(obj).then(res => res.status)
    }
    update(obj) {
        return this.apilist.update(obj).then(res => res.status)
    }
}