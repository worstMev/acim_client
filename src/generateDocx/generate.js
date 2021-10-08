const docx = require('docx');
const { saveAs } = require('file-saver');

const { Document , Packer , Paragraph , TextRun } = docx;

export async function generateDocx(num_decharge) {
     const doc = new Document ({
         sections : [{
             properties : {},
             children : [
                 new Paragraph({
                     children : [
                         new TextRun('Hello world , docx'),
                         new TextRun('decharge n#'+num_decharge),
                     ],
                 }),
             ],
         }],
     });

    const blob = await Packer.toBlob(doc);
    await saveAs(blob,'text.docx');
 }

//module.exports = {
//    generateDocx,
//}
