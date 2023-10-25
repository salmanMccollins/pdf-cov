const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/convert-html-to-pdf", async (req, res) => {
  const { html } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
      args: ["--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(html);

    // Measure the height of the HTML content
    const bodyHandle = await page.$("body");
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: `${height}px`,
      printBackground: true,
    });
    console.log(pdfBuffer);

    // Close the browser
    await browser.close();

    // Save the PDF to the server
    const pdfFileName = "output.pdf"; // You can customize the file name
    const filePath = __dirname + "/" + pdfFileName;

    // fs.writeFileSync(filePath, pdfBuffer);

    // Set response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdfFileName}"`
    );

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating and saving PDF");
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
