const config = window.GSTAR_CONFIG || {};
const steps = {
  language: document.querySelector('#language-step'),
  form: document.querySelector('#request-form'),
  success: document.querySelector('#success-step')
};

const languages = {
  en: {flag:'🇺🇸', native:'English', backend:'Inglés'},
  es: {flag:'🇪🇸', native:'Español', backend:'Español'},
  fr: {flag:'🇫🇷', native:'Français', backend:'Francés'},
  it: {flag:'🇮🇹', native:'Italiano', backend:'Italiano'},
  de: {flag:'🇩🇪', native:'Deutsch', backend:'Alemán'},
  ru: {flag:'🇷🇺', native:'Русский', backend:'Ruso'},
  pt: {flag:'🇵🇹', native:'Português', backend:'Portugués'}
};

const copy = {
  en: {
    languageEyebrow:'Song language', languageTitle:'What language will you sing in?',
    languageIntro:'Choose a language before completing your request. This helps us find the best karaoke version and lets the host know your selection.',
    languageNames:{es:'Spanish',en:'English',fr:'French',it:'Italian',de:'German',ru:'Russian',pt:'Portuguese'},
    changeLanguage:'Change language', requestEyebrow:'Live experience', requestTitle:'Ready to sing?',
    requestIntro:'Request your favorite song and get ready to shine on stage.', singerLabel:'Your name',
    singerPlaceholder:'What should we call you?', titleLabel:'Song title', titlePlaceholder:'What would you like to sing?',
    artistLabel:'Artist', artistPlaceholder:'Who performs it?', noteLabel:'Comment', notePlaceholder:'Optional dedication or note...',
    submit:'Submit request', sending:'Sending…', miniOne:'Fill the form', miniTwo:'Wait for your turn', miniThree:'Sing and enjoy!',
    successEyebrow:'Request received', successTitle:"You're on the list!", successIntro:'The host received your song and will see three recommended karaoke versions.',
    codeLabel:'Code', newRequest:'Request another song', missingConfig:'The request form is not connected to the host yet.',
    receiptError:'We could not confirm that the host received your request. Please try again.', networkError:'We could not send your request. Check your connection and try again.'
  },
  es: {
    languageEyebrow:'Idioma de la canción', languageTitle:'¿En qué idioma cantarás?',
    languageIntro:'Elige un idioma antes de completar tu solicitud. Esto nos ayuda a encontrar la mejor versión de karaoke y le indica tu selección al host.',
    languageNames:{es:'Español',en:'Inglés',fr:'Francés',it:'Italiano',de:'Alemán',ru:'Ruso',pt:'Portugués'},
    changeLanguage:'Cambiar idioma', requestEyebrow:'Experiencia en vivo', requestTitle:'¿Listo para cantar?',
    requestIntro:'Pide tu canción favorita y prepárate para brillar en el escenario.', singerLabel:'Tu nombre',
    singerPlaceholder:'¿Cómo quieres que te llamemos?', titleLabel:'Título de la canción', titlePlaceholder:'¿Qué te gustaría cantar?',
    artistLabel:'Artista', artistPlaceholder:'¿Quién la interpreta?', noteLabel:'Comentario', notePlaceholder:'Dedicatoria o nota opcional...',
    submit:'Enviar solicitud', sending:'Enviando…', miniOne:'Completa el formulario', miniTwo:'Espera tu turno', miniThree:'¡Canta y disfruta!',
    successEyebrow:'Solicitud recibida', successTitle:'¡Ya estás en la lista!', successIntro:'El host recibió tu canción y verá tres versiones de karaoke recomendadas.',
    codeLabel:'Código', newRequest:'Enviar otra canción', missingConfig:'El formulario todavía no está conectado al host.',
    receiptError:'No pudimos confirmar que el host recibió la solicitud. Inténtalo otra vez.', networkError:'No pudimos enviar la solicitud. Revisa tu conexión e inténtalo otra vez.'
  },
  fr: {
    languageEyebrow:'Langue de la chanson', languageTitle:'Dans quelle langue allez-vous chanter ?',
    languageIntro:'Choisissez une langue avant de compléter votre demande. Cela nous aide à trouver la meilleure version karaoké et informe le présentateur de votre choix.',
    languageNames:{es:'Espagnol',en:'Anglais',fr:'Français',it:'Italien',de:'Allemand',ru:'Russe',pt:'Portugais'},
    changeLanguage:'Changer de langue', requestEyebrow:'Expérience en direct', requestTitle:'Prêt à chanter ?',
    requestIntro:'Demandez votre chanson préférée et préparez-vous à briller sur scène.', singerLabel:'Votre nom',
    singerPlaceholder:'Comment souhaitez-vous être appelé ?', titleLabel:'Titre de la chanson', titlePlaceholder:'Que souhaitez-vous chanter ?',
    artistLabel:'Artiste', artistPlaceholder:'Qui interprète cette chanson ?', noteLabel:'Commentaire', notePlaceholder:'Dédicace ou remarque facultative...',
    submit:'Envoyer la demande', sending:'Envoi…', miniOne:'Remplissez le formulaire', miniTwo:'Attendez votre tour', miniThree:'Chantez et amusez-vous !',
    successEyebrow:'Demande reçue', successTitle:'Vous êtes sur la liste !', successIntro:'Le présentateur a reçu votre chanson et verra trois versions karaoké recommandées.',
    codeLabel:'Code', newRequest:'Demander une autre chanson', missingConfig:"Le formulaire n'est pas encore connecté au présentateur.",
    receiptError:"Nous n'avons pas pu confirmer la réception. Veuillez réessayer.", networkError:"Impossible d'envoyer la demande. Vérifiez votre connexion et réessayez."
  },
  it: {
    languageEyebrow:'Lingua del brano', languageTitle:'In quale lingua canterai?',
    languageIntro:'Scegli una lingua prima di completare la richiesta. Ci aiuta a trovare la versione karaoke migliore e informa il presentatore della tua scelta.',
    languageNames:{es:'Spagnolo',en:'Inglese',fr:'Francese',it:'Italiano',de:'Tedesco',ru:'Russo',pt:'Portoghese'},
    changeLanguage:'Cambia lingua', requestEyebrow:'Esperienza dal vivo', requestTitle:'Pronto a cantare?',
    requestIntro:'Richiedi la tua canzone preferita e preparati a brillare sul palco.', singerLabel:'Il tuo nome',
    singerPlaceholder:'Come vuoi che ti chiamiamo?', titleLabel:'Titolo della canzone', titlePlaceholder:'Cosa vorresti cantare?',
    artistLabel:'Artista', artistPlaceholder:'Chi la interpreta?', noteLabel:'Commento', notePlaceholder:'Dedica o nota facoltativa...',
    submit:'Invia richiesta', sending:'Invio…', miniOne:'Compila il modulo', miniTwo:'Aspetta il tuo turno', miniThree:'Canta e divertiti!',
    successEyebrow:'Richiesta ricevuta', successTitle:'Sei nella lista!', successIntro:'Il presentatore ha ricevuto la tua canzone e vedrà tre versioni karaoke consigliate.',
    codeLabel:'Codice', newRequest:"Richiedi un'altra canzone", missingConfig:'Il modulo non è ancora collegato al presentatore.',
    receiptError:'Non è stato possibile confermare la ricezione. Riprova.', networkError:'Impossibile inviare la richiesta. Controlla la connessione e riprova.'
  },
  de: {
    languageEyebrow:'Sprache des Songs', languageTitle:'In welcher Sprache wirst du singen?',
    languageIntro:'Wähle eine Sprache, bevor du deine Anfrage abschließt. So finden wir die beste Karaoke-Version und informieren den Host über deine Auswahl.',
    languageNames:{es:'Spanisch',en:'Englisch',fr:'Französisch',it:'Italienisch',de:'Deutsch',ru:'Russisch',pt:'Portugiesisch'},
    changeLanguage:'Sprache ändern', requestEyebrow:'Live-Erlebnis', requestTitle:'Bereit zum Singen?',
    requestIntro:'Wünsche dir deinen Lieblingssong und mach dich bereit, auf der Bühne zu glänzen.', singerLabel:'Dein Name',
    singerPlaceholder:'Wie sollen wir dich nennen?', titleLabel:'Songtitel', titlePlaceholder:'Was möchtest du singen?',
    artistLabel:'Interpret', artistPlaceholder:'Wer singt den Song?', noteLabel:'Kommentar', notePlaceholder:'Optionale Widmung oder Notiz...',
    submit:'Anfrage senden', sending:'Wird gesendet…', miniOne:'Formular ausfüllen', miniTwo:'Auf deinen Auftritt warten', miniThree:'Singen und genießen!',
    successEyebrow:'Anfrage erhalten', successTitle:'Du bist auf der Liste!', successIntro:'Der Host hat deinen Song erhalten und sieht drei empfohlene Karaoke-Versionen.',
    codeLabel:'Code', newRequest:'Weiteren Song anfragen', missingConfig:'Das Formular ist noch nicht mit dem Host verbunden.',
    receiptError:'Der Empfang konnte nicht bestätigt werden. Bitte versuche es erneut.', networkError:'Die Anfrage konnte nicht gesendet werden. Prüfe deine Verbindung und versuche es erneut.'
  },
  ru: {
    languageEyebrow:'Язык песни', languageTitle:'На каком языке вы будете петь?',
    languageIntro:'Выберите язык перед отправкой заявки. Это поможет найти лучшую караоке-версию и сообщит ведущему о вашем выборе.',
    languageNames:{es:'Испанский',en:'Английский',fr:'Французский',it:'Итальянский',de:'Немецкий',ru:'Русский',pt:'Португальский'},
    changeLanguage:'Изменить язык', requestEyebrow:'Прямой эфир', requestTitle:'Готовы петь?',
    requestIntro:'Закажите любимую песню и приготовьтесь блистать на сцене.', singerLabel:'Ваше имя',
    singerPlaceholder:'Как к вам обращаться?', titleLabel:'Название песни', titlePlaceholder:'Что вы хотите спеть?',
    artistLabel:'Исполнитель', artistPlaceholder:'Кто исполняет эту песню?', noteLabel:'Комментарий', notePlaceholder:'Необязательное посвящение или заметка...',
    submit:'Отправить заявку', sending:'Отправка…', miniOne:'Заполните форму', miniTwo:'Дождитесь своей очереди', miniThree:'Пойте и наслаждайтесь!',
    successEyebrow:'Заявка получена', successTitle:'Вы в списке!', successIntro:'Ведущий получил вашу песню и увидит три рекомендованные караоке-версии.',
    codeLabel:'Код', newRequest:'Заказать другую песню', missingConfig:'Форма пока не подключена к ведущему.',
    receiptError:'Не удалось подтвердить получение заявки. Попробуйте ещё раз.', networkError:'Не удалось отправить заявку. Проверьте подключение и попробуйте ещё раз.'
  },
  pt: {
    languageEyebrow:'Idioma da música', languageTitle:'Em que idioma você vai cantar?',
    languageIntro:'Escolha um idioma antes de concluir seu pedido. Isso nos ajuda a encontrar a melhor versão de karaokê e informa sua escolha ao apresentador.',
    languageNames:{es:'Espanhol',en:'Inglês',fr:'Francês',it:'Italiano',de:'Alemão',ru:'Russo',pt:'Português'},
    changeLanguage:'Mudar idioma', requestEyebrow:'Experiência ao vivo', requestTitle:'Pronto para cantar?',
    requestIntro:'Peça sua música favorita e prepare-se para brilhar no palco.', singerLabel:'Seu nome',
    singerPlaceholder:'Como você quer ser chamado?', titleLabel:'Título da música', titlePlaceholder:'O que você gostaria de cantar?',
    artistLabel:'Artista', artistPlaceholder:'Quem canta essa música?', noteLabel:'Comentário', notePlaceholder:'Dedicatória ou observação opcional...',
    submit:'Enviar pedido', sending:'Enviando…', miniOne:'Preencha o formulário', miniTwo:'Espere sua vez', miniThree:'Cante e divirta-se!',
    successEyebrow:'Pedido recebido', successTitle:'Você está na lista!', successIntro:'O apresentador recebeu sua música e verá três versões de karaokê recomendadas.',
    codeLabel:'Código', newRequest:'Pedir outra música', missingConfig:'O formulário ainda não está conectado ao apresentador.',
    receiptError:'Não foi possível confirmar o recebimento. Tente novamente.', networkError:'Não foi possível enviar o pedido. Verifique sua conexão e tente novamente.'
  }
};

let currentLocale = 'en';

function translate(key) {
  return (copy[currentLocale] && copy[currentLocale][key]) || copy.en[key] || key;
}

function applyLocale(locale) {
  currentLocale = languages[locale] ? locale : 'en';
  const language = languages[currentLocale];
  document.documentElement.lang = currentLocale;
  document.title = currentLocale === 'en' ? 'Karaoke Request — Guest Star Experience' : `${translate('requestTitle')} — Guest Star Experience`;
  document.querySelector('meta[name="description"]').content = translate('requestIntro');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = translate(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = translate(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-language-name]').forEach(node => { node.textContent = copy[currentLocale].languageNames[node.dataset.languageName]; });
  document.querySelector('#locale-flag').textContent = language.flag;
  document.querySelector('#locale-name').textContent = language.native;
  document.querySelector('#language-flag').textContent = language.flag;
  document.querySelector('#language-name').textContent = language.native;
  document.querySelector('#language-input').value = language.backend;
}

function show(name) {
  Object.entries(steps).forEach(([key, element]) => element.classList.toggle('active', key === name));
  document.body.dataset.view = name;
  window.scrollTo({top:0, behavior:'smooth'});
}

function selectLanguage(locale) {
  const selected = document.querySelector(`.language[data-locale="${locale}"]`);
  document.querySelectorAll('.language').forEach(item => item.classList.toggle('selected', item === selected));
  if (selected) selected.classList.add('choosing');
  setTimeout(() => {
    applyLocale(locale);
    show('form');
    if (selected) selected.classList.remove('choosing');
  }, 280);
}

function createId() {
  const token = crypto.getRandomValues(new Uint32Array(2));
  return `GS-${Date.now().toString(36).toUpperCase()}-${token[0].toString(36).slice(0,5).toUpperCase()}`;
}

document.querySelectorAll('.language').forEach(button => button.addEventListener('click', () => selectLanguage(button.dataset.locale)));

document.querySelectorAll('[data-locale-option]').forEach(button => button.addEventListener('click', () => {
  applyLocale(button.dataset.localeOption);
  document.querySelector('#locale-control').removeAttribute('open');
}));

document.addEventListener('click', event => {
  const chooser = document.querySelector('#locale-control');
  if (!chooser.contains(event.target)) chooser.removeAttribute('open');
});

document.querySelector('#back-button').addEventListener('click', () => {
  applyLocale('en');
  document.querySelectorAll('.language').forEach(item => item.classList.remove('selected'));
  show('language');
});

document.querySelector('#new-request').addEventListener('click', () => {
  steps.form.reset();
  document.querySelectorAll('.language').forEach(item => item.classList.remove('selected'));
  applyLocale('en');
  show('language');
});

function jsonpStatus(requestId) {
  return new Promise((resolve, reject) => {
    const callback = `gstar_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const timer = setTimeout(() => finish(new Error('timeout')), 7000);
    const finish = (error, data) => {
      clearTimeout(timer);
      delete window[callback];
      script.remove();
      error ? reject(error) : resolve(data);
    };
    window[callback] = data => finish(null, data);
    script.onerror = () => finish(new Error('network'));
    const url = new URL(config.appsScriptUrl);
    url.searchParams.set('action', 'status');
    url.searchParams.set('requestId', requestId);
    url.searchParams.set('callback', callback);
    url.searchParams.set('_', Date.now());
    script.src = url.toString();
    document.body.appendChild(script);
  });
}

async function waitForReceipt(requestId) {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      const response = await jsonpStatus(requestId);
      if (response.found) return response;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 1100 + attempt * 120));
  }
  throw new Error(translate('receiptError'));
}

steps.form.addEventListener('submit', async event => {
  event.preventDefault();
  const error = document.querySelector('#form-error');
  const submit = steps.form.querySelector('.submit');
  error.textContent = '';
  if (!steps.form.reportValidity()) return;
  if (!config.appsScriptUrl || config.appsScriptUrl.includes('REPLACE_')) {
    error.textContent = translate('missingConfig');
    return;
  }
  const requestId = createId();
  document.querySelector('#request-id').value = requestId;
  const body = new URLSearchParams(new FormData(steps.form));
  submit.disabled = true;
  submit.querySelector('span').textContent = translate('sending');
  try {
    await fetch(config.appsScriptUrl, {method:'POST', mode:'no-cors', body});
    await waitForReceipt(requestId);
    document.querySelector('#success-id').textContent = requestId;
    show('success');
  } catch (problem) {
    error.textContent = problem.message || translate('networkError');
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = translate('submit');
  }
});

applyLocale('en');
show('language');
