/*模拟AJAX获取数据*/
var idtest = 1;
function getData(params, callback){
  console.log(params);
  var article = {
      id:1,
      thumbnail:'http://7xn32g.com1.z0.glb.clouddn.com/_cloud_file_201653_121412_3571904.JPG?imageView2/1/w/140/h/110',
      title:'携程商旅联手明道抢滩企业级服务市场',
      created_at:'2016-06-01 12:22'
    };
  var list = [];
  for (var i = 0; i < 10; i++) {
    var article = {
        id:idtest++,
        thumbnail:'http://7xn32g.com1.z0.glb.clouddn.com/_cloud_file_201653_121412_3571904.JPG?imageView2/1/w/140/h/110',
        title:'携程商旅联手明道抢滩企业级服务市场',
        created_at:'2016-06-01 12:22'
      };
    list.push(article);
  };

  setTimeout(function(){
    callback({ code: 200, list: list })
  },500);
}