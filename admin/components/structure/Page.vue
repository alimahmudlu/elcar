<template>
    <v-main class="main-page" v-if="activePage && activePage.body">

        <PageHeader v-if="activePage.body.header && activePage.body.header.options.display" :header="activePage.body.header"/>

        <div v-bind="activePage.body.wrapper.options" class="d-flex flex-column" style="min-height: calc(100vh - 60px)">

            <template v-for="(component, i) in activePage.body.wrapper.components">
                <DynamicComponent :component="component" :data="activePage.content" :key="`component-${i}`"/>
            </template>

        </div>

    </v-main>
</template>

<script>

import {structureMixins} from "@/mixins/structure";

export default {
    name: "Page",
    mixins: [structureMixins]
}
</script>
