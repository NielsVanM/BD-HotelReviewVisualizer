FROM openjdk:8-alpine

RUN apk --update add wget tar bash python3

RUN wget https://www-eu.apache.org/dist/spark/spark-2.4.3/spark-2.4.3-bin-hadoop2.7.tgz
RUN wget http://repo1.maven.org/maven2/org/mongodb/mongo-hadoop/mongo-hadoop-spark/2.0.2/mongo-hadoop-spark-2.0.2.jar
RUN wget http://repo1.maven.org/maven2/org/mongodb/mongo-hadoop/mongo-hadoop-core/2.0.2/mongo-hadoop-core-2.0.2.jar

RUN tar -xzf spark-2.4.3-bin-hadoop2.7.tgz && \
    mv spark-2.4.3-bin-hadoop2.7 /spark && \
    rm spark-2.4.3-bin-hadoop2.7.tgz

RUN mv mongo-hadoop-spark-2.0.2.jar /spark/jars/
RUN mv mongo-hadoop-core-2.0.2.jar /spark/jars/

ENV PYSPARK_PYTHON='/usr/bin/python3.6'