<template>
    <v-card flat dark tile :color="!$dark() && (color || activePage && activePage.menu.color) || ''"
            class="page-lead relative overflow-hidden py-6 py-md-16">
        <v-container class="relative z-index-2 py-md-10">
            <v-row align="center">

                <v-col class="d-flex mb-3 mb-md-0">

                    <Icon v-if="icon || activePage && activePage.menu.icon"
                          :name="icon || activePage.menu.icon" size="70" class="mr-3 mr-md-5"/>

                    <div class="pt-1">

                        <h1 class="font-weight-black text-h4 text-md-h2"
                            v-text="title || activePage && activePage.name"/>

                        <p class="mb-0 mt-3 mt-md-6 font-weight-light text-body-2 lh-1-6"
                           v-if="description || activePage && activePage.description"
                           v-text="description || activePage.description"/>

                    </div>

                </v-col>

                <v-col cols="12" sm="4" md="3" class="d-flex justify-sm-center" v-if="$slots.actions">
                    <slot name="actions"/>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: "Lead",

    props:{
        pageId: String,
        title: String,
        description: String,
        color: String,
        icon: String,
    },

    computed:{
        activePage(){
            if(this.pageId){
                return this.$navMenuById(this.pageId)
            }
        }
    }
}
</script>

<style lang="scss">
.page-lead{
    &::before, &::after{
        content: '';
        width: 600px;
        height: 600px;
        border-radius: 50%;
        opacity: .1;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    &::before{
        border: 50px solid #fff;
        left: -150px;
    }

    &::after{
        background-color: #000;
        right: -100px;
    }
}
</style>
