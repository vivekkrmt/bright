function karlaSystemJs() {
    $(document).on('click', '[data-href]', function (e) {
        e.preventDefault();

        var $this = $(this);

        $.ajax({
            url: $(this).data('href'),
            data: { format: 'json' },
            complete: function (xhr) {
                displayNoti(xhr, $this);
            }
        });
    });

    $(document).on('click', '[data-post]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var data = $this.data('post-data');

        $.ajax({
            url: $(this).data('post'),
            data: data,
            method: "POST",
            complete: function (xhr) {
                displayNoti(xhr, $this);
            }
        });
    });

    //common delete script
    $(document).on('click', '[data-delete], [data-action="delete"]', function (e) {
        if (!confirm('Are you sure want to delete?')) {
            return false;
        }

        var $this = $(this);
        var tag = $this.data('tag') || 'tr';
        var parent = $this.parents(tag + ':eq(0)');
        var link = $(this).attr('href') || $this.data('delete');

        $.ajax({
            url: link,
            data: { format: 'json' },
            complete: function (xhr) {
                var res = parseJSON(xhr.responseText);
                if (isSuccess(res.status)) {
                    parent.remove();
                    $('[ajax-total]').html(parseInt($('[ajax-total]').text()) - 1);
                }

                displayNoti(xhr, $this);
            }
        });

        e.preventDefault();
    });

    //common delete script
    $(document).on('click', '[data-ajax]', function (e) {

        var $this = $(this);
        var link = $(this).attr('href') || $this.data('ajax');

        $.ajax({
            url: link,
            data: { format: 'json' },
            complete: function (xhr) {
                displayNoti(xhr, $this);
            }
        });

        e.preventDefault();
    });

    //common status change script
    $(document).on('click', '.ac-action-status a', function (e) {
        var $this = $(this);
        var parent = $this.parent('.ac-action-status');

        $.ajax({
            url: parent.data('link'),
            data: { status: $this.data('status'), format: 'json' },
            complete: function (xhr) {
                var res = parseJSON(xhr.responseText);
                if (isSuccess(res.status)) {
                    parent.find('a:hidden').show();
                    $this.hide();
                }

                displayNoti(xhr, $this);
            }
        });

        e.preventDefault();
    });

    //common status change script
    $(document).on('change', '.ac-action-status select', function (e) {
        var $this = $(this);
        var parent = $this.parent('.ac-action-status');
        var v = $(this).val();

        $.ajax({
            url: parent.data('link'),
            data: { status: v, format: 'json' },
            complete: function (xhr) {
                displayNoti(xhr, $this);
            }
        });

        e.preventDefault();
    });

    //common delete script
    $(document).on('click', '[ajax-confirm]', function (e) {
        if (!confirm('Are you sure want to proceed?'))
            return false;

        var $this = $(this);

        $.ajax({
            url: $(this).attr('href'),
            data: { format: 'json' },
            complete: function (xhr) {
                displayNoti(xhr, $this);
            }
        });

        e.preventDefault();
    });

    $(document).on("click", "[ajax-reset]", function (e) {
        var form = getForm($(this));
        form[0].reset();
        e.preventDefault();
        form.submit();
    });

    $(document).on('click', "[ajax-export]", function (e) {
        var $this = $(this);
        var form = getForm($this);
        var base = $this.attr('base-href');

        if (base === undefined) {
            $this.attr('base-href', $this.attr('href'));
        }

        var url = $this.attr('base-href');
        var separator = url.indexOf('?') > 0 ? '&' : '?';

        $this.attr('href', url + separator + form.serialize());
    });

    $(document).on('click', '[data-task]', function (e) {
        var $this = $(this);
        var form = getForm($this);

        var task = $this.data('task');
        var name = $this.data('task-name') || 'task';
        var input = form.find("input[name='" + name + "']");

        if (input.length > 0) {
            var oldtask = input.attr('task', input.val());
            input.val(task);
        } else {
            $('<input/>', {
                name: name,
                value: task,
                type: 'hidden'
            }).appendTo(form);
        }

        $(document).trigger('form:reset', $this);

        if ($this.attr('type') != "submit") {
            form.submit();
            e.preventDefault();
        }
    });

    $(document).on('click', '[data-order]', function (e) {
        e.preventDefault();

        var name = $(this).attr('data-order');
        var order = $(this).attr('data-order-type') || 'ASC';
        $('[data-order]').removeClass('ordering');
        $(this).addClass('ordering');

        var task = 1;
        var page = 1;

        if (new RegExp('ASC').test(order)) {
            task = 0;
        }

        if (task == 1) {
            $(this).attr('data-order-type', 'ASC');
            $(this).removeClass('desc').addClass('asc');
        } else {
            $(this).removeClass('asc').addClass('desc');
            $(this).attr('data-order-type', 'DESC');
        }
        var form = getForm($(this));;

        if (form.find('.ac-sort-name').length > 0) {
            $('.ac-sort-name').val(name);
        } else {
            $('<input/>', {
                class: 'ac-sort-name',
                name: 'sort',
                value: name,
                type: 'hidden'
            }).appendTo(form);
        }

        if (form.find('.ac-sort-order').length > 0) {
            $('.ac-sort-order').val(order);
        } else {
            $('<input/>', {
                class: 'ac-sort-order',
                name: 'order',
                value: order,
                type: 'hidden'
            }).appendTo(form);
        }

        form.find("input[name='page']").val(page);
        $('#page').val(page);
        form.submit();
    });

    $("[notchecked]").each(function () {
        $(this).prev('[dummy-checkbox]').remove();
        $(this).before('<input type="hidden" name="' + $(this).attr("name") + '" value="' + $(this).attr("notchecked") + '"  dummy-checkbox="true"/>');
    });

    $(document).on('change', '[notchecked]', function () {
        $(this).prev('[dummy-checkbox]').remove();
        $(this).before('<input type="hidden" name="' + $(this).attr("name") + '" value="' + $(this).attr("notchecked") + '"  dummy-checkbox="true"/>');
    });

    $(document).on("click", "[data-prevent]", function (e) {
        e.preventDefault();
        return false;
    });

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
        }
    });

    $(document).on("click", ".noty_close", function (e) {
        $(this)
            .parents(".noty_bar:first")
            .slideUp("slow");
    });

    $(document).on("click", "div.is-invalid-feedback", function () {
        $(this).fadeOut();
    });

    $(document).on('form:reset', function (e) {
        var form = getForm($(this));
        form.find("input[name=page]").val(1);
        $('#page').val(1);

        var total = form.find('[data-total]').data('total');

        if (total == '' || total == undefined) {
            var total = form.find('input[name=total]').val();
        }

        form.find("input[name=total]").val(total);
        form.find('[ajax-total]').html(total);
    });

    $(document).on("click", "[data-filter]", function () {
        $(document).trigger('form:reset', $(this));
    });

    $(document).on("keyup blur", "[data-slug]", function (e) {
        var target = $(this).data("slug");
        var realTarget = "[data-slug-" + target + "]";

        var value = $(this).val();
        value = $.trim(value);
        value = value
            .replace(/[^a-z0-9-]/gi, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        value = value.toLowerCase();

        $(realTarget).val(value);
    });

    $(document).on("keyup blur", "[data-copy]", function (e) {
        var target = $(this).data("copy");
        var realTarget = "[data-copy-" + target + "]";

        $(realTarget).val(value);
    });

    $(document).on("click", "[data-add]", function (e) {
        var target = $(this).parents('table:first');
        var clone = target.find("tfoot:first tr").clone();
        target.find('tbody:first').append(clone);

        e.preventDefault();
    });

    $(document).on("click", "[data-remove]", function (e) {
        $(this)
            .parents("tr:eq(0)")
            .remove();

        e.preventDefault();
    });

    $(document).on('change', ".custom-file-input", function () {
        var files = $(this).prop("files");

        if (files.length > 0) {
            var name = files[0]['name'];
            $(this).parent().find('.custom-file-label').html(name);
        }
    });

    //prevent hash url
    $(document).on("click", 'a[href="#"]', function (e) {
        e.preventDefault();
    });

    $(document).on("click", "[role=login]", function (e) {
        if (is_user_logged_in) {
            return true;
        }

        e.preventDefault();
        var $this = $(this);
        var url = $this.attr("href") ? $this.attr("href") : "/login";

        $.fn.easyModalShow({
            url: url,
            event: 'ready'
        });
    });

    if ($.support.pjax) {
        $(document).on("click", "[data-pjax] a, a[data-pjax]", function (e) {
            if ($(this).data('nojax')) {
                return true;
            }

            var container = $(this).data("pjax-container") || "[data-pjax-container]";
            $(this).parents("[data-pjax]").find("a").removeClass("active");
            $(this).addClass("active");

            $.pjax.click(e, { container: container });
        });

        $(document).on('pjax:end', function () {
            $(document).trigger('ajax:loaded');
        });
    }

    $(document).on('click', '[data-poload]', function (e) {
        var $this = $(this);
        //$this.off('hover');
        $.get($this.data('poload'), { format: 'html' }, function (d) {
            $this.popover("dispose")
            $this.popover({
                content: d,
                html: true,
                placement: 'bottom'
            }).popover('show');
        });

        $this.on("show.bs.popover", function (e) {
            $("[data-poload]").not(e.target).popover("dispose");
            $(document).trigger('ajax:loaded');
        });

        e.preventDefault();
    });


    $('body').on('click', function (e) {
        $('[data-original-title]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $(document).on('click', '[data-popover]', function (e) {
        var $this = $(this);
        var d = $($this.data('popover')).html();

        $this.popover({
            content: d,
            html: true,
            placement: 'bottom'
        }).popover('show');

        $this.on("show.bs.popover", function (e) {
            $("[data-popover]").not(e.target).popover("dispose");
        });

        e.preventDefault();
    });

    $(document).on('click', '[data-toggle="tabs"] a', function (e) {
        e.preventDefault();
        $(this).tab('show');
        window.location.hash = this.hash;
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        $('html,body').scrollTop(scrollmem);
    });

    var hash = window.location.hash;
    if (hash) {
        $('[data-toggle="tabs"] a[href="' + hash + '"]').tab('show');
        $('[data-toggle="tab"][href="' + hash + '"]').tab('show');
    }

    $(window).on('hashchange', function () {
        var hash = window.location.hash;
        if (hash) {
            $('[data-toggle="tabs"], a[href="' + hash + '"]').tab('show');
            $('[data-toggle="tab"][href="' + hash + '"]').tab('show');
        }
    });

    $(document).on('click', '[data-toggle="sidebar"]', function () {
        $(this).toggleClass('collapsed');
        var target = $(this).data('target');
        $(target).toggleClass('in');
    });

    $(document).on('click', '[data-toggle="backdrop"]', function () {
        var parent = $(this).parent();
        $(parent).removeClass('in');

        var target = parent.attr('id');
        $('[data-target="#' + target + '"]').addClass('collapsed');
    });

    $(document).on('click', '#search', function () {
        $(this).parents('div:first').toggleClass('active');
    });

    $(document).on('click', '[data-task-checkbox]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var form = getForm($this);

        var task = $this.data('task-checkbox');
        var name = $this.data('task-name') || 'task';
        var input = form.find("input[name='" + name + "']");

        //check the checkbox
        $this.parents('tr:first').find('input[type="checkbox"]').attr('checked', true);

        if (input.length > 0) {
            var oldtask = input.attr('task', input.val());
            input.val(task);
        } else {
            $('<input/>', {
                name: name,
                value: task,
                type: 'hidden'
            }).appendTo(form);
        }

        form.submit();
    });


    var timer;
    $(document).on('change', '[auto-submit]', function () {
        var delay = 1000;

        if (timer) {
            clearTimeout(timer);
        }

        var form = getForm($(this));
        timer = setTimeout(function () {
            form.submit();
        }, delay);

    });

    $(document).on('keyup', '[auto-keyup-submit]', function () {
        var val = $.trim($(this).val());
        var min = 3;
        var delay = 1000;
        var form = getForm($(this));

        if (val.length == 0) {
            form.submit();
        }

        if (val.length < min) {
            return false;
        }

        if (timer) {
            clearTimeout(timer);
        }

        $(document).trigger('form:reset', $(this));

        timer = setTimeout(function () {
            return form.submit();
        }, delay);
    });

    $(document).on('click', '.dropdown-select a', function () {
        var dropdown = $(this).parents('.dropdown');
        var target = dropdown.find('.dropdown-toggle');
        target.prev('input').val($(this).data('value')).trigger('change');

        target.html($(this).html());
    });
};
