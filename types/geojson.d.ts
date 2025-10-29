declare namespace GeoJSON {
  type Position = number[];

  interface Geometry {
    type: string;
  }

  interface Point extends Geometry {
    type: "Point";
    coordinates: Position;
  }

  interface Polygon extends Geometry {
    type: "Polygon";
    coordinates: Position[][];
  }

  interface MultiPolygon extends Geometry {
    type: "MultiPolygon";
    coordinates: Position[][][];
  }

  interface Feature<G = Geometry, P = Record<string, any>> {
    type: "Feature";
    geometry: G;
    properties: P;
    id?: string | number;
  }

  interface FeatureCollection<G = Geometry, P = Record<string, any>> {
    type: "FeatureCollection";
    features: Array<Feature<G, P>>;
  }
}

declare module "geojson" {
  export type Position = GeoJSON.Position;
  export interface Geometry extends GeoJSON.Geometry {}
  export interface Point extends GeoJSON.Point {}
  export interface Polygon extends GeoJSON.Polygon {}
  export interface MultiPolygon extends GeoJSON.MultiPolygon {}
  export interface Feature<G = GeoJSON.Geometry, P = Record<string, any>>
    extends GeoJSON.Feature<G, P> {}
  export interface FeatureCollection<
    G = GeoJSON.Geometry,
    P = Record<string, any>
  > extends GeoJSON.FeatureCollection<G, P> {}
}

declare module "*.geojson" {
  const value: any;
  export default value;
}