# ming_node
轻便完善的Web服务,随用随扔的Web服务

 >  ming_node是一个快速搭建web服务,接口测试,日常脚本编写的一个工具集
 
 
#ming_node安装
 ```sh
 $ npm install ming_node
 ```

  
#ming_node最小环境    
    
```javascript
var M=require("ming_node");
var app=M.server();
app.listen(8888);
app.get("/getById",(req,res)=>{ 
    console.log(req.params);
    res.send("ok");
})


 ```
 
#ming_node快速mock前端接口
     
 ```javascript
var M=require("ming_node");
var app=M.server();
app.listen(8888);

app.post("/add",(req,res)=>{
    r=M.add(req.params)
    res.send(M.result(r));
})

app.get("/delete",(req,res)=>{
    M.deleteById(req.params.id)
    res.send(M.result("ok"));
})

app.post("/update",(req,res)=>{
    M.update(req.params)
    res.send(M.result("ok"));
})

app.get("/getById",(req,res)=>{
    r=M.getById(req.params.id)
    res.send(M.result(r));
})

app.get("/listAll",(req,res)=>{
    r=M.listAll()
    res.send(M.result(r));
})

app.get("/listByParentId",(req,res)=>{
    r=M.listByProp({parentId:req.params.parentId})
    res.send(M.result(r));
})

app.get("/listByPage",(req,res)=>{
    r=M.listByPage(req.params.startPage,req.params.limit)
    res.send(M.result(r));
}) 
 
```
#ming_node  cookie与session的处理  
```javascript
var M=require("ming_node");
var app=M.server();
app.listen(8888);

app.get("/setSession",(req,res)=>{
    //打印请求ip与cookie
    console.log(req.ip,req.cookies)
    //设置session
    req.session={ss:55}
    res.send("ok");
})

app.get("/getSession",(req,res)=>{
    //打印session
    console.log(req.session)
    //设置cookie
    res.cookie("username","zs");
    res.send("ok");
})
```
#ming_node  彻底的单文件化 
```javascript
async function Myrequire(url) {
    return new Promise(function (resolve, reject) {
        require('https').get(url,function(req,res){
            var d='';
            req.on('data',(data)=>{d+=data;});
            req.on('end',()=>{let r=eval(d);resolve(r);});
            req.on('error',(e)=>{reject(e.message);});
        });
})};
+async function(){
    M=await Myrequire("https://raw.githubusercontent.com/minglie/ming_node/master/index.js");
    var app=M.server();
    app.listen(8888);
    app.get("/getById",async (req,res)=>{ 
        console.log(req.params);
        MM=await M.require("https://raw.githubusercontent.com/minglie/ming_node/master/index.js")
        console.log(MM.cookie);
        res.send(MM.cookie);
    })
 }();

```

#使用ming_node搭建前端学习环境

##后端代码
 ```javascript
 var M=require("ming_node");
 var app=M.server();
 app.listen(8888);
 app.get("/",async (req,res)=>{ 
    app.redirect("/index.html",req,res)
 })
 app.get("/pagelist",async (req,res)=>{ 
     let s= await M.exec("dir static /b")
     res.send(M.result(s))
 })
 ```
 ##前端代码
  ```html
 <!DOCTYPE html>
 <html>
 <head>
     <meta charset="utf-8">
     <title>index</title>
     <script src="https://cdn.staticfile.org/vue/2.4.2/vue.min.js"></script>
 </head>
 
 <body>
     <div id="app">
         <h1>网页列表</h1>
         <div v-for="file in list">
             <a :href="file">{{ file }}</a> <br /> <br />
         </div>
     </div>
     <script type="text/javascript">
         new Vue({
             el: '#app',
             data() {
                 return {
                     list: null
                 }
             },
             mounted() {
                 M_this = this;
                 fetch('/pagelist').then(function (response) {
                     return response.json();
                 }).then(function (response) {
                     let list = response.data.split("\n");
                     list = list.filter((d) => (d.indexOf(".html") >= 0))
                     console.log(list)
                     M_this.list = list
                 });
             }
 
         })
     </script>
 </body>
 </html>
  ```
 
#ming_node的使用详情,请到ming_node的主页查看

https://minglie.github.io/os/ming_node/
 
