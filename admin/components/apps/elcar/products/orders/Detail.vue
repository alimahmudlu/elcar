<template>
    <div class="pa-3 pa-md-6 overflow-auto" style="height: calc(100vh - 60px)" v-if="data">

        <v-card outlined tile class="pa-md-3 mb-3 mb-md-6">
            <table class="fill-width text-body-2">
                <tbody>
                <tr>
                    <th class="pa-2 text-left font-weight-bold text-no-wrap align-v-top">
                        <span class="d-flex align-center">
                            <Icon name="mdiAccountOutline" class="mr-3"/>
                            {{$t('Customer')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left" width="100%" v-text="data.purchaser"/>
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
                            {{$t('Note')}}:
                        </span>
                    </th>
                    <td class="pa-2 text-left lh-1-6" v-text="data.note"/>
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
        </v-card>

        <v-card outlined tile class="mb-3 mb-md-6">

            <v-simple-table>
                <template #default>
                    <thead>
                    <tr>
                        <th class="text-left" v-text="$t('Photo')"/>
                        <th class="text-left" v-text="$t('Name')"/>
                        <th class="text-center" v-text="$t('Amount')"/>
                        <th class="text-center" v-text="$t('Discount')"/>
                        <th class="text-left" v-text="$t('Old price')"/>
                        <th class="text-left" v-text="$t('Price')"/>
                    </tr>
                    </thead>

                    <tbody>
                    <template v-for="(product, i) in data.products">
                        <tr :key="`product-${i}`" v-if="product.detail && typeof product.detail === 'object'">
                            <td :width="100" class="py-0 px-2">
                                <v-img :src="$src(product.detail.image.src)" contain :aspect-ratio="4/3"
                                       v-if="product.detail.image && product.detail.image.src"/>
                            </td>
                            <td>{{ product.detail.title }}</td>
                            <td class="text-center">{{ product.amount }}</td>
                            <td class="text-center">{{ product.detail.discount || "0"}} %</td>
                            <td>
                                <s>{{ product.detail.discount ? product.detail.price + ' AZN' : '' }}</s>
                            </td>
                            <td>{{ product.detail.discountedPrice }} AZN</td>
                        </tr>
                    </template>
                    </tbody>
                </template>
            </v-simple-table>

        </v-card>

        <v-card outlined tile>

            <v-simple-table>
                <template #default>
                    <thead>
                    <tr>
                        <th class="text-left" v-text="$t('Operation')"/>
                        <th class="text-center" v-text="$t('Status')"/>
                        <th class="text-center" v-text="$t('Created at')"/>
                        <th width="10" class="text-center" v-text="$t('Details')"/>
                    </tr>
                    </thead>

                    <tbody>
                    <template v-for="(transaction, i) in transactions">
                        <tr :key="`transaction-${i}`">

                            <td>{{ transaction.operation }}</td>

                            <td class="text-center">
                                <template v-if="transaction.operation === 'CreateOrder'">
                                    <v-chip :color="transaction.status === '00' ? 'primary' : ''">
                                        {{ getCreateOrderStatus(transaction.status) }}
                                    </v-chip>
                                </template>
                                <template v-else>
                                    <v-chip :color="statusColor(data.status)">{{ data.status }}</v-chip>
                                </template>
                            </td>

                            <td class="text-center">
                                <Date :date="transaction.createdAt"/>
                            </td>

                            <td class="text-right">
                                <v-btn small icon @click="toggleDetail(i)">
                                    <Icon name="mdiChevronDown"/>
                                </v-btn>
                            </td>

                        </tr>
                        <tr v-if="expanded.includes(i)">
                            <td colspan="4" class="lighten">
                                <pre>{{transaction.bank}}</pre>
                            </td>
                        </tr>
                    </template>
                    </tbody>

                </template>
            </v-simple-table>

        </v-card>

    </div>
</template>

<script>


export default {
    name: "OrderDetail",

    data: ()=> ({
        data: null,
        transactions: [],
        expanded: [],
    }),

    async fetch() {

        this.data = await this.$fetchData({
            api: `orders/${this.$route.params.detail}`,
        })

        this.transactions = await this.$fetchData({
            api: 'bank-transactions',
            query: {
                order: this.$route.params.detail
            }
        })

        if(this.data && !this.data.seen){
            await this.$saveData({
                api: 'orders',
                payload:{
                    _id: this.data._id,
                    seen: true
                },
                alert: false
            })
            await this.$reFetch()
        }
    },

    methods:{

        getCreateOrderStatus(status){
            switch (status) {
                case '00':
                    return this.$t('Success')
                case '10':
                    return this.$t('Not access')
                case '30':
                    return this.$t('Incorrect message format')
                case '54':
                    return this.$t('Wrong operation')
                case '96 ':
                    return this.$t('System error')
            }
        },

        statusColor(status){
            switch (status) {
                case 'APPROVED':
                    return 'primary'
                case 'CANCELED':
                    return 'orange'
                case 'DECLINED':
                    return 'red'
                default:
                    return
            }
        },

        toggleDetail(index){
            if(this.expanded.includes(index)){
                this.expanded = this.expanded.filter(i => i !== index)
            }else{
                this.expanded.push(index)
            }
        },
    }
}
</script>
