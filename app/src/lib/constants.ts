import { Platform } from 'react-native';

export const APP_NAME = 'Unisocial';
export const isAndroid = Platform.OS === 'android';
export const PAGE_SIZE = 10;
export const HEARTBEAT_INTERVAL = 1000 * 60 * 4; // 4 minutes

export const imagesPlaceholder = [
  {
    uri: 'https://picsum.photos/seed/696/3000/2000',
    id: 1,
  },
  {
    uri: 'https://picsum.photos/id/740/200/300',
    id: 2,
  },
  {
    uri: 'https://picsum.photos/id/200/2180/400',
    id: 3,
  },
  {
    uri: 'https://picsum.photos/id/12/600/400',
    id: 4,
  },
];

export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = 'blob';

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open('GET', uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}
