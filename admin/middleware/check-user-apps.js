import { Ability } from '@casl/ability'
import abilityRules from '../plugins/ability-rules'

export default ({app, route, error: nuxtError}) => {
    const { module, section, action } = route.meta[0]

    // İcazələr layout-un created()-ində qurulur, bu middleware isə ondan ƏVVƏL
    // işləyir. Səhifə birbaşa linklə və ya F5 ilə açılanda qlobal $ability hələ
    // boş olur və 404 çıxırdı. Ona görə qaydalar istifadəçidən burada qurulur —
    // hər sorğu üçün ayrıca obyektdə (serverdə qlobal obyekt istifadəçilər
    // arasında paylaşılır, ona toxunulmur).
    const ability = new Ability(abilityRules(app.$auth?.user))

    const isGeneral = module === 'general'
    const hasModuleAccess = ability.can('read', module)
    const hasSectionAccess = ability.can(action, `${module}-${section}`)

    if(hasModuleAccess && !section || hasModuleAccess && hasSectionAccess || isGeneral){
        //
    }else{
        nuxtError({
            statusCode: 404,
            message: "Page Not Found",
        });
        return Promise.resolve(false);
    }
}
