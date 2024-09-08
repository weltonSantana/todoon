
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Lista

redis_instance = redis.StrictRedis(host='localhost', port=6379, db=0)

class ListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f'project_{self.scope["url_route"]["kwargs"]["projeto_id"]}_lists'
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

        if action == 'create':
            nome = data['nome']
            # e armazenar no Redis, se necessário.
            # lista = Lista.objects.create(nome=nome)
            # await self.channel_layer.group_send(
            #     self.room_group_name,
            #     {
            #         'type': 'lista_criada',
            #         'nome': lista.nome,
            #         'id': lista.id,
            #     }
            # )

    async def lista_criada(self, event):
        await self.send(text_data=json.dumps({
            'action': 'lista_criada',
            'id': event['id'],
            'nome': event['nome'],
        }))
