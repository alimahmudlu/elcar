<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">
                <Icon name="mdiEmailOutline" left/>
                {{ $t('Detail') }}
            </v-card-title>

            <v-btn icon @click="$emit('close')">
                <Icon name="mdiClose"/>
            </v-btn>

        </div>

        <div class="flex-fill pa-3 pa-md-6 overflow-auto">
            <table class="fill-width text-body-2">
                <tbody>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiAccountOutline" class="mr-3"/>
                            {{$t('Sender')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left" width="100%" v-text="data.fullName"/>
                </tr>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiEmailOutline" class="mr-3"/>
                            {{$t('Email')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left">
                        <a :href="`mailto:${data.email}`" v-text="data.email" :title="data.email"/>
                    </td>
                </tr>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiPhoneOutline" class="mr-3"/>
                            {{$t('Phone')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left">
                        <a :href="`tel:${data.phone}`" v-text="data.phone" :title="data.phone"/>
                    </td>
                </tr>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiPencilOutline" class="mr-3"/>
                            {{$t('Message')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left lh-1-6" v-text="data.message"/>
                </tr>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiCalendar" class="mr-3"/>
                            {{$t('Created at')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left">
                        <Date :date="data.createdAt"/>
                    </td>
                </tr>
                <tr v-if="data.updatedAt !== data.createdAt">
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiCalendar" class="mr-3"/>
                            {{$t('Seen at')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left">
                        <Date :date="data.updatedAt"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </v-card>
</template>

<script>


export default {
    name: "ContactDetail",

    props: {
        data: Object,
    },

    async created() {
        if(this.data && !this.data.seen){
            await this.$saveData({
                api: 'messages',
                payload:{
                    _id: this.data._id,
                    seen: true
                },
                alert: false
            })
            await this.$reFetch()
        }
    }
}
</script>
