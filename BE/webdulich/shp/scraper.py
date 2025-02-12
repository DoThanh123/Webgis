from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def fetch_events_with_selenium(url):
    # Cấu hình Selenium
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Chạy trình duyệt ở chế độ headless (không giao diện)
    chrome_options.add_argument('--disable-gpu')  # Tăng hiệu suất
    chrome_options.add_argument('--no-sandbox')  # Chỉ cần trên hệ thống Linux

    # Đường dẫn tới ChromeDriver
    service = Service(r"E:\chromedriver-win64\chromedriver.exe")  # Thay bằng đường dẫn tới ChromeDriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        # Mở trang web
        driver.get(url)
        time.sleep(3)  # Đợi JavaScript tải xong nội dung

        # Lấy HTML từ trình duyệt
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Phân tích dữ liệu
        events = []
        for item in soup.select('.slick-slide.event-card'):  # Điều chỉnh selector theo cấu trúc HTML
            title = item.select_one('.card-title a').text.strip() if item.select_one('.card-title a') else "Không có tiêu đề"
            link = item.select_one('.card-title a')['href'] if item.select_one('.card-title a') else "#"
            date = item.select_one('.card-date').text.strip() if item.select_one('.card-date') else "Không có ngày tháng"
            description = item.select_one('.card-text').text.strip() if item.select_one('.card-text') else "Không có mô tả"
            image = item.select_one('a img')['src'] if item.select_one('a img') else "Không có hình ảnh"

            events.append({
                "title": title,
                "link": link,
                "date": date,
                "description": description,
                "image": image 
            })

        return events

    finally:
        driver.quit()  # Đảm bảo tắt trình duyệt sau khi hoàn thành


def fetch_posts_with_selenium(url):  
    # Cấu hình Selenium  
    chrome_options = Options()  
    chrome_options.add_argument('--headless')  # Chạy trình duyệt ở chế độ headless (không giao diện)  
    chrome_options.add_argument('--disable-gpu')  # Tăng hiệu suất  
    chrome_options.add_argument('--no-sandbox')  # Chỉ cần trên hệ thống Linux  

    # Đường dẫn tới ChromeDriver  
    service = Service(r"E:\chromedriver-win64\chromedriver.exe")  # Thay bằng đường dẫn tới ChromeDriver  
    driver = webdriver.Chrome(service=service, options=chrome_options)  

    try:  
        # Mở trang web  
        driver.get(url)  
        time.sleep(3)  # Đợi JavaScript tải xong nội dung  

        # Lấy HTML từ trình duyệt  
        soup = BeautifulSoup(driver.page_source, 'html.parser')  

        # Phân tích dữ liệu  
        posts = []  
        for item in soup.select('.content-block.post-list-view'):  # Selector cho khối bài viết  
            title = item.select_one('.post-content .title a').text.strip() if item.select_one('.post-content .title a') else "Không có tiêu đề"  
            link = item.select_one('.post-content .title a')['href'] if item.select_one('.post-content .title a') else "#"  
            date = item.select_one('.post-meta-date').text.strip() if item.select_one('.post-meta-date') else "Không có ngày tháng"  
            description = item.select_one('.excerpt').text.strip() if item.select_one('.excerpt') else "Không có mô tả"  
            image = item.select_one('.post-thumbnail a img')['src'] if item.select_one('.post-thumbnail a img') else "Không có hình ảnh"  # Lấy URL hình ảnh  

            posts.append({  
                "title": title,  
                "link": link,  
                "date": date,  
                "description": description,  
                "image": image,  # Thêm mục hình ảnh vào từ điển  
            })  

        return posts  

    finally:  
        driver.quit()