# Local Dev Setup
  - import homefinder_schmea.sql schema into your local dev mysql db(if a different mysql version caused import schema error, you can copy and paste individal db creating sql into your own mysql workbench to create them), then import homefinder_datadump.sql into your local dev mysql db for accessing dummy data
  - run ssh command: cp config.py.example config.py to create your own local dev config file
  - config SQLALCHEMY_DATABASE_URI in config.py to your local dev mysql db address
  - run pip3 install -r requirements.txt
  - run python3 run.py
  - The flask rest api will be hosted by default at your localhost:5000
