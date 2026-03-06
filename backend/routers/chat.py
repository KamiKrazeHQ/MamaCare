#import statements
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from boto3.dynamodb.conditions import Key
from datetime import datetime
import boto3
import json
import os
from dotenv import load_dotenv
from db import dynamodb

load_dotenv()

router = APIRouter(prefix="/api/chat", tags=["Chat"])
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_MESSAGES', 'messages'))

#Connection Manager
#Tracks all currently connected WebSocket clients
#When a message arrives, it broadcasts to everyone in the same room

class ConnectionManager:
    def __init__(self):   
        # Dictionary: { "room_id": [websocket1, websocket2, ...] }
        self.rooms: dict[str, list[WebSocket]] = {}
    
    #connecting to a room
    async def connect(self, websocket: WebSocket, room_id: str): #connecting the rooms
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)
    
    #disconnecting from a room
    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)
    
    #send a message to all users connected to a room
    async def broadcast_to_room(self, message: dict, room_id: str):
        if room_id not in self.rooms:
            return
        for connection in self.rooms[room_id]:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

#WebSocket Route
@router.websocket("/ws/{room_id}/{user_name}")

#WebSocket endpoint for real-time chat.
#room_id: which chat room 
#user_name: display name

async def websocket_chat(websocket: WebSocket, room_id: str, user_name: str):
    await manager.connect(websocket, room_id) #connecting to the room
    await manager.broadcast_to_room({  #announcing welcome into the room
        "type": "system",
        "content": f"{user_name} joined the room",
        "room_id": room_id,
        "timestamp": datetime.utcnow().isoformat()}, room_id)
    
    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)

            message = {
                "type": "message",
                "room_id": room_id,
                "sender": user_name,
                "content": data.get("content", ""),
                "timestamp": datetime.utcnow().isoformat()
            }

            table.put_item(Item={
                'room_id': room_id,
                'timestamp': message["timestamp"],
                'sender': user_name,
                'content': message["content"]
            })

            await manager.broadcast_to_room(message, room_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast_to_room({
            "type": "system",
            "content": f"{user_name} left the room",
            "room_id": room_id,
            "timestamp": datetime.utcnow().isoformat()
        }, room_id)


# REST Route: Load Chat History 

@router.get("/history/{room_id}")
def get_chat_history(room_id: str, limit: int = 50):
    
    #Load the last N messages for a room.
    #Called when a user first opens a chat room to show previous messages.
    
    response = table.query(
        KeyConditionExpression=Key('room_id').eq(room_id),
        ScanIndexForward=False,   # newest first
        Limit=limit
    )
    messages = list(reversed(response['Items']))  # flip back to oldest first
    return {"messages": messages, "room_id": room_id}




        
