"""
读取知识库文件内容
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
print("=" * 60)
print("转念知识库 (转念.docx)")
print("=" * 60)
changemind = read_docx("C:/Users/Xiayu Zhang/Desktop/转念.docx")
print(f"总段落数: {len(changemind)}\n")
print("前10段内容：")
for i, para in enumerate(changemind[:10]):
    print(f"{i+1}. {para}")
print("\n")

# 读取冥想
print("=" * 60)
print("冥想知识库 (冥想.docx)")
print("=" * 60)
meditation = read_docx("C:/Users/Xiayu Zhang/Desktop/冥想.docx")
print(f"总段落数: {len(meditation)}\n")
print("前10段内容：")
for i, para in enumerate(meditation[:10]):
    print(f"{i+1}. {para}")
print("\n")

# 读取信件
print("=" * 60)
print("信件知识库 (信件.pdf)")
print("=" * 60)
try:
    letters = read_pdf("C:/Users/Xiayu Zhang/Desktop/信件.pdf")
    print(f"总页数: {len(letters)}\n")
    print("前2页内容：")
    for i, page in enumerate(letters[:2]):
        print(f"--- 第{i+1}页 ---")
        print(page[:500])  # 只显示前500字符
        print("\n")
except Exception as e:
    print(f"读取失败: {str(e)}")
