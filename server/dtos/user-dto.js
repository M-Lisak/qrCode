module.exports = class UserDto {
    phone
    id

    constructor(model) {
        this.phone = model.phone
        this.id = model.id
    }
}