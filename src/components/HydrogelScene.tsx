import { useEffect, useRef } from "react";

export function HydrogelScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed || !element) return;
      const palette = getComputedStyle(document.documentElement);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(element.clientWidth, element.clientHeight);
      renderer.setClearColor(0x000000, 0);
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, element.clientWidth / element.clientHeight, 0.1, 100);
      camera.position.z = 9;
      const group = new THREE.Group();
      scene.add(group);
      const color = new THREE.Color(palette.getPropertyValue("--scene-crystal").trim());
      const water = new THREE.Color(palette.getPropertyValue("--scene-water").trim());
      const geometry = new THREE.IcosahedronGeometry(1.63, 2);
      const shell = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color, metalness: 0.18, roughness: 0.08, transparent: true, opacity: 0.11, transmission: 0.45, thickness: 0.8, side: THREE.DoubleSide }));
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.69, 1)), new THREE.LineBasicMaterial({ color: water, transparent: true, opacity: 0.26 }));
      group.add(shell, wire);
      const count = 140;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 2.15 + Math.random() * 3.65;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: water, size: 0.025, transparent: true, opacity: 0.56, sizeAttenuation: true }));
      group.add(particles);
      const pointer = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.6;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.45;
      };
      const resize = () => {
        if (!element) return;
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(element.clientWidth, element.clientHeight);
        group.position.x = element.clientWidth > 750 ? 1.6 : 0.5;
        group.position.y = element.clientWidth > 750 ? -0.15 : -0.35;
        group.scale.setScalar(element.clientWidth > 750 ? 1 : 0.68);
      };
      resize();
      window.addEventListener("pointermove", onPointer);
      window.addEventListener("resize", resize);
      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        group.rotation.y += 0.0013;
        group.rotation.x += 0.0005;
        group.rotation.y += (pointer.x - group.rotation.y) * 0.004;
        group.rotation.x += (-pointer.y - group.rotation.x) * 0.004;
        renderer.render(scene, camera);
      };
      animate();
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        geometry.dispose();
        shell.material.dispose();
        wire.geometry.dispose();
        wire.material.dispose();
        particleGeometry.dispose();
        particles.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div ref={host} aria-hidden="true" className="hydrogel-scene pointer-events-none absolute inset-0" />;
}