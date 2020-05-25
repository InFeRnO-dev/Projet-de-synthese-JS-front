const serviceBaseUrlUser = "http://localhost:3333/useraccount"
class UseraccountAPI extends ServiceUserAccount{
    constructor() {
        super()
    }
    authenticate(login, password) {                 //fonction de génération d'un token jwt
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${serviceBaseUrlUser}/authenticate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    timeout() {                 //fonction de rafraichissement du token jwt
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${serviceBaseUrlUser}/timeout`, {
            method: "POST",
            headers: this.headers,
            body: `token=${sessionStorage.getItem("token")}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }
}