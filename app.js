const main = document.querySelector('#main-content');
const navItems = document.querySelectorAll('.nav-item');
const titles = { planting: '种植管理', standards: '行业标准', trace: '收购溯源', research: '科研中心', processing: '橡胶的加工利用' };

function template(id) {
  return document.querySelector(`#${id}-template`).content.cloneNode(true);
}

function setActive(route) {
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.route === route));
}

function go(route) {
  main.innerHTML = '';
  const routes = ['home', 'market', 'assistant', 'quality', 'diagnosis', 'profile'];
  main.appendChild(template(routes.includes(route) ? route : 'placeholder'));
  setActive(route);
  if (titles[route]) document.querySelector('#placeholder-title').textContent = titles[route];
  if (titles[route]) setupModule(route);
  if (route === 'standards') setupStandardsModule();
  if (route === 'assistant') setupChat();
  if (route === 'home') setupHomeWeather();
  if (route === 'market') setupMarket();
  if (route === 'quality') setupQuality();
  if (route === 'diagnosis') setupDiagnosis();
  if (route === 'profile') setupProfileActions();
  main.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => go(button.dataset.route)));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupChat() {
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#chat-text');
  const messages = document.querySelector('#chat-messages');
  const capability = document.createElement('section');
  capability.className = 'ai-capability';
  capability.innerHTML = '<b>专业能力已增强</b><span>行情 · 供需 · 品质定级 · 种植植保 · 加工工艺 · 标准检索</span>';
  document.querySelector('.suggestion-wrap').before(capability);
  document.querySelectorAll('.suggestions button').forEach((button) => button.addEventListener('click', () => { input.value = button.textContent; input.focus(); }));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    const history = JSON.parse(localStorage.getItem('rubberZhihuiHistory') || '[]');
    history.unshift({ question, time: new Date().toLocaleString('zh-CN', { hour12: false }) });
    localStorage.setItem('rubberZhihuiHistory', JSON.stringify(history.slice(0, 50)));
    messages.insertAdjacentHTML('beforeend', `<article class="bubble user-bubble"><p>${escapeHtml(question)}</p></article>`);
    input.value = '';
    const pending = document.createElement('article');
    pending.className = 'bubble assistant-bubble';
    pending.innerHTML = '<b>橡胶智汇</b><p>正在检索企业知识库与业务数据…</p>';
    messages.appendChild(pending);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
      pending.innerHTML = `<b>橡胶智汇 · 演示回答</b><p>${mockAnswer(question)}</p><p><small>来源：演示知识库 / 建议正式上线后展示标准版本、资料链接与数据更新时间。</small></p>`;
      messages.scrollTop = messages.scrollHeight;
    }, 700);
  });
}

function mockAnswer(question) {
  if (/国际|泰国|RSS3|TSR20|新加坡|美元|汇率/.test(question)) return '【国际市场研判】建议同时跟踪泰国、印尼、马来西亚主产区天气与原料胶价格，关注新加坡 SICOM 相关合约、美元汇率和海运费变化。对进口采购，应将外盘报价、升贴水、汇率锁定与到港周期一并测算。当前为演示结论，正式版本会标注数据日期、来源和计算口径。';
  if (/供需|库存|产量|消费|轮胎/.test(question)) return '【供需结构分析】建议从供应端（主产国开割节奏、天气、出口）、需求端（轮胎开工、汽车产销、替换胎）、库存端（青岛、保税区、交易所）三方面交叉判断。库存连续累积而下游开工转弱时，价格承压概率上升；反之，低库存叠加供应扰动会放大价格弹性。';
  if (/DRC|干胶|门尼|杂质|品质|定级/.test(question)) return '【质量与定级建议】请确认样品抽取方式、检测仪器校准状态和企业标准版本。干胶含量、杂质、门尼黏度、初始塑性等指标需分别对照阈值，再结合当日基准价、等级升贴水、运输与水分损耗生成收购建议；不建议仅依据单一指标定价。';
  if (/雨|割胶/.test(question)) return '雨季应根据降雨、树体恢复和割面干湿情况安排割胶。避免雨中或割面未干时作业，并做好胶杯遮雨、割面防护和病害巡查。具体阈值应按当地农技规程与地块实际情况确认。';
  if (/价|行情|采购/.test(question)) return '当前演示行情显示期货价格偏强震荡。采购建议结合企业安全库存、订单交付周期与现货基差分批执行；真实业务中应接入实时价格、库存和合同数据后再生成结论。';
  if (/病|白粉/.test(question)) return '请先上传叶片或树干清晰照片，AI 可进行初筛。对于疑似病害，应结合发生部位、面积、天气和扩散速度，由农技人员确认后再制定防治方案。';
  return '我已理解您的问题。正式接入后，我会先检索企业橡胶标准、专家资料与当前业务数据，再给出带引用来源的答案、风险提示和下一步建议。';
}

function setupMarket() {
  const tabs = [...main.querySelectorAll('.segmented button')];
  const card = main.querySelector('.market-main-card');
  const metrics = main.querySelector('.metric-grid');
  const insight = main.querySelector('.insight');
  const views = [
    { title:'上海期货 · RU 主力', price:'14,860', unit:'元/吨', change:'+1.82%', cls:'up', bars:[32,48,43,58,51,74,84], labels:['周一','周三','周五','今日'], metrics:[['云南全乳胶','14,550','+0.69%','up'],['海南浓缩乳胶','11,280','-0.31%','down'],['青岛保税库存','47.6 万吨','+2.1%','up']], note:'国内市场短期受供应扰动与宏观情绪支撑，价格偏强震荡。建议结合企业安全库存、现货基差和订单节奏分批采购。', question:'结合国内现货、期货与库存，分析本周胶价走势。' },
    { title:'新加坡 SICOM · TSR20', price:'168.4', unit:'美分/公斤', change:'+0.96%', cls:'up', bars:[47,43,55,50,59,68,71], labels:['周一','周三','周五','今日'], metrics:[['泰国 RSS3','73.20','+0.82%','up'],['马来西亚 SMR20','166.10','+0.56%','up'],['美元指数','103.4','-0.18%','down']], note:'国际胶价受泰国主产区降雨、原油及美元波动共同影响。进口采购需同步计算人民币完税成本、运费和到港周期。', question:'请解读国际天然橡胶行情及进口采购风险。' },
    { title:'供需景气指数', price:'52.6', unit:'荣枯线以上', change:'+1.4', cls:'up', bars:[39,45,42,49,56,61,65], labels:['1月','3月','5月','7月'], metrics:[['主产区供应','102.3','+1.8%','up'],['轮胎开工率','64.8%','+0.7%','up'],['社会库存','128.6 万吨','-1.5%','down']], note:'供需指数处于扩张区间；需重点留意主产区天气、轮胎开工、汽车销量和社会库存拐点，避免只用单项数据判断趋势。', question:'从供应、需求和库存三个维度分析天然橡胶供需。' }
  ];
  function render(index) {
    const view = views[index];
    tabs.forEach((tab, i) => tab.classList.toggle('selected', i === index));
    card.innerHTML = `<div class="row-between"><div><p>${view.title}</p><h2>${view.price} <small>${view.unit}</small></h2></div><span class="${view.cls}">${view.change}</span></div><div class="chart">${view.bars.map((height) => `<i style="height:${height}%"></i>`).join('')}</div><div class="chart-label">${view.labels.map((label) => `<span>${label}</span>`).join('')}</div>`;
    metrics.innerHTML = view.metrics.map((metric) => `<article><span>${metric[0]}</span><b>${metric[1]}</b><small class="${metric[3]}">${metric[2]}</small></article>`).join('');
    insight.innerHTML = `<div class="spark">✦</div><div><b>AI 专业解读</b><p>${view.note}</p><button class="text-button" id="market-followup">让 AI 深度分析 →</button></div>`;
    insight.querySelector('#market-followup').addEventListener('click', () => { go('assistant'); setTimeout(() => { const input = main.querySelector('#chat-text'); input.value = view.question; input.focus(); }, 0); });
  }
  tabs.forEach((tab, index) => tab.addEventListener('click', () => render(index)));
  render(0);
}

function setupHomeWeather() {
  const hero = main.querySelector('.hero');
  const alert = main.querySelector('.alert-card');
  if (!hero || !alert) return;
  const update = (data, place = '海口市 · 龙华区') => {
    const current = data.current || {}; const daily = data.daily || {};
    const code = Number(current.weather_code); const temp = Math.round(Number(current.temperature_2m));
    const weather = weatherLabel(code); const sunrise = String(daily.sunrise?.[0] || '').slice(11, 16) || '—';
    const rain = Number(daily.precipitation_probability_max?.[0] ?? 0);
    const suggestedFinish = sunrise !== '—' ? shiftMinutes(sunrise, -35) : '日出前 30–40 分钟';
    hero.innerHTML = `<div><p>${place}</p><h2>${Number.isFinite(temp) ? temp : '—'}° <small>${weather.name}</small></h2><span>日出 ${sunrise} · 割胶建议 ${suggestedFinish} 前完成</span></div><div class="weather-icon">${weather.icon}</div>`;
    const riskText = rain >= 60 ? `降水概率 ${rain}%：请先巡查割面、胶杯遮雨和排水，避免在潮湿或降雨条件下强行割胶。` : `降水概率 ${rain}%：建议在日出前完成割胶，并结合割面干湿和地块实际情况确认。`;
    alert.innerHTML = `<span>☀</span><div><b>今日割胶时间建议</b><p>日出 ${sunrise}；一般建议 ${suggestedFinish} 前完成割胶。${riskText}</p><small class="weather-source">数据：实时天气接口 · ${current.time ? String(current.time).slice(11,16) : '刚刚'} 更新</small></div>`;
  };
  const fallback = { current:{temperature_2m:28, weather_code:2, time:''}, daily:{sunrise:['2026-08-14T06:21'], precipitation_probability_max:[40]} };
  update(fallback);
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=20.03&longitude=110.33&current=temperature_2m,weather_code&daily=sunrise,precipitation_probability_max&timezone=Asia%2FShanghai';
  fetch(url).then((response) => { if (!response.ok) throw new Error('weather response'); return response.json(); }).then((data) => update(data)).catch(() => {
    alert.querySelector('.weather-source').textContent = '数据：备用演示数据；实时天气暂不可用';
  });
}

function weatherLabel(code) {
  if (code === 0) return { name:'晴', icon:'☀' };
  if ([1, 2, 3].includes(code)) return { name:'多云', icon:'⛅' };
  if ([45, 48].includes(code)) return { name:'雾', icon:'☁' };
  if ([51, 53, 55, 56, 57].includes(code)) return { name:'毛毛雨', icon:'🌦' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { name:'有雨', icon:'🌧' };
  if ([95, 96, 99].includes(code)) return { name:'雷雨', icon:'⛈' };
  return { name:'天气待确认', icon:'☀' };
}

function shiftMinutes(hhmm, offset) {
  const [hours, minutes] = hhmm.split(':').map(Number); const total = (hours * 60 + minutes + offset + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function setupQuality() {
  document.querySelector('#analyse-quality').addEventListener('click', () => {
    const drc = Number(document.querySelector('input[type="number"]').value || 0);
    const result = document.querySelector('#quality-result');
    result.classList.remove('hidden');
    result.innerHTML = `<h3>初步质量建议：${drc >= 60 ? '建议进入优先收购复检' : '建议复检后分级收购'}</h3><p>干胶含量 ${drc.toFixed(1)}%，系统已读取杂质、门尼黏度与初始塑性等演示字段。</p><p>下一步：对照企业收购标准完成检测单审核，并根据当日价格规则生成最终定价。</p>`;
  });
}

function setupDiagnosis() {
  const input = document.querySelector('#image-input');
  const preview = document.querySelector('#image-preview');
  document.querySelector('#upload-trigger').addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const [file] = input.files;
    if (!file) return;
    preview.style.backgroundImage = `linear-gradient(rgba(5,80,61,.2),rgba(5,80,61,.2)),url("${URL.createObjectURL(file)}")`;
    preview.innerHTML = '<b style="color:white;text-shadow:0 1px 4px #17362e">图片已上传</b><p style="color:white;text-shadow:0 1px 4px #17362e">正在准备识别</p>';
    const result = document.querySelector('#diagnosis-result');
    result.innerHTML = '<h3>识别结果：等待模型接口</h3><p>前端上传流程已完成。后端接入视觉模型后，将在此显示疑似病害、置信度、风险等级和处置建议。</p>';
  });
}

function escapeHtml(value) { return value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char])); }

function setupLogin() {
  const oldHero = main.querySelector('.profile-hero');
  if (!oldHero) return;
  oldHero.outerHTML = `
    <section id="login-panel" class="login-panel">
      <div class="login-badge">橡</div>
      <p class="eyebrow">RUBBER ZHIHUI</p><h2>手机号登录</h2>
      <p class="login-subtitle">登录后同步您的地块、批次和 AI 问答记录</p>
      <form id="login-form" class="login-form">
        <label>手机号<input id="phone-number" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="请输入 11 位手机号" /></label>
        <label>验证码<div class="code-row"><input id="verify-code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="请输入验证码" /><button id="send-code" type="button">发送验证码</button></div></label>
        <p id="login-message" class="login-message">演示验证码固定为 123456；首次登录将自动创建账号</p>
        <button class="primary-button" type="submit">登录</button>
        <button id="quick-login" class="demo-login-button" type="button">使用演示验证码一键登录</button>
      </form>
    </section>`;
  const loginPanel = main.querySelector('#login-panel');
  const stats = main.querySelector('.profile-stats');
  const savedPhone = localStorage.getItem('rubberZhihuiPhone');
  const phoneInput = main.querySelector('#phone-number');
  const codeInput = main.querySelector('#verify-code');
  const sendButton = main.querySelector('#send-code');
  const message = main.querySelector('#login-message');
  let demoCode = '';
  const showUser = (phone) => {
    loginPanel.innerHTML = `<div class="logged-user"><div class="avatar">橡</div><div><p class="eyebrow">已登录</p><h2>${phone.slice(0, 3)}****${phone.slice(-4)}</h2><p>企业用户 · 海南示范基地</p></div><button id="logout-button" class="logout-button">退出</button></div>`;
    if (stats) stats.classList.remove('hidden');
    main.querySelector('#logout-button').addEventListener('click', () => { localStorage.removeItem('rubberZhihuiPhone'); go('profile'); });
  };
  setupProfileActions();
  if (savedPhone) { showUser(savedPhone); return; }
  if (stats) stats.classList.add('hidden');
  sendButton.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    if (!/^1[3-9]\\d{9}$/.test(phone)) { message.textContent = '请输入正确的 11 位中国大陆手机号'; message.className = 'login-message error'; return; }
    demoCode = '123456';
    message.textContent = '演示验证码：123456（正式版将通过短信发送）';
    message.className = 'login-message success';
    let seconds = 60; sendButton.disabled = true; sendButton.textContent = `${seconds}s 后重发`;
    const timer = setInterval(() => { seconds -= 1; sendButton.textContent = seconds ? `${seconds}s 后重发` : '发送验证码'; if (!seconds) { clearInterval(timer); sendButton.disabled = false; } }, 1000);
  });
  main.querySelector('#login-form').addEventListener('submit', (event) => {
    event.preventDefault(); const phone = phoneInput.value.trim();
    if (!/^1[3-9]\\d{9}$/.test(phone)) { message.textContent = '请先填写正确的手机号'; message.className = 'login-message error'; return; }
    if (!demoCode) { message.textContent = '请先获取短信验证码'; message.className = 'login-message error'; return; }
    if (codeInput.value.trim() !== demoCode) { message.textContent = '验证码不正确，请重新输入'; message.className = 'login-message error'; return; }
    localStorage.setItem('rubberZhihuiPhone', phone); showUser(phone);
  });
  const quickLogin = main.querySelector('#quick-login');
  quickLogin.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    if (!/^1[3-9]\\d{9}$/.test(phone)) { message.textContent = '请先填写正确的 11 位中国大陆手机号'; message.className = 'login-message error'; return; }
    codeInput.value = '123456'; demoCode = '123456';
    main.querySelector('#login-form').requestSubmit();
  });
}

function setupProfileActions() {
  const items = [...main.querySelectorAll('.settings-list button')];
  const actions = [showHistory, showDataImport, showMembers, showSettings];
  items.forEach((item, index) => item.addEventListener('click', () => actions[index]?.()));
}

function restoreProfile() {
  const loginPanel = main.querySelector('#login-panel');
  if (!loginPanel) return;
  loginPanel.outerHTML = `<section class="profile-hero"><div class="avatar">橡</div><div><h2>橡胶产业服务中心</h2><p>企业管理员 · 海南示范基地</p></div><span>›</span></section>`;
  main.querySelector('.profile-stats')?.classList.remove('hidden');
}

function setupModule(route) {
  const area = main.querySelector('.empty-page');
  if (!area) return;
  const modules = {
    planting: `<div class="module-list"><article><b>今日割胶建议</b><p>天气：多云，午后有阵雨；建议 11:00 前完成割胶并检查胶杯遮雨。</p><button data-module-query="雨季怎样安排割胶？">咨询 AI</button></article><article><b>地块巡查清单</b><p>割面干湿、叶部病斑、排水沟、施肥记录。</p><button id="complete-task">标记今日巡查完成</button></article><article><b>农事日历</b><p>本周重点：雨后排水、白粉病巡查、幼龄林补肥。</p></article></div>`,
    standards: `<div class="module-list"><article><b>天然橡胶技术标准</b><p>查看标准号、适用范围、检测项目与版本记录。</p><button data-standard="天然橡胶技术标准">查看摘要</button></article><article><b>收购与质量检验规范</b><p>涵盖原料胶收购、抽样、检测与等级判定。</p><button data-standard="收购与质量检验规范">查看摘要</button></article><article><b>加工与仓储管理规范</b><p>适用于生产批次、仓储条件与出入库记录。</p><button data-standard="加工与仓储管理规范">查看摘要</button></article></div>`,
    trace: `<div class="trace-form"><p>输入批次编号，查询收购、检测和加工流转信息。</p><div><input id="trace-number" value="HN-20260811-017" placeholder="例如 HN-20260811-017"><button id="trace-search">查询</button></div><section id="trace-result" class="trace-result">待查询</section></div>`,
    research: `<div class="module-list"><article><b>科研成果库</b><p>286+ 项技术成果，支持按病害、品种、加工和市场筛选。</p><button id="research-search">浏览成果</button></article><article><b>专家在线咨询</b><p>种植、植保、加工、行情等方向专家可进行问题复核。</p><button data-module-query="我需要联系橡胶种植技术专家">向 AI 发起咨询</button></article><article><b>示范基地数据</b><p>查看产量、气象、病害与示范技术记录。</p></article></div>`,
    processing: `<div class="module-list"><article><b>天然橡胶初加工</b><p>胶乳接收、凝固、压片、烟熏/干燥、分级与包装的工艺要点。</p><button data-standard="天然橡胶初加工流程">查看流程</button></article><article><b>橡胶制品应用</b><p>轮胎、胶管、胶带、密封件、手套及再生胶等产品方向。</p><button id="product-catalog">查看应用目录</button></article><article><b>加工品质控制</b><p>关注杂质、挥发分、灰分、塑性和门尼黏度等关键指标。</p><button data-module-query="如何控制天然橡胶加工过程中的品质？">咨询 AI</button></article></div>`
  };
  area.innerHTML = modules[route] || '';
  area.querySelectorAll('[data-module-query]').forEach((button) => button.addEventListener('click', () => { go('assistant'); setTimeout(() => { const input = main.querySelector('#chat-text'); input.value = button.dataset.moduleQuery; input.focus(); }, 0); }));
  area.querySelector('#complete-task')?.addEventListener('click', (event) => { event.currentTarget.textContent = '✓ 今日巡查已完成'; event.currentTarget.disabled = true; });
  area.querySelectorAll('[data-standard]').forEach((button) => button.addEventListener('click', () => openPanel(button.dataset.standard, '<p class="panel-note">演示摘要：正式上线后此处应由企业上传的标准原文、版本号、生效日期及适用范围驱动。</p><div class="standard-summary"><b>核心内容</b><p>包含质量指标、抽样方式、检测方法、判级与记录要求。AI 问答将自动引用对应版本的条款。</p></div>')));
  area.querySelector('#trace-search')?.addEventListener('click', () => { const code = main.querySelector('#trace-number').value.trim() || 'HN-20260811-017'; const result = main.querySelector('#trace-result'); result.innerHTML = `<b>批次 ${escapeHtml(code)}</b><ol><li>08:20 · 儋州示范基地 · 原料胶入库</li><li>10:40 · 完成 DRC、杂质与门尼黏度检测</li><li>14:10 · 判定待复核，进入加工排产</li></ol>`; });
  area.querySelector('#research-search')?.addEventListener('click', () => openPanel('科研成果库', '<div class="research-card"><b>雨季橡胶园综合管理技术</b><p>分类：栽培管理 · 已纳入企业知识库</p></div><div class="research-card"><b>原料胶质量稳定性提升方案</b><p>分类：加工与品控 · 待专家审核</p></div>'));
  area.querySelector('#product-catalog')?.addEventListener('click', () => openPanel('橡胶制品应用目录', '<div class="research-card"><b>轮胎与橡胶配件</b><p>交通运输、工程机械等应用场景。</p></div><div class="research-card"><b>工业橡胶制品</b><p>胶管、胶带、密封件、减震件等。</p></div><div class="research-card"><b>医用与生活用品</b><p>乳胶手套、乳胶丝、胶粘剂等。</p></div>'));
}

function setupStandardsModule() {
  const area = main.querySelector('.empty-page');
  if (!area) return;
  const categories = [
    { code:'01', name:'基础与通用', tag:'通用基础', topics:'术语规范、分类分级、标准化通则', scope:'为种植、加工、检验与贸易提供统一术语、分类口径和通用要求。' },
    { code:'02', name:'种质资源与品种种苗', tag:'产前', topics:'种质收集保存、鉴定评价、品种选育、种苗繁育与质量', scope:'覆盖种质资源描述、引种保存、品种试验审定、苗圃与种苗质量管理。' },
    { code:'03', name:'栽培管理与割胶技术', tag:'种植生产', topics:'产地环境、水肥管理、生态栽培、营养诊断、割胶规程', scope:'覆盖建园、行间管理、施肥灌溉、割制与割胶作业等生产环节。' },
    { code:'04', name:'植物保护与农业投入品', tag:'植保安全', topics:'检疫鉴定、病虫监测、风险评估、绿色防控、肥料农药', scope:'规范病虫害识别、监测预警、综合防控，以及肥料、农药等投入品使用。' },
    { code:'05', name:'设施设备与机械化', tag:'装备', topics:'栽培设备、植保装备、加工设备、维护与安全', scope:'覆盖胶园生产、植物保护、采收和初加工所需设施装备。' },
    { code:'06', name:'采后处理与初加工', tag:'加工', topics:'胶乳采后处理、浓缩胶乳、标准胶、橡胶木初加工', scope:'覆盖鲜胶乳收集、保鲜、运输、初加工及橡胶木初加工。' },
    { code:'07', name:'产品质量与检验检测', tag:'质量控制', topics:'取样制样、成分测定、性能检验、质量分析、进口检验', scope:'覆盖原料胶、胶乳及产品的质量指标、检验方法与判定依据。' },
    { code:'08', name:'包装贮运与贸易流通', tag:'流通', topics:'包装标识、仓储运输、产品追溯、电商流通', scope:'覆盖包装、标签、仓储、物流、追溯与交易流通要求。' },
    { code:'09', name:'企业管理与可持续发展', tag:'管理', topics:'生产管理、能耗管理、主设备管理、合规与安全', scope:'覆盖企业生产组织、设备能耗、质量管理、绿色与安全管理。' }
  ];
  area.classList.add('standards-page');
  area.innerHTML = `<section class="standards-intro"><p class="eyebrow">NATURAL RUBBER STANDARDS SYSTEM</p><h3>天然橡胶全产业链标准分类</h3><p>以海南省天然橡胶产业标准体系九大模块为主轴，融合全产业链体系中的割胶、产品质量、检验检测、包装贮运与企业管理分类。</p><div class="standards-meta"><span>9 大分类</span><span>产前 · 产中 · 产后</span><span>支持标准检索</span></div></section><label class="standard-search"><span>⌕</span><input id="standard-search" placeholder="搜索分类、环节或关键词，例如：割胶、标准胶、病虫害" /></label><section id="standards-grid" class="standards-grid">${categories.map((item) => `<button class="standard-category" data-standard-code="${item.code}"><span class="category-code">${item.code}</span><div><div class="category-title"><b>${item.name}</b><em>${item.tag}</em></div><p>${item.topics}</p></div><i>›</i></button>`).join('')}</section><p class="standard-footnote">分类依据：海南省天然橡胶产业标准体系（征求意见稿）及天然橡胶全产业链标准体系发布资料。具体标准号、现行状态、适用范围和文本版本须由合作方或标准数据库导入后展示。</p>`;
  const grid = area.querySelector('#standards-grid');
  const openCategory = (category) => openPanel(category.name, `<div class="standard-panel"><span class="panel-tag">${category.tag}</span><h3>覆盖主题</h3><p>${category.topics}</p><h3>分类说明</h3><p>${category.scope}</p><h3>App 接入建议</h3><p>建立“标准名称、标准号、标准级别、状态、发布日期、实施日期、适用范围、全文链接、版本、关键词”的标准主数据。AI 回答只引用已审核且有效的版本。</p><button class="primary-button" data-module-query="请根据${category.name}标准体系说明关键执行要点">向 AI 咨询该分类</button></div>`);
  grid.querySelectorAll('[data-standard-code]').forEach((button) => button.addEventListener('click', () => {
    const category = categories.find((item) => item.code === button.dataset.standardCode); const panel = openCategory(category);
    panel.querySelector('[data-module-query]').addEventListener('click', () => { panel.remove(); go('assistant'); setTimeout(() => { const input = main.querySelector('#chat-text'); input.value = `请根据${category.name}标准体系说明关键执行要点`; input.focus(); }, 0); });
  }));
  area.querySelector('#standard-search').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    grid.querySelectorAll('.standard-category').forEach((item) => { item.hidden = !!query && !item.textContent.toLowerCase().includes(query); });
  });
}

function openPanel(title, content) {
  document.querySelector('#feature-panel')?.remove();
  const panel = document.createElement('section');
  panel.id = 'feature-panel';
  panel.className = 'feature-panel';
  panel.innerHTML = `<div class="panel-mask"></div><article class="panel-sheet"><header><div><p class="eyebrow">橡胶智汇</p><h2>${title}</h2></div><button id="close-panel" aria-label="关闭">×</button></header>${content}</article>`;
  document.body.appendChild(panel);
  panel.querySelector('#close-panel').addEventListener('click', () => panel.remove());
  panel.querySelector('.panel-mask').addEventListener('click', () => panel.remove());
  return panel;
}

function showHistory() {
  const records = JSON.parse(localStorage.getItem('rubberZhihuiHistory') || '[]');
  const rows = records.length ? records.map((record) => `<li><b>${escapeHtml(record.question)}</b><span>${record.time}</span></li>`).join('') : '<div class="panel-empty">暂无问答记录。您在 AI 助手中的提问会自动显示在这里。</div>';
  openPanel('AI 问答历史', `<p class="panel-note">登录后可在不同设备同步历史记录。</p><ul class="history-list">${rows}</ul>`);
}

function showDataImport() {
  const panel = openPanel('数据导入与管理', `<p class="panel-note">支持导入 Excel、CSV、PDF 或图片。当前为本地演示，不会上传到云端。</p><label class="upload-zone" for="data-file"><span>⇧</span><b>选择要导入的资料</b><small>行情、地块、收购批次、检测报告、行业标准</small></label><input id="data-file" type="file" multiple accept=".xlsx,.xls,.csv,.pdf,image/*" hidden><div id="file-list" class="file-list"><div class="panel-empty">尚未选择文件</div></div><button id="import-confirm" class="primary-button" disabled>导入演示数据</button>`);
  const fileInput = panel.querySelector('#data-file'); const list = panel.querySelector('#file-list'); const confirm = panel.querySelector('#import-confirm');
  fileInput.addEventListener('change', () => { const files = [...fileInput.files]; confirm.disabled = !files.length; list.innerHTML = files.length ? files.map((file) => `<div class="file-row"><span>▤</span><div><b>${escapeHtml(file.name)}</b><small>${(file.size / 1024).toFixed(1)} KB</small></div></div>`).join('') : '<div class="panel-empty">尚未选择文件</div>'; });
  confirm.addEventListener('click', () => { confirm.textContent = '导入完成'; confirm.disabled = true; list.insertAdjacentHTML('afterbegin', '<div class="success-banner">✓ 已完成演示导入。正式版将解析文件、校验字段并保存至数据库。</div>'); });
}

function showMembers() {
  const panel = openPanel('成员与权限', `<p class="panel-note">设置成员角色，控制数据查看与资料编辑权限。</p><div id="member-list" class="member-list"><div class="member-row"><span class="member-avatar">管</span><div><b>当前管理员</b><small>管理员 · 全部权限</small></div></div><div class="member-row"><span class="member-avatar alt">技</span><div><b>农技顾问</b><small>专家 · 查看与技术答复</small></div></div></div><form id="add-member" class="inline-form"><input required placeholder="成员姓名或手机号"><select><option>数据录入员</option><option>农技专家</option><option>采购人员</option><option>只读访客</option></select><button type="submit">添加成员</button></form>`);
  panel.querySelector('#add-member').addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; const name = form.querySelector('input').value.trim(); if (!name) return; const role = form.querySelector('select').value; panel.querySelector('#member-list').insertAdjacentHTML('beforeend', `<div class="member-row"><span class="member-avatar new">新</span><div><b>${escapeHtml(name)}</b><small>${role} · 已添加（演示）</small></div></div>`); form.reset(); });
}

function showSettings() {
  const panel = openPanel('系统设置', `<p class="panel-note">设置您的默认偏好。设置将在当前设备保存。</p><div class="setting-toggle"><div><b>行情价格提醒</b><small>价格波动达到阈值时提醒</small></div><label class="switch"><input id="market-alert" type="checkbox" checked><i></i></label></div><div class="setting-toggle"><div><b>AI 回答引用来源</b><small>在回答中显示知识库和数据来源</small></div><label class="switch"><input id="source-display" type="checkbox" checked><i></i></label></div><div class="setting-toggle"><div><b>病害识别安全提醒</b><small>识别到高风险时显示专家复核提示</small></div><label class="switch"><input id="safety-alert" type="checkbox" checked><i></i></label></div><button id="save-settings" class="primary-button">保存设置</button><p id="settings-status" class="save-status"></p>`);
  const saved = JSON.parse(localStorage.getItem('rubberZhihuiSettings') || '{}');
  ['market-alert','source-display','safety-alert'].forEach((id) => { if (id in saved) panel.querySelector(`#${id}`).checked = saved[id]; });
  panel.querySelector('#save-settings').addEventListener('click', () => { const settings = Object.fromEntries(['market-alert','source-display','safety-alert'].map((id) => [id, panel.querySelector(`#${id}`).checked])); localStorage.setItem('rubberZhihuiSettings', JSON.stringify(settings)); panel.querySelector('#settings-status').textContent = '✓ 设置已保存到当前设备'; });
}

/* Upgrade: notification centre, production-style preferences, and agricultural AI answer format. */
function setupNotifications() {
  const button = document.querySelector('.icon-button');
  if (!button) return;
  button.addEventListener('click', () => {
    const panel = openPanel('通知中心', `
      <p class="panel-note">汇总行情、农事、数据与系统提醒；正式上线后由后端按用户、地块和角色推送。</p>
      <div id="notification-list" class="notification-list">
        <article class="notification unread"><span>行情</span><div><b>国内胶价波动提醒</b><p>RU 主力日内波动达到演示阈值，请结合库存与订单复核采购节奏。</p><small>刚刚</small></div></article>
        <article class="notification unread"><span>农事</span><div><b>雨后胶园巡查建议</b><p>关注割面受雨、胶杯遮雨、排水沟和叶部病害情况。</p><small>今天 08:00</small></div></article>
        <article class="notification"><span>数据</span><div><b>知识库更新提示</b><p>企业标准与专家资料更新后，AI 回答将优先引用最新有效版本。</p><small>昨天</small></div></article>
      </div>
      <button id="read-all-notifications" class="primary-button">全部标记为已读</button>`);
    panel.querySelector('#read-all-notifications').addEventListener('click', (event) => {
      panel.querySelectorAll('.notification').forEach((item) => item.classList.remove('unread'));
      event.currentTarget.textContent = '✓ 已全部标记为已读';
      event.currentTarget.disabled = true;
    });
  });
}

function showSettings() {
  const panel = openPanel('系统设置', `
    <p class="panel-note">设置仅保存在当前设备。真实推送、账号同步及权限校验需要后端支持。</p>
    <h3 class="settings-group">提醒与安全</h3>
    <div class="setting-toggle"><div><b>行情价格提醒</b><small>价格波动达到设定阈值时提醒</small></div><label class="switch"><input id="market-alert" type="checkbox" checked><i></i></label></div>
    <div class="setting-toggle"><div><b>农事与天气提醒</b><small>降雨、高温、台风和关键农事节点提醒</small></div><label class="switch"><input id="weather-alert" type="checkbox" checked><i></i></label></div>
    <div class="setting-toggle"><div><b>病害识别安全提醒</b><small>高风险结果提示专家复核</small></div><label class="switch"><input id="safety-alert" type="checkbox" checked><i></i></label></div>
    <h3 class="settings-group">显示与数据</h3>
    <div class="setting-toggle"><div><b>AI 回答引用来源</b><small>显示知识库版本、数据日期和引用依据</small></div><label class="switch"><input id="source-display" type="checkbox" checked><i></i></label></div>
    <div class="setting-toggle"><div><b>默认区域</b><small>用于天气、农事和本地行情筛选</small></div><select id="default-region" class="settings-select"><option>海南</option><option>云南</option><option>广东</option><option>广西</option></select></div>
    <div class="setting-toggle"><div><b>清除本机演示数据</b><small>删除本设备保存的问答历史和偏好设置</small></div><button id="clear-local-data" class="minor-button">清除</button></div>
    <button id="save-settings" class="primary-button">保存设置</button><p id="settings-status" class="save-status"></p>`);
  const keys = ['market-alert','weather-alert','safety-alert','source-display'];
  const saved = JSON.parse(localStorage.getItem('rubberZhihuiSettings') || '{}');
  keys.forEach((id) => { if (id in saved) panel.querySelector(`#${id}`).checked = saved[id]; });
  if (saved.region) panel.querySelector('#default-region').value = saved.region;
  panel.querySelector('#save-settings').addEventListener('click', () => {
    const settings = Object.fromEntries(keys.map((id) => [id, panel.querySelector(`#${id}`).checked]));
    settings.region = panel.querySelector('#default-region').value;
    localStorage.setItem('rubberZhihuiSettings', JSON.stringify(settings));
    panel.querySelector('#settings-status').textContent = '✓ 设置已保存到当前设备';
  });
  panel.querySelector('#clear-local-data').addEventListener('click', () => {
    localStorage.removeItem('rubberZhihuiHistory'); localStorage.removeItem('rubberZhihuiSettings');
    panel.querySelector('#settings-status').textContent = '✓ 本机演示数据已清除';
  });
}

function mockAnswer(question) {
  const source = '资料依据：演示知识库；正式系统应引用企业有效标准、专家审核资料与带日期的数据源。';
  if (/雨|割胶|降雨|天气/.test(question)) return `【初步结论】雨季割胶应以“割面干燥、短时无雨窗口、排水通畅”为前提，不建议在割面明显潮湿或降雨风险高时强行作业。<br><br>【判断依据】需同时核对未来 6–12 小时降雨、前一日降雨量、胶树树龄与长势、割制、割面状态、胶杯遮雨和病害发生情况；单凭天气图标不能替代地块巡查。<br><br>【建议动作】1. 清晨巡查割面与胶杯；2. 优先安排排水良好、遮雨条件完善地块；3. 雨后记录产胶、凝胶及病害变化；4. 出现连续阴雨或异常落叶时启动农技复核。<br><br>【风险边界】药剂、防治剂量和割胶制度必须按当地农技规程及专家意见执行。<br><br>${source}`;
  if (/病|白粉|炭疽|叶/.test(question)) return `【初步研判】病虫害问题应先区分发生部位、面积、扩散速度和气象条件，图片识别只能作为初筛，不应直接作为施药依据。<br><br>【田间核查】记录叶片正反面症状、嫩梢/树干/割面是否受害、受害株比例、近 7 天降雨湿度及是否有相邻地块扩散。<br><br>【处置流程】1. 拍摄清晰近景与全株照片；2. 标记地块和受害范围；3. 依据当地植保规程制定综合防治；4. 对高风险或快速扩散情况提交农技专家复核。<br><br>【安全提示】不推荐在未确诊病因前使用具体农药或剂量。<br><br>${source}`;
  if (/DRC|干胶|门尼|杂质|品质|定级|收购/.test(question)) return `【质量定级框架】收购与定价不能只看单一指标，应以抽样代表性、检测可追溯性、企业标准与当日价格规则共同决定。<br><br>【重点核验】干胶含量（DRC）、杂质、门尼黏度、初始塑性、挥发分及外观状态；同时记录样品批次、抽样位置、仪器校准、检测人员和复检结果。<br><br>【建议动作】1. 先核对检测单与标准版本；2. 将不合格/临界指标触发复检；3. 根据等级升贴水、运输和水分损耗计算收购价；4. 对争议批次保留样品与影像证据。<br><br>【风险边界】最终等级与结算价应由授权质检人员按企业规则确认。<br><br>${source}`;
  if (/国际|泰国|RSS3|TSR20|新加坡|美元|汇率/.test(question)) return `【国际市场研判】进口成本需从外盘、升贴水、汇率、海运费和到港周期整体计算，不能只依据单日盘面报价。<br><br>【观察变量】泰国、印尼、马来西亚主产区天气与原料胶价格；SICOM 相关合约；美元/人民币汇率；原油、海运费、港口库存及下游订单。<br><br>【建议动作】按采购计划分批锁价，分别测算人民币完税成本和汇率敏感性；设置报价有效期、到港时间和基差波动预警。<br><br>【风险边界】国际行情具波动性，所有价格判断必须标注数据日期、币种和交割口径。<br><br>${source}`;
  if (/供需|库存|产量|消费|轮胎|行情|价格|采购/.test(question)) return `【供需与行情研判】建议从供应、需求、库存三端交叉验证，不以单一价格涨跌直接推导趋势。<br><br>【供应端】关注主产区开割节奏、降雨与灾害、原料胶价格、出口节奏。<br>【需求端】关注轮胎开工、汽车产销、替换胎需求、加工企业订单。<br>【库存端】关注青岛、保税区、交易所库存及去化速度。<br><br>【建议动作】当库存累积且下游开工走弱时，采购以分批和控制库存为主；低库存叠加供应扰动时，提高补库频率并设置价格预警。<br><br>【数据缺口】请补充目标品种、区域、采购周期和当前库存，才能给出针对性建议。<br><br>${source}`;
  return `【问题理解】该问题可从种植管理、品质标准、加工利用或市场经营四个维度进一步拆解。<br><br>【建议提供的信息】橡胶品种/胶种、所在区域与地块条件、发生时间、检测或图片资料、现有标准版本、目标（种植、收购、加工或采购）。<br><br>【严谨原则】系统上线后将先检索企业知识库和实时业务数据，再给出结论、依据、建议动作、风险提示与可追溯来源；高风险农业建议应由农技专家复核。<br><br>${source}`;
}

/* Quality-analysis upgrade: transparent rule checks plus per-indicator help.
   Thresholds below are DEMO configuration only and must be replaced with the
   partner's approved product-grade / procurement-standard rule table. */
function setupQuality() {
  const form = main.querySelector('.quality-form');
  const fields = [...form.querySelectorAll('input[type="number"]')];
  const definitions = [
    { name:'干胶含量 DRC', unit:'%', meaning:'样品中实际橡胶干物质所占比例。它直接影响按湿胶称重折算后的有效胶量及收购结算。', effect:'数值偏低通常意味着水分比例较高，单位湿重可折算的干胶减少；异常波动应复核抽样、称量和干燥方法。', rule:'演示预警：低于 60% 提示复检。' },
    { name:'杂质含量', unit:'%', meaning:'橡胶中泥沙、树皮、纤维及其他非橡胶异物的比例，是清洁度与加工风险的重要指标。', effect:'数值升高会增加过滤、清洗和加工损耗，并可能影响制品均匀性；应核查采收、储运和现场卫生。', rule:'演示预警：高于 0.05% 提示复检。' },
    { name:'门尼黏度', unit:'MU', meaning:'反映橡胶黏弹性和加工流动性的常用指标，用于判断混炼、挤出、压延等加工适配性。', effect:'偏高可能使加工流动性下降；偏低可能影响强度或批次稳定性。必须按具体胶种、产品配方和企业标准判定。', rule:'演示关注区间：60–80 MU。' },
    { name:'初始塑性 P0', unit:'—', meaning:'表示生胶初始塑性水平，是评估原料橡胶物理性能和批次稳定性的基础指标之一。', effect:'较低值可能提示原料性能或储存、加工过程存在波动；需与塑性保持率、挥发分等指标联合判断。', rule:'演示预警：低于 35 提示复检。' }
  ];
  fields.forEach((field, index) => {
    const label = field.closest('label');
    if (!label || label.querySelector('.quality-help')) return;
    const help = document.createElement('button');
    help.type = 'button'; help.className = 'quality-help'; help.textContent = '?'; help.setAttribute('aria-label', `${definitions[index].name} 指标说明`);
    help.addEventListener('click', () => openPanel(definitions[index].name, `<div class="indicator-detail"><p><b>指标含义：</b>${definitions[index].meaning}</p><p><b>数值变化的影响：</b>${definitions[index].effect}</p><p><b>系统演示规则：</b>${definitions[index].rule}</p><p class="panel-note">正式项目应以合作方确认的胶种、等级、检测方法和标准版本为准，不能直接采用演示阈值。</p></div>`));
    label.prepend(help);
  });
  main.querySelector('#analyse-quality').addEventListener('click', () => {
    const [drc, impurity, mooney, p0] = fields.map((item) => Number(item.value));
    const issues = [];
    if (!Number.isFinite(drc) || !Number.isFinite(impurity) || !Number.isFinite(mooney) || !Number.isFinite(p0)) { issues.push('存在未填写或非数字检测值'); }
    if (drc < 60) issues.push(`DRC ${drc.toFixed(1)}% 低于演示复检线 60%`);
    if (impurity > 0.05) issues.push(`杂质 ${impurity.toFixed(3)}% 高于演示复检线 0.05%`);
    if (mooney < 60 || mooney > 80) issues.push(`门尼黏度 ${mooney.toFixed(0)} 超出演示关注区间 60–80`);
    if (p0 < 35) issues.push(`初始塑性 P0 ${p0.toFixed(0)} 低于演示复检线 35`);
    const status = issues.length ? '建议复检后分级收购' : '指标处于演示关注范围，可进入标准审核';
    const result = main.querySelector('#quality-result'); result.classList.remove('hidden');
    result.innerHTML = `<h3>初步质量建议：${status}</h3><div class="quality-summary"><b>检测概览</b><p>DRC ${drc}% · 杂质 ${impurity}% · 门尼 ${mooney} MU · P0 ${p0}</p><b>规则检查</b>${issues.length ? `<ul>${issues.map((item) => `<li>${item}</li>`).join('')}</ul>` : '<p>未触发当前演示阈值。</p>'}<b>下一步</b><p>核对样品代表性、检测仪器校准、检测单和适用的企业标准版本；临界或异常批次应复检并由授权质检人员确认最终等级与结算价。</p><p class="result-disclaimer">本结果由可审计的演示规则生成，不构成国家标准、交易结算或生产处置结论。</p></div>`;
  });
}

setupNotifications();
navItems.forEach((item) => item.addEventListener('click', () => go(item.dataset.route)));
go('home');
