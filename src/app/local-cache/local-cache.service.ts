import { Injectable } from '@angular/core';

export interface CacheItem {  
  value: any;
  expireDate: number;
}

@Injectable()

export class LocalCacheService {  
  isCacheItem = function (object: any): object is CacheItem {
    return 'value' in object;
}

  constructor() { }

  /**
   * Custom cache service using browser local storage
   * @param key Key/Name of the item. Should be unique.
   * @param value String value.
   * @param creationTime Creation time of the object or respone timestamp.
   * @param expireAfter Interval in sec
   */
  public add(key: string, data: any, creationDate: number, expireAfter: number): void {
    // Check if the key already exists
    if (this.get(key) == null) {
      // Create a new cache item object 
      // TODO: Encrypt data
      let cacheItem = { value: data, expireDate: creationDate + (expireAfter * 1000)};
      // Add to the browser local storage
      localStorage.setItem(key, JSON.stringify(cacheItem));
    }
  }

  public get(key: string): any {
    let value = localStorage.getItem(key);
    // Check if value for the given key exists
    if (value == null) return null;    
    // Parse cached item
    let cacheItem = JSON.parse(value);
    // Check if item has expired or not
    if (!this.isCacheItem(cacheItem)) {
      // Remove from cache and return null
      this.remove(key);
      return null;
    }

    if (this.isExpired(cacheItem.expireDate)) {
      this.remove(key);
      return cacheItem.value;
    }

    return cacheItem.value;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  private isExpired(expirationDate: number): boolean {
    return expirationDate <= Date.now();
  }
}
