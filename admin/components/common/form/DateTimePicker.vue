<template>
    <v-row dense>

        <v-col>
            <v-menu v-model="datePickerMenu" :close-on-content-click="false" max-width="290px"
                    min-width="auto" offset-y transition="scale-transition">

                <template #activator="{ on, attrs }">
                    <v-text-field v-bind="{...attrs, ...$attrs}" v-on="on"
                                  :value="date ? $dayjs.utc(date).format(format) : ''" :hide-details="hideDetails"
                                  :append-icon="!readonly ? mdiChevronDown : null" :prepend-inner-icon="mdiCalendar"
                                  :outlined="outlined" readonly dense clearable :clear-icon="mdiClose"
                                  :placeholder="format" :error-messages="errorMessages" @click:clear="clearDate"/>
                </template>

                <v-date-picker v-model="date" :readonly="readonly" no-title v-bind="$attrs"
                               :prev-icon="mdiChevronLeft" :next-icon="mdiChevronRight"
                               @input="setCurrentDateTime"/>

            </v-menu>
        </v-col>

        <v-col cols="5" v-if="!hideTime">
            <v-menu ref="timeMenu" v-model="timePickerMenu" :return-value.sync="time" :close-on-content-click="false"
                    transition="scale-transition" offset-y max-width="290px" min-width="290px" :disabled="!date">

                <template #activator="{ on, attrs }">
                    <v-text-field :value="time" readonly dense v-bind="{...attrs, ...$attrs}" v-on="on"
                                  clearable :clear-icon="mdiClose" placeholder="00:00"
                                  :outlined="outlined" :hide-details="hideDetails"
                                  :append-icon="!readonly ? mdiChevronDown : null" @click:clear="clearTime"/>
                </template>

                <v-time-picker v-if="timePickerMenu" v-model="time" format="24hr" full-width no-title color="secondary"
                               :allowed-seconds="false" @input="setCurrentDateTime" @click:minute="$refs.timeMenu.save(time)"/>

            </v-menu>
        </v-col>

    </v-row>
</template>

<script>

import {mdiClose, mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiCalendar} from '@mdi/js';

export default {
    name: 'DateTimePicker',

    props: {
        currentDateTime: String,
        format: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        now: Boolean,
        readonly: Boolean,
        hideTime: {
            type: Boolean,
            default: false
        },
        hideDetails: {
            type: Boolean,
            default: false
        },
        outlined: {
            type: Boolean,
            default: true
        },
        errorMessages: Array,
    },

    data: () => ({

        mdiClose,
        mdiChevronDown,
        mdiChevronLeft,
        mdiChevronRight,
        mdiCalendar,

        datePickerMenu: false,
        timePickerMenu: false,
        date: null,
        time: "00:00"
    }),

    model: {
        prop: 'currentDateTime',
        event: 'currentDateTime',
    },

    created() {
        this.setDateTime(this.currentDateTime);
    },

    watch: {
        currentDateTime(value){
            this.setDateTime(value);
        },
    },

    methods: {

        clearDate(){
            this.date = null
            this.clearTime()
        },

        clearTime(){
            this.time = null
            this.setCurrentDateTime()
        },

        setDateTime(dateTime) {
            this.date = dateTime ? this.$dayjs.utc(dateTime).format('YYYY-MM-DD') : null;
            this.time = dateTime ? this.$dayjs.utc(dateTime).format('HH:mm') : null;
        },

        setCurrentDateTime() {

            let dateTime

            if(this.date){
                dateTime = `${this.date}T${this.time || '00:00'}`
            }

            this.$emit('currentDateTime', dateTime);
            this.$emit('input', dateTime);
            this.datePickerMenu = false
        },
    }
};
</script>
