const defaultState = {
    productSections: [
        {
            name: 'Vehicles',
            key: 'vehicles',
        },
        {
            name: 'Charging stations',
            key: 'charging-stations',
        },
        {
            name: 'Accessories',
            key: 'accessories',
        },
        {
            name: 'Solar Energy',
            key: 'solar-energy',
        },
        {
            name: 'Wind Energy',
            key: 'wind-energy',
        },
        {
            name: 'Energy Storage (BESS)',
            key: 'energy-storage',
        },
        {
            name: 'Inverters',
            key: 'inverters',
        },
        {
            name: 'Laser Equipment',
            key: 'laser-equipment',
        }
    ],
}
export const state = () => (structuredClone(defaultState))

export const mutations = {

    SET_STATE(state, params) {
        if(params.push){

            const data = params.data.data || params.data

            if(Array.isArray(data)){
                data.forEach(item => (state[params.key].data || state[params.key]).push(item))
            }else{
                state[params.key].push(data)
            }

            if(params.data.meta){
                state[params.key].meta = params.data.meta
            }

        }else{
            params.vm.$set(state, params.key, params.data)
        }
    },

    RESET_STATE(state){
        Object.keys(state).forEach(key => delete state[key])
        Object.assign(state, structuredClone(defaultState))
    }
}
