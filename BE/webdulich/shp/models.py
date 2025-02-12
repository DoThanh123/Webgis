import os  
import datetime  
from django.conf import settings  
from django.db import models  
from django.db.models.signals import post_save
from django.dispatch import receiver
import geopandas as gpd
import zipfile
import glob
from sqlalchemy import *
from geoalchemy2 import Geometry, WKTElement

# shapefile model.
class shp(models.Model):  
    name = models.CharField(max_length=50)  
    description = models.CharField(max_length=2000, blank=True)  
    file = models.FileField(upload_to='%y%m/%d')  
    upload_date = models.DateField(default=datetime.date.today, blank=True)  

    def __str__(self):  
        return self.name  

@receiver(post_save, sender=shp)
def publish_data(sender, instance, created, **kwargs):
    file = instance.file.path
    file_name = os.path.basename(file).split('.')[0]
    file_path = os.path.dirname(file)
    conn_str = 'postgresql://postgres:daihiep123zx@localhost:5432/dulich'

    # Giải nén zipfile
    with zipfile.ZipFile(file, 'r') as zip_ref:
        zip_ref.extractall(file_path)

    os.remove(file)  # Xóa zipfile

    shp = glob.glob(r'{}/**/*.shp'.format(file_path), recursive=True)[0]  # Lấy file shp

    gdf = gpd.read_file(shp)  # Tạo geodataframe

    crs_name = str(gdf.crs.srs)
    print(crs_name, 'crs_name')

    try:
        epsg = int(crs_name.replace('epsg:', ''))
    except (ValueError, AttributeError):
        epsg = 4326
    
    geom_type = gdf.geom_type[1]

    engine = create_engine(conn_str)  # Tạo sqlalchemy engine

    # Thêm dấu thời gian vào tên bảng để đảm bảo tính duy nhất
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')

    # Áp dụng geometry vào cột 'geom'
    gdf['geom'] = gdf['geometry'].apply(lambda x: WKTElement(x.wkt, srid=epsg))

    gdf.drop('geometry', axis=1, inplace=True)

    # Lưu vào cơ sở dữ liệu với tên bảng duy nhất
    gdf.to_sql(file_name, engine, 'data', if_exists='replace', index=False, dtype={'geom': Geometry('Geometry', srid=epsg)}) #gửi gdf tới postgresql

# @receiver(post_delete, sender=shp)
# def delete_data(sender, instance, created, **kwargs):
#     pass