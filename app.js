const config = window.GSTAR_CONFIG || {};
const steps = {
  language: document.querySelector('#language-step'),
  form: document.querySelector('#request-form'),
  success: document.querySelector('#success-step')
};
const flags = {'Español':'🇪🇸','Latinoamérica':'🌎','Inglés':'🇺🇸','Francés':'🇫🇷','Italiano':'🇮🇹','Alemán':'🇩🇪','Portugués':'🇧🇷','Ruso':'🇷🇺'};

function show(name) {
  Object.entries(steps).forEach(([key, el]) => el.classList.toggle('active', key === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createId() {
  const token = crypto.getRandomValues(new Uint32Array(2));
  return `GS-${Date.now().toString(36).toUpperCase()}-${token[0].toString(36).slice(0,5).toUpperCase()}`;
}

document.querySelectorAll('.language').forEach(button => {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    document.querySelectorAll('.language').forEach(item => item.classList.toggle('selected', item === button));
    document.querySelector('#language-input').value = language;
    document.querySelector('#language-name').textContent = language;
    document.querySelector('#language-flag').textContent = flags[language] || '🎤';
    setTimeout(() => show('form'), 120);
  });
});

document.querySelector('#back-button').addEventListener('click', () => show('language'));
document.querySelector('#new-request').addEventListener('click', () => {
  steps.form.reset();
  document.querySelectorAll('.language').forEach(item => item.classList.remove('selected'));
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
  throw new Error('No pudimos confirmar que el host recibió la solicitud. Inténtalo otra vez.');
}

steps.form.addEventListener('submit', async event => {
  event.preventDefault();
  const error = document.querySelector('#form-error');
  const submit = steps.form.querySelector('.submit');
  error.textContent = '';
  if (!steps.form.reportValidity()) return;
  if (!config.appsScriptUrl || config.appsScriptUrl.includes('REPLACE_')) {
    error.textContent = 'El formulario todavía no está conectado al host.';
    return;
  }
  const requestId = createId();
  document.querySelector('#request-id').value = requestId;
  const body = new URLSearchParams(new FormData(steps.form));
  submit.disabled = true;
  submit.querySelector('span').textContent = 'Enviando…';
  try {
    await fetch(config.appsScriptUrl, { method: 'POST', mode: 'no-cors', body });
    await waitForReceipt(requestId);
    document.querySelector('#success-id').textContent = requestId;
    show('success');
  } catch (problem) {
    error.textContent = problem.message || 'No pudimos enviar la solicitud. Revisa tu conexión e inténtalo otra vez.';
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = 'Enviar solicitud';
  }
});
