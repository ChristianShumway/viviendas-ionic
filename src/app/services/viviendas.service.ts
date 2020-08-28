import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViviendasService {
  
  constructor(
    private http: HttpClient
  ) { }

  async getViviendas(cveEnt, cveEnc) {
    const livingPlaces = await this.http.get<any>( `leaflet_web/getViviendas.do?cve_ent=${cveEnt}&cve_enc=${cveEnc}`).toPromise(); 
    return livingPlaces;
  }

  makePopup(lon: any, lat: any): string {
    return `<div>Latitud: ${lat}</div> <div>Longitud: ${lon}</div>`
  }
  
}
