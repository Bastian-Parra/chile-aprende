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

declare module "*.geojson" {
  const value: RegionFeature;
  export default value;
}

export interface RegionFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][];
  };
  properties: {
    name: string;
    code: string;
  };
}
