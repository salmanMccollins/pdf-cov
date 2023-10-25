const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const port = 3006;

app.use(bodyParser.json());

app.post("/convert-html-to-pdf", async (req, res) => {
  const { html } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(html);

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({ format: "A4" });

    // Close the browser
    await browser.close();

    // Set response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="output.pdf"');

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

// Route to serve an HTML form for testing
app.get("/", (req, res) => {
  const htmlForm = `
    <!DOCTYPE html>
    <html>
    <body>
      <h2>HTML to PDF Conversion</h2>
    </body>
    </html>
  `;
  res.send(htmlForm);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
