#imports
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from boto3.dynamodb.conditions import Key
import boto3
import uuid
import os
from dotenv import load_dotenv
from db import dynamodb

load_dotenv()

#router
router = APIRouter(prefix="/api/appointments", tags=["Calendar"])

#appointment table
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_APPOINTMENTS', 'appointments'))

#Appointment Schemas (Creating, Updating)
class AppointmentCreate(BaseModel):
    user_id: str
    title: str
    datetime: str           # ISO format: "2026-03-10T14:00:00"
    appointment_type: str   # "in-person" or "online"
    with_whom: str
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    title: Optional[str] = None
    datetime: Optional[str] = None
    appointment_type: Optional[str] = None
    with_whom: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

#Routes
@router.post("/")
def create_appointment(data: AppointmentCreate):
    appointment_id = str(uuid.uuid4())  # Generate unique ID
    item = {        #takes values from Appointment Create and attaches to local
        'user_id': data.user_id,
        'appointment_id': appointment_id,
        'title': data.title,
        'datetime': data.datetime,
        'appointment_type': data.appointment_type,
        'with_whom': data.with_whom,
        'notes': data.notes or '',
        'status': 'pending'
    }

    table.put_item(Item = item)
    return {"message": "Appointment created", "appointment_id": appointment_id}



@router.get("/{user_id}")
def get_appointments(user_id: str):   #getting all the appointments for a specific user
    response = table.query(
        KeyConditionExpression = Key('user_id').eq(user_id)
    )
    return {"appointments": response['Items']}



@router.put("/{user_id}/{appointment_id}") #Reschedule or update an appointment
def update_appointment(user_id: str, appointment_id: str, data: AppointmentUpdate):

    # Build update expression dynamically, only update fields that were sent
    update_parts = []
    names = {}
    values = {}

    if data.title:
        update_parts.append("#t = :title")
        names["#t"] = "title"
        values[":title"] = data.title

    if data.datetime:
        update_parts.append("#d = :datetime")
        names["#d"] = "datetime"
        values[":datetime"] = data.datetime

    if data.status:
        update_parts.append("#s = :status")
        names["#s"] = "status"
        values[":status"] = data.status

    if not update_parts:
        raise HTTPException(status_code=400, detail="No fields to update")

    table.update_item(
        Key={'user_id': user_id, 'appointment_id': appointment_id},
        UpdateExpression="SET " + ", ".join(update_parts),
        ExpressionAttributeNames=names,
        ExpressionAttributeValues=values
    )
    return {"message": "Appointment updated"}



@router.delete("/{user_id}/{appointment_id}") #cancelling appointments
def cancel_appointment(user_id: str, appointment_id: str):
    """Cancel (delete) an appointment."""
    table.delete_item(Key={
        'user_id': user_id,
        'appointment_id': appointment_id
    })
    return {"message": "Appointment cancelled"}