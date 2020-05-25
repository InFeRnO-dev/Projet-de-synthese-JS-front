class BaseController {
    constructor(verify) {
        if (verify) { this.verifyAuthentication() }
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
        this.modelItem = new ModelItem()
        this.modelHistorique = new ModelHistorique()
    }
    verifyAuthentication() {
        if (sessionStorage.getItem("token") === null) {
            navigate("login")
        }
    }
    validateRequiredField(selector, name) {
        const value =  $(selector).value
        if ((value == null) || (value === "")) {
            this.toast(`Le champ '${name}' est obligatoire`)
            $(selector).style.borderColor = 'red'
            return null
        }
        return value
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayUnauthorized() {
        this.toast('Temps de connexion expiré, veuillez vous reconnecter')
    }
    displayNotFoundError() {
        this.toast('Objet introuvable')
    }
    displayServiceError() {
        this.toast('Service injoignable ou problème réseau')
    }
    displayUndoMsgList() {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="indexController.undo()"><i class="material-icons right">redo</i>Annuler</button>`)
    }
    displayUndoMsgItem() {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="itemsController.undo()"><i class="material-icons right">redo</i>Annuler</button>`)
    }
    displayUndoMsgHistorique() {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="historiqueController.undo()"><i class="material-icons right">redo</i>Annuler</button>`)
    }
    displayundo() {
        this.toast("L'opération a été annulée")
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
