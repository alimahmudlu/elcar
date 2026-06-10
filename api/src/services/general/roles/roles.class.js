const {Service} = require('feathers-mongoose');
const slugify = require('slugify');

exports.Roles = class Roles extends Service {

    setup(app) {
        this.roleServiceModel = app.service('roles').Model;
    }

    async create(data, params) {
        return await this.roleServiceModel.create({
            name: data.name,
            key: slugify(data.name, {replacement: '_', lower: true}),
            initialMethods: data.initialMethods,
        });
    }
};
