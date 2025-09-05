declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: { scale?: number; logging?: boolean; useCORS?: boolean };
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string };
    pagebreak?: { mode?: string | string[]; before?: string | string[]; after?: string | string[]; avoid?: string | string[] };
    enableLinks?: boolean;
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(filename?: string): Promise<void>;
    output(type?: string, options?: unknown): Promise<unknown>;
    outputPdf(type?: string): Promise<unknown>;
    outputImg(type?: string): Promise<unknown>;
    then(callback: () => void): Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Promise<void>;

  export = html2pdf;
}