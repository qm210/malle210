FROM python:3.9.2-slim-buster

WORKDIR /home

RUN apt update
RUN apt install -y python3-dev python3-pip alsa-utils

RUN pip install pipenv

COPY Pipfile Pipfile.lock /home/
RUN pipenv install --system --deploy

ENV PYTHONUNBUFFERED 1

EXPOSE 8080

CMD python -m malle210
