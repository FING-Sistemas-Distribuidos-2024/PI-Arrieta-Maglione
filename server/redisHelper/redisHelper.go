package redisHelper

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type RedisHelper struct {
	client *redis.Client
	Sub    *redis.PubSub
}

func (r *RedisHelper) IncreaseKey(key string) (int64, error) {
	return r.client.Incr(context.Background(), key).Result()
}

func (r *RedisHelper) SetValue(key string, value interface{}) error {
	return r.client.Set(context.Background(), key, value, 0).Err()
}

func (r *RedisHelper) GetValue(key string) (string, error) {
	return r.client.Get(context.Background(), key).Result()
}

func (r *RedisHelper) GetAllKeys(prefix string) ([]string, error) {
	keys := r.client.Keys(context.Background(), prefix+"*")
	return keys.Result()

}

func (r *RedisHelper) DeleteKey(key string) error {
	return r.client.Del(context.Background(), key).Err()
}

func (r *RedisHelper) Publish(channel string, message interface{}) error {
	return r.client.Publish(context.Background(), channel, message).Err()
}

func NewRedisHelper(client *redis.Client, channel string) *RedisHelper {
	Sub := client.Subscribe(context.Background(), channel)
	return &RedisHelper{client, Sub}
}
