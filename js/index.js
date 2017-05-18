var ir;
var categorys = [1, 2, 3, 4, 5, 6]; //每个类别的ID号

$(function() {
  loaded()

	$(document).on('tap',"#ir-bd-wrapper .ir-scroller li", function(e){
		var id = $(this).attr('data-id');
		alert(id);
		//location.href = "detail.html?id=" + id
	})
})

function loaded () {
	$('.ir-scroller').each(function(index, el) {
		$(this).append('<div class="loader"><div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div><div style="margin-top:15px">加载中...</div></div>');
	});
	ir = new iScrollRefresh('#ir-tabs-wrapper','#ir-bd-wrapper');

	//ir = IR(['选项卡1','选项卡2','选项卡3','选项卡4','选项卡5','选项卡6','选项卡7','选项卡8'],4)
	ir.downAction = pullDown; //下拉刷新取数据函数
	ir.upAction = pullUp; //上拉加载取数据函数
	ir.slideAction = slide; //左右滑动的回调函数

	slide(0)
}

function slide(index){
	if($('.ir-scroller').eq(index).find('div.loader').length >0){
		initData(index,0);
	}
}

function initData(index,page){
	getData({ tab: index, page: page, cid: categorys[index], type: 'init' }, function (data) {
		if(parseInt(data.code) == 200){
			var $irScroller = $('.ir-scroller').eq(index);
			for(var i=0;i<data.list.length;i++){
				var art = data.list[i];
				var html = parseHtml(art);
				$irScroller.append(html);
			}
			$('.ir-scroller').eq(index).find('.loader').remove();
			ir.setPage(index,1);  //设置当前页面的页数
			ir.refresh(index); //刷新Iscroll
		}
	});
}

function pullDown(param){
	/*
	param.scroll  当前滚动的ISCROLL对象
	param.index   当前页面的索引，从0开始
	param.lastUpdate 上一次刷新的时间
	*/
	var index = param.index;
	getData({ tab: index, page: 0, cid: categorys[index], type: 'pullDown' }, function (data) {
		if(parseInt(data.code) == 200) {
			var $irScroller = $('.ir-scroller').eq(index);
			$irScroller.empty();
			for(var i=0;i<data.list.length;i++){
				var art = data.list[i];
				var html = parseHtml(art);
				$irScroller.append(html);
			}
			ir.setPage(index,1);  //设置当前页面的页数
			ir.pullDownCallBack(param); //还有数据的时候用这个
		} else {
			ir.setPage(index,1);  //设置当前页面的页数
			ir.pullDownCallBack(param,1); //没有更多数据的时候后面多加个1就行
		}
	});
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
	getData({ tab: index, page: page, cid: categorys[index], type: 'pullUp' }, function (data) {
		if(parseInt(data.code) == 200) {
			var $irScroller = $('.ir-scroller').eq(index);
			for(var i=0;i<data.list.length;i++){
				var art = data.list[i];
				var html = parseHtml(art);
				$irScroller.append(html);
			}
			ir.pullUpCallBack(param); //还有数据的时候用这个
		} else {
			ir.pullUpCallBack(param,1); //没有更多数据的时候后面多加个1就行
		}
	});
}

function parseHtml(art){
	var html = '<li data-id="' + art.id + '"><a class="clear-fix" href="javascript:void(0)"><img src="'+art.thumbnail+'"><div class="li-body"><h3>'+art.title+'</h3><p>'+art.created_at+'</p></div></a></li>';
	if(!art.thumbnail){
	html = '<li><a href="/articles/show/'+art.id+'"><div class="li-body" style="width:100%"><h3>'+art.title+'</h3><p>'+art.created_at+'</p></div></a></li>';
	}
	return html;
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
