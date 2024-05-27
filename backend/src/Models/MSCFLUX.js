const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-writer').createObjectCsvWriter;

class MSCFLUX {
    constructor(inputFilePath, outputFilePath) {
        this.inputFilePath = inputFilePath;
        this.outputFilePath = outputFilePath;
    }

    async convertToCSV() {
        try {
            const fileStream = fs.createReadStream(this.inputFilePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
    
            let isFirstLine = true;
            let headers = [];
            const records = [];
    
            for await (const line of rl) {
                const columns = line.split(','); // ligne séparer
    
                if (isFirstLine) {
                    headers = columns;
                    isFirstLine = false;
                } else {
                    const record = {};
                    headers.forEach((header, index) => {
                        record[header] = columns[index];
                    });
                    records.push(record);
                }
            }
    
            const csvWriterInstance = csvWriter({
                path: this.outputFilePath,
                header: headers.map(header => ({ id: header, title: header }))
            });
    
            await csvWriterInstance.writeRecords(records);
            
            console.log('La conversion en CSV a été effectuée avec succès.');
        } catch (error) {
            console.error('Une erreur lors de la conversion en CSV', error);
        }
    }
    
}
module.exports = { MSCFLUX };
