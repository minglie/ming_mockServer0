 M=require("ming_node");
var app=M.server();
app.listen(8888);

M.map_path="static/map_path.json";
M.log_path="static/log_path.log";
M.database_path="static/database_path.json";

app.get("/",async (req,res)=>{ 
   app.redirect("/index.html",req,res)
})
app.post("/_run_",async (req,res)=>{ 
    eval(req.params.fun)
    res.send(M.result("ok"))
})

app.get("/_clean_",async (req,res)=>{
     M.writeFile(M.map_path,"{}")
     M.writeFile(M.database_path,"{}")
     M.writeFile(M.log_path,"{}")     
    res.send(M.result("ok"))
})

app.get("/_ls",async (req,res)=>{
   let s= await M.exec("ls static")
    res.send(M.result(s.replace(/\n/g,"   ")))
})


