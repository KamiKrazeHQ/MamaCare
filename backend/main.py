#installed libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

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

