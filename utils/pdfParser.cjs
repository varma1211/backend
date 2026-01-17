const fs = require("fs");
const pdfParseModule = require("pdf-parse");

// ✅ FIX: get the real function
// const pdfParse = pdfParseModule.default || pdfParseModule;

module.exports = async function parsePdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParseModule(buffer);
  return data.text || "";
};
