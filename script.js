const MBTI_TYPES = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ"
];

const JOBS = [
  { id:"miner", name:"광부", w:1.0, base:220, hp:8, ep:6 },
  { id:"farmer", name:"농부", w:1.0, base:200, hp:7, ep:5 },
  { id:"chef", name:"요리사", w:1.0, base:210, hp:5, ep:6 },
  { id:"teacher", name:"교사", w:1.0, base:190, hp:4, ep:6 },
  { id:"carpenter", name:"목수", w:1.0, base:210, hp:7, ep:4 },
  { id:"office", name:"사무직", w:1.0, base:180, hp:3, ep:6 },
  { id:"merchant", name:"상인", w:1.0, base:200, hp:3, ep:5 },
  { id:"doctor", name:"의사", w:0.1, base:260, hp:2, ep:7 },
  { id:"jewelry", name:"쥬얼리상", w:0.1, base:240, hp:2, ep:5 },
  { id:"dev", name:"개발자", w:1.0, base:210, hp:2, ep:7 },
  { id:"trader", name:"무역가", w:1.0, base:220, hp:3, ep:6 },
  { id:"parttime", name:"알바생", w:1.0, base:150, hp:4, ep:5 },
  { id:"yoga", name:"요가강사", w:1.0, base:180, hp:2, ep:4 },
  { id:"barista", name:"바리스타", w:1.0, base:170, hp:3, ep:5 },
  { id:"designer", name:"디자이너", w:1.0, base:200, hp:2, ep:6 },
  { id:"police", name:"경찰", w:1.0, base:210, hp:6, ep:5 },
  { id:"nurse", name:"간호사", w:1.0, base:200, hp:3, ep:6 }
];

const MAYOR_JOB = { id:"mayor", name:"이장", w:0, base:230, hp:2, ep:2 };

const LOG_KIND = {
  normal: "normal",
  leisure: "leisure",
  secret: "secret",
  love: "love"
};

let characters = [];
let logs = [];
let day = 1;
let activeTab = "village";
let network = null;


function $(id){ return document.getElementById(id); }

function rand(){ return Math.random(); }
function randInt(a,b){ return Math.floor(a + rand()*(b-a+1)); }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }

function makeId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,10);
}

function hasJongseong(char) {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code - 0xAC00) % 28 > 0;
}

function getJosa(word, type) {
  const lastChar = word.charAt(word.length - 1);
  const has = hasJongseong(lastChar);
  if (type === '은/는') return has ? '은' : '는';
  if (type === '이/가') return has ? '이' : '가';
  if (type === '을/를') return has ? '을' : '를';
  if (type === '와/과') return has ? '과' : '와';
  return '';
}

function statsRandom(){
  return {
    str: randInt(1,5),
    ment: randInt(1,5),
    intel: randInt(1,5),
    agi: randInt(1,5)
  };
}

function maxHP(stats){
  return 60 + stats.str*12;
}

function maxEP(stats){
  return 60 + stats.ment*12;
}

function calcChemistry(m1,m2){
  if (!m1 || !m2 || m1.length<4 || m2.length<4) return 3;
  let s = 3;
  if (m1[0] === m2[0]) s += 0.3;
  if (m1[1] === m2[1]) s += 0.6;
  if (m1[2] === m2[2]) s += 0.8;
  if (m1[3] === m2[3]) s += 0.4;
  if ((m1[0] !== m2[0]) && (m1[1] === m2[1]) && (m1[2] !== m2[2]) && (m1[3] === m2[3])) s += 0.7;
  if ((m1 === "INFP" && (m2==="ENFJ"||m2==="ENTJ")) || (m2 === "INFP" && (m1==="ENFJ"||m1==="ENTJ"))) s = 5;
  if ((m1 === "ENFP" && (m2==="INFJ"||m2==="INTJ")) || (m2 === "ENFP" && (m1==="INFJ"||m1==="INTJ"))) s = 5;
  if ((m1 === "INFJ" && (m2==="ENFP"||m2==="ENTP")) || (m2 === "INFJ" && (m1==="ENFP"||m1==="ENTP"))) s = 5;
  if ((m1 === "INTP" && (m2==="ENTJ"||m2==="ESTJ")) || (m2 === "INTP" && (m1==="ENTJ"||m1==="ESTJ"))) s = 5;
  if ((m1 === "ENTP" && (m2==="INFJ"||m2==="INTJ")) || (m2 === "ENTP" && (m1==="INFJ"||m1==="INTJ"))) s = 5;
  return clamp(Math.round(s),1,5);
}

function getSpecialStatusBetween(a,b){
  if (!a || !b) return null;
  const s1 = a.specialRelations?.[b.id];
  const s2 = b.specialRelations?.[a.id];
  if (s1 === "married" || s2 === "married") return "married";
  if (s1 === "lover" || s2 === "lover") return "lover";
  if (s1 === "coldwar" || s2 === "coldwar") return "coldwar";
  if (s1 === "cut" || s2 === "cut") return "cut";
  return null;
}

function setSpecialStatus(aId,bId,status){
  const a = characters.find(x=>x.id===aId);
  if (!a) return;
  if (!a.specialRelations) a.specialRelations = {};
  if (status == null) delete a.specialRelations[bId];
  else a.specialRelations[bId] = status;
}

function updateRelationship(aId,bId,delta){
  const a = characters.find(x=>x.id===aId);
  const b = characters.find(x=>x.id===bId);
  if (!a || !b) return;
  if (!a.relationships) a.relationships = {};
  if (a.relationships[bId] == null) a.relationships[bId] = 0;
  a.relationships[bId] += delta;

  const special = getSpecialStatusBetween(a,b);
  const bonded = (special === "lover" || special === "married");
  const cap = bonded ? 200 : 100;

  a.relationships[bId] = clamp(a.relationships[bId], -100, cap);
}

function breakUpPair(a,b,reason,logArr){
  if (!a || !b) return;

  setSpecialStatus(a.id,b.id,null);
  setSpecialStatus(b.id,a.id,null);

  if (a.coldwarMeta) delete a.coldwarMeta[b.id];
  if (b.coldwarMeta) delete b.coldwarMeta[a.id];
  if (a.specialRelations?.[b.id] === "coldwar") setSpecialStatus(a.id,b.id,null);
  if (b.specialRelations?.[a.id] === "coldwar") setSpecialStatus(b.id,a.id,null);

  updateRelationship(a.id,b.id,-40);
  updateRelationship(b.id,a.id,-40);

  if (reason === "절교") {
    if (!a.cutMeta) a.cutMeta = {};
    if (!b.cutMeta) b.cutMeta = {};
    a.cutMeta[b.id] = { sinceDay: day, cooldown: 7 };
    b.cutMeta[a.id] = { sinceDay: day, cooldown: 7 };
    setSpecialStatus(a.id,b.id,"cut");
    setSpecialStatus(b.id,a.id,"cut");
  }

  logArr.push({
    text: `[${reason}] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 관계를 정리했다.`,
    kind: LOG_KIND.normal
  });
}

function markColdwarPair(a,b,duration){
  if (!a || !b) return;
  const sp = getSpecialStatusBetween(a,b);
  if (sp === "lover" || sp === "married") return;
  setSpecialStatus(a.id,b.id,"coldwar");
  setSpecialStatus(b.id,a.id,"coldwar");
  if (!a.coldwarMeta) a.coldwarMeta = {};
  if (!b.coldwarMeta) b.coldwarMeta = {};
  a.coldwarMeta[b.id] = { sinceDay: day, duration };
  b.coldwarMeta[a.id] = { sinceDay: day, duration };
}

function clearColdwarPair(a,b){
  if (!a || !b) return;
  if (a.specialRelations?.[b.id] === "coldwar") setSpecialStatus(a.id,b.id,null);
  if (b.specialRelations?.[a.id] === "coldwar") setSpecialStatus(b.id,a.id,null);
  if (a.coldwarMeta) delete a.coldwarMeta[b.id];
  if (b.coldwarMeta) delete b.coldwarMeta[a.id];
}

function canReconcileColdwar(a,b){
  const meta = a.coldwarMeta?.[b.id];
  if (!meta) return false;
  const elapsed = day - meta.sinceDay;
  return elapsed <= meta.duration;
}

function processColdwarTimers(dailyLogs){
  const seen = new Set();
  characters.forEach(a=>{
    Object.entries(a.coldwarMeta || {}).forEach(([bid, meta])=>{
      const b = characters.find(x=>x.id===bid);
      if (!b) return;
      const key = [a.id,b.id].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);

      const elapsed = day - meta.sinceDay;
      if (elapsed < meta.duration) return;

      const bigFight = meta.duration >= 5;
      const successChance = bigFight ? 0.55 : 0.70;

      if (rand() < successChance) {
        clearColdwarPair(a,b);
        updateRelationship(a.id,b.id,15);
        updateRelationship(b.id,a.id,15);
        dailyLogs.push({ text:`[자동 화해] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 시간이 지나 냉전이 풀렸다.`, kind: LOG_KIND.normal });
      } else {
        breakUpPair(a,b,"절교",dailyLogs);
      }
    });
  });
}

function processCutTimers(dailyLogs){
  const seen = new Set();
  characters.forEach(a=>{
    Object.entries(a.cutMeta || {}).forEach(([bid, meta])=>{
      const b = characters.find(x=>x.id===bid);
      if (!b) return;

      const key = [a.id,b.id].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);

      const elapsed = day - meta.sinceDay;
      if (elapsed < meta.cooldown) return;

      const reconnectChance = 0.10;
      if (rand() < reconnectChance) {
        setSpecialStatus(a.id,b.id,null);
        setSpecialStatus(b.id,a.id,null);
        delete a.cutMeta[bid];
        delete b.cutMeta[a.id];
        a.relationships[b.id] = 0;
        b.relationships[a.id] = 0;
        dailyLogs.push({ text:`[재연결] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 다시 연락이 닿아 관계를 회복했다.`, kind: LOG_KIND.normal });
      }
    });
  });
}

function pickJob(){
  const pool = JOBS.slice();
  const total = pool.reduce((s,j)=>s+j.w,0);
  let r = rand()*total;
  for (const j of pool){
    r -= j.w;
    if (r <= 0) return j;
  }
  return pool[pool.length-1];
}

function isBeggar(c){
  return c.job?.id === "beggar";
}

function makeBeggar(c){
  c.job = { id:"beggar", name:"거지", base:0 };
  c.beggarDaysLeft = 10;
}

function tryBecomeBeggarAtStart(c){
  if (c.money <= 0 && !c.didWorkYesterday && c.job && c.job.id !== "mayor" && c.job.id !== "beggar") {
    makeBeggar(c);
    pushLog(`[전락] ${c.name}${getJosa(c.name,'은/는')} 돈이 바닥나 '거지'가 되었다...`, LOG_KIND.normal);
  }
}

function processBeggar(c, dailyLogs){
  c.beggarDaysLeft = (c.beggarDaysLeft ?? 10);
  const donors = characters.filter(x=>x.id!==c.id && x.faintedDaysLeft<=0 && x.sickDaysLeft<=0);
  if (donors.length === 0){
    dailyLogs.push({ text:`[구걸] ${c.name}은(는) 도움을 받을 사람이 없었다...`, kind: LOG_KIND.normal });
  } else {
    const donor = pick(donors);
    c.money += 10;
    updateRelationship(donor.id, c.id, -3);
    dailyLogs.push({ text:`[구걸] ${c.name}${getJosa(c.name,'은/는')} ${donor.name}에게 10원을 기부받았다. (${donor.name}의 호감도 하락)`, kind: LOG_KIND.normal });
  }
  c.beggarDaysLeft -= 1;
  if (c.beggarDaysLeft <= 0){
    c.job = pickJob();
    dailyLogs.push({ text:`[재기] ${c.name}${getJosa(c.name,'은/는')} 다시 직업을 얻었다! ('${c.job.name}')`, kind: LOG_KIND.normal });
  }
}

function triggerSick(c){
  c.sickDaysLeft = randInt(1,3);
}

function processSick(c, dailyLogs){
  const drain = clamp(Math.floor(c.money * randInt(8,18)/100) + randInt(10,35), 0, c.money);
  c.money = Math.max(0, c.money - drain);
  c.hp = clamp(c.hp + randInt(8,14), 0, maxHP(c.stats));
  c.ep = clamp(c.ep + randInt(6,14), 0, maxEP(c.stats));
  dailyLogs.push({ text:`[아픔] ${c.name}${getJosa(c.name,'은/는')} 몸이 좋지 않아 쉬었다. (치료/생활비 -${drain}원)`, kind: LOG_KIND.normal });
  c.sickDaysLeft -= 1;
}

function triggerFaint(c, dailyLogs){
  if (c.faintedDaysLeft > 0) return;
  c.faintedDaysLeft = 3;
  dailyLogs.push({ text:`[기절] ${c.name}이(가) 쓰러졌다... 3일간 움직일 수 없다.`, kind: LOG_KIND.normal });
}

function processFaint(c, dailyLogs){
  const drain = clamp(Math.floor(c.money * randInt(55,85)/100) + randInt(120,260), 0, c.money);
  c.money = Math.max(0, c.money - drain);
  c.hp = clamp(c.hp + randInt(18,28), 0, maxHP(c.stats));
  c.ep = clamp(c.ep + randInt(18,30), 0, maxEP(c.stats));
  dailyLogs.push({ text:`[기절] ${c.name}은(는) 정신없이 누워 있었다. (생활비 -${drain}원)`, kind: LOG_KIND.normal });
  c.faintedDaysLeft -= 1;
}

function doVillageWorkOnly(c, dailyLogs){
  const tasks = ["나무를 베었다","돌을 치웠다","길을 정리했다","잡초를 뽑았다","울타리를 손봤다","마을을 청소했다"];
  const t = pick(tasks);
  c.hp = clamp(c.hp - randInt(4,8) - (6 - c.stats.str), 0, maxHP(c.stats));
  c.ep = clamp(c.ep - randInt(3,7) - (6 - c.stats.ment), 0, maxEP(c.stats));
  dailyLogs.push({ text:`[정비] ${c.name}${getJosa(c.name,'은/는')} ${t}.`, kind: LOG_KIND.normal });
}

function doTalkOnly(c, dailyLogs){
  const others = characters.filter(x=>x.id!==c.id && x.faintedDaysLeft<=0 && x.sickDaysLeft<=0);
  if (others.length === 0){
    dailyLogs.push({ text:`[대화] ${c.name}${getJosa(c.name,'은/는')} 혼자 시간을 보냈다.`, kind: LOG_KIND.normal });
    return;
  }
  const target = pick(others);
  talkEvent(c,target,dailyLogs,false);
  c.ep = clamp(c.ep - randInt(2,6), 0, maxEP(c.stats));
  target.ep = clamp(target.ep - randInt(1,5), 0, maxEP(target.stats));
}

function calcWorkIncome(c){
  if (!c.job || c.job.id === "beggar") return 0;
  const j = c.job.id === "mayor" ? MAYOR_JOB : c.job;
  let base = j.base ?? 180;

  const intelBonus = (c.stats.intel - 3) * 0.22;
  const agiBonus = (c.stats.agi - 3) * 0.15;
  const mbtiBonus = (c.mbti?.[0] === "E") ? 0.04 : 0;

  let income = Math.floor(base * (1 + intelBonus + agiBonus + mbtiBonus));
  income += randInt(-25, 35);

  const epRatio = clamp(c.ep / maxEP(c.stats), 0, 1);
  const penalty = 0.35 + 0.65 * epRatio;
  income = Math.max(0, Math.floor(income * penalty));

  if (c.job.id === "mayor") income = Math.floor(income * 1.08);

  return Math.max(0, income);
}

function workCost(c){
  const j = c.job?.id === "mayor" ? MAYOR_JOB : c.job;
  const hpBase = (j?.hp ?? 4);
  const epBase = (j?.ep ?? 5);

  const hp = randInt(hpBase-1, hpBase+3) + Math.max(0, 4 - c.stats.str);
  const ep = randInt(epBase-1, epBase+3) + Math.max(0, 4 - c.stats.ment);

  return { hp: Math.max(1,hp), ep: Math.max(1,ep) };
}

function doWork(c, dailyLogs){
  const income = calcWorkIncome(c);
  c.money += income;

  const cost = workCost(c);
  c.hp = clamp(c.hp - cost.hp, 0, maxHP(c.stats));
  c.ep = clamp(c.ep - cost.ep, 0, maxEP(c.stats));

  c.didWorkToday = true;
  dailyLogs.push({ text:`[돈벌기] ${c.name}${getJosa(c.name,'은/는')} '${c.job.name}' 일을 했다. (+${income}원)`, kind: LOG_KIND.normal });
}

function chooseDailyPlan(c){
  const e = c.mbti?.[0] === "E";
  const epRatio = clamp(c.ep / maxEP(c.stats), 0, 1);
  const hpRatio = clamp(c.hp / maxHP(c.stats), 0, 1);

  if (hpRatio < 0.22 || epRatio < 0.18) return "rest";
  if (day >= 4) {
    if (c.money >= 180 && epRatio > 0.35 && rand() < (e ? 0.18 : 0.10)) return "travel";
    if (rand() < 0.10) return "rest";
    return "worktalk";
  }
  return "talk";
}

function doRest(c, dailyLogs){
  const spend = clamp(randInt(10,45), 0, c.money);
  c.money = Math.max(0, c.money - spend);

  const hpGain = randInt(12,22) + Math.max(0, c.stats.str - 3);
  const epGain = randInt(12,24) + Math.max(0, c.stats.ment - 3);

  const moneyBoost = spend >= 30 ? 1.25 : spend >= 15 ? 1.12 : 1.0;

  c.hp = clamp(c.hp + Math.floor(hpGain * moneyBoost), 0, maxHP(c.stats));
  c.ep = clamp(c.ep + Math.floor(epGain * moneyBoost), 0, maxEP(c.stats));

  dailyLogs.push({ text:`[휴식] ${c.name}${getJosa(c.name,'은/는')} 쉬면서 회복했다. (여가비 -${spend}원)`, kind: LOG_KIND.leisure });
}

function doTravel(c, dailyLogs){
  const cost = randInt(180, 380);
  if (c.money < cost) {
    doRest(c,dailyLogs);
    return;
  }
  c.money = Math.max(0, c.money - cost);

  const hpDrop = randInt(8,16) + Math.max(0, 4 - c.stats.str);
  const epDrop = randInt(10,18) + Math.max(0, 4 - c.stats.ment);

  c.hp = clamp(c.hp - hpDrop, 0, maxHP(c.stats));
  c.ep = clamp(c.ep - epDrop, 0, maxEP(c.stats));

  const places = ["강릉","부산","여수","제주도","오사카","도쿄","파리","런던","하와이","방콕"];
  dailyLogs.push({ text:`[여행] ${c.name}${getJosa(c.name,'은/는')} ${pick(places)}로 다녀왔다! (여행비 -${cost}원)`, kind: LOG_KIND.leisure });
}

function pickPairForTalk(){
  const alive = characters.filter(c=>c.faintedDaysLeft<=0 && c.sickDaysLeft<=0);
  if (alive.length < 2) return null;
  const a = pick(alive);
  const b = pick(alive.filter(x=>x.id!==a.id));
  return [a,b];
}

function talkEvent(a,b,dailyLogs,isFreeTime){
  const sp = getSpecialStatusBetween(a,b);
  const aScore = a.relationships?.[b.id] ?? 0;
  const bScore = b.relationships?.[a.id] ?? 0;
  const chem = calcChemistry(a.mbti,b.mbti);

  const base = (chem - 3);
  const deltaA = randInt(-3, 7) + base;
  const deltaB = randInt(-3, 7) + base;

  const evtRoll = rand()*100;
  const isCold = (sp === "coldwar");
  const isLover = (sp === "lover");
  const isMarried = (sp === "married");

  const loveChance = isFreeTime ? 12 : 6;
  const secretChance = isFreeTime ? 10 : 6;
  const fightChance = isFreeTime ? 7 : 10;

  if (evtRoll < secretChance && (aScore >= 15 && bScore >= 15) && !isCold) {
    const secrets = ["흑역사","가정사","진짜 꿈","숨겨진 목표","연애사","과거 실수","비밀 취미","고민"];
    updateRelationship(a.id,b.id, 12 + randInt(0,4));
    updateRelationship(b.id,a.id, 12 + randInt(0,4));
    dailyLogs.push({ text:`[비밀대화] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 서로의 '${pick(secrets)}'을(를) 털어놓았다.`, kind: LOG_KIND.secret });
    return;
  }

  if (evtRoll < secretChance + loveChance) {
    if (isMarried) {
      const fee = randInt(80, 220);
      a.money = Math.max(0, a.money - fee);
      b.money = Math.max(0, b.money - fee);
      a.ep = maxEP(a.stats);
      b.ep = maxEP(b.stats);
      updateRelationship(a.id,b.id, 4);
      updateRelationship(b.id,a.id, 4);
      clearColdwarPair(a,b);
      dailyLogs.push({ text:`[사랑] ${a.name}${getJosa(a.name,'은/는')} ${b.name}에게 사랑을 다시 확인했다. 💍 (비용 -${fee}원씩, EP 풀충전)`, kind: LOG_KIND.love });
      return;
    }

    if (isLover) {
      const fee = randInt(70, 190);
      a.money = Math.max(0, a.money - fee);
      b.money = Math.max(0, b.money - fee);
      a.ep = maxEP(a.stats);
      b.ep = maxEP(b.stats);
      updateRelationship(a.id,b.id, 5);
      updateRelationship(b.id,a.id, 5);
      clearColdwarPair(a,b);
      dailyLogs.push({ text:`[연애] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 달달한 시간을 보냈다. 💖 (비용 -${fee}원씩, EP 풀충전)`, kind: LOG_KIND.love });
      return;
    }

    if (aScore > 50 && bScore > 35) {
      const chemBonus = (chem - 3) * 0.05;
      const chance = 0.50 + (Math.min(aScore,bScore)/200) + chemBonus;
      if (rand() < chance) {
        const fee = randInt(60,160);
        a.money = Math.max(0,a.money-fee);
        b.money = Math.max(0,b.money-fee);

        setSpecialStatus(a.id,b.id,"lover");
        setSpecialStatus(b.id,a.id,"lover");
        clearColdwarPair(a,b);

        updateRelationship(a.id,b.id, 15);
        updateRelationship(b.id,a.id, 15);

        a.ep = maxEP(a.stats);
        b.ep = maxEP(b.stats);

        dailyLogs.push({ text:`[고백 성공] ${a.name}${getJosa(a.name,'은/는')} ${b.name}에게 고백했고, 연인이 되었다! 💖 (연애비 -${fee}원씩, EP 풀충전)`, kind: LOG_KIND.love });
      } else {
        updateRelationship(a.id,b.id, -5);
        updateRelationship(b.id,a.id, -2);
        if (rand() < 0.35) markColdwarPair(a,b, rand() < 0.4 ? 5 : 3);
        dailyLogs.push({ text:`[고백 실패] ${a.name}${getJosa(a.name,'은/는')} ${b.name}에게 차였다...`, kind: LOG_KIND.normal });
      }
      return;
    }

    dailyLogs.push({ text:`[고백 포기] ${a.name}${getJosa(a.name,'은/는')} ${b.name}에게 고백하려다 참았다.`, kind: LOG_KIND.normal });
    return;
  }

  if (evtRoll < secretChance + loveChance + fightChance) {
    if (isMarried) {
      updateRelationship(a.id,b.id, -2);
      updateRelationship(b.id,a.id, -2);
      dailyLogs.push({ text:`[위기] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 다퉜지만 결혼 관계는 유지했다. 💍`, kind: LOG_KIND.love });
      return;
    }
    if (isLover) {
      const breakupChance = Math.max(0.05, 0.28 - (Math.min(aScore,bScore)/220));
      if (rand() < breakupChance) {
        setSpecialStatus(a.id,b.id,null);
        setSpecialStatus(b.id,a.id,null);
        updateRelationship(a.id,b.id, -25);
        updateRelationship(b.id,a.id, -25);
        dailyLogs.push({ text:`[이별] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 헤어졌다. 💔`, kind: LOG_KIND.love });
      } else {
        updateRelationship(a.id,b.id, -4);
        updateRelationship(b.id,a.id, -4);
        dailyLogs.push({ text:`[위기] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 다퉜지만 헤어지지 않았다.`, kind: LOG_KIND.love });
      }
      if (rand() < 0.35) markColdwarPair(a,b, rand() < 0.4 ? 5 : 3);
      return;
    }

    updateRelationship(a.id,b.id, -6);
    updateRelationship(b.id,a.id, -6);
    dailyLogs.push({ text:`[싸움] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 사소한 문제로 크게 다퉜다.`, kind: LOG_KIND.normal });
    if (rand() < 0.7) markColdwarPair(a,b, rand() < 0.4 ? 5 : 3);
    return;
  }

  if (sp === "coldwar" && rand() < 0.35) {
    const inTime = canReconcileColdwar(a,b);
    const meta = a.coldwarMeta?.[b.id];
    const duration = meta?.duration ?? 3;
    const bigFight = duration >= 5;
    const failChance = inTime ? (bigFight ? 0.22 : 0.14) : (bigFight ? 0.28 : 0.18);

    if (rand() < failChance) {
      breakUpPair(a,b,"절교",dailyLogs);
      return;
    } else {
      updateRelationship(a.id,b.id, 15);
      updateRelationship(b.id,a.id, 15);
      clearColdwarPair(a,b);
      dailyLogs.push({ text:`[화해] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 서로 사과하고 화해했다.`, kind: LOG_KIND.normal });
      return;
    }
  }

  updateRelationship(a.id,b.id, deltaA);
  updateRelationship(b.id,a.id, deltaB);

  const txtPool = [
    "잡담을 나눴다",
    "서로의 근황을 공유했다",
    "마을 이야기를 했다",
    "웃으며 대화를 이어갔다",
    "조용히 이야기를 들었다",
    "진지하게 고민을 나눴다"
  ];
  dailyLogs.push({ text:`[대화] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} ${pick(txtPool)}.`, kind: LOG_KIND.normal });
}

function tryLoveUpgrade(a,b,dailyLogs){
  const sp = getSpecialStatusBetween(a,b);
  const aScore = a.relationships?.[b.id] ?? 0;
  const bScore = b.relationships?.[a.id] ?? 0;

  if (sp === "married") return;

  if (sp === "lover" && aScore >= 200 && bScore >= 200 && rand() < 0.06) {
    setSpecialStatus(a.id,b.id,"married");
    setSpecialStatus(b.id,a.id,"married");
    clearColdwarPair(a,b);

    const fee = randInt(180, 420);
    a.money = Math.max(0,a.money-fee);
    b.money = Math.max(0,b.money-fee);

    a.ep = maxEP(a.stats);
    b.ep = maxEP(b.stats);

    dailyLogs.push({ text:`[결혼] ${a.name}${getJosa(a.name,'와/과')} ${b.name}${getJosa(b.name,'은/는')} 결혼했다! 💍 (결혼비 -${fee}원씩, EP 풀충전)`, kind: LOG_KIND.love });
  }
}

function freeTimeForWorker(c, dailyLogs){
  if (c.traveledToday) return;

  const doDateChance = 0.20;
  const doLeisureChance = 0.55;

  if (rand() < doDateChance) {
    const partner = pick(characters.filter(x=>x.id!==c.id && x.faintedDaysLeft<=0 && x.sickDaysLeft<=0));
    if (partner) {
      const sp = getSpecialStatusBetween(c, partner);
      const score = c.relationships?.[partner.id] ?? 0;
      if (sp === "lover" || sp === "married" || score >= 60) {
        const cost = randInt(90, 220);
        if (c.money >= cost && partner.money >= cost) {
          c.money -= cost;
          partner.money -= cost;

          c.hp = clamp(c.hp - randInt(2,7), 0, maxHP(c.stats));
          partner.hp = clamp(partner.hp - randInt(2,7), 0, maxHP(partner.stats));

          c.ep = maxEP(c.stats);
          partner.ep = maxEP(partner.stats);

          updateRelationship(c.id, partner.id, 8 + randInt(0,5));
          updateRelationship(partner.id, c.id, 8 + randInt(0,5));
          clearColdwarPair(c,partner);

          dailyLogs.push({ text:`[데이트] ${c.name}${getJosa(c.name,'와/과')} ${partner.name}${getJosa(partner.name,'은/는')} 둘만의 데이트를 했다. 💖 (비용 -${cost}원씩, EP 풀충전)`, kind: LOG_KIND.love });
          tryLoveUpgrade(c,partner,dailyLogs);
          return;
        }
      }
    }
  }

  if (rand() < doLeisureChance) {
    const spend = clamp(randInt(15,60), 0, c.money);
    c.money = Math.max(0, c.money - spend);

    const hpGain = randInt(8,18);
    const epGain = randInt(10,22);

    const mult = spend >= 45 ? 1.25 : spend >= 25 ? 1.12 : 1.0;
    c.hp = clamp(c.hp + Math.floor(hpGain*mult), 0, maxHP(c.stats));
    c.ep = clamp(c.ep + Math.floor(epGain*mult), 0, maxEP(c.stats));

    const act = pick(["영화를 봤다","카페에서 쉬었다","산책을 했다","맛있는 걸 먹었다","집을 꾸몄다","게임을 했다","요가를 했다","책을 읽었다"]);
    dailyLogs.push({ text:`[자유시간] ${c.name}${getJosa(c.name,'은/는')} ${act}. (여가비 -${spend}원)`, kind: LOG_KIND.leisure });
  } else {
    const pair = pickPairForTalk();
    if (pair) {
      talkEvent(pair[0],pair[1],dailyLogs,true);
      tryLoveUpgrade(pair[0],pair[1],dailyLogs);
    }
  }
}

function maybeFaintCheck(c, dailyLogs){
  if (c.hp <= 0 || c.ep <= 0) triggerFaint(c, dailyLogs);
}

function selectMayorAtEnd(dailyLogs){
  if (characters.length === 0) return;
  let best = null;
  let bestScore = -Infinity;

  characters.forEach(c=>{
    if (c.faintedDaysLeft>0) return;
    let sum = 0;
    characters.forEach(o=>{
      if (o.id === c.id) return;
      sum += (c.relationships?.[o.id] ?? 0);
    });
    if (sum > bestScore){
      bestScore = sum;
      best = c;
    }
  });

  if (!best) best = characters[0];

  best.isMayor = true;
  best.job = { ...MAYOR_JOB };

  dailyLogs.push({ text:`[이장 선정] ${best.name}${getJosa(best.name,'이/가')} 마을 이장이 되었다! 👑 (10일차 종료)`, kind: LOG_KIND.normal });
}

function nextDay(){
  if (gameEnded) return;
  if (characters.length === 0) return alert("최소 1명의 주민이 필요합니다.");

  const dailyLogs = [];
  day += 1;

  characters.forEach(c=>{
    c.didWorkYesterday = !!c.didWorkToday;
    c.didWorkToday = false;
    c.traveledToday = false;
  });

  processColdwarTimers(dailyLogs);
  processCutTimers(dailyLogs);

  characters.forEach(c=>{
    if (c.faintedDaysLeft > 0) {
      processFaint(c, dailyLogs);
      return;
    }

    if (c.sickDaysLeft > 0) {
      processSick(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    if (rand() < 0.012) {
      triggerSick(c);
      dailyLogs.push({ text:`[컨디션] ${c.name}${getJosa(c.name,'은/는')} 갑자기 아파졌다... (${c.sickDaysLeft}일)`, kind: LOG_KIND.normal });
      processSick(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    tryBecomeBeggarAtStart(c);
  });

  characters.forEach(c=>{
    if (c.faintedDaysLeft > 0 || c.sickDaysLeft > 0) return;
    if (isBeggar(c)) {
      processBeggar(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }
  });

  characters.forEach(c=>{
    if (c.faintedDaysLeft > 0 || c.sickDaysLeft > 0) return;
    if (isBeggar(c)) return;

    const age = day - (c.dayAdded ?? 1) + 1;

    if (day <= 3) {
      if (rand() < 0.55) doVillageWorkOnly(c, dailyLogs);
      else doTalkOnly(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    if (!c.job) {
      if (age === 1) {
        doTalkOnly(c, dailyLogs);
        maybeFaintCheck(c, dailyLogs);
        return;
      }
      c.job = pickJob();
      dailyLogs.push({ text:`[직업] ${c.name}의 직업이 '${c.job.name}'(으)로 정해졌다.`, kind: LOG_KIND.normal });
    }

    const plan = chooseDailyPlan(c);

    if (plan === "talk") {
      doTalkOnly(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    if (plan === "travel") {
      doTravel(c, dailyLogs);
      c.traveledToday = true;
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    if (plan === "rest") {
      doRest(c, dailyLogs);
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    if (c.job.id === "mayor") {
      const income = calcWorkIncome(c);
      c.money += income;
      const cost = { hp: 2 + Math.max(0, 3 - c.stats.str), ep: 2 + Math.max(0, 3 - c.stats.ment) };
      c.hp = clamp(c.hp - cost.hp, 0, maxHP(c.stats));
      c.ep = clamp(c.ep - cost.ep, 0, maxEP(c.stats));
      c.didWorkToday = true;
      dailyLogs.push({ text:`[관리] ${c.name}${getJosa(c.name,'은/는')} 마을을 위해 힘썼다! (+${income}원)`, kind: LOG_KIND.normal });
      maybeFaintCheck(c, dailyLogs);
      return;
    }

    doWork(c, dailyLogs);

    const pair = pickPairForTalk();
    if (pair) {
      talkEvent(pair[0],pair[1],dailyLogs,false);
      tryLoveUpgrade(pair[0],pair[1],dailyLogs);
    }

    maybeFaintCheck(c, dailyLogs);
  });

  dailyLogs.push({ text:`- 자유시간 -`, kind: LOG_KIND.normal });

  characters.forEach(c=>{
    if (!c.didWorkToday) return;
    if (c.faintedDaysLeft > 0) return;
    if (c.sickDaysLeft > 0) return;
    if (isBeggar(c)) return;
    freeTimeForWorker(c, dailyLogs);
    maybeFaintCheck(c, dailyLogs);
  });

  logs = [...dailyLogs.map(x=>({ day, ...x })), ...logs];
  renderLogs(dailyLogs);
  renderVillage();
  if (activeTab === "network") renderNetwork();
  updateDayUI();

    if (day === 10 && !mayorSelected) {
    const endLogs = [];
    selectMayorAtEnd(endLogs);
    logs = [...endLogs.map(x=>({ day, ...x })), ...logs];
    renderLogs(endLogs);
    renderVillage();
    if (activeTab === "network") renderNetwork();
    mayorSelected = true;
  }
}

function formatMoney(n){
  return (n ?? 0).toLocaleString("ko-KR");
}

function hpPercent(c){
  return clamp(Math.floor((c.hp / maxHP(c.stats))*100), 0, 100);
}

function epPercent(c){
  return clamp(Math.floor((c.ep / maxEP(c.stats))*100), 0, 100);
}

function getRelLabel(score, special){
  if (special === "married") return "💍 결혼";
  if (special === "lover") return "💖 연인";
  if (special === "coldwar") return "🔥 냉전";
  if (special === "cut") return "🚫 단절";
  if (score <= -80) return "원수";
  if (score <= -60) return "혐오";
  if (score <= -40) return "적대";
  if (score <= -20) return "불편";
  if (score < 0) return "서먹";
  if (score === 0) return "얼굴만 아는 사람";
  if (score < 10) return "아는 사람";
  if (score < 20) return "지인";
  if (score < 40) return "친구";
  if (score < 60) return "절친";
  if (score < 80) return "신뢰";
  return "소울메이트";
}

function escapeHTML(s){
  return String(s ?? "").replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function renderVillage(){
  const wrap = $("villageView");
  if (!wrap) return;
  wrap.innerHTML = "";

  characters.forEach(c=>{
    const card = document.createElement("div");
    card.className = "char-card";

    const crown = (c.isMayor) ? `<div class="mayor-crown">👑</div>` : "";

    const statusBadges = [];
    if (c.faintedDaysLeft > 0) statusBadges.push(`<span class="status-beggar">기절 ${c.faintedDaysLeft}일</span>`);
    if (c.sickDaysLeft > 0) statusBadges.push(`<span class="status-sick">아픔 ${c.sickDaysLeft}일</span>`);
    if (c.job?.id === "beggar") statusBadges.push(`<span class="status-beggar">거지 ${c.beggarDaysLeft}일</span>`);

    const jobName = c.job ? c.job.name : (day <= 3 ? "무직" : "대기");
    const moneyLine = `${formatMoney(c.money)}원`;

    const stats = c.stats;
    const hpP = hpPercent(c);
    const epP = epPercent(c);

    card.innerHTML = `
      ${crown}
      <div class="char-header">
        <div class="char-name">${escapeHTML(c.name)} <span style="font-size:.85em;color:#888;">(${escapeHTML(c.mbti)})</span></div>
        <div class="char-job-badge">${escapeHTML(jobName)}</div>
      </div>
      <div class="char-money">${moneyLine}</div>
      <div class="stats-row">
        <div>근력 ${stats.str}</div>
        <div>정신 ${stats.ment}</div>
        <div>지능 ${stats.intel}</div>
        <div>민첩 ${stats.agi}</div>
      </div>
      <div class="bar-group">
        <div class="bar-label">HP</div>
        <div class="bar-track"><div class="bar-fill hp-fill" style="width:${hpP}%;"></div></div>
        <div style="width:48px;text-align:right;color:#888;">${hpP}%</div>
      </div>
      <div class="bar-group">
        <div class="bar-label">EP</div>
        <div class="bar-track"><div class="bar-fill ep-fill" style="width:${epP}%;"></div></div>
        <div style="width:48px;text-align:right;color:#888;">${epP}%</div>
      </div>
      <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">${statusBadges.join("")}</div>
      <button class="btn-detail">관계 상세</button>
    `;

    const btn = card.querySelector(".btn-detail");
    btn.onclick = ()=>openAffinityModal(c.id);

    wrap.appendChild(card);
  });
}

function kindToColor(kind){
  if (kind === LOG_KIND.leisure) return "#74b9ff";
  if (kind === LOG_KIND.secret) return "#00b894";
  if (kind === LOG_KIND.love) return "#ff7675";
  return "#dfe6e9";
}

function renderLogs(dailyLogs){
  const lc = $("logContent");
  if (!lc) return;

  const dayMark = document.createElement("div");
  dayMark.className = "log-day-mark";
  dayMark.textContent = `${day}일차`;
  lc.prepend(dayMark);

  dailyLogs.slice().reverse().forEach(x=>{
    const div = document.createElement("div");
    div.className = "log-entry";
    const color = kindToColor(x.kind);
    div.innerHTML = `<span style="color:${color};font-weight:${x.kind===LOG_KIND.normal ? 500 : 700};">${escapeHTML(x.text)}</span>`;
    lc.prepend(div);
  });
}

function openAffinityModal(charId){
  const c = characters.find(x=>x.id===charId);
  if (!c) return;

  const modal = $("affinityModal");
  const title = $("modalTitle");
  const list = $("modalList");
  if (!modal || !title || !list) return;

  title.textContent = `${c.name} 관계 상세`;
  list.innerHTML = "";

  const rows = [];
  characters.forEach(o=>{
    if (o.id === c.id) return;
    const score = c.relationships?.[o.id] ?? 0;
    const sp = getSpecialStatusBetween(c,o);
    rows.push({ name:o.name, id:o.id, score, sp, label:getRelLabel(score, sp) });
  });

  rows.sort((a,b)=>b.score - a.score);

  if (rows.length === 0){
    const it = document.createElement("div");
    it.className = "modal-item";
    it.innerHTML = `<div style="color:#888;">아직 관계가 없습니다.</div><div class="val-zero">0</div>`;
    list.appendChild(it);
  } else {
    rows.forEach(r=>{
      const it = document.createElement("div");
      it.className = "modal-item";
      const cls = r.score>0 ? "val-plus" : r.score<0 ? "val-minus" : "val-zero";
      it.innerHTML = `<div>${escapeHTML(r.name)} <span style="color:#888;font-size:.85em;">${escapeHTML(r.label)}</span></div><div class="${cls}">${r.score}</div>`;
      list.appendChild(it);
    });
  }

  modal.style.display = "flex";
}

function closeModal(ev){
  const modal = $("affinityModal");
  if (!modal) return;
  if (ev && ev.target && ev.target.id === "affinityModal") modal.style.display = "none";
}

window.closeModal = closeModal;

function buildNetworkData(){
  const nodes = [];
  const edges = [];

  characters.forEach(c=>{
    nodes.push({
      id: c.id,
      label: c.isMayor ? `👑 ${c.name}` : c.name,
      shape: "dot",
      size: c.isMayor ? 28 : 22,
      font: { face: "Pretendard", color: "#2d3436", size: 14 }
    });
  });

  characters.forEach(a=>{
    characters.forEach(b=>{
      if (a.id === b.id) return;
      const score = a.relationships?.[b.id] ?? 0;
      const sp = getSpecialStatusBetween(a,b);
      if (score === 0 && !sp) return;

      let color = "#b2bec3";
      let width = 1;

      if (sp === "married" || sp === "lover") { color = "#ff7675"; width = 3; }
      else if (sp === "coldwar") { color = "#fdcb6e"; width = 2; }
      else if (sp === "cut") { color = "#2d3436"; width = 2; }
      else if (score < 0) { color = "#636e72"; width = 2; }
      else if (score >= 61) { color = "#0984e3"; width = 3; }
      else if (score >= 31) { color = "#00b894"; width = 2; }

      edges.push({
        from: a.id,
        to: b.id,
        color: { color },
        width,
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        smooth: { type: "dynamic" }
      });
    });
  });

  return { nodes, edges };
}

function renderNetwork(){
  const cont = $("networkView");
  if (!cont) return;

  const data = buildNetworkData();
  const options = {
    physics: { stabilization: true },
    interaction: { hover: true, dragNodes: true },
    nodes: {
      borderWidth: 2,
      color: { border: "#dfe6e9", background: "#ffffff" }
    }
  };

  if (!network) {
    network = new vis.Network(cont, { nodes: new vis.DataSet(data.nodes), edges: new vis.DataSet(data.edges) }, options);
  } else {
    network.setData({ nodes: new vis.DataSet(data.nodes), edges: new vis.DataSet(data.edges) });
  }
}

function switchTab(tab, btn){
  activeTab = tab;
  const v = $("villageView");
  const nc = $("networkContainer");
  if (!v || !nc) return;

  document.querySelectorAll(".tab-btn").forEach(b=>{
    b.classList.remove("active");
  });
  if (btn) btn.classList.add("active");

  if (tab === "village") {
    v.style.display = "grid";
    nc.style.display = "none";
    renderVillage();
  } else {
    v.style.display = "none";
    nc.style.display = "block";
    renderNetwork();
  }
}

window.switchTab = switchTab;

function initMbtiSelect(){
  const sel = $("mbtiInput");
  if (!sel) return;
  sel.innerHTML = "";
  MBTI_TYPES.forEach(t=>{
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    sel.appendChild(o);
  });
}

function addCharacter(){
  const name = ($("nameInput")?.value ?? "").trim();
  const mbti = $("mbtiInput")?.value;

  if (!name) return alert("이름을 입력해주세요.");
  if (!mbti) return alert("MBTI를 선택해주세요.");
  if (characters.some(c=>c.name===name)) return alert("이미 존재하는 이름입니다.");

  const st = statsRandom();
  const c = {
    id: makeId(),
    name,
    mbti,
    stats: st,
    hp: maxHP(st),
    ep: maxEP(st),
    money: 100,
    job: null,
    relationships: {},
    specialRelations: {},
    coldwarMeta: {},
    cutMeta: {},
    sickDaysLeft: 0,
    faintedDaysLeft: 0,
    didWorkToday: false,
    didWorkYesterday: false,
    traveledToday: false,
    beggarDaysLeft: 0,
    isMayor: false,
    dayAdded: day
  };

  characters.forEach(o=>{
    if (o.id === c.id) return;
    o.relationships[c.id] = o.relationships[c.id] ?? 0;
    c.relationships[o.id] = c.relationships[o.id] ?? 0;
  });

  if (day >= 4) {
    if ((day - c.dayAdded + 1) >= 2) c.job = pickJob();
  }

  characters.push(c);

  $("nameInput").value = "";
  pushLog(`[입주] ${c.name}(${c.mbti})가 마을에 왔다.`, LOG_KIND.normal);

  renderVillage();
  if (activeTab === "network") renderNetwork();
}

window.addCharacter = addCharacter;
window.nextDay = nextDay;

function pushLog(text, kind){
  const entry = { day, text, kind };
  logs.unshift(entry);

  const lc = $("logContent");
  if (!lc) return;

  const div = document.createElement("div");
  div.className = "log-entry";
  const color = kindToColor(kind);
  div.innerHTML = `<span style="color:${color};font-weight:${kind===LOG_KIND.normal ? 500 : 700};">${escapeHTML(text)}</span>`;
  lc.prepend(div);
}

function updateDayUI(){
  const d = $("dayDisplay");
  if (d) d.textContent = String(day);
}

function saveData(){
  const payload = {
    version: "2.0",
    day,
    gameEnded,
    characters
  };
  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload));
  const a = document.createElement("a");
  a.href = str;
  a.download = `village_save_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

window.saveData = saveData;

function loadData(input){
  const file = input?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const json = JSON.parse(e.target.result);
      if (!json || !Array.isArray(json.characters)) throw new Error("잘못된 파일 형식");

      day = Number(json.day || 1);
      gameEnded = !!json.gameEnded;

      characters = json.characters.map(c=>{
        const st = c.stats || statsRandom();
        const hpM = maxHP(st);
        const epM = maxEP(st);
        return {
          id: c.id || makeId(),
          name: c.name,
          mbti: c.mbti,
          stats: st,
          hp: clamp(Number(c.hp ?? hpM), 0, hpM),
          ep: clamp(Number(c.ep ?? epM), 0, epM),
          money: Number(c.money ?? 0),
          job: c.job || null,
          relationships: c.relationships || {},
          specialRelations: c.specialRelations || {},
          coldwarMeta: c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || c.coldwarMeta || {},
          cutMeta: c.cutMeta || {},
          sickDaysLeft: Number(c.sickDaysLeft || 0),
          faintedDaysLeft: Number(c.faintedDaysLeft || 0),
          didWorkToday: false,
          didWorkYesterday: !!c.didWorkYesterday,
          traveledToday: false,
          beggarDaysLeft: Number(c.beggarDaysLeft || 0),
          isMayor: !!c.isMayor,
          dayAdded: Number(c.dayAdded || 1)
        };
      });

      characters.forEach(a=>{
        characters.forEach(b=>{
          if (a.id===b.id) return;
          if (a.relationships[b.id] == null) a.relationships[b.id] = 0;
          if (!a.specialRelations) a.specialRelations = {};
        });
      });

      const lc = $("logContent");
      if (lc) lc.innerHTML = `<div class="log-entry">불러오기 완료.</div>`;

      updateDayUI();
      renderVillage();
      if (activeTab === "network") renderNetwork();

      const btn = document.querySelector(".btn-next");
      if (btn) btn.disabled = !!gameEnded;

    } catch(err){
      alert("불러오기 실패: " + err.message);
    }
  };
  reader.readAsText(file);
  input.value = "";
}

window.loadData = loadData;

function saveLogText(){
  const lines = [];
  logs.slice().reverse().forEach(l=>{
    lines.push(`[${l.day}일차] ${l.text}`);
  });
  const txt = lines.join("\n");
  const blob = new Blob([txt], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `village_log_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

window.saveLogText = saveLogText;

window.onload = ()=>{
  initMbtiSelect();
  updateDayUI();
  renderVillage();
};
