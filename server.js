const express = require("express");
const pdf = require("html-pdf");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// API endpoint to convert HTML to PDF
app.post("/convert-html-to-pdf", (req, res) => {
  const htmlContent = req.body.html; // Get the HTML content from the request body

  if (!htmlContent) {
    return res
      .status(400)
      .json({ error: "Missing HTML content in the request." });
  }

  // Options for the pdf.create function (adjust as needed)
  const options = { format: "Letter" };

  pdf.create(htmlContent, options).toBuffer((err, buffer) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "PDF generation failed." });
    }

    // Set the response headers to indicate a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=converted.pdf");
    res.send(buffer);
  });
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

// Start the Express server
const port = process.env.PORT || 3000; // Use your preferred port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
