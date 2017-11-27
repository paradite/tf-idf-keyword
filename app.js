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
  console.log(`df for ${word}: ${df}`);
  console.log(`idf for ${word}: ${Math.log10(1 + tokenizedDocs.length / (1 + df))}`);
  // 1 + df for out of vocabulary words
  return Math.log10(1 + tokenizedDocs.length / (1 + df));
}

function printResult(resultHash) {
  const resultArr = Object.keys(resultHash).map((key) => [key, resultHash[key]]);
  resultArr.sort((a, b) => { return b[1] - a[1]; });
  const renderedText = resultArr.slice(0, 10).reduce((previousText, curr) => {
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

// our corpus is a few wsj articles and blog posts taken from
// http://www.anc.org/data/masc/corpus/577-2/

const docs = [];
// http://www.anc.org/MASC/texts/wsj_0026.txt
docs.push(`The White House said President Bush has approved duty-free treatment for imports of certain types of watches that aren't produced in "significant quantities" in the U.S., the Virgin Islands and other U.S. possessions. The action came in response to a petition filed by Timex Inc. for changes in the U.S. Generalized System of Preferences for imports from developing nations. Previously, watch imports were denied such duty-free treatment. Timex had requested duty-free treatment for many types of watches, covered by 58 different U.S. tariff classifications. The White House said Mr. Bush decided to grant duty-free status for 18 categories, but turned down such treatment for other types of watches "because of the potential for material injury to watch producers located in the U.S. and the Virgin Islands." Timex is a major U.S. producer and seller of watches, including low-priced battery-operated watches assembled in the Philippines and other developing nations covered by the U.S. tariff preferences. U.S. trade officials said the Philippines and Thailand would be the main beneficiaries of the president's action. Imports of the types of watches that now will be eligible for duty-free treatment totaled about $37.3 million in 1988, a relatively small share of the $1.5 billion in U.S. watch imports that year, according to an aide to U.S. Trade Representative Carla Hills.`);

// http://www.anc.org/MASC/texts/wsj_0027.txt
docs.push(`Magna International Inc. 's chief financial officer, James McAlpine, resigned and its chairman, Frank Stronach, is stepping in to help turn the automotive-parts manufacturer around, the company said. Mr. Stronach will direct an effort to reduce overhead and curb capital spending "until a more satisfactory level of profit is achieved and maintained," Magna said. Stephen Akerfeldt, currently vice president finance, will succeed Mr. McAlpine. An ambitious expansion has left Magna with excess capacity and a heavy debt load as the automotive industry enters a downturn. The company has reported declines in operating profit in each of the past three years, despite steady sales growth. Magna recently cut its quarterly dividend in half and the company's Class A shares are wallowing far below their 52-week high of 16.125 Canadian dollars (US$13.73). On the Toronto Stock Exchange yesterday, Magna shares closed up 37.5 Canadian cents to C$9.625. Mr. Stronach, founder and controlling shareholder of Magna, resigned as chief executive officer last year to seek, unsuccessfully, a seat in Canada's Parliament. Analysts said Mr. Stronach wants to resume a more influential role in running the company. They expect him to cut costs throughout the organization. The company said Mr. Stronach will personally direct the restructuring, assisted by Manfred Gingl, president and chief executive. Neither they nor Mr. McAlpine could be reached for comment. Magna said Mr. McAlpine resigned to pursue a consulting career, with Magna as one of his clients.`);

// http://www.anc.org/MASC/texts/wsj_0032.txt
docs.push(`Italian chemical giant Montedison S.p. A., through its Montedison Acquisition N.V. indirect unit, began its $37-a-share tender offer for all the common shares outstanding of Erbamont N.V., a maker of pharmaceuticals incorporated in the Netherlands. The offer, advertised in today's editions of The Wall Street Journal, is scheduled to expire at the end of November. Montedison currently owns about 72% of Erbamont's common shares outstanding. The offer is being launched pursuant to a previously announced agreement between the companies.`);

// http://www.anc.org/MASC/texts/wsj_0068.txt
docs.push(`GOODY PRODUCTS Inc. cut its quarterly dividend to five cents a share from 11.5 cents a share. The reduced dividend is payable Jan. 2 to stock of record Dec. 15. The Kearny, N.J.-based maker of hair accessories and other cosmetic products said it cut the dividend due to its third-quarter loss of $992,000, or 15 cents a share. In the year-ago quarter, the company reported net income of $1.9 million, or 29 cents a share. The company also adopted an anti-takeover plan.`);

// http://www.anc.org/MASC/texts/wsj_0073.txt
docs.push(`Integra-A Hotel & Restaurant Co. said its planned rights offering to raise about $9 million was declared effective and the company will begin mailing materials to shareholders at the end of this week. Under the offer, shareholders will receive one right for each 105 common shares owned. Each right entitles the shareholder to buy $100 face amount of 13.5% bonds due 1993 and warrants to buy 23.5 common shares at 30 cents a share. The rights, which expire Nov. 21, can be exercised for $100 each. Integra, which owns and operates hotels, said that Hallwood Group Inc. has agreed to exercise any rights that aren't exercised by other shareholders. Hallwood, a Cleveland merchant bank, owns about 11% of Integra.`);

// http://www.anc.org/MASC/texts/blog-jet-lag.txt
docs.push(`Jet Lag: Pathophysiology and Cures The longest Monday of my life I recently returned to the US from Australia. The 14-hour flight took me from Monday morning in Sydney to Monday morning, again, in L.A. Crossing the date line messed up my sense of time enough without the added bonus of thinking I should be heading to bed just as the sun began to climb into the California sky. You may be familiar with the concept: Jet lag. The catch-all name for circadian misalignment, the disruption of sleep cycles and circadian rhythms. If you've had the pleasure of crossing time zones in a jet plane, whether it was a mere three-hour hop from one coast of the US to the other or a trip to another continent, chances are, you've experienced some amount of jet lag. The pathophysiology of jet lag Normally, two systems--the homeostatic system and the circadian system--work together to produce a 24-hour sleep cycle. During the day, the homeostatic system slowly accumulates a 'sleep drive,' a desire to sleep that increases as a function of time spent awake. The circadian system generates an alerting signal in opposition to this sleep drive, which, during the day, keeps a person from feeling increasingly sleepy. An hour or two before bedtime, this signal subsides, and s/he realizes it's time to hit the pillow. The sleep drive dissipates as a person sleeps and by morning (assuming a full night's rest and possibly some coffee), s/he will be feeling alert and ready to go again. Robert Sack wrote a delightful paper [PDF] on jet lag, by the way, which is where I'm getting much of my information. So we've got a nice cycle of sleep. Jet lag is what happens when the homeostatic and circadian processes are misaligned. For example, the circadian system may signal a person to be alert when it's not actually morning, or may be reduced during daytime hours, causing daytime sleepiness because the homeostatic sleep drive is no longer cancelled out. But I don't want to be sleepy! How do you beat jet lag? Robert Sack lists three primary approaches: Reset the body clock Prescribed sleep scheduling Medication to counteract daytime sleepiness or insomnia Let's start with the first one, as it turns out to be the most complicated. Resetting the body clock The two most effective ways to reset the body clock are 1) through bright light exposure, and 2) timed melatonin administration. Light is one of the most important cues about time of day and has the greatest effect on circadian timing (much smaller effects are seen from regular activities and meals, for example). Studies have shown that without light cues, totally blind people tend to have free-running circadian rhythms with an average period of 24.5 hours, instead of the usual 24. If a person is exposed to bright light early in the day, the person's internal clock is reset to an earlier time; if exposure is instead in the evening, the internal clock is reset to a later time. Brighter light has more of an effect (such as the sun, at 3000 to 10,000 lux), though lower intensities (e.g., 100-550 lux) can produce changes. Artificial light sources can be used to supplement daylight, to help reset a person's internal clock to the correct new time zone when traveling. Alternatively, a person could wear very dark glasses, as light avoidance could help minimize the problems of light exposure at the wrong time of day or night. Resetting the body clock, Part 2: Melatonin Melatonin is a hormone that has been linked to the regulation of circadian rhythms and sleep cycles [PDF]. Melatonin is secreted by the pineal gland at night; secretion is suppressed by light exposure, and as such, the hormone can be thought of as a "darkness signal." If doses of melatonin are administered in the morning, circadian rhythms will be shifted later; evening doses shift rhythms earlier. Timing of the doses is more important than amount per dose, though it remains to be seen what the optimal dose and optimal time of administration is--trials have been done with doses from 0.5 to 10mg, at times ranging from three days before departure to five days after arrival in the new time zone. If doses of melatonin are combined with light exposure, the results are what you might expect: synergistic if both are administered to produce a time shift in the same direction (both earlier or both later); antagonistic otherwise. Sleep, wake, sleep, wake The second way to beat jet lag: Sleep at weird times. Slowly adjust your sleep schedule to match that of your destination, or keep your home sleep schedule for a while after you arrive. The problem with this is that your sleep-wake schedule won't match up with that of the people around you, and if you need to be awake for breakfast at 7am or for a meeting in the afternoon, your sleep schedule may interfere. Use this method at your own risk. Drugs for everything Lastly, we have sleep medicines. As you might guess, hypnotic medications combat insomnia and stimulants fight off daytime sleepiness pretty well, because by definition, that's what they do. Both benzodiazepine and non-benzodiazepine drugs have been shown to be effective in the first case; for the latter, the most common solution is to consume more coffee [PDF]. This works! In the study linked, subjects were treated with slow-release caffeine or with melatonin prior to a long eastward flight; the caffeine subjects were less sleepy than either melatonin or placebo. Granted, caffeine subjects also took longer to fall asleep later and awoke more frequently, but that may be a risk you have to take. Lagging behind Light, melatonin, drugs, strange sleep schedules. Of course, the only solution that will always work is time. The homeostatic and circadian processes need to realign, and while the aforementioned ways of beating jet lag can fast track the process, it still takes time. UPDATE: ; I was alerted by a friend of the existence further research of which I was unaware: Another way to reset your sleep-wake cycle is to stop eating . If you fast for about 12 to 16 hours, your body clock will reset, with whatever time you break your fast as morning. The Fuller, Lu, & Saper paper [PDF], published in Science , discusses the mechanism, though a more recent paper argues that the Fuller et al. results are inconclusive .`);

// http://www.anc.org/MASC/texts/blog-monastery.txt
docs.push(`Tibetan Buddhist Retreat Faded squares of fabric, strung together in repeating blue-white-red-green-yellow chains, crisscross the branches of bare-limbed trees. The gentle wind makes them flutter. Orange-gold light filters into the grassy meadow, touching a row of canvas tents and the temple house beyond. Tsechen Kunchab Ling : Temple of All-Encompassing Great Compassion. This is the seat of His Holiness the Sakya Trizin in the United States, a Tibetan Buddhist monastery established nine years ago. I spent the past weekend there. The field work office at my college arranges this retreat every semester. Everyone I've talked to who has previously attended says wonderful things about it; this semester, one of my friends told me she was going: I should join her! I like learning new things, so I signed up. A good decision: I didn't return all chill and zen, as one friend told me his roommate had, but I certainly gained a few new ideas and approaches to mull over, and dipped my hand into a previously unfamiliar piece of the world. Medicine for one's mind The first evening, the twenty-something students--most from my college, four from another--gathered in the shrine room, sitting cross-legged on cushions as we listened to Khenpo Kalsang introduce Tibetan Buddhist philosophy. He began by telling us, "Do not take any of what I say on faith. Take it through analysis, if there is some benefit in it for you." Religion, he said, is like a drugstore full of medicine. You do not go to the drugstore and buy everything in it--you just buy what would be beneficial to you now. You believe the other medicine may have just as much value, but in other situations, not this one. We discussed the foundations: the Three Turnings of the Wheel of Dharma; the four noble truths; karma; defilements; the six perfections. When we talked about the giving, and how one should try to give what one could to other sentient beings (in the form of material items, kind words, protection, and so on), Khenpo Kalsang shared a story of the Buddha, and how the Buddha had given his flesh so that a family of hungry tigers could eat. "So," a fellow student asked, "Giving one's life for another being is the ultimate gift?" Khenpo Kalsang, he smiled, and shook his head. "Only if you feel no regret," he said. "If you feel regret, it destroys the merit." Until then, preserve your own life, and do not give away anything that would cause you regret. This struck a chord. Self-preservation above all else, unless the right situation arises. Knowing and understanding Later, I talked to the resident nun, Ani Kunga, about psychology and cognitive science. She had studied psychology for a while in grad school, but now holds the view that psychologists are going about understanding the mind and understanding the knower and what knowing is the wrong way. "Psychologists," she said, "study the brain and the self externally. Ever since the 1920s, their science has been about observation of behavior, questionnaires, recordings of electrical brain activity. But the mind can only be known by you, the person whose mind it is." She said philosophy and epistemology were doing it right: looking at experiences from the inside. A big overlap exists between Tibetan Buddhism, psychology and cognitive science. All three examine the distinction between the self and others, between the observer and the observed, between knowing and the knower. I agree with Ani Kunga to some extent--only so much can be known about the mind from external observation. But this doesn't mean that there isn't merit to such studies, nor that nothing of use can be learned in that way. Tibetan Buddhist philosophy also approaches the mind and the self from the inside. During a second philsophy session, Khenpo Kalsang translated a sutra about a king who received advice from the Buddha. This sutra delved into some questions about the nature of the self, whether the self is a delusion, and how the clinging of self is a defilement. I intend to discuss it in more depth later, so stay tuned. Compassion training and prayer flags In the afternoon, a group of us gathered outside for a meditation session with Ani Kunga. Sunshine melted lazily through the tree branches above, a breeze animating the branches' shadows so they danced between our cushions. Compassion and anger were the session's topics. The key message: "If there's something you can do, why are you unhappy? Just do it. If there's nothing you can do, why are you unhappy?" Ani Kunga explained several off-session and one on-session technique for dealing with negative emotions (anger, hate, irritation, stress, jealousy, and so on). All the methods built off the idea that you are in control: anger is an emotion, and you can change your emotions. Stay tuned for a more in-depth post on the topic. Another of the day's activities was making prayer flags. As Ani Kunga explained, "Prayers, wishes, hopes, aspirations--someone, many people, may share those with you. Hanging the prayer flag shares your prayer with everyone else in the world. This may do no good at all, but it may--if everyone hopes and wishes and dreams and aspires, perhaps it will do good. It may not. But if no one shares their prayers, it will certainly do no good. So on the offchance that it will help, why not?" Never done This weekend reminded me that I'm not done learning. If I stay still long enough, if I've achieved a relatively constant level of happiness and satisfaction, I forget that I can and should continue to seek out new ideas and approaches, and incorporate beneficial ones into my life. A person is never "done," and so, I'll continue to observe and discuss and study, trying to pick the directions in which I'll change, and trying to make tomorrow better than today. Ever onward and ever upward.`);

const tokenizedDocs = docs.map((text) => {
  return tokenize(text).map(normalize).filter(filter);
});

document.getElementById('input-area').onkeyup = inputHandler;
