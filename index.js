const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {Client} =require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');
const session = require('express-session');
const formidable = require('formidable');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const xmljs = require('xml-js');
const request = require('request');

var app = express();
 
app.set("view engine", "ejs");
 
app.use("/resurse", express.static(__dirname + "/resurse"));

const client = new Client({
    host: 'localhost',
    user: 'birsan',
    password: 'proiect',
    database: 'locuinte',
    port: 5432
})
client.connect()

app.use(session({
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

function getUtiliz(req){
	var utiliz;
	if(req.session){
		utiliz=req.session.utilizator
	}
	else{utiliz=null}
	return utiliz;
}


setInterval(function(){
    let comanda= `delete from accesari where now() - data_accesare > interval '10 minutes'`;
    //console.log(comanda);
    client.query(comanda, function(err, rez){
        if(err) console.log(err);
    });
},10*60*1000)
// console.log(utilizator);


app.use(function(req,res, next){
    let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (req.ip){
        var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
        console.log("id_utiliz", id_utiliz);
        client.query(comanda_param, [req.ip, id_utiliz, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();
});

async function trimiteMail(email, nume, prenume,mesaj,cod){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{ 
			user:"proiectTWMB@gmail.com",
			pass:"proiecttw"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	await transp.sendMail({
		from:"celmaitareproiect@gmail.com",
		to:email,
		subject: "Salut stimate " + nume + "!",
		// text:"Username-ul tau este "+username,
        text: mesaj,
        html: cod,
		// html:"<h1>Te-ai înregistrat pe <a href = 'http://localhost:8080/'>Zumbee</a>!</h1><p>Username-ul tau este <i>"+username+"</i></p>",
	})
    console.log("mail trimis");
//campuriText.
}

// async function trimitefactura(username, email,numefis){
// 	var transp= nodemailer.createTransport({
// 		service: "gmail",
// 		secure: false,
// 		auth:{//date login 
// 			user:"test.tweb.no@gmail.com",
// 			pass:"tehniciweb"
// 		},
// 		tls:{
// 			rejectUnauthorized:false
// 		}
// 	});
// 	//genereaza html
// 	await transp.sendMail({
// 		from:"test.tweb.node@gmail.com",
// 		to:email,
// 		subject:"Factură",
// 		text:"Stimate "+username+", aveți atașată factura",
// 		html:"<h1>Salut!</h1><p>Stimate "+username+", aveți atașată factura</p>",
//         attachments: [
//             {   // utf-8 string as an attachment
//                 filename: 'factura.pdf',
//                 content: fs.readFileSync(numefis)
//             }]
// 	})
// 	console.log("trimis mail");
// }

app.use(function(req,res, next){
    let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (req.ip){
        var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
        //console.log("id_utiliz", id_utiliz);
        client.query(comanda_param, [req.ip, id_utiliz, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();
});


function verificaImagini(){
	var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect

	var caleGalerie=jsi.cale_galerie;
    let vectImagini=[]
	for (let im of jsi.imagini){
		var imVeche= path.join(caleGalerie, im.cale_relativa);//obtin calea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
		var ext = path.extname(im.cale_relativa);//obtin extensia
		var numeFisier =path.basename(im.cale_relativa,ext)//obtin numele fara extensie
        let imMedie=path.join(caleGalerie+"/medie/", numeFisier+"-medie"+".webp");
		let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
		
        //console.log(imNoua);
        
        let data = new Date();
        let ora = data.getHours();
        if ((ora >= 5 && ora < 12 && im.timp=="dimineata" && vectImagini.length < 6) ||
        (ora >= 12 && ora < 20 && im.timp=="zi" && vectImagini.length < 6) ||
        ((ora >= 20 || ora < 5) && im.timp=="noapte" && vectImagini.length < 6))
        {
            vectImagini.push({mare:imVeche, medie:imMedie, mic:imNoua, descriere:im.descriere}); //adauga in vector un element
		if (!fs.existsSync(imMedie))//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(700) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imMedie, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imMedie, err);
		  });
		if (!fs.existsSync(imNoua))//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(300) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imNoua, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imNoua, err);
		  });

          
        }  
	}
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}

function verificaImagini2() {
    var textFisier = fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
    var jsi = JSON.parse(textFisier); //am transformat in obiect

    var caleGalerie = jsi.cale_galerie;
    let vectImagini = []
    for (let im of jsi.imagini) {
        var imVeche = path.join(caleGalerie, im.cale_relativa);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
        var ext = path.extname(im.cale_relativa);//obtin extensia
        var numeFisier = path.basename(im.cale_relativa, ext)//obtin numele fara extensie
        let imNoua = path.join(caleGalerie + "/mic/", numeFisier + "-mic" + ".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
        if (im.animata == true) 
        {
            vectImagini.push({ mare: imVeche, mic: imNoua, descriere: im.descriere }); //adauga in vector un element
            if (!fs.existsSync(imNoua))//daca nu exista imaginea, mai jos o voi crea
                sharp(imVeche)
                    .resize(300) //daca dau doar width(primul param) atunci height-ul e proportional
                    .toFile(imNoua, function (err) {
                        if (err)
                            console.log("eroare conversie", imVeche, "->", imNoua, err);
                    });
        }
    }
    console.log(vectImagini.length);
    return vectImagini;
}

app.get(["/", "/index"], function (req, res) {//ca sa pot accesa pagina principala si cu localhost:8080 si cu localhost:8080/index
    var rezultat;
    client.query("select username from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare < interval '10 minutes' )").then(function(rezultat){
        //console.log("rezultat", rezultat.rows);

        var locatie="";
        request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', 
            function (error, response, body) {
            if(error) {console.error('error:', error)}
            else{
                var obiectLocatie=JSON.parse(body);
                locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
            }

            /*generare evenimente random pentru calendar */
            var evenimente=[]
            var texteEvenimente=["Eveniment important", "Festivitate", "Prajituri gratis", "Zi cu soare", "Aniversare"];
            dataCurenta=new Date();
            for(i=0;i<5;i++){
                evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*25) ), text:texteEvenimente[i]});
            }
            //console.log(evenimente)
            res.render("pagini/index", {evenimente: evenimente, locatie:locatie,utiliz_online: rezultat.rows,  imagini: verificaImagini(), ip: req.ip, imagini2: verificaImagini2(), utilizator: req.session.utilizator});
            
            });

         
    }, function(err){console.log("eroare",err)});
    
   // res.render("pagini/index", { imagini: verificaImagini(), ip: req.ip, imagini2: verificaImagini2(), utilizator: req.session.utilizator});
});


 
app.get(["/", "/index"], function (req, res) {
    res.render("pagini/index", { imagini1: verificaImagini1(), ip: req.ip, imagini2: verificaImagini2()});
});

// app.post("/login", function(req,res){
//     let formular= formidable.IncomingForm();
//     formular.parse(req, function(err, campuriText){
//         //console.log(campuriText);
//         let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
//         //let comanda= `select username, nume,email, culoare_chat, rol from utilizatori where username= '${campuriText.username}' and parola='${parolaCriptata}'`;
//         let comanda_param= `select id,username,nume, email, culoare_chat, rol from utilizatori where username= $1::text and parola=$2::text`;
//         //console.log(comanda);
        
//         client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
//         //client.query(comanda, function(err, rez){
//             if (!err){
//                 //console.log(rez);
//                 if (rez.rows.length == 1){
//                     req.session.utilizator={
//                         id:rez.rows[0].id,
//                         username:rez.rows[0].username,
//                         nume:rez.rows[0].nume,
//                         email:rez.rows[0].email,
//                         telefon:rez.rows[0].telefon,
// 						rol:rez.rows[0].rol
//                     }
//                 }
                
//             }
//             res.redirect("/index");
//         });
//     }); 
// })



app.get("*/galerie-animata.css",function(req, res){
    //citesc scss-ul cs string
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");
    nr_imagini=[2,3,4]
    let nr_imagini_random = nr_imagini[Math.floor(Math.random()*nr_imagini.length)];
    console.log(nr_imagini_random);//iau un numar din cele 3 aleatoriu
    let rezScss=ejs.render(sirScss,{nr_img:nr_imagini_random});// transmit numarul catre scss si obtin sirul cu scss-ul compilat
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });
});

app.get(["*/galerie.json"], function (req, res){
    res.render("pagini/403");
});



app.get("/produse",function(req, res){
    //console.log("Url:",req.url);
    //console.log("Query:", req.query.tip);
    // conditie_booleana? val_true : val_false
    let conditie= req.query.tip ?  " and tip_locuinta='"+req.query.tip+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    //console.log("select nume, descriere, tip_locuinta, stadiu_constructie, pret, suprafata, data_terminare_locuinta, etaj, mobilat, bucatarie_open_space"+conditie);
    client.query("select id, nume, descriere, imagine, tip_locuinta, stadiu_constructie, pret, suprafata, data_terminare_locuinta, etaj, mobilat, bucatarie_open_space from locuinte where 1=1"+conditie, function(err,rez){
        client.query("select unnest(enum_range( null::tipuri_locuinta)) as tip", function(err,rezTip){//selectez toate valorile posibile din enum-ul categ_prajitura
            client.query("select unnest(enum_range( null::stadiu_constructie_loc)) as stadiu", function(err,rezStd){
                res.render("pagini/produse", {produse:rez.rows, tipLoc:rezTip.rows, stadiuC:rezStd.rows, utilizator: req.session.utilizator});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            })
        });
    });
});
 

function get_categorii(){
    client.query("select unnest(enum_range( null::tipuri_locuinta)) as categorie", function(err,rezTip_Prod){
            app.locals.categorii = [];
            for(let i = 0; i < rezTip_Prod.rows.length; i++){
                app.locals.categorii.push(rezTip_Prod.rows[i]["categorie"]);
            }
    });
}

app.get("/produs/:id_locuinta",function(req, res){
   
    const rezultat= client.query("select * from locuinte where id="+req.params.id_locuinta, function(err,rez){
        res.render("pagini/produs", {prod:rez.rows[0], utilizator: req.session.utilizator});
    });
});

let parolaServer="tehniciweb";
app.post("/inreg",function(req, res){ 
    //console.log("primit date");
    var username;
    let formular= formidable.IncomingForm();
	//nr ordine: 4
    formular.parse(req, function(err, campuriText, campuriFisier){
        //console.log(campuriText);
		eroare ="";
		if(campuriText.username=="" || !campuriText.username.match("^[A-Za-z0-9]+$")){
			eroare+="Username gresit. ";
		}
        if(campuriText.nume=="" || !campuriText.nume.match("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")){
			eroare+="Nume gresit. ";
		}
        if(campuriText.prenume=="" || !campuriText.prenume.match("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")){
			eroare+="Prenume gresit. ";
		}
        if(campuriText.email=="" || campuriText.email.match("^([\w]*[\w\.]*(?!\.)@gmail.com)")){
			eroare+="Email gresit. ";
		}
        // if(campuriText.telefon.match("^(\+|)?(07[0-9]{8})")){
		// 	eroare+="Numar de telefon gresit gresit. ";
		// }

		if(!eroare){
			let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
			let comanda= `insert into utilizatori (username, nume, prenume, parola, email, telefon, imagine_profil) values ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text)`;
			//console.log(comanda);
			client.query(comanda, [campuriText.username, campuriText.nume, campuriText.prenume, parolaCriptata, campuriText.email, campuriText.telefon, campuriText.imagine_profil],function(err, rez){
				if (err){
					console.log(err);
					res.render("pagini/inregistrare",{err:"Eroare baza date! Reveniti mai tarziu", raspuns:"Datele nu au fost introduse."});
				}
				else{
					res.render("pagini/inregistrare",{err:"", raspuns:"Contul a fost inregistrat cu succes!"});
                    //let mesaj = "<h1>Te-ai înregistrat pe <a href = 'http://localhost:8088/'><i><b><u>Ansamblu rezidential MB</u></b></i></a>!</h1><p>Username-ul tau este <i>"+campuriText.username+"</i></p>";
                    let mesaj = "<p>Username-ul tau este "+campuriText.username+" pe site-ul <a href = 'http://localhost:8088/'><i><b><u>Ansamblu rezidential MB</u></b></i></a>!</p>"
                    let text = "Username-ul tau este "+campuriText.username;
					trimiteMail(campuriText.email, campuriText.nume, campuriText.prenume,text, mesaj);
					//trimiteMail(campuriText.username ,campuriText.email);//campuriText.username,
					//console.log(campuriText.email);
				}
			});
		}
		else{
					res.render("pagini/inregistrare",{err:"Eroare formular. "+eroare, raspuns:""});
		}
    });
	
	//nr ordine: 2
	formular.on("fileBegin", function(name,campFisier){
		//console.log("inceput upload: ", campFisier);
		if(campFisier && campFisier.name!=""){
			//am  fisier transmis
			var cale=__dirname+"/poze_uploadate/"+username
			if (!fs.existsSync(cale))
				fs.mkdirSync(cale);
			campFisier.path=cale+"/"+campFisier.name;
			//console.log(campFisier.path);
		}
	});	
	
	
	//nr ordine: 1
	formular.on("field", function(name,field){
		if(name=='username')
			username=field;
		//console.log("camp - field:", name)
	});
	

	
	//nr ordine: 3
	formular.on("file", function(name,field){
		//console.log("final upload: ", name);
	});
	
	
	
	
});



app.post("/login", function(req,res){
    let formular = formidable.IncomingForm();
    formular.parse(req, function(err, campuriText){
        //console.log(campuriText);
        let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
        //let comanda= `select username, nume,email, culoare_chat, rol from utilizatori where username= '${campuriText.username}' and parola='${parolaCriptata}'`;
        let comanda_param= `select id, username, nume, email, telefon, rol from utilizatori where username= $1::text and parola=$2::text`;
        //console.log(comanda);
        
        client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
        //client.query(comanda, function(err, rez){
            if (!err){
                //console.log(rez);
                if (rez.rows.length == 1){
                    req.session.utilizator={
                        id:rez.rows[0].id,
                        username:rez.rows[0].username,
                        nume:rez.rows[0].nume,
                        email:rez.rows[0].email,
                        tema_site:rez.rows[0].tema_site,
						rol:rez.rows[0].rol
                    }
                }
                
            }
            res.redirect("/index");
        });
    }); 
})


app.get('/useri', function(req, res){
	
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
            res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
        });
	} else{
		res.status(403).render('pagini/403',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
	}

});


app.post("/schimba_rol",function(req, res){
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
	var formular= formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
        //let rolcurent = campuriText.rolUt;
        let idcurent = campuriText.idUt;
        let rolnou= "";

        if(campuriText.rol == "admin"){
            rolnou = "comun";
            campuriText.rol = rolnou;
        }
        if(campuriText.rol == "comun") {
            rolnou = "admin";
            campuriText.rol = rolnou;
        }
        var comanda = `select * from utilizatori where id= $1::integer`;
        client.query(comanda,[idcurent],function(eroare,rezz){
            var comanda2 = `UPDATE utilizatori SET rol = $1::text WHERE id = $2::integer;`;
            if (rolnou == "admin"){
                var text = "Ai fost promovat!"
                var mesaj = "<p>Ai fost promovat la rolul de "+rolnou+".</p>";
            }
            else {
                var text = "Ai fost retrogradat!"
                var mesaj = "<p>Ai fost retrogradat la rolul de "+rolnou+".</p>";
            }
            
            trimiteMail(rezz.rows[0].email, rezz.rows[0].nume, rezz.rows[0].prenume, text, mesaj);
            client.query(comanda2,[rolnou, idcurent],function(error,Rez){
                console.log(Rez);
            
		// var comanda=`delete from utilizatori where id='${campuriText.id_utiliz}'`;
		// client.query(comanda, function(err, rez){
		// 	// TO DO mesaj cu stergerea
	    })
    })
    });
    }   
	res.redirect("/useri");
	
});

app.post("/produse_cos",function(req, res){
    
	console.log("req.body: ",req.body);
    console.log(req.get("Content-type"));
    console.log("body: ",req.get("body"));

    /* prelucrare pentru a avea toate id-urile numerice si pentru a le elimina pe cele care nu sunt numerice */
    var iduri=[]
    for (let elem of req.body.ids_prod){
        let num=parseInt(elem);
        if (!isNaN(num))
            iduri.push(num);
    }
    if (iduri.length==0){
        res.send("eroare");
        return;
    }

    console.log("select id, nume, pret, suprafata, stadiu_constructie, tip_locuinta, descriere, etaj, mobilat, bucatarie_open_space, data_terminare_locuinta ,imagine from locuinte where id in ("+iduri+")");
    client.query("select id, nume, pret, suprafata, stadiu_constructie, tip_locuinta, descriere, etaj, mobilat, bucatarie_open_space, data_terminare_locuinta ,imagine from locuinte where id in ("+iduri+")", function(err,rez){
        console.log(err, rez);
        //console.log(rez.rows);
        res.send(rez.rows);
       
       
    });

    
});


app.post("/cumpara",function(req, res){
    if(!req.session.utilizator){
        res.write("Nu puteti cumpara daca nu sunteti logat!");res.end();
        return;
    }
    console.log("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where id in ("+req.body.ids_prod+")");
    client.query("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where id in ("+req.body.ids_prod+")", function(err,rez){
        console.log(err, rez);
        //console.log(rez.rows);
        console.log(req.session.utilizator);
        let rezFactura=ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf-8"),{utilizator:req.session.utilizator,produse:rez.rows});
        console.log(rezFactura);
        let options = { format: 'A4' };

        let file = { content: rezFactura };

        html_to_pdf.generatePdf(file, options).then(function(pdf) {
            var numefis="temp/test"+(new Date()).getTime()+".pdf";
            fs.writeFileSync(numefis,pdf);
            trimitefactura(req.session.utilizator.username, req.session.utilizator.email, numefis);
            res.write("Totu bine!");res.end();
        });
       
        
       
    });

    
});




app.get("/logout", function(req, res){
    req.session.destroy();
    // app.locals.tema_site="x";
    res.redirect("/index");
});


app.get(["despre_noi"],function(req, res){//ca sa pot accesa pagina principala si cu localhost:8080 si cu localhost:8080/index
    /*
    console.log("ceva");
    res.setHeader("Content-Type","text/html");
    res.write("<!DOCTYPE html><html><head><title>ceva</title></head><body><p>Salut, Costică!</p></body></html>");
    */
    
    res.render("pagini/despre_noi"); /* relative intotdeauna la folderul views*/
});

// app.get('/useri', function(req, res){
	
// 	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
//         client.query("select * from utilizatori",function(err, rezultat){
//             if(err) throw err;
//             console.log(rezultat);
//             res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
//         });
// 	} else{
// 		res.status(403).render('pagini/eroare',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
// 	}

// });

// app.post("/sterge_utiliz",function(req, res){
// 	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
// 	var formular= formidable.IncomingForm()
	
// 	formular.parse(req, function(err, campuriText, campuriFisier){
// 		var comanda=`delete from utilizatori where id='${campuriText.id_utiliz}'`;
// 		client.query(comanda, function(err, rez){
// 			// TO DO mesaj cu stergerea
// 		});
// 	});
// 	}
// 	res.redirect("/useri");
	
// });

// app.get("/logout", function(req, res){
//     req.session.destroy();
//     res.render("pagini/logout");
// });

app.get("/*",function(req, res){    
    res.render("pagini"+req.url, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404");
            }
            else 
                throw err;
        }
        else{
            res.send(rezultatRandare);
        }
    });
});


verificaImagini();
verificaImagini2();
get_categorii();

app.listen(8088);
console.log("Serverul a pornit!");

