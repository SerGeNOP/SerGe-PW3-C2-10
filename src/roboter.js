// Определяем объекты для каждого из прогресс-баров, чтобы их потом менять
const progress_cats = document.querySelector('.progress-bar-cats')
const progress_dogs = document.querySelector('.progress-bar-dogs')
const progress_parrots = document.querySelector('.progress-bar-parrots')

// Определяем объекты для каждой из кнопок для последующей  обработки событий
const cats_btn = document.querySelector('.cats');
const dogs_btn = document.querySelector('.dogs');
const parrots_btn = document.querySelector('.parrots');

// Определяем объекты для строки сообщений и уборки кнопок/результатов
const status_message = document.querySelector('.status-message');
const result_page = document.querySelector('.result-page');
const vote_page = document.querySelector('.vote-page');

//  Флаг, указывающий на факт, что опрашиваемый уже проголосовал.
let vote_flag = false;

const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

const url = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')

const ES = new EventSource(url, header)

ES.onerror = error => {
    ES.readyState ? progress.textContent = "Some error" : null;
}

// Получаем от сервера данные по голосованию
ES.onmessage = ({ data }) => {
    let cats_votes = 0
    let dogs_votes = 0
    let parrots_votes = 0

// парсим поле данных и забираем нужное в переменные
    let data_list = JSON.parse(data);
    for (let key in data_list) {
        if (key == 'cats') { cats_votes = data_list[key] }
        else if (key == 'dogs') { dogs_votes = data_list[key] }
        else if (key == 'parrots') { parrots_votes = data_list[key] };
    }
// рассчитываем процеты по каждому питомцу и правим прогресс-бары
    let all_votes = cats_votes + dogs_votes + parrots_votes;
    progress_cats.style.cssText = `width: ${ Math.round((cats_votes / all_votes)*100) }%`;
    progress_cats.innerText = `Кошки -  ${ Math.round((cats_votes / all_votes)*100) }% ( ${ cats_votes } - голосов)`;

    progress_dogs.style.cssText = `width: ${ Math.round((dogs_votes / all_votes)*100) }%`;
    progress_dogs.innerText = `Собаки -  ${ Math.round((dogs_votes / all_votes)*100) }% ( ${ dogs_votes } - голосов)`;

    progress_parrots.style.cssText = `width: ${ Math.round((parrots_votes / all_votes)*100) }%`;
    progress_parrots.innerText = `Попугаи -  ${ Math.round((parrots_votes / all_votes)*100) }% ( ${ parrots_votes } - голосов)`;
}

//  функция, отправляющая POST-запрос на сервет по заданному URL
function send_vote(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url , true);

    //Передает правильный заголовок в запросе
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Запрос завершен. Здесь можно обрабатывать результат.
        }
    }
    xhr.send(null);
    }

// Блок отслеживания нажатий клавиш
cats_btn.onclick = () =>{
    if (!vote_flag) {
    send_vote('https://sf-pyw.mosyag.in/sse/vote/cats');
    status_message.innerText = "Проголосовано за кошек!";
    vote_flag = true;
    result_page.style.display = 'block';
    vote_page.style.display = 'none';
    }
}

dogs_btn.onclick = () =>{
    if (!vote_flag) {
    send_vote('https://sf-pyw.mosyag.in/sse/vote/dogs');
    status_message.innerText = "Проголосовано за собак!";
    vote_flag = true;
    result_page.style.display = 'block';
    vote_page.style.display = 'none';
    }
}

parrots_btn.onclick = () =>{
if (!vote_flag) {
    send_vote('https://sf-pyw.mosyag.in/sse/vote/parrots');
    status_message.innerText = "Проголосовано за попугаев!";
    vote_flag = true;
    result_page.style.display = 'block';
    vote_page.style.display = 'none';
    }
}
