

//::::::::CONCEITOS ENTENDIDOS QUE SERIA UTIL A IMPLEMENTAÇÃO PORÉM NÃO IMPLEMENTADO:::::::::

//Apis ::: Conexão com outras apis caso a mesma esteja em falhas

//Tokens se for paga  ::::: Atenção para uso de tokens, trabalhando para que o usuário
//não tenha acesso a implementação no inspecionar do navegador

//aplicação limpando com enter  ::: é conhecida esse problema

///:::::Melhor forma para se trabalhar com as variáveis:::::
    /*(function(){
        var $cnpj = $("#cnpj");
        $cnpj.on("keyup", function() {
        });
});*/

//Debounce limpar evento para evitar repetição de request
/*function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}   
///Para fins de teste é indicado a passagem do numero sequencia ou usando a colagem

*/

(function ($) {

    $.fn.wsreceita = function (options) {
        $this = this;

        $.fn.wsreceita.options = {
            afterRequest: function () {
            },
            success: function (data) {
            },
            notfound: function (message) {
            },
            fail: function (message) {
            },
            fields: {},
            urlRequest: '../source/php/ws_receita.php'
        };

        /*
         Duplicação de request de acesso caso ocorra. (Cache)
         */
        $.fn.wsreceita.lastRequest = {
            cnpj: null,
            data: null
        };


        function getData(cnpj) {
            cnpj = cnpj.replace(/\D/g, '');

            var lastRequest = $.fn.wsreceita.lastRequest;

            return new Promise(function (success, fail) {
                if (lastRequest.cnpj == cnpj) {
                    success(lastRequest.dados);
                } else {
                    $.getJSON($.fn.wsreceita.options.urlRequest + "?cnpj=" + cnpj, function (data) {
                        lastRequest.cnpj = cnpj;
                        lastRequest.dados = data;

                        success(data);
                    }).fail(function (jqxhr, textStatus, error) {
                        fail(textStatus + ", " + error);
                    });
                }
            });
        }

        $.fn.wsreceita.init = function (options) {

            $.fn.wsreceita.options = $.extend({}, $.fn.wsreceita.options, options);

           

            return $this.keyup(function () {
                var cnpj = $(this).val().replace(/\D/g, '');

                //cnpjTamanho14(); ///Poderia ter usado para melhor compreenção do codigo
                if (cnpj.length != 14) {
                    return false;
                }

                var $dados = $("#dados");

                $dados.fadeOut();

                options.afterRequest();

                getData(cnpj).then(function (data) {

                    if (data.status == 'OK') {
                        $.each(options.fields, function (index, value) {
                            if (typeof value == "string") {
                                $(options.fields[index]).val(data[index]);
                            } else if (typeof value == 'function') {
                                value(data[index]);
                            }
                        });

                        $dados.show();

                        return options.success(data);
                    }
                    
                    options.notfound('CNPJ "' + $this.val() + '" not found.');

                }, function (error) {
                    options.fail(error);
                });
            });i
        };

        return $.fn.wsreceita.init(options);
    };
})(jQuery);