var categorys = [17,18,19]; //每个类别的ID号
var ir;

var vm = new Vue({
	el: '#app',
	data: {
		list1: [],
		list2: [],
		list3: [],
	},
	methods: {
		loaded: function() {
			ir = new iScrollRefresh('#ir-tabs-wrapper','#ir-bd-wrapper');
			ir.downAction = this.pullDown; //下拉刷新取数据函数
			ir.upAction = this.pullUp; //上拉加载取数据函数
			ir.slideAction = this.slide; //左右滑动的回调函数
			this.slide(0);
		},
		slide: function(index) {
			if($('.ir-scroller').eq(index).find('.loader').length >0){
				this.initData(index,0);
			}
		},
		pullDown: function(param) {
			/*
			param.scroll  当前滚动的ISCROLL对象
			param.index   当前页面的索引，从0开始
			param.lastUpdate 上一次刷新的时间
			*/
			var index = param.index;
			getData({ curTab: index, curPage: 0, type: 'pullDown' }, function (data) {
				if(parseInt(data.code) == 200) {
					vm.setInitList(index, data.list);
				  Vue.nextTick(function(){
						ir.pullUpCallBack(param); //还有数据的时候用这个
					})
			  } else {
					Vue.nextTick(function(){
						ir.setPage(index,0);  //设置当前页面的页数
						ir.pullUpCallBack(param,1); //没有更多数据的时候后面多加个1就行
					})
				}
			});
		},
		pullUp: function(param) {
			/*
			param.scroll  当前滚动的ISCROLL对象
			param.index   当前页面的索引，从0开始
			param.lastUpdate 上一次刷新的时间
			param.page  当前已经加载的页数
			*/
			var index = param.index;
			var page = param.page;
			getData({ curTab: index, curPage: page, type: 'pullUp' }, function (data) {
				if(parseInt(data.code) == 200) {
					vm.setMoreList(index, data.list);
				  Vue.nextTick(function(){
						ir.pullUpCallBack(param); //还有数据的时候用这个
					})
			  } else {
					Vue.nextTick(function(){
						ir.pullUpCallBack(param,1); //没有更多数据的时候后面多加个1就行
					})
				}
			});
		},
		initData: function(index, page) {
			getData({ curTab: index, curPage: page, type: 'init' }, function (data) {
				if(parseInt(data.code) == 200){
					//vm.list1 = data.list
					vm.setInitList(index, data.list)
					$('.ir-scroller').eq(index).find('.loader').parent('li').remove();
				  Vue.nextTick(function(){
						ir.setPage(index,1);  //设置当前页面的页数
					  ir.refresh(index); //刷新Iscroll
					})
			  }
			});
		},
		setInitList: function(index, list) {
			switch (index) {
				case 0:
					vm.list1 = list; break;
				case 1:
					vm.list2 = list; break;
				case 2:
					vm.list3 = list; break;
				default:
					break;
			}
		},
		setMoreList: function(index, list) {
			switch (index) {
				case 0:
					for(var i= 0; i < list.length; i++) {
						vm.list1.push(list[i])
					}
					break;
				case 1:
					for(var i= 0; i < list.length; i++) {
						vm.list2.push(list[i])
					}
					break;
				case 2:
					for(var i= 0; i < list.length; i++) {
						vm.list3.push(list[i])
					}
					break;
				default:
					break;
			}
		}
	},
	created: function () {
    setTimeout(function(){
			vm.loaded();
		},300)
  }
})
