// path: pdf-cli/cli.js

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const minimist = require("minimist");

function generatePDF({ name, id }) {
  if (!name || !id) {
    console.error("❌ لازم تدخل name و id");
    process.exit(1);
  }

  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `doc_${Date.now()}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // Header
  doc.fontSize(20).text("وثيقة مؤقتة", { align: "center" });
  doc.moveDown(2);

  // Body
  doc.fontSize(14);
  doc.text(`الاسم: ${name}`);
  doc.text(`رقم الوثيقة: ${id}`);
  doc.text(`التاريخ: ${new Date().toLocaleDateString()}`);

  doc.moveDown();
  doc.text(
    "هذه وثيقة مؤقتة صالحة لحين إصدار الوثيقة الرسمية النهائية.",
    { align: "right" }
  );

  doc.end();

  stream.on("finish", () => {
    console.log("✅ تم إنشاء PDF:");
    console.log(filePath);
  });
}

// CLI
const args = minimist(process.argv.slice(2));

if (args._[0] === "generate") {
  generatePDF({
    name: args.name,
    id: args.id,
  });
} else {
  console.log(`
📌 الاستخدام:

node cli.js generate --name="أحمد علي" --id="TMP-123"
`);
}