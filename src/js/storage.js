// API de armazenamento e hidratação de formulários (compatível com <script src>)
(function () {
  function pageFromPath(pathname) {
    const parts = pathname.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function pageKey(name) {
    const page = name || pageFromPath(window.location.pathname);
    return `form:${page}`;
  }

  function doneKey(name) {
    return `done:${name}`;
  }

  function serializeForm(form) {
    const data = {};
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((el) => {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    });
    return data;
  }

  function hydrateForm(form, data) {
    if (!data) return;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((el) => {
      if (!el.name) return;
      if (!(el.name in data)) return;
      const val = data[el.name];
      if (el.type === 'checkbox') {
        el.checked = !!val;
      } else if (el.type === 'radio') {
        el.checked = el.value === val;
      } else {
        el.value = val ?? '';
      }
    });
  }

  const StorageAPI = {
    // Key/Value genérico
    saveData(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
    getData(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    clearData(key) {
      localStorage.removeItem(key);
    },
    clearAllData() {
      localStorage.clear();
    },

    // Form helpers por página
    pageKey,
    markDone(pageName) {
      localStorage.setItem(doneKey(pageName), '1');
    },
    isDone(pageName) {
      return localStorage.getItem(doneKey(pageName)) === '1';
    },

    async saveForm(form, pageName) {
      const data = serializeForm(form);
      localStorage.setItem(pageKey(pageName), JSON.stringify(data));
      return true;
    },
    loadForm(form, pageName) {
      try {
        const raw = localStorage.getItem(pageKey(pageName));
        if (!raw) return;
        hydrateForm(form, JSON.parse(raw));
      } catch {}
    }
  };

  // Expõe no escopo global para uso via <script>
  window.storage = StorageAPI;

  // Auto-hidratar quando existir formulário na página
  window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) window.storage.loadForm(form);
  });
})();