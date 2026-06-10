<template>
    <div class="editor-wrap d-flex align-start">

        <v-icon v-text="prependIcon" v-if="prependIcon" class="mt-2 mr-2"/>

        <div class="fill-width overflow-x-auto">

            <small v-text="label" class="text-caption d-block px-3"
                   :class="errorMessages && errorMessages.length > 0 ? 'error--text' : 'grey--text'"/>

            <v-card outlined class="px-3 py-2" v-if="inline">
                <editor :apiKey="apiKey" :init="inlineConfig" v-model="model.data" :disabled="disabled"/>
            </v-card>

            <editor v-else :apiKey="apiKey" :init="fullConfig" v-model="model.data" :disabled="disabled"
                    :class="{'error--text': errorMessages && errorMessages.length > 0}"/>

            <div class="pl-3 mt-1 mb-2 overflow-hidden" style="height: 14px">
                <v-slide-y-transition>
                    <small v-for="(error, i) in errorMessages" :key="i" class="caption error--text d-block lh-1" v-text="error"/>
                </v-slide-y-transition>
            </div>

        </div>

    </div>
</template>

<script>

import Editor from '@tinymce/tinymce-vue'

export default {
    name: "TinymceEditor",

    props:{
        data: String,
        label: String,
        locale: String,
        prependIcon: String,
        height: {
            type: [String, Number],
            default: 500
        },
        inline: {
            type: Boolean,
            default: false
        },
        disabled: Boolean,
        errorMessages: Array,
    },

    components: {
        editor: Editor
    },

    model: {
        prop: 'data',
        event: 'model',
    },

    data() {
        return {
            language: '',
            model: {
                data: this.data,
            },
            apiKey: 'uhvytuodhznd9gedhu1uqlvlp18u0rfef9187kbuijflhsny',

            fullPlugins: [
                'advlist autolink lists link autolink image imagetools charmap toc',
                'searchreplace visualblocks table fullscreen',
                'print preview anchor insertdatetime media emoticons',
                'paste code wordcount searchreplace'
            ],

            inlinePlugins: ['code link autolink emoticons wordcount paste']
        }
    },

    computed:{

        commonConfig(){
            return {
                height: this.height,
                spellchecker_language: this.locale || this.$i18n.locale,
                skin: `oxide${ this.$vuetify.theme.dark ? '-dark' : '' }`,
                content_css: `${ this.$vuetify.theme.dark ? 'dark' : '' }`,
                body_class: 'text-body-2',
                content_style: 'body {background: transparent !important} ' +
                    'table {width: 100%} ' +
                    '* { line-height: 1.8em; letter-spacing: 0.5px; font-family: "Roboto", sans-serif !important; }' +
                    'li {margin-bottom: .5rem;}' +
                    '.v-responsive {position: relative}' +
                    '.v-responsive__content {position: absolute; width: 100%; height: 100%; top: 0; left: 0;}' +
                    '.v-responsive__content * {width: 100%; height: 100%; border: 0; object-fit: cover}',

                setup: function (editor) {

                    editor.ui.registry.addContextToolbar('textselection', {
                        predicate: function (node) {
                            return !editor.selection.isCollapsed();
                        },
                        items: 'bold italic underline strikethrough subscript superscript | alignleft aligncenter alignright | link',
                        position: 'selection',
                        scope: 'node'
                    });

                    editor.on('BeforeSetContent', function (e) {

                        if (e.content.startsWith('<table')) {
                            const table = "" + e.content
                            e.content = '<div class="v-data-table border"><div class="v-data-table__wrapper">' + table + '</div></div>'
                        }

                        if (e.content.startsWith('<iframe')) {
                            const iframe = "" + e.content
                            e.content = '<div class="v-responsive"><div class="v-responsive__sizer" style="padding-bottom: 56.25%;"></div><div class="v-responsive__content">' + iframe + '</div></div>'
                        }

                    });
                },
            }
        },

        inlineConfig(){
            return {
                ...this.commonConfig,
                inline: true,
                plugins: this.inlinePlugins,
                toolbar: 'undo redo | bold italic underline',
            }
        },

        fullConfig(){
            return {

                ...this.commonConfig,

                plugins: this.fullPlugins,

                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                file_picker_callback: (selectCallback, value, meta) => {
                    // images_file_types: 'jpg,svg,webp'
                    this.$openDialog({
                        component: 'common/media/Explorer',
                        data: {
                            selectCallback,
                            files: value,
                            getUrl: true,
                            multiple: false,
                        },
                        options:{
                            fullSize: true
                        }
                    })
                },

                toolbar: 'undo redo | formatselect | bullist numlist outdent indent blockquote | media image emoticons',
                table_class: 'width: 100%',
                table_default_styles: {},
                table_sizing_mode: 'responsive',
                table_column_resizing: 'resizetable',
                table_resize_bars: false,
                table_style_by_css: true,
                table_default_attributes: {
                    class: ''
                },
                table_class_list: [
                    { title: 'Standard', value: '' },
                ],
            }
        }
    },

    watch: {
        data(val) {
            this.model.data = val
        },
        'model.data'(val) {
            this.$emit('model', val)
        }
    },
}
</script>

<style lang="scss">

.error--border {
    border: 2px solid var(--v-error-base) !important;
}

.editor-wrap {

    .v-data-table{
        table{
            width: 100% !important;
        }
    }

    .caption {
        line-height: 12px;
    }

    .error--text {

        + .tox-tinymce {
            border-color: var(--v-error-base) !important;
            border-width: 2px !important;
        }
    }
}

.tox {
    .tox-edit-area{
        &__iframe{
            background: none !important;
        }
    }
    .tox{
        &-menubar, &-toolbar-overlord, &-toolbar__primary, &-statusbar{
            background: none !important;
            border-color: var(--border-color) !important;
        }

        &-toolbar-overlord{
            border-bottom: 1px solid;
        }

        &-toolbar__group{
            border-color: var(--border-color) !important;
        }
    }
}

.tox-tinymce {
    border-radius: 4px !important;
    border-color: var(--border-color) !important;

    &-aux{
        z-index: 200 !important;
    }

    .tox-editor-container {
        border-width: 2px !important;
    }

    .tox-statusbar__branding {
        display: none;
    }
}
</style>
