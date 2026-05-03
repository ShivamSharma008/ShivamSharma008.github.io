/**
 * Exporter – writes Excel, PDF, HTML, and Word reports.
 * All formats include the dynamic "Recorded By" footer.
 * SHA-256 hashes are kept internal (hidden Manifest sheet in Excel) and
 * never shown in user-facing output.
 *
 * Designed & Developed by Shivam Sharma
 */
const fs = require('fs');
const path = require('path');

const FOOTER_LINE_1 = (tester) => `Test Evidence Recorded By: ${tester}`;
const FOOTER_LINE_2 = 'Generated Using: Smart Test Evidence Recorder';
const FOOTER_LINE_3 = 'Designed & Developed by Shivam Sharma';

function computeSummary(steps) {
  const total = steps.length;
  const by = (s) => steps.filter(x => x.status === s).length;
  const passed = by('Pass'), failed = by('Fail'), blocked = by('Blocked'), notRun = by('Not Run');
  const passPct = total ? Math.round((passed / total) * 100) : 0;
  return { total, passed, failed, blocked, notRun, passPct };
}

class Exporter {
  async export(format, filePath, meta, steps) {
    switch (format) {
      case 'xlsx': return this._excel(filePath, meta, steps);
      case 'pdf':  return this._pdf(filePath, meta, steps);
      case 'html': return this._html(filePath, meta, steps);
      case 'docx': return this._docx(filePath, meta, steps);
      default: throw new Error(`Unsupported format: ${format}`);
    }
  }

  async _excel(filePath, meta, steps) {
    const ExcelJS = require('exceljs');
    const wb = new ExcelJS.Workbook();
    wb.creator = meta.testerName;
    wb.created = new Date();

    const summary = computeSummary(steps);

    // ---- Summary sheet ----
    const ss = wb.addWorksheet('Summary');
    ss.columns = [{ width: 28 }, { width: 60 }];
    const rows = [
      ['Project', meta.project],
      ['Test Case ID', meta.testCaseId],
      ['Test Case Title', meta.testCaseTitle],
      ['Environment', meta.environment],
      ['Recorded By', meta.testerName],
      ['Host', meta.hostname],
      ['OS', meta.osInfo],
      ['Started At', meta.startedAt],
      ['Ended At', meta.endedAt || new Date().toISOString()],
      [],
      ['Total Steps', summary.total],
      ['Passed', summary.passed],
      ['Failed', summary.failed],
      ['Blocked', summary.blocked],
      ['Not Run', summary.notRun],
      ['Pass %', `${summary.passPct}%`]
    ];
    rows.forEach(r => ss.addRow(r));
    ss.getColumn(1).font = { bold: true };

    // ---- Steps sheet ----
    const sh = wb.addWorksheet('Steps');
    sh.columns = [
      { header: '#',           key: 'index',       width: 6 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Expected',    key: 'expected',    width: 30 },
      { header: 'Actual',      key: 'actual',      width: 30 },
      { header: 'Status',      key: 'status',      width: 12 },
      { header: 'Captured At', key: 'capturedAt',  width: 22 },
      { header: 'Screenshot',  key: 'screenshot',  width: 50 }
    ];
    sh.getRow(1).font = { bold: true };
    sh.views = [{ state: 'frozen', ySplit: 1 }];

    for (const s of steps) {
      const row = sh.addRow({
        index: s.index,
        description: s.description,
        expected: s.expected,
        actual: s.actual,
        status: s.status,
        capturedAt: s.capturedAt,
        screenshot: ''
      });
      row.height = 90;
      const colour = ({ Pass: 'FFC6EFCE', Fail: 'FFFFC7CE', Blocked: 'FFFFEB9C', 'Not Run': 'FFEFEFEF' })[s.status];
      if (colour) row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colour } };

      if (s.screenshotPath && fs.existsSync(s.screenshotPath)) {
        const imgId = wb.addImage({ filename: s.screenshotPath, extension: 'png' });
        sh.addImage(imgId, {
          tl: { col: 6, row: row.number - 1 },
          ext: { width: 320, height: 110 }
        });
      }
    }

    // ---- Hash manifest sheet (hidden — internal integrity only) ----
    const hs = wb.addWorksheet('Manifest');
    hs.state = 'veryHidden';
    hs.columns = [
      { header: 'Step #', key: 'i', width: 8 },
      { header: 'File',   key: 'f', width: 60 },
      { header: 'SHA-256', key: 'h', width: 70 }
    ];
    hs.getRow(1).font = { bold: true };
    steps.forEach(s => hs.addRow({ i: s.index, f: s.screenshotPath, h: s.screenshotHash }));

    // ---- Footer sheet ----
    const fs1 = wb.addWorksheet('About');
    fs1.addRow([FOOTER_LINE_1(meta.testerName)]);
    fs1.addRow([FOOTER_LINE_2]);
    fs1.addRow([FOOTER_LINE_3]);

    await wb.xlsx.writeFile(filePath);
    return { filePath, summary };
  }

  async _pdf(filePath, meta, steps) {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const summary = computeSummary(steps);

    doc.fontSize(18).text('Test Evidence Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10);
    const hdr = [
      ['Project', meta.project], ['Test Case', `${meta.testCaseId}  ${meta.testCaseTitle || ''}`],
      ['Environment', meta.environment], ['Recorded By', meta.testerName],
      ['Host / OS', `${meta.hostname} — ${meta.osInfo}`],
      ['Started', meta.startedAt], ['Ended', meta.endedAt || new Date().toISOString()],
      ['Pass %', `${summary.passPct}% (${summary.passed}/${summary.total})`]
    ];
    hdr.forEach(([k, v]) => doc.text(`${k}: `, { continued: true }).font('Helvetica-Bold').text(String(v)).font('Helvetica'));

    for (const s of steps) {
      doc.addPage();
      doc.fontSize(13).font('Helvetica-Bold').text(`Step ${s.index} — ${s.status}`);
      doc.moveDown(0.3).fontSize(10).font('Helvetica');
      doc.text(`Description: ${s.description}`);
      doc.text(`Expected: ${s.expected}`);
      doc.text(`Actual: ${s.actual}`);
      doc.text(`Captured At: ${s.capturedAt}`);
      if (s.screenshotPath && fs.existsSync(s.screenshotPath)) {
        try { doc.moveDown(0.5).image(s.screenshotPath, { fit: [500, 380], align: 'center' }); } catch { /* ignore */ }
      }
    }

    // Footer on last page
    doc.addPage();
    doc.fontSize(10).text(FOOTER_LINE_1(meta.testerName));
    doc.text(FOOTER_LINE_2);
    doc.text(FOOTER_LINE_3);

    doc.end();
    await new Promise((res, rej) => { stream.on('finish', res); stream.on('error', rej); });
    return { filePath, summary };
  }

  async _html(filePath, meta, steps) {
    const summary = computeSummary(steps);
    const escape = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const imgTag = (p) => {
      if (!p || !fs.existsSync(p)) return '';
      const b64 = fs.readFileSync(p).toString('base64');
      return `<img alt="screenshot" src="data:image/png;base64,${b64}" />`;
    };
    const stepRows = steps.map(s => `
      <tr class="status-${escape(s.status).toLowerCase().replace(/\s+/g, '-')}">
        <td>${s.index}</td>
        <td>${escape(s.description)}</td>
        <td>${escape(s.expected)}</td>
        <td>${escape(s.actual)}</td>
        <td><strong>${escape(s.status)}</strong></td>
        <td>${escape(s.capturedAt)}</td>
        <td>${imgTag(s.screenshotPath)}</td>
      </tr>`).join('');

    const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Test Evidence — ${escape(meta.testCaseId)}</title>
<style>
  body{font-family:Segoe UI,Helvetica,Arial,sans-serif;margin:24px;color:#222}
  h1{margin:0 0 8px}
  .meta{display:grid;grid-template-columns:200px 1fr;gap:6px 16px;margin:16px 0;font-size:14px}
  .meta div:nth-child(odd){font-weight:600;color:#555}
  table{border-collapse:collapse;width:100%;font-size:13px;margin-top:16px}
  th,td{border:1px solid #ddd;padding:8px;vertical-align:top}
  th{background:#f4f4f4;text-align:left}
   img{max-width:420px;border:1px solid #ccc}
   .status-pass{background:#eaf7ea}.status-fail{background:#fdecec}
  .status-blocked{background:#fff7da}.status-not-run{background:#f7f7f7}
  footer{margin-top:24px;padding-top:12px;border-top:1px solid #ccc;font-size:12px;color:#555}
</style></head>
<body>
  <h1>Test Evidence Report</h1>
  <div class="meta">
    <div>Project</div><div>${escape(meta.project)}</div>
    <div>Test Case</div><div>${escape(meta.testCaseId)} — ${escape(meta.testCaseTitle)}</div>
    <div>Environment</div><div>${escape(meta.environment)}</div>
    <div>Recorded By</div><div>${escape(meta.testerName)}</div>
    <div>Host / OS</div><div>${escape(meta.hostname)} — ${escape(meta.osInfo)}</div>
    <div>Started</div><div>${escape(meta.startedAt)}</div>
    <div>Ended</div><div>${escape(meta.endedAt || new Date().toISOString())}</div>
    <div>Summary</div><div>${summary.passed} Passed · ${summary.failed} Failed · ${summary.blocked} Blocked · ${summary.notRun} Not Run · <strong>${summary.passPct}% pass</strong></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Description</th><th>Expected</th><th>Actual</th><th>Status</th><th>Captured</th><th>Screenshot</th></tr></thead>
    <tbody>${stepRows}</tbody>
  </table>
  <footer>
    <div>${escape(FOOTER_LINE_1(meta.testerName))}</div>
    <div>${escape(FOOTER_LINE_2)}</div>
    <div>${escape(FOOTER_LINE_3)}</div>
  </footer>
</body></html>`;
    fs.writeFileSync(filePath, html, 'utf8');
    return { filePath, summary };
  }

  async _docx(filePath, meta, steps) {
    const docx = require('docx');
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            WidthType, AlignmentType, HeadingLevel, BorderStyle, ImageRun } = docx;

    const summary = computeSummary(steps);

    const headerRows = [
      ['Project', meta.project],
      ['Test Case', `${meta.testCaseId} — ${meta.testCaseTitle || ''}`],
      ['Environment', meta.environment],
      ['Recorded By', meta.testerName],
      ['Host / OS', `${meta.hostname} — ${meta.osInfo}`],
      ['Started', meta.startedAt],
      ['Ended', meta.endedAt || new Date().toISOString()],
      ['Summary', `${summary.passed} Passed · ${summary.failed} Failed · ${summary.blocked} Blocked · ${summary.notRun} Not Run · ${summary.passPct}% pass`],
    ];

    const children = [];

    // Title
    children.push(new Paragraph({
      text: 'Test Evidence Report',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }));

    // Meta info
    for (const [label, value] of headerRows) {
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `${label}: `, bold: true, size: 22 }),
          new TextRun({ text: String(value || ''), size: 22 })
        ]
      }));
    }

    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));

    // Step-wise sections
    for (const s of steps) {
      children.push(new Paragraph({
        text: `Step ${s.index} — ${s.status}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      }));

      const fields = [
        ['Description', s.description],
        ['Expected', s.expected],
        ['Actual', s.actual],
        ['Captured At', s.capturedAt]
      ];
      for (const [k, v] of fields) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `${k}: `, bold: true, size: 20 }),
            new TextRun({ text: String(v || ''), size: 20 })
          ]
        }));
      }

      // Embed screenshot
      if (s.screenshotPath && fs.existsSync(s.screenshotPath)) {
        try {
          const imgBuf = fs.readFileSync(s.screenshotPath);
          children.push(new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new ImageRun({
                data: imgBuf,
                transformation: { width: 500, height: 180 },
                type: 'png'
              })
            ]
          }));
        } catch { /* skip image on error */ }
      }
    }

    // Footer
    children.push(new Paragraph({ text: '', spacing: { before: 300 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: FOOTER_LINE_1(meta.testerName), size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: FOOTER_LINE_2, size: 20, color: '888888' })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: FOOTER_LINE_3, size: 20, color: '888888', italics: true })] }));

    const doc = new Document({
      creator: meta.testerName,
      title: `Test Evidence — ${meta.testCaseId}`,
      description: FOOTER_LINE_2,
      sections: [{ children }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);
    return { filePath, summary };
  }
}

module.exports = Exporter;

