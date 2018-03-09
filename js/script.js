var game = {
    score: 0, //Очки
    coins: 0,
    speed: 10000, //Скорость (таймер)
    timerNext: 0, // Переменная для обновления таймера
    time: 10 * 1000 * 15, //Время игры
    clicker: 0,
    init: function () {
        //Инициализация игры
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

            min = parseInt(game.time / (1000 * 60) % 60);
            if (min < 10) min = "0" + min;
            sec = parseInt((game.time / 1000) % 60);
            if (sec < 10) sec = "0" + sec;

            $('#scores_timer').text(min + ':' + sec);
            if (game.time <= 5000 && game.time > 0) {
                $('#scores_timer').addClass('timeDown');
            }

        }, 1000);
        game.autoClick();
    },
    autoClick: function () {

            setInterval(function () {
                if (game.clicker && game.time > 0) {
                    $('.fish').eq(-1).trigger('click')
                }
            }, 10);


    },
    end: function () {
        $('.fish').remove();
        $('#scores_timer').removeClass('timeDown');
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
            game.end();
            return;
        }
        game.timerNext = now + game.speed;
        fishes.spawn();

    },
    spawn: function () {
        //Показываем рыб
        for (var i = 0; i < randomInteger(1, 5); i++) new Fish(randomInteger(1, 7)).add();

        /* *
        * Усложнение уровня
        * */
        if (game.speed > 2000) game.speed -= randomInteger(100, 300);
    },
    type: {
        1: {
            name: "Проста рыба",
            speed: 5000,
            coins: 1,
        },
        2: {
            name: "Краб",
            speed: 4500,
            coins: 2,
        },
        3: {
            name: "Рыба - ёж",
            speed: 4000,
            coins: 3,
        },
        4: {
            name: "Рыба - клоун",
            speed: 3500,
            coins: 4,
        },
        5: {
            name: "Рыба - зелёнка",
            speed: 3000,
            coins: 5,
        },
        6: {
            name: "Акула",
            speed: 1500,
            coins: 10,
        },
        7: {
            name: "Рыба - треугольник",
            speed: 2500,
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
    this.speed = randomInteger(fishes.type[this.type].speed / 1.1, fishes.type[this.type].speed * 1.1); //Рандомная скорость
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
        $('.container').append(this.view)
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
    if (!game.clicker){
        new Audio('/mp3/calm.mp3').play();
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
    game.init();

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