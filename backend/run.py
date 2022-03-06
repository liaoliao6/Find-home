from app import create_app
from flask import render_template

app = create_app('dev')


app.run(debug=True, port=5000)