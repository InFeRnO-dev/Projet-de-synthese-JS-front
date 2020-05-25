class ItemsController extends BaseController {
    constructor() {
        super(false)
        const idlist = indexController.getIdList()
        this.id_list = idlist
        this.tableAllItem = $('#tableAllItem')
        this.tableBodyAllItem = $('#tableBodyAllItem')
        this.displayAllItem(idlist)
    }
    async displayAllItem(idlist) {              //afficher les items

        let content = ''
        this.tableAllItem.style.display = "none"
        try {
            console.log(idlist)
            const items = await this.modelItem.getAllItem(idlist)
            for (const item of items) {
                content += `<tr><td><p style="font-family: 'Arial Black'">${item.label}</p></td>
                    <td><p style="font-family: 'Arial Black'">${item.quantity}</p></td>`
                    if(item.checked === true)
                    {
                        content += `<td><p><label><input id="cbItem" type="checkbox" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})" checked /><span></span></label></p></td>`
                    } else {
                        content += `<td><p><label><input id="cbItem" type="checkbox" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})"/><span></span></label></p></td>`
                    }
                    content += `<td><button class="btn" onclick="itemsController.displayEditItem(${item.id_item})"><i class="material-icons">edit</i></button>
                    <button class="btn" onclick="itemsController.displayDeleteItem(${item.id_item})"><i class="material-icons">delete</i></button></td></tr>`
            }
            this.tableBodyAllItem.innerHTML = content
            this.tableAllItem.style.display = "block"
            await loginController.timeout()
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async IsChecked(idlist, iditem) {           //check les items
        console.log(idlist,iditem)
        let itemcheck = await this.modelItem.getItemById(idlist,iditem)
        console.log(itemcheck.checked)
        itemcheck.checked = itemcheck.checked !== true
        console.log(itemcheck.checked)
        await this.modelItem.update(itemcheck)
    }
    async addItem() {           //ajouter un item
        let inputaddlabel = this.validateRequiredField("#inputaddlabel", 'Label')
        let inputaddquantity = this.validateRequiredField("#inputaddquantity", 'Quantité')
        let checked = false
        let contains = this.id_list
        if (inputaddlabel === null || inputaddquantity === null) return
        try {
            if (await this.modelItem.insert(new Item(inputaddlabel,inputaddquantity,checked,contains)) === 200) {
                indexController.closeModal('#modalAddItem')
                this.toast("L'ajout a été effectué")
                $("#inputaddlabel").value = ""
                $("#inputaddquantity").value = ""
                this.displayAllItem(this.id_list)
            } else {
                this.displayServiceError()
            }
        }
        catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async displayEditItem(iditem) {                 //Fonction d'affichage du modal onclick btn edit
        try {
            const item = await this.modelItem.getItemById(this.id_list, iditem)
            if (item === undefined) {
                this.displayServiceError()
                return
            }
            if (item === null) {
                this.displayNotFoundError()
                return
            }
            $('#inputeditlabel').value = item.label
            $('#inputeditquantity').value = item.quantity
            this.item = item
            indexController.openModal('#modalEditItem')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async editItem() {          //Fonction d'edition et d'update de la liste dans la table
        const item = this.item
        let inputeditlabel = this.validateRequiredField("#inputeditlabel", 'Label')
        let inputeditquantity = this.validateRequiredField("#inputeditquantity", 'Quantité')
        let checked = false
        let contains = this.id_list
        if ((inputeditlabel != null) && (inputeditquantity != null)) {
            try {
                console.log(item)
                item.label = inputeditlabel
                item.quantity = inputeditquantity
                item.checked = checked
                item.contains = contains
                if (await this.modelItem.update(item) === 200) {
                    indexController.closeModal('#modalEditItem')
                    this.toast("L'article a été modifiée")
                    this.displayAllItem(this.id_list)
                } else {
                    this.displayServiceError()
                }
            }
            catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }
    async displayDeleteItem(iditem) {     //Fonction d'affichage du modal onclick btn delete
        const item = await this.modelItem.getItemById(this.id_list, iditem)
        try {
            if (item === undefined) {
                this.displayServiceError()
                return
            }
            if (item === null) {
                this.displayNotFoundError()
                return
            }
            this.item = item
            indexController.openModal('#modalDeleteItem')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async deleteItem() {            //fonction de suppression d'un item
        const item = this.item
        try {
            if (await this.modelItem.delete(this.id_list, item.id_item) === 200) {
                this.deleteditem = item
                this.displayUndoMsgItem()
                this.displayAllItem(this.id_list)
            } else {
                this.displayServiceError()
            }
        }
        catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async undo() {              //fonction d'annulation de suppression d'un item
        try {
            if(await this.modelItem.insert(this.deleteditem) === 200) {
                this.deleteditem = null
                this.displayAllItem(this.id_list)
                this.displayundo()
            }
        } catch(err) {
            if(err === 401)
            {
                navigate('login')
                console.log(err)
                this.displayUnauthorized()
            } else {
                console.log(err)
                this.displayServiceError()
            }
        }
    }
}

window.itemsController = new ItemsController()