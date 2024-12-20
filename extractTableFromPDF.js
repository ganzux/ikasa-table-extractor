import fs from 'fs';
import pdfTableExtractor from 'pdf-table-extractor';


// Function to display extracted table information
const displayTableData = (pdfFilePath) => {
    if (!fs.existsSync(pdfFilePath)) {
        console.error("File does not exist:", pdfFilePath);
        return;
    }

    console.log("Processing file:", pdfFilePath);

    // Extract tables using pdf-table-extractor
    pdfTableExtractor(pdfFilePath,
        (result) => {
            console.log("\n=== Copy the following CSV-formatted data ===\n");

            // Process all extracted tables
            result.pageTables.forEach((page, pageIndex) => {
                console.log(`\nPage ${pageIndex + 1}:`);
                page.tables.forEach((row) => {
                    console.log(separateNumbersAndText(row[0])); // Print each row
                });
            });
        },
        (error) => {
            //console.error("Error extracting tables:", error);
        }
    );
};

function separateNumbersAndText(input) {
    // Regex to match numbers (with decimals/percentages) and text blocks
    const matches = input.match(/(\d+[,\.]?\d*%?)|([^\d%]+)/g);

    if (!matches) return ""; // Return empty if no matches are found

    const result = matches.map((match) => {
        if (/^\d+[,\.]?\d*%?$/.test(match.trim())) {
            // Handle numbers/percentages: replace commas with dots
            return match.replace(",", ".").trim();
        } else {
            // Clean text blocks: remove extra spaces and trim
            return match.replace(/[:,]+/g, "").trim(); // Remove colons/commas
        }
    });

    // Join components with a comma and space
    return result.filter(Boolean).join(", ");
}

// Input: Ask for a PDF file name
const pdfFileName = readlineSync.question("Enter the PDF file name (with full path): ");
displayTableData(pdfFileName);
