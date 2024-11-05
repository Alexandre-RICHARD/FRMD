type Location = {
  x: number;
  y: number;
  z: number;
  rotation: number;
};
type FuelInventoryEntity = {
  Name: string;
  ClassName: string;
  Amount: number;
};
type Features = {
  properties: Properties;
  geometry: Geometry;
};
type Properties = {
  name: string;
  type: string;
};
type Geometry = {
  coordinates: Coordinates;
  type: string;
};
type Coordinates = {
  x: number;
  y: number;
  z: number;
};

export type ExplorerDto = {
  ID: string;
  Name: string;
  ClassName: string;
  location: Location;
  PathName: string;
  Status: string;
  CurrentGear: number;
  ForwardSpeed: number;
  EngineRPM: number;
  ThrottlePercent: number;
  Airborne: boolean;
  FollowingPath: boolean;
  Autopilot: boolean;
  Inventory?: null[] | null;
  FuelInventory?: (FuelInventoryEntity | null)[] | null;
  features: Features;
};