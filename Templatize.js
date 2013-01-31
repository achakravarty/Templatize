(function ($) {
    $.fn.render = function (templateName, model, options) {
        var templatePath = "";
        var templateExtn = ".html";
        var $this = '';
        var settings = $.extend({
            templatePath: templatePath,
            templateType: templateExtn,
            success: '',
            error: ''
        }, options);

        var templateModel = model || {};

        var getTemplate = function (callback) {
            try {
                if (!$this[0][templateName]) {
                    $.get(settings.templatePath + templateName + settings.templateType, function (data) {
                        $this[0][templateName] = data;
                        callback(data);
                    });
                }
                else {
                    callback($this[0][templateName]);
                }
            } catch (e) {
                var errorMessage = "An error occured while getting the template " + templateName + ". \n" + e.name + "\n" + e.message;
                throwCustomException(e, errorMessage);
            }
        };

        var setTemplate = function (template) {
            try {
                $this.setTemplate(template);
            } catch (e) {
                var errorMessage = "An error occured while setting the template " + templateName + ". \n" + e.name + "\n" + e.message;
                throwCustomException(e, errorMessage);
            }
        };

        var processTemplate = function () {
            try {
                $this.processTemplate(templateModel);
            } catch (e) {
                var errorMessage = "An error occured while processing the template " + templateName + ". \n" + e.name + "\n" + e.message;
                throwCustomException(e, errorMessage);
            }
        };

        var onSuccess = function (data) {
            if (settings.success) {
                settings.success(data);
            }
        };

        var onError = function (errorThrown) {
            if (settings.error) {
                settings.error(errorThrown);
            }
        };

        var throwCustomException = function (innerException, customMessage) {
            throw {
                name: "Templatize Exception",
                message: customMessage || "An error occurred in the templatization process. Refer the inner exception for details",
                innerException: innerException
            }
        };

        return this.each(function () {
            $this = $(this);
            try {
                $this.getTemplate(function (data) {
                    $this.setTemplate(data);
                    $this.processTemplate(templateModel);
                });
            } catch (e) {
                onError(e)
            }
        });
    };    
})(jQuery);