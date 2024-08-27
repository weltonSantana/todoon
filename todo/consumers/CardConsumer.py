# myapp/consumers.py
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer

redis_instance = redis.StrictRedis(host='localhost', port=6379, db=0)
class CardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f'project_{self.scope["url_route"]["kwargs"]["projeto_id"]}_cards'
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

        if action == 'move':
            cartao_id = data['cartao_id']
            nova_lista_id = data['nova_lista_id']
            nova_ordem = data['nova_ordem']
            # Atualizar no Redis
            redis_instance.hset(f"cartao_{cartao_id}", mapping={
                'lista_id': nova_lista_id,
                'ordem': nova_ordem
            })
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'cartao_movido',
                    'cartao_id': cartao_id,
                    'nova_lista_id': nova_lista_id,
                    'nova_ordem': nova_ordem,
                }
            )

    async def cartao_movido(self, event):
        await self.send(text_data=json.dumps({
            'action': 'cartao_movido',
            'cartao_id': event['cartao_id'],
            'nova_lista_id': event['nova_lista_id'],
            'nova_ordem': event['nova_ordem'],
        }))
