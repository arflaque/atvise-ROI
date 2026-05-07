import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface LogoData {
  /** PNG data URL, ready for jsPDF.addImage */
  dataUrl: string;
  /** Native pixel dimensions — used to preserve aspect ratio in PDF mm space */
  width: number;
  height: number;
}

/** Load an image (typically SVG) and return a PNG data URL + native dimensions. */
export async function loadImageAsPng(url: string, scale = 4): Promise<LogoData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || 200;
      const h = img.naturalHeight || 60;
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ dataUrl: canvas.toDataURL('image/png'), width: w, height: h });
    };
    img.onerror = () => reject(new Error(`Failed to load logo: ${url}`));
    img.src = url;
  });
}

interface ExportOptions {
  filename?: string;
  /** Logos stamped on every page as letterhead. */
  letterhead?: {
    topRight?: LogoData;
    bottomRight?: LogoData;
  };
  /** Header / footer zones reserved for letterhead, in mm. */
  headerHeightMm?: number;
  footerHeightMm?: number;
  /** Background color used by html2canvas and to mask image overflow. */
  bgColor?: { r: number; g: number; b: number };
}

/**
 * Capture a DOM node and produce a multi-page A4 PDF.
 *
 * If `letterhead` is provided, each page reserves a header/footer band
 * (white-masked) and stamps the logos at fixed positions, giving a
 * consistent corporate letterhead look across pages.
 */
export async function exportNodeToPdf(
  node: HTMLElement,
  {
    filename = 'vester-roi-report.pdf',
    letterhead,
    headerHeightMm = 18,
    footerHeightMm = 16,
    bgColor = { r: 255, g: 255, b: 255 },
  }: ExportOptions = {}
): Promise<void> {
  const canvas = await html2canvas(node, {
    backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;
  const dataUrl = canvas.toDataURL('image/png');

  // Letterhead layout constants (mm)
  const SIDE_MARGIN = 12;
  const TOP_MARGIN = 6;
  const BOTTOM_MARGIN = 6;
  const ATVISE_HEIGHT = 11;
  const VESTER_HEIGHT = 10;

  const usableContentH = pageH - headerHeightMm - footerHeightMm;
  const totalPages = letterhead
    ? Math.max(1, Math.ceil(imgH / usableContentH))
    : Math.max(1, Math.ceil(imgH / pageH));

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage();

    if (letterhead) {
      // Place full image; offset so the slice for page i lands inside the content band
      const yOffset = headerHeightMm - i * usableContentH;
      pdf.addImage(dataUrl, 'PNG', 0, yOffset, imgW, imgH);

      // Mask image overflow into the header / footer zones with bg color
      pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
      pdf.rect(0, 0, pageW, headerHeightMm, 'F');
      pdf.rect(0, pageH - footerHeightMm, pageW, footerHeightMm, 'F');

      // Stamp logos
      if (letterhead.topRight) {
        const lg = letterhead.topRight;
        const w = (lg.width / lg.height) * ATVISE_HEIGHT;
        pdf.addImage(
          lg.dataUrl,
          'PNG',
          pageW - SIDE_MARGIN - w,
          TOP_MARGIN,
          w,
          ATVISE_HEIGHT
        );
      }
      if (letterhead.bottomRight) {
        const lg = letterhead.bottomRight;
        const w = (lg.width / lg.height) * VESTER_HEIGHT;
        pdf.addImage(
          lg.dataUrl,
          'PNG',
          pageW - SIDE_MARGIN - w,
          pageH - BOTTOM_MARGIN - VESTER_HEIGHT,
          w,
          VESTER_HEIGHT
        );
      }
    } else {
      // No letterhead — original simple slicing
      const yOffset = -i * pageH;
      pdf.addImage(dataUrl, 'PNG', 0, yOffset, imgW, imgH);
    }
  }

  pdf.save(filename);
}
