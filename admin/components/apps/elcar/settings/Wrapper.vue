<template>
    <div>
        <div class="pa-3 pa-md-7">
            Settings
        </div>
    </div>
</template>

<script>
export default {
    name: "ElcarSettingsWrapper",
    props: {
        component: Object,
        data: Array
    },

    data: (app)=> ({
        sections: [
            {
                name: app.$t(''),
                key: 'main'
            }
        ]
    })
}
</script>
