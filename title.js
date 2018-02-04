import Vue from 'vue'

/*
v-title="String"

例： v-title="标题"
 */
Vue.directive('title', {
    inserted: function (el, binding) {
        document.title = binding.value
    }
})