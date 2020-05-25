class IndexController extends BaseController {
    constructor() {
        super(true)
        this.tableAllList = $('#tableAllList')
        this.tableBodyAllList = $('#tableBodyAllList')
        this.displayAllList()
    }
    openModal (modal) {             //fonction d'ouverture d'un modal
        this.getModal(modal).open()
    }
    closeModal (modal) {            //fonction de fermeture d'un modal
        this.getModal(modal).close()
    }
    getIdList() {               //getter idlist
        return this.id_list
    }
    goToItem (id_list) {            //affichage de la view item en fonction de l'id de la liste
        this.id_list = id_list
        navigate('items')
    }
    async displayAllList() {        //afficher toutes les listes
        let content = ''
        this.tableAllList.style.display = "none"
        try {
            const lists = await this.model.getAllListCurrent()
            for (const list of lists) {
                const date = list.date.toLocaleDateString()
                content += `<tr><td><p style="color: blueviolet; font-family: 'Arial Black'" onclick="indexController.goToItem(${list.id_list})"> ${list.shop}</p></td>
                    <td><p style="font-family: 'Arial Black'">${date}</p></td>
                    <td><p><label><input id="cbItem" type="checkbox" onchange="indexController.displayArchivedList(${list.id_list})"/><span></span></label></p></td>
                    <td><button class="btn" onclick="indexController.displayEditList(${list.id_list})"><i class="material-icons">edit</i></button>
                    <button class="btn" onclick="indexController.displayDeleteList(${list.id_list})"><i class="material-icons">delete</i></button></td></tr>`
            }
            this.tableBodyAllList.innerHTML = content
            this.tableAllList.style.display = "block"
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
    async displayArchivedList(idlist) {             //Fonction d'affichage du modal onchange checkbox archived
        try {
            const list = await this.model.getListById(idlist)
            if (list === undefined) {
                this.displayServiceError()
                return
            }
            if (list === null) {
                this.displayNotFoundError()
                return
            }
            console.log(list)
            this.list = list
            this.openModal('#modalArchivedList')
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
    async archivedList() {              //fonction d'archivage d'une liste
        console.log(this.list)
        const list = this.list
        list.archived = true
        await this.model.update(list)
        this.toast("Votre liste a été archivée")
        this.displayAllList()
    }
    async addList() {               //fonction d'ajout d'une liste
        let inputaddshop = this.validateRequiredField("#inputaddshop", 'Shop')
        let inputadddate = this.validateRequiredField("#inputadddate", 'Date')
        let archived = false
        if (inputaddshop === null || inputadddate === null) return
        const date = new Date(inputadddate)
        try {
            if (await this.model.insert(new List(inputaddshop,date,archived)) === 200) {
                this.closeModal('#modalAddList')
                this.toast("L'ajout a été effectué")
                $("#inputaddshop").value = ""
                $("#inputadddate").value = ""
                navigate('index')
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
    }
    async displayEditList(id) {                 //Fonction d'affichage du modal onclick btn edit
        try {
            const list = await this.model.getListById(id)
            if (list === undefined) {
                this.displayServiceError()
                return
            }
            if (list === null) {
                this.displayNotFoundError()
                return
            }
            let date = new Date(list.date)
            date.setDate(date.getDate()+1)
            $("#inputshop").value = list.shop
            $('#inputdate').valueAsDate = date
            this.List = list
            this.openModal('#modalEditList')
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
    async editList() {          //Fonction d'edition et d'update de la liste dans la table
        const list = this.List
        let inputshop = this.validateRequiredField("#inputshop", 'Magasin')
        let inputdate =  this.validateRequiredField("#inputdate", 'Date')
        //let archived = true
        if ((inputshop != null) && (inputdate != null)) {
            const date = new Date(inputdate)
            try {
                    list.shop = inputshop
                    list.date = date
                    //list.archived = archived
                    if (await this.model.update(list) === 200) {
                        this.closeModal('#modalEditList')
                        this.toast("La Liste a été modifiée")
                        this.displayAllList()
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
        }
    }
    async displayDeleteList(id) {     //Fonction d'affichage du modal onclick btn delete
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
            this.openModal('#modalDeleteList')
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
    async deleteList() {                //fonction de suppression d'une liste
        const list = this.list
        const items = await itemsController.modelItem.getAllItem(list.id_list)
        this.idmax = await this.model.getMaxId()
        try {
            if (await this.model.delete(list.id_list) === 200) {
                this.itemsdeleted = items
                this.deletedlist = list
                console.log(this.deletedlist)
                this.displayUndoMsgList()
                this.displayAllList()
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
    }
    async undo() {                  //fonction d'annulation de suppression d'une liste
        try {
            const id = this.idmax.max + 1
            this.deletedlist = await this.model.insert(this.deletedlist)
            if(this.deletedlist === 200) {
                for (const item of this.itemsdeleted) {
                    item.contains = id
                    await itemsController.modelItem.insert(item)
                }
                this.itemsdeleted = null
                this.deletedlist = null
                this.displayundo()
                this.displayAllList()
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

window.indexController = new IndexController()
