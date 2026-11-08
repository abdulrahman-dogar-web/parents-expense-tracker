/* Parents Expense & Bill Tracker — offline, localStorage only.
   No server, no account, no tracking. Data stays on this device. */
'use strict';

var STORAGE_KEY = 'parentsExpenseTracker.v1';
var DEFAULT_STATE = {
  lang: 'ur',
  incomes: [], expenses: [], bills: [], meters: [], goals: [], members: [], recurring: [],
  settings: { electricityRate: 35, gasRate: 25, reminders: true },
  demoLoaded: false
};

var CATEGORIES = ['groceries', 'transport', 'medicine', 'school', 'eating', 'other'];
var BILL_TYPES = ['electricity', 'gas', 'water', 'internet', 'phone', 'rent', 'other'];

/* ---------- i18n ---------- */
var I18N = {
  ur: {
    appTitle: 'والدین خرچ اور بل ٹریکر', appSubtitle: 'گھر کا پیسہ، آسان طریقے سے — مکمل آف لائن',
    demoData: 'ڈیمو ڈیٹا', navDashboard: 'خلاصہ', navIncome: 'آمدنی', navExpenses: 'خرچے', navBills: 'بل', navMeter: 'میٹر', navGoals: 'بچت', navSettings: 'ترتیبات',
    privacyNote: 'آپ کا ڈیٹا صرف اسی آلے پر محفوظ رہتا ہے۔ کوئی انٹرنیٹ، کوئی اکاؤنٹ، کوئی پاس ورڈ نہیں۔',
    chooseMonth: 'مہینہ منتخب کریں', prevMonth: 'پچھلا', thisMonth: 'اس مہینہ', nextMonth: 'اگلا',
    totalIncome: 'کل آمدنی', totalExpenses: 'کل خرچے', totalBills: 'کل بل', balanceLeft: 'باقی رقم',
    chartsTitle: 'اس مہینے کی تصویر', expensesByCategory: 'خرچے — زمرہ کے حساب سے', moneySplit: 'پیسہ کہاں گیا؟',
    incomeTitle: 'آمدنی شامل کریں', source: 'ذریعہ', salary: 'تنخواہ', pension: 'پنشن', business: 'کاروبار', other: 'دیگر',
    amount: 'رقم (روپے)', date: 'تاریخ', noteOptional: 'نوٹ (اختیاری)', note: 'نوٹ', notePh: 'مثلاً نومبر کی تنخواہ',
    addIncome: 'آمدنی شامل کریں', expenseTitle: 'خرچہ شامل کریں', category: 'زمرہ',
    catGroceries: '🛒 کریانہ', catTransport: '🚌 ٹرانسپورٹ', catMedicine: '💊 دوا', catSchool: '🎒 اسکول', catEating: '🍽️ باہر کھانا', catOther: '📦 دیگر',
    whoSpent: 'کس نے خرچ کیا؟', who: 'کون', expNotePh: 'مثلاً سبزی، دال، چاول', addExpense: 'خرچہ شامل کریں',
    billsTitle: 'بل شامل کریں', billType: 'بل کی قسم', billElectricity: '⚡ بجلی', billGas: '🔥 گیس', billWater: '💧 پانی', billInternet: '🌐 انٹرنیٹ', billPhone: '📱 فون', billRent: '🏠 کرایہ', billOther: '📦 دیگر',
    dueDate: 'آخری تاریخ', status: 'حالت', unpaid: 'ادا نہیں ہوا', paid: 'ادا ہو گیا', addBill: 'بل شامل کریں',
    predictionTitle: 'اگلے مہینے کا اندازہ', predictionHint: 'پچھلے 3 مہینوں کی اوسط سے اندازہ لگایا جاتا ہے۔',
    meterTitle: 'میٹر کی تصویر اور ریڈنگ', meterHint: 'میٹر کی تصویر لیں، ریڈنگ لکھیں — ایپ خود یونٹ اور اندازاً بل نکالے گی۔',
    meterType: 'میٹر', meterReading: 'ریڈنگ (نمبر)', meterPhoto: 'میٹر کی تصویر', saveReading: 'ریڈنگ محفوظ کریں',
    goalsTitle: 'بچت کے اہداف', goalName: 'ہدف کا نام', targetAmount: 'مطلوبہ رقم (روپے)', addGoal: 'ہدف بنائیں',
    familyTitle: 'خاندان کے افراد', memberName: 'نام', memberRole: 'رشتہ', addMember: 'فرد شامل کریں',
    recurringTitle: 'ہر مہینے والے خرچے', recName: 'نام', addRecurring: 'شامل کریں',
    settingsTitle: 'ترتیبات، بیک اپ اور ڈیٹا', rateElectricity: 'بجلی — فی یونٹ قیمت (روپے)', rateGas: 'گیس — فی یونٹ قیمت (روپے)',
    remindersOn: 'بل کی یاد دہانیاں دکھائیں', offlineNote: 'انٹرنیٹ کے بغیر کام کرتا ہے — ڈیٹا اسی آلے پر رہتا ہے',
    saveSettings: 'ترتیبات محفوظ کریں', importBackup: 'بیک اپ واپس لائیں (JSON)', clearDemo: 'ڈیمو ڈیٹا ہٹائیں', clearAll: 'سب ڈیٹا صاف کریں',
    footerNote: 'والدین خرچ اور بل ٹریکر — اپنے والدین کے لیے، محبت سے۔ ڈیٹا آپ کے آلے سے باہر نہیں جاتا۔',
    entries: 'اندراجات', noDataYet: 'اس مہینے ابھی کوئی ڈیٹا نہیں — اوپر سے شامل کریں۔',
    noExpensesYet: 'اس مہینے ابھی کوئی خرچہ نہیں۔', noBillsYet: 'اس مہینے ابھی کوئی بل نہیں۔',
    noGoalsYet: 'ابھی کوئی ہدف نہیں — اوپر سے بنائیں۔', noMembersYet: 'ابھی کوئی فرد شامل نہیں۔',
    noMetersYet: 'ابھی کوئی ریڈنگ نہیں — اوپر سے پہلی ریڈنگ شامل کریں۔',
    saved: 'محفوظ ہو گیا ✓', deleted: 'حذف کر دیا گیا', markedPaid: 'ادا شدہ نشان زد کر دیا گیا',
    demoLoaded: 'ڈیمو ڈیٹا لاد دیا گیا — اسے ترتیبات سے ہٹا سکتے ہیں۔', demoCleared: 'ڈیمو ڈیٹا ہٹا دیا گیا۔',
    allCleared: 'سب ڈیٹا صاف کر دیا گیا۔', settingsSaved: 'ترتیبات محفوظ ہو گئیں ✓',
    exported: 'فائل ڈاؤن لوڈ ہو گئی ✓', imported: 'بیک اپ واپس لا دیا گیا ✓', importFailed: 'بیک اپ فائل درست نہیں ہے۔',
    confirmClearAll: 'کیا واقعی سب ڈیٹا صاف کرنا ہے؟ یہ واپس نہیں آئے گا۔',
    confirmDelete: 'کیا یہ حذف کرنا ہے؟', confirmClearDemo: 'کیا ڈیمو ڈیٹا ہٹانا ہے؟',
    addMoney: 'رقم شامل کریں', add: 'شامل کریں', remove: 'ہٹائیں', delete: 'حذف کریں', markPaid: 'ادا کریں',
    savedSoFar: 'اب تک بچت', remaining: 'باقی', complete: 'مکمل! 🎉',
    overdue: 'میعاد گزر گئی', dueToday: 'آج آخری تاریخ ہے', dueIn: 'دن میں آخری تاریخ', allBillsOk: 'سب بل ٹھیک ہیں — کوئی بل زیرِ التوا نہیں۔ 🎉',
    needHistory: 'اندازے کے لیے پچھلے مہینوں کا ڈیٹا چاہیے۔', basedOn: 'کی بنیاد پر', monthsAvg: 'مہینوں کی اوسط',
    trendUp: '↑ پچھلے مہینے سے زیادہ', trendDown: '↓ پچھلے مہینے سے کم', trendFlat: '→ برابر',
    unitsUsed: 'یونٹ استعمال ہوئے', estBill: 'اندازاً بل', fromReading: 'سے', toReading: 'تک',
    reading: 'ریڈنگ', noPhoto: 'تصویر نہیں', addRecurringThisMonth: 'اس مہینے کے ہر مہینے والے خرچے شامل کریں',
    recurringAdded: 'ہر مہینے والے خرچے شامل کر دیے گئے ✓', recurringHintText: 'یہ خرچے ہر مہینے خود بخود یاد دلائے جائیں گے۔',
    totalSaved: 'کل بچت', dataOnDevice: 'اندراجات اس آلے پر محفوظ ہیں۔'
  },
  en: {
    appTitle: 'Parents Expense & Bill Tracker', appSubtitle: 'Household money, made simple — fully offline',
    demoData: 'Demo Data', navDashboard: 'Summary', navIncome: 'Income', navExpenses: 'Expenses', navBills: 'Bills', navMeter: 'Meter', navGoals: 'Savings', navSettings: 'Settings',
    privacyNote: 'Your data stays only on this device. No internet, no account, no password.',
    chooseMonth: 'Choose month', prevMonth: 'Previous', thisMonth: 'This Month', nextMonth: 'Next',
    totalIncome: 'Total Income', totalExpenses: 'Total Expenses', totalBills: 'Total Bills', balanceLeft: 'Balance Left',
    chartsTitle: 'This Month at a Glance', expensesByCategory: 'Expenses — by Category', moneySplit: 'Where Did the Money Go?',
    incomeTitle: 'Add Income', source: 'Source', salary: 'Salary', pension: 'Pension', business: 'Business', other: 'Other',
    amount: 'Amount (Rs)', date: 'Date', noteOptional: 'Note (optional)', note: 'Note', notePh: 'e.g. November salary',
    addIncome: 'Add Income', expenseTitle: 'Add Expense', category: 'Category',
    catGroceries: '🛒 Groceries', catTransport: '🚌 Transport', catMedicine: '💊 Medicine', catSchool: '🎒 School', catEating: '🍽️ Eating Out', catOther: '📦 Other',
    whoSpent: 'Who spent it?', who: 'Who', expNotePh: 'e.g. vegetables, lentils, rice', addExpense: 'Add Expense',
    billsTitle: 'Add Bill', billType: 'Bill Type', billElectricity: '⚡ Electricity', billGas: '🔥 Gas', billWater: '💧 Water', billInternet: '🌐 Internet', billPhone: '📱 Phone', billRent: '🏠 Rent', billOther: '📦 Other',
    dueDate: 'Due Date', status: 'Status', unpaid: 'Unpaid', paid: 'Paid', addBill: 'Add Bill',
    predictionTitle: 'Next Month Prediction', predictionHint: 'Predicted from the average of the last 3 months.',
    meterTitle: 'Meter Photo & Reading', meterHint: 'Take a photo of the meter, enter the reading — the app calculates units and the estimated bill.',
    meterType: 'Meter', meterReading: 'Reading (number)', meterPhoto: 'Meter Photo', saveReading: 'Save Reading',
    goalsTitle: 'Savings Goals', goalName: 'Goal Name', targetAmount: 'Target Amount (Rs)', addGoal: 'Create Goal',
    familyTitle: 'Family Members', memberName: 'Name', memberRole: 'Relation', addMember: 'Add Member',
    recurringTitle: 'Monthly Recurring Expenses', recName: 'Name', addRecurring: 'Add',
    settingsTitle: 'Settings, Backup & Data', rateElectricity: 'Electricity — price per unit (Rs)', rateGas: 'Gas — price per unit (Rs)',
    remindersOn: 'Show bill due-date reminders', offlineNote: 'Works without internet — data stays on this device',
    saveSettings: 'Save Settings', importBackup: 'Restore Backup (JSON)', clearDemo: 'Remove Demo Data', clearAll: 'Clear All Data',
    footerNote: 'Parents Expense & Bill Tracker — for our parents, with love. Your data never leaves your device.',
    entries: 'entries', noDataYet: 'No data this month yet — add some above.',
    noExpensesYet: 'No expenses this month yet.', noBillsYet: 'No bills this month yet.',
    noGoalsYet: 'No goals yet — create one above.', noMembersYet: 'No members added yet.',
    noMetersYet: 'No readings yet — add your first reading above.',
    saved: 'Saved ✓', deleted: 'Deleted', markedPaid: 'Marked as paid',
    demoLoaded: 'Demo data loaded — you can remove it from Settings.', demoCleared: 'Demo data removed.',
    allCleared: 'All data cleared.', settingsSaved: 'Settings saved ✓',
    exported: 'File downloaded ✓', imported: 'Backup restored ✓', importFailed: 'That backup file is not valid.',
    confirmClearAll: 'Really clear ALL data? This cannot be undone.',
    confirmDelete: 'Delete this?', confirmClearDemo: 'Remove the demo data?',
    addMoney: 'Add money', add: 'Add', remove: 'Remove', delete: 'Delete', markPaid: 'Mark Paid',
    savedSoFar: 'Saved so far', remaining: 'Remaining', complete: 'Complete! 🎉',
    overdue: 'overdue', dueToday: 'due today', dueIn: 'due in days', allBillsOk: 'All bills are fine — nothing pending. 🎉',
    needHistory: 'Need past months’ data for a prediction.', basedOn: 'based on', monthsAvg: 'months’ average',
    trendUp: '↑ higher than last month', trendDown: '↓ lower than last month', trendFlat: '→ same',
    unitsUsed: 'Units used', estBill: 'Estimated bill', fromReading: 'from', toReading: 'to',
    reading: 'Reading', noPhoto: 'No photo', addRecurringThisMonth: 'Add this month’s recurring expenses',
    recurringAdded: 'Recurring expenses added ✓', recurringHintText: 'These expenses will be suggested again every month.',
    totalSaved: 'Total saved', dataOnDevice: 'entries stored on this device.'
  }
};

/* ---------- state ---------- */
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    var s = JSON.parse(raw);
    var d = JSON.parse(JSON.stringify(DEFAULT_STATE));
    Object.keys(d).forEach(function (k) { if (s[k] !== undefined) d[k] = s[k]; });
    d.settings = Object.assign({}, DEFAULT_STATE.settings, s.settings || {});
    return d;
  } catch (e) { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}
var state = (typeof localStorage !== 'undefined') ? loadState() : JSON.parse(JSON.stringify(DEFAULT_STATE));
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {
    // localStorage full (meter photos are large) — keep newest photo, drop oldest photos
    try {
      state.meters.forEach(function (m) { if (m.photo) m.photo = ''; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      toast(t('saved'));
    } catch (e2) { /* storage still full; data in memory only */ }
  }
}
function t(key) { var lang = state.lang || 'ur'; return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
function uid() { return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
function fmt(n) { return 'Rs ' + Number(n || 0).toLocaleString('en-US'); }
function todayStr() { var d = new Date(); return d.toISOString().slice(0, 10); }
function currentMonth() { return (document.getElementById('monthPicker') || {}).value || todayStr().slice(0, 7); }
function inMonth(dateStr, month) { return (dateStr || '').slice(0, 7) === month; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

/* Pure logic — also tested by node (see bottom exports) */
function predictNextMonth(bills, type) {
  // Group paid+unpaid bills of this type by month, take last 3 months with data, average them.
  var byMonth = {};
  bills.filter(function (b) { return b.type === type; }).forEach(function (b) {
    var m = (b.due || b.date || '').slice(0, 7); if (!m) return;
    byMonth[m] = (byMonth[m] || 0) + Number(b.amount || 0);
  });
  var months = Object.keys(byMonth).sort().slice(-3);
  if (!months.length) return null;
  var sum = months.reduce(function (a, m) { return a + byMonth[m]; }, 0);
  var avg = Math.round(sum / months.length);
  var last = byMonth[months[months.length - 1]];
  var prev = months.length > 1 ? byMonth[months[months.length - 2]] : null;
  var trend = prev === null ? 'flat' : (last > prev ? 'up' : last < prev ? 'down' : 'flat');
  return { predicted: avg, monthsUsed: months.length, lastMonth: last, trend: trend };
}
function meterEstimate(readings, type, rate) {
  var list = readings.filter(function (r) { return r.type === type; })
    .sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
  if (list.length < 2) return null;
  var a = list[list.length - 2], b = list[list.length - 1];
  var units = Math.round((Number(b.reading) - Number(a.reading)) * 100) / 100;
  if (units < 0) return { error: 'negative', from: a, to: b, units: units };
  return { from: a, to: b, units: units, estBill: Math.round(units * Number(rate || 0)) };
}

/* ---------- i18n apply ---------- */
function applyI18n() {
  var lang = state.lang || 'ur';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
  var ur = document.getElementById('langUr'), en = document.getElementById('langEn');
  if (ur) ur.classList.toggle('active', lang === 'ur');
  if (en) en.classList.toggle('active', lang === 'en');
}
function setLang(lang) { state.lang = lang; save(); applyI18n(); renderAll(); }

/* ---------- toast ---------- */
var toastTimer = null;
function toast(msg) {
  var el = document.getElementById('toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
}

/* ---------- render ---------- */
function renderAll() {
  applyI18n();
  var month = currentMonth();
  var incomes = state.incomes.filter(function (x) { return inMonth(x.date, month); });
  var expenses = state.expenses.filter(function (x) { return inMonth(x.date, month); });
  var bills = state.bills.filter(function (x) { return inMonth(x.due, month); });
  var sum = function (arr) { return arr.reduce(function (a, x) { return a + Number(x.amount || 0); }, 0); };
  var inc = sum(incomes), exp = sum(expenses), bil = sum(bills);
  var bal = inc - exp - bil;

  var setText = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
  setText('sumIncome', fmt(inc)); setText('sumExpenses', fmt(exp)); setText('sumBills', fmt(bil));
  var balEl = document.getElementById('sumBalance'); if (balEl) { balEl.textContent = fmt(bal); balEl.classList.toggle('negative', bal < 0); }
  setText('sumIncomeCount', incomes.length + ' ' + t('entries'));
  setText('sumExpenseCount', expenses.length + ' ' + t('entries'));
  setText('sumBillCount', bills.length + ' ' + t('entries'));
  setText('balanceNote', bal >= 0 ? '✓' : '');
  setText('dataStats', (state.incomes.length + state.expenses.length + state.bills.length + state.meters.length + state.goals.length) + ' ' + t('dataOnDevice'));

  renderReminders(); renderCharts(expenses, exp, bil); renderPredictions();
  renderIncome(incomes); renderExpenses(expenses); renderBills(bills);
  renderMeters(); renderGoals(); renderMembers(); renderRecurring(month);
  fillMemberSelect();
  var rt = document.getElementById('rateElectricity'); if (rt) rt.value = state.settings.electricityRate;
  var rg = document.getElementById('rateGas'); if (rg) rg.value = state.settings.gasRate;
  var rem = document.getElementById('remindersToggle'); if (rem) rem.checked = !!state.settings.reminders;
  setText('chartHint', expenses.length ? '' : t('noExpensesYet'));
  setText('recurringHint', t('recurringHintText'));
}

function renderReminders() {
  var box = document.getElementById('remindersBox'); if (!box) return;
  box.innerHTML = '';
  if (!state.settings.reminders) return;
  var today = todayStr();
  var unpaid = state.bills.filter(function (b) { return b.status === 'unpaid'; });
  if (!unpaid.length) { box.innerHTML = '<div class="reminder ok">🎉 ' + esc(t('allBillsOk')) + '</div>'; return; }
  var msDay = 86400000;
  unpaid.slice().sort(function (a, b) { return String(a.due).localeCompare(String(b.due)); }).forEach(function (b) {
    var diff = Math.round((new Date(b.due + 'T00:00:00') - new Date(today + 'T00:00:00')) / msDay);
    var cls = 'soon', label;
    if (diff < 0) { cls = 'overdue'; label = '⏰ ' + billLabel(b.type) + ' — ' + fmt(b.amount) + ' • ' + Math.abs(diff) + ' ' + t('overdue'); }
    else if (diff === 0) { cls = 'today'; label = '⏰ ' + billLabel(b.type) + ' — ' + fmt(b.amount) + ' • ' + t('dueToday'); }
    else if (diff <= 3) { cls = 'today'; label = '⏰ ' + billLabel(b.type) + ' — ' + fmt(b.amount) + ' • ' + diff + ' ' + t('dueIn'); }
    else { cls = 'soon'; label = '📅 ' + billLabel(b.type) + ' — ' + fmt(b.amount) + ' • ' + diff + ' ' + t('dueIn'); }
    var div = document.createElement('div'); div.className = 'reminder ' + cls; div.textContent = label; box.appendChild(div);
  });
}

function renderCharts(expenses, expTotal, billTotal) {
  var bar = document.getElementById('barChart'); if (!bar) return;
  var byCat = {}; CATEGORIES.forEach(function (c) { byCat[c] = 0; });
  expenses.forEach(function (e) { byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount || 0); });
  var max = Math.max.apply(null, Object.values(byCat).concat([1]));
  bar.innerHTML = CATEGORIES.map(function (c) {
    var v = byCat[c] || 0, pct = max ? Math.round(v / max * 100) : 0;
    return '<div class="bar-row"><span>' + esc(catLabel(c)) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div><span class="bar-val">' + fmt(v) + '</span></div>';
  }).join('');
  // Donut: expenses vs bills vs remaining income (or savings if no income)
  var donut = document.getElementById('donutChart'), legend = document.getElementById('donutLegend');
  var total = expTotal + billTotal;
  var spentPct = total > 0 ? 100 : 0;
  if (donut) {
    var expPct = total ? Math.round(expTotal / total * 100) : 0;
    donut.style.background = total
      ? 'conic-gradient(#d97706 0 ' + expPct + '%, #2563eb ' + expPct + '% 100%)'
      : 'conic-gradient(#dfe8e2 0 100%)';
    var c = document.getElementById('donutCenter'); if (c) c.textContent = fmt(total);
  }
  if (legend) {
    legend.innerHTML = '<li><span class="dot" style="background:#d97706"></span>' + esc(t('totalExpenses')) + ' — ' + fmt(expTotal) + '</li>'
      + '<li><span class="dot" style="background:#2563eb"></span>' + esc(t('totalBills')) + ' — ' + fmt(billTotal) + '</li>'
      + '<li><span class="dot" style="background:#0e7a4d"></span>' + esc(t('balanceLeft')) + ' — ' + fmt(Math.max(0, (state.incomes.filter(function (x) { return inMonth(x.date, currentMonth()); }).reduce(function (a, x) { return a + Number(x.amount || 0); }, 0) - total))) + '</li>';
  }
  void spentPct;
}

function renderPredictions() {
  var box = document.getElementById('predictions'); if (!box) return;
  box.innerHTML = BILL_TYPES.map(function (type) {
    var p = predictNextMonth(state.bills, type);
    if (!p) return '<div class="pred-card"><strong>' + esc(billLabel(type)) + '</strong><span class="hint">' + esc(t('needHistory')) + '</span></div>';
    var trendTxt = p.trend === 'up' ? t('trendUp') : p.trend === 'down' ? t('trendDown') : t('trendFlat');
    var trendCls = p.trend === 'up' ? 'trend-up' : p.trend === 'down' ? 'trend-down' : 'trend-flat';
    return '<div class="pred-card"><strong>' + esc(billLabel(type)) + '</strong><strong>' + fmt(p.predicted) + '</strong>'
      + '<span class="' + trendCls + '">' + esc(trendTxt) + '</span><br><small class="hint">' + esc(t('basedOn')) + ' ' + p.monthsUsed + ' ' + esc(t('monthsAvg')) + '</small></div>';
  }).join('');
}

function catLabel(c) { return t('cat' + c.charAt(0).toUpperCase() + c.slice(1)); }
function billLabel(b) { return t('bill' + b.charAt(0).toUpperCase() + b.slice(1)); }
function sourceLabel(s) { return t(s); }
function memberName(id) {
  if (!id) return '—';
  var m = state.members.find(function (x) { return x.id === id; });
  return m ? m.name : '—';
}

function renderIncome(list) {
  var tb = document.getElementById('incomeList'); if (!tb) return;
  tb.innerHTML = list.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).map(function (x) {
    return '<tr><td>' + esc(x.date) + '</td><td>' + esc(sourceLabel(x.source)) + '</td><td>' + esc(x.note || '—') + '</td><td><strong>' + fmt(x.amount) + '</strong></td><td><button class="icon-btn" onclick="deleteItem(\'incomes\',\'' + x.id + '\')" aria-label="Delete">🗑️</button></td></tr>';
  }).join('');
  var e = document.getElementById('incomeEmpty'); if (e) e.textContent = list.length ? '' : t('noDataYet');
}
function renderExpenses(list) {
  var tb = document.getElementById('expenseList'); if (!tb) return;
  tb.innerHTML = list.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).map(function (x) {
    return '<tr><td>' + esc(x.date) + '</td><td>' + esc(catLabel(x.category)) + '</td><td>' + esc(memberName(x.memberId)) + '</td><td>' + esc(x.note || '—') + '</td><td><strong>' + fmt(x.amount) + '</strong></td><td><button class="icon-btn" onclick="deleteItem(\'expenses\',\'' + x.id + '\')" aria-label="Delete">🗑️</button></td></tr>';
  }).join('');
  var e = document.getElementById('expenseEmpty'); if (e) e.textContent = list.length ? '' : t('noExpensesYet');
}
function renderBills(list) {
  var tb = document.getElementById('billList'); if (!tb) return;
  tb.innerHTML = list.slice().sort(function (a, b) { return String(a.due).localeCompare(String(b.due)); }).map(function (x) {
    var badge = x.status === 'paid' ? '<span class="badge paid">' + esc(t('paid')) + '</span>' : '<span class="badge unpaid">' + esc(t('unpaid')) + '</span>';
    var action = x.status === 'paid' ? '' : '<button class="btn btn-light small-btn" onclick="markBillPaid(\'' + x.id + '\')">' + esc(t('markPaid')) + '</button> ';
    return '<tr><td>' + esc(billLabel(x.type)) + '</td><td>' + esc(x.due) + '</td><td><strong>' + fmt(x.amount) + '</strong></td><td>' + badge + '</td><td>' + action + '<button class="icon-btn" onclick="deleteItem(\'bills\',\'' + x.id + '\')" aria-label="Delete">🗑️</button></td></tr>';
  }).join('');
  var e = document.getElementById('billEmpty'); if (e) e.textContent = list.length ? '' : t('noBillsYet');
}
function renderMeters() {
  var box = document.getElementById('meterList'); if (!box) return;
  var list = state.meters.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  box.innerHTML = list.map(function (m) {
    var img = m.photo ? '<img src="' + m.photo + '" alt="Meter photo ' + esc(m.date) + '">' : '<div style="padding:30px;text-align:center;color:#888">' + esc(t('noPhoto')) + '</div>';
    return '<div class="meter-card">' + img + '<div class="meter-body"><strong>' + esc(billLabel(m.type)) + '</strong><br>' + esc(t('reading')) + ': <strong>' + esc(String(m.reading)) + '</strong><br><small>' + esc(m.date) + '</small><br><button class="btn btn-light small-btn" style="margin-top:8px" onclick="deleteItem(\'meters\',\'' + m.id + '\')">' + esc(t('delete')) + '</button></div></div>';
  }).join('');
  var e = document.getElementById('meterEmpty'); if (e) e.textContent = list.length ? '' : t('noMetersYet');
  var cmp = document.getElementById('meterCompare'); if (!cmp) return;
  var parts = [];
  ['electricity', 'gas'].forEach(function (type) {
    var rate = type === 'electricity' ? state.settings.electricityRate : state.settings.gasRate;
    var r = meterEstimate(state.meters, type, rate);
    if (r && !r.error) {
      parts.push('<strong>' + esc(billLabel(type)) + ':</strong> ' + esc(t('fromReading')) + ' ' + esc(String(r.from.reading)) + ' (' + esc(r.from.date) + ') ' + esc(t('toReading')) + ' ' + esc(String(r.to.reading)) + ' (' + esc(r.to.date) + ') — <strong>' + r.units + ' ' + esc(t('unitsUsed')) + '</strong> • ' + esc(t('estBill')) + ': <strong>' + fmt(r.estBill) + '</strong> (' + fmt(rate) + ' / unit)');
    }
  });
  cmp.innerHTML = parts.length ? parts.join('<br>') : '';
  cmp.style.display = parts.length ? '' : 'none';
}
function renderGoals() {
  var box = document.getElementById('goalList'); if (!box) return;
  box.innerHTML = state.goals.map(function (g) {
    var pct = g.target > 0 ? Math.min(100, Math.round(g.saved / g.target * 100)) : 0;
    var remaining = Math.max(0, g.target - g.saved);
    return '<div class="goal-card"><div class="goal-head"><strong>' + esc(g.name) + '</strong><span>' + pct + '%</span></div>'
      + '<div class="progress"><div class="progress-fill" style="width:' + pct + '%"></div></div>'
      + '<div>' + esc(t('savedSoFar')) + ': <strong>' + fmt(g.saved) + '</strong> / ' + fmt(g.target) + ' • ' + esc(t('remaining')) + ': ' + fmt(remaining) + (pct >= 100 ? ' — ' + esc(t('complete')) : '') + '</div>'
      + '<div class="goal-actions"><input type="number" min="1" step="1" inputmode="numeric" id="add-' + g.id + '" placeholder="1000" aria-label="' + esc(t('addMoney')) + '"><button class="btn btn-primary small-btn" onclick="addToGoal(\'' + g.id + '\')">＋ ' + esc(t('add')) + '</button><button class="btn btn-danger small-btn" onclick="deleteItem(\'goals\',\'' + g.id + '\')">' + esc(t('delete')) + '</button></div></div>';
  }).join('');
  var e = document.getElementById('goalEmpty'); if (e) e.textContent = state.goals.length ? '' : t('noGoalsYet');
}
function renderMembers() {
  var ul = document.getElementById('memberList'); if (!ul) return;
  ul.innerHTML = state.members.map(function (m) {
    var total = state.expenses.filter(function (e) { return e.memberId === m.id; }).reduce(function (a, e) { return a + Number(e.amount || 0); }, 0);
    return '<li><span><strong>' + esc(m.name) + '</strong>' + (m.role ? ' — ' + esc(m.role) : '') + '<br><small>' + esc(t('totalExpenses')) + ': ' + fmt(total) + '</small></span><button class="icon-btn" onclick="deleteItem(\'members\',\'' + m.id + '\')" aria-label="Delete">🗑️</button></li>';
  }).join('');
  var e = document.getElementById('memberEmpty'); if (e) e.textContent = state.members.length ? '' : t('noMembersYet');
}
function renderRecurring(month) {
  var box = document.getElementById('recurringList'); if (!box) return;
  var already = state.expenses.some(function (e) { return e.recurringId && inMonth(e.date, month); });
  var btn = (!already && state.recurring.length)
    ? '<button class="btn btn-primary" style="margin-top:10px" onclick="applyRecurring()">🔁 ' + esc(t('addRecurringThisMonth')) + '</button>' : '';
  box.innerHTML = state.recurring.map(function (r) {
    return '<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)"><span><strong>' + esc(r.name) + '</strong> — ' + esc(catLabel(r.category)) + '</span><span><strong>' + fmt(r.amount) + '</strong> <button class="icon-btn" onclick="deleteItem(\'recurring\',\'' + r.id + '\')" aria-label="Delete">🗑️</button></span></div>';
  }).join('') + btn;
}
function fillMemberSelect() {
  var sel = document.getElementById('expMember'); if (!sel) return;
  var cur = sel.value;
  sel.innerHTML = '<option value="">—</option>' + state.members.map(function (m) { return '<option value="' + m.id + '">' + esc(m.name) + '</option>'; }).join('');
  if (cur) sel.value = cur;
}

/* ---------- actions (called from HTML) ---------- */
function deleteItem(key, id) {
  if (!confirm(t('confirmDelete'))) return;
  state[key] = state[key].filter(function (x) { return x.id !== id; });
  save(); renderAll(); toast(t('deleted'));
}
function markBillPaid(id) {
  var b = state.bills.find(function (x) { return x.id === id; }); if (!b) return;
  b.status = 'paid'; save(); renderAll(); toast(t('markedPaid'));
}
function addToGoal(id) {
  var g = state.goals.find(function (x) { return x.id === id; }); if (!g) return;
  var input = document.getElementById('add-' + id);
  var v = Number(input && input.value);
  if (!v || v <= 0) { if (input) input.focus(); return; }
  g.saved = Number(g.saved || 0) + v; save(); renderAll(); toast(t('saved'));
}
function shiftMonth(d) {
  var p = document.getElementById('monthPicker'); if (!p || !p.value) return;
  var parts = p.value.split('-'); var dt = new Date(Number(parts[0]), Number(parts[1]) - 1 + d, 1);
  p.value = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'); renderAll();
}
function goCurrentMonth() {
  var p = document.getElementById('monthPicker'); if (p) p.value = todayStr().slice(0, 7); renderAll();
}
function applyRecurring() {
  var month = currentMonth();
  state.recurring.forEach(function (r) {
    if (state.expenses.some(function (e) { return e.recurringId === r.id && inMonth(e.date, month); })) return;
    state.expenses.push({ id: uid(), category: r.category, amount: r.amount, date: month + '-01', memberId: '', note: r.name, recurringId: r.id });
  });
  save(); renderAll(); toast(t('recurringAdded'));
}
function saveSettings() {
  var re = document.getElementById('rateElectricity'), rg = document.getElementById('rateGas'), rem = document.getElementById('remindersToggle');
  if (re) state.settings.electricityRate = Math.max(0, Number(re.value) || 0);
  if (rg) state.settings.gasRate = Math.max(0, Number(rg.value) || 0);
  if (rem) state.settings.reminders = !!rem.checked;
  save(); renderAll(); toast(t('settingsSaved'));
}

/* ---------- export / import ---------- */
function download(filename, text, mime) {
  var blob = new Blob([text], { type: mime || 'text/plain' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function exportJSON() { download('parents-expense-tracker-backup.json', JSON.stringify(state, null, 2), 'application/json'); toast(t('exported')); }
function csvCell(v) { var s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
function exportCSV() {
  var rows = [['type', 'date', 'category_or_source', 'amount_rs', 'member', 'note_or_status']];
  state.incomes.forEach(function (x) { rows.push(['income', x.date, x.source, x.amount, '', x.note || '']); });
  state.expenses.forEach(function (x) { rows.push(['expense', x.date, x.category, x.amount, memberName(x.memberId), x.note || '']); });
  state.bills.forEach(function (x) { rows.push(['bill', x.due, x.type, x.amount, '', x.status]); });
  state.meters.forEach(function (x) { rows.push(['meter', x.date, x.type, x.reading, '', '']); });
  state.goals.forEach(function (x) { rows.push(['goal', '', x.name, x.target, '', 'saved:' + x.saved]); });
  download('parents-expense-tracker.csv', rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n'), 'text/csv');
  toast(t('exported'));
}
function importBackup(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object' || !Array.isArray(data.incomes)) throw new Error('bad backup');
      state = Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), data);
      state.settings = Object.assign({}, DEFAULT_STATE.settings, data.settings || {});
      save(); applyI18n(); renderAll(); toast(t('imported'));
    } catch (e) { toast(t('importFailed')); }
  };
  reader.readAsText(file);
}

/* ---------- demo data ---------- */
function loadDemoData() {
  if (state.demoLoaded) { toast(t('demoLoaded')); return; }
  var demo = {
    members: [
      { id: uid(), name: 'ابو', role: 'والد' }, { id: uid(), name: 'امی', role: 'والدہ' },
      { id: uid(), name: 'بیٹا', role: 'بیٹا' }
    ],
    incomes: [
      { id: uid(), source: 'salary', amount: 85000, date: '2026-11-01', note: 'نومبر کی تنخواہ' },
      { id: uid(), source: 'pension', amount: 15000, date: '2026-11-05', note: 'پنشن' },
      { id: uid(), source: 'salary', amount: 85000, date: '2026-10-01', note: 'اکتوبر کی تنخواہ' }
    ],
    expenses: [
      { id: uid(), category: 'groceries', amount: 12000, date: '2026-11-03', memberId: '', note: 'ماہانہ کریانہ' },
      { id: uid(), category: 'groceries', amount: 2500, date: '2026-11-06', memberId: '', note: 'سبزی اور پھل' },
      { id: uid(), category: 'transport', amount: 3000, date: '2026-11-04', memberId: '', note: 'پیٹرول' },
      { id: uid(), category: 'medicine', amount: 1800, date: '2026-11-05', memberId: '', note: 'دوا' },
      { id: uid(), category: 'school', amount: 5000, date: '2026-11-02', memberId: '', note: 'اسکول فیس' },
      { id: uid(), category: 'eating', amount: 1500, date: '2026-11-07', memberId: '', note: 'باہر کھانا' }
    ],
    bills: [
      { id: uid(), type: 'electricity', amount: 9200, due: '2026-08-15', status: 'paid' },
      { id: uid(), type: 'electricity', amount: 8800, due: '2026-09-15', status: 'paid' },
      { id: uid(), type: 'electricity', amount: 9500, due: '2026-10-15', status: 'paid' },
      { id: uid(), type: 'electricity', amount: 9100, due: '2026-11-15', status: 'unpaid' },
      { id: uid(), type: 'gas', amount: 2100, due: '2026-09-12', status: 'paid' },
      { id: uid(), type: 'gas', amount: 2400, due: '2026-10-12', status: 'paid' },
      { id: uid(), type: 'gas', amount: 2600, due: '2026-11-12', status: 'unpaid' },
      { id: uid(), type: 'internet', amount: 3500, due: '2026-11-10', status: 'unpaid' },
      { id: uid(), type: 'water', amount: 1200, due: '2026-11-20', status: 'unpaid' },
      { id: uid(), type: 'rent', amount: 25000, due: '2026-11-01', status: 'paid' }
    ],
    meters: [
      { id: uid(), type: 'electricity', reading: 12480, date: '2026-10-05', photo: '' },
      { id: uid(), type: 'electricity', reading: 12730, date: '2026-11-05', photo: '' }
    ],
    goals: [
      { id: uid(), name: 'حج', target: 1200000, saved: 150000 },
      { id: uid(), name: 'نیا فریج', target: 120000, saved: 45000 }
    ],
    recurring: [
      { id: uid(), name: 'انٹرنیٹ', category: 'other', amount: 3500 },
      { id: uid(), name: 'دودھ والا', category: 'groceries', amount: 6000 }
    ]
  };
  // Link demo expenses to the first member for the family total demo
  if (demo.members[0]) demo.expenses[0].memberId = demo.members[0].id;
  state.members = state.members.concat(demo.members);
  state.incomes = state.incomes.concat(demo.incomes);
  state.expenses = state.expenses.concat(demo.expenses);
  state.bills = state.bills.concat(demo.bills);
  state.meters = state.meters.concat(demo.meters);
  state.goals = state.goals.concat(demo.goals);
  state.recurring = state.recurring.concat(demo.recurring);
  state.demoLoaded = true; state.demoIds = demo;
  save(); renderAll(); toast(t('demoLoaded'));
}
function clearDemoData() {
  if (!confirm(t('confirmClearDemo'))) return;
  // Demo rows are tracked by id in state.demoIds (saved when demo was loaded),
  // so removing them never touches the user's own data.
  var demo = state.demoIds || null;
  if (demo) {
    ['members', 'incomes', 'expenses', 'bills', 'meters', 'goals', 'recurring'].forEach(function (key) {
      var ids = (demo[key] || []).map(function (x) { return x.id; });
      state[key] = state[key].filter(function (x) { return ids.indexOf(x.id) === -1; });
    });
  } else {
    // Fallback for demo data loaded before ids were tracked: match the known demo rows.
    var demoNames = ['حج', 'نیا فریج', 'انٹرنیٹ', 'دودھ والا'];
    state.goals = state.goals.filter(function (g) { return g.name !== 'حج' && g.name !== 'نیا فریج'; });
    state.recurring = state.recurring.filter(function (r) { return demoNames.indexOf(r.name) === -1; });
    state.meters = state.meters.filter(function (m) { return !(m.reading === 12480 || m.reading === 12730); });
  }
  state.demoIds = null; state.demoLoaded = false; save(); renderAll(); toast(t('demoCleared'));
}
function clearAllData() {
  if (!confirm(t('confirmClearAll'))) return;
  var lang = state.lang;
  state = JSON.parse(JSON.stringify(DEFAULT_STATE)); state.lang = lang;
  save(); renderAll(); toast(t('allCleared'));
}

/* ---------- photo handling ---------- */
var pendingPhotoDataUrl = '';
function handlePhotoInput(file, done) {
  if (!file) { done(''); return; }
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var maxW = 800, scale = Math.min(1, maxW / img.width);
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = function () { done(String(reader.result || '')); };
    img.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

/* ---------- wiring ---------- */
function bindForms() {
  var $ = function (id) { return document.getElementById(id); };
  var setToday = function (id) { var el = $(id); if (el && !el.value) el.value = todayStr(); };
  setToday('incDate'); setToday('expDate'); setToday('meterDate');
  var mp = $('monthPicker'); if (mp && !mp.value) mp.value = todayStr().slice(0, 7);
  var bd = $('billDue'); if (bd && !bd.value) bd.value = todayStr().slice(0, 10);

  $('langUr').addEventListener('click', function () { setLang('ur'); });
  $('langEn').addEventListener('click', function () { setLang('en'); });
  $('monthPicker').addEventListener('change', renderAll);

  $('incomeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.incomes.push({ id: uid(), source: $('incSource').value, amount: Number($('incAmount').value), date: $('incDate').value, note: $('incNote').value.trim() });
    save(); renderAll(); e.target.reset(); setToday('incDate'); toast(t('saved'));
  });
  $('expenseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.expenses.push({ id: uid(), category: $('expCategory').value, amount: Number($('expAmount').value), date: $('expDate').value, memberId: $('expMember').value, note: $('expNote').value.trim() });
    save(); renderAll(); e.target.reset(); setToday('expDate'); fillMemberSelect(); toast(t('saved'));
  });
  $('billForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.bills.push({ id: uid(), type: $('billType').value, amount: Number($('billAmount').value), due: $('billDue').value, status: $('billStatus').value });
    save(); renderAll(); e.target.reset(); setToday('billDue'); toast(t('saved'));
  });
  $('meterPhoto').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    handlePhotoInput(file, function (url) {
      pendingPhotoDataUrl = url;
      var prev = $('meterPreview');
      if (url) { prev.src = url; prev.hidden = false; } else { prev.hidden = true; }
    });
  });
  $('meterForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.meters.push({ id: uid(), type: $('meterType').value, reading: Number($('meterReading').value), date: $('meterDate').value, photo: pendingPhotoDataUrl || '' });
    pendingPhotoDataUrl = ''; save(); renderAll(); e.target.reset(); setToday('meterDate');
    var prev = $('meterPreview'); if (prev) { prev.hidden = true; prev.src = ''; }
    toast(t('saved'));
  });
  $('goalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.goals.push({ id: uid(), name: $('goalName').value.trim(), target: Number($('goalTarget').value), saved: 0 });
    save(); renderAll(); e.target.reset(); toast(t('saved'));
  });
  $('memberForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.members.push({ id: uid(), name: $('memberName').value.trim(), role: $('memberRole').value.trim() });
    save(); renderAll(); e.target.reset(); toast(t('saved'));
  });
  $('recurringForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.recurring.push({ id: uid(), name: $('recName').value.trim(), amount: Number($('recAmount').value), category: $('recCategory').value });
    save(); renderAll(); e.target.reset(); toast(t('saved'));
  });
  $('importFile').addEventListener('change', function (e) {
    importBackup(e.target.files && e.target.files[0]); e.target.value = '';
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () { bindForms(); renderAll(); });
}

/* Node test exports — harmless in the browser */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { predictNextMonth: predictNextMonth, meterEstimate: meterEstimate, fmt: fmt };
}
