import os
import json
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")

async def generate_scan_pdf(scan_data: dict) -> bytes:
    """
    Takes scan data, renders it into an HTML template using Jinja2,
    and then uses Playwright to convert the HTML to a PDF byte string.
    """
    # Initialize Jinja environment
    env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
    
    # Load the template (we'll create this next)
    template = env.get_template("report.html")
    
    # Structure data for the template
    # `scan_data` should contain things like score, grade, target_url, issues, etc.
    rendered_html = template.render(
        target_url=scan_data.get("target_url", "Unknown Domain"),
        date=datetime.now().strftime("%B %d, %Y"),
        score=scan_data.get("score", 0),
        grade=scan_data.get("grade", "F"),
        issues=scan_data.get("issues", []),
        summary=scan_data.get("summary", "No AI summary available.")
    )

    # Use Playwright to launch Chromium, render HTML, and save as PDF
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # We use set_content to load the raw HTML string
        await page.set_content(rendered_html, wait_until="networkidle")
        
        # Generate PDF as bytes
        pdf_bytes = await page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "2cm", "right": "2cm", "bottom": "2cm", "left": "2cm"}
        )
        await browser.close()
        
    return pdf_bytes
