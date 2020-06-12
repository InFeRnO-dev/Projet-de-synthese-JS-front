class PartageController extends BaseController {
    constructor() {
        super(true)
        this.tableAllPartage = $('#tableAllPartage')
        this.tableBodyAllPartage = $('#tableBodyAllPartage')
        this.tableBodyViewAllItemPartage = $('#tableBodyViewAllItemPartage')
        this.tableBodyViewAllPartage = $('#tableBodyViewAllPartage')
        this.displayAllListPartage()
    }

    async displayAllListPartage() {        //afficher toutes les listes
        let content = ''
        this.tableAllPartage.style.display = "none"
        let MyId
        try {

            for (const list of await this.model.getAllList()) {
                MyId = list.fk_id_user
                break
            }

            for (const user of await this.modelPartage.getAllPartageByIdUser(MyId)) {
                let list = await this.modelPartage.getListById(user.id_list)
                if (list === undefined) {
                    this.displayServiceError()
                    return
                }
                if (list === null) {
                    this.displayNotFoundError()
                    return
                }
                const date = list.date.toLocaleDateString()
                content += `<tr><td><p style="color: blueviolet; font-family: 'Arial Black'" onclick="partageController.afficherpartagelist(${list.id_list}, ${user.droits})"> ${list.shop}</p></td>
                    <td><p style="font-family: 'Arial Black'">${date}</p></td>`
                if(user.droits === 2) {
                    content += `<td><button class="btn" onclick="partageController.displayEditListPartage(${list.id_list})"><i class="material-icons">edit</i></button>`
                }
                content += `</td></tr>`
            }
            this.tableBodyAllPartage.innerHTML = content
            this.tableAllPartage.style.display = "block"
            await loginController.timeout()
        } catch (err) {
            if (err === 401) {
                navigate('login')
                console.log(err)
                this.displayUnauthorized()
            } else {
                console.log(err)
                this.displayServiceError()
            }
        }
    }
    async displayPartagerList(idlist,idproprio) {
        console.log("fct display")
        try {
            this.myid = idproprio
            this.idlist = idlist
            indexController.openModal('#modalAddPartage')
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
    async partagerlist() {
        const idlist = this.idlist
        let login = this.validateRequiredField("#inputlogin", "Login")
        let droits = $("#selectdroits").value
        let id_partage_user = await this.modelPartage.getUserByLogin(login)
        const id_proprio = this.myid
        console.log(id_proprio)
        try {
            if (await this.modelPartage.insert(new Partage(id_proprio,id_partage_user,idlist,droits)) === 200) {
                indexController.closeModal('#modalAddPartage')
                this.toast("Le partage a été effectué")
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
    async afficherpartagelist(idlist, droits) {
        if (droits === 1) {
            let content = ''
            try {
                const items = await this.modelItem.getAllItem(idlist)
                for (const item of items) {
                    content += `<tr><td><p style="font-family: 'Arial Black'">${item.label}</p></td>
                    <td><p style="font-family: 'Arial Black'">${item.quantity}</p></td>`
                    if (item.checked === true) {
                        content += `<td><p><label><input id="cbItem" type="checkbox" disabled="disabled" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})" checked /><span></span></label></p></td>`
                    } else {
                        content += `<td><p><label><input id="cbItem" type="checkbox" disabled="disabled" onchange="itemsController.IsChecked(${item.contains}, ${item.id_item})"/><span></span></label></p></td>`
                    }
                    content += `</tr>`
                }
                this.tableBodyViewAllItemPartage.innerHTML = content
                indexController.openModal('#modalViewListPartage')
            } catch (err) {
                if (err === 401) {
                    navigate('login')
                    console.log(err)
                    this.displayUnauthorized()
                } else {
                    console.log(err)
                    this.displayServiceError()
                }
            }
        }
        if (droits === 2) {
            indexController.goToItem(idlist)
        }
    }
    async displayEditListPartage(id) {
        try {
            const list = await this.modelPartage.getListById(id)
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
            $("#inputshoppartage").value = list.shop
            $('#inputdatepartage').valueAsDate = date
            this.List = list
            indexController.openModal('#modalEditListPartage')
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
    async editListPartage() {
        const list = this.List
        let inputshoppartage = this.validateRequiredField("#inputshoppartage", 'Magasin')
        let inputdatepartage =  this.validateRequiredField("#inputdatepartage", 'Date')
        //let archived = true
        if ((inputshoppartage != null) && (inputdatepartage != null)) {
            const date = new Date(inputdatepartage)
            try {
                list.shop = inputshoppartage
                list.date = date
                //list.archived = archived
                if (await this.modelPartage.updateList(list) === 200) {
                    indexController.closeModal('#modalEditListPartage')
                    this.toast("La Liste a été modifiée")
                    this.displayAllListPartage()
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
    async displayAllPartageByList(idlist) {
        let content = ''
        const partages = await this.modelPartage.getAllPartageByIdList(idlist)
        try {
            for (const partage of partages) {
                const login = await this.modelPartage.getLoginById(partage.id_partage_user)
                content += `<tr><td><p style="font-family: 'Arial Black'">${login.login}</p></td>`
                if(partage.droits === 1)
                {
                    content += `<td><p style="font-family: 'Arial Black'">Visualisation</p></td>`
                }
                if(partage.droits === 2)
                {
                    content += `<td><p style="font-family: 'Arial Black'">Visualisation et modification</p></td>`
                }
                content += `<td><button class="btn" onclick="partageController.displayEditPartage(${partage.id_partage})"><i class="material-icons">edit</i></button></td>
                            <td><button class="btn" onclick="partageController.displayDeletePartage(${partage.id_partage})"><i class="material-icons">delete</i></button></td></tr>`
            }
            this.tableBodyViewAllPartage.innerHTML = content
            indexController.openModal('#modalViewPartage')
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
    async displayEditPartage(idpartage) {
        try {
            this.idpartage = idpartage
            indexController.openModal('#modalEditPartage')
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
    async editPartage() {
        try {
            const partage = await this.modelPartage.getPartageById(this.idpartage)
            let droits = $("#selectdroitsedit").value
            partage.droits = droits
            if(await this.modelPartage.update(partage) === 200) {
                this.toast('Partage modifié')
                navigate('index')
            }
            else {
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
    async displayDeletePartage(idpartage) {
        try {
            this.idpartage = idpartage
            indexController.openModal('#modalDeletePartage')
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
    async deletePartage() {
        try {
            if (await this.modelPartage.delete(this.idpartage) === 200) {
                this.toast('Partage supprimé')
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
}
window.partageController = new PartageController()