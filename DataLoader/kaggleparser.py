import csv
import json

import pymongo

from DataLoader.apps import _Mongo


class HotelReview():
    def __init__(self, Hotel_Address, Additional_Number_of_Scoring, Review_Date, Average_Score, Hotel_Name, Reviewer_Nationality, Negative_Review, Review_Total_Negative_Word_Counts, Total_Number_of_Reviews, Positive_Review, Review_Total_Positive_Word_Counts, Total_Number_of_Reviews_Reviewer_Has_Given, Reviewer_Score, Tags, days_since_review, lat, lng):
        self.Hotel_Address = Hotel_Address
        self.Additional_Number_of_Scoring = Additional_Number_of_Scoring
        self.Review_Date = Review_Date
        self.Average_Score = Average_Score
        self.Hotel_Name = Hotel_Name
        self.Reviewer_Nationality = Reviewer_Nationality
        self.Negative_Review = Negative_Review
        self.Review_Total_Negative_Word_Counts = Review_Total_Negative_Word_Counts
        self.Total_Number_of_Reviews = Total_Number_of_Reviews
        self.Positive_Review = Positive_Review
        self.Review_Total_Positive_Word_Counts = Review_Total_Positive_Word_Counts
        self.Total_Number_of_Reviews_Reviewer_Has_Given = Total_Number_of_Reviews_Reviewer_Has_Given
        self.Reviewer_Score = Reviewer_Score
        self.Tags = Tags
        self.days_since_review = days_since_review
        self.lat = lat
        self.lng = lng

    def to_dict(self):
        return {
            "Hotel_Address": self.Hotel_Address,
            "Additional_Number_of_Scoring": self.Additional_Number_of_Scoring,
            "Review_Date": self.Review_Date,
            "Average_Score": self.Average_Score,
            "Hotel_Name": self.Hotel_Name,
            "Reviewer_Nationality": self.Reviewer_Nationality,
            "Negative_Review": self.Negative_Review,
            "Review_Total_Negative_Word_Counts": self.Review_Total_Negative_Word_Counts,
            "Total_Number_of_Reviews": self.Total_Number_of_Reviews,
            "Positive_Review": self.Positive_Review,
            "Review_Total_Positive_Word_Counts": self.Review_Total_Positive_Word_Counts,
            "Total_Number_of_Reviews_Reviewer_Has_Given": self.Total_Number_of_Reviews_Reviewer_Has_Given,
            "Reviewer_Score": self.Reviewer_Score,
            "Tags": self.Tags,
            "days_since_review": self.days_since_review,
            "lat": self.lat,
            "lng": self.lng
        }


class TinyReview():
    def __init__(self, text, positive):
        self.text = text
        self.positive = positive

    def to_dict(self):
        return {
            "text": self.text,
            "positive": self.positive
        }


def ParseKaggleFile(kaggle_data):

    full_db = _Mongo.get_collection("full_reviews")
    tiny_db = _Mongo.get_collection("tiny_reviews")

    kaggleReader = csv.reader(kaggle_data)

    obj_list = []
    # row_count = sum(1 for row in kaggleReader)
    for i, row in enumerate(kaggleReader):
        # Skip the title line
        if i == 0:
            continue

        # Report to console every 10 000 documents
        if i % 10000 == 0:
            print("Line {} out of {} done".format(i, "all"), end="\r")

        # Parse and add to list
        doc = parseKaggleLine(row)
        obj_list.append(
            parseKaggleLine(row)
        )

    print("Line {} out of {} done".format(i, "all"), end="\n")

    # Store in bulk
    print("Storing results")
    full_db.insert_many([obj.to_dict() for obj in obj_list])
    print('Finished storing results, you\'re ready to go!')

    print("Starting splitting of negative and positive reviews")

    tinyReviewList = []
    for obj in obj_list:
        tinyReviewList.append(
            TinyReview(obj.Negative_Review, False)
        )
        tinyReviewList.append(
            TinyReview(obj.Positive_Review, True)
        )
    print("Storing tiny reviews")
    tiny_db.insert_many([rev.to_dict() for rev in tinyReviewList])
    print("Finished storing, you're ready to go!")


def parseKaggleLine(line):
    doc = HotelReview(
        line[0],
        line[1],
        line[2],
        line[3],
        line[4],
        line[5],
        line[6],
        line[7],
        line[8],
        line[9],
        line[10],
        line[11],
        line[12],
        line[13],
        line[14],
        line[15],
        line[16]
    )

    return doc
