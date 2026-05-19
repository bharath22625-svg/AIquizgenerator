import fitz
from docx import Document as DocxDocument


def extract_text_from_pdf(pdf_path):

    text = ""

    pdf_document = fitz.open(pdf_path)

    for page in pdf_document:
        text += page.get_text()

    return text


def extract_text_from_docx(docx_path):

    doc = DocxDocument(docx_path)

    text = "\n".join(
        [paragraph.text for paragraph in doc.paragraphs]
    )

    return text


def extract_text_from_txt(txt_path):

    with open(txt_path, "r", encoding="utf-8") as file:
        return file.read()