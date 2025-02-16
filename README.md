# PDF Merge and Extractter Tool

PDF Merge & Extract" is a powerful tool that allows users to merge multiple PDFs into one file and extract specific pages from an uploaded PDF. Whether you need to combine several documents or select only certain pages (like "1-3" or "4"), this tool makes it seamless and efficient. Perfect for professionals, students, and anyone handling PDFs daily!

## Features

1. **Drag and Drop** – Reorder PDFs easily before merging.
2. **Preview Merged PDF** – View the merged document before downloading.
3. **Extract PDF** – Extract specific pages or page ranges from any PDF
4. **User-Friendly Interface** – Simple and intuitive UI for smooth navigation.
5. **Fast Processing** – Quickly merge and extract PDFs without quality loss.
6. **Secure Handling** – No data is stored; all processing happens in real-time.

Simplify your PDF management today with PDF Merge & Extract!

## Installation

### Clone the Repository

```sh
 git clone https://github.com/josephDev123/pdf-merge-split-tool.git
 cd pdf-flip-merge-split
```

### Run Application

```sh
cd client
touch .env #pls create the .env by following the .env-example format
```

```sh
cd api
touch .env #pls create the .env by following the .env-example format
```

```sh
docker compose up -d
OR
docker compose down
```

## Usage

1. **Merge PDFs**:

   - Upload multiple PDFs.
   - Rearrange files via drag-and-drop.
   - Click the "Merge" button and preview the result.
   - Download the merged file.

2. **Extract PDFs**:

   - Upload a PDF file.
   - input the ranges or page to extract
   - click on extract button
   - Display new extract PDF
   - download the new extract PDF.

## Technologies Used

- **React.js** – Frontend framework
- **Tailwind CSS** – Styling
- **Nodejs and PDFDocument** – PDF processing
- **File Handling APIs(Multer)** – For uploads and downloads
- **AWS S3 and Cloudfront** – For Storage and CDN

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to improve.

## License

<!-- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## Contact

For inquiries or feedback, contact [josephuzuegbu55@gmail.com](mailto:josephuzuegbu55@gmail.com)
