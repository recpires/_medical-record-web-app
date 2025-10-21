// This file manages the navigation flow between pages, ensuring users progress through each required step.

(() => {
  const PAGES = [
    "index.html",
    "patient-data.html",
    "clinical-history.html",
    "surgical-planning.html",
    "surgical-checklist.html",
    "who-safe-surgery-checklist.html",
    "rpa-recovery.html",
    "safe-transfer-room.html",
    "room-312a-safety-protocol.html",
    "automatic-notification.html",
    "discharge-report.html",
    "finalize.html",
  ];

  function currentPage() {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function pageIndex(name) {
    return PAGES.indexOf(name);
  }

  function nextPage(name) {
    const i = pageIndex(name);
    return i >= 0 && i < PAGES.length - 1
      ? PAGES[i + 1]
      : PAGES[PAGES.length - 1];
  }

  function firstIncompleteBefore(index) {
    for (let i = 0; i < index; i++) {
      const p = PAGES[i];
      if (!window.storage.isDone(p)) return p;
    }
    return null;
  }

  async function handleSaveAndNext(evt) {
    evt.preventDefault();
    const btn = evt.currentTarget;
    const form = btn.closest("form");
    const cur = currentPage();

    if (form) {
      if (!form.reportValidity()) return;
      try {
        await window.storage.saveForm(form, cur);
        window.storage.markDone(cur);
      } catch (e) {
        console.error("Erro ao salvar o formulário:", e);
        return;
      }
    } else {
      // Mesmo sem form, marca etapa como feita
      window.storage.markDone(cur);
    }

    window.location.href = nextPage(cur);
  }

  function handleNewRecord(evt) {
    evt.preventDefault();
    const proceed = window.confirm('Iniciar novo prontuário? Isso limpará os dados salvos.');
    if (!proceed) return;
    try {
      window.storage.clearAllData();
    } catch (e) {
      console.warn('Falha ao limpar dados:', e);
    }
    window.location.href = PAGES[0];
  }

  function enforceSequence() {
    const cur = currentPage();
    const idx = pageIndex(cur);
    if (idx <= 0) return;

    const missing = firstIncompleteBefore(idx);
    if (missing) {
      window.location.replace(missing);
    }
  }

  function init() {
    enforceSequence();
    document.querySelectorAll('[data-save-next]').forEach((btn) => {
      btn.addEventListener('click', handleSaveAndNext);
    });
    document.querySelectorAll('[data-new-record]').forEach((btn) => {
      btn.addEventListener('click', handleNewRecord);
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();