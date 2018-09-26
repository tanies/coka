/**
 * Created by admin on 2018/9/1.
 */
exports.index =  async (ctx)=>{
   

   let data = await API.index('path',{})
   
    ctx.ajax(data)
    


}
