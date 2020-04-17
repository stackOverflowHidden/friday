import { sizeof } from '../../common/utils';

function getCacheSize(cache, queue) {
  const bytes = 0;

  bytes += sizeof(queue);
  cache.forEach((value, key) => {
    bytes += sizeof(value);
    bytes += sizeof(key);
  });

  return bytes;
}

class LRU {
  size = 1000;
  timeout = 10000;
  hasSetUp = false;
  cache = new Map();
  queue = [];
  timer = {}; // 定时器，过期删除数据

  // 读取缓存数据
  get = (key) => {
    if (!this.hasSetUp) this.hasSetUp = true;

    const value = this.cache.get(key);
    if (value && value.value) {
      return {
        key,
        value,
      };
    } else {
      return {
        mes: "未找到对应缓存",
      };
    }
  }

  //写入缓存数据
  put = (key, value) => {
    if (!key || !value) return null;
    if (!this.hasSetUp) this.hasSetUp = true;

    if (!this.cache.has(key)) {
      const cacheSize = getCacheSize(this.cache, this.queue);
      if (cacheSize < this.size) {
        this.queue.push({
          key: key,
          value: value,
        });
        this.cache.set(key, {
          value: value,
          index: this.queue.length - 1, // 当前数据在队列中的索引
        });

        this.timer[key] = setTimeout(() => this.willDeleteData(key, this.queue, this.cache), this.timeout);
      } else {
        const deletedItem = this.queue.shift();
        clearTimeout(this.timer[deletedItem.key]);
        this.cache.delete(deletedItem.key);
        this.queue.forEach((itemValue,itemKey) => {
          this.cache.set(itemKey, {
            value: itemValue.value,
            index: itemValue.index - 1,
          });
        });

        this.queue.push({
          key: key,
          value: value,
        });
        this.cache.set(key, {
          value: value,
          index: this.queue.length - 1,
        });

        this.timer[key] = setTimeout(() => this.willDeleteData(key, this.queue, this.cache), this.timeout);
      }
    } else {
      clearTimeout(this.timer[key]);
      const index = this.cache.get(key).index;
      const updatedItem = this.queue.splice(index, 1)[0];
      updatedItem.value = value;

      this.queue.push(updatedItem);
      this.cache.forEach((itemValue, itemKey) => {
        if (key === itemKey) {
          this.cache.set(itemKey, {
            value: value,
            index: this.queue.length - 1,
          });
        } else if (itemValue.index > index) {
          this.cache.set(itemKey, {
            value: itemValue.value,
            index: itemValue.index - 1,
          });
        }
      });

      this.timer[key] = setTimeout(() => this.willDeleteData(key, this.queue, this.cache), this.timeout);
    }
  }

  // 设置缓存大小
  setSize = (size) => {
    if (this.hasSetUp) return null;

    this.size = Number(size);
    this.hasSetUp = true;
  }

  // 设置缓存过期时间
  setTimeout = (time) => {
    if (this.hasSetUp) return null;

    this.timeout = time * 1000;
    this.hasSetUp = true;
  }

  static willDeleteData = (key, queue, cache) => {
    let index = -1;
    queue.forEach((item, i) => {
      if (item.key === key) {
        index = i;
      }
    });

    if (index < 0) return;

    queue.splice(index, 1);
    cache.delete(key);
    cache.forEach((itemValue, itemKey) => {
      if (itemValue.index > index) {
        cache.set(itemKey, {
          value: itemValue.value,
          index: itemValue.index - 1,
        });
      }
    });
  }
}
