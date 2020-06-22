
// $("#recebeConteudo").load('./pages/' + "inicial.html");
$("#recebeConteudo").load('./pages/' + "testarServicos.html");
console.clear();
var msgErroNaoSuportaDb="Seu navegador não suporta WEB Sql. Na proxima versão será criado uma rotina para LocalStorage";

if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 10*(1024 x 1024) = 10MB
    var mydb = openDatabase("database", "1", "Banco de dados para esta aplicação :)", 10*(1024 * 1024));

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS servicos ( idServico INTEGER PRIMARY KEY ASC,nome TEXT, obj TEXT, principal BOOLEAN)");
    });

    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS parametros ( idParametro INTEGER PRIMARY KEY ASC,idServico INTEGER, nome TEXT, obj TEXT, dataInsercao TEXT)");
    });

    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS logs ( idLog INTEGER PRIMARY KEY ASC,idServico INTEGER, idParametro INTEGER, obj TEXT, dataInsercao TEXT)");
    });


    // console.log(mydb)

} else {
    alert(msgErroNaoSuportaDb);
}

setTimeout(() => {
    preencheDadosPadroes();
}, 1000);

function preencheDadosPadroes(){
    console.log("Preenche dados padrões");
    if(mydb){
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM servicos WHERE principal = 1;",[],function(t,r){
                // console.log(r.rows.length)
                if(r.rows.length > 0 ){

                    
                    for (i = 0; i < r.rows.length; i++) {
                        //Get the current row
                        let row = r.rows.item(i);
                        let obj = JSON.parse(row.obj);
                        // console.log(obj)
                        console.log(obj )
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
                    let texto = 'Você não tem nenhuma configuração padrão de serviço salva. Configure uma em configurações. Configurar agora?';
                    // let temp = Abrir("configuracoes.html")
                    msg("Sem configurações encontradas.",texto,Abrir,'configuracoes.html');
                   
                }
            });
        });
    } else {
        window.alert(msgErroNaoSuportaDb);
    }
}

function abreGitHub(){
    // console.log("abreGitHub")
    window.open('https://github.com/sir-tiago/testeDeServicos','_blank')
}


function Abrir(arquivo){
    // alert(arquivo)
    // console.log('entrou, tela solicitada: '+arquivo);
    $("#recebeConteudo").html("");
    $("#recebeConteudo").load('./pages/' + arquivo);
}

function dataAtual(){
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

    return dataCompleta;
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
        
        if(protocolo.toLowerCase() == 'http'){
            if(porta == "" || porta == null || porta == undefined){
                $("#porta").val("8080");
            }
        } else if(protocolo.toLowerCase() == 'https') {
            if(porta == "" || porta == null || porta == undefined){
                $("#porta").val("443");
            }
        }

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
    console.log("salvarDados")
    
    DadosUser.servidorAtual.urlCompleta = urlCompleta
    DadosUser.servidorAtual.protocolo = protocolo;
    DadosUser.servidorAtual.url = url;
    DadosUser.servidorAtual.porta = porta;
    DadosUser.servidorAtual.param1 = param1;
    DadosUser.servidorAtual.param2 = param2;
    DadosUser.servidorAtual.param3 = param3;
    DadosUser.servidorAtual.tipoRequisicao = tipoRequisicao;


    if(nomeServico == null || nomeServico == "" || nomeServico == undefined ){
        nomeServico = dataAtual();
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
                    t.executeSql("UPDATE servicos SET principal = 0");
                    executaSql("INSERT INTO servicos(nome,obj,principal) VALUES(?,?,?);",[nomeServico, json,1])
                    // t.executeSql("INSERT INTO servicos (nome, obj, principal) VALUES (?, ?,?)", [nomeServico, json,true]);
                } else {
                    executaSql("INSERT INTO servicos(nome,obj,principal) VALUES(?,?,?);",[nomeServico, json,0])
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
        console.log(results.rows.length)
        if(results.rows.length>0){

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
        }
        
        tabelaServicos.draw();
   
}

function excluirServico(id){
    let resposta = msg("Excluir registro?","Deseja realmente excluir o serviço selecionado?",excluir,id);
}
function excluir(id){
    executaSql("DELETE FROM parametros WHERE idServico = "+id+";");
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

function preencheSelectServicosTestaServicos(){
    // console.log("preencheSelectServicosTestaServicos")
    if(mydb){
        mydb.transaction(function (t) {
            let options = "";
            t.executeSql("SELECT nome,idServico,principal FROM servicos ORDER BY principal DESC;",[],function(t,r){
                for (i = 0; i < r.rows.length; i++) {
                    let row = r.rows.item(i);
                    if (i==0){
                        let temp = "<option value='"+row.idServico+"' selected>"+row.nome+"</option>";
                        options +="\n";
                        options += temp;
                    } else {
                        let temp = "<option value='"+row.idServico+"'>"+row.nome+"</option>";
                        options +="\n";
                        options += temp;
                    }
                    // console.log(row)
                    
                }
                $("#selectServicos").html(options);
                preencheSelectParametrosTestaServicos();
            });
        });
    } else {
        alert(msgErroNaoSuportaDb);
    }
}

function preencheSelectParametrosTestaServicos(execucao){
    if(execucao == undefined || execucao == null || execucao == ""){
        execucao = 0;
    }
    execucao++;
    // console.log("preencheSelectParametrostestaServicos")
    let id = $("#selectServicos").val();
    if(id != null && id != "" && id != undefined){
        
        if(mydb){
            $("#selectParametros").val("")
            mydb.transaction(function (t) {
                let options = "";
                let tem="";
                t.executeSql("SELECT * FROM parametros WHERE idServico = ? ORDER BY idParametro DESC;",[id],function(t,r){
                    for (i = 0; i < r.rows.length; i++) {
                        let row = r.rows.item(i);
                        if (i==0){
                            temp = "<option value='"+row.idParametro+"' selected>"+row.nome+"</option>";
                            options +="\n";
                            options += temp;
                        } else {
                            temp = "<option value='"+row.idParametro+"'>"+row.nome+"</option>";
                            options +="\n";
                            options += temp;
                        }
                        // console.log(row)
                        
                    }

                    if(r.rows.length <= 0 ){
                        temp = "<option value='"+0+"' selected> Novo </option>";
                    } else {
                        temp = "<option value='"+0+"' > Novo </option>";
                    }
                    options+="\n";
                    options += temp;
                    $("#selectParametros").html(options);
                    preencheCampoParametrosTestaServicos();

                });
            });
        } else {
            alert(msgErroNaoSuportaDb);
        } 
    } else {
        if(execucao < 3){
            setTimeout(() => {
                preencheSelectServicosTestaServicos(execucao);
            }, 500);
        }
        
    }
}

function preencheCampoParametrosTestaServicos(execucao){
    if(execucao == undefined || execucao == null || execucao == ""){
        execucao = 0;
    }
    execucao++;
    // console.log("preencheCampoParametrosTestaServicos")
    let id = $("#selectParametros").val();
    
    if(id != null && id != "" && id != undefined && $("#selectParametros").val() != 0 && $("#selectParametros").val() != "0"){
        
        if(mydb){
            $("#parametrosRequisicao").val("");
            $("#nomeParametro").val("");
            mydb.transaction(function (t) {
                let options = "";
                t.executeSql("SELECT * FROM parametros WHERE idParametro = ? ORDER BY idParametro DESC LIMIT 1;",[id],function(t,r){
                    for (i = 0; i < r.rows.length; i++) {
                        let row = r.rows.item(i);
                        let temporary = row.obj;
                       
                        // console.log(temporary)
                        $("#parametrosRequisicao").val(temporary.replace("\n","<br>"));
                        console.log(temporary.replace("\n","<br>"));
                        $("#nomeParametro").val(row.nome)
                        // console.log(row)
                        // console.log(row.obj)
                    }
                    // $("#parametrosRequisicao").html(options);
                });
            });
        } else {
            alert(msgErroNaoSuportaDb);
        } 
    } else {
        if(execucao < 3){
            setTimeout(() => {
                preencheCampoParametrosTestaServicos(execucao);
            }, 500);
        }
    }
}




function LimparTestaServicos(){
    $("#parametrosRequisicao").val("");
}

function SalvarTestaServicos(){
    // console.log("SalvarTestaServicos")
    let idServico = $("#selectServicos").val();
    let idParametro = $("#selectParametros").val();
    let salvar = document.querySelector('input[name="salvarParametro"]:checked').value;
    let bruto = $("#parametrosRequisicao").val();
    let obj =   JSON.parse(bruto);
    obj = JSON.stringify(bruto);
    let nome = $("#nomeParametro").val();
    let dataInsercao = dataAtual();

    // console.log(dataInsercao)
    if(salvar == 'permanente'){
        // console.log("debugger");
        if(idParametro != 0){
            executaSql("UPDATE parametros SET obj = ?, nome = ?, dataInsercao = ? WHERE idParametro = ?;",[obj,nome,dataInsercao,idParametro]);
            preencheSelectParametrosTestaServicos();
        } else {
            executaSql("INSERT INTO parametros(nome,idServico,obj,dataInsercao) VALUES(?,?,?,?);",[nome,idServico,obj,dataInsercao])
            preencheSelectParametrosTestaServicos();
        }
    }
}

function ExcluirParametrosAtuais(){
    let idParametro = $("#selectParametros").val();
    executaSql("DELETE FROM parametros WHERE idParametro = ?;",[idParametro]);
    preencheSelectParametrosTestaServicos();
}

function ExcluirTodosParametros(){
    executaSql("DELETE FROM parametros;");
    preencheSelectParametrosTestaServicos();
}

function isnull(valor){
    if(valor == "" || valor == null || valor == undefined || valor.length ==0){
        return true;
    } else {
        return false;
    }
}

function removeCaracteresJson(variavel){
    if(variavel.match("\n")){
        while(variavel.match("\n")){
            variavel = variavel.replace("\n","");
        }
    }
    if( variavel.match(" ")){
        while(variavel.match(" ")){
            variavel = variavel.replace(" ","");
        }
    }

    return variavel;
}
function NovaRequisicao(){
    let id = $("#selectServicos").val();
    
    executaSql("SELECT * FROM servicos WHERE idServico = ?;",[id],function(e,r){
        let temporary="";
        for (i = 0; i < r.rows.length; i++) {
            let row = r.rows.item(0);
            // console.log(row)
            temporary = JSON.parse(row.obj);
            // console.log(temporary.urlCompleta);
        }
        console.log("requisição: "+temporary.tipoRequisicao+"\n url: "+temporary.urlCompleta)
        let parametrosBrutos = $("#parametrosRequisicao").val();
        // parametrosBrutos = removeCaracteresJson(parametrosBrutos);
        let parametros = JSON.stringify(parametrosBrutos);
        $.ajax({
			type: temporary.tipoRequisicao,
			dataType: "json",
			data: parametros,
			url: temporary.urlCompleta
		}).done(function(r){
            $("recebeResposta").val("");
            $("recebeResposta").val(r);
            console.log(r);
        }).fail(function(e){
            console.log(e)
        });
       
    });

    

}

function msgFechar(){
    $('#modal_confirmar_remocao').modal('hide');
}


function msg(titulo,conteudo,onConfirm,parametrosConfirm,onRecuse,parametrosRecusa) {
    respostaMsg = "";

    $("#tituloMsg").html("");
    $("#modal_confirmar_remocao_body").html("");

    if(titulo != null && titulo != "" && titulo != undefined){
        $("#tituloMsg").html(titulo);
    } 
    if(conteudo != null && conteudo != "" && conteudo != undefined){
        $("#modal_confirmar_remocao_body").html(conteudo);
    }

    $("#modal_confirmar_remocao_remover").click(function (e) {
        msgFechar();
        if(onConfirm != null && onConfirm != undefined){
            if(parametrosConfirm != null && parametrosConfirm != "" && parametrosConfirm != undefined ){
                onConfirm( parametrosConfirm);
            } else {
                onConfirm();
            }
        }
        // console.log("true")
    });
      
    $("#fecharModal").click(function(e){
        msgFechar();
        if(onRecuse != null && onRecuse != undefined){

            if(parametrosRecusa != null && parametrosRecusa != "" && parametrosRecusa != undefined ){
                onRecuse(parametrosRecusa);
            } else {
                onRecuse();
            }
        }
    });
    
    $('#modal_confirmar_remocao').modal('show');
}
