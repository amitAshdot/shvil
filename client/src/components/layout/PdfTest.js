// import React, { useState } from 'react';
// // import { Document, Page } from 'react-pdf';
// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';


// const PdfTest = (props) => {
//     const { file } = props
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);


//     const url = file.path
//     console.log(url)
//     console.log(file)
//     const getPdf = async () => {

//         const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

//         const pdfDoc = await PDFDocument.load(existingPdfBytes)
//         const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

//         const pages = pdfDoc.getPages()
//         const firstPage = pages[0]
//         const { width, height } = firstPage.getSize()
//     }
//     getPdf()
//     return (
//         <div>

//             <p>
//                 Page {pageNumber} of {numPages}
//             </p>
//         </div>
//     )
// }

// export default PdfTest