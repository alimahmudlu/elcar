<template>
    <v-form @submit.prevent="submit">

        <v-text-field v-model="form.email" :label="$t('Username')" required outlined type="email"
                      :error-messages="$errorMessages($v.form.email, $t('Username'))"/>

        <v-text-field v-model="form.password" :label="$t('Password')" required outlined
                      :append-icon="showPassword ? mdiEyeOff : mdiEye" :type="`${showPassword ? 'text' : 'password'}`"
                      :error-messages="$errorMessages($v.form.password, $t('Password'))"
                      @click:append="showPassword = !showPassword"/>

        <v-checkbox v-model="form.remember" :label="$t('Remember me')" color="primary" class="mt-0 pa-0 mb-2"
                    :off-icon="mdiCheckboxBlankCircleOutline" :on-icon="mdiCheckboxMarkedCircleOutline"/>

        <v-btn type="submit" color="primary" dark block depressed :loading="loading">
            {{ $t('Sign in') }}
        </v-btn>

    </v-form>
</template>

<script>

import {validationMixin} from 'vuelidate'
import {required, email, minLength} from 'vuelidate/lib/validators'
import {mdiCheckboxBlankCircleOutline, mdiCheckboxMarkedCircleOutline, mdiEye, mdiEyeOff} from '@mdi/js'

export default {
    name: "SignInForm",
    mixins: [validationMixin],

    data: () => ({
        mdiCheckboxBlankCircleOutline,
        mdiCheckboxMarkedCircleOutline,
        mdiEye,
        mdiEyeOff,

        form: {
            email: null,
            password: null,
            strategy: "local",
            remember: false,
        },
        loading: false,
        showPassword: false,
    }),

    validations: {
        form: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6)
            },
        }
    },

    created() {
        this.resetState()
    },

    methods: {
        async submit() {

            this.$v.form.$touch();

            if(this.$v.form.$invalid || this.$v.form.$anyError) return

            this.loading = true;

            try {

                await this.$auth.loginWith('local', {data: this.form})

                const invitation = this.$route.query.invitation

                if(invitation){
                    await this.$router.push(this.$localePath({
                        name: 'general-invitations-invitation',
                        params: {invitation}
                    }))
                }else{
                    this.resetState()
                    await this.$router.push(this.$localePath('index'))
                }

            } catch (error) {
                this.$responseError(error)
            }

            this.loading = false
        },

        resetState(){
            this.$store.commit('RESET_STATE')
            this.$store.commit('data/RESET_STATE')
        }
    },
}
</script>
