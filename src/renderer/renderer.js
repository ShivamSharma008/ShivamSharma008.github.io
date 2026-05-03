/* eslint-env browser */
const $ = (id) => document.getElementById(id);

async function init() {
  const tester = await window.ster.getDefaultTester();
  $('testerName').value = tester || '';
}
init();

$('startBtn').onclick = async () => {
  const meta = {
    testerName: $('testerName').value.trim(),
    project: $('project').value.trim(),
    testCaseId: $('testCaseId').value.trim(),
    testCaseTitle: $('testCaseTitle').value.trim(),
    environment: $('environment').value
  };
  const m = await window.ster.startSession(meta);
  $('sessionInfo').textContent = `Session: ${m.sessionId.slice(0, 8)} · ${m.testerName}`;
  $('captureBtn').disabled = false;
  $('endBtn').disabled = false;
  $('startBtn').disabled = true;
};

$('captureBtn').onclick = () => window.ster.capture();

$('endBtn').onclick = async () => {
  const r = await window.ster.endSession();
  if (r && r.filePath) {
    alert(`Evidence saved:\n${r.filePath}`);
    location.reload();
  }
};

window.ster.onUpdate(({ steps, meta }) => render(steps, meta));

function render(steps, meta) {
  const container = $('stepsContainer');
  if (!steps.length) { container.className = 'empty'; container.textContent = 'No steps yet.'; return; }
  container.className = '';
  container.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Description</th><th>Expected</th><th>Actual</th><th>Status</th><th>Captured</th><th>Action</th></tr></thead>
      <tbody>
      ${steps.map(s => `
        <tr data-id="${s.id}">
          <td>${s.index}</td>
          <td><textarea rows="2" data-k="description">${escape(s.description)}</textarea></td>
          <td><textarea rows="2" data-k="expected">${escape(s.expected)}</textarea></td>
          <td><textarea rows="2" data-k="actual">${escape(s.actual)}</textarea></td>
          <td>
            <select data-k="status">
              ${['Not Run','Pass','Fail','Blocked','N/A'].map(o => `<option ${o===s.status?'selected':''}>${o}</option>`).join('')}
            </select>
            <div class="status ${s.status.replace(' ','.')}" style="margin-top:4px">${s.status}</div>
          </td>
          <td class="pill">${new Date(s.capturedAt).toLocaleTimeString()}</td>
          <td><button class="secondary" data-act="del">🗑</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  container.querySelectorAll('tr[data-id]').forEach(tr => {
    const id = tr.dataset.id;
    tr.querySelectorAll('[data-k]').forEach(el => {
      el.addEventListener('change', () => window.ster.updateStep(id, { [el.dataset.k]: el.value }));
      el.addEventListener('blur',   () => window.ster.updateStep(id, { [el.dataset.k]: el.value }));
    });
    tr.querySelector('[data-act="del"]').onclick = () => window.ster.deleteStep(id);
  });
}

function escape(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

