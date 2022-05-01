
window.onload=function(){

    var rng = document.getElementById("inp-pret");
	rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
	rng.parentNode.appendChild(document.createTextNode(rng.max));
    let spval = document.createElement("span");
	rng.parentNode.appendChild(spval)
    rng.value = 0;
    spval.innerHTML=" ("+rng.value+")";
    rng.onchange=function(){
        rng.nextSibling.nextSibling.innerHTML=" ("+this.value+"€)";
    }
    var data = document.getElementsByClassName("val-data");
    var luni = {'Jan':'Ianuarie','Feb':'Februarie','Mar':'Martie','Apr':'Aprilie','May':'Mai','Jun':'Iunie','Jul':'Iulie','Aug':'August','Sep':'Septembrie','Oct':'Octombrie','Nov':'Noiembrie','Dec':'Decembrie'};
    var zile = {'Mon':'Luni','Tue':'Marti', 'Wed':'Miercuri','Thu':'Joi','Fri':'Vineri','Sat':'Sambata','Sun':'Duminica'};
    for(var i=0; i < data.length; i++){
        data_string = data[i].textContent.split(" ");
        var dataNoua = '';
        dataNoua = dataNoua + data_string[2] + '-' + luni[data_string[1]] + '-' +data_string[3] + '[' + zile[data_string[0]] + ']';
        data[i].innerHTML = '';
        data[i].innerHTML = dataNoua;
    }

    var bucatarie = document.getElementsByClassName("val-bucatarie");
    for(var i=0; i < bucatarie.length; i++){
        if(bucatarie[i].innerHTML == 'false'){
            bucatarie[i].innerHTML = "Bucataria este separata de living, o camera individuala.";
        }
        else {
            bucatarie[i].innerHTML = "Bucataria este open-space, creand un living mai spatios cu un aspect modern.";
        }
    }

    let inp = document.getElementsByName("tip-locuinta");
    for(let i = 0; i < inp.length - 1; i++){
        inp[i].onchange = function(){
            inp[inp.length - 1].checked = false;
        }
    }

    document.getElementById("inp-pret").oninput = function() {
        var value = (this.value-this.min)  /(this.max-this.min)*100
        //this.style.background = 'linear-gradient(to right, var(--culoare-meniu) 0%, var(--culoare-meniu) ' + value + '%, #fff ' + value + '%, white 100%)'
      };

    let btn = document.getElementById("filtrare");
    btn.onclick = function(){
        function transf(c) {
            cc = ""
            c = c.toLowerCase(); 
            let d = {'ă':'a','â':'a','î':'i','ș':'s','ț':'t'};
            for(let i = 0; i < c.length; i++){
                if("ăîâșț".includes(c[i])){
                    cc += d[c[i]];
                }
                else cc += c[i];
            }
            return cc;
        }
        
        let inp = document.getElementById("inp-pret");
        let maxPret = inp.value;

        inp = document.getElementById("inp-text");
        let val_text = inp.value;
        val_text = val_text.split(/[\s,]+/);
        if(val_text[0] == "")val_text = [];

        inp = document.getElementsByName("tip-locuinta");
        let val_tip_locuinta = [];
        for(let i = 0; i < inp.length; i++){
            if(inp[i].checked){
                val_tip_locuinta.push(inp[i].value);
            }
        } 
        if(val_tip_locuinta.length > 1){
            if(val_tip_locuinta[val_tip_locuinta.length - 1] == "toate")val_tip_locuinta.pop();
        }
        

        inp = document.getElementsByName("suprafata");
        let val_suprafata;
        for(let i = 0; i < inp.length; i++){
            if(inp[i].checked){
                val_suprafata = inp[i].value;
                break;
            }
        } 
        

        inp = document.getElementById("inp-bucatarie");
        let val_bucatarie = inp.value;
        

        inp = document.getElementsByName("stadiu");
        let val_stadiu = [];
        for(let i = 0; i < inp.length; i++){
            if(inp[i].selected){
                val_stadiu.push(inp[i].value);
            }
        } 



        var produse = document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="none";
            let pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let conditie1 = (pret <= maxPret);
            
        
            let conditie2;
            if(val_text.length > 0){
                conditie2 = false;
                let prop = prod.getElementsByClassName("val-nume")[0].innerHTML;
                let val_prop = prop.split(' ');
                for(let cuv of val_text){
                    
                    cuv = cuv.trim();
                    cuv = transf(cuv);
                    
                    for(let prop of val_prop){
                        prop = prop.trim();
                        prop = transf(prop);
                        console.log(prop);
                        if(prop.includes(cuv) === true){
                            conditie2 = true;
                            break;
                        }
                    }
                    if(conditie2 == true)break;
                }
            }
            else conditie2 = true;

            let tip_locuinta = prod.getElementsByClassName("val-tip-locuinta")[0].innerHTML;
            let conditie3 = false;
            if(val_tip_locuinta[0] == "toate")conditie3 = true;
            for(let i = 0; i < val_tip_locuinta.length; i++){
                if(val_tip_locuinta[i].trim() === tip_locuinta.trim()){
                    conditie3 = true;
                    break;
                }
            }
            
            let tip_suprafata = prod.getElementsByClassName("val-suprafata")[0].innerHTML;
            let conditie4 = false;
            if(val_suprafata == 160)conditie4 = true;
            else if(parseInt(tip_suprafata) <= parseInt(val_suprafata))conditie4 = true;
            

            let tip_stadiu_constructie = prod.getElementsByClassName("val-stadiu-constructie")[0].innerHTML;
            let conditie5 = false;
            for(let i = 0; i < val_stadiu.length; i++){
                // console.log(val_stadiu[i].trim());
                // console.log(tip_stadiu_constructie.trim());
                //console.log(val_stadiu[i].trim() === tip_stadiu_constructie.trim())
                //console.log(typeof tip_stadiu_constructie)
                if(val_stadiu[i].trim() === tip_stadiu_constructie.trim()){
                    conditie5 = true;
                    break;
                }
            }

            let bucatarie1 = prod.getElementsByClassName("val-bucatarie")[0].innerHTML;
            if(bucatarie1 == "Bucataria este open-space, creand un living mai spatios cu un aspect modern.")bucatarie1 = "true";
            else bucatarie1 = "false";
            let conditie6 = false;
            //console.log(typeof bucatarie1)
            
            if(bucatarie1.trim() === String(val_bucatarie).trim() || String(val_bucatarie).trim() === "toate")conditie6 = true;

            let conditieFinala = conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6;
            if (conditieFinala)
                prod.style.display="grid";
        }
       
    }


    function sortArticole(factor){
        
        var produse = document.getElementsByClassName("produs");
        let arrayProduse = Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            // let sub3 = parseInt(art1.getElementsByClassName("val-suprafata")[0].innerHTML);
            // let sub4 = parseInt(art1.getElementsByClassName("val-pret")[0].innerHTML);
            // let sub5 = parseInt(art2.getElementsByClassName("val-suprafata")[0].innerHTML);
            // let sub6 = parseInt(art2.getElementsByClassName("val-pret")[0].innerHTML);
            sub1 = parseInt(art1.getElementsByClassName("val-pret")[0].innerHTML) / parseInt(art1.getElementsByClassName("val-suprafata")[0].innerHTML);
            sub2 = parseInt(art2.getElementsByClassName("val-pret")[0].innerHTML) / parseInt(art2.getElementsByClassName("val-suprafata")[0].innerHTML);
            // sub1 = sub3 / sub4;
            // sub2 = sub5 / sub6;
            console.log(sub1);
            console.log(sub2);
            // let r = sub1.localeCompare(sub2);
            let r = sub1-sub2;
            if(r == 0){
                let pret1 = art1.getElementsByClassName("val-stadiu-constructie")[0].innerHTML;
                let pret2 = art2.getElementsByClassName("val-stadiu-constructie")[0].innerHTML;
                let p = pret1.localeCompare(pret2);
                return factor * p; 
            };
            return factor * (sub1- sub2);
        });
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("resetare");
    btn.onclick=function(){
        var produse=document.getElementsByClassName("produs");
        for (let prod of produse){
            prod.style.display="grid";
        }
        document.getElementById("inp-pret").value = 30000;
        // spval.innerHTML=" ("+ 30000 +")";
        spval.innerHTML=" ("+rng.min+"€)";
        document.getElementById("inp-text").value = "";

        var clist = document.getElementsByName("tip-locuinta");
        for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }
        clist[clist.length-1].checked = true;
        //document.getElementsByTagName("tip-locuinta").value = this.defaultChecked;
        document.getElementById("inp-stadiu").value = "";
        var clist = document.getElementsByName("suprafata");
        for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }
        clist[clist.length-1].checked = true;
        document.getElementById("inp-bucatarie").value = "toate";

    }

    btn=document.getElementById("suma");
    btn.onclick=function(){
        var produse = document.getElementsByClassName("produs");
            sumaArt = 0;
            for (let prod of produse){
                if(prod.style.display != "none")
                    sumaArt += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            let infoSuma = document.createElement("p");
            infoSuma.innerHTML="Suma produselor: " + sumaArt + " euro";
            infoSuma.className="info-produse";
            let p = document.getElementById("suma")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            console.log(infoSuma)
            setTimeout(function(){infoSuma.remove()}, 2000);
    }


    window.onkeydown=function(e){
        
       
        if (e.key=="c" && e.altKey){
            e.preventDefault();
            var produse=document.getElementsByClassName("produs");
            sumaArt=0;
            for (let prod of produse){
                sumaArt+=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            let infoSuma=document.createElement("p");//<p></p>
            infoSuma.innerHTML="Suma: "+sumaArt;//<p>...</p>
            infoSuma.className="info-produse";
            let p=document.getElementById("p-suma")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
        }
    }

 
}