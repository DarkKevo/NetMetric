export interface ServerOption {
  id: string;
  label: string;
  value: string;
}

export const SERVERS: ServerOption[] = [
  { id: "london-s3", label: "London, UK", value: "LONDON // S3" },
  { id: "paris-fr1", label: "Paris, FR", value: "PARIS // FR1" },
  { id: "nyc-us1", label: "New York, US", value: "NEW YORK // US1" },
];
