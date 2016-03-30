$(document).ready(function() {
    $('#pagepiling').pagepiling({
        navigation: {
            'position': 'right',
        }
    });

    var client = {

        initialize : function(){
            this.setUpListeners();
        },

        setUpListeners: function(){
            $(document).on('click', 'header .menu', this.showMenu);
            $(document).on('mouseenter', '.tooltipshow', this.showTooltip);
            $(document).on('mouseleave', '.tooltipshow', this.hideTooltip);
            $(window).scroll(this.showToTop);
            $(document).on('click', '#to_top',this.toTop);
            $(document).on('submit', '#personal_data form, #make_order form',this.submitForm);
            $(document).on('click', '.vlogger_list .refresh',this.getMore);
            $(document).on('keydown', '.limited',this.limitText);
            $(document).on('keyup', '.limited',this.countSymbols);
            $(document).on('click', '.toggle .ui.checkbox',this.countFilterChecked);
            $(document).on('click', '#filter .title',this.toggleOverflow);
            $(document).on('click', '#filter .bulleye',this.closeOverflow);
        },

        closeOverflow: function(){
            var toggle = $('.toggle');
            toggle.slideUp().siblings('.title').removeClass('opened').siblings('.tip').slideUp();
        },

        toggleOverflow: function(){
            $(this).toggleClass('opened').siblings('.toggle').slideToggle().siblings('.tip').slideToggle();
        },

        countFilterChecked: function(){
            var checked = $(this).closest('.toggle').find('input:checked'),
                count=0;
            checked.each(function(){
                count++;
            });
            if(count == 0){
                count ='';
            }
            $(this).closest('.toggle').siblings('.tip').find('span').text(count);
        },

        showTooltip: function(){
            $(this).find('.tooltip').show(100);
        },

        hideTooltip: function(){
            var tooltipshow = $(this);
            setTimeout(function(){
                if(!tooltipshow.find(':hover').length)
                    tooltipshow.find('.tooltip').hide(100);
            },1000);
        },

        toTop: function(){
            $('body,html').animate({scrollTop:0},800);
        },

        showToTop: function(){
            var toTop = $('#to_top');
            if($(this).scrollTop() > 200) {
                toTop.fadeIn();
            } else {
                toTop.fadeOut();
            }
        },

        showMenu: function(){

            var nav = $('header nav'),
                icon = $('#nav-icon');

            icon.toggleClass('open');
            nav.slideToggle();

        },

        getMore: function(e){

            var button = $(this),
                icon = button.find('i');

            icon.addClass('rotate');

            $.ajax({
                url: "/_parts/vloggers.html",
                type: "POST",
                data: {},
                dataType: "html",
                success: function(data){
                    // @todo
                    // в рабочей версии необходимо убрать задержку setTimeout()
                    // она тут сделана для наглядности анимации кнопки подгрузки влоггеров
                    setTimeout(function(){
                        icon.removeClass('rotate');
                        button.siblings('.vloggers').append(data);
                    },1200);
                },
                error: function( xhr, status, errorThrown ) {
                    alert( "Sorry, there was a problem!" );
                    console.log( "Error: " + errorThrown );
                    console.log( "Status: " + status );
                    console.dir( xhr );
                }
            });

            e.preventDefault();

        },

        limitText: function(e){
            var limited = $(this),
                value = limited.val(),
                quantity = value.length,
                limit = limited.data('limit'),
                sliced = value.slice(0, limit),
                symbols = limited.siblings('.symbols');
            if(e.keyCode !== 13 && e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40){
                if(quantity >= limit){
                    limited.val(sliced);
                    e.preventDefault();
                }
            }
        },

        countSymbols: function(){
            var limited = $(this),
                value = limited.val(),
                quantity = value.length,
                limit = limited.data('limit'),
                symbols = limited.siblings('.symbols');
            symbols.text(quantity+'/'+limit);
        },

        submitForm: function (e) {

            var form = $(this),
                formData = form.serialize();

            if ( client.validateForm(form) === false )
                return false;

            console.log('GO AJAX! ==> ' + formData);

            e.preventDefault();

        },

        validateForm: function(form) {

            var inputs = form.find('input.required'),
                textarea = form.find('textarea'),
                valid = true;

            inputs.each(function(index, el) {

                var input = $(el),
                    val = $.trim( input.val() )
                label = input.siblings('label'),
                    err = 'Обязательно для заполнения';
                input.removeClass('error').siblings('.tip').text('');;
                if ( val.length === 0 ) {

                    input.addClass('error').siblings('.tip').text(err);

                    valid = false;

                }


            });

            return valid;

        }

    }

    client.initialize();
});