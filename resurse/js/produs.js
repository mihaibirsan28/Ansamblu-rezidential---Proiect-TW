window.onload = function(){   
    var data = document.getElementsByClassName("data")[0];
    var luni = {'Jan': 'Ianuarie','Feb': 'Februarie','Mar': 'Martie','Apr': 'Aprilie','May':'Mai','Jun':'Iunie','Jul':'Iulie','Aug':'August','Sep':'Septembrie','Oct': 'Octombrie' ,'Nov':'Noiembrie','Dec':'Decembrie'};
    var zile = {'Mon':'Luni','Tue':'Marți','Wed':'Miercuri','Thu':'Joi','Fri':'Vineri','Sat':'Sâmbătă','Sun':'Duminică'};
    data_string = data.textContent.split(" ");
    var datanoua = '';
    datanoua = datanoua + data_string[2] + '-' + luni[data_string[1]] + '-' + data_string[3] + ' [' + zile[data_string[0]] +']';
    data.innerHTML = '';
    data.innerHTML = datanoua;

    var bucatarie = document.getElementsByClassName("val-bucatarie");
        if(bucatarie.innerHTML == 'false'){
            bucatarie.innerHTML = "Bucataria este separata de living, o camera individuala.";
        }
        else {
            bucatarie.innerHTML = '';
            bucatarie.innerHTML = "Bucataria este open-space, creand un living mai spatios cu un aspect modern.";
        }
    
}