<template>
    <v-card flat dark tile color="primary" class="main-lead relative overflow-hidden py-6 px-3 px-md-6 py-md-16 flex-fill">
        <v-container>

            <v-row align="center">

                <v-col cols="12" sm="7">

                    <span class="font-weight-black" v-text="$t('Welcome to')"/>

                    <h1 class="font-weight-black text-h2 text-md-h1 ml-n1"
                        v-text="workspace ? workspace.name : $t('Root panel')"/>

                    <p class="my-6 font-weight-light text-body-2 lh-1-6">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae eveniet ipsum modi nulla?
                        A accusantium assumenda eaque facilis fugiat, ipsum magnam, modi necessitatibus odio, possimus
                        quae quas quos repellendus voluptatibus!
                    </p>

                </v-col>

                <v-col cols="12" sm="5" order-md="1">
                    <v-img :src="require('static/design/figure.png')" contain :aspect-ratio="16/9"
                           class="relative z-index-2"/>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: "MainLeadWrapper",
    computed: {
        workspace() {
            return this.$auth.user.currentAccess.workspace
        }
    }
}
</script>

<style lang="scss">
.main-lead {

    &::before {
        content: '';
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 70px solid #fff;
        opacity: .1;
        position: absolute;
        left: -200px;
        bottom: -200px;
    }

    &::after {
        content: '';
        width: 900px;
        height: 900px;
        border-radius: 50%;
        background-color: #000;
        opacity: .1;
        position: absolute;
        top: 20%;
        transform: translateY(-50%);
        right: -250px;
    }
}
</style>
