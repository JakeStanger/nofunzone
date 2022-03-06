import { round } from 'lodash';
import * as Three from 'three';
import SpaceScene from './Scene';

export interface ICelestialObjectProps {
  name: string;
  mass: number;
  radius: number;
  color: number;
  parent: CelestialObject | null;
  lock?: boolean;
}

class CelestialObject extends Three.Group {
  private readonly props: ICelestialObjectProps;

  private readonly _velocity: Three.Vector3;

  private mesh: Three.Mesh;
  private label: Three.Mesh;

  constructor(props: ICelestialObjectProps) {
    super();
    this.props = props;

    const geometry = new Three.SphereGeometry(props.radius, 30, 30);
    const material = new Three.MeshPhongMaterial({ color: props.color });
    const mesh = new Three.Mesh(geometry, material);
    mesh.name = '_body';

    this.add(mesh);

    this._velocity = new Three.Vector3(0, 0, 0);

    this.name = props.name;

    const color = new Three.Color(0xffffff);
    const matLite = new Three.MeshBasicMaterial({
      color: color,
      side: Three.FrontSide,
    });

    // console.log(this.velocity);

    const message = `${props.name}`;
    const shapes = SpaceScene.font.generateShapes(message, Math.max(5, Math.min(this.props.radius, 6000)));
    const labelGeometry = new Three.ShapeGeometry(shapes);
    labelGeometry.computeBoundingBox();
    const xMid =
      -0.5 *
      (labelGeometry.boundingBox.max.x - labelGeometry.boundingBox.min.x);
    labelGeometry.translate(xMid, 0, 0);
    // make shape ( N.B. edge view not visible )
    const text = new Three.Mesh(labelGeometry, matLite);
    text.position.x = this.position.x;
    text.position.z = this.position.z;
    text.position.y = this.position.y - this.props.radius*2;

    text.name = '_label';
    // text.visible = false;
    this.add(text);

    this.label = text;
  }

  public get mass() {
    return this.props.mass;
  }

  public get radius() {
    return this.props.radius;
  }

  public get velocity() {
    return this._velocity;
  }

  public get material() {
    return this.mesh.material;
  }

  public get color() {
    return this.props.color;
  }

  public get parentBody() {
    return this.props.parent;
  }

  public set parentBody(body: CelestialObject) {
    this.props.parent = body;
  }

  public tick() {
    if (this.props.lock) {
      return;
    }

    this.position.add(this.velocity);


    // const message = `${this.name}\n${round(this.velocity.length(), 2)}m/s`;
    // const shapes = SpaceScene.font.generateShapes(message, Math.max(5, Math.min(this.props.radius, 30)));
    // const labelGeometry = new Three.ShapeGeometry(shapes);
    // labelGeometry.computeBoundingBox();
    // const xMid =
    //   -0.5 *
    //   (labelGeometry.boundingBox.max.x - labelGeometry.boundingBox.min.x);
    // labelGeometry.translate(xMid, 0, 0);
    //
    // this.label.geometry = labelGeometry;
  }

  public getNearestObject(): CelestialObject {
    const scene = SpaceScene.get();

    const otherObjects = scene.celestialObjects;
    if (otherObjects.length) {
      return otherObjects.reduce((nearest, check) => {
        const nearestDistance = nearest.position.distanceTo(this.position);
        const checkDistance = check.position.distanceTo(this.position);
        return checkDistance < nearestDistance ? check : nearest;
      });
    }
  }

  public distanceTo(celestialObject: CelestialObject) {
    return this.position.distanceTo(celestialObject.position);
  }

  public accelerateTowards(celestialObject: CelestialObject, rate: number) {
    const normalized = this.position
      .clone()
      .sub(celestialObject.position)
      .normalize();

    const acceleration = normalized.multiplyScalar(rate);

    this.velocity.sub(acceleration);
  }

  public toggleLabel(visible: boolean) {
    this.label.visible = visible;
  }
}

export default CelestialObject;
