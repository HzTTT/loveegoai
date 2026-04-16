"""
导出知识库文件内容到txt，便于查看
"""
import sys
from pathlib import Path
from docx import Document
from PyPDF2 import PdfReader

def read_docx(file_path):
    """读取docx文件"""
    doc = Document(file_path)
    paragraphs = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            paragraphs.append(text)
    return paragraphs

def read_pdf(file_path):
    """读取pdf文件"""
    reader = PdfReader(file_path)
    text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)
    return text

# 读取转念
changemind = read_docx("C:/Users/Xiayu Zhang/Desktop/转念.docx")
with open("D:/loveegoai-backend/temp_changemind.txt", "w", encoding="utf-8") as f:
    f.write(f"转念知识库\n")
    f.write(f"总段落数: {len(changemind)}\n")
    f.write("="*60 + "\n\n")
    for i, para in enumerate(changemind[:50]):  # 前50段
        f.write(f"{i+1}. {para}\n\n")

# 读取冥想
meditation = read_docx("C:/Users/Xiayu Zhang/Desktop/冥想.docx")
with open("D:/loveegoai-backend/temp_meditation.txt", "w", encoding="utf-8") as f:
    f.write(f"冥想知识库\n")
    f.write(f"总段落数: {len(meditation)}\n")
    f.write("="*60 + "\n\n")
    for i, para in enumerate(meditation):  # 全部
        f.write(f"{i+1}. {para}\n\n")

# 读取信件
try:
    letters = read_pdf("C:/Users/Xiayu Zhang/Desktop/信件.pdf")
    with open("D:/loveegoai-backend/temp_letters.txt", "w", encoding="utf-8") as f:
        f.write(f"信件知识库\n")
        f.write(f"总页数: {len(letters)}\n")
        f.write("="*60 + "\n\n")
        for i, page in enumerate(letters):
            f.write(f"--- 第{i+1}页 ---\n")
            f.write(page)
            f.write("\n\n")
except Exception as e:
    with open("D:/loveegoai-backend/temp_letters.txt", "w", encoding="utf-8") as f:
        f.write(f"信件知识库读取失败\n")
        f.write(f"错误: {str(e)}\n")

print("导出完成!")
print("- temp_changemind.txt (前50段)")
print("- temp_meditation.txt (全部)")
print("- temp_letters.txt")
