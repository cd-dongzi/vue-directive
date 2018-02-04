import Vue from 'vue'

/*
v-scroll="Func"

Func: 必须返回Promise

例： v-scroll="Func"
Func:function () {
    return new Promise( (resolve, reject) => {
        setTimeout(function(){
            resolve()
        },1000)
    })
}

 */

Vue.directive('scroll', {
    inserted: function (el, binding, vnode, oldVnode) {
        let w = el.offsetHeight,
            isLoading = false,
            cb_name = binding.expression,
            cb = vnode.context[cb_name]
        el.addEventListener('scroll', async () => {
            if (w + el.scrollTop + 10 >= el.firstChild.clientHeight && !isLoading) {
                isLoading = true
                try {
                    cb && await cb()
                }catch(e) {
                    console.error(e)
                }
                isLoading = false
            }
        })
    }
})