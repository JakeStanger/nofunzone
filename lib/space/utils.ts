import CelestialObject from './CelestialObject';

export const GRAVITATIONAL_CONSTANT = 6.67408e-1;

/**
 * Gets the velocity a body needs to travel around another body
 * in order to be in a perfect circular orbit.
 * @param object
 * @param parentObject
 * @param radius
 */
export function getCircularOrbitVelocity(object: CelestialObject, parentObject: CelestialObject, radius: number) {
  // https://en.wikipedia.org/wiki/Circular_orbit#Velocity
  const totalMass = object.mass + parentObject.mass;
  return Math.sqrt((GRAVITATIONAL_CONSTANT * totalMass) / radius);
}

/**
 * Converts a string of arbitrary length
 * to an RGB colour int.
 * @param str
 */
export function stringColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (hash & 0x00FFFFFF);
}