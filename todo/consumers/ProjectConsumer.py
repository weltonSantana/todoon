# myapp/consumers.py
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Lista

redis_instance = redis.StrictRedis(host='localhost', port=6379, db=0)
class ProjectConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f'project_{self.scope["url_route"]["kwargs"]["projeto_id"]}_global'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        # Aqui você pode coordenar ações entre listas e cartões
