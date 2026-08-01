declare module "pdf-parse" {
  interface PDFData {
    text: string;
  }

  function pdf(buffer: Buffer): Promise<PDFData>;

  export default pdf;
}

declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFData {
    text: string;
  }

  function pdfParse(buffer: Buffer): Promise<PDFData>;

  export default pdfParse;
}