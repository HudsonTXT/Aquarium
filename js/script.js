var defaults = {
    speed: 7000,
    time: 30 * 1000
};
var game = {
    score: 0, //Очки
    coins: 0,
    speed: defaults.speed, //Скорость (таймер)
    timerNext: 0, // Переменная для обновления таймера
    time: defaults.time, //Время игры
    clicker: 0,
    nick: '',
    allFish: 0,
    updateTimer: function () {
        min = parseInt(game.time / (1000 * 60) % 60);
        if (min < 10) min = "0" + min;
        sec = parseInt((game.time / 1000) % 60);
        if (sec < 10) sec = "0" + sec;

        $('#scores_timer').text(min + ':' + sec);
        if (game.time <= 5000 && game.time > 0) {
            $('#scores_timer').addClass('timeDown');
        }
    },
    setDefaults: function () {
        game.speed = defaults.speed;
        game.time = defaults.time;
        game.score = 0;
        game.coins = 0;
        game.timerNext = 0;
        game.clicker = 0;

        $('#scores_money').text('0');
        $('#scores_value').text('0');
        game.updateTimer();

    },
    init: function () {
        game.setDefaults();
        $('.username').text(game.nick);
        //Инициализация игры
        $('.start').fadeOut(100);
        $('.game').fadeIn(100);

        setInterval(fishes.push, 100); //Запуск рыбок

        setInterval(function () {
            //Обновление таймера и конец игры
            if (game.time <= 0) {
                $('.fish').remove();
                return;
            }
            /*
            * Timer
            * */
            game.time -= 1000;

            game.updateTimer();

        }, 1000);
        game.autoClick();
    },
    replay: function () {
        $('.end').fadeOut(100);
        $('.game').fadeIn(100);
        game.setDefaults();
    },
    autoClick: function () {
        setInterval(function () {
            if (game.clicker && game.time > 0) {
                $('.fish').trigger('click');
            }
        }, 300);
    },
    end: function () {
        $('.fish').remove();
        $('#scores_timer').removeClass('timeDown');
        $('.game').fadeOut(500, function () {
            $('.end').css('display', 'flex').fadeIn();
        });
        $('.results_fishes span').text(game.score);
        $('.results_moneys span').text(game.coins);
    }
};

var fishes = {
    push: function () {
        /*
        * Если мало рыбок, добавляем еще
        * */
        if (game.time > 0 && $('.fish').length <= 3) {
            if (randomInteger(0, 5) === 0) fishes.spawn();
        }
        var now = (new Date).getTime();
        if (game.timerNext && (game.timerNext - randomInteger(0, game.speed / 2)) > now) return;
        if (game.time <= 0) {
            if ($('.end').css('display') === 'none') {
                game.end();
            }
            return;
        }
        game.timerNext = now + game.speed;
        fishes.spawn();

    },
    spawn: function () {
        //Показываем рыб
        for (var i = 0; i < randomInteger(1, 5); i++) {
            new Fish(randomInteger(1, 7)).add();
            game.allFish++;
        }

        /* *
        * Усложнение уровня
        * */
        if (game.speed > 2000) game.speed -= randomInteger(100, 300);
    },
    type: {
        1: {
            name: "Проста рыба",
            speed: 100,
            coins: 1,
        },
        2: {
            name: "Краб",
            speed: 90,
            coins: 2,
        },
        3: {
            name: "Рыба - ёж",
            speed: 80,
            coins: 3,
        },
        4: {
            name: "Рыба - клоун",
            speed: 70,
            coins: 4,
        },
        5: {
            name: "Рыба - зелёнка",
            speed: 60,
            coins: 5,
        },
        6: {
            name: "Акула",
            speed: 30,
            coins: 10,
        },
        7: {
            name: "Рыба - треугольник",
            speed: 50,
            coins: 6,
        }
    },
};

var Fish = function (type) {
    /*
    * Класс рыбы
    * */
    this.type = type; //Тип
    this.top = randomInteger(10, 90); //Рандомная высота
    this.left = randomInteger(1, 10); //Рандомный отступ от левого крана при появлении
    this.speed = randomInteger((game.speed / 100 * fishes.type[this.type].speed) / 1.1, (game.speed / 100 * fishes.type[this.type].speed) * 1.1); //Рандомная скорость
    this.coins = fishes.type[this.type].coins; //Монеты за улов рыбы
    this.view =
        $('<div class="fish fish' + this.type + '"></div>')
            .css({top: this.top + '%', left: this.left + '%'})
            .animate({left: '100%'}, this.speed, 'linear', Fish.hide)
            .bind({click: Fish.kill})
            .attr('data-coins', this.coins);

    /*
    * Добавляем рыбу на игровое поле
    * */
    this.add = function () {
        $('.game').append(this.view)
    };
};
/*
* Скрываем рыб после того, как они проплыли
* */
Fish.hide = function () {
    $(this).remove();
};

/*
* Нажимаем / убиваем рыбу
* */
Fish.kill = function () {
    if (!game.clicker) {
        new Audio('mp3/calm.mp3').play();
    }

    $(this).clearQueue().animate({opacity: 0, top: "-=20%"}, 200, 'linear', function () {
        $(this).remove();
    });
    game.score++;
    game.coins += parseInt($(this).data('coins'));
    $('#scores_value').text(game.score);

    $('#scores_money').clearQueue().text(game.coins).animate({fontSize: "100px"}, 100, "linear", function () {
        $(this).animate({fontSize: "72px"}, 100);
    });


};


$(function () {
    $('.start_form__name input').on('keypress', function () {
        game.nick = $(this).val();
        if (game.nick) {
            $('.start_form_button').fadeIn();
        }
    });
    $('.start_form_button').on('click', function () {
        game.nick = $('.start_form__name input').val();
        if (game.nick) {
            game.init();
        } else {
            $(this).fadeOut();
        }
    });

    $('.game_replay').on('click', function () {
        game.replay();

    });

    $('.toggleClicker').click(function () {
        console.log("Cliker toggle");
        game.clicker = !game.clicker;
    });
});


function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}