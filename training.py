"""This script imports YouTube comment data available
at http://dcomp.sor.ufscar.br/talmeida/youtubespamcollection/.

There are five data files in total, each corresponding to a different
video. The data was used in 'TubeSpam: Comment Spam Filtering on YouTube',
in which the data sets were investigated separately with different
machine learning models. However, the data sets are merged together here,
and Logistic Regression is used for classification of whether a comment
is a spam or ham.

Author: Wenru Dong
Date: 7 Nov, 2017
"""

from sklearn.feature_extraction.text import CountVectorizer
from sklearn import linear_model
import pickle
import pandas as pd
import numpy as np


def prepare_data(datafiles):
    """Process the csv data file given the file path, and return
    training set, dev set and test set."""
    frames = []
    for data_file in datafiles:
        frames.append(pd.read_csv(data_file))
    my_data = pd.concat(frames)
    num_rows = my_data.shape[0]
    num_training = int(num_rows * 0.6)
    num_dev = int(num_rows * 0.2)

    x_train = my_data.iloc[0:num_training, 3].as_matrix()
    y_train = my_data.iloc[0:num_training, 4].as_matrix()
    x_dev = my_data.iloc[num_training:num_training+num_dev, 3].as_matrix()
    y_dev = my_data.iloc[num_training:num_training+num_dev, 4].as_matrix()
    x_test = my_data.iloc[num_training+num_dev:num_rows+1, 3].as_matrix()
    y_test = my_data.iloc[num_training+num_dev:num_rows+1, 4].as_matrix()

    # vectorizer = CountVectorizer()
    # x_train = vectorizer.fit_transform(x_train)
    # x_dev = vectorizer.transform(x_dev)
    # x_test = vectorizer.transform(x_test)

    return x_train, y_train, x_dev, y_dev, x_test, y_test


X_train, Y_train, X_dev, Y_dev, X_test, Y_test = prepare_data(["YouTube-Spam-Collection-v1/Youtube01-Psy.csv",
                                                               "YouTube-Spam-Collection-v1/Youtube02-KatyPerry.csv",
                                                               "YouTube-Spam-Collection-v1/Youtube03-LMFAO.csv",
                                                               "YouTube-Spam-Collection-v1/Youtube04-Eminem.csv",
                                                               "YouTube-Spam-Collection-v1/Youtube05-Shakira.csv"])


vectorizer = CountVectorizer()
X_train_vector = vectorizer.fit_transform(X_train)
X_dev_vector = vectorizer.transform(X_dev)
X_test_vector = vectorizer.transform(X_test)
logistic = linear_model.LogisticRegression(C=2)
logistic.fit(X_train_vector, Y_train)


print("Dev score: ", logistic.score(X_dev_vector, Y_dev))
print("Test score: ", logistic.score(X_test_vector, Y_test))

# save the model
with open("skmodel.pkl", "wb") as f:
    pickle.dump(logistic, f, protocol=2)

# save word features
with open("word_features.txt", "w") as f:
    for feature in vectorizer.get_feature_names():
        f.write(feature + '\n')
