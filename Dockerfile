FROM python:3.10

COPY requirements.txt  requirements.txt

RUN pip install --no-cache-dir -r requirements.txt
COPY . /app

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "project.asgi:application"]