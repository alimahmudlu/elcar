import Vue from 'vue';
import { Can, abilitiesPlugin } from '@casl/vue'
import { Ability } from '@casl/ability'

Vue.use(abilitiesPlugin, new Ability([]));
Vue.component('Can', Can)
