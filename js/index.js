console.clear();
var msgErroNaoSuportaDb="Seu navegador não suporta WEB Sql. Na proxima versão será criado uma rotina para LocalStorage";

if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 10*(1024 x 1024) = 10MB
    var mydb = openDatabase("database", "1", "Banco de dados para esta aplicação :)", 10*(1024 * 1024));

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS servicos ( idServico INTEGER PRIMARY KEY ASC,nome TEXT, obj TEXT, principal BOOLEAN)");
    });

    // console.log(mydb)

} else {
    alert(msgErroNaoSuportaDb);
}

setTimeout(() => {
    preencheDadosPadroes();
}, 1000);

function preencheDadosPadroes(){
    // console.log("Preenche dados padrões");
    if(mydb){
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM servicos WHERE principal = 'true';",[],function(t,r){
                // console.log(r.rows.length)
                if(r.rows.length > 0 ){

                    
                    for (i = 0; i < r.rows.length; i++) {
                        //Get the current row
                        let row = r.rows.item(i);
                        let obj = JSON.parse(row.obj);
                        // console.log(obj)
                        DadosUser.servidorAtual.url = obj.url;
                        DadosUser.servidorAtual.urlCompleta = obj.urlCompleta;
                        DadosUser.servidorAtual.tipoRequisicao = obj.tipoRequisicao;
                        DadosUser.servidorAtual.protocolo = obj.protocolo;
                        DadosUser.servidorAtual.porta = obj.porta;
                        DadosUser.servidorAtual.param3 = obj.param3;
                        DadosUser.servidorAtual.param2 = obj.param2;
                        DadosUser.servidorAtual.param1 = obj.param1;
                        DadosUser.servidorAtual.nomeServico = obj.nomeServico;


                        // console.log(DadosUser.servidorAtual);
                    }
                } else {
                    alert('Você não tem nenhuma configuração padrão de serviço salva. Configure uma em "configurações".');
                }
            });
        });
    } else {
        window.alert(msgErroNaoSuportaDb);
    }
}

// $("#recebeConteudo").load('./pages/' + "inicial.html");
// $("#recebeConteudo").load('./pages/' + "teste.html");
$("#recebeConteudo").load('./pages/' + "configuracoes.html");


function Abrir(arquivo){
    // alert(arquivo)
    // console.log('entrou, tela solicitada: '+arquivo);
    $("#recebeConteudo").html("");
    $("#recebeConteudo").load('./pages/' + arquivo);
}



function PreviewUrl(elemento,valor){ //o elemendo deve ser o mesmo id, do campo da tela "configuracoes.html"
    setTimeout(function(){
        console.log(elemento)
        let protocolo = DadosUser.servidorAtual.protocolo;
        let url = DadosUser.servidorAtual.url;
        let porta = DadosUser.servidorAtual.porta;   
        let param1 = DadosUser.servidorAtual.param1;
        let param2 = DadosUser.servidorAtual.param2;
        let param3 = DadosUser.servidorAtual.param3; 
        
        elemento == 'protocolo' ? protocolo = valor : "";
        elemento == 'url' ? url = valor : "";
        elemento == 'porta' ? porta = valor : "";
        elemento == 'param1' ? param1 = valor : "";
        elemento == 'param2' ? param2 = valor : "";
        elemento == 'param3' ? param3 = valor : "";
    
        DadosUser.servidorAtual.protocolo = protocolo;
        DadosUser.servidorAtual.url = url;
        DadosUser.servidorAtual.porta = porta;
        DadosUser.servidorAtual.param1 = param1;
        DadosUser.servidorAtual.param2 = param2;
        DadosUser.servidorAtual.param3 = param3;
    
        protocolo = protocolo + "://";
        url = url + ":";
        porta = porta + "/";
    
    
        let urlCompleta = protocolo+url+porta+param1+param2+param3;
        console.log(urlCompleta);
        $("#preview").val(urlCompleta);
        
    }, 100);
}

function resetConfiguracoes(){
    $("#protocolo").val("");
    $("#url").val("");
    $("#porta").val("");
    $("#param1").val("");
    $("#param2").val("");
    $("#param3").val("");
    $("#preview").val('http//127.0.0.1:8080/AgritradeServer/agritrade?tela=GetNegociacoesAndamentoConcluidas')
}

function salvarDados(){
    
    //Pega os valores
    let protocolo = DadosUser.servidorAtual.protocolo;
    let url = DadosUser.servidorAtual.url;
    let porta = DadosUser.servidorAtual.porta;   
    let param1 = DadosUser.servidorAtual.param1;
    let param2 = DadosUser.servidorAtual.param2;
    let param3 = DadosUser.servidorAtual.param3;
    let urlCompleta = protocolo+"://"+url+":"+porta+"/"+param1+param2+param3;
    let tipoRequisicao = document.querySelector('input[name="requisicao"]:checked').value;
    let principal = document.querySelector('input[name="principal"]:checked').value;
    let nomeServico = $("#nomeVersao").val();
    let salva = document.querySelector('input[name="salvar"]:checked').value;
    
    DadosUser.servidorAtual.urlCompleta = urlCompleta
    DadosUser.servidorAtual.protocolo = protocolo;
    DadosUser.servidorAtual.url = url;
    DadosUser.servidorAtual.porta = porta;
    DadosUser.servidorAtual.param1 = param1;
    DadosUser.servidorAtual.param2 = param2;
    DadosUser.servidorAtual.param3 = param3;
    DadosUser.servidorAtual.tipoRequisicao = tipoRequisicao;


    if(nomeServico == null || nomeServico == "" || nomeServico == undefined ){
        let now = new Date ;
        let mes = (now.getMonth()+1);
        mes <10 ? mes = "0"+mes:"";
        let hora = now.getHours();
        hora < 10 ? hora = "0"+hora:"";
        let minutos = now.getMinutes();
        minutos < 10 ? minutos = "0"+minutos+"":"";
        let secundos = now.getSeconds();
        secundos < 10 ? secundos = "0"+secundos:"";
        let milisecundos = now.getMilliseconds();
        
        let dataCompleta = now.getDate()+"/"+ mes +"/"+ now.getFullYear()+"_"+hora+":"+minutos+":"+secundos+"."+milisecundos;

        nomeServico = dataCompleta
    }

    //Seta os valores em um obj;
    let obj = new Object();
    obj.protocolo = protocolo;
    obj.url = url;
    obj.porta = porta;
    obj.param1 = param1;
    obj.param2 = param2;
    obj.param3 = param3;
    obj.principal = principal;
    obj.urlCompleta = urlCompleta;
    obj.nomeServico = nomeServico;
    obj.tipoRequisicao = tipoRequisicao;
    let json = JSON.stringify(obj)  
    // console.log("\n\n\n\ ");
    // console.log(json);
    // console.log("\n\n\n\ ");
    if(mydb){
        mydb.transaction(function (t) {
            
            console.log(principal)
            if(salva == "true"){
                if(principal == "true"){
                    t.executeSql("UPDATE servicos SET principal = false");
                    executaSql("INSERT INTO servicos(nome,obj,principal) VALUES(?,?,?);",[nomeServico, json,true])
                    // t.executeSql("INSERT INTO servicos (nome, obj, principal) VALUES (?, ?,?)", [nomeServico, json,true]);
                } else {
                    executaSql("INSERT INTO servicos(nome,obj,principal) VALUES(?,?,?);",[nomeServico, json,false])
                    // t.executeSql("INSERT INTO servicos (nome, obj, principal) VALUES (?, ?,?)", [nomeServico, json,false]);
                }

                carregaListaServicos();
            }
            
        });
    } else {
        window.alert(msgErroNaoSuportaDb)
    }
    

    // let servicos = [];
    // aqui farei a requisição com o websql para salvar valor no websql
    // servic/os.push(obj);
    
    // console.log(json);
    // servicos = [];
    // servicos = JSON.parse(json);
    // console.log(servicos);

        
}

function iniciaServicos(){
    
    tabelaServicos = $('#tabelaServicos').DataTable({
        paging: false,
        scrollY: 300,
        searching: false,
        
    });
}
function servicosSalvos(transaction, results){
    // console.log("entrou no servicosSalvos")
        //initialise the listitems variable
        var listitems = "";
        //get the car list holder ul
        // var listholder = document.getElementById("carlist");
    
        //clear cars list ul
        // listholder.innerHTML = "";
    
        let i;
        tabelaServicos.clear().draw();//limpa os registros da tabela;
        let tempObj = {};
        //Iterate through the results
        for (i = 0; i < results.rows.length; i++) {
            //Get the current row
            let row = results.rows.item(i);
            tempObj = JSON.parse(row.obj);
            
            tabelaServicos.row.add([
                row.nome,
                tempObj.urlCompleta.substr(0,25)+"...",
                // tempObj.urlCompleta,
                row.obj.substr(0,25)+"...",
                '<i class="fa fa-trash" aria-hidden="true" onclick="excluirServico('+row.idServico+')"></i>'
            ]);
            // console.log(tempObj.urlCompleta)
        }
        
        tabelaServicos.draw();
   
}

function excluirServico(id){
    executaSql("DELETE FROM servicos WHERE idServico = "+id)+";";
    carregaListaServicos();
}
function carregaListaServicos(){
    executaSql("SELECT * FROM servicos;",[],servicosSalvos);
}

function executaSql(sql = String,argumentos = [],servico = function(){} ){
    if(mydb){
        mydb.transaction(function (t) {
            if (servico == undefined || servico == null || servico == ""){
                if(argumentos == undefined || argumentos == null || argumentos == "" || argumentos.length <=  0){
                    // console.log("if")
                    t.executeSql(sql,argumentos);
                    return false;
                } else {
                    // console.log("else")
                    t.executeSql(sql);
                    return false;
                }
            } else {
                if(argumentos != undefined && argumentos !=null && argumentos != "" && argumentos.length >  0){
                    // console.log("if")
                    t.executeSql(sql,argumentos,servico);
                    return false;
                } else {
                    // console.log("else")
                    t.executeSql(sql,[],servico);
                    return false;
                }
            }
            

        });
    }else {
        window.alert(msgErroNaoSuportaDb);
        return false;
    }
}