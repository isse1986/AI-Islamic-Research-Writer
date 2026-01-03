const form = document.getElementById("research-form");
const output = document.getElementById("output");
const downloadDoc = document.getElementById("download-doc");
const downloadPdf = document.getElementById("download-pdf");
const previewButton = document.getElementById("preview");
const previewDialog = document.getElementById("preview-dialog");
const previewBody = document.getElementById("preview-body");
const closePreview = document.getElementById("close-preview");

const sectionTitles = {
  introduction: "المقدمة",
  evidence: "الأدلة من القرآن والسنة",
  scholars: "أقوال العلماء والخلاف المعتبر",
  discussion: "المناقشة العلمية",
  conclusion: "الخاتمة",
  references: "المراجع المختارة",
};

const placeholderReferences = [
  "القرآن الكريم.",
  "الصحيحان: صحيح البخاري وصحيح مسلم.",
  "ابن قدامة، المغني.",
  "ابن تيمية، مجموع الفتاوى.",
  "الشاطبي، الموافقات.",
];

function sanitizeText(value) {
  return value.replace(/[<>]/g, "").trim();
}

function buildResearch({ topic, level, method, goal }) {
  return `
    <h3>${sectionTitles.introduction}</h3>
    <p>
      يتناول هذا البحث موضوع <strong>${topic}</strong> وفق مستوى ${level}، مستندًا إلى ${method}.
      ويهدف البحث إلى ${goal}.
    </p>

    <h3>${sectionTitles.evidence}</h3>
    <ul>
      <li>جمع الآيات ذات الصلة بالموضوع مع بيان دلالاتها الأصولية.</li>
      <li>تخريج الأحاديث الصحيحة وربطها بمدلولاتها الشرعية.</li>
      <li>بيان وجه الاستدلال مع مراعاة القواعد الأصولية.</li>
    </ul>

    <h3>${sectionTitles.scholars}</h3>
    <ul>
      <li>عرض أقوال الأئمة الأربعة ومنهج الاستدلال لديهم.</li>
      <li>إبراز مواطن الاتفاق والخلاف المعتبر بين المذاهب.</li>
      <li>توضيح الترجيح وفق ضوابط المذهب أو منهج الترجيح المختار.</li>
    </ul>

    <h3>${sectionTitles.discussion}</h3>
    <p>
      يتم تحليل الأدلة ومناقشة الأوجه المختلفة للاستدلال، مع مراعاة مقاصد الشريعة
      وضوابط الاجتهاد، وتحديد أثر السياق المعاصر دون إصدار فتاوى في القضايا الحساسة.
    </p>

    <h3>${sectionTitles.conclusion}</h3>
    <ul>
      <li>تلخيص أبرز النتائج المتعلقة بموضوع البحث.</li>
      <li>اقتراح توصيات بحثية مستقبلية قابلة للتطوير.</li>
    </ul>

    <h3>${sectionTitles.references}</h3>
    <ol>
      ${placeholderReferences.map((ref) => `<li>${ref}</li>`).join("")}
    </ol>
  `;
}

function getFormData() {
  const topic = sanitizeText(document.getElementById("topic").value);
  const level = document.getElementById("level").value;
  const method = document.getElementById("method").value;
  const goal = sanitizeText(document.getElementById("goal").value);

  if (!topic || !goal) {
    return null;
  }

  return { topic, level, method, goal };
}

function renderOutput(data) {
  output.innerHTML = buildResearch(data);
}

function showValidationMessage() {
  const message = `<p class="muted">يرجى إدخال موضوع البحث والهدف المطلوب.</p>`;
  output.innerHTML = message;
  previewBody.innerHTML = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = getFormData();
  if (!data) {
    showValidationMessage();
    return;
  }

  renderOutput(data);
});

previewButton.addEventListener("click", () => {
  const data = getFormData();
  if (!data) {
    showValidationMessage();
    return;
  }

  previewBody.innerHTML = buildResearch(data);
  previewDialog.showModal();
});

closePreview.addEventListener("click", () => {
  previewDialog.close();
});

previewDialog.addEventListener("click", (event) => {
  if (event.target === previewDialog) {
    previewDialog.close();
  }
});

function downloadAsDoc() {
  const content = `
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>بحث شرعي</title>
      </head>
      <body>
        ${output.innerHTML}
      </body>
    </html>
  `;
  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "research.doc";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadAsPdf() {
  window.print();
}

downloadDoc.addEventListener("click", downloadAsDoc);
downloadPdf.addEventListener("click", downloadAsPdf);
