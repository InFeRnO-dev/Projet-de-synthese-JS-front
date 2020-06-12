class List {
    constructor(shop, date, archived, fk_id_user) {
        this.shop = shop
        this.date = date
        this.archived = archived
        this.fk_id_user = fk_id_user
    }

}
class Item {
    constructor(label, quantity, checked, contains) {
        this.label = label
        this.quantity = quantity
        this.checked = checked
        this.contains = contains
    }
}
class Partage {
    constructor(id_proprio,id_partage_user,id_list,droits) {
        this.id_proprio = id_proprio
        this.id_partage_user = id_partage_user
        this.id_list = id_list
        this.droits = droits
    }
}