from django.shortcuts import render
from .scraper import fetch_posts_with_selenium, fetch_events_with_selenium



# Create your views here.
def home(request):
    posts = fetch_posts_with_selenium("https://quangbinhtourism.vn/gioi-thieu")
    for post in posts:
        print(post)
    return render(request,'home.html', {'posts': posts})

def index(request):
    return render(request,'index.html')

def event_page(request):
    events = fetch_events_with_selenium("https://quangbinhtourism.vn/lich-su-kien")  # Lấy dữ liệu từ trang ngoài
    # Gọi hàm và kiểm tra kết quả
    for event in events:
        print(event)
    return render(request, 'events.html', {'events': events})  

def info(request):
    posts = fetch_posts_with_selenium("https://quangbinhtourism.vn/thong-tin-can-biet")
    for post in posts:
        print(post)
    return render(request,'info.html', {'posts':posts})