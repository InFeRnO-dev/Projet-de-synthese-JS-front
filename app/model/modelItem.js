class ModelItem {
    constructor() {
        this.apiitem = new ItemAPI ()
    }
    async getAllItem(idlist) {
        let items = []
        for (let item of await this.apiitem.getAllItem(idlist)) {
            items.push(Object.assign(new Item(), item))

        }
        return items
    }
    async getItemById(idlist, iditem) {
        try {
            const item = Object.assign(new Item(), await this.apiitem.getItemById(idlist, iditem))
            return item
        } catch (e) {
            if (e === 404) return null
            console.log(e)
            return undefined
        }
    }
    delete(idlist, iditem) {
        return this.apiitem.delete(idlist, iditem).then(res => res.status)
    }
    insert(obj) {
        return this.apiitem.insert(obj).then(res => res.status)
    }
    update(obj) {
        return this.apiitem.update(obj).then(res => res.status)
    }
}