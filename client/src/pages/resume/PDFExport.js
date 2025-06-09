import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';

const PDFExport = ({ resumeContent, templateId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      // Create a clone of the resume content for PDF generation
      const element = document.createElement('div');
      element.innerHTML = resumeContent;
      element.className = `template-${templateId} pdf-export`;

      // PDF options
      const opt = {
        margin: [10, 10],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      const pdf = await html2pdf().set(opt).from(element).output('blob');
      const url = URL.createObjectURL(pdf);
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Button 
        variant="success" 
        onClick={generatePDF}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Generating PDF...
          </>
        ) : (
          'Export as PDF'
        )}
      </Button>

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '600px' }}
              title="PDF Preview"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .pdf-export {
          background: white;
          padding: 20px;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
};

export default PDFExport; 