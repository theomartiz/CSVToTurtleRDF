# semantic-processing

## start the app
uvicorn app.main:app --reload --port 8000

## Open API 
Look on ```/docs``` endpoint

## DockerFile
In the main directory:
1. ```docker build -t fast-api .```
2. ```docker run -p 80:80 --name fast-api fast-api```