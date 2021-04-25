console.log('Hello.');

const URL_BASE = 'https://api.quotable.io/'

let numPages;
let curPage = 1;
const quotesPerPage = 2
let quoteNum;

const showPanel = document.querySelector('#show-panel')

document.addEventListener("DOMContentLoaded", function() {

// Function Call(s):
getQuotes(curPage).then(showQuotes).catch(console.log);
addNavListeners();

function getQuotes(page) {
    // const limit = 2;
    const skip = (page - 1) * quotesPerPage;
    quoteNum = 1;
    console.log(`${quotesPerPage}, ${skip}`);
    return fetch(`${URL_BASE}quotes?limit=${quotesPerPage}&skip=${skip}`)
    .then(r => r.json());
}

function showQuotes(jsonObj) {
    console.log(jsonObj);
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
    const quoteId = String(curPage).padStart(4,'0') + String(quoteNum).padStart(2,'0');
    const li = document.createElement('li');
    const br = document.createElement('br');

    const p1 = document.createElement('p');
    p1.innerText = quote.content;

    const p2 = document.createElement('p');

    const sp = document.createElement('span');
    sp.innerText = 'Your rating: ';

    const inputRating = document.createElement('span');
    inputRating.id = `rating${quoteId}`;
    inputRating.innerHTML = rateQuote(quoteId);
    p2.append(sp, inputRating);

    const minusBtn = document.createElement('button');
    minusBtn.id = `minus1${quoteId}`;
    minusBtn.innerHTML = 'Minus 1';
    minusBtn.addEventListener('click', minusOne);

    const plusBtn = document.createElement('button');
    plusBtn.id = `plus1_${quoteId}`;
    plusBtn.innerHTML = 'Plus 1';
    plusBtn.addEventListener('click', plusOne);

    const p3 = document.createElement('p'); // do I have to append the br to the p3 just to get that space
    p3.append(br);

    li.append(p1, p2, minusBtn, plusBtn, p3);
    recordQuote(quote, quoteId);
    ++quoteNum;
    return li;
}

function rateQuote(quoteId) {
    if (!!document.body.dataset[`rating${quoteId}`]) {
        return document.body.dataset[`rating${quoteId}`];
    }
    return '0';
}

// Can utilize the code below in slow network conditions
// How do I branch in git
function recordQuote(quote, quoteId) {
    console.log(quoteId);

    document.body.dataset[`quote_${quoteId}`] = quote.content;
    document.body.dataset[`author${quoteId}`] = quote.author;
    document.body.dataset[`arSlug${quoteId}`] = quote.authorSlug;
    document.body.dataset[`themes${quoteId}`] = writeThemes(quote.tags);
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
    recordRating(quoteId, rating);
    maybeShowMyFavesBtn();
}

function minusOne(e) {
    const elementId = e.target.id;
    const quoteId = elementId.slice(6);
    const inputRating = document.getElementById(`rating${quoteId}`);
    rating = parseInt(inputRating.innerHTML);
    inputRating.innerHTML = --rating;
    recordRating(quoteId, rating);
    maybeShowMyFavesBtn();
}

function recordRating(quoteId, rating) {
    const dataDiv = document.getElementById('data-div');
    dataDiv.classList.add(quoteId);
    document.body.dataset[`rating${quoteId}`] = rating;
}

function maybeShowMyFavesBtn() {
    if (numRatings() > 1) {
        document.getElementById('show-other1').classList.remove('hidden');
        document.getElementById('show-other2').classList.remove('hidden');
    }
}

function numRatings() {
    const dataDiv = document.getElementById('data-div');
    return dataDiv.className.split(' ').length;
}

function addNavListeners() {
    let backBtn1 = document.querySelector('#back1'),
    forwardBtn1 = document.querySelector('#forward1'),
    showOtherBtn1 = document.querySelector('#show-other1'),
    randomPageBtn1 = document.querySelector('#random-page1'),
    backBtn2 = document.querySelector('#back2'),
    forwardBtn2 = document.querySelector('#forward2'),
    showOtherBtn2 = document.querySelector('#show-other2');
    randomPageBtn2 = document.querySelector('#random-page2');

    backBtn1.addEventListener('click', () => {
        prevPage();
    });
    forwardBtn1.addEventListener('click', () => {
        nextPage();
    });
    showOtherBtn1.addEventListener('click', (e) => {
        showOther(e);
    });
    randomPageBtn1.addEventListener('click', () => {
        1;
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
    randomPageBtn2.addEventListener('click', () => {
        2;
    });
}

function getRandomPage() {
    
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
        domChange4ShowMyFavorites();
    } else {
        getQuotes(curPage).then(showQuotes).catch(console.log);
        domChange4ContinueRatingQuotes();
    }
} 

function showMyFavorites () {
    clearQuotesList();
    const quotesUl = document.getElementById("quote-list");
    const faves = getMyFavorites();
    faves.forEach( fave => {
        quotesUl.append(makeFaveLi(fave));
    });
}

function domChange4ShowMyFavorites() {
        document.getElementById('show-other1').innerHTML = 'Continue Rating Quotes';
        document.getElementById('show-other2').innerHTML = 'Continue Rating Quotes';
        document.getElementById('forward1').classList.add('hidden');
        document.getElementById('back1').classList.add('hidden');
        document.getElementById('forward2').classList.add('hidden');
        document.getElementById('back2').classList.add('hidden');
}

function domChange4ContinueRatingQuotes() {
        document.getElementById('show-other1').innerHTML = 'Show My Favorites';
        document.getElementById('show-other2').innerHTML = 'Show My Favorites';
        document.getElementById('forward1').classList.remove('hidden');
        document.getElementById('back1').classList.remove('hidden');
        document.getElementById('forward2').classList.remove('hidden');
        document.getElementById('back2').classList.remove('hidden');
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

function makeFaveLi(fave){
    const quoteId = fave.quoteId;
    const rating = fave.rating;
    const quote = rating + ': ' + document.body.dataset[`quote_${quoteId}`];
    const author = document.body.dataset[`author${quoteId}`];

    const li = document.createElement('li');
    li.className = 'remove-dots';

    const bq = document.createElement('blockquote');
    bq.classname = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0';
    p.innerHTML = quote;

    const fr = document.createElement('footer');
    fr.className = 'blockquote-footer';
    fr.innerHTML = author;

    const br = document.createElement('br');

    bq.append(p, fr, br);
    li.append(bq);

    return li;
}


}); // <= for the DOMContentLoaded function way above

