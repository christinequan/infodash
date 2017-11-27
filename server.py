from flask import Flask, render_template, request
from data_ops import top_buying_brand, retailer_affinity, count_hhs, get_all_brands
import os

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/affinity/<focus_brand>")
def affinity(focus_brand):
    retailer = retailer_affinity(focus_brand)
    return retailer

@app.route("/api/top")
def top():
    return top_buying_brand()

@app.route("/api/counthhs")
def counthhs():
    if len(request.args) == 0:
        count = count_hhs()
    else:
        count = count_hhs(brand=request.args.get('brand'),
              retailer=request.args.get('retailer'),
              start_date=request.args.get('start_date'),
              end_date=request.args.get('end_date'))
    return str(count)

@app.route("/api/getbrands")
def getbrands():
    return str(get_all_brands())

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 4000))
    app.run(host='0.0.0.0', port=port)
