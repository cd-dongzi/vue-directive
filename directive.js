import Vue from 'vue'

/*
方法：
	start
	end
	tap
	longTap
	doubleTap
	swiperLeft
	swiperRight
	swiperDown
	swiperUp
	pan
	panLeft
	panRight
	panUp
	panDown

示例：
v-touch:tap="Func"


v-touch:pan="Func"  
	return x,y方向  false是方向不变

 */
Vue.directive('touch', {
	inserted: (el, binding, vnode, oldVnode) => {
		console.log(el, binding, vnode, oldVnode)
		el.touchstart = binding.def.touchstart;
		el.touchmove = binding.def.touchmove;
		el.touchend = binding.def.touchend;


		let data = vnode.data,
			attrsBol = false
		if ('attrs' in data) attrsBol = true;
		if (attrsBol) {
			if ('visable' in data.attrs) if (data.attrs.visable === false || String(data.attrs.visable) === 'false') return null;
		}

		let type = binding.arg,
			direction = Object.keys(binding.modifiers)[0],
			callback = binding.value

			console.log(callback)
		if (typeof callback !== 'function') {
			console.warn('please enter a function')
			return null;
		}

		switch (type) {
			case 'start':
				binding.def.start(el,callback);
				break;
			case 'end':
				binding.def.end(el,callback);
				break;
			case 'tap':
				binding.def.tap(el,callback);
				break;
			case 'longTap':
				binding.def.longTap(el,callback);
				break;
			case 'doubleTap':
				binding.def.doubleTap(el,callback);
				break;
			case 'swiperLeft':
				binding.def.swiperLeft(el,callback);
				break;
			case 'swiperRight':
				binding.def.swiperRight(el,callback);
				break;
			case 'swiperDown':
				binding.def.swiperDown(el,callback);
				break;
			case 'swiperUp':
				binding.def.swiperUp(el,callback);
				break;
			case 'pan':
				binding.def.pan(el,callback,direction);
				break;
			case 'panLeft':
				binding.def.panLeft(el,callback);
				break;
			case 'panRight':
				binding.def.panRight(el,callback);
				break;
			case 'panUp':
				binding.def.panUp(el,callback);
				break;
			case 'panDown':
				binding.def.panDown(el,callback);
				break;
			default:
				throw new Error('参数错误')
		}
	},
	start: (el, callback) => {
		el.addEventListener('touchstart', function (e) {
			callback(); 
		})
	},
	end: (el, callback) => {
		el.addEventListener('touchend', function (e) {
			callback(); 
		})
	},
	tap: (el, callback) => {
		var start = 0,
			end = 0,
			x1,y1,x2,y2,
			time = 500;
		el.addEventListener('touchstart', function (e) {
			start = new Date().getTime()
			el.touchstart(e)
			// let touches = e.changedTouches[0];
		})

		el.addEventListener('touchend', function (e) {
			end = new Date().getTime()
			el.touchend(e)
			if (end - start <= time && el.startPageX === el.endPageX && el.startPageY === el.endPageY) {
				callback ();
			}else{
				return null;
			}
		})
	},
	doubleTap: (el, callback) => { //双击
		var now = 0,
			last = 0,
			delta = 0,
			time = 250,
			isDoubleBol = false;
		el.addEventListener('touchstart', function (e) {
			now = new Date().getTime();
			delta = now - (last || now);
			if (delta > 0 && delta <= time) {
				isDoubleBol = true;
			}
			last = now;
		})

		el.addEventListener('touchend', function (e) {
			now = new Date().getTime()
			if (now - last <= time) {
				if (isDoubleBol) {
					callback()
					isDoubleBol = false;
					last = 0;
				}
			}
		})
	},
	longTap: (el, callback) => { //长按
		var start = 0,
			end = 0,
			time = 750;
		el.addEventListener('touchstart', function (e) {
			start = new Date().getTime()
		})

		el.addEventListener('touchend', function (e) {
			end = new Date().getTime()
			if (end - start > time) {
				callback ();
			}else{
				return null;
			}
		})
	},
	swiperLeft: (el, callback) => { //左滑
		el.addEventListener('touchstart', function (e) {
			el.touchstart(e);
		})

		el.addEventListener('touchend', function (e) {
			el.touchend(e);
			if (el.startPageX > el.endPageX && Math.abs(el.startPageX - el.endPageX) > 50) {
				callback ();
			}else{
				return null;
			}
		})
	},
	swiperRight: (el, callback) => { //右滑
		el.addEventListener('touchstart', function (e) {
			el.touchstart(e);
		})

		el.addEventListener('touchend', function (e) {
			el.touchend(e);
			if (el.startPageX < el.endPageX && Math.abs(el.startPageX - el.endPageX) > 50) {
				callback ();
			}else{
				return null;
			}
		})
	},

	swiperDown: (el, callback) => { //下滑
		el.addEventListener('touchstart', function (e) {
			el.touchstart(e);
		})

		el.addEventListener('touchend', function (e) {
			el.touchend(e);
			if (el.startPageY < el.endPageY && Math.abs(el.startPageY - el.endPageY) > 50) {
				callback ();
			}else{
				return null;
			}
		})
	},
	swiperUp: (el, callback) => { //上滑
		el.addEventListener('touchstart', function (e) {
			el.touchstart(e);
		})

		el.addEventListener('touchend', function (e) {
			el.touchend(e);
			if (el.startPageY > el.endPageY && Math.abs(el.startPageY - el.endPageY) > 50) {
				callback ();
			}else{
				return null;
			}
		})
	},
	pan: (el, callback, direction = 'xy') => {
		if (!direction) {
			console.warn('Need a direction');
			return;
		}
		el.addEventListener('touchmove', function (e) {
			if (direction.toLowerCase() === 'x') { // false 为没做位移
				var left = el.x;
				el.touchmove(e);
				var newLeft = el.x;
				if (newLeft < left) callback('left')
				else if(newLeft > left) callback('right')
				else callback(false)

			}else if (direction.toLowerCase() === 'y') { // false 为没做位移
				var top = el.y;
				el.touchmove(e);
				var newTop = el.y;
				if (newTop < top) callback('up')
				else if(newTop > top) callback('down')
				else callback(false)

			}else if (direction.toLowerCase() === 'xy') {// false 为没做位移
				var left = el.x, top = el.y;
				el.touchmove(e);
				var newLeft = el.x, newTop = el.y;
				if (true) {
					// if (true) {}
					var x,y;
					if (newLeft < left) x = 'left';
					else if(newLeft > left) x = 'right';
					else x = false

					if (newTop < top) y = 'up';
					else if(newTop > top) y = 'down';
					else y = false

					// return {x, y}
					callback({x, y})

				}
			}
			
		})


	},
	panLeft: (el, callback) => {
		el.addEventListener('touchmove', function (e) {
			var left = el.x
			el.touchmove(e);
			var newLeft = el.x;
			if (newLeft < left) callback()
		})
	},
	panRight: (el, callback) => {
		el.addEventListener('touchmove', function (e) {
			var left = el.x
			el.touchmove(e);
			var newLeft = el.x;
			if (newLeft > left) callback()
		})
	},
	panUp: (el, callback) => {
		el.addEventListener('touchmove', function (e) {
			var top = el.y
			el.touchmove(e);
			var newTop = el.y;
			if (newTop < top) callback()
		})
	},
	panDown: (el, callback) => {
		el.addEventListener('touchmove', function (e) {
			var top = el.y
			el.touchmove(e);
			var newTop = el.y;
			if (newTop > top) callback()
		})
	},
	touchstart: function (e) {
		let touches = e.changedTouches[0];
		this.startPageX = touches.pageX;
		this.startPageY = touches.pageY;
	},
	touchmove: function (e) {
		let touches = e.changedTouches[0];
		this.x = touches.pageX;
		this.y = touches.pageY;
	},
	touchend: function (e) {
		let touches = e.changedTouches[0];
		this.endPageX = touches.pageX;
		this.endPageY = touches.pageY;
	}

	// touchstart: (e) => {
	// 	let touches = e.changedTouches[0];
	// 	el.startPageX = touches.pageX;
	// 	el.startPageY = touches.pageY;
	// },
	// touchmove: (e) => {
	// 	let touches = e.changedTouches[0];
	// 	el.x = touches.pageX;
	// 	el.y = touches.pageY;
	// },
	// touchend: (e) => {
	// 	let touches = e.changedTouches[0];
	// 	el.endPageX = touches.pageX;
	// 	el.endPageY = touches.pageY;
	// }

})



// import Vue from 'vue'
// Vue.directive('touch', {
// 	inserted: (el, binding, vnode, oldVnode) => {
// 		console.log(el, binding, vnode, oldVnode)
// 		this.touchstart = binding.def.touchstart;
// 		this.touchmove = binding.def.touchmove;
// 		this.touchend = binding.def.touchend;


// 		let data = vnode.data,
// 			attrsBol = false
// 		if ('attrs' in data) attrsBol = true;
// 		if (attrsBol) {
// 			if ('visable' in data.attrs) if (data.attrs.visable === false || String(data.attrs.visable) === 'false') return null;
// 		}

// 		let type = binding.arg,
// 			direction = Object.keys(binding.modifiers)[0],
// 			callback = binding.value

// 			console.log(callback)
// 		if (typeof callback !== 'function') {
// 			console.warn('please enter a function')
// 			return null;
// 		}

// 		switch (type) {
// 			case 'start':
// 				binding.def.start(el,callback);
// 				break;
// 			case 'end':
// 				binding.def.end(el,callback);
// 				break;
// 			case 'tap':
// 				binding.def.tap(el,callback);
// 				break;
// 			case 'longTap':
// 				binding.def.longTap(el,callback);
// 				break;
// 			case 'doubleTap':
// 				binding.def.doubleTap(el,callback);
// 				break;
// 			case 'swiperLeft':
// 				binding.def.swiperLeft(el,callback);
// 				break;
// 			case 'swiperRight':
// 				binding.def.swiperRight(el,callback);
// 				break;
// 			case 'swiperDown':
// 				binding.def.swiperDown(el,callback);
// 				break;
// 			case 'swiperUp':
// 				binding.def.swiperUp(el,callback);
// 				break;
// 			case 'pan':
// 				binding.def.pan(el,callback,direction);
// 				break;
// 			case 'panLeft':
// 				binding.def.panLeft(el,callback);
// 				break;
// 			case 'panRight':
// 				binding.def.panRight(el,callback);
// 				break;
// 			case 'panUp':
// 				binding.def.panUp(el,callback);
// 				break;
// 			case 'panDown':
// 				binding.def.panDown(el,callback);
// 				break;
// 			default:
// 				throw new Error('参数错误')
// 		}
// 	},
// 	start: (el, callback) => {
// 		el.addEventListener('touchstart', function (e) {
// 			callback(); 
// 		})
// 	},
// 	end: (el, callback) => {
// 		el.addEventListener('touchend', function (e) {
// 			callback(); 
// 		})
// 	},
// 	tap: (el, callback) => {
// 		var start = 0,
// 			end = 0,
// 			x1,y1,x2,y2,
// 			self = this,
// 			time = 500;
// 		el.addEventListener('touchstart', function (e) {
// 			start = new Date().getTime()
// 			self.touchstart(e)
// 			// let touches = e.changedTouches[0];
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			end = new Date().getTime()
// 			self.touchend(e)
// 			if (end - start <= time && self.startPageX === self.endPageX && self.startPageY === self.endPageY) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},
// 	doubleTap: (el, callback) => { //双击
// 		var now = 0,
// 			last = 0,
// 			delta = 0,
// 			time = 250,
// 			isDoubleBol = false,
// 			self = this;
// 		el.addEventListener('touchstart', function (e) {
// 			now = new Date().getTime();
// 			delta = now - (last || now);
// 			if (delta > 0 && delta <= time) {
// 				isDoubleBol = true;
// 			}
// 			last = now;
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			now = new Date().getTime()
// 			if (now - last <= time) {
// 				if (isDoubleBol) {
// 					callback()
// 					isDoubleBol = false;
// 					last = 0;
// 				}
// 			}
// 		})
// 	},
// 	longTap: (el, callback) => { //长按
// 		var start = 0,
// 			end = 0,
// 			time = 750;
// 		el.addEventListener('touchstart', function (e) {
// 			start = new Date().getTime()
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			end = new Date().getTime()
// 			if (end - start > time) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},
// 	swiperLeft: (el, callback) => { //左滑
// 		let self = this;
// 		el.addEventListener('touchstart', function (e) {
// 			self.touchstart(e);
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			self.touchend(e);
// 			if (self.startPageX > self.endPageX && Math.abs(self.startPageX - self.endPageX) > 50) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},
// 	swiperRight: (el, callback) => { //右滑
// 		let self = this;
// 		el.addEventListener('touchstart', function (e) {
// 			self.touchstart(e);
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			self.touchend(e);
// 			if (self.startPageX < self.endPageX && Math.abs(self.startPageX - self.endPageX) > 50) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},

// 	swiperDown: (el, callback) => { //下滑
// 		let self = this;
// 		el.addEventListener('touchstart', function (e) {
// 			self.touchstart(e);
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			self.touchend(e);
// 			if (self.startPageY < self.endPageY && Math.abs(self.startPageY - self.endPageY) > 50) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},
// 	swiperUp: (el, callback) => { //上滑
// 		let self = this;
// 		el.addEventListener('touchstart', function (e) {
// 			self.touchstart(e);
// 		})

// 		el.addEventListener('touchend', function (e) {
// 			self.touchend(e);
// 			if (self.startPageY > self.endPageY && Math.abs(self.startPageY - self.endPageY) > 50) {
// 				callback ();
// 			}else{
// 				return null;
// 			}
// 		})
// 	},
// 	pan: (el, callback, direction) => {
// 		if (!direction) {
// 			console.warn('Need a direction');
// 			return;
// 		}
// 		let self = this;
// 		el.addEventListener('touchmove', function (e) {
// 			if (direction.toLowerCase() === 'x') { // false 为没做位移
// 				var left = self.x;
// 				self.touchmove(e);
// 				var newLeft = self.x;
// 				if (newLeft < left) callback('left')
// 				else if(newLeft > left) callback('right')
// 				else callback(false)

// 			}else if (direction.toLowerCase() === 'y') { // false 为没做位移
// 				var top = self.y;
// 				self.touchmove(e);
// 				var newTop = self.y;
// 				if (newTop < top) callback('up')
// 				else if(newTop > top) callback('down')
// 				else callback(false)

// 			}else if (direction.toLowerCase() === 'xy') {// false 为没做位移
// 				var left = self.x, top = self.y;
// 				self.touchmove(e);
// 				var newLeft = self.x, newTop = self.y;
// 				if (true) {
// 					// if (true) {}
// 					var x,y;
// 					if (newLeft < left) x = 'left';
// 					else if(newLeft > left) x = 'right';
// 					else x = false

// 					if (newTop < top) y = 'up';
// 					else if(newTop > top) y = 'down';
// 					else y = false

// 					// return {x, y}
// 					callback({x, y})

// 				}
// 			}
			
// 		})


// 	},
// 	panLeft: (el, callback) => {
// 		let self = this;
// 		el.addEventListener('touchmove', function (e) {
// 			var left = self.x
// 			self.touchmove(e);
// 			var newLeft = self.x;
// 			if (newLeft < left) callback()
// 		})
// 	},
// 	panRight: (el, callback) => {
// 		let self = this;
// 		el.addEventListener('touchmove', function (e) {
// 			var left = self.x
// 			self.touchmove(e);
// 			var newLeft = self.x;
// 			if (newLeft > left) callback()
// 		})
// 	},
// 	panUp: (el, callback) => {
// 		let self = this;
// 		el.addEventListener('touchmove', function (e) {
// 			var top = self.y
// 			self.touchmove(e);
// 			var newTop = self.y;
// 			if (newTop < top) callback()
// 		})
// 	},
// 	panDown: (el, callback) => {
// 		let self = this;
// 		el.addEventListener('touchmove', function (e) {
// 			var top = self.y
// 			self.touchmove(e);
// 			var newTop = self.y;
// 			if (newTop > top) callback()
// 		})
// 	},
// 	touchstart: (e) => {
// 		let touches = e.changedTouches[0];
// 		this.startPageX = touches.pageX;
// 		this.startPageY = touches.pageY;
// 	},
// 	touchmove: (e) => {
// 		let touches = e.changedTouches[0];
// 		this.x = touches.pageX;
// 		this.y = touches.pageY;
// 	},
// 	touchend: (e) => {
// 		let touches = e.changedTouches[0];
// 		this.endPageX = touches.pageX;
// 		this.endPageY = touches.pageY;
// 	}

// })