FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV challenge_me_debug=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY challenge_me /code
