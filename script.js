// CloudPass - Bus Pass System
(function () {
  const form = document.getElementById('passForm');
  const passSection = document.getElementById('passSection');
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const newBtn = document.getElementById('newBtn');

  function generatePassNo() {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `CP-${year}-${rand}`;
  }

  function initials(name) {
    return name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'ST';
  }

  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = {
      name: document.getElementById('name').value.trim(),
      course: document.getElementById('course').value.trim(),
      college: document.getElementById('college').value.trim(),
      route: document.getElementById('route').value,
      phone: document.getElementById('phone').value.trim(),
      validity: parseInt(document.getElementById('validity').value, 10),
    };

    const now = new Date();
    const valid = new Date(now);
    valid.setMonth(valid.getMonth() + data.validity);

    document.getElementById('passNo').textContent = generatePassNo();
    document.getElementById('pName').textContent = data.name;
    document.getElementById('pCourse').textContent = data.course;
    document.getElementById('pCollege').textContent = data.college;
    document.getElementById('pRoute').textContent = data.route;
    document.getElementById('pPhone').textContent = data.phone;
    document.getElementById('pIssued').textContent = fmtDate(now);
    document.getElementById('pValid').textContent = fmtDate(valid);
    document.getElementById('avatar').textContent = initials(data.name);

    passSection.classList.remove('hidden');
    passSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  printBtn.addEventListener('click', () => window.print());

  downloadBtn.addEventListener('click', function () {
    const passNo = document.getElementById('passNo').textContent;
    const name = document.getElementById('pName').textContent;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bus Pass ${passNo}</title>
<style>
body{font-family:Arial,sans-serif;background:#0a0e1a;color:#e8ecf5;padding:40px;}
.card{max-width:500px;margin:auto;background:linear-gradient(135deg,#1a2148,#2d1b5e);
border:1px solid #6366f1;border-radius:16px;padding:24px;}
h3{margin:0 0 4px;}small{color:#8892b0;}
.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,.1);}
.row span{color:#8892b0;}.row strong{color:#fff;}
.head{display:flex;justify-content:space-between;margin-bottom:16px;}
.no{color:#06b6d4;font-family:monospace;}
</style></head><body><div class="card">
<div class="head"><div><h3>🚌 CloudPass</h3><small>Official Student Bus Pass</small></div>
<div style="text-align:right"><small>Pass No.</small><br><strong class="no">${passNo}</strong></div></div>
${[['Name','pName'],['Course','pCourse'],['College','pCollege'],['Route','pRoute'],
  ['Phone','pPhone'],['Issued','pIssued'],['Valid Until','pValid']]
  .map(([k,id])=>`<div class="row"><span>${k}</span><strong>${document.getElementById(id).textContent}</strong></div>`).join('')}
</div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BusPass_${passNo}_${name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  newBtn.addEventListener('click', function () {
    form.reset();
    passSection.classList.add('hidden');
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
  });
})();
