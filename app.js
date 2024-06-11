function inputHandler() {
  const tfHash = processText(this.value.trim());
  const idfHash = Object.keys(tfHash).reduce(function(idfHash, curr) {
    idfHash[curr] = idf(curr) * tfHash[curr];
    return idfHash;
  }, {});
  printResult(idfHash);
}

function processText(text) {
  const tokens = tokenize(text);
  const tfHash = tf(tokens.map(normalize).filter(filter));
  return tfHash;
}

function filter(word) {
  return word !== '' && isNaN(word)
}

function tf(words) {
  return words.reduce((tfHash, curr, _index, words) => {
    if (tfHash[curr]) {
      tfHash[curr] += 1 / words.length;
    } else {
      tfHash[curr] = 1 / words.length;
    }
    return tfHash;
  }, {});
}

function idf(word) {
  const df = tokenizedDocs.reduce((count, curr) => {
    if (curr.includes(word)) {
      count++;
    }
    return count;
  }, 0);
  // 1 + df for out of vocabulary words
  return Math.log10(1 + tokenizedDocs.length / (1 + df));
}

function printResult(resultHash) {
  const resultArr = Object.keys(resultHash).map((key) => [key, resultHash[key]]);
  resultArr.sort((a, b) => { return b[1] - a[1]; });
  const renderedText = resultArr.slice(0, 20).reduce((previousText, curr) => {
    const displayedValue = Math.round(curr[1] * 1000) / 1000;
    previousText += `${curr[0]}: ${displayedValue}`;
    previousText += '<br>';
    return previousText;
  }, '<p>Top 10 keywords and their tf-idf</p>');
  document.getElementById('result-box').innerHTML = renderedText;
}

// taken from
// https://github.com/yesbabyyes/tfidf/blob/master/lib/tfidf.js
// under MIT License
function normalize(word) {
  return word.toLowerCase().replace(/[^\w]/g, "");
}

// taken from
// https://github.com/yesbabyyes/tfidf/blob/master/lib/tfidf.js
// under MIT License
function tokenize(text) {
  return text.split(/[\s_():.!?,;]+/);
}

const tokenizedDocs = docs.map((text) => {
  return tokenize(text).map(normalize).filter(filter);
});

document.getElementById('input-area').onkeyup = inputHandler;
