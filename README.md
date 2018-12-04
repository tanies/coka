# coka
大前端实践

#说明：coka为自己生成的npm包（目前已经在npmjs上发布初步版本，但不决定实时更新），
+      也是本项目开发的重点部分，如第一次clone，需要剪切node_module里coka然后，待npm i 后再复制到node——modules
      
      
#server端：
#一、启动
+    npm run start   开发默认端口是3400   端口配置在src/Config/app.js

#二、请求
+    除静态资源其他请求将进入Action的中，访问规则为：
+    1.url '/'默认访问index.js
+    2.其他url则为“相对于Action文件夹的路径+/+文件名称”，如访问的url为"/api"，则会执行api.js的逻辑，访问url为/test/index则为test文件夹下的+index.js文件
#三、Action的文件
+    needLogin：该接口是否需要登陆验证
+    requestHandler：对客服端请求的进行处理，
+        1.ctx为koa的上下文
+        2.ctx.render 渲染的是Views下对应名称的ejs模版
+        3.API.*(mod,param,replace)  //
+            为Apis文件下名称为*的文件，mod：该文件里config下对应的key，param：传给后端的参数，
+            replace：替换uri的模版
#四、Apis的文件
+    说明见Apis/index.js注释
    
    
    
