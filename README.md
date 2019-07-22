# BD-HotelReviewVisualizer
Django based visualization app for assessment of hotel reviews

# Tech Stack
* Django
* MongoDB
* Highcharts & Highmaps
* Docker
* Jupyter Notebook
* PySpark
* Spark Cluster

# Setup
## Webserver
Needs python 3 installed along with an local instance of mongodb, standalone or docker doesn't  matter.

```bash
pip3 install -r requirements.txt
python3 manage.py runserver
```

## Spark Cluster with Jupyter Notebook
```bash
docker-compose up
```
Now opepn the notebook and you should be able to use it.

# Loading data in webapp
1. Download the kaggle file: https://www.kaggle.com/jiashenliu/515k-hotel-reviews-data-in-europe
2. Run ``python3 manage.py parsefromdisk <file_path>``

# Generating dataset for big data issues
```python3 manage.py genbd <size_in_gb>```

Where size in gb is ideally larger than ram
