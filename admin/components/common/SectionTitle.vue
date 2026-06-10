<template>
    <div class="section-title-wrap px-md-0" :class="[`text-${align}`, bottomGutter]">

        <component v-if="title" :is="tag" v-html="title" class="mb-0"
                   :class="[size, color ? `${color}--text` : '', `font-weight-${weight}`]"/>

        <p v-if="description" v-html="description" class="mb-0 text-body-2 lh-1-6 grey--text" :class="{'mt-2' : title}"/>

    </div>
</template>

<script>
export default {
    name: "SectionTitle",
    props: {
        title: {
            type: String,
        },
        tag: {
            type: String,
            default: 'h2'
        },
        size: {
            type: String,
            default: 'text-h5 text-md-h3'
        },
        color: {
            type: String,
        },
        weight: {
            type: String,
            default: 'black'
        },
        description: {
            type: String,
        },
        align: {
            type: String,
            default: 'left',
        },
        bottomGutter: {
            type: String,
            default: 'mb-4 mb-md-6',
        }
    }
}
</script>
