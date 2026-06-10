<template>
    <v-menu left :disabled="!filteredActions.length">

        <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" :disabled="!filteredActions.length">
                <Icon name="mdiDotsVertical"/>
            </v-btn>
        </template>

        <v-card>
            <v-list dense>

                <template v-for="(action, i) in filteredActions">
                    <v-list-item class="min-h-auto" :key="`action-${i}`"
                                 :to="action.to && action.to(item)"
                                 @click="action.onClick && action.onClick(item)">

                        <v-list-item-icon class="h-auto mr-1">
                            <Icon :name="action.icon" small/>
                        </v-list-item-icon>

                        <v-list-item-title class="text-caption" v-text="action.name"/>

                    </v-list-item>
                </template>

                <slot/>

            </v-list>
        </v-card>

    </v-menu>
</template>

<script>
export default {
    name: "DataActionsMenu",
    props:{
        actions: Array,
        item: Object
    },

    computed:{
        filteredActions(){
            return this.actions.filter(action => this.getCondition(action.condition) || typeof action.condition === 'undefined')
        },
    },

    methods:{
        getCondition(condition){
            return typeof condition === "function" ? condition(this.item) : condition
        }
    }
}
</script>
