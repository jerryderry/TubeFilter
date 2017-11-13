# TubeFilter
A Safari app extension that uses machine learning to predict spam comments on YouTube and censors the content

## YouTube Comment Data
The comment data were collected by T. C. Alberto, J. V. Lochter and T. A. Almeida who wrote the paper _"TubeSpam: Comment Spam Filtering on YouTube"_. They collected comments from under five videos, and used different classifiers on the five data set. It is concluded from this research that decision trees, logistic regression, Bernoulli Naive Bayes, random forests, linear and Gaussian SVMs are statistically equivalent. The data can be downloaded from [http://dcomp.sor.ufscar.br/talmeida/youtubespamcollection/]

## Machine Learning
The classifier used in this project is logistic regression in Scikit-learn. The parameter C is set to 2. The five data sets were merged into one, which is then split into training/dev/test sets by the proportion of 60%/20%/20%. The accuracies achieved on the dev set do not change much with different C value.

The model is then converted to a Core ML model with coremltools. Note that coremltools only works with Python 2.

## App Extension
Since the extension uses the Core ML, it is only available on macOS 10.13.
