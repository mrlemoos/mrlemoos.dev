import { useEffect, useRef } from "react";
import * as THREE from "three";

function BaroqueQueen(colour: string) {
  const group = new THREE.Group();
  group.scale.set(0.72, 1, 0.72);
  const material = new THREE.MeshStandardMaterial({
    color: colour,
    metalness: 0.12,
    roughness: 0.2,
  });
  const add = (geometry: THREE.BufferGeometry, position = new THREE.Vector3()) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const turned = (profile: Array<[number, number]>) => add(new THREE.LatheGeometry(profile.map(([radius, height]) => new THREE.Vector2(radius, height)), 48));
  turned([[0.6, 0], [0.66, 0.06], [0.63, 0.12], [0.47, 0.18], [0.41, 0.26], [0.38, 0.38], [0.3, 0.45], [0.24, 0.72], [0.28, 0.82], [0.2, 0.93], [0.17, 1.1], [0.23, 1.18]]);
  add(new THREE.TorusGeometry(0.42, 0.045, 12, 48), new THREE.Vector3(0, 0.22, 0));
  add(new THREE.TorusGeometry(0.29, 0.035, 12, 48), new THREE.Vector3(0, 0.76, 0));
  add(new THREE.SphereGeometry(0.26, 32, 20), new THREE.Vector3(0, 1.28, 0));
  add(new THREE.TorusGeometry(0.32, 0.05, 12, 48), new THREE.Vector3(0, 1.3, 0));
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const jewel = add(new THREE.SphereGeometry(0.075, 16, 12), new THREE.Vector3(Math.cos(angle) * 0.35, 1.31, Math.sin(angle) * 0.35));
    jewel.scale.y = 1.3;
  }
  add(new THREE.SphereGeometry(0.1, 20, 14), new THREE.Vector3(0, 1.62, 0));
  return group;
}

export default function LudusBoard() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(4.4, 3.5, 5.2);
    camera.lookAt(0, 0.85, 0);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    element.appendChild(renderer.domElement);

    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const queen = BaroqueQueen(darkScheme.matches ? "#f8f6ef" : "#16131a");
    queen.rotation.y = -0.45;
    scene.add(queen);
    const plinthMaterial = new THREE.MeshStandardMaterial({ color: darkScheme.matches ? "#4d4769" : "#b7ad9a", roughness: 0.35 });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 0.17, 48), plinthMaterial);
    plinth.position.y = -0.08;
    plinth.receiveShadow = true;
    scene.add(plinth);
    const light = new THREE.DirectionalLight("#fff8e8", 3.5);
    light.position.set(-4, 6, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    scene.add(light, new THREE.HemisphereLight("#d9d4ff", "#151226", 2.2));

    const resize = () => {
      renderer.setSize(element.clientWidth, element.clientHeight, false);
      camera.aspect = element.clientWidth / element.clientHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => {
      observer.disconnect();
      renderer.dispose();
      element.replaceChildren();
    };
  }, []);

  return <div className="ludus-webgl" ref={host} aria-hidden="true" />;
}
