const MBTI_TYPES = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ"
];

const JOBS = [
  "광부","농부","요리사","교사","목수","사무직","상인","의사","쥬얼리상","개발자","무역가","알바생","요가강사","바리스타","디자이너","경찰","간호사"
];

const WORDS = {
  travel: ["해변","산","온천","축제","도시","놀이공원","캠핑","섬","박람회","바다"],
  leisure: ["낚시","요리","수다","게임","운동","정리정돈","산책","독서","영화","음악"],
  villageWork: ["나무를 정리했다","길을 닦았다","돌을 치웠다","울타리를 세웠다","잡초를 뽑았다","창고를 정리했다"]
};

const compatibilityData = {
  "INFP": { "ENFJ": 5, "ENTJ": 5, "INFP": 4, "ENFP": 4, "INFJ": 4, "INTJ": 4, "INTP": 4, "ENTP": 4, "ISFP": 1, "ESFP": 1, "ISTP": 1, "ESTP": 1, "ISFJ": 1, "ESFJ": 1, "ISTJ": 1, "ESTJ": 1 },
  "ENFP": { "INFJ": 5, "INTJ": 5, "INFP": 4, "ENFP": 4, "ENFJ": 4, "ENTJ": 4, "INTP": 4, "ENTP": 4, "ISFP": 1, "ESFP": 1, "ISTP": 1, "ESTP": 1, "ISFJ": 1, "ESFJ": 1, "ISTJ": 1, "ESTJ": 1 },
  "INFJ": { "ENFP": 5, "ENTP": 5, "INFP": 4, "INFJ": 4, "ENFJ": 4, "INTJ": 4, "INTP": 4, "ENTJ": 4, "ISFP": 1, "ESFP": 1, "ISTP": 1, "ESTP": 1, "ISFJ": 1, "ESFJ": 1, "ISTJ": 1, "ESTJ": 1 },
  "ENFJ": { "INFP": 5, "ISFP": 5, "ENFP": 4, "INFJ": 4, "ENFJ": 4, "INTJ": 4, "INTP": 4, "ENTP": 4, "ENTJ": 4, "ESFP": 1, "ISTP": 1, "ESTP": 1, "ISFJ": 1, "ESFJ": 1, "ISTJ": 1, "ESTJ": 1 },

  "INTJ": { "ENFP": 5, "ENTP": 5, "INFP": 4, "INFJ": 4, "ENFJ": 4, "INTJ": 4, "INTP": 4, "ENTJ": 4, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 2, "ESFJ": 2, "ISTJ": 3, "ESTJ": 3 },
  "ENTJ": { "INFP": 5, "INTP": 5, "ENFP": 4, "INFJ": 4, "ENFJ": 4, "INTJ": 4, "ENTP": 4, "ENTJ": 4, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 2, "ESFJ": 2, "ISTJ": 3, "ESTJ": 3 },
  "INTP": { "ENTJ": 5, "ESTJ": 5, "INFP": 4, "ENFP": 4, "INFJ": 4, "INTJ": 4, "INTP": 4, "ENTP": 4, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 2, "ESFJ": 2, "ISTJ": 2, "ENFJ": 2 },
  "ENTP": { "INFJ": 5, "INTJ": 5, "INFP": 4, "ENFP": 4, "ENFJ": 4, "INTP": 4, "ENTP": 4, "ENTJ": 4, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 2, "ESFJ": 2, "ISTJ": 2, "ESTJ": 2 },

  "ISFP": { "ESFJ": 5, "ESTJ": 5, "ENFJ": 5, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 3, "ISTJ": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ESFP": { "ISFJ": 5, "ISTJ": 5, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ESFJ": 3, "ESTJ": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ISTP": { "ESFJ": 5, "ESTJ": 5, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ISFJ": 3, "ISTJ": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ESTP": { "ISFJ": 5, "ISTJ": 5, "ISFP": 3, "ESFP": 3, "ISTP": 3, "ESTP": 3, "ESFJ": 3, "ESTJ": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },

  "ISFJ": { "ESFP": 5, "ESTP": 5, "ISFJ": 4, "ESFJ": 4, "ISTJ": 4, "ESTJ": 4, "ISFP": 3, "ISTP": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ESFJ": { "ISFP": 5, "ISTP": 5, "ISFJ": 4, "ESFJ": 4, "ISTJ": 4, "ESTJ": 4, "ESFP": 3, "ESTP": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ISTJ": { "ESFP": 5, "ESTP": 5, "ISFJ": 4, "ESFJ": 4, "ISTJ": 4, "ESTJ": 4, "ISFP": 3, "ISTP": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "INTP": 2, "ENTP": 2 },
  "ESTJ": { "ISFP": 5, "ISTP": 5, "INTP": 5, "ISFJ": 4, "ESFJ": 4, "ISTJ": 4, "ESTJ": 4, "ESFP": 3, "ESTP": 3, "INFP": 1, "ENFP": 1, "INFJ": 1, "ENFJ": 1, "INTJ": 2, "ENTJ": 2, "ENTP": 2 }
};

let day = 1;
let characters = [];
let logs = [];
let activeTab = "village";
let network = null;
let mayorSelected = false;
let mayorId = null;

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hasJongseong(char) {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code - 0xAC00) % 28 > 0;
}

function getJosa(word, type) {
  const lastChar = word.charAt(word.length - 1);
  const has = hasJongseong(lastChar);
  if (type === "은/는") return has ? "은" : "는";
  if (type === "이/가") return has ? "이" : "가";
  if (type === "을/를") return has ? "을" : "를";
  if (type === "와/과") return has ? "과" : "와";
  if (type === "에게") return "에게";
  return "";
}

function addMoney(char, delta) {
  char.money = safeNum(char.money, 0);
  delta = safeNum(delta, 0);
  char.money = char.money + delta;
  if (char.money < 0) char.money = 0;
}

function calcChem(m1, m2) {
  if (!compatibilityData[m1] || compatibilityData[m1][m2] == null) return 3;
  return compatibilityData[m1][m2];
}

function getSpecialBetween(a, b) {
  const s1 = a?.specialRelations?.[b?.id];
  const s2 = b?.specialRelations?.[a?.id];
  if (s1 === "married" || s2 === "married") return "married";
  if (s1 === "lover" || s2 === "lover") return "lover";
  if (s1 === "coldwar" || s2 === "coldwar") return "coldwar";
  if (s1 === "cut" || s2 === "cut") return "cut";
  return null;
}

function setSpecial(a, b, status) {
  if (!a.specialRelations) a.specialRelations = {};
  if (status == null) delete a.specialRelations[b.id];
  else a.specialRelations[b.id] = status;
}

function relGet(a, b) {
  return safeNum(a.relationships?.[b.id], 0);
}

function relSet(a, b, v) {
  if (!a.relationships) a.relationships = {};
  a.relationships[b.id] = v;
}

function relAdd(a, b, delta, bondedCap = false) {
  const old = relGet(a, b);
  let v = old + safeNum(delta, 0);

  const sp = getSpecialBetween(a, b);
  const isBonded = sp === "lover" || sp === "married" || bondedCap;
  const maxVal = isBonded ? 200 : 100;

  if (v > maxVal) v = maxVal;
  if (v < -100) v = -100;

  relSet(a, b, v);
}

function logPush(entries, text, kind) {
  entries.push({ text, kind });
}

function logKindColor(kind) {
  if (kind === "blue") return "#74b9ff";
  if (kind === "green") return "#00b894";
  if (kind === "pink") return "#ff7675";
  return "#dfe6e9";
}

function renderLogs(newEntries) {
  const container = document.getElementById("logContent");
  if (!container) return;

  const dayMark = document.createElement("div");
  dayMark.className = "log-day-mark";
  dayMark.textContent = `${day}일차`;
  container.insertBefore(dayMark, container.firstChild);

  for (let i = newEntries.length - 1; i >= 0; i--) {
    const e = newEntries[i];
    const div = document.createElement("div");
    div.className = "log-entry";
    div.style.color = logKindColor(e.kind);
    div.textContent = e.text;
    container.insertBefore(div, container.firstChild);
  }
}

function ensureMbtiOptions() {
  const sel = document.getElementById("mbtiInput");
  if (!sel) return;
  if (sel.options.length) return;
  MBTI_TYPES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

function makeStats() {
  const str = randInt(1, 5);
  const mind = randInt(1, 5);
  const intel = randInt(1, 5);
  const agi = randInt(1, 5);
  const maxHp = 60 + str * 20;
  const maxEp = 60 + mind * 20;
  return { str, mind, intel, agi, maxHp, maxEp, hp: maxHp, ep: maxEp };
}

function addCharacter() {
  const nameEl = document.getElementById("nameInput");
  const mbtiEl = document.getElementById("mbtiInput");
  if (!nameEl || !mbtiEl) return;

  const name = (nameEl.value || "").trim();
  const mbti = mbtiEl.value;

  if (!name) return alert("이름을 입력해주세요.");
  if (characters.some(c => c.name === name)) return alert("이미 존재하는 이름입니다.");

  const st = makeStats();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  characters.push({
    id,
    name,
    mbti,
    dayJoined: day,
    job: null,
    isMayor: false,
    money: 200,
    ...st,
    relationships: {},
    specialRelations: {},
    sickDays: 0,
    faintDays: 0,
    beggarDays: 0,
    skippedWorkDays: 0,
    lastMain: "-",
    lastFree: "-"
  });

  nameEl.value = "";
  renderVillage();
  if (activeTab === "network") renderNetwork();
}

function removeCharacter(id) {
  characters = characters.filter(c => c.id !== id);
  characters.forEach(c => {
    if (c.relationships) delete c.relationships[id];
    if (c.specialRelations) delete c.specialRelations[id];
  });
  if (mayorId === id) {
    mayorId = null;
    mayorSelected = false;
    characters.forEach(c => c.isMayor = false);
  }
  renderVillage();
  if (activeTab === "network") renderNetwork();
}

function jobTier(job) {
  if (job === "의사") return 5;
  if (job === "개발자") return 4;
  if (job === "무역가") return 4;
  if (job === "쥬얼리상") return 4;
  if (job === "디자이너") return 3;
  if (job === "경찰") return 3;
  if (job === "간호사") return 3;
  if (job === "교사") return 3;
  if (job === "상인") return 3;
  if (job === "사무직") return 2;
  if (job === "요리사") return 2;
  if (job === "바리스타") return 2;
  if (job === "요가강사") return 2;
  if (job === "목수") return 2;
  if (job === "광부") return 2;
  if (job === "농부") return 2;
  if (job === "알바생") return 1;
  if (job === "이장") return 3;
  if (job === "거지") return 0;
  return 2;
}

function assignRandomJob(char) {
  if (!char) return;
  if (char.isMayor) { char.job = "이장"; return; }
  char.job = pick(JOBS);
}

function maybeAssignJobs(entries) {
  if (day === 4) {
    characters.forEach(c => {
      if (!c.job) {
        assignRandomJob(c);
        logPush(entries, `[직업] ${c.name}${getJosa(c.name,"은/는")} ${c.job}가 되었다.`, "normal");
      }
    });
    return;
  }
  if (day > 4) {
    characters.forEach(c => {
      if (!c.job && (day - safeNum(c.dayJoined, day)) >= 1) {
        assignRandomJob(c);
        logPush(entries, `[직업] ${c.name}${getJosa(c.name,"은/는")} ${c.job}가 되었다.`, "normal");
      }
    });
  }
}

function freeTimeDivider(entries) {
  logPush(entries, "— 자유시간 —", "blue");
}

function setFaint(char, entries) {
  char.faintDays = 3;
  const loss = randInt(120, 220);
  addMoney(char, -loss);
  char.lastMain = "기절";
  char.lastFree = "-";
  logPush(entries, `[기절] ${char.name}${getJosa(char.name,"은/는")} 쓰러져 3일 동안 일을 못 한다... (치료비 -${loss}원)`, "normal");
}

function consumeHP(char, amount) {
  char.hp = Math.max(0, safeNum(char.hp, 0) - safeNum(amount, 0));
}

function consumeEP(char, amount) {
  char.ep = Math.max(0, safeNum(char.ep, 0) - safeNum(amount, 0));
}

function restoreHP(char, amount) {
  const max = safeNum(char.maxHp, 100);
  char.hp = Math.min(max, safeNum(char.hp, 0) + safeNum(amount, 0));
}

function restoreEP(char, amount) {
  const max = safeNum(char.maxEp, 100);
  char.ep = Math.min(max, safeNum(char.ep, 0) + safeNum(amount, 0));
}

function canAct(char) {
  if (char.sickDays > 0) return false;
  if (char.faintDays > 0) return false;
  return true;
}

function startSick(char, entries) {
  char.sickDays = randInt(1, 3);
  logPush(entries, `[컨디션] ${char.name}${getJosa(char.name,"은/는")} 아파서 ${char.sickDays}일 동안 쉬어야 한다.`, "normal");
}

function tickStatus(char, entries) {
  if (char.faintDays > 0) {
    char.faintDays -= 1;
    const loss = randInt(30, 60);
    addMoney(char, -loss);
    logPush(entries, `[회복중] ${char.name}${getJosa(char.name,"은/는")} 기절 후 회복 중... (생활비 -${loss}원)`, "normal");
    if (char.faintDays === 0) {
      restoreHP(char, Math.floor(char.maxHp * 0.6));
      restoreEP(char, Math.floor(char.maxEp * 0.6));
      logPush(entries, `[회복] ${char.name}${getJosa(char.name,"은/는")} 다시 움직일 수 있게 됐다.`, "normal");
    }
    return;
  }

  if (char.sickDays > 0) {
    char.sickDays -= 1;
    const loss = randInt(15, 35);
    addMoney(char, -loss);
    logPush(entries, `[아픔] ${char.name}${getJosa(char.name,"은/는")} 몸이 안 좋아 쉬었다. (약값 -${loss}원)`, "normal");
    if (char.sickDays === 0) {
      logPush(entries, `[회복] ${char.name}${getJosa(char.name,"은/는")} 컨디션이 돌아왔다.`, "normal");
    }
  }
}

function maybeGetSick(char, entries) {
  if (!canAct(char)) return;
  if (Math.random() < 0.02) startSick(char, entries);
}

function isBroke(char) {
  return safeNum(char.money, 0) <= 0;
}

function maybeBecomeBeggar(char) {
  if (char.isMayor) return;
  if (char.beggarDays > 0) return;
  if (char.job === "거지") return;
  if (isBroke(char) && safeNum(char.skippedWorkDays, 0) >= 1) {
    char.job = "거지";
    char.beggarDays = 10;
  }
}

function beggarStep(char, entries) {
  if (char.beggarDays <= 0) return;

  const donors = characters.filter(x => x.id !== char.id && canAct(x) && x.beggarDays <= 0);
  if (donors.length === 0) {
    logPush(entries, `[구걸] ${char.name}${getJosa(char.name,"은/는")} 구걸했지만 아무도 없었다...`, "normal");
  } else {
    const donor = pick(donors);
    addMoney(char, +10);
    relAdd(donor, char, -5);
    logPush(entries, `[구걸] ${char.name}${getJosa(char.name,"은/는")} ${donor.name}${getJosa(donor.name,"에게")} 10원을 기부받았다. (기부한 사람 호감도 -5)`, "normal");
  }

  char.beggarDays -= 1;
  char.lastMain = "구걸";
  char.lastFree = "-";

  if (char.beggarDays === 0) {
    char.job = null;
    char.skippedWorkDays = 0;
    logPush(entries, `[전환] ${char.name}${getJosa(char.name,"은/는")} 다시 직업을 얻으려 한다...`, "normal");
  }
}

function workIncome(char) {
  const tier = jobTier(char.job);
  const intel = safeNum(char.intel, 1);
  const agi = safeNum(char.agi, 1);

  const maxEp = Math.max(1, safeNum(char.maxEp, 1));
  const epRatio = Math.max(0, Math.min(1, safeNum(char.ep, 0) / maxEp));

  const base = 18 + tier * 22;
  const skill = (intel * 0.65 + agi * 0.35);
  const earn = Math.floor(base * skill * (0.55 + epRatio * 0.65));
  return Math.max(0, earn);
}

function workCosts(char) {
  const str = safeNum(char.str, 1);
  const mind = safeNum(char.mind, 1);

  let hp = randInt(14, 50);
  let ep = randInt(14, 40);

  hp = Math.max(8, Math.floor(hp * (1.35 - str * 0.12)));
  ep = Math.max(8, Math.floor(ep * (1.35 - mind * 0.12)));

  if (char.job === "광부") hp += randInt(10, 18), ep += randInt(2, 6);
  if (char.job === "농부") hp += randInt(7, 14), ep += randInt(2, 5);
  if (char.job === "목수") hp += randInt(6, 12), ep += randInt(3, 7);

  if (char.job === "의사") ep += randInt(10, 18), hp += randInt(2, 6);
  if (char.job === "개발자") ep += randInt(10, 20), hp += randInt(1, 5);
  if (char.job === "사무직") ep += randInt(6, 12);
  if (char.job === "교사") ep += randInt(6, 12);
  if (char.job === "간호사") ep += randInt(8, 16), hp += randInt(2, 6);
  if (char.job === "경찰") hp += randInt(6, 12), ep += randInt(5, 10);
  if (char.job === "알바생") hp += randInt(4, 10), ep += randInt(4, 10);

  if (char.job === "이장") {
    hp = Math.max(4, Math.floor(hp * 0.55));
    ep = Math.max(4, Math.floor(ep * 0.55));
  }

  return { hp, ep };
}


function doWork(char, entries) {
  if (!char.job || char.job === "거지") return false;
  if (!canAct(char)) return false;

  const income = workIncome(char);
  const c = workCosts(char);

  consumeHP(char, c.hp);
  consumeEP(char, c.ep);
  addMoney(char, +income);

  char.lastMain = "돈벌기";
  char.lastFree = "여가";

  logPush(entries, `[돈벌기] ${char.name}${getJosa(char.name,"은/는")} ${char.job}로 일해 ${income}원을 벌었다. (HP -${c.hp}, EP -${c.ep})`, "normal");

  if (char.hp <= 0 || char.ep <= 0) setFaint(char, entries);
  return true;
}

function doVillagePrep(char, entries) {
  if (!canAct(char)) return;
  const hp = randInt(5, 12);
  const ep = randInt(5, 12);
  consumeHP(char, hp);
  consumeEP(char, ep);
  char.lastMain = "마을 정리";
  char.lastFree = "여가";
  logPush(entries, `[마을] ${char.name}${getJosa(char.name,"은/는")} ${pick(WORDS.villageWork)}. (HP -${hp}, EP -${ep})`, "normal");
  if (char.hp <= 0 || char.ep <= 0) setFaint(char, entries);
}

function tryConfess(a, b, entries) {
  const sp = getSpecialBetween(a, b);
  if (sp === "married" || sp === "lover") return false;
  if (!canAct(a) || !canAct(b)) return false;

  const score = relGet(a, b);
  const chem = calcChem(a.mbti, b.mbti);
  if (score < 55) return false;

  const chemBonus = (chem - 3) * 0.06;
  const chance = 0.35 + Math.min(0.35, score / 200) + chemBonus;

  if (Math.random() < chance) {
    setSpecial(a, b, "lover");
    setSpecial(b, a, "lover");
    relAdd(a, b, 15, true);
    relAdd(b, a, 15, true);
    restoreEP(a, a.maxEp);
    restoreEP(b, b.maxEp);
    logPush(entries, `[고백 성공] ${a.name}${getJosa(a.name,"은/는")} ${b.name}에게 고백했고, 연인이 되었다! (EP 풀충전)`, "pink");
    return true;
  } else {
    relAdd(a, b, -8);
    relAdd(b, a, -3);
    if (Math.random() < 0.45) {
      setSpecial(a, b, "coldwar");
      setSpecial(b, a, "coldwar");
      logPush(entries, `[냉전] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 어색해졌다...`, "normal");
    }
    logPush(entries, `[고백 실패] ${a.name}${getJosa(a.name,"은/는")} ${b.name}에게 차였다...`, "normal");
    return true;
  }
}

function tryMarriage(a, b, entries) {
  const sp = getSpecialBetween(a, b);
  if (sp !== "lover") return false;
  if (!canAct(a) || !canAct(b)) return false;

  const sA = relGet(a, b);
  const sB = relGet(b, a);
  if (sA < 170 || sB < 170) return false;

  const minNeed = 160;
  if (safeNum(a.money,0) < minNeed || safeNum(b.money,0) < minNeed) return false;

  const costA = randInt(150, 260);
  const costB = randInt(150, 260);

  addMoney(a, -costA);
  addMoney(b, -costB);

  setSpecial(a, b, "married");
  setSpecial(b, a, "married");

  restoreEP(a, a.maxEp);
  restoreEP(b, b.maxEp);

  logPush(entries, `[결혼] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 결혼했다! (-${costA}원/-${costB}원, EP 풀충전)`, "pink");
  return true;
}

function tryDate(a, b, freeEntries) {
  const sp = getSpecialBetween(a, b);
  const sA = relGet(a, b);
  const sB = relGet(b, a);
  if (!canAct(a) || !canAct(b)) return false;
  if (a.beggarDays > 0 || b.beggarDays > 0) return false;

  if (!(sp === "lover" || sp === "married" || (sA >= 60 && sB >= 60))) return false;
  if (safeNum(a.money,0) < 80 || safeNum(b.money,0) < 80) return false;

  const costA = randInt(60, 140);
  const costB = randInt(60, 140);

  addMoney(a, -costA);
  addMoney(b, -costB);

  const boost = randInt(10, 18);
  relAdd(a, b, boost, true);
  relAdd(b, a, boost, true);

  restoreEP(a, a.maxEp);
  restoreEP(b, b.maxEp);

  a.lastFree = "데이트";
  b.lastFree = "데이트";

  logPush(freeEntries, `[데이트] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 둘만의 시간을 보냈다. (-${costA}원/-${costB}원, EP 풀충전)`, "pink");
  return true;
}

function randomSocialEvent(a, b, entries, freeEntries) {
  
  if (!canAct(a) || !canAct(b)) return;
  consumeEP(a, randInt(1, 4));
  consumeEP(b, randInt(1, 4));


  const sp = getSpecialBetween(a, b);
  const sA = relGet(a, b);
  const sB = relGet(b, a);

  const r = Math.random();

  if (sp === "coldwar") {
    if (Math.random() < 0.45) {
      setSpecial(a, b, null);
      setSpecial(b, a, null);
      relAdd(a, b, 15);
      relAdd(b, a, 15);
      logPush(entries, `[화해] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 서로 사과하고 화해했다.`, "normal");
    } else {
      relAdd(a, b, 2);
      relAdd(b, a, 2);
      logPush(entries, `[냉전] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 말은 했지만 아직 어색하다.`, "normal");
    }
    return;
  }

  if (r < 0.10) {
    const delta = -randInt(10, 18);
    relAdd(a, b, delta);
    relAdd(b, a, delta);
    if (Math.random() < 0.55) {
      setSpecial(a, b, "coldwar");
      setSpecial(b, a, "coldwar");
      logPush(entries, `[싸움] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 크게 다퉜다... (냉전)`, "normal");
    } else {
      logPush(entries, `[싸움] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 다퉜다.`, "normal");
    }
    return;
  }

  if (r < 0.18 && sA >= 25 && sB >= 25) {
    const delta = randInt(12, 18);
    relAdd(a, b, delta);
    relAdd(b, a, delta);
    logPush(entries, `[비밀대화] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 서로의 비밀을 털어놓았다.`, "green");
    return;
  }

  if (r < 0.28 && (sp === "lover" || sp === "married") && Math.random() < 0.45) {
    const delta = randInt(6, 10);
    relAdd(a, b, delta, true);
    relAdd(b, a, delta, true);
    const extraCost = sp === "married" ? randInt(40, 90) : randInt(30, 70);
    addMoney(a, -extraCost);
    addMoney(b, -extraCost);
    restoreEP(a, a.maxEp);
    restoreEP(b, b.maxEp);
    logPush(freeEntries, `[연애] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 애정을 확인했다. (-${extraCost}원씩, EP 풀충전)`, "pink");
    return;
  }

  const chem = calcChem(a.mbti, b.mbti);
  const deltaBase =
    chem >= 5 ? randInt(6, 12) :
    chem === 4 ? randInt(3, 9) :
    chem === 3 ? randInt(0, 7) :
    randInt(-4, 5);

  relAdd(a, b, deltaBase);
  relAdd(b, a, deltaBase);
  logPush(entries, `[대화] ${a.name}${getJosa(a.name,"와/과")} ${b.name}${getJosa(b.name,"은/는")} 대화를 나눴다.`, "normal");
}

function pickPair(pool) {
  if (pool.length < 2) return null;
  const a = pool[Math.floor(Math.random() * pool.length)];
  let b = pool[Math.floor(Math.random() * pool.length)];
  let tries = 0;
  while (b.id === a.id && tries < 10) {
    b = pool[Math.floor(Math.random() * pool.length)];
    tries++;
  }
  if (b.id === a.id) return null;
  return [a, b];
}

function doTravelOrRest(char, freeEntries) {
  if (!canAct(char)) return false;
  if (char.beggarDays > 0) return false;

  const mode = Math.random();
  if (mode < 0.55) {
    const spend = randInt(1,5);
    addMoney(char, -spend);
    restoreHP(char, randInt(5,20) + spend);
    restoreEP(char, randInt(1,15) + spend);
    char.lastFree = "여가";
    logPush(freeEntries, `[여가] ${char.name}${getJosa(char.name,"은/는")} ${pick(WORDS.leisure)}로 쉬었다. (-${spend}원, HP +${gainHp}, EP +${gainEp})`, "blue");
    return true;
  } else {
    const cost = randInt(60, 200);
    if (safeNum(char.money,0) < cost) {
      const spend = randInt(5, 20);
      addMoney(char, -spend);
      restoreEP(char, randInt(1,5));
      char.lastFree = "여가";
      logPush(freeEntries, `[여가] ${char.name}${getJosa(char.name,"은/는")} 돈이 부족해 가까운 곳에서 쉬었다. (-${spend}원, HP +${gainHp}, EP +${gainEp})`, "blue");
      return true;
    }
    addMoney(char, -cost);
    restoreHP(char, randInt(18, 35));
    restoreEP(char, randInt(20, 45));
    char.lastFree = "여행";
    logPush(freeEntries, `[여행] ${char.name}${getJosa(char.name,"은/는")} ${pick(WORDS.travel)}로 여행을 다녀왔다. (-${cost}원, HP +${gainHp}, EP +${gainEp})`, "blue");
    return true;
  }
}

function selectMayorAtDay10(entries) {
  if (mayorSelected) return;
  if (day !== 10) return;
  if (characters.length === 0) return;

  let best = null;
  let bestScore = -1e9;

  characters.forEach(c => {
    let sum = 0;
    characters.forEach(o => {
      if (o.id === c.id) return;
      sum += relGet(c, o);
    });
    if (sum > bestScore) {
      bestScore = sum;
      best = c;
    }
  });

  if (!best) return;

  mayorSelected = true;
  mayorId = best.id;

  characters.forEach(c => c.isMayor = false);
  best.isMayor = true;
  best.job = "이장";
  best.beggarDays = 0;

  logPush(entries, `[이장] ${best.name}이(가) 이장으로 선정되었다! 👑`, "normal");
}

function relationshipLabel(score, special) {
  if (special === "married") return "💍 결혼";
  if (special === "lover") return "💖 연인";
  if (special === "coldwar") return "🔥 냉전";
  if (special === "cut") return "✂️ 절교";
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

function openAffinityModal(charId) {
  const modal = document.getElementById("affinityModal");
  const title = document.getElementById("modalTitle");
  const list = document.getElementById("modalList");
  if (!modal || !title || !list) return;

  const me = characters.find(c => c.id === charId);
  if (!me) return;

  title.textContent = `${me.name}의 관계`;

  const rels = Object.entries(me.relationships || {})
    .map(([id, score]) => {
      const other = characters.find(c => c.id === id);
      if (!other) return null;
      const special = getSpecialBetween(me, other);
      return { id, name: other.name, score: safeNum(score, 0), special };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  list.innerHTML = "";

  if (rels.length === 0) {
    const empty = document.createElement("div");
    empty.style.color = "#777";
    empty.style.padding = "10px 0";
    empty.textContent = "아직 관계가 없습니다.";
    list.appendChild(empty);
  } else {
    rels.forEach(r => {
      const row = document.createElement("div");
      row.className = "modal-item";

      const tag = relationshipLabel(r.score, r.special);
      let cls = "val-zero";
      if (r.score > 0) cls = "val-plus";
      if (r.score < 0) cls = "val-minus";

      row.innerHTML = `
        <div style="font-weight:600;">${r.name} <span style="font-size:0.85em;color:#777;font-weight:500;">(${tag})</span></div>
        <div class="${cls}">${r.score}</div>
      `;
      list.appendChild(row);
    });
  }

  modal.style.display = "flex";
}

function closeModal(e) {
  const modal = document.getElementById("affinityModal");
  if (!modal) return;
  if (e && e.target !== modal) return;
  modal.style.display = "none";
}

function buildNetworkData() {
  const nodes = characters.map(c => {
    const color = c.isMayor ? "#fdcb6e" : "#dfe6e9";
    return {
      id: c.id,
      label: c.name,
      shape: "dot",
      size: c.isMayor ? 22 : 18,
      color: { background: color, border: "#636e72" },
      font: { color: "#2d3436", face: "Pretendard" }
    };
  });

  const edges = [];
  const seen = new Set();

  characters.forEach(a => {
    characters.forEach(b => {
      if (a.id === b.id) return;
      const key = [a.id, b.id].sort().join("|");
      if (seen.has(key)) return;

      const score = relGet(a, b);
      const score2 = relGet(b, a);
      const avg = Math.round((score + score2) / 2);

      const sp = getSpecialBetween(a, b);
      if (avg === 0 && !sp) return;

      let color = "#b2bec3";
      let width = 1;

      if (sp === "married" || sp === "lover") { color = "#ff7675"; width = 3; }
      else if (sp === "coldwar") { color = "#fdcb6e"; width = 2; }
      else if (avg >= 61) { color = "#0984e3"; width = 2; }
      else if (avg >= 31) { color = "#00b894"; width = 2; }
      else if (avg < 0) { color = "#636e72"; width = 2; }

      edges.push({
        from: a.id,
        to: b.id,
        value: Math.min(10, Math.max(1, Math.floor(Math.abs(avg) / 10))),
        color: { color },
        width
      });

      seen.add(key);
    });
  });

  return { nodes, edges };
}

function renderNetwork() {
  const container = document.getElementById("networkView");
  if (!container) return;

  const netWrap = document.getElementById("networkContainer");
  const villageView = document.getElementById("villageView");
  if (netWrap) netWrap.style.display = "block";
  if (villageView) villageView.style.display = "none";

  const data = buildNetworkData();
  const options = {
    physics: {
      stabilization: { iterations: 120 },
      barnesHut: { gravitationalConstant: -8000, springLength: 140, springConstant: 0.03 }
    },
    interaction: { hover: true, dragNodes: true },
    nodes: { borderWidth: 2 },
    edges: { smooth: true }
  };

  network = new vis.Network(container, data, options);
  setTimeout(() => { network?.fit?.(); network?.redraw?.(); }, 0);
}

function switchTab(tab, btn) {
  activeTab = tab;

  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const netWrap = document.getElementById("networkContainer");
  const villageView = document.getElementById("villageView");

  if (tab === "network") {
    if (netWrap) netWrap.style.display = "block";
    if (villageView) villageView.style.display = "none";
    renderNetwork();
  } else {
    if (netWrap) netWrap.style.display = "none";
    if (villageView) villageView.style.display = "grid";
    renderVillage();
  }
}

function normalizeCharacter(c) {
  c.money = safeNum(c.money, 0);

  c.str = safeNum(c.str, 1);
  c.mind = safeNum(c.mind, 1);
  c.intel = safeNum(c.intel, 1);
  c.agi = safeNum(c.agi, 1);

  c.maxHp = Math.max(1, safeNum(c.maxHp, 60 + c.str * 20));
  c.maxEp = Math.max(1, safeNum(c.maxEp, 60 + c.mind * 20));

c.hp = Math.min(c.maxHp, Math.max(0, safeNum(c.hp, 0)));
c.ep = Math.min(c.maxEp, Math.max(0, safeNum(c.ep, 0)));


  c.relationships = c.relationships || {};
  c.specialRelations = c.specialRelations || {};

  c.sickDays = safeNum(c.sickDays, 0);
  c.faintDays = safeNum(c.faintDays, 0);
  c.beggarDays = safeNum(c.beggarDays, 0);
  c.skippedWorkDays = safeNum(c.skippedWorkDays, 0);

  c.lastMain = c.lastMain || "-";
  c.lastFree = c.lastFree || "-";
  c.dayJoined = safeNum(c.dayJoined, 1);
  c.isMayor = !!c.isMayor;
}

function renderVillage() {
  const view = document.getElementById("villageView");
  const dayEl = document.getElementById("dayDisplay");
  if (dayEl) dayEl.textContent = String(day);
  if (!view) return;

  view.innerHTML = "";

  if (characters.length === 0) {
    const empty = document.createElement("div");
    empty.style.color = "#888";
    empty.textContent = "아직 주민이 없습니다. 입주 버튼으로 추가하세요.";
    view.appendChild(empty);
    return;
  }

  characters.forEach(c => {
    normalizeCharacter(c);

    const hpPct = Math.max(0, Math.min(100, Math.floor((c.hp / c.maxHp) * 100)));
    const epPct = Math.max(0, Math.min(100, Math.floor((c.ep / c.maxEp) * 100)));

    const card = document.createElement("div");
    card.className = "char-card";

    const jobLabel = c.job ? c.job : (day < 4 ? "정착중" : "무직");
    const statusBits = [];
    if (c.sickDays > 0) statusBits.push("아픔");
    if (c.faintDays > 0) statusBits.push("기절");
    if (c.beggarDays > 0 || c.job === "거지") statusBits.push("거지");
    const statusStr = statusBits.length ? ` · ${statusBits.join(", ")}` : "";

    card.innerHTML = `
      ${c.isMayor ? `<div class="mayor-crown">👑</div>` : ``}
      <div class="char-header">
        <div class="char-name">${c.name}</div>
        <div class="char-job-badge">${jobLabel}${statusStr ? ` <span class="status-beggar">${statusStr}</span>` : ``}</div>
      </div>
      <div class="char-money">💰 ${safeNum(c.money,0).toLocaleString()}원</div>
      <div class="stats-row">
        <div>근력 ${c.str}</div>
        <div>정신 ${c.mind}</div>
        <div>지능 ${c.intel}</div>
        <div>민첩 ${c.agi}</div>
      </div>
      <div class="bar-group"><div class="bar-label">HP</div><div class="bar-track"><div class="bar-fill hp-fill" style="width:${hpPct}%"></div></div><div style="width:62px;text-align:right;color:#888;">${c.hp}/${c.maxHp}</div></div>
      <div class="bar-group"><div class="bar-label">EP</div><div class="bar-track"><div class="bar-fill ep-fill" style="width:${epPct}%"></div></div><div style="width:62px;text-align:right;color:#888;">${c.ep}/${c.maxEp}</div></div>
      <button class="btn-detail">관계 보기</button>
      <button class="btn-detail" style="background:#ffeaa7;color:#333;margin-top:8px;">삭제</button>
    `;

    const buttons = card.querySelectorAll("button");
    buttons[0].onclick = () => openAffinityModal(c.id);
    buttons[1].onclick = () => {
      if (!confirm("삭제하시겠습니까?")) return;
      removeCharacter(c.id);
    };

    view.appendChild(card);
  });
}

function saveData() {
  const payload = { version: 1.1, day, mayorSelected, mayorId, characters, logs };
  const str = JSON.stringify(payload);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);

  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `village_save_${Date.now()}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function loadData(input) {
  const file = input?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      if (!confirm("현재 데이터가 덮어씌워집니다. 진행할까요?")) return;

      day = safeNum(json.day, 1);
      mayorSelected = !!json.mayorSelected;
      mayorId = json.mayorId || null;

      characters = (json.characters || []).map(c => {
        const id = c.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
        const obj = { ...c, id };
        normalizeCharacter(obj);
        return obj;
      });

      if (mayorId) {
        characters.forEach(c => c.isMayor = (c.id === mayorId));
        const m = characters.find(c => c.id === mayorId);
        if (m) { m.job = "이장"; }
      }

      logs = Array.isArray(json.logs) ? json.logs : [];

      const container = document.getElementById("logContent");
      if (container) container.innerHTML = `<div class="log-entry">불러오기 완료.</div>`;

      renderVillage();
      if (activeTab === "network") renderNetwork();

      input.value = "";
    } catch (err) {
      alert("불러오기 실패: " + err.message);
      input.value = "";
    }
  };
  reader.readAsText(file);
}

function saveLogText() {
  const container = document.getElementById("logContent");
  if (!container) return;

  const texts = Array.from(container.querySelectorAll(".log-day-mark, .log-entry"))
    .map(el => el.textContent || "")
    .reverse()
    .join("\n");

  const blob = new Blob([texts], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `village_log_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function nextDay() {
  if (characters.length === 0) return alert("최소 1명의 주민이 필요합니다.");

  day += 1;

  const entries = [];
  const freeEntries = [];

  characters.forEach(normalizeCharacter);
  maybeAssignJobs(entries);

  characters.forEach(c => tickStatus(c, entries));
  characters.forEach(c => maybeGetSick(c, entries));

  characters.forEach(c => {
    if (c.job === "거지" || c.beggarDays > 0) beggarStep(c, entries);
  });

  const actives = characters.filter(c => canAct(c) && c.beggarDays <= 0 && c.job !== "거지");

  if (day <= 3) {
    actives.forEach(c => doVillagePrep(c, entries));
  } else {
    const shuffled = [...actives].sort(() => Math.random() - 0.5);

    shuffled.forEach(c => {
      if (!canAct(c)) return;

      c.lastMain = "-";
      c.lastFree = "-";

      if (c.isMayor) {
        const hp = randInt(2, 6);
        const ep = randInt(4, 9);
        const income = randInt(70, 120);

        consumeHP(c, hp);
        consumeEP(c, ep);
        addMoney(c, +income);

        c.lastMain = "마을 관리";
        c.lastFree = "여가";

        logPush(entries, `[마을 관리] ${c.name}${getJosa(c.name,"은/는")} 마을을 위해 힘썼다. (+${income}원, HP -${hp}, EP -${ep})`, "normal");
        if (c.hp <= 0 || c.ep <= 0) setFaint(c, entries);
        return;
      }

      if (!c.job) {
        c.lastMain = "대화";
        c.lastFree = "여가";
        return;
      }

      if (Math.random() < 0.62) {
        const did = doWork(c, entries);
        if (!did) c.skippedWorkDays += 1;
      } else {
        c.skippedWorkDays += 1;
      }
    });

    const canSocial = characters.filter(c => canAct(c) && c.beggarDays <= 0 && c.job !== "거지");
    const pairTrials = Math.min(4, Math.floor(canSocial.length / 2));
    for (let i = 0; i < pairTrials; i++) {
      const pair = pickPair(canSocial);
      if (!pair) break;
      const [a, b] = pair;

      if (tryMarriage(a, b, entries)) continue;
      if (tryConfess(a, b, entries)) continue;

      randomSocialEvent(a, b, entries, freeEntries);

      if (a.lastMain === "-") a.lastMain = "대화";
      if (b.lastMain === "-") b.lastMain = "대화";
      if (a.lastFree === "-") a.lastFree = "여가";
      if (b.lastFree === "-") b.lastFree = "여가";
    }

    characters.forEach(c => {
      if (!canAct(c)) return;
      if (c.beggarDays > 0 || c.job === "거지") return;

      if (!c.job && day >= 4 && (day - c.dayJoined) === 0) {
        logPush(entries, `[대화] ${c.name}${getJosa(c.name,"은/는")} 마을 주민들과 인사를 나눴다.`, "normal");
        c.lastMain = "대화";
        c.lastFree = "-";
        return;
      }

      if (!c.job && day >= 4) {
        logPush(entries, `[대화] ${c.name}${getJosa(c.name,"은/는")} 여기저기 기웃거리며 사람들을 만났다.`, "normal");
        c.lastMain = "대화";
        c.lastFree = "여가";
        return;
      }

      if (c.lastMain === "-") {
        if (Math.random() < 0.55) {
          logPush(entries, `[대화] ${c.name}${getJosa(c.name,"은/는")} 주민과 짧게 수다를 떨었다.`, "normal");
          c.lastMain = "대화";
          c.lastFree = "여가";
        } else {
          c.lastMain = "휴식";
          c.lastFree = "여가";
        }
      }

      maybeBecomeBeggar(c);
    });

    const freePool = characters.filter(c => canAct(c) && c.beggarDays <= 0 && c.job !== "거지");
    if (freePool.length) {
      freeTimeDivider(freeEntries);

      const shuffledFree = [...freePool].sort(() => Math.random() - 0.5);

      const datingCandidates = shuffledFree.filter(c => safeNum(c.money,0) >= 80);
      const datePair = pickPair(datingCandidates);
      if (datePair && Math.random() < 0.45) {
        const [a, b] = datePair;
        tryDate(a, b, freeEntries);
      }

      shuffledFree.forEach(c => {
        if (!canAct(c)) return;
        if (c.lastFree === "데이트") return;

        if (Math.random() < 0.18) {
          doTravelOrRest(c, freeEntries);
        } else {
          const spend = randInt(8, 45);
          addMoney(c, -spend);
          restoreHP(c, randInt(8, 22) + Math.floor(spend * 0.6));
          restoreEP(c, randInt(10, 26) + spend);
          c.lastFree = "여가";
          logPush(freeEntries, `[여가] ${c.name}${getJosa(c.name,"은/는")} ${pick(WORDS.leisure)}로 기분을 풀었다. (-${spend}원)`, "blue");
        }

        if (c.hp <= 0 || c.ep <= 0) setFaint(c, entries);
      });
    }
  }

  selectMayorAtDay10(entries);

  logs = [...freeEntries.map(x => ({ day, ...x })), ...entries.map(x => ({ day, ...x })), ...logs];
  renderLogs([...entries, ...freeEntries]);
  renderVillage();
  if (activeTab === "network") renderNetwork();
}

window.onload = () => {
  ensureMbtiOptions();
  renderVillage();
};



