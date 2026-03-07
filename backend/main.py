#installed libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import io, sys
from routers import calendar, chat, jobs, groceries #accessing our built routes and methods for calender and chat

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

#loading environement variables
load_dotenv()

#FASTAPI app instance - entire backend
app = FastAPI(
    title = "Mamacare API",
    description = "Backend for project",
    version = "1.0.0"
)

# CORS Middleware, this allows your frontend (different domain/port)
# to make requests to your backend. Without this, browsers will block requests.
# This essentially acts as the middle ground betweeen the frontend and the backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # frontend URL before final demo, this for now allows all frontends to access website
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check, used to verify deployment is live.
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "mamacare-api"}

# Root route
@app.get("/")
def root():
    return {"message": "Mamacare API is running"}

# run uvicorn main:app --reload --port 8000
# open http://localhost:8000/docs#/ on your browser
# make sure backend file saves first


#HTTP Methods — when to use what
# GET | Fetching data | Get all appointments 
# POST | Creating new data | Book new appointment 
# PUT | Updating existing data | Reschedule appointment 
# DELETE | Removing data | Cancel appointment

#FastAPI uses Pydantic to validate incoming data automaticsally
#If a required field is missing or the wrong type
#FastAPI rejects it with a clear error, No need for manual validation

app.include_router(calendar.router)  #including calender router to app
app.include_router(chat.router)  #including chat router to app
app.include_router(jobs.router)
app.include_router(groceries.router)

print("ROUTES:", [r.path for r in app.routes])
