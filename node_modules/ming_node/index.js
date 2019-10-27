/**
 * File : index.js
 * By : Minglie
 * QQ: 934031452
 * Date :2019.9.28
 */
var http=require('http');
var https=require('https');
var url_module=require('url');
var querystring=require('querystring');
var fs=require('fs');
var path=require('path');
var child_process = require('child_process');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var privateObj={};//本文件私有对象
var M={};
M.sessions={}//保存session
M.con_display_status_enable=false;//是否显示响应状态码
M.cookie="JSESSIONID="+"6E202D5A022EBD62705AA436EC54963B";//请求携带的cook
M.reqComQueryparams=undefined;//请求的公共的查询参数
M.reqComHeaders=undefined;//请求的公共请求头
M.host="http://127.0.0.1:7001";
M.log_file_enable=true;//将日志输出到文件
M.log_console_enable=true;//将日志输出到控制台
M.log_path="./M.log";//输出日志文件路径
M.map_path="./M_map.json";//全局作用域路径
M.database_path="./M_database.json";//文件型数据库路径
M.log_display_time=true;//日志是否显示当前时间
/**
 * ----------------------客户端START--------------------------------------------
 */
//解析对象或函数返回值
privateObj.getFunctionOrObjResult=function (objOrFunc,obj) {
    let c1;
    if(!objOrFunc){
        return obj;
    }
    if(typeof objOrFunc=="function"){
        c1=objOrFunc();
    }else {
        c1=objOrFunc;
    }
    return Object.assign(c1,obj);
}

//将对象追加到url上
privateObj.appendDataToUrl=function (url,data) {
    var getData="";
    if(data){
        getData=querystring.stringify(data);
        //url携带参数了
        if(url.indexOf("?")>0){
            getData="&"+getData;
        }else{
            getData="?"+getData;
        }
    }
    let r=url+getData;
    return r;
}


M.get=function(url,callback,data,headers) {
    if(headers){}
    else {
        headers = {
            'Content-Type': 'application/json',
            'Cookie': M.cookie
        }
    }
    var getData="";
    if(data || M.reqComQueryparams){
        data=privateObj.getFunctionOrObjResult(M.reqComQueryparams,data)
        getData=querystring.stringify(data);
        //url携带参数了
        if(url.indexOf("?")>0){
            getData="&"+getData;
        }else{
            getData="?"+getData;
        }
    }
    //合并请求头
    headers=privateObj.getFunctionOrObjResult(M.reqComHeaders,headers)
    var html='';
    var urlObj=url_module.parse(url)
    var options={
        hostname:urlObj.hostname,
        port:urlObj.port,
        path:urlObj.path+getData,
        method:'GET',
            headers:headers
    }
    var req=http.request(options,function(res){
        if(M.con_display_status_enable)console.log('STATUS:'+res.statusCode);
        if(global.debug && res.statusCode !=200){
            while(1){
                M.sleep(1000);
                console.log('STATUS:'+res.statusCode);
                console.log("--------ERROR:"+res.req.path+"-------------");
            }
        }
        //console.log('HEADERS:'+JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            callback(html,res);
        });
    });
    req.on('error',function(err){
        console.error(err);

    });
    req.end();
}

M.post=function(url,callback,data,headers) {
    url=privateObj.appendDataToUrl(url,M.reqComQueryparams);
    var html='';
    var urlObj=url_module.parse(url)
    //发送 http Post 请求
    var postData=querystring.stringify(data);

    if(headers){
        //console.log(headers);
        if(headers["Content-Type"]=="application/json"){
            postData=JSON.stringify(data);
        }
    }
    else {
        headers = {
            'Content-Type':'application/x-www-form-urlencoded; ' +
            'charset=UTF-8',
            'Cookie': M.cookie,
            'Content-Length':Buffer.byteLength(postData)
        }
    }
    //合并请求头
    headers=privateObj.getFunctionOrObjResult(M.reqComHeaders,headers)

    var options={
        hostname:urlObj.hostname,
        port:urlObj.port,
        path:urlObj.path,
        method:'POST',
        headers:headers
    }

    var req=http.request(options, function(res) {
        if(M.con_display_status_enable)console.log('STATUS:'+res.statusCode);
        if(global.debug && res.statusCode !=200){
            while(1){
                M.sleep(1000);
                console.log('STATUS:'+res.statusCode);
                console.log("--------ERROR:"+res.req.path+"-------------");
            }
        }
        // console.log('headers:',JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            callback(html,res);
        });
    });

    req.on('error',function(err){
        console.error(err);
    });
    req.write(postData);
    req.end();

}


M.postJson=function(url,callback,data,headers) {
    url=privateObj.appendDataToUrl(url,M.reqComQueryparams);
    var html='';
    var urlObj=url_module.parse(url)
    //发送 http Post 请求
    var postData=JSON.stringify(data);
    if(!headers){
        headers = {
            'Content-Type':'application/json; ' +
            'charset=UTF-8',
            'Cookie': M.cookie
        }
    }
    //合并请求头
    headers=privateObj.getFunctionOrObjResult(M.reqComHeaders,headers)
    var options={
        hostname:urlObj.hostname,
        port:urlObj.port,
        path:urlObj.path,
        method:'POST',
        headers:headers
    }

    var req=http.request(options, function(res) {
        if(M.con_display_status_enable)console.log('STATUS:'+res.statusCode);
        if(global.debug && res.statusCode !=200){
            while(1){
                M.sleep(1000);
                console.log('STATUS:'+res.statusCode);
                console.log("--------ERROR:"+res.req.path+"-------------");
            }
        }
        // console.log('headers:',JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            callback(html,res);
        });
    });

    req.on('error',function(err){
        console.error(err);
    });
    req.write(postData);
    req.end();
}




M.getHttps= function(url,callback,data){
    var getData="";
    if(data){
        getData=querystring.stringify(data);
        //url携带参数了
        if(url.indexOf("?")>0){
            getData="&"+getData;
        }else{
            getData="?"+getData;
        }
    }
    https.get(url+getData, function (res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
        });
        res.on("end", function () {
            var buff = Buffer.concat(datas, size);
            var result = buff.toString();
            callback(result,res);
        });
    }).on("error", function (err) {
        console.log(err.stack)
    });
}


M.require=function(url){
        let ht="http";
        if(url.startsWith("https")){
            ht="https";
        }
        let promise=new Promise(function (reslove, reject) {
            require(ht).get(url,function(req,res){
                var d='';
                req.on('data',(data)=>{d+=data;});
                req.on('end',()=>{
                    let r="";
                    try{
                        r=JSON.parse(d)
                    }catch(e){
                        try{
                            r=eval(d); 
                        }catch(e1){
                            r=d;
                        } 
                    }
                    reslove(r);
                });
                req.on('error',(e)=>reject(e.message));
    })});
    return promise;
}

/**
 *下载图片
 */
M.download=function (url,file,callback) {
    var func=http;
    if(url.indexOf("https")>=0){
        func=https;
    }
    func.get(url, function (res) {
        res.setEncoding('binary');//转成二进制
        var content = '';
        res.on('data', function (data) {
            content+=data;
        }).on('end', function () {
            if(callback)callback();
            fs.writeFile(file,content,'binary', function (err) {
                if (err) throw err;
            });
        });
    });
}
/**
 *下载所有图片
 */
M.downloadAllImg=function(url,file,callback){
    var urlObj=url_module.parse(url)
    var options={
        hostname:urlObj.hostname,
    }
    var func=http;
    if(url.indexOf("https")>=0){
        func=https;
    }
    var req = func.request(options, function (res) {
        res.on('data', function (data) {
            //Buffer
            var string =  data.toString() ;
            var rule = /https?:\/\/.[^"]+\.(png|jpg|gif|jpeg)/gi;
            var ary = string.match(rule);    //拿到所有jpg结尾的链接集合
            if(callback)callback(ary);
            var x = 0;
            for(var i in ary) {
                M.download(ary[i],file+(x++)+ ary[i].substr(ary[i].lastIndexOf(".")));
            }
        });
    });
    req.end();
}

/**
 *打印结果前钩子
 */
M.beforeLogData=function (res,desc) {
    console.log("-----"+desc+"-----"+res.req.path+"-------------");
}


/**
 *打印结果后钩子
 */
M.afterLogData=function () {

    console.log("--END")
}

/**
 *简化get请求
 */
M.get0=function(url,data){
    if(Array.isArray(url)){
        for(let i=0;i<url.length;i++){
            M.get(
                M.host+url[i],
                function (data,res) {
                    console.log("---------"+res.req.path+"------------");
                    console.log(data);
                },data
            );
        }
    }else{
        M.get(
            M.host+url,
            function (data) {
                console.log(data);
            },data
        );
    }

}

/**
 *简化post请求
 */
M.post0=function(url,data){
    M.post(
        M.host+url,
        function (data) {
            console.log(data);
        },data
    );
}

M.postJson0=function(url,data){
    M.postJson(
        M.host+url,
        function (data) {
            console.log(data);
        },data
    );
}

M.template=function(str){
    return eval("`"+str+"`");
}



/**
 * ----------------------客户端END--------------------------------------------
 */





/**
 * ----------------------数据持久化读写START--------------------------------------------
 */

/**
 *递归创建文件夹
 */
M.mkdir=function(dirpath, dirname) {
    //判断是否是第一次调用
    if (typeof dirname === "undefined") {

        if(dirpath.indexOf(".")>0){
            dirpath=path.dirname(dirpath);
        }
        if (fs.existsSync(dirpath)) {
            return;
        } else {
            M.mkdir(dirpath, path.dirname(dirpath));
        }
    } else {
        //判断第二个参数是否正常，避免调用时传入错误参数
        if (dirname !== path.dirname(dirpath)) {
            M.mkdir(dirpath);
            return;
        }
        if (fs.existsSync(dirname)) {
            fs.mkdirSync(dirpath)
        } else {
            M.mkdir(dirname, path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}
/**
 *文件夹拷贝
 */
M.copyDir=function(src,dst){
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function(path){
        var _src=src+'/'+path;
        var _dst=dst+'/'+path;
        fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
            if(err)throw err;
            if(stats.isFile()){ //如果是个文件则拷贝
                let  readable=fs.createReadStream(_src);//创建读取流
                let  writable=fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            }else if(stats.isDirectory()){ //是目录则 递归
                privateObj.checkDirectory(_src,_dst,M.copyDir);
            }
        });
    });
}

privateObj.checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
        if(err){
            fs.mkdirSync(dst);
            callback(src,dst);
        }else{
            callback(src,dst);
        }
    });
};

M.readFile=function(file){
    if(fs.existsSync(file)){
        return fs.readFileSync(file,"utf-8");
    }else {
        return;
    }
}
M.writeFile=function(file,str){
    fs.writeFileSync(file, str);
}
M.appendFile=function(file,str){
    fs.appendFileSync(file, str);
}
/**
  文件型数据库第一层封装
 */
M.getObjByFile=function(file){
    data=M.readFile(file)||"[]"
    var obj=JSON.parse(data.toString());
    return obj;
}
M.writeObjToFile=function(file,obj){
    M.writeFile(file, JSON.stringify(obj));
}

M.addObjToFile=function(file,obj){
    try {
        var d=M.getObjByFile(file);
        M.writeObjToFile(file,[...d,obj]);
    }catch (e) {
        M.writeObjToFile(file,[obj]);
    }
}
M.deleteObjByIdFile=function(file,id){
    let ids=[];
    if(!Array.isArray(id)){
        ids.push(id)
    }else {
        ids=id;
    }
    var d=M.getObjByFile(file);
    var d1=M.getObjByFile(file);
    let d_num=0;
    for(let i=0;i<d1.length;i++){
        if(ids.indexOf(d1[i].id)>=0){
            d.splice(i-d_num,1);
            d_num++;
            if(ids.length==1)break;
        }
    }
    M.writeObjToFile(file,d);
}

M.deleteObjByPropFile=function(file,o){
    let o_key=Object.keys(o)[0];
    let o_val=o[o_key]
    var d=M.getObjByFile(file);
    var d1=M.getObjByFile(file);
    let d_num=0;
    for(let i=0;i<d1.length;i++){
        if(d1[i][o_key]==o_val){
            d.splice(i-d_num,1);
            d_num++;
        }
    }
    M.writeObjToFile(file,d);
}

M.updateObjByIdFile=function(file,obj){
    var d=M.getObjByFile(file);
    for(let i=0;i<d.length;i++){
        if(d[i].id==obj.id){
            d.splice(i,1,obj);
            break;
        }
    }
    M.writeObjToFile(file,d);
}
M.getObjByIdFile=function(file,id){
    var d=M.getObjByFile(file);
    for(let i=0;i<d.length;i++){
        if(d[i].id==id){
           return d[i];
        }
    }
}
M.listAllObjByPropFile=function(file,o){
    let r_list=[];
    let o_key=Object.keys(o)[0];
    let o_val=o[o_key]
    var d=M.getObjByFile(file);
    for(let i=0;i<d.length;i++){
        if(d[i][o_key]==o_val){
            r_list.push(d[i]);
        }
    }
    return r_list;
}
/**
 * 文件型数据库第二层封装
 */
M.add=function (obj) {
    obj.id=M.randomStr();
    M.addObjToFile(M.database_path,obj);
    return obj;
}
M.update=function (obj) {
    M.updateObjByIdFile(M.database_path,obj);
}
M.deleteById=function (id) {
    M.deleteObjByIdFile(M.database_path,id);
}
M.deleteAll=function (o) {
    if(o){
        M.deleteObjByPropFile(M.database_path,o);
    }else {
        M.writeObjToFile(M.database_path,[]);
    }
}
M.deleteByProp=function (o) {
    M.deleteObjByPropFile(M.database_path,o);
}
M.getById=function (id) {
     return M.getObjByIdFile(M.database_path,id);
}
M.listAll=function (o) {
    if(o){
        return M.listAllObjByPropFile(M.database_path,o);
    }else {
        return M.getObjByFile(M.database_path);
    }
}
M.listByProp=function (o) {
    return M.listAllObjByPropFile(M.database_path,o);
}
M.listByPage=function (startPage,limit,caseObj) {
    if(startPage<=0)startPage=1;
    let rows;
    if(caseObj){
        rows=M.listByProp(caseObj);
    }else {
        rows= M.listAll();
    }
    let total=rows.length;
    rows=rows.splice((startPage-1)*limit,limit)
    return {rows,total}
}
/**
 * 全局作用域
 * @param k
 * @param v
 */
M.setAttribute=function (k,v) {
    let a={}
    a[k]=v;
    a=JSON.stringify(a)
    a=JSON.parse(a);
    let preObj;
    try{
        preObj=M.getObjByFile(M.map_path);
        if(Array.isArray(preObj))preObj={};
    }catch(e){
        preObj={};
    }

    M.writeObjToFile(M.map_path,Object.assign(preObj,a));
}

M.getAttribute=function (k) {
    return M.getObjByFile(M.map_path)[k];
}
/**
 *逐行读取文件
 */
M.readLine=function(file, callback) {
    var remaining = '';
    var input = fs.createReadStream(file);
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            callback(line);
            index = remaining.indexOf('\n');
        }
    });
    input.on('end', function() {
        if (remaining.length > 0) {
            callback(remaining);
        }
    });
}


M.readCsvLine=function(file,callback){
    M.readLine(file,function (line) {
        callback(line.replace("\r","").split(/(?<!\"[^,]+),(?![^,]+\")/));
    })
}



M.log=function(...params){
    if(Array.isArray(params[0]) ||typeof params[0] == 'object' ){
        params=[JSON.stringify(params[0])]
    }
    if(M.log_file_enable || M.log_console_enable){
        let r="";
        if(M.log_display_time){
            r=r+new Date().toLocaleString()+" ";
        }
        for (i in params){
            r=r+params[i]+" ";
        }
        if(M.log_console_enable)console.log(r);
        r=r+"\n";
        if(M.log_file_enable)M.appendFile(M.log_path,r);
    }
}

/**
 * ----------------------Sql CRUD  START-------------------------------------------
 */
M.getInsertObjSql=function(tableName,obj){
    var fields="(";
    var values="(";
    for(let field in obj){
        fields+=field+",";
        values+=`'${obj[field]}'`+",";
    }
    fields=fields.substr(0,fields.lastIndexOf(","));
    values=values.substr(0,values.lastIndexOf(","));
    fields+=")";
    values+=")";
    let sql = "insert into "+tableName+fields+" values "+values;
    return sql;
}

M.getDeleteObjSql=function(tableName,obj){
    var fields=[];
    for(let field in obj){
        fields.push(field);
    }
    let sql=`delete from ${tableName} where ${fields.map(u=> u+"='"+obj[u]+"'")}`;
    sql=sql.replace(/,/g," and ")
    return sql;
}

M.getUpdateObjSql=function(tableName,obj,caseObj){
    var fields=[];
    for(let field in obj){
        if(field !="id")
            fields.push(field);
    }
    let sql="";
    if(!caseObj){
        sql=`update ${tableName} set ${fields.map(u =>u + "='" + obj[u]+ "'")} where id=${obj.id}`;
    }else{
        var caseObjfields=[];
        for(let caseObjfield in caseObj){
            caseObjfields.push(caseObjfield)
        }
        sql=`update ${tableName} set ${fields.map(u =>u + "='" + obj[u]+ "'")} where ${caseObjfields.map(u=> u+"='"+caseObj[u]+"'").join(" and ")}`;
    }

    return sql;
}


M.getSelectObjSql=function(tableName,obj){
    var fields=[];
    for(let field in obj){
        fields.push(field);
    }
    let sql = `select * from ${tableName} where ${fields.map(u=> u+"='"+obj[u]+"'")}`;
    sql=sql.replace(/,/g," and ")
    return sql;
}

/**
 * ----------------------Sql CRUD  START-------------------------------------------
 */



/**
 * ----------------------数据持久化读写END--------------------------------------------
 */



/**
 * ----------------------服务器端START--------------------------------------------
 */
/**
 *封装返回数据
 */
M.result=function(data,success){
    var r={};
    if(success==false){
        r.code=3003;
        r.message="操作失败";
        r.success=success;
    }else{
        r.code=3002;
        r.message="操作成功"
        r.success=true;
    }
    try {
        var obj=JSON.parse(data);
        if(typeof obj == 'object' && obj ){
            r.data=obj;
        }else{
            r.data=data;
        }
    } catch(e) {
        r.data=data;
    }
    return JSON.stringify(r);
}
/**
 *获取下划线式的对象
 */
M.getUnderlineObj=function (obj) {
    var result={};
    for(let field in obj){
        result[field.humpToUnderline()]=obj[field]
    }
    return result;
}

/**
 *获取驼峰式的对象
 */
M.getHumpObj=function (obj) {
    var result={};
    for(let field in obj){
        result[field.underlineToHump()]=obj[field]
    }
    return result;
}

M.randomStr=function () {
   return  (Math.random().toString(36)+new Date().getTime()).slice(2);
}

/**
 * 异常处理钩子
 * @param e
 */
M.err=function(e){
    if(e){
        console.log(e.message);
        return false;
    }
    return true;
}


M.server=function(){
    var G=this;   /*全局变量,也就是M*/
    //静态资源路径
    this._views="static";
    //key为去除rest参数的url,val为原始url
    this._rest={};
    //处理get和post请求
    this._get={};
    this._post={};
    this._mapping={};
    //用于模拟过滤器
    this._begin=function(){}
    //服务器响应后的钩子函数
    this._end=function(){}
    //如果实现此函数,则只能有一个此服务
    this._server=function (){};
    var app=function(req,res){
        //是否已经发送过了
        res.alreadySend=false;
        //是否为静态资源请求
        req.isStaticRequest=function(){
                if(req.url.indexOf("?")>0){
                    return  privateObj.staticMime[path.extname(req.url.substr(0,req.url.indexOf("?")))];
                }else{
                    return  privateObj.staticMime[path.extname(req.url)];
                }
         }
        //是否为rest请求
        req.isGetRestRequest=function(){
            var method=req.method.toLowerCase();
            if(Object.keys(G._rest).length==0) return false;
            
            var isRest=false;
            for(let i=0;i<Object.keys(G._rest).length;i++){
                if(pathname.startsWith(Object.keys(G._rest)[i])){
                    isRest=true;
                    break;
                }
            }
            return method=="get" && isRest;
        }

        req.ip=req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        //请求cookies封装
        req.cookies=querystring.parse(req.headers['cookie'],"; ");
        //设置浏览器cookies
        res.cookie=function(key,value,cfg){
            let o={}
            o[key]=value;
            let r_cookie= Object.assign(o,cfg)
            res.setHeader("Set-Cookie", querystring.stringify(r_cookie," ;"));
        }
        if(req.session){
            Object.defineProperty(req,'session',{
                set:function(o){
                    let sessionValue=req.cookies.sessionid||M.randomStr();
                    res.cookie("sessionid",sessionValue)
                    M.sessions[sessionValue]=o;
                },
                get:function(){
                    return M.sessions[req.cookies.sessionid]
                }
            })
        }
        //扩充res一个send方法
        res.send=function(data){
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.setHeader("X-Powered-By",' 3.2.1')
            res.setHeader("Content-Type", "application/json;charset=utf-8");
            res.end(data);
            G._end(data);
            res.alreadySend=true;
        }
        try {
                //获取路由
                var pathname=url_module.parse(req.url).pathname;
                if(!pathname.endsWith('/')){
                    pathname=pathname+'/';
                }
               // pathname.startsWith("/usr/")
                //获取请求的方式 get  post
                var method=req.method.toLowerCase();

                if(req.isStaticRequest()){
                    G._begin(req,res);
                    if(!res.alreadySend)privateObj.staticServer(req,res,G["_views"]);

                }else{

                    if((method=="get" || method=="post") && (G['_'+method][pathname] || req.isGetRestRequest())){
                        if(method=='post'){ /*执行post请求*/
                            var postStr='';
                            req.on('data',function(chunk){
                                postStr+=chunk;
                            })
                            req.on('end',function(err,chunk) {
                                req.body=postStr;  /*表示拿到post的值*/
                                postData="";
                                try {
                                    postData = url_module.parse("?"+req.body,true).query;
                                } catch (e) {
                                    try {
                                        postData = JSON.parse(req.body);
                                    }catch (e) {
                                    }
                                }
                                req.params = Object.assign(postData,url_module.parse(req.url,true).query) ;
                                G._begin(req,res);
                                if(!res.alreadySend)G['_'+method][pathname](req,res); /*执行方法*/
                            })
                        }else if(method=="get"){ /*执行get请求*/

                            var mapingPath="";
                            //如果是rest风格的get请求,为其封装请求参数
                            if(req.isGetRestRequest()){
                                for(let i=0;i< Object.keys(G._rest).length;i++){
                                    if(pathname.startsWith(Object.keys(G._rest)[i])){
                                        pathname=Object.keys(G._rest)[i];
                                        mapingPath=G._rest[pathname];
                                    }
                                }
                                var realPathName=url_module.parse(req.url).pathname;
                                if(!realPathName.endsWith('/')){
                                    realPathName=realPathName+'/';
                                }
                                let s1=realPathName;
                                let s2=mapingPath;
                                s1= s1.substring(s2.indexOf(":")-1,s1.length-1).split("/").slice(1)
                                s2= s2.substring(s2.indexOf(":")-1,s2.length-1).split("/:").slice(1)
                                req.params={};
                                for(let i=0;i<s2.length;i++){req.params[s2[i]]=s1[i];}
                            }else{
                                req.params=url_module.parse(req.url,true).query;
                            }
                            G._begin(req,res);
                            if(!res.alreadySend)G['_'+method][pathname](req,res); /*执行方法*/
                        }
                    }else{
                        if(G['_mapping'][pathname]){
                            G._begin(req,res);
                            if(!res.alreadySend)G['_mapping'][pathname](req,res); /*执行方法*/
                        }else{
                            G._begin(req,res);
                            if(!res.alreadySend)G._server(req,res);
                            if(!res.alreadySend)res.end('no router');
                        }
                    }
                }
            }catch(e) {
                 console.error(e);
                 if(!res.alreadySend){
                     res.writeHead(500,{"Content-Type":"text/html;charset='utf-8'"});
                     res.write("服务器内部错误");
                     res.end(); /*结束响应*/
                 }
            }
     }


    app.begin=function(callback){
        G._begin=callback;
    }

    app.end=function(callback){
        G._end=callback;
    }
    /**
     *唯一服务的方法
     */
    app.server=function(callback){
        G._server=callback;
    }
    /**
     * 注册get请求
     */
    app.get=function(url,callback){
        url=M.formatUrl(url);
        var realUrl=url;
        if(url.indexOf(":")>0){
            url=url.substr(0,url.indexOf(":"));
            G._rest[url]=realUrl;
        }

        G._get[url]=callback;
    }

    /**
     *注册post请求
     */
    app.post=function(url,callback){
        url=M.formatUrl(url);
        G._post[url]=callback;
    }

    M.formatUrl=function (url) {
        if(!url.endsWith('/')){
            url=url+'/';
        }
        if(!url.startsWith('/')){
            url='/'+url;
        }
        return url;
    }
    /**
     *转发
     */
    app.dispatch=function(url,req,res){
        req.url=url;
        app(req,res);
    }

    /**
     *重定向
     */
    app.redirect=function(url,req,res){
        res.writeHead(302, {'Content-Type': 'text/html; charset=utf-8','Location':url});
        res.end();
    }

    /**
     *注册任意请求方法的请求
     */
    app.mapping=function(url,callback){
        url=M.formatUrl(url);
        G._mapping[url]=callback;
    }

    app.set=function(k,v){
        G["_"+k]=v;
    }

    app.listen=function (port){
        http.createServer(app).listen(port);
        console.log("listen on port:"+port);
        return app;
    }

    return app;
}

privateObj.staticServer=function (req,res,staticPath) {
    var pathname=url_module.parse(req.url).pathname;   /*获取url的值*/
    if(pathname=='/'){
        pathname='/index.html'; /*默认加载的首页*/
    }
    //获取文件的后缀名
    var extname=path.extname(pathname);
    if(pathname!='/favicon.ico'){  /*过滤请求favicon.ico*/
        //文件操作获取 static下面的index.html
        fs.readFile(staticPath+'/'+pathname,function(err,data){
            if(err){  /*么有这个文件*/
                res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
                res.write(`<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <title>404</title>
                                    <style type="text/css">
                                        h1{
                                            font-size: 60px;
                                            color:blue;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <h1>404</h1>
                                    <p>对不起，没有这个页面</p>
                                </body>
                                </html>`
                );
                res.end(); /*结束响应*/
            }else{ /*返回这个文件*/
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
                res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
                res.setHeader("X-Powered-By",' 3.2.1')
                res.writeHead(200,{"Content-Type":""+(privateObj.staticMime[extname]||'text/html')+";charset='utf-8'",});
                res.write(data);
                res.end(); /*结束响应*/
            }
        })
    }else{
        res.writeHead(302, {'Content-Type': 'image/x-icon; charset=utf-8','Location':"https://q.qlogo.cn/g?b=qq&nk=934031452&s=100"});
        res.end();
    }
}

/*SSE SERVER */
M.sseServer=function(){
    let app=function(req,res){
        console.log("SSEServer connect success")
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        event.removeAllListeners("sseSendMsg")
        event.on('sseSendMsg', function(r){
            res.write('event: slide\n'); // 事件类型
            res.write(`id: ${+new Date()}\n`); // 消息 ID
            res.write(`data: ${r}\n`); // 消息数据
            res.write('retry: 10000\n'); // 重连时间
            res.write('\n\n'); // 消息结束
        })
        // 发送注释保持长连接
        setInterval(() => {
            res.write(': \n\n');
        }, 12000);

    };
    app.send=function(msg){
        event.emit('sseSendMsg',msg);
    }
    app.listen=function (port){
        let serverObj=http.createServer(app).listen(port);
        app.serverObj=serverObj;
        console.log("SSE Server listen on port:"+port);
        return app;
    }
    return app;
}

/**
 * ----------------------服务器端END--------------------------------------------
 */


/**
 * ----------------------其他工具函数START--------------------------------------------
 */
M.exec=function(comand){
    var promise = new Promise(function(reslove,reject){
        child_process.exec(comand,function(err, stdout, stderr){
            if(err || stderr)console.error(err,stderr);
            reslove(stdout);
        });

    })
    return promise;
}

M.getMyIp=function(){
  var interfaces = require('os').networkInterfaces();
  for(var devName in interfaces){
      var iface = interfaces[devName];
      for(var i=0;i<iface.length;i++){
          var alias = iface[i];
          if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
              return alias.address;
          }
      }
  }
}

/**
 *对象转JSON key不用引号括起来,因兼容性不好,所以去掉
*/

/**
M.JSOM_Stringify=function(obj){
    return JSON.stringify(obj).replace(/"(\w+)"(\s*:\s*)/gis, '$1$2');
}
 */

M.sleep=function(numberMillis){
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
/**
 * ----------------------其他工具函数END--------------------------------------------
 */

/**
 * 静态资源对应表
 */
privateObj.staticMime={ ".323":"text/h323" ,
    ".3gp":"video/3gpp" ,
    ".aab":"application/x-authoware-bin" ,
    ".aam":"application/x-authoware-map" ,
    ".aas":"application/x-authoware-seg" ,
    ".acx":"application/internet-property-stream" ,
    ".ai":"application/postscript" ,
    ".aif":"audio/x-aiff" ,
    ".aifc":"audio/x-aiff" ,
    ".aiff":"audio/x-aiff" ,
    ".als":"audio/X-Alpha5" ,
    ".amc":"application/x-mpeg" ,
    ".ani":"application/octet-stream" ,
    ".apk":"application/vnd.android.package-archive" ,
    ".asc":"text/plain" ,
    ".asd":"application/astound" ,
    ".asf":"video/x-ms-asf" ,
    ".asn":"application/astound" ,
    ".asp":"application/x-asap" ,
    ".asr":"video/x-ms-asf" ,
    ".asx":"video/x-ms-asf" ,
    ".au":"audio/basic" ,
    ".avb":"application/octet-stream" ,
    ".avi":"video/x-msvideo" ,
    ".awb":"audio/amr-wb" ,
    ".axs":"application/olescript" ,
    ".bas":"text/plain" ,
    ".bcpio":"application/x-bcpio" ,
    ".bin ":"application/octet-stream" ,
    ".bld":"application/bld" ,
    ".bld2":"application/bld2" ,
    ".bmp":"image/bmp" ,
    ".bpk":"application/octet-stream" ,
    ".bz2":"application/x-bzip2" ,
    ".c":"text/plain" ,
    ".cal":"image/x-cals" ,
    ".cat":"application/vnd.ms-pkiseccat" ,
    ".ccn":"application/x-cnc" ,
    ".cco":"application/x-cocoa" ,
    ".cdf":"application/x-cdf" ,
    ".cer":"application/x-x509-ca-cert" ,
    ".cgi":"magnus-internal/cgi" ,
    ".chat":"application/x-chat" ,
    ".class":"application/octet-stream" ,
    ".clp":"application/x-msclip" ,
    ".cmx":"image/x-cmx" ,
    ".co":"application/x-cult3d-object" ,
    ".cod":"image/cis-cod" ,
    ".conf":"text/plain" ,
    ".cpio":"application/x-cpio" ,
    ".cpp":"text/plain" ,
    ".cpt":"application/mac-compactpro" ,
    ".crd":"application/x-mscardfile" ,
    ".crl":"application/pkix-crl" ,
    ".crt":"application/x-x509-ca-cert" ,
    ".csh":"application/x-csh" ,
    ".csm":"chemical/x-csml" ,
    ".csml":"chemical/x-csml" ,
    ".css":"text/css" ,
    ".cur":"application/octet-stream" ,
    ".dcm":"x-lml/x-evm" ,
    ".dcr":"application/x-director" ,
    ".dcx":"image/x-dcx" ,
    ".der":"application/x-x509-ca-cert" ,
    ".dhtml":"text/html" ,
    ".dir":"application/x-director" ,
    ".dll":"application/x-msdownload" ,
    ".dmg":"application/octet-stream" ,
    ".dms":"application/octet-stream" ,
    ".doc":"application/msword" ,
    ".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ,
    ".dot":"application/msword" ,
    ".dvi":"application/x-dvi" ,
    ".dwf":"drawing/x-dwf" ,
    ".dwg":"application/x-autocad" ,
    ".dxf":"application/x-autocad" ,
    ".dxr":"application/x-director" ,
    ".ebk":"application/x-expandedbook" ,
    ".emb":"chemical/x-embl-dl-nucleotide" ,
    ".embl":"chemical/x-embl-dl-nucleotide" ,
    ".eps":"application/postscript" ,
    ".epub":"application/epub+zip" ,
    ".eri":"image/x-eri" ,
    ".es":"audio/echospeech" ,
    ".esl":"audio/echospeech" ,
    ".etc":"application/x-earthtime" ,
    ".etx":"text/x-setext" ,
    ".evm":"x-lml/x-evm" ,
    ".evy":"application/envoy" ,
    ".exe":"application/octet-stream" ,
    ".fh4":"image/x-freehand" ,
    ".fh5":"image/x-freehand" ,
    ".fhc":"image/x-freehand" ,
    ".fif":"application/fractals" ,
    ".flr":"x-world/x-vrml" ,
    ".flv":"flv-application/octet-stream" ,
    ".fm":"application/x-maker" ,
    ".fpx":"image/x-fpx" ,
    ".fvi":"video/isivideo" ,
    ".gau":"chemical/x-gaussian-input" ,
    ".gca":"application/x-gca-compressed" ,
    ".gdb":"x-lml/x-gdb" ,
    ".gif":"image/gif" ,
    ".gps":"application/x-gps" ,
    ".gtar":"application/x-gtar" ,
    ".gz":"application/x-gzip" ,
    ".h":"text/plain" ,
    ".hdf":"application/x-hdf" ,
    ".hdm":"text/x-hdml" ,
    ".hdml":"text/x-hdml" ,
    ".hlp":"application/winhlp" ,
    ".hqx":"application/mac-binhex40" ,
    ".hta":"application/hta" ,
    ".htc":"text/x-component" ,
    ".htm":"text/html" ,
    ".html":"text/html" ,
    ".hts":"text/html" ,
    ".htt":"text/webviewhtml" ,
    ".ice":"x-conference/x-cooltalk" ,
    ".ico":"image/x-icon" ,
    ".ief":"image/ief" ,
    ".ifm":"image/gif" ,
    ".ifs":"image/ifs" ,
    ".iii":"application/x-iphone" ,
    ".imy":"audio/melody" ,
    ".ins":"application/x-internet-signup" ,
    ".ips":"application/x-ipscript" ,
    ".ipx":"application/x-ipix" ,
    ".isp":"application/x-internet-signup" ,
    ".it":"audio/x-mod" ,
    ".itz":"audio/x-mod" ,
    ".ivr":"i-world/i-vrml" ,
    ".j2k":"image/j2k" ,
    ".jad":"text/vnd.sun.j2me.app-descriptor" ,
    ".jam":"application/x-jam" ,
    ".jar":"application/java-archive" ,
    ".java":"text/plain" ,
    ".jfif":"image/pipeg" ,
    ".jnlp":"application/x-java-jnlp-file" ,
    ".jpe":"image/jpeg" ,
    ".jpeg":"image/jpeg" ,
    ".jpg":"image/jpeg" ,
    ".jpz":"image/jpeg" ,
    ".js":"application/javascript" ,
    ".jsx":"application/octet-stream" ,
    ".jwc":"application/jwc" ,
    ".kjx":"application/x-kjx" ,
    ".lak":"x-lml/x-lak" ,
    ".latex":"application/x-latex" ,
    ".lcc":"application/fastman" ,
    ".lcl":"application/x-digitalloca" ,
    ".lcr":"application/x-digitalloca" ,
    ".lgh":"application/lgh" ,
    ".lha":"application/octet-stream" ,
    ".lml":"x-lml/x-lml" ,
    ".lmlpack":"x-lml/x-lmlpack" ,
    ".log":"text/plain" ,
    ".lsf":"video/x-la-asf" ,
    ".lsx":"video/x-la-asf" ,
    ".lzh":"application/octet-stream" ,
    ".m13":"application/x-msmediaview" ,
    ".m14":"application/x-msmediaview" ,
    ".m15":"audio/x-mod" ,
    ".m3u":"audio/x-mpegurl" ,
    ".m3url":"audio/x-mpegurl" ,
    ".m4a":"audio/mp4a-latm" ,
    ".m4b":"audio/mp4a-latm" ,
    ".m4p":"audio/mp4a-latm" ,
    ".m4u":"video/vnd.mpegurl" ,
    ".m4v":"video/x-m4v" ,
    ".ma1":"audio/ma1" ,
    ".ma2":"audio/ma2" ,
    ".ma3":"audio/ma3" ,
    ".ma5":"audio/ma5" ,
    ".man":"application/x-troff-man" ,
    ".map":"magnus-internal/imagemap" ,
    ".mbd":"application/mbedlet" ,
    ".mct":"application/x-mascot" ,
    ".mdb":"application/x-msaccess" ,
    ".mdz":"audio/x-mod" ,
    ".me":"application/x-troff-me" ,
    ".mel":"text/x-vmel" ,
    ".mht":"message/rfc822" ,
    ".mhtml":"message/rfc822" ,
    ".mi":"application/x-mif" ,
    ".mid":"audio/mid" ,
    ".midi":"audio/midi" ,
    ".mif":"application/x-mif" ,
    ".mil":"image/x-cals" ,
    ".mio":"audio/x-mio" ,
    ".mmf":"application/x-skt-lbs" ,
    ".mng":"video/x-mng" ,
    ".mny":"application/x-msmoney" ,
    ".moc":"application/x-mocha" ,
    ".mocha":"application/x-mocha" ,
    ".mod":"audio/x-mod" ,
    ".mof":"application/x-yumekara" ,
    ".mol":"chemical/x-mdl-molfile" ,
    ".mop":"chemical/x-mopac-input" ,
    ".mov":"video/quicktime" ,
    ".movie":"video/x-sgi-movie" ,
    ".mp2":"video/mpeg" ,
    ".mp3":"audio/mpeg" ,
    ".mp4":"video/mp4" ,
    ".mpa":"video/mpeg" ,
    ".mpc":"application/vnd.mpohun.certificate" ,
    ".mpe":"video/mpeg" ,
    ".mpeg":"video/mpeg" ,
    ".mpg":"video/mpeg" ,
    ".mpg4":"video/mp4" ,
    ".mpga":"audio/mpeg" ,
    ".mpn":"application/vnd.mophun.application" ,
    ".mpp":"application/vnd.ms-project" ,
    ".mps":"application/x-mapserver" ,
    ".mpv2":"video/mpeg" ,
    ".mrl":"text/x-mrml" ,
    ".mrm":"application/x-mrm" ,
    ".ms":"application/x-troff-ms" ,
    ".msg":"application/vnd.ms-outlook" ,
    ".mts":"application/metastream" ,
    ".mtx":"application/metastream" ,
    ".mtz":"application/metastream" ,
    ".mvb":"application/x-msmediaview" ,
    ".mzv":"application/metastream" ,
    ".nar":"application/zip" ,
    ".nbmp":"image/nbmp" ,
    ".nc":"application/x-netcdf" ,
    ".ndb":"x-lml/x-ndb" ,
    ".ndwn":"application/ndwn" ,
    ".nif":"application/x-nif" ,
    ".nmz":"application/x-scream" ,
    ".nokia-op-logo":"image/vnd.nok-oplogo-color" ,
    ".npx":"application/x-netfpx" ,
    ".nsnd":"audio/nsnd" ,
    ".nva":"application/x-neva1" ,
    ".nws":"message/rfc822" ,
    ".oda":"application/oda" ,
    ".ogg":"audio/ogg" ,
    ".oom":"application/x-AtlasMate-Plugin" ,
    ".p10":"application/pkcs10" ,
    ".p12":"application/x-pkcs12" ,
    ".p7b":"application/x-pkcs7-certificates" ,
    ".p7c":"application/x-pkcs7-mime" ,
    ".p7m":"application/x-pkcs7-mime" ,
    ".p7r":"application/x-pkcs7-certreqresp" ,
    ".p7s":"application/x-pkcs7-signature" ,
    ".pac":"audio/x-pac" ,
    ".pae":"audio/x-epac" ,
    ".pan":"application/x-pan" ,
    ".pbm":"image/x-portable-bitmap" ,
    ".pcx":"image/x-pcx" ,
    ".pda":"image/x-pda" ,
    ".pdb":"chemical/x-pdb" ,
    ".pdf":"application/pdf" ,
    ".pfr":"application/font-tdpfr" ,
    ".pfx":"application/x-pkcs12" ,
    ".pgm":"image/x-portable-graymap" ,
    ".pict":"image/x-pict" ,
    ".pko":"application/ynd.ms-pkipko" ,
    ".pm":"application/x-perl" ,
    ".pma":"application/x-perfmon" ,
    ".pmc":"application/x-perfmon" ,
    ".pmd":"application/x-pmd" ,
    ".pml":"application/x-perfmon" ,
    ".pmr":"application/x-perfmon" ,
    ".pmw":"application/x-perfmon" ,
    ".png":"image/png" ,
    ".pnm":"image/x-portable-anymap" ,
    ".pnz":"image/png" ,
    ".pot,":"application/vnd.ms-powerpoint" ,
    ".ppm":"image/x-portable-pixmap" ,
    ".pps":"application/vnd.ms-powerpoint" ,
    ".ppt":"application/vnd.ms-powerpoint" ,
    ".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation" ,
    ".pqf":"application/x-cprplayer" ,
    ".pqi":"application/cprplayer" ,
    ".prc":"application/x-prc" ,
    ".prf":"application/pics-rules" ,
    ".prop":"text/plain" ,
    ".proxy":"application/x-ns-proxy-autoconfig" ,
    ".ps":"application/postscript" ,
    ".ptlk":"application/listenup" ,
    ".pub":"application/x-mspublisher" ,
    ".pvx":"video/x-pv-pvx" ,
    ".qcp":"audio/vnd.qcelp" ,
    ".qt":"video/quicktime" ,
    ".qti":"image/x-quicktime" ,
    ".qtif":"image/x-quicktime" ,
    ".r3t":"text/vnd.rn-realtext3d" ,
    ".ra":"audio/x-pn-realaudio" ,
    ".ram":"audio/x-pn-realaudio" ,
    ".rar":"application/octet-stream" ,
    ".ras":"image/x-cmu-raster" ,
    ".rc":"text/plain" ,
    ".rdf":"application/rdf+xml" ,
    ".rf":"image/vnd.rn-realflash" ,
    ".rgb":"image/x-rgb" ,
    ".rlf":"application/x-richlink" ,
    ".rm":"audio/x-pn-realaudio" ,
    ".rmf":"audio/x-rmf" ,
    ".rmi":"audio/mid" ,
    ".rmm":"audio/x-pn-realaudio" ,
    ".rmvb":"audio/x-pn-realaudio" ,
    ".rnx":"application/vnd.rn-realplayer" ,
    ".roff":"application/x-troff" ,
    ".rp":"image/vnd.rn-realpix" ,
    ".rpm":"audio/x-pn-realaudio-plugin" ,
    ".rt":"text/vnd.rn-realtext" ,
    ".rte":"x-lml/x-gps" ,
    ".rtf":"application/rtf" ,
    ".rtg":"application/metastream" ,
    ".rtx":"text/richtext" ,
    ".rv":"video/vnd.rn-realvideo" ,
    ".rwc":"application/x-rogerwilco" ,
    ".s3m":"audio/x-mod" ,
    ".s3z":"audio/x-mod" ,
    ".sca":"application/x-supercard" ,
    ".scd":"application/x-msschedule" ,
    ".sct":"text/scriptlet" ,
    ".sdf":"application/e-score" ,
    ".sea":"application/x-stuffit" ,
    ".setpay":"application/set-payment-initiation" ,
    ".setreg":"application/set-registration-initiation" ,
    ".sgm":"text/x-sgml" ,
    ".sgml":"text/x-sgml" ,
    ".sh":"application/x-sh" ,
    ".shar":"application/x-shar" ,
    ".shtml":"magnus-internal/parsed-html" ,
    ".shw":"application/presentations" ,
    ".si6":"image/si6" ,
    ".si7":"image/vnd.stiwap.sis" ,
    ".si9":"image/vnd.lgtwap.sis" ,
    ".sis":"application/vnd.symbian.install" ,
    ".sit":"application/x-stuffit" ,
    ".skd":"application/x-Koan" ,
    ".skm":"application/x-Koan" ,
    ".skp":"application/x-Koan" ,
    ".skt":"application/x-Koan" ,
    ".slc":"application/x-salsa" ,
    ".smd":"audio/x-smd" ,
    ".smi":"application/smil" ,
    ".smil":"application/smil" ,
    ".smp":"application/studiom" ,
    ".smz":"audio/x-smd" ,
    ".snd":"audio/basic" ,
    ".spc":"application/x-pkcs7-certificates" ,
    ".spl":"application/futuresplash" ,
    ".spr":"application/x-sprite" ,
    ".sprite":"application/x-sprite" ,
    ".sdp":"application/sdp" ,
    ".spt":"application/x-spt" ,
    ".src":"application/x-wais-source" ,
    ".sst":"application/vnd.ms-pkicertstore" ,
    ".stk":"application/hyperstudio" ,
    ".stl":"application/vnd.ms-pkistl" ,
    ".stm":"text/html" ,
    ".svg":"image/svg+xml" ,
    ".sv4cpio":"application/x-sv4cpio" ,
    ".sv4crc":"application/x-sv4crc" ,
    ".svf":"image/vnd" ,
    ".svg":"image/svg+xml" ,
    ".svh":"image/svh" ,
    ".svr":"x-world/x-svr" ,
    ".swf":"application/x-shockwave-flash" ,
    ".swfl":"application/x-shockwave-flash" ,
    ".t":"application/x-troff" ,
    ".tad":"application/octet-stream" ,
    ".talk":"text/x-speech" ,
    ".tar":"application/x-tar" ,
    ".taz":"application/x-tar" ,
    ".tbp":"application/x-timbuktu" ,
    ".tbt":"application/x-timbuktu" ,
    ".tcl":"application/x-tcl" ,
    ".tex":"application/x-tex" ,
    ".texi":"application/x-texinfo" ,
    ".texinfo":"application/x-texinfo" ,
    ".tgz":"application/x-compressed" ,
    ".thm":"application/vnd.eri.thm" ,
    ".tif":"image/tiff" ,
    ".tiff":"image/tiff" ,
    ".tki":"application/x-tkined" ,
    ".tkined":"application/x-tkined" ,
    ".toc":"application/toc" ,
    ".toy":"image/toy" ,
    ".tr":"application/x-troff" ,
    ".trk":"x-lml/x-gps" ,
    ".trm":"application/x-msterminal" ,
    ".tsi":"audio/tsplayer" ,
    ".tsp":"application/dsptype" ,
    ".tsv":"text/tab-separated-values" ,
    ".ttf":"application/octet-stream" ,
    ".ttz":"application/t-time" ,
    ".txt":"text/plain" ,
    ".uls":"text/iuls" ,
    ".ult":"audio/x-mod" ,
    ".ustar":"application/x-ustar" ,
    ".uu":"application/x-uuencode" ,
    ".uue":"application/x-uuencode" ,
    ".vcd":"application/x-cdlink" ,
    ".vcf":"text/x-vcard" ,
    ".vdo":"video/vdo" ,
    ".vib":"audio/vib" ,
    ".viv":"video/vivo" ,
    ".vivo":"video/vivo" ,
    ".vmd":"application/vocaltec-media-desc" ,
    ".vmf":"application/vocaltec-media-file" ,
    ".vmi":"application/x-dreamcast-vms-info" ,
    ".vms":"application/x-dreamcast-vms" ,
    ".vox":"audio/voxware" ,
    ".vqe":"audio/x-twinvq-plugin" ,
    ".vqf":"audio/x-twinvq" ,
    ".vql":"audio/x-twinvq" ,
    ".vre":"x-world/x-vream" ,
    ".vrml":"x-world/x-vrml" ,
    ".vrt":"x-world/x-vrt" ,
    ".vrw":"x-world/x-vream" ,
    ".vts":"workbook/formulaone" ,
    ".wav":"audio/x-wav" ,
    ".wax":"audio/x-ms-wax" ,
    ".wbmp":"image/vnd.wap.wbmp" ,
    ".wcm":"application/vnd.ms-works" ,
    ".wdb":"application/vnd.ms-works" ,
    ".web":"application/vnd.xara" ,
    ".wi":"image/wavelet" ,
    ".wis":"application/x-InstallShield" ,
    ".wks":"application/vnd.ms-works" ,
    ".wm":"video/x-ms-wm" ,
    ".wma":"audio/x-ms-wma" ,
    ".wmd":"application/x-ms-wmd" ,
    ".wmf":"application/x-msmetafile" ,
    ".wml":"text/vnd.wap.wml" ,
    ".wmlc":"application/vnd.wap.wmlc" ,
    ".wmls":"text/vnd.wap.wmlscript" ,
    ".wmlsc":"application/vnd.wap.wmlscriptc" ,
    ".wmlscript":"text/vnd.wap.wmlscript" ,
    ".wmv":"audio/x-ms-wmv" ,
    ".wmx":"video/x-ms-wmx" ,
    ".wmz":"application/x-ms-wmz" ,
    ".wpng":"image/x-up-wpng" ,
    ".wps":"application/vnd.ms-works" ,
    ".wpt":"x-lml/x-gps" ,
    ".wri":"application/x-mswrite" ,
    ".wrl":"x-world/x-vrml" ,
    ".wrz":"x-world/x-vrml" ,
    ".ws":"text/vnd.wap.wmlscript" ,
    ".wsc":"application/vnd.wap.wmlscriptc" ,
    ".wv":"video/wavelet" ,
    ".wvx":"video/x-ms-wvx" ,
    ".wxl":"application/x-wxl" ,
    ".x-gzip":"application/x-gzip" ,
    ".xaf":"x-world/x-vrml" ,
    ".xar":"application/vnd.xara" ,
    ".xbm":"image/x-xbitmap" ,
    ".xdm":"application/x-xdma" ,
    ".xdma":"application/x-xdma" ,
    ".xdw":"application/vnd.fujixerox.docuworks" ,
    ".xht":"application/xhtml+xml" ,
    ".xhtm":"application/xhtml+xml" ,
    ".xhtml":"application/xhtml+xml" ,
    ".xla":"application/vnd.ms-excel" ,
    ".xlc":"application/vnd.ms-excel" ,
    ".xll":"application/x-excel" ,
    ".xlm":"application/vnd.ms-excel" ,
    ".xls":"application/vnd.ms-excel" ,
    ".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ,
    ".xlt":"application/vnd.ms-excel" ,
    ".xlw":"application/vnd.ms-excel" ,
    ".xm":"audio/x-mod" ,
    ".xml":"text/plain",
    ".xml":"application/xml",
    ".xmz":"audio/x-mod" ,
    ".xof":"x-world/x-vrml" ,
    ".xpi":"application/x-xpinstall" ,
    ".xpm":"image/x-xpixmap" ,
    ".xsit":"text/xml" ,
    ".xsl":"text/xml" ,
    ".xul":"text/xul" ,
    ".xwd":"image/x-xwindowdump" ,
    ".xyz":"chemical/x-pdb" ,
    ".yz1":"application/x-yz1" ,
    ".z":"application/x-compress" ,
    ".zac":"application/x-zaurus-zac" ,
    ".zip":"application/zip" ,
    ".json":"application/json"
}

M.test=function () {
    console.log(privateObj.staticMime[".jssson"]||"aa")
}

M.init=function(){
    /***
     * 下划线命名转为驼峰命名
     */
    String.prototype.underlineToHump=function(){
        var re=/_(\w)/g;
        str=this.replace(re,function($0,$1){
            return $1.toUpperCase();
        });
        return str;
    }

    /***
     * 驼峰命名转下划线
     */
    String.prototype.humpToUnderline=function(){
        var re=/_(\w)/g;
        str=this.replace(/([A-Z])/g,"_$1").toLowerCase();
        return str;
    }

    //首字母变大写
    String.prototype.firstChartoUpper=function() {
        return this.replace(/^([a-z])/g, function(word) {
            return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
        });
    }
    //首字母变小写
    String.prototype.firstChartoLower=function() {
        return this.replace(/^([A-Z])/g, function(word) {
            return word.replace(word.charAt(0), word.charAt(0).toLowerCase());
        });
    }
    //格式化日期
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }


}
M.init();

module.exports=M;



