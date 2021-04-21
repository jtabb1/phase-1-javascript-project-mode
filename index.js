console.log('hello');

const URL_BASE = 'https://api.quotable.io/'
let curPage = 1;

const showPanel = document.querySelector('#show-panel')

document.addEventListener("DOMContentLoaded", function() {

// Function Call(s):
getQuotes(curPage).then(showQuotes).catch(console.log);
addNavListeners();

function getQuotes(page) {
    const limit = 2;
    const skip = (page - 1) * limit;
    return fetch(`${URL_BASE}quotes?limit=${limit}&skip=${skip}`)
    .then(r => r.json());
}

function showQuotes(jsonObj) {
    clearQuotesList();
    const list = document.querySelector('#quote-list')
    jsonObj.results.forEach(quote => {
        const li = createQuoteLi(quote);
        list.append(li);
    });
}

function clearQuotesList() {
    document.querySelector('#quote-list').innerHTML = '';
}

function createQuoteLi(quote) {
    const li = document.createElement('li');
    const br = document.createElement('br');

    const p1 = document.createElement('p');
    p1.innerText = quote.content;

    const p2 = document.createElement('p');

    const sp = document.createElement('span');
    sp.innerText = 'Your rating: ';

    const inputRating = document.createElement('input');
    inputRating.id = `rating${quote.id}`;
    inputRating.disabled = 'disabled';
    inputRating.innerHTML = 0;

    const minusBtn = document.createElement('button');
    minusBtn.id = `minus${quote.id}`;
    minusBtn.innerHTML = 'Minus 1';
    // minusBtn.addEventListener('click', minusOne);

    const plusBtn = document.createElement('button');
    plusBtn.id = `plus${quote.id}`;
    plusBtn.innerHTML = 'Plus 1';
    // plusBtn.addEventListener('click', plusOne);

    const p3 = document.createElement('p');
    p3.innerText = quote.content;

    p2.append(sp, inputRating);
    li.append(p1, p2, minusBtn, plusBtn);

    return li;
}

function addNavListeners() {
    let backBtn1 = document.querySelector('#back1'),
    forwardBtn1 = document.querySelector('#forward1');
    backBtn2 = document.querySelector('#back2'),
    forwardBtn2 = document.querySelector('#forward2');
    // let backBtn = document.querySelector('#back'),
    // forwardBtn = document.querySelector('#forward');

    backBtn1.addEventListener('click', () => {
        prevPage();
    });
    forwardBtn1.addEventListener('click', () => {
        nextPage();
    });
    backBtn2.addEventListener('click', () => {
        prevPage();
    });
    forwardBtn2.addEventListener('click', () => {
        nextPage();
    });
}

function nextPage() {
    getQuotes(++curPage).then(showQuotes);
}

function prevPage() {
    if (curPage <= 1) {
        return;
    } else {
        getQuotes(--curPage).then(showQuotes);
    }
}


});