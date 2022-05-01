window.addEventListener("load",function(){
    document.getElementById("form_inreg").onsubmit=function(){
            if (document.getElementById("id-parl").value!=document.getElementById("id-rparl").value){
                alert("Nu ai reintrodus bine parola!");
                return false;
            }
            return true;
              
    }
});

// function required(inputtx) 
//    {
//      if (inputtx.value.length == 0)
//       { 
//          alert("message");  	
//          return false; 
//       }  	
//       return true; 
//     } 

// if (document.getElementById("id-user") != ""){
//     alert("Nu ai introdus username-ul!")
//     var conditie1 = false;
// }
// conditie1 = true;

// if (document.getElementById("id-nume") != ""){
//     alert("Nu ai introdus numele!")
//     var conditie2 = false;
// }
// conditie2 = true;

// if (document.getElementById("id-prenume") != ""){
//     alert("Nu ai introdus prenumele!")
//     var conditie3 = false;
// }
// conditie3 = true;

// if (document.getElementById("id-parl") != ""){
//     alert("Nu ai introdus parola!")
//     var conditie4 = false;
// }
// conditie4 = true;

// if (document.getElementById("id-rparl") != ""){
//     alert("Nu ai reintrodus parola!")
//     var conditie5 = false;
// }
// conditie5 = true;

// if (document.getElementById("id-email") != ""){
//     alert("Nu ai introdus email-ul!")
//     var conditie6 = false;
// }
// conditie6 = true;

// let conditiefinala = conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6;

// if(conditiefinala)