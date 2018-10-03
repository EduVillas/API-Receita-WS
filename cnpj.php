<!Doctype <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Requisição de CNPJ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="main.js"></script>
</head>
<body>

    <?php
    if(isset($_GET['cnpj'])){

        $cnpj = filter_input(INPUT_GET, 'cnpj');

        if(empty($cnpj)){
            echo 'Infome';
        }else{
            $postReceita = 'CNPJ='. $cnpj .'$Metodo=ListaLogradouro&TipoConsulta=cnp';
            $cURL = curl_init("https://www.receitaws.com.br/v1/cnpj/" . $_GET['cnpj']);
            
            $ curl -X GET https://www.receitaws.com.br/v1/cnpj/27865757000102;

            //curl_setopt($cURL, CURLOPT_RETURNTRANSFER, 1);
            //curl_setopt($cURL, CURLOPT_HEADER, 0);
            //curl_setopt($cURL, CURLOPT_POST, 0);
            //curl_setopt($cURL, CURLOPT_POSTFIELDS, $postReceita);

            $saida = curl_exec($cURL);

            curl_close($cURL);

            $saida = utf8_encode($saida);

            $tabela = preg_match_all('@<td (.*?)<\/td>@i', $saida, $campoTabela );
            echo'<pre>';
                print_r($campoTabela);
            echo'</pre>';

        }
    }
    ?>

    <form action="" method="get">

    <input type="text" name="cnpj" id=""/>
    <input type="submit" value="Buscar CNPJ"/>


</body>
</html>