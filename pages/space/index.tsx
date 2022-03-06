import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import CelestialObject from '../../lib/space/CelestialObject';
import SpaceScene from '../../lib/space/Scene';
import { random, shuffle } from 'lodash';
import disco from '../../lib/clients/disco';
import { OrbitControls } from '../../lib/space/OrbitControls';
import { GetServerSideProps } from 'next';
import IChannel from '../../lib/schema/IChannel';
import { getCircularOrbitVelocity, stringColor } from '../../lib/space/utils';
import { Object3D, Vector3 } from 'three';

interface Props {
  channels: IChannel[];
}

const Space: React.FC<Props> = ({ channels }) => {
  const div = useRef<HTMLDivElement>();

  // const [following, setFollowing] = useState<Object3D>();

  const run = useCallback(() => {
    let following: Object3D;

    const scene = new SpaceScene();
    const camera = new Three.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      20000001
    );

    const renderer = new Three.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    div.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const sun = new CelestialObject({
      name: 'Sun',
      color: 0xffcc4d,
      radius: 4000,
      mass:  200 * 200 * 200,
      parent: null,
      lock: true,
    });

    const ambientLight = new Three.AmbientLight();
    scene.add(ambientLight);

    const light = new Three.PointLight(0xffcc4d, 5);
    scene.add(light);

    const axis = new Three.Vector3(0, 0, 1);

    const bodies = channels.map((channel) => {
      let radius = Math.log(channel.messages.count || 1) * 100;

      if (radius < 0.5) {
        radius = 0.5;
      }

      return new CelestialObject({
        name: `#${channel.name}`,
        color: stringColor(channel.name),
        radius,
        mass: (channel.messages.count || 1) / 10,
        parent: sun
        // lock: true
      });
    });

    scene.addCelestialObject(sun);

    const MIN_PLANET_SIZE = 20;

    const planets = bodies.filter((p) => p.radius > MIN_PLANET_SIZE);
    const moons = bodies.filter((p) => p.radius < MIN_PLANET_SIZE);

    const data: Record<string, {angle: number, inclination: number}> = {};
    for (const planet of planets) {
      const apogee = random(4, 500) * 1000;
      const angle = random(0, 2 * Math.PI, true);
      const inclination = random(-Math.PI / 2, Math.PI / 2, true);

      planet.velocity.x = getCircularOrbitVelocity(planet, sun, apogee);
      planet.velocity.applyAxisAngle(axis, angle - Math.PI / 2);

      planet.position.x = apogee * Math.cos(angle);
      planet.position.y = apogee * Math.sin(angle);

      planet.velocity.z = inclination;

      scene.addCelestialObject(planet);

      data[planet.name] = {angle, inclination};
    }

    for (const moon of moons) {
      const planet = shuffle(planets)[0];
      const planetData = data[planet.name];

      moon.parent = planet;

      const apogee = random(planet.radius + moon.radius + 1, planet.radius * 2);
      const angle = planetData.angle // random(0, 2 * Math.PI, true);
      const inclination = planetData.inclination // random(0, 2 * Math.PI, true);

      moon.velocity.x =
        getCircularOrbitVelocity(moon, planet, apogee) + planet.velocity.length();
       moon.velocity.applyAxisAngle(axis, angle - Math.PI / 2);

      moon.position.x = planet.position.x + apogee  * Math.cos(angle);
      moon.position.y = planet.position.y + apogee  * Math.sin(angle);

      moon.velocity.z = inclination;

      scene.addCelestialObject(moon);
    }

    camera.position.z = 2000;

    const raycaster = new Three.Raycaster();
    const mouse = new Three.Vector2();

    const STEP_SPEED = 10;
    function animate() {
      for(let i = 0; i < STEP_SPEED; i++) {
        scene.tickCelestialObjects();
      }


      raycaster.setFromCamera(mouse, camera);

      if(following) {
        // console.log('set camera pos', following);
        // camera.position.set(following.position.x, following.position.y, following.position.z - 300);
        // camera.rotation.set(0, 0, 0);
        camera.lookAt(following.position);
        const distance = new Three.Vector3();
        distance.subVectors(following.position, camera.position).normalize();
        const rotation = camera.rotation.clone();
        camera.position.set(distance.x, distance.y, distance.z);
        camera.rotation.set(rotation.x, rotation.y, rotation.z, rotation.order);
      }


      // for (const intersect of intersects) {
      //   if (intersect.object.name === '_label') {
      //     //    intersect.object.visible = true;
      //   }
      // }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function onMouseMove(event: MouseEvent) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onClick(event: MouseEvent) {
      const intersects = raycaster.intersectObjects(scene.children, true);

      if(intersects.length) {
        const object = intersects[0].object;
        following = object.parent;
        console.log('following', object.name);
      } else {
        following = undefined;
      }
    }

    function onZoom(event: WheelEvent) {
      const delta = event.deltaY > 0 ? 5 : -5;

      if(following) {
        camera.position.lerp(following.position, delta / 10);
      } else {
        camera.position.z += delta;
        // camera.position.lerp(new Three.Vector3(0, 0, 0), delta);
      }
    }

    animate();
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick);
    window.addEventListener('wheel', onZoom);
  }, []);

  useEffect(() => {
    div.current.innerHTML = '';

    const loader = new Three.FontLoader();
    loader.load('/helvetiker_regular.typeface.json', (loadedFont) => {
      SpaceScene.font = loadedFont;

      run();
    });
  }, []);

  return <div ref={div} />;
};

export default Space;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const channels = await disco.guilds
    .getById(process.env.NEXT_PUBLIC_GUILD_ID)
    .channels.get()
    .then((c) => c.data.filter((channel) => channel.type === 'text'));

  return {
    props: {
      channels,
    },
  };
};
