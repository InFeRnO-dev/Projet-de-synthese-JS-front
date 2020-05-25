class ServiceUserAccount {
    constructor() {
        this.headers = new Headers()
        this.token = sessionStorage.getItem("token")
        if (this.token !== undefined) {
            this.headers.append("Authorization", `Bearer ${this.token}`)
        }
    }
}