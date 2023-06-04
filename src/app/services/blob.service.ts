import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class BlobService {

  accountName = "storagesdcc";
  containerName = "blob-documenti";

  private containerClient(sas:string): ContainerClient{
    return new BlobServiceClient('https://'+this.accountName+'.blob.core.windows.net?'+sas)
    .getContainerClient(this.containerName);
  }

  public async getBlobsName(sas:string,utente:string): Promise<string[]> {
    let ret: string[] = [];
    let blobs = this.containerClient(sas).listBlobsFlat();
    for await (const blob of blobs){
      if(blob.name.startsWith(utente))
        ret.push(blob.name);
    }
    return ret;
  }

  public downloadBlob(name: string, sas:string, handler: (blob:Blob) => void){
    const blobClient = this.containerClient(sas).getBlobClient(name);
    blobClient.download().then(resp => {
      if(resp.blobBody){
        resp.blobBody.then(blob =>{
          handler(blob);
        })
      }
    })
  }

  public uploadBlob(content: Blob, name: string, sas:string, handler: () => void):string {
    let blockBlobClient = this.containerClient(sas).getBlockBlobClient(name);
    blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } })
      .then(() => handler())
    let url: string = blockBlobClient.url;
    return url; 
  }

  public deleteBlob( sas:string, name: string, handler: () => void) {
    let blockBlobClient = this.containerClient(sas);
    blockBlobClient.deleteBlob(name).then(() => {
      handler()
    })
  }

  public getUrl(name: string, sas:string):string{
    const blobClient = this.containerClient(sas).getBlobClient(name);
    return blobClient.url;
  }
}
