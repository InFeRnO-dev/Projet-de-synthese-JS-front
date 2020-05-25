class HistoriqueController extends BaseController {
    constructor() {
        super(true)
        this.tableAlllistArchived = $('#tableAllListArchived')
        this.tableBodyAlllistArchived = $('#tableBodyAllListArchived')
        this.tableBodyViewAllListArchived = $('#tableBodyViewAllItem')
        this.displayAllListArchived()
    }
    async displayAllListArchived() {                //afficher toutes les listes archivées
        let content = ''
        this.tableAlllistArchived.style.display = "none"
        try {
            const lists = await this.modelHistorique.getAllListArchived()
            for (const list of lists) {
                const date = list.date.toLocaleDateString()
                content += `<tr><td><p style="font-family: 'Arial Black'">${list.shop}</p></td>
                    <td><p style="font-family: 'Arial Black'">${date}</p></td>
                    <td><button class="btn" onclick="historiqueController.displayViewItem(${list.id_list})"><i class="material-icons">visibility</i></button>
                    <button class="btn" onclick="historiqueController.displayDeleteArchivedList(${list.id_list})"><i class="material-icons">delete</i></button></td></tr>`
            }
            this.tableBodyAlllistArchived.innerHTML = content
            this.tableAlllistArchived.style.display = "block"
            await loginController.timeout()
        } catch (err) {
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
    async displayViewItem(idlist) {             //afficher les items d'une liste
        let content = ''
        try {
            const items = await this.modelHistorique.getAllItem(idlist)
            for (const item of items) {
                content += `<tr><td><p style="font-family: 'Arial Black'">${item.label}</p></td>
                    <td><p style="font-family: 'Arial Black'">${item.quantity}</p></td>`
                if(item.checked === true)
                {
                    content += `<td><p><label><input id="cbItem" type="checkbox" disabled="disabled" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})" checked /><span></span></label></p></td>`
                } else {
                    content += `<td><p><label><input id="cbItem" type="checkbox" disabled="disabled" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})"/><span></span></label></p></td>`
                }
                content += `</tr>`
            }
            this.tableBodyViewAllListArchived.innerHTML = content
            indexController.openModal('#modalViewListHistorique')
        } catch (err) {
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
    async displayDeleteArchivedList(id) {     //Fonction d'affichage du modal onclick btn delete
        const list = await this.model.getListById(id)
        console.log(list.id_list)
        try {
            if (list === undefined) {
                this.displayServiceError()
                return
            }
            if (list === null) {
                this.displayNotFoundError()
                return
            }
            this.list = list
            console.log(this.list)
            indexController.openModal('#modalDeleteArchivedList')
        } catch (err) {
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
    async deleteArchivedList() {                //fonction de suppression d'une liste archivée
        const list = this.list
        const items = await itemsController.modelItem.getAllItem(list.id_list)
        this.idmax = await indexController.model.getMaxId()
        try {
            if (await this.model.delete(list.id_list) === 200) {
                this.itemsarchived = items
                this.deletedarchived = list
                this.displayUndoMsgHistorique()
                this.displayAllListArchived()
            } else {
                this.displayServiceError()
            }
        }
        catch (err) {
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
        this.displayAllListArchived()
    }
    async undo() {                      //fonction d'annulation de suppression d'une liste archivée
        try {
            const id = this.idmax.max + 1
            this.deletedarchived = await this.modelHistorique.insert(this.deletedarchived)
            if(this.deletedarchived === 200) {
                for (const item of this.itemsarchived) {
                    item.contains = id
                    await itemsController.modelItem.insert(item)
                }
                this.itemsarchived = null
                this.deletedarchived = null
                this.displayundo()
                this.displayAllListArchived()
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
window.historiqueController = new HistoriqueController()