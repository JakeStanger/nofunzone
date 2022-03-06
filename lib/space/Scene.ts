import * as Three from 'three';
import CelestialObject from './CelestialObject';
import { GRAVITATIONAL_CONSTANT } from './utils';
import { Vector3 } from 'three';

class SpaceScene extends Three.Scene {
  private static instance: SpaceScene;

  public static font: Three.Font;

  private trails: Record<string, { line: Three.Line; points: Vector3[] }> = {};

  private tickCounter: number = 0;

  constructor() {
    super();

    SpaceScene.instance = this;
  }

  public static get() {
    return SpaceScene.instance;
  }

  public readonly celestialObjects: CelestialObject[] = [];

  public addCelestialObject(celestialObject: CelestialObject) {
    this.celestialObjects.push(celestialObject);
    this.add(celestialObject);

    const points = [celestialObject.position.clone()];
    const trailGeometry = new Three.BufferGeometry().setFromPoints(points);
    const trailMaterial = new Three.MeshBasicMaterial({
      color: celestialObject.color,
    });

    this.trails[celestialObject.name] = {
      line: new Three.Line(trailGeometry, trailMaterial),
      points,
    };

    this.add(this.trails[celestialObject.name].line);
  }

  public tickCelestialObjects() {
    for (const celestialObject of this.celestialObjects) {
      for (const otherObject of this.celestialObjects /*[celestialObject.parent]*/) {
        // don't calc gravity for this object
        if (!otherObject || otherObject === celestialObject) {
          continue;
        }

        // Newton's law of universal gravitation
        const massProduct = celestialObject.mass * otherObject.mass;
        const distanceSquared = Math.pow(
          celestialObject.distanceTo(otherObject),
          2
        );

        const force = GRAVITATIONAL_CONSTANT * (massProduct / distanceSquared);

        const acceleration = force / celestialObject.mass;

        celestialObject.accelerateTowards(otherObject, acceleration);
      }

      if (this.tickCounter === 0) {
        const trail = this.trails[celestialObject.name];

        trail.points.push(celestialObject.position.clone());
        if (trail.points.length > 1000) {
          trail.points.shift();
        }

        trail.line.geometry = new Three.BufferGeometry().setFromPoints(
          trail.points
        );
      }

      celestialObject.tick();
    }

    this.tickCounter++;
    if (this.tickCounter == 5) {
      this.tickCounter = 0;
    }
  }
}

export default SpaceScene;
