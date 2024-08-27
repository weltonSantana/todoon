FROM python:3.10

COPY requirements.txt  requirements.txt

RUN pip install --no-cache-dir -r requirements.txt
COPY . /app

CMD ["uvicorn", "project.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload"]