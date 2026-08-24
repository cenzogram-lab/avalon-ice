import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Billboard, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Loader2, X } from "lucide-react";
import type { ComponentRef } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type OrbitControlsImpl = ComponentRef<typeof OrbitControls>;

/* ------------------------------------------------------------------ */
/* Brand palette                                                       */
/* ------------------------------------------------------------------ */

const ICE_TOP = "#F1F9F7";
const ICE_SIDE = "#A9D2D6";
const NAVY = "#0C3552";
const FROST = "#7FB0BA";
const FROST_L = "#A3CCD1";
const PIN_RED = "#C8322B";
const PIN_STEM = "#99231C";
const CREAM = "#F7F2EA";
const SHELL = "#FDFCF8";

/* ------------------------------------------------------------------ */
/* Towns, routes (lat/lon) — South Jersey + shore, origin Woodbine HQ  */
/* ------------------------------------------------------------------ */

interface Town {
  n: string;
  ll: [number, number];
  hub?: boolean;
  origin?: boolean;
  inland?: boolean;
}

const TOWNS: Town[] = [
  { n: "Cape May", ll: [38.9351, -74.906], hub: true },
  { n: "West Cape May", ll: [38.9387, -74.9418] },
  { n: "Wildwood Crest", ll: [38.9757, -74.8329] },
  { n: "Wildwood", ll: [38.9918, -74.8146], hub: true },
  { n: "North Wildwood", ll: [39.0007, -74.7994] },
  { n: "Rio Grande", ll: [39.0117, -74.8807] },
  { n: "Stone Harbor", ll: [39.0479, -74.7649] },
  { n: "Cape May Court House", ll: [39.0827, -74.8237] },
  { n: "Marmora", ll: [39.2662, -74.6499] },
  { n: "Tuckahoe", ll: [39.2882, -74.7532] },
  { n: "Millville", ll: [39.4021, -75.0393], hub: true, inland: true },
  { n: "Vineland", ll: [39.4864, -75.0257], hub: true, inland: true },
  { n: "Avalon", ll: [39.1007, -74.7177], hub: true },
  { n: "Sea Isle City", ll: [39.1537, -74.6927], hub: true },
  { n: "Strathmere", ll: [39.2007, -74.656] },
  { n: "Ocean City", ll: [39.2776, -74.5746] },
  { n: "Somers Point", ll: [39.3187, -74.6113] },
  { n: "Margate City", ll: [39.3279, -74.5035] },
  { n: "Ventnor City", ll: [39.3401, -74.4771] },
  { n: "Atlantic City", ll: [39.3643, -74.4229], hub: true },
  { n: "Brigantine", ll: [39.4101, -74.3646] },
  { n: "Beach Haven", ll: [39.5626, -74.2432] },
  { n: "Surf City", ll: [39.6612, -74.171] },
  { n: "Barnegat Light", ll: [39.7534, -74.1121] },
  { n: "Seaside Park", ll: [39.9276, -74.0782] },
  { n: "Seaside Heights", ll: [39.9443, -74.0731] },
  { n: "Toms River", ll: [39.9537, -74.1979], hub: true },
  { n: "Bay Head", ll: [40.0768, -74.0454] },
  { n: "Point Pleasant Beach", ll: [40.0913, -74.0451] },
  { n: "Manasquan", ll: [40.1262, -74.0454] },
  { n: "Spring Lake", ll: [40.1534, -74.0287] },
  { n: "Belmar", ll: [40.1785, -74.0182] },
  { n: "Bradley Beach", ll: [40.202, -74.0121] },
  { n: "Ocean Grove", ll: [40.2118, -74.006] },
  { n: "Asbury Park", ll: [40.2204, -74.0121], hub: true },
  { n: "Long Branch", ll: [40.3043, -73.9924], hub: true },
  { n: "Sea Bright", ll: [40.3615, -73.9718] },
  { n: "Sandy Hook", ll: [40.4237, -73.9915] },
  { n: "Trenton", ll: [40.2206, -74.7597], hub: true, inland: true },
  { n: "Newark", ll: [40.7357, -74.1724], hub: true, inland: true },
  { n: "Jersey City", ll: [40.7178, -74.0431], hub: true, inland: true },
];

/** Woodbine HQ — every route starts here. */
const HQ_LL: [number, number] = [39.2418, -74.8149];

const ROUTE_LL: [number, number][] = [
  HQ_LL,
  [39.1007, -74.7177],
  [39.1537, -74.6927],
  [39.24, -74.63],
  [39.3187, -74.6113],
  [39.43, -74.48],
  [39.58, -74.32],
  [39.74, -74.22],
  [39.87, -74.205],
  [39.9537, -74.1979],
  [40.07, -74.14],
  [40.2, -74.11],
  [40.34, -74.13],
  [40.48, -74.17],
  [40.62, -74.19],
  [40.7357, -74.1724],
  [40.7178, -74.0431],
];
const SPUR_LL: [number, number][] = [
  [40.07, -74.14],
  [40.05, -74.38],
  [40.12, -74.58],
  [40.2206, -74.7597],
];

/** Southern run: HQ → Court House → Rio Grande → Wildwood → Cape May. */
const SOUTH_LL: [number, number][] = [
  HQ_LL,
  [39.0827, -74.8237],
  [39.0117, -74.8807],
  [38.9918, -74.8146],
  [38.9351, -74.906],
];

const WATER: { n: string; ll: [number, number] }[] = [
  { n: "Atlantic Ocean", ll: [39.02, -73.78] },
  { n: "Delaware Bay", ll: [38.62, -75.05] },
  { n: "Raritan Bay", ll: [40.78, -73.72] },
];

function blurb(t: Town): string {
  if (t.origin)
    return "Every route starts here. Packaged and bulk ice, loaded before dawn.";
  if (t.inland) return "Served daily up the Parkway from the shore.";
  if (t.hub) return "Priority same-day and scheduled commercial delivery.";
  return "On the shore run — bars, marinas, venues, and events.";
}

/* ------------------------------------------------------------------ */
/* Geometry: real us-atlas TopoJSON with a hand-drawn fallback         */
/* ------------------------------------------------------------------ */

/** Approximate NJ silhouette (lat, lon) used if the atlas fetch fails. */
const FALLBACK_OUTLINE: [number, number][] = [
  [38.93, -74.96],
  [39.03, -74.91],
  [39.18, -74.98],
  [39.26, -75.05],
  [39.45, -75.54],
  [39.61, -75.56],
  [39.69, -75.51],
  [39.88, -75.14],
  [40.02, -74.86],
  [40.22, -74.77],
  [40.42, -75.06],
  [40.58, -75.19],
  [40.87, -75.09],
  [40.98, -75.13],
  [41.36, -74.7],
  [41.2, -74.37],
  [41.1, -73.92],
  [40.85, -73.97],
  [40.64, -74.06],
  [40.5, -74.26],
  [40.44, -74.24],
  [40.47, -74.05],
  [40.42, -73.97],
  [40.1, -74.03],
  [39.75, -74.09],
  [39.5, -74.28],
  [39.36, -74.41],
  [39.2, -74.65],
  [39.0, -74.79],
];

/** Approximate county borders (lat, lon polylines) for the fallback. */
const FALLBACK_COUNTIES: [number, number][][] = [
  [
    [39.18, -74.98],
    [39.29, -74.68],
    [39.5, -74.28],
  ],
  [
    [39.45, -75.54],
    [39.55, -74.95],
    [39.58, -74.32],
  ],
  [
    [39.88, -75.14],
    [39.85, -74.65],
    [39.75, -74.09],
  ],
  [
    [40.22, -74.77],
    [40.1, -74.45],
    [40.1, -74.03],
  ],
  [
    [40.42, -75.06],
    [40.35, -74.6],
    [40.34, -74.2],
  ],
  [
    [40.87, -75.09],
    [40.72, -74.6],
    [40.64, -74.06],
  ],
  [
    [41.2, -74.37],
    [40.95, -74.3],
    [40.85, -73.97],
  ],
];

interface GeoData {
  /** polygons → rings (outer first) → [lon, lat] points */
  polygons: [number, number][][][];
  /** county border polylines → [lon, lat] points */
  counties: [number, number][][];
}

/* Minimal TopoJSON support: enough to decode us-atlas states/counties. */
interface TopoTransform {
  scale: [number, number];
  translate: [number, number];
}
interface TopoGeometry {
  type: string;
  id?: string | number;
  properties?: { name?: string };
  arcs?: unknown;
  geometries?: TopoGeometry[];
}
interface Topology {
  transform?: TopoTransform;
  arcs: [number, number][][];
  objects: Record<string, TopoGeometry>;
}

function decodeArc(topo: Topology, index: number): [number, number][] {
  const reversed = index < 0;
  const arc = topo.arcs[reversed ? ~index : index];
  const pts: [number, number][] = [];
  if (topo.transform) {
    const [sx, sy] = topo.transform.scale;
    const [tx, ty] = topo.transform.translate;
    let x = 0;
    let y = 0;
    for (const [dx, dy] of arc) {
      x += dx;
      y += dy;
      pts.push([x * sx + tx, y * sy + ty]);
    }
  } else {
    for (const p of arc) pts.push([p[0], p[1]]);
  }
  if (reversed) pts.reverse();
  return pts;
}

function ringCoords(topo: Topology, ring: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const arcIndex of ring) {
    const pts = decodeArc(topo, arcIndex);
    for (let i = out.length > 0 ? 1 : 0; i < pts.length; i++) out.push(pts[i]);
  }
  return out;
}

function geometryPolygons(
  topo: Topology,
  geom: TopoGeometry,
): [number, number][][][] {
  if (geom.type === "Polygon") {
    const rings = geom.arcs as number[][];
    return [rings.map((r) => ringCoords(topo, r))];
  }
  if (geom.type === "MultiPolygon") {
    const polys = geom.arcs as number[][][];
    return polys.map((rings) => rings.map((r) => ringCoords(topo, r)));
  }
  return [];
}

function countyBorderLines(topo: Topology): [number, number][][] {
  const counties = topo.objects.counties?.geometries ?? [];
  const nj = counties.filter((g) =>
    String(g.id ?? "")
      .padStart(5, "0")
      .startsWith("34"),
  );
  const useCount = new Map<number, number>();
  const visit = (ring: number[]) => {
    for (const ai of ring) {
      const idx = ai < 0 ? ~ai : ai;
      useCount.set(idx, (useCount.get(idx) ?? 0) + 1);
    }
  };
  for (const g of nj) {
    if (g.type === "Polygon") for (const r of g.arcs as number[][]) visit(r);
    if (g.type === "MultiPolygon")
      for (const poly of g.arcs as number[][][]) for (const r of poly) visit(r);
  }
  const lines: [number, number][][] = [];
  for (const [idx, count] of useCount) {
    if (count >= 2) lines.push(decodeArc(topo, idx));
  }
  return lines;
}

async function loadGeoData(): Promise<GeoData> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json",
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const topo = (await res.json()) as Topology;
  const states = topo.objects.states?.geometries ?? [];
  const nj = states.find((g) => g.properties?.name === "New Jersey");
  if (!nj) throw new Error("New Jersey not found");
  const polygons = geometryPolygons(topo, nj);

  let counties: [number, number][][] = [];
  try {
    const cRes = await fetch(
      "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json",
    );
    if (cRes.ok) counties = countyBorderLines((await cRes.json()) as Topology);
  } catch {
    // county detail is optional
  }
  return { polygons, counties };
}

function fallbackGeoData(): GeoData {
  return {
    polygons: [[FALLBACK_OUTLINE.map(([lat, lon]) => [lon, lat])]],
    counties: FALLBACK_COUNTIES.map((line) =>
      line.map(([lat, lon]) => [lon, lat] as [number, number]),
    ),
  };
}

/* ------------------------------------------------------------------ */
/* Mercator projection fitted to the NJ geometry (≈ d3.fitExtent)      */
/* ------------------------------------------------------------------ */

type Projection = (lonLat: [number, number]) => [number, number];

function mercatorRaw([lon, lat]: [number, number]): [number, number] {
  const x = (lon * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, -y]; // screen-style y (down)
}

function buildProjection(polygons: [number, number][][][]): {
  proj: Projection;
  cx: number;
  cy: number;
} {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const poly of polygons) {
    for (const p of poly[0]) {
      const [x, y] = mercatorRaw(p);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const k = Math.min(150 / (maxX - minX), 150 / (maxY - minY));
  const proj: Projection = (ll) => {
    const [x, y] = mercatorRaw(ll);
    return [x * k, y * k];
  };
  return {
    proj,
    cx: ((minX + maxX) / 2) * k,
    cy: ((minY + maxY) / 2) * k,
  };
}

/* ------------------------------------------------------------------ */
/* Canvas textures: dashed roadway + truck livery                      */
/* ------------------------------------------------------------------ */

function makeDashTexture(repeat: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 8;
  const x = c.getContext("2d");
  if (x) {
    x.fillStyle = NAVY;
    x.fillRect(0, 0, 64, 8);
    x.fillStyle = CREAM;
    x.fillRect(5, 2, 24, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const x = c.getContext("2d");
  if (x) {
    const g = x.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(163,204,209,0.9)");
    g.addColorStop(0.4, "rgba(163,204,209,0.35)");
    g.addColorStop(1, "rgba(163,204,209,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeTruckSideTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const x = c.getContext("2d");
  if (x) {
    x.fillStyle = SHELL;
    x.fillRect(0, 0, 256, 128);
    x.strokeStyle = NAVY;
    x.lineWidth = 7;
    x.strokeRect(4, 4, 248, 120);
    x.fillStyle = NAVY;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = 'bold 44px Georgia, "Times New Roman", serif';
    x.fillText("AVALON", 128, 46);
    x.fillStyle = FROST;
    x.fillRect(56, 74, 144, 7);
    x.fillStyle = NAVY;
    x.font = 'bold 36px Georgia, "Times New Roman", serif';
    x.fillText("ICE", 128, 101);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

const EXTRUDE_DEPTH = 14;
const TOP_Y = EXTRUDE_DEPTH + 1.6; // extrusion + bevel

interface MapSpace {
  proj: Projection;
  cx: number;
  cy: number;
}

function toWorld(
  space: MapSpace,
  lon: number,
  lat: number,
  y: number,
): THREE.Vector3 {
  const [px, py] = space.proj([lon, lat]);
  return new THREE.Vector3(px - space.cx, y, py - space.cy);
}

function LandMass({ geo, space }: { geo: GeoData; space: MapSpace }) {
  const { geometry, edges } = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const rings of geo.polygons) {
      const toShapePts = (ring: [number, number][]) =>
        ring.map((ll) => {
          const [px, py] = space.proj(ll);
          return new THREE.Vector2(px - space.cx, -(py - space.cy));
        });
      const outer = toShapePts(rings[0]);
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (const p of outer) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      if (Math.hypot(maxX - minX, maxY - minY) < 1.2) continue;
      const shape = new THREE.Shape(outer);
      for (let i = 1; i < rings.length; i++) {
        const hole = toShapePts(rings[i]);
        if (hole.length > 3) shape.holes.push(new THREE.Path(hole));
      }
      shapes.push(shape);
    }
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: EXTRUDE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 1.6,
      bevelSize: 1.2,
      bevelOffset: 0,
      bevelSegments: 2,
      curveSegments: 1,
    });
    g.computeVertexNormals();
    return { geometry: g, edges: new THREE.EdgesGeometry(g, 32) };
  }, [geo, space]);

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: ICE_TOP,
        roughness: 0.34,
        metalness: 0.03,
      }),
      new THREE.MeshStandardMaterial({
        color: ICE_SIDE,
        roughness: 0.46,
        metalness: 0.03,
      }),
    ],
    [],
  );

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry} material={materials} castShadow receiveShadow />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={FROST} transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

function CountyLines({
  geo,
  space,
  visible,
}: {
  geo: GeoData;
  space: MapSpace;
  visible: boolean;
}) {
  const geometry = useMemo(() => {
    const y = TOP_Y + 0.14;
    const pos: number[] = [];
    for (const line of geo.counties) {
      for (let i = 0; i < line.length - 1; i++) {
        const a = toWorld(space, line[i][0], line[i][1], y);
        const b = toWorld(space, line[i + 1][0], line[i + 1][1], y);
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [geo, space]);

  return (
    <lineSegments geometry={geometry} visible={visible}>
      <lineBasicMaterial color={NAVY} transparent opacity={0.24} />
    </lineSegments>
  );
}

interface RouteHandle {
  curve: THREE.CatmullRomCurve3;
  texture: THREE.CanvasTexture;
  speed: number;
}

function useRoute(
  space: MapSpace,
  lls: [number, number][],
  radius: number,
  dashes: number,
  speed: number,
): { handle: RouteHandle; geometry: THREE.TubeGeometry } {
  return useMemo(() => {
    const pts = lls.map(([lat, lon]) => toWorld(space, lon, lat, TOP_Y + 0.9));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
    const texture = makeDashTexture(dashes);
    const geometry = new THREE.TubeGeometry(curve, 300, radius, 12, false);
    return { handle: { curve, texture, speed }, geometry };
  }, [space, lls, radius, dashes, speed]);
}

function RouteMesh({
  handle,
  geometry,
}: {
  handle: RouteHandle;
  geometry: THREE.TubeGeometry;
}) {
  useFrame((_, dt) => {
    handle.texture.offset.x -= Math.min(dt, 0.05) * handle.speed * 12;
  });
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        map={handle.texture}
        color="#FFFFFF"
        roughness={0.5}
        metalness={0.05}
      />
    </mesh>
  );
}

function Truck({
  curve,
  offset,
  speed,
}: {
  curve: THREE.CatmullRomCurve3;
  offset: number;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(offset);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const livery = useMemo(() => makeTruckSideTexture(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const g = group.current;
    if (!g) return;
    t.current = (t.current + dt * speed) % 1;
    curve.getPointAt(t.current, tmp);
    g.position.copy(tmp);
    // Clamp the look-ahead instead of wrapping it, so the truck doesn't
    // whip toward the route start for one frame at the end of a lap.
    const ahead = curve.getPointAt(Math.min(0.9999, t.current + 0.006));
    g.lookAt(ahead.x, tmp.y, ahead.z);
  });

  const wheelPositions: [number, number][] = [
    [-2.2, -2.9],
    [2.2, -2.9],
    [-2.2, 0.8],
    [2.2, 0.8],
    [-2.2, 5.3],
    [2.2, 5.3],
  ];

  return (
    <group ref={group} scale={1.3}>
      {/* Box body: liveried sides, shell everywhere else */}
      <mesh position={[0, 3.3, -1]} castShadow>
        <boxGeometry args={[4.2, 4.4, 9.2]} />
        <meshStandardMaterial
          attach="material-0"
          map={livery}
          roughness={0.42}
        />
        <meshStandardMaterial
          attach="material-1"
          map={livery}
          roughness={0.42}
        />
        <meshStandardMaterial
          attach="material-2"
          color={SHELL}
          roughness={0.4}
        />
        <meshStandardMaterial
          attach="material-3"
          color={SHELL}
          roughness={0.4}
        />
        <meshStandardMaterial
          attach="material-4"
          color={SHELL}
          roughness={0.4}
        />
        <meshStandardMaterial
          attach="material-5"
          color={SHELL}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 2.8, 5.5]} castShadow>
        <boxGeometry args={[4.2, 3.4, 3.7]} />
        <meshStandardMaterial color={NAVY} roughness={0.42} metalness={0.1} />
      </mesh>
      <mesh position={[0, 3.5, 7.35]}>
        <boxGeometry args={[3.6, 1.5, 0.25]} />
        <meshStandardMaterial
          color={FROST_L}
          roughness={0.38}
          emissive={FROST}
          emissiveIntensity={0.28}
        />
      </mesh>
      {wheelPositions.map(([wx, wz]) => (
        <mesh
          key={`${wx}:${wz}`}
          position={[wx, 1.3, wz]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[1.32, 1.32, 0.9, 20]} />
          <meshStandardMaterial color={NAVY} roughness={0.42} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Towns render as small navy dots on the ice (like the county map art).
 * The red map-pin tag only appears on the town the user selects — the
 * Woodbine HQ beacon stays the one prominent marker otherwise.
 */
function TownPin({
  town,
  space,
  selected,
  onSelect,
}: {
  town: Town;
  space: MapSpace;
  selected: boolean;
  onSelect: (t: Town) => void;
}) {
  const dotRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const headR = town.hub ? 2.3 : 1.9;
  const stemH = headR * 2.7;
  const dotR = town.hub ? 1.15 : 0.95;
  const pos = toWorld(space, town.ll[1], town.ll[0], TOP_Y);

  useFrame(() => {
    const dot = dotRef.current;
    if (dot) {
      const target = hovered && !selected ? 1.7 : 1;
      dot.scale.setScalar(THREE.MathUtils.lerp(dot.scale.x, target, 0.2));
    }
    // The red tag pops in with a quick grow when its town is chosen.
    const pin = pinRef.current;
    if (pin) {
      const target = selected ? 1 : 0.001;
      pin.scale.setScalar(THREE.MathUtils.lerp(pin.scale.x, target, 0.18));
    }
  });

  return (
    <group position={pos}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: R3F mesh, not a DOM node — keyboard selection is available via the town dropdown */}
      <mesh
        ref={dotRef}
        position={[0, 0.5, 0]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(town);
        }}
      >
        <sphereGeometry args={[dotR, 18, 14]} />
        <meshStandardMaterial
          color={PIN_RED}
          roughness={0.32}
          metalness={0.06}
        />
      </mesh>

      {/* Red map-pin tag, shown only for the selected town */}
      <group ref={pinRef} scale={0.001} visible={selected}>
        <mesh
          position={[0, stemH / 2, 0]}
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <coneGeometry args={[headR * 0.7, stemH, 22]} />
          <meshStandardMaterial
            color={PIN_STEM}
            roughness={0.4}
            metalness={0.06}
          />
        </mesh>
        <mesh position={[0, stemH + headR * 0.5, 0]} castShadow>
          <sphereGeometry args={[headR, 26, 20]} />
          <meshStandardMaterial
            color={PIN_RED}
            roughness={0.32}
            metalness={0.06}
          />
        </mesh>
      </group>
      {selected && (
        <Html
          center
          position={[0, stemH + headR * 2 + 2.5, 0]}
          zIndexRange={[30, 0]}
        >
          <div className="pointer-events-none whitespace-nowrap rounded-full border-2 border-navy bg-cream-bright px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-navy shadow-[0_3px_0_rgba(12,53,82,0.35)]">
            {town.n}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * The one prominent marker on the map: a Great Blue Heron teardrop pin
 * hovering over the Woodbine HQ warehouse, with pulsing dispatch rings —
 * mirroring the brand county-map artwork.
 */
function HeronBeacon({ space }: { space: MapSpace }) {
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/images/avalon-heron.webp",
  );
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const bobRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const glow = useMemo(() => makeGlowTexture(), []);
  const pos = toWorld(space, HQ_LL[1], HQ_LL[0], TOP_Y);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (offset: number, mesh: THREE.Mesh | null) => {
      if (!mesh) return;
      const p = ((t + offset) % 2.4) / 2.4;
      mesh.scale.setScalar(0.5 + p * 2.1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - p);
    };
    pulse(0, ringA.current);
    pulse(0.8, ringB.current);
    pulse(1.6, ringC.current);
    const bob = bobRef.current;
    if (bob) bob.position.y = Math.sin(t * 1.4) * 0.8;
    // Breathing halo behind the pin
    const g = glowRef.current;
    if (g) {
      const s = 1 + Math.sin(t * 2.2) * 0.12;
      g.scale.setScalar(s);
      (g.material as THREE.MeshBasicMaterial).opacity =
        0.75 + Math.sin(t * 2.2) * 0.2;
    }
  });

  return (
    <group position={pos}>
      {/* Pulsing dispatch rings on the ice */}
      {[ringA, ringB, ringC].map((ref, i) => (
        <mesh
          key={`pulse-${i.toString()}`}
          ref={ref}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.2, 0]}
        >
          <ringGeometry args={[6.6, 7.8, 56]} />
          <meshBasicMaterial color="#1B4F70" transparent opacity={0.55} />
        </mesh>
      ))}

      {/* HQ warehouse: cream shell with a navy roof, like the map art */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[6.4, 3, 5]} />
          <meshStandardMaterial color={SHELL} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.35, 0]} castShadow>
          <boxGeometry args={[6.9, 0.8, 5.5]} />
          <meshStandardMaterial color={NAVY} roughness={0.42} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.35, 2.55]}>
          <boxGeometry args={[2.4, 2.1, 0.15]} />
          <meshStandardMaterial color={FROST_L} roughness={0.4} />
        </mesh>
      </group>

      {/* Teardrop heron pin floating above the warehouse, wrapped in a
          breathing ice-blue halo so the HQ reads from any zoom level */}
      <group ref={bobRef}>
        <Billboard position={[0, 18, 0]}>
          <mesh ref={glowRef} position={[0, -1, -0.2]}>
            <planeGeometry args={[26, 26]} />
            <meshBasicMaterial
              map={glow}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
          {/* tail */}
          <mesh position={[0, -7, -0.05]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.7, 6.6, 4]} />
            <meshBasicMaterial color={NAVY} />
          </mesh>
          <mesh>
            <circleGeometry args={[6.2, 48]} />
            <meshBasicMaterial color={NAVY} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[5.5, 48]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </Billboard>
      </group>

      <Html center position={[0, 29.5, 0]} zIndexRange={[28, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full border-2 border-navy bg-navy px-4 py-1.5 font-body text-sm font-bold uppercase tracking-wider text-cream-bright shadow-[0_3px_0_#061F33]">
          Woodbine HQ
        </div>
      </Html>
    </group>
  );
}

function WaterLabels({ space }: { space: MapSpace }) {
  return (
    <group>
      {WATER.map((w) => (
        <Html
          key={w.n}
          center
          position={toWorld(space, w.ll[1], w.ll[0], -2.5)}
          zIndexRange={[20, 0]}
        >
          <span className="pointer-events-none whitespace-nowrap font-body text-[0.65rem] font-semibold uppercase italic tracking-[0.28em] text-lagoon-soft/85">
            {w.n}
          </span>
        </Html>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera: orthographic with eased fly-to on selection                  */
/* ------------------------------------------------------------------ */

const VIEW = 72;

interface Flight {
  t: number;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  fromZoom: number;
  toZoom: number;
}

function CameraRig({
  controlsRef,
  flightRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  flightRef: React.MutableRefObject<Flight | null>;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  // Base zoom shows the whole state (2*VIEW world units tall).
  const baseZoom = size.height / (VIEW * 2);

  useEffect(() => {
    camera.zoom = baseZoom;
    camera.updateProjectionMatrix();
  }, [camera, baseZoom]);

  useFrame((_, rawDt) => {
    const flight = flightRef.current;
    if (!flight) return;
    const dt = Math.min(rawDt, 0.05);
    flight.t = Math.min(1, flight.t + dt / 0.9);
    const e = 1 - (1 - flight.t) ** 3;
    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerpVectors(flight.fromTarget, flight.toTarget, e);
      controls.update();
    }
    camera.zoom =
      (flight.fromZoom + (flight.toZoom - flight.fromZoom) * e) * baseZoom;
    camera.updateProjectionMatrix();
    if (flight.t >= 1) flightRef.current = null;
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Map component                                                       */
/* ------------------------------------------------------------------ */

const TRUCK_RUNS = [
  { route: "A", offset: 0.0, speed: 0.03 },
  { route: "A", offset: 0.38, speed: 0.03 },
  { route: "A", offset: 0.72, speed: 0.03 },
  { route: "B", offset: 0.2, speed: 0.02 },
  { route: "C", offset: 0.5, speed: 0.025 },
] as const;

function MapScene({
  geo,
  space,
  selected,
  showCounties,
  onSelect,
  controlsRef,
  flightRef,
}: {
  geo: GeoData;
  space: MapSpace;
  selected: Town | null;
  showCounties: boolean;
  onSelect: (t: Town) => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  flightRef: React.MutableRefObject<Flight | null>;
}) {
  const routeA = useRoute(space, ROUTE_LL, 0.55, 120, 0.055);
  const routeB = useRoute(space, SPUR_LL, 0.38, 60, 0.03);
  const routeC = useRoute(space, SOUTH_LL, 0.42, 52, 0.04);
  const curves = {
    A: routeA.handle.curve,
    B: routeB.handle.curve,
    C: routeC.handle.curve,
  };

  return (
    <>
      <hemisphereLight args={["#FFFFFF", CREAM, 1.15]} />
      <directionalLight
        position={[78, 132, 54]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-140}
        shadow-camera-right={140}
        shadow-camera-top={140}
        shadow-camera-bottom={-140}
        shadow-camera-near={1}
        shadow-camera-far={420}
        shadow-bias={-0.004}
        shadow-normalBias={0.6}
      />
      <directionalLight
        position={[-70, 48, -66]}
        intensity={0.22}
        color="#E8F2F0"
      />

      {/* Paper "ocean" beneath the ice shelf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[900, 900]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>

      <LandMass geo={geo} space={space} />
      <CountyLines geo={geo} space={space} visible={showCounties} />

      <RouteMesh handle={routeA.handle} geometry={routeA.geometry} />
      <RouteMesh handle={routeB.handle} geometry={routeB.geometry} />
      <RouteMesh handle={routeC.handle} geometry={routeC.geometry} />
      {TRUCK_RUNS.map((run, i) => (
        <Truck
          key={`truck-${i.toString()}`}
          curve={curves[run.route]}
          offset={run.offset}
          speed={run.speed}
        />
      ))}

      {TOWNS.map((town) => (
        <TownPin
          key={town.n}
          town={town}
          space={space}
          selected={selected?.n === town.n}
          onSelect={onSelect}
        />
      ))}

      <Suspense fallback={null}>
        <HeronBeacon space={space} />
      </Suspense>
      <WaterLabels space={space} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.085}
        enablePan={false}
        enableZoom
        enableRotate
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI * 0.46}
        minZoom={3}
        maxZoom={40}
        rotateSpeed={0.85}
        zoomSpeed={0.9}
        // Touch: one finger orbits the state, two fingers pinch-zoom.
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
      <CameraRig controlsRef={controlsRef} flightRef={flightRef} />
    </>
  );
}

export default function NJDeliveryMap() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [selected, setSelected] = useState<Town | null>(null);
  const [showCounties, setShowCounties] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const flightRef = useRef<Flight | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGeoData()
      .then((data) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setGeo(fallbackGeoData());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const space = useMemo<MapSpace | null>(() => {
    if (!geo) return null;
    const { proj, cx, cy } = buildProjection(geo.polygons);
    return { proj, cx, cy };
  }, [geo]);

  const flyTo = (target: THREE.Vector3, zoom: number) => {
    const controls = controlsRef.current;
    const currentZoom =
      controls && "zoom" in controls.object
        ? ((controls.object as THREE.OrthographicCamera).zoom /
            Math.max(controls.domElement?.clientHeight ?? 1, 1)) *
          (VIEW * 2)
        : 1;
    flightRef.current = {
      t: 0,
      fromTarget: controls
        ? controls.target.clone()
        : new THREE.Vector3(0, 0, 0),
      toTarget: new THREE.Vector3(target.x, 0, target.z),
      fromZoom: currentZoom,
      toZoom: zoom,
    };
  };

  const handleSelect = (town: Town) => {
    if (!space) return;
    setSelected(town);
    flyTo(
      toWorld(space, town.ll[1], town.ll[0], TOP_Y),
      town.origin ? 1.8 : town.hub ? 1.9 : 2.2,
    );
  };

  const handleReset = () => {
    setSelected(null);
    flyTo(new THREE.Vector3(0, 0, 0), 1);
  };

  const groups = [
    { label: "Origin", towns: TOWNS.filter((t) => t.origin) },
    {
      label: "Delivery hubs",
      towns: TOWNS.filter((t) => t.hub && !t.origin && !t.inland),
    },
    { label: "Shore towns", towns: TOWNS.filter((t) => !t.hub) },
    { label: "Inland hubs", towns: TOWNS.filter((t) => t.inland) },
  ];

  return (
    <div className="map-touch-surface relative h-[26rem] w-full touch-none overflow-hidden sm:h-[32rem] lg:h-[36rem]">
      {!geo || !space ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-cream">
          <Loader2 className="size-8 animate-spin text-lagoon" />
          <p className="font-body text-sm font-semibold uppercase tracking-widest text-navy">
            Carving New Jersey out of ice…
          </p>
        </div>
      ) : (
        <Canvas
          shadows
          dpr={[1, 2]}
          orthographic
          camera={{ position: [96, 108, 104], near: -600, far: 1200, zoom: 4 }}
          aria-label="Interactive 3D map of the Avalon Ice New Jersey delivery network"
        >
          <color attach="background" args={[CREAM]} />
          <MapScene
            geo={geo}
            space={space}
            selected={selected}
            showCounties={showCounties}
            onSelect={handleSelect}
            controlsRef={controlsRef}
            flightRef={flightRef}
          />
        </Canvas>
      )}

      {/* Overlay controls */}
      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4">
        <Select
          value={selected?.n ?? ""}
          onValueChange={(name) => {
            const town = TOWNS.find((t) => t.n === name);
            if (town) handleSelect(town);
          }}
        >
          <SelectTrigger
            data-ocid="network.town_select"
            className="!h-12 w-44 rounded-full border-2 border-navy bg-gradient-ice-card font-body text-xs font-bold uppercase tracking-wider text-navy shadow-[0_4px_0_#A3CCD1]"
            aria-label="Select a town"
          >
            <SelectValue placeholder="Select a town" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {groups.map(
              (group) =>
                group.towns.length > 0 && (
                  <SelectGroup key={group.label}>
                    <SelectLabel className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-lagoon-soft">
                      {group.label}
                    </SelectLabel>
                    {group.towns.map((t) => (
                      <SelectItem key={t.n} value={t.n}>
                        {t.n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ),
            )}
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowCounties((v) => !v)}
          data-ocid="network.county_toggle"
          aria-pressed={showCounties}
          className={`h-12 rounded-full border-2 border-navy font-body text-xs font-bold uppercase tracking-wider shadow-[0_4px_0_#A3CCD1] hover:bg-navy hover:text-cream-bright ${
            showCounties
              ? "bg-navy text-cream-bright"
              : "bg-gradient-ice-card text-navy"
          }`}
        >
          County lines
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleReset}
          data-ocid="network.reset_view"
          className="h-12 rounded-full border-2 border-navy bg-gradient-ice-card font-body text-xs font-bold uppercase tracking-wider text-navy shadow-[0_4px_0_#A3CCD1] hover:bg-navy hover:text-cream-bright"
        >
          Reset view
        </Button>
      </div>

      {/* Stats card */}
      <div
        data-ocid="network.stats"
        className="absolute right-3 top-3 hidden rounded-xl border-2 border-navy bg-gradient-ice-card px-4 py-3 shadow-[0_6px_0_#A3CCD1] sm:right-4 sm:top-4 sm:block"
      >
        <dl className="font-body text-navy">
          {[
            { value: "1", label: "origin · Woodbine HQ" },
            {
              value: String(TOWNS.filter((t) => t.hub).length),
              label: "delivery hubs",
            },
            { value: String(TOWNS.length), label: "towns served" },
          ].map((row, i) => (
            <div
              key={row.label}
              className={`flex items-baseline gap-2 py-1.5 ${
                i > 0 ? "border-t border-navy/25" : ""
              }`}
            >
              <dt className="font-display text-lg leading-none">{row.value}</dt>
              <dd className="text-xs font-medium text-lagoon">{row.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-full border-2 border-navy bg-gradient-ice-card px-4 py-2 font-body text-[0.7rem] font-semibold text-lagoon shadow-[0_4px_0_#A3CCD1] sm:block">
        Pick a town above, or tap a town dot · drag to orbit
      </div>

      {/* Detail card */}
      {selected && (
        <div
          data-ocid="network.detail"
          className="absolute bottom-3 left-1/2 min-w-[15rem] max-w-xs -translate-x-1/2 rounded-xl border-2 border-navy bg-gradient-ice-card px-5 py-4 shadow-[0_6px_0_#A3CCD1]"
        >
          <button
            type="button"
            aria-label="Close town details"
            onClick={handleReset}
            className="absolute right-1 top-1 inline-flex size-11 items-center justify-center text-ice-deep hover:text-navy"
          >
            <X className="size-4" />
          </button>
          <p className="font-display text-lg leading-tight text-navy">
            {selected.n}
          </p>
          <span
            className={`mt-2 inline-block rounded-full border-2 border-navy px-2.5 py-1 font-body text-[0.6rem] font-bold uppercase tracking-[0.1em] ${
              selected.origin
                ? "bg-navy text-cream-bright"
                : "bg-cream-bright text-navy"
            }`}
          >
            {selected.origin
              ? "Origin Hub"
              : selected.hub
                ? "Delivery Hub"
                : "Shore Town Stop"}
          </span>
          <p className="mt-2.5 font-body text-xs leading-relaxed text-lagoon">
            {blurb(selected)}
          </p>
        </div>
      )}
    </div>
  );
}
