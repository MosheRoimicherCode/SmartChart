/*
    This function retur a SGWorld Sercive at Version 80
*/
function initSGWorld() {
    if(SGWorld != null) 
         return SGWorld;
      //Fusion -> use parent's instance (parent of IFrame)
     if (parent && parent.SGWorld) {
         SGWorld = parent.SGWorld;
          return SGWorld;
     }
        //Desktop -> create an instance
     try{
         SGWorld = new ActiveXObject("TerraExplorerX.SGWorld73");  //IE
     }
     catch(e){
        
        if(SGWorld == undefined)
        {
            SGWorld = __sgworld__.SetParamEx(9970, 80);           //EDGE
        }
     };
      return SGWorld;
 }