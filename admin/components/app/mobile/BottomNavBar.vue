<template>
    <v-bottom-navigation fixed app :color="$dark() ? 'lighten' : ''" :height="60">

        <div class="d-flex align-center fill-width fill-height px-2">

            <AppSideBarNavMenu :position="['top']" :group="['general', 'apps']"
                               :mobile="true" class="py-2 flex-fill">

            </AppSideBarNavMenu>

            <AppSideBarNavMenu :position="['bottom']" :group="['general']"
                               :mobile="true" class="py-2 flex-fill">

                <template #end>
                    <AppSideBarLanguage :mobile="true"/>

                    <AppSideBarUserMenu :mobile="true"/>
                </template>

            </AppSideBarNavMenu>

        </div>

    </v-bottom-navigation>
</template>

<script>
export default {
    name: "BottomNavBar"
}
</script>
