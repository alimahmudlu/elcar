import { name, baseUrl, meta, theme, creator } from '../structure/app'

const defaultState = {
    app:{
        name,
        baseUrl,
        meta,
        logo: theme.logo,
        creator
    }
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

    OPEN_DIALOG(state, params){

        if(typeof state.dialogs === 'undefined'){
            params.vm.$set(state,  'dialogs', [])
        }

        state.dialogs.push({
            component: params.component,
            data: params.data || null,
            options: params.options || {},
            callback: params.callback
        })
    },

    CLOSE_DIALOG(state, index){
        state.dialogs.splice(index, 1)
    },

    RESET_STATE(state){
        Object.assign(state, structuredClone(defaultState))
    }

}

export const actions = {
    async GET_DATA({commit}, params) {
        try {

            const queryBlackList = ['assets-folder']

            Object.entries(params.query).forEach(([key, _]) => queryBlackList.includes(key) && delete params.query[key])

            const {data} = await this.$axios.get(params.api, {params: params.query})

            if(!params.returnData){
                const SET_STATE = `${params.store === 'index' ? '' : params.store + '/'}SET_STATE`
                commit(SET_STATE, {...params, data})
            }

            return data

        } catch (error) {
            params.vm.$responseError(error)
        }
    }
};
