
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
         Duplicate request controller. (Cache)
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

                if (cnpj.length != 14) {
                    return false;
                }
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

                        options.success(data);
                    } else {
                        options.notfound('CNPJ "' + $this.val() + '" not found.');
                    }

                }, function (error) {
                    options.fail(error);
                });
            });
        };

        return $.fn.wsreceita.init(options);
    };
})(jQuery);