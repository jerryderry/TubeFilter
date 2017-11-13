"""This script converts the saved scikit-learn model saved as pickle file to
the mlmodel with coremltools. The script should be run with Python 2.

Author: Wenru Dong
Date: 12 Nov, 2017
"""

import coremltools
from sklearn.externals import joblib

model = joblib.load("skmodel.pkl")
coreml_model = coremltools.converters.sklearn.convert(model, "comment", "is_spam")

coreml_model.author = "Wenru Dong"
coreml_model.short_description = "Determine if a YouTube comment is a spam."

coreml_model.save("ISSpam.mlmodel")
