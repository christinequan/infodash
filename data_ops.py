import csv
import pandas as pd
import numpy as np
from string import Template
from datetime import datetime as dt

DATA_URL =  './trips_gdrive.csv'
DATE_FORMAT = '%m/%d/%Y'

def get_data():
    data = []
    with open(DATA_URL, 'rb') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            #hard code some data cleaning of the Dollars to remvooe dollar sign
            row['Item Dollars'] = int(row['Item Dollars'][1:])
            row['Date'] = dt.strptime(row['Date'], DATE_FORMAT)
            data.append(row)
    return data

#Part 1. Return the strongest retailer affinity, relative to other brands.
# Here I am defining strongest retailer affinity as the store with which
# the brand contributes to the highest percentage of trips for that store.
# Basically, I calculate the percentage of trips for a brand at a store.
# Then when given a brand, I see which store the brand had the highest contribution.
def retailer_affinity(focus_brand):
    dat = get_data()
    df = pd.DataFrame(dat).reindex_axis(['Parent Brand', 'Retailer'], axis = 1)

    df = df.rename(columns={'Parent Brand': 'Brand'})
    percent = df.groupby(['Retailer', 'Brand']).size().groupby(level = 0) \
                .transform(lambda x: x/x.sum()) \
                .reset_index().reindex_axis(['Brand', 'Retailer', 0], axis = 1)
    retailer = percent.loc[percent['Brand'] == focus_brand].set_index('Retailer')[0].idxmax()

    return retailer

# Part 2. Return counts for the number of households.
# Households can be defined many ways. Within this dataset,
# I am equating each User ID to a Household.
# This will ignore arguments that are not in the preset and won't raise a warning
# This is also currently case-sensitive and assumes dates are given in the 'mm/dd/yyyy' format like the dataset
def count_hhs(**kwargs):
    dat = get_data()
    #brand=None, retailer = None, start_date = None, end_date = None
    df = pd.DataFrame(dat).reindex_axis(['Parent Brand', 'Retailer', 'Date', 'User ID'], axis = 1)
    arglist = {'brand': 'Parent Brand', 'retailer': 'Retailer', 'start_date': 'Date', 'end_date': 'Date'}

    # If there are no params given, then return the number of unique user ids aka households
    if len(kwargs.items()) == 0:
        return df['User ID'].nunique();

    testList = []
    testTemplate = Template('(df[\'$arg_col\'] == \'$value\')')

    for key, col in arglist.items():

        if key in kwargs.keys():
            if kwargs[key] == None:
                test = True
            elif (key == 'start_date'):
                test = (df[col] >= dt.strptime(kwargs[key], DATE_FORMAT))
            elif (key == 'end_date'):
                test = (df[col] <= dt.strptime(kwargs[key], DATE_FORMAT))
            else:
                test = (df[col] == kwargs[key])

            testList.append(test)

    test = testList[0] & testList[1] & testList[2] & testList[3]
    #works for small number of arguments...different approach needed if there are a lot more arguments

    count = df.loc[test, 'User ID'].nunique()
    return count

# Part 3. Identify the brand with the top buying rate.
# the top buying brand is the one with the highest spend per HH
# assumptions: that the data is well formatted with the columns in the csv
# also assuming that there is no missing data
# here, item dollars refers to the total dollars, not the unit price
def top_buying_brand():
    dat = get_data()
    df = pd.DataFrame(dat)
    totalHH = len(set(df['User ID']))
    sums = df.groupby('Parent Brand').aggregate(np.sum)
    spend_per_HH = (sums/totalHH)
    top = spend_per_HH['Item Dollars'].idxmax()

    return top

# Get all of the unique brand names
def get_all_brands():
    dat = get_data()
    df = pd.DataFrame(dat)
    brand_arr = df['Parent Brand'].unique().tolist()
    return ','.join(brand_arr)
