import os

from fastapi import FastAPI, UploadFile, Body, File, HTTPException
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from app.service.Configuration import Configuration
from app.service.file_processing import check_file_structure, write_turtle_file, remove_file

# Create our app object
app = FastAPI()

# Add header parameters
origins = [
    "http://localhost:3000",
    "https://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Post Endpoint to transform a CSV file into a Turtle file according to the values sent
@app.post("/processFile", description="Transform a CSV file into a Turtle file according to the values sent")
async def process_file(
        background_tasks: BackgroundTasks,
        sep: str = Body(...),
        titleLine: int = Body(...),
        firstLine: int = Body(...),
        lastLine: int = Body(None),
        prefixPredicate: str = Body(...),
        prefixData: str = Body(...),
        fileName: str = Body(None),
        file: UploadFile = File(...)):
    try:
        # Transform camel case variables to snake case (best practice with Python)
        title_line = titleLine
        first_line = firstLine
        last_line = lastLine
        prefix_predicate = prefixPredicate
        prefix_data = prefixData
        # If no fileName precised by the user, we take the name of the file and remove the extension
        file_name = os.path.splitext(file.filename)[0] if fileName is None else fileName

        # Check the file structure with all options and return a DataFrame
        file_data = check_file_structure(file, sep, title_line, first_line, last_line)

        # Write the turtle file and return the path of the file
        file_path = write_turtle_file(file_data, file_name, prefix_predicate, prefix_data)

        # Add a background task to remove the file after the request is finished
        background_tasks.add_task(remove_file, file_path)
        return FileResponse(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error when processing file: {}".format(e))


# Get endpoint to send configuration file's informations
@app.get("/configuration",
         response_model=Configuration,
         description="Display all informations of the configuration file")
async def get_configuration():
    return Configuration()
