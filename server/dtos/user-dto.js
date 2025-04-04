module.exports = class UserDto {
    phone
    id
    notifications
    tgId

    constructor(model) {
        this.phone = model.phone
        this.id = model.id
        this.notifications = model.notifications
        this.tgId = model.tgId
    }
}