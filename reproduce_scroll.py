from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        cwd = os.getcwd()
        file_path = f"file://{cwd}/editor.html"

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Program that fills the terminal and then asks for input
        code = """ΑΛΓΟΡΙΘΜΟΣ ScrollTest
ΔΕΔΟΜΕΝΑ I, X : ΑΚΕΡΑΙΟΣ;
ΑΡΧΗ
    ΓΙΑ I := 1 ΕΩΣ 100 ΕΠΑΝΑΛΑΒΕ
        ΤΥΠΩΣΕ("Line", I)
    ΓΙΑ-ΤΕΛΟΣ;
    ΔΙΑΒΑΣΕ(X)
ΤΕΛΟΣ"""

        page.fill('#code-editor', code)
        page.click('#run-button')

        # Wait for input line to appear
        page.wait_for_selector('#terminal-input-line', state='visible')

        # Check scroll details
        scroll_info = page.evaluate("""() => {
            const container = document.getElementById('terminal-window');
            const inputLine = document.getElementById('terminal-input-line');

            return {
                scrollTop: container.scrollTop,
                scrollHeight: container.scrollHeight,
                clientHeight: container.clientHeight
            };
        }""")

        print(f"Scroll Info: {scroll_info}")

        max_scroll = scroll_info['scrollHeight'] - scroll_info['clientHeight']
        current_scroll = scroll_info['scrollTop']

        print(f"Max Scroll: {max_scroll}, Current Scroll: {current_scroll}")

        if abs(max_scroll - current_scroll) < 2:
            print("Success: Scrolled to bottom.")
        else:
            print("Failure: NOT scrolled to bottom.")

        page.screenshot(path="/home/jules/verification/scroll_issue_v3.png")
        browser.close()

if __name__ == "__main__":
    run()
