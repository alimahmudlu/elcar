/*====================================================================================================================*/
/* General Services */
/*====================================================================================================================*/

const auth = require('./general/users/users.service.js');
const roles = require('./general/roles/roles.service.js');
const userAccess = require('./general/user-access/user-access.service.js');
const workspaces = require('./general/workspaces/workspaces.service.js');
const appModules = require('./general/app-modules/app-modules.service.js');
const userModules = require('./general/user-modules/user-modules.service.js');
const modulePermissions = require('./general/module-permissions/module-permissions.service.js');
const userInvitations = require('./general/user-invitations/user-invitations.service.js');
const teams = require('./general/teams/teams.service.js');
const otp = require('./general/otp/otp.service.js');
const fileFolders = require('./general/file-folders/file-folders.service.js');
const uploads = require('./general/uploads/uploads.service.js');
const prices = require('./general/prices/prices.service.js');
const currencies = require('./general/currencies/currencies.service.js');
const pricePlans = require('./general/price-plans/price-plans.service.js');
const packages = require('./general/packages/packages.service.js');

/*====================================================================================================================*/
/* Module Services */
/*====================================================================================================================*/

const products = require('./elcar/products/products.service.js');
const characteristicGroups = require('./elcar/characteristic-groups/characteristic-groups.service.js');
const characteristics = require('./elcar/characteristics/characteristics.service.js');
const characteristicOptions = require('./elcar/characteristic-options/characteristic-options.service.js');
const brands = require('./elcar/brands/brands.service.js');
const models = require('./elcar/models/models.service.js');
const categories = require('./elcar/categories/categories.service.js');
const blog = require('./elcar/blog/blog.service.js');
const orders = require('./elcar/orders/orders.service.js');
const messages = require('./elcar/messages/messages.service.js');

const bankTransactions = require('./elcar/bank-transactions/bank-transactions.service.js');

/*====================================================================================================================*/
/* Export Services */
/*====================================================================================================================*/

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    app.configure(auth);
    app.configure(roles);
    app.configure(userAccess);
    app.configure(workspaces);
    app.configure(appModules);
    app.configure(userModules);
    app.configure(modulePermissions);
    app.configure(userInvitations);
    app.configure(teams);
    app.configure(otp);
    app.configure(fileFolders);
    app.configure(uploads);
    app.configure(prices);
    app.configure(currencies);
    app.configure(pricePlans);
    app.configure(packages);

    app.configure(products);
    app.configure(characteristicGroups);
    app.configure(characteristics);
    app.configure(characteristicOptions);
    app.configure(brands);
    app.configure(models);
    app.configure(categories);
    app.configure(blog);
    app.configure(orders);
    app.configure(messages);
    app.configure(bankTransactions);
};
