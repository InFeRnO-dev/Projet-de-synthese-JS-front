class LoginController extends BaseController {
    constructor() {
        super(false)
        this.serviceuseraccount = new UseraccountAPI()
    }
    async authenticate() {      //génération d'un token jwt
        let login = this.validateRequiredField('#inputlogin', 'Login')
        let password = this.validateRequiredField('#inputpassword', 'Mot de passe')
        if ((login != null) && (password != null)) {
            this.serviceuseraccount.authenticate(login, password)
                .then(res => {
                    sessionStorage.setItem("token", res.token)
                    window.location.replace("index.html")
                })
                .catch(e => {
                    console.log(e)
                    if (e === 401) {
                        this.toast("Login ou mot de passe incorrect")
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }
    async timeout() {       //renouvellement d'un token jwt
        this.serviceuseraccount.timeout()
            .then(res => {
                sessionStorage.setItem("token", res.token)
            })
            .catch(e => {
                console.log(e)
                if (e === 401) {
                    this.displayUnauthorized()
                    navigate('login')
                } else {
                    this.displayServiceError()
                }
            })
    }
}
window.loginController = new LoginController()