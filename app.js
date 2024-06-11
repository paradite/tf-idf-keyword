function inputHandler() {
  const tfHash = processText(this.value.trim());
  const idfHash = Object.keys(tfHash).reduce(function(idfHash, curr) {
    idfHash[curr] = [
      idf(curr) * tfHash[curr], 
      `${formatNumber(tfHash[curr])} / ${formatNumber(idf(curr))} / ${formatNumber(idf(curr) * tfHash[curr])}`
    ];
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

function formatNumber(number) {
  // pad to 4 decimal places
  // return Math.round(number * 1000) / 1000;
  return number.toFixed(4);
}

function padText(text, length) {
  length = Math.max(length, text.length);
  // encode html entities
  return '&nbsp;'.repeat(length - text.length) + text;
}

const topN = 40;
const stopwords = new Set([
  '16x', 'found', 'posts', 'submission', 'rchatgpt', 'rchatgptcoding', 'like',
  'title', 'url', 'r', 'im', 'ive',
  'coding', 'ai', 'code', 'chatgpt', 'reddit', 'prompt', 'keyword', 'comments',
  'i', 'you', 'vs', 'any', 'me', 'my', 'can', 'use',
  'this', 'there', 'but', 'all',
  'i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now',
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'
]);

function printResult(resultHash) {
  let resultArr = Object.keys(resultHash).map((key) => [key, resultHash[key][0], resultHash[key][1]]);
  resultArr.sort((a, b) => { return b[1] - a[1]; });
  // filter out stopwords
  resultArr = resultArr.filter((curr) => !stopwords.has(curr[0]));
  const renderedText = resultArr.slice(0, topN).reduce((previousText, curr) => {
    const displayedValue = curr[2];
    previousText += `${padText(curr[0], 15)}: ${displayedValue}`;
    previousText += '<br>';
    return previousText;
  }, `<p>Top ${topN} keywords and their tf / idf / tf-idf</p>`);
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
