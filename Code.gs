const SHEET_ID = '18kB1tAbD0Dj1yS9wOwy_DV45SCPFoyhaa7I2ycj8Iwk';
const REQUESTS_SHEET = 'Solicitudes';
const PRIORITIES_SHEET = 'Prioridades';
const HEADERS = [
  'Fecha y hora','Estado','ID','Cantante','Título','Artista','Idioma','Nota',
  'Opción 1 · Título','Opción 1 · Canal','Opción 1 · Enlace',
  'Opción 2 · Título','Opción 2 · Canal','Opción 2 · Enlace',
  'Opción 3 · Título','Opción 3 · Canal','Opción 3 · Enlace','Elección host','Detalle'
];
const LANGUAGE_CODES = {'Inglés':'en','Español':'es','Latinoamérica':'es','Francés':'fr','Portugués':'pt','Alemán':'de','Italiano':'it','Ruso':'ru'};
const DEFAULT_PRIORITIES = {
  'Inglés':['Sing King','KaraFun Karaoke','Stingray Karaoke','Sing2Piano','Party Tyme Karaoke','The Karaoke Channel','EasyKaraoke','Vocal-Star Karaoke','CC Karaoke','Sunfly Karaoke'],
  'Español':['Sing King','KaraokeMedia','Karaoke Instrumental','Party Tyme Karaoke en Español','Ameritz Spanish Karaoke','KaraFun España','The Karaoke Channel','Vocal-Star Karaoke','EasyKaraoke','Party Tyme Karaoke'],
  'Latinoamérica':['Sing King','KaraokeMedia','Karaoke Instrumental','Party Tyme Karaoke en Español','Puro Mariachi Karaoke','Ameritz Spanish Karaoke','KaraFun España','CantaOkey','Agrupación LatinHits','Karaoke – Ameritz','M.M.P.','Reyes de Canción','Brava HitMakers','Stingray Karaoke','The Karaoke Channel','Vocal-Star Karaoke','EasyKaraoke','Party Tyme Karaoke','KaraFun Karaoke','Sunfly Karaoke'],
  'Francés':['Sing King','KaraFun France','KaraStar Karaoke','SING NOW','Valentin Trastet','Karaoké Playback Français','The Karaoke Channel','Vocal-Star Karaoke','EasyKaraoke','Party Tyme Karaoke'],
  'Portugués':['Sing King','Muramatsu Karaoke','Clubinho do Karaokê','Ponto do Karaokê 2','Karaokê Acústico Brasil','Party Tyme Karaoke em Português','Ponto do Karaokê 3','KaraFun Karaoke','Lelê Lyrics & Karaoke','Ponto do Karaokê'],
  'Alemán':['Sing King','KaraFun Deutschland','Lugn Karaoke','SingingGreenLight Karaoke','MY Pianista','The Karaoke Channel','Vocal-Star Karaoke','EasyKaraoke','Party Tyme Karaoke','Sunfly Karaoke'],
  'Italiano':['Sing King','Italian Karaoke – Backing Tracks','Karaoke Gaetano','Basi Musicali','KaraFun Karaoke','JAM Karaoke Italia','The Karaoke Channel','Vocal-Star Karaoke','EasyKaraoke','Party Tyme Karaoke'],
  'Ruso':['Sing King','Калинка Караоке — Kalinka Karaoke','MnogoNotka','KaraRuTV','КАРАОКЕ Базы и Диски','KaraFun Karaoke','The Karaoke Channel','Party Tyme Karaoke','Vocal-Star Karaoke','EasyKaraoke']
};

function spreadsheet_() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function doGet(e) {
  const data = e && e.parameter && e.parameter.action === 'status'
    ? getRequestStatus_(clean_(e.parameter.requestId, 80))
    : {ok:true, service:'Guest Star Sing Requests'};
  const callback = e && e.parameter ? String(e.parameter.callback || '') : '';
  if (/^[A-Za-z_$][\w$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    ensureSheets_();
    const p = e && e.parameter ? e.parameter : {};
    if (p.website) return json_({ok:true});
    const request = {
      id: clean_(p.requestId, 80), singer: clean_(p.singer, 80),
      title: clean_(p.title, 120), artist: clean_(p.artist, 120),
      language: clean_(p.language, 40), note: clean_(p.note, 300)
    };
    validate_(request);
    const existing = getRequestStatus_(request.id);
    if (existing.found) return json_({ok:true, duplicate:true, requestId:request.id});
    const sheet = spreadsheet_().getSheetByName(REQUESTS_SHEET);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let row;
    try {
      sheet.appendRow([new Date(),'BUSCANDO',request.id,request.singer,request.title,request.artist,request.language,request.note,'','','','','','','','','','','']);
      row = sheet.getLastRow();
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
    try {
      const videos = searchKaraoke_(request);
      const values = [];
      for (let i = 0; i < 3; i += 1) {
        const video = videos[i] || {};
        values.push(video.title || '', video.channel || '', video.url || '');
      }
      sheet.getRange(row, 9, 1, 9).setValues([values]);
      sheet.getRange(row, 2).setValue(videos.length ? 'LISTO' : 'SIN RESULTADOS');
      sheet.getRange(row, 19).setValue(videos.length ? '' : 'YouTube no devolvió opciones para esta búsqueda.');
      return json_({ok:true, requestId:request.id, results:videos.length});
    } catch (searchError) {
      sheet.getRange(row, 2).setValue('ERROR DE BÚSQUEDA');
      sheet.getRange(row, 19).setValue(String(searchError.message || searchError).slice(0,500));
      return json_({ok:true, requestId:request.id, warning:'La solicitud llegó, pero falló la búsqueda automática.'});
    }
  } catch (error) {
    return json_({ok:false, error:String(error.message || error)});
  }
}

function searchKaraoke_(request) {
  const priorities = getPriorities_(request.language);
  const query = `${request.title} ${request.artist} karaoke`;
  const response = YouTube.Search.list('id,snippet', {
    q: query, type: 'video', maxResults: 50, safeSearch: 'moderate',
    videoEmbeddable: 'true', relevanceLanguage: LANGUAGE_CODES[request.language] || 'es'
  });
  const normalizedPriority = priorities.map(normalize_);
  const items = (response.items || []).filter(item => item.id && item.id.videoId).map((item,index) => {
    const channel = item.snippet.channelTitle || '';
    const normalizedChannel = normalize_(channel);
    let priority = normalizedPriority.findIndex(name => normalizedChannel === name || normalizedChannel.includes(name) || name.includes(normalizedChannel));
    if (priority < 0) priority = 999;
    return {
      title: item.snippet.title || request.title,
      channel,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      priority,
      relevance: index
    };
  });
  items.sort((a,b) => a.priority - b.priority || a.relevance - b.relevance);
  const selected = [];
  const seen = {};
  items.forEach(item => {
    if (selected.length >= 3 || seen[item.url]) return;
    seen[item.url] = true;
    selected.push(item);
  });
  return selected;
}

function getPriorities_(language) {
  const cache = CacheService.getScriptCache();
  const key = `priorities:${language}`;
  const stored = cache.get(key);
  if (stored) return JSON.parse(stored);
  const sheet = spreadsheet_().getSheetByName(PRIORITIES_SHEET);
  const rows = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,3).getDisplayValues() : [];
  const list = rows.filter(row => row[0] === language).sort((a,b) => Number(a[1])-Number(b[1])).map(row => row[2]).filter(Boolean);
  cache.put(key, JSON.stringify(list), 300);
  return list;
}

function getRequestStatus_(id) {
  if (!id) return {found:false};
  const sheet = spreadsheet_().getSheetByName(REQUESTS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return {found:false};
  const found = sheet.getRange(2,3,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();
  if (!found) return {found:false};
  return {found:true, requestId:id, status:sheet.getRange(found.getRow(),2).getDisplayValue()};
}

function validate_(request) {
  if (!request.id || !request.singer || !request.title || !request.artist || !request.language) throw new Error('Faltan datos obligatorios.');
  if (!Object.prototype.hasOwnProperty.call(LANGUAGE_CODES, request.language)) throw new Error('Idioma no válido.');
}

function clean_(value, max) { return String(value || '').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max); }
function normalize_(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9а-яё]+/gi,' ').trim(); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Guest Star').addItem('Preparar hojas','setupProject').addItem('Probar búsqueda','testSearch').addItem('Vaciar caché de prioridades','clearPriorityCache').addToUi();
}

function clearPriorityCache() { CacheService.getScriptCache().removeAll(Object.keys(LANGUAGE_CODES).map(language => `priorities:${language}`)); }
function testSearch() { Logger.log(searchKaraoke_({title:'Imagine',artist:'John Lennon',language:'Inglés'})); }

function setupProject() {
  const book = spreadsheet_();
  let requests = book.getSheetByName(REQUESTS_SHEET);
  if (!requests) requests = book.insertSheet(REQUESTS_SHEET);
  requests.clear();
  requests.getRange(1,1,1,HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#edeff3');
  requests.setFrozenRows(1);
  requests.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  requests.getRange(1,1,1,HEADERS.length).createFilter();
  let priorities = book.getSheetByName(PRIORITIES_SHEET);
  if (!priorities) priorities = book.insertSheet(PRIORITIES_SHEET);
  priorities.clear();
  const rows = [['Idioma','Prioridad','Canal']];
  Object.keys(DEFAULT_PRIORITIES).forEach(language => DEFAULT_PRIORITIES[language].forEach((channel,index) => rows.push([language,index+1,channel])));
  priorities.getRange(1,1,rows.length,3).setValues(rows);
  priorities.getRange(1,1,1,3).setFontWeight('bold').setBackground('#edeff3');
  priorities.setFrozenRows(1);
  priorities.autoResizeColumns(1,3);
  clearPriorityCache();
}

function ensureSheets_() {
  const book = spreadsheet_();
  if (!book.getSheetByName(REQUESTS_SHEET) || !book.getSheetByName(PRIORITIES_SHEET)) setupProject();
}
