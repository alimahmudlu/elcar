/**
 * İstifadəçinin CASL qaydaları. $setAbility və check-user-apps middleware
 * eyni qaydaları istifadə edir (nuxt.config-də plugin kimi qeydiyyatda deyil).
 */
export default function abilityRules(user) {

    const rules = [];

    if (!user?.currentAccess) return rules;

    switch (user.currentAccess.role?.key) {
        case 'root':
            rules.push({ action: 'manage', subject: 'all' });
            break;

        case 'owner':
            rules.push({
                action: 'manage',
                subject: 'all',
                field: { workspace: user.currentAccess.workspace?._id }
            });
            break;
    }

    (user.currentAccess.permissions || []).forEach(permission => {
        const moduleKey = permission.module.key;

        rules.push({ action: 'read', subject: moduleKey });

        permission.sections.forEach(section => {
            section.actions.forEach(action => {
                if (action.default) {
                    rules.push({
                        action: action.key,
                        subject: `${ moduleKey }-${ section.key }`
                    });
                }
            });
        });
    });

    return rules;
}
