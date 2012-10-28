(function ($) {
    $.fn.templatize = function (templateName, model, options) {
        var templatePath = "";
        var templateExtn = ".html";
        var $this = '';
        var settings = $.extend({
            templatePath: templatePath,
            templateType: templateExtn,
            getOnly: false,
            setAndProcessOnly: false,
            processOnly: false,
            template: '',
            success: '',
            error: ''
        }, options);

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
                var error = "An error occured while getting the template " + templateName + ". \n" + e;
                onError(error);
            }
        };

        var setTemplate = function (template) {
            try {
                $this.setTemplate(template);
            } catch (e) {
                var error = "An error occured while setting the template " + templateName + ". \n" + e;
                onError(error);
            }
        };

        var processTemplate = function () {
            try {
                $this.processTemplate(model);
            } catch (e) {
                var error = "An error occured while processing the template " + templateName + ". \n" + e;
                onError(error);
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

        return this.each(function () {
            $this = $(this);
            if (settings.setAndProcessOnly) {
                if (settings.template) {
                    if (!settings.processOnly) {
                        setTemplate(template);
                    }
                    processTemplate(model);
                }
            }
            else {
                getTemplate(function (data) {
                    if (settings.getOnly) {
                        onSuccess(data);
                    }
                    else {
                        setTemplate(data);
                        processTemplate(model);
                        onSuccess();
                    }
                });
            }
        });
    };
})(jQuery);