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

    const inputRating = document.createElement('span');
    inputRating.id = `rating${quote._id}`;
    inputRating.innerHTML = rateQuote(quote._id);
    p2.append(sp, inputRating);

    const minusBtn = document.createElement('button');
    minusBtn.id = `minus1${quote._id}`;
    minusBtn.innerHTML = 'Minus 1';
    minusBtn.addEventListener('click', minusOne);

    const plusBtn = document.createElement('button');
    plusBtn.id = `plus1_${quote._id}`;
    plusBtn.innerHTML = 'Plus 1';
    plusBtn.addEventListener('click', plusOne);

    const p3 = document.createElement('p'); // do I have to append the br to the p3 just to get that space
    p3.append(br);

    li.append(p1, p2, minusBtn, plusBtn, p3);
    recordQuote(quote);
    return li;
}

function rateQuote(quoteId) {
    if (!!document.body.dataset[`rating${quoteId}`]) {
        return document.body.dataset[`rating${quoteId}`];
    }
    return quoteId = '0';
}

// Can utilize the code below in slow network conditions
// How do I branch in git
function recordQuote(quote) {
    document.body.dataset[`quote_${quote._id}`] = quote.content;
    document.body.dataset[`author${quote._id}`] = quote.author;
    document.body.dataset[`arSlug${quote._id}`] = quote.authorSlug;
    document.body.dataset[`themes${quote._id}`] = writeThemes(quote.tags);
}

function writeThemes(tags) {
    const len = tags.length;
    if (len < 3) {
        return (len === 2 ? `${tags[0]} and ${tags[1]}` : `${tags[0]}`);
    } else {
        const last = ' and ' + tags[len-1];
        return (tags.slice(0,len-1).join(', ') + last);
    }
}

function plusOne(e) {
    const elementId = e.target.id;
    const quoteId = elementId.slice(6);
    const inputRating = document.getElementById(`rating${quoteId}`);
    rating = parseInt(inputRating.innerHTML);
    inputRating.innerHTML = ++rating;
    recordRating(quoteId, rating);    // maybe show button
}

function minusOne(e) {
    const elementId = e.target.id;
    const quoteId = elementId.slice(6);
    const inputRating = document.getElementById(`rating${quoteId}`);
    rating = parseInt(inputRating.innerHTML);
    inputRating.innerHTML = --rating;
    recordRating(quoteId, rating);    // maybe show button
}

function recordRating(quoteId, rating) {
    const dataDiv = document.getElementById('data-div');
    dataDiv.classList.add(quoteId);
    document.body.dataset[`rating${quoteId}`] = rating;
}

function addNavListeners() {
    let backBtn1 = document.querySelector('#back1'),
    forwardBtn1 = document.querySelector('#forward1'),
    showOtherBtn1 = document.querySelector('#show-other1'),
    backBtn2 = document.querySelector('#back2'),
    forwardBtn2 = document.querySelector('#forward2'),
    showOtherBtn2 = document.querySelector('#show-other2');

    backBtn1.addEventListener('click', () => {
        prevPage();
    });
    forwardBtn1.addEventListener('click', () => {
        nextPage();
    });
    showOtherBtn1.addEventListener('click', (e) => {
        showOther(e);
    });
    backBtn2.addEventListener('click', () => {
        prevPage();
    });
    forwardBtn2.addEventListener('click', () => {
        nextPage();
    }); 
    showOtherBtn2.addEventListener('click', (e) => {
        showOther(e);
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

function showOther(e) {
    const msg = e.target.innerHTML;
    if (msg === "Show My Favorites") {
        showMyFavorites();
        document.getElementById('show-other1')
        .innerHTML = 'Continue Rating Quotes';
        document.getElementById('show-other2')
        .innerHTML = 'Continue Rating Quotes';
    } else {
        getQuotes(curPage).then(showQuotes).catch(console.log);
        document.getElementById('show-other1')
        .innerHTML = 'Show My Favorites';
        document.getElementById('show-other2')
        .innerHTML = 'Show My Favorites';
    }
} 

function showMyFavorites () {
    clearQuotesList();
    const faves = getMyFavorites();
}

function getMyFavorites () {
    const ratingArr = [];
    const dataDiv = document.getElementById('data-div');
    const quoteIds = dataDiv.className.split(' ');
    quoteIds.forEach( qteId => {
        const num = parseInt(
            document.body.dataset[`rating${qteId}`]);
        ratingArr.push({rating: num, quoteId: qteId});
    })
    ratingArr.sort((a,b) => b.rating - a.rating);
    console.log(ratingArr);
    return ratingArr;
}


}); // <= for the DOMContentLoaded function way above