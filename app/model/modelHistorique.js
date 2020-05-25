class ModelHistorique {
    constructor() {
        this.apilist = new ListAPI()
        this.apiitem = new ItemAPI()
    }
    async getAllListArchived() {
        let lists = []
        for (let list of await this.apilist.getAllListArchived()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))
        }
        return lists
    }
    async getAllItem(idlist) {
        let items = []
        for (let item of await this.apiitem.getAllItem(idlist)) {
            items.push(Object.assign(new Item(), item))

        }
        return items
    }
    insert(obj) {
        return this.apilist.insert(obj).then(res => res.status)
    }
}