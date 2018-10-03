<?php

header('Content-Type: application/json');

echo file_get_contents("https://www.receitaws.com.br/v1/cnpj/" . $_GET['cnpj']);