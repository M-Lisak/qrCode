module.exports = class UserDto {
    phone
    id
    notifications

    constructor(model) {
        this.phone = model.phone
        this.id = model.id
        this.notifications = model.notifications
    }
}