#database
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

#DynamoDB Understanding 
#DynamoDB is NOT like SQL. Instead of tables with fixed columns
#each (item)row is a JSON document. 

#Every table needs:
#Partition Key (PK): groups related items together
#Sort Key (SK): orders item without a partition (optional but recommended)

#Together, PK + SK means a unique identifier for every item

#Example:
#   PK = "user_123"   (all of Maria's appointments)
#   SK = "appt_001"   (this specific appointment)

# Best way to understand PK is the folder, SK is the file inside the folder.

def get_dynamodb():   #returns a dynamodb resource connected to AWS
    return boto3.resource(
        'dynamodb',
        region_name=os.getenv('AWS_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

dynamodb = get_dynamodb()