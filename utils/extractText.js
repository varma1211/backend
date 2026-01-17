import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const parsePdf = require("./pdfParser.cjs"); // 👈 CommonJS import

export const extractText = async (filePath, mimeType) => {
  // ✅ PDF
  if (mimeType === "application/pdf") {
    return await parsePdf(filePath);
  }

  // ✅ DOCX
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  }

  return "";
};
