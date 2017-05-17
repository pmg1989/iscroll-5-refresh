var categorys = [17,18,19]; //每个类别的ID号
var ir;

function pullDown(param){
	/*
	param.scroll  当前滚动的ISCROLL对象
	param.index   当前页面的索引，从0开始
	param.lastUpdate 上一次刷新的时间
	*/
	var index = param.index;
	function callback(data){

		if(parseInt(data.code) == 200){

			for(var i=0;i<data.data.length;i++){
				var art = data.data[i];
				var html = parseHtml(art);
				$('.ir-scroller').eq(index).prepend(html);
			}
			ir.pullDownCallBack(param); //这个一定要写，是隐藏上拉刷新提示用得
		}else{
			ir.pullDownCallBack(param,1); //后面的1代表没有更新的数据了，不传的话，还可以继续下拉
		}

	}

	testData(callback);

};

function pullUp(param){
	/*
	param.scroll  当前滚动的ISCROLL对象
	param.index   当前页面的索引，从0开始
	param.lastUpdate 上一次刷新的时间
	param.page  当前已经加载的页数
	*/
	var index = param.index;
	var page = param.page;

	function callback(data){

		if(parseInt(data.code) == 200){

			for(var i=0;i<data.data.length;i++){
				var art = data.data[i];
				var html = parseHtml(art);
				$('.ir-scroller').eq(index).append(html);
			}
			ir.pullUpCallBack(param); //还有数据的时候用这个
		}else{
			ir.pullUpCallBack(param,1); //没有更多数据的时候后面多加个1就行
		}

	}
	testData(callback);
}

function slide(index){
	if($('.ir-scroller').eq(index).find('div.loader').length >0){
		initData(index,1);
	}
}

function initData(index,page){

	function callback(data){

		if(parseInt(data.code) == 200){

			for(var i=0;i<data.data.length;i++){
				var art = data.data[i];
				var html = parseHtml(art);
				$('.ir-scroller').eq(index).append(html);
			}

		}

		$('.ir-scroller').eq(index).find('.loader').parent().remove();

		ir.setPage(index,1);  //设置当前页面的页数
		ir.refresh(index); //刷新Iscroll
	}

	testData(callback);


}

function testClick(id) {
	//alert(id);
	// event.preventDefault()
}

$(document).on('tap',"#ir-bd-wrapper .ir-scroller li", function(e){
	var id = $(this).data('id');
	//alert(id);
	location.href = "detail.html?id=" + id
})

function parseHtml(art){
	var html = '<li data-id="' + art.id + '"><a class="clear-fix" href="javascript:void(0)"><img src="'+art.thumbnail+'"><div class="li-body"><h3>'+art.title+'</h3><p>'+art.created_at+'</p></div></a></li>';
	if(!art.thumbnail){
	html = '<li><a href="/articles/show/'+art.id+'"><div class="li-body" style="width:100%"><h3>'+art.title+'</h3><p>'+art.created_at+'</p></div></a></li>';
	}
	return html;
}

/*模拟AJAX获取数据*/
var idtest = 1;
function testData(callback){
	var article = {
			id:1,
			thumbnail:'http://7xn32g.com1.z0.glb.clouddn.com/_cloud_file_201653_121412_3571904.JPG?imageView2/1/w/140/h/110',
			title:'携程商旅联手明道抢滩企业级服务市场',
			created_at:'2016-06-01 12:22'
		};
	var data = new Array();
	for (var i = 0; i < 10; i++) {
		var article = {
				id:idtest++,
				thumbnail:'http://7xn32g.com1.z0.glb.clouddn.com/_cloud_file_201653_121412_3571904.JPG?imageView2/1/w/140/h/110',
				title:'携程商旅联手明道抢滩企业级服务市场',
				created_at:'2016-06-01 12:22'
			};
		data.push(article);
	};

	setTimeout(function(){
		callback({code:200,data:data})
	},400);
}

//如果在页面内有其他滑动冲突的时候可以绑定touch事件禁止iscroll的滑动
/*
$('#viewport').on('touchstart',function(){
	ir.bdScroll.disable(); //禁止左右滑动
})
$('#viewport').on('touchend',function(){
	ir.bdScroll.enable(); // 开启左右滑动
})
*/

function loaded () {
	ir = new iScrollRefresh('#ir-tabs-wrapper','#ir-bd-wrapper');

	//ir = IR(['选项卡1','选项卡2','选项卡3','选项卡4','选项卡5','选项卡6','选项卡7','选项卡8'],4)
	ir.downAction = pullDown; //下拉刷新取数据函数
	ir.upAction = pullUp; //上拉加载取数据函数
	ir.slideAction = slide; //左右滑动的回调函数

	slide(0)
}

$(function() {
  loaded()
})
