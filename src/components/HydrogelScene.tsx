import { useEffect, useRef } from "react";

interface HydrogelSceneProps {
  hydrationLevel?: number; // 0 to 1
  className?: string;
}

export function HydrogelScene({ hydrationLevel = 0.75, className = "" }: HydrogelSceneProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed || !element) return;

      const palette = getComputedStyle(document.documentElement);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(element.clientWidth, element.clientHeight);
      renderer.setClearColor(0x000000, 0);
      element.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, element.clientWidth / element.clientHeight, 0.1, 100);
      camera.position.z = 8.5;

      const group = new THREE.Group();
      scene.add(group);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x064e3b, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
      dirLight.position.set(4, 5, 6);
      scene.add(dirLight);

      const greenLight = new THREE.PointLight(0x10b981, 3, 15);
      greenLight.position.set(-4, -3, 3);
      scene.add(greenLight);

      const cyanRimLight = new THREE.PointLight(0x06b6d4, 4, 12);
      cyanRimLight.position.set(2, 4, -3);
      scene.add(cyanRimLight);

      // Colors
      const crystalColor = new THREE.Color(palette.getPropertyValue("--scene-crystal").trim() || "#10b981");
      const waterColor = new THREE.Color(palette.getPropertyValue("--scene-water").trim() || "#38bdf8");
      const deepEmerald = new THREE.Color(0x047857);

      // Outer Crystal Facets
      const geometry = new THREE.IcosahedronGeometry(1.65, 1);
      const shellMat = new THREE.MeshPhysicalMaterial({
        color: crystalColor,
        emissive: deepEmerald,
        emissiveIntensity: 0.18,
        metalness: 0.12,
        roughness: 0.08,
        transparent: true,
        opacity: 0.55,
        transmission: 0.65,
        thickness: 1.2,
        ior: 1.45,
        side: THREE.DoubleSide,
      });
      const shell = new THREE.Mesh(geometry, shellMat);

      // Holographic / wireframe edges
      const wireGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.68, 1));
      const wireMat = new THREE.LineBasicMaterial({
        color: waterColor,
        transparent: true,
        opacity: 0.38,
      });
      const wire = new THREE.LineSegments(wireGeo, wireMat);

      // Inner Glowing Water Core
      const coreGeo = new THREE.DodecahedronGeometry(0.85, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: waterColor,
        emissive: waterColor,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.75,
        roughness: 0.2,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);

      group.add(shell);
      group.add(wire);
      group.add(core);

      // Floating Water Droplets / Spores (Particles)
      const count = 180;
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const radius = 1.9 + Math.random() * 3.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        scales[i] = Math.random() * 0.04 + 0.015;
        velocities[i * 3] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: waterColor,
        size: 0.035,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(particleGeometry, particleMat);
      group.add(particles);

      // Pointer Interactivity with inertia
      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const onPointer = (event: PointerEvent) => {
        pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 0.9;
        pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 0.7;
      };

      const resize = () => {
        if (!element) return;
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(element.clientWidth, element.clientHeight);
        const isDesktop = element.clientWidth > 850;
        group.position.x = isDesktop ? 1.7 : 0.4;
        group.position.y = isDesktop ? -0.1 : -0.3;
        group.scale.setScalar(isDesktop ? 1.05 : 0.75);
      };

      resize();
      window.addEventListener("pointermove", onPointer);
      window.addEventListener("resize", resize);

      let frame = 0;
      let clock = 0;

      const animate = () => {
        frame = requestAnimationFrame(animate);
        clock += 0.015;

        // Smooth cursor follow
        pointer.x += (pointer.targetX - pointer.x) * 0.05;
        pointer.y += (pointer.targetY - pointer.y) * 0.05;

        // Continuous organic rotation
        group.rotation.y += 0.002;
        group.rotation.x = Math.sin(clock * 0.4) * 0.12 - pointer.y * 0.6;
        group.rotation.y += pointer.x * 0.04;

        // Swelling / Breathing cycle (Hydration effect)
        const breath = 1 + Math.sin(clock * 1.2) * 0.045;
        shell.scale.setScalar(breath);
        wire.scale.setScalar(breath * 1.015);

        // Core pulsation (water reservoir glow)
        const coreBreath = 0.85 + Math.sin(clock * 2.0) * 0.08;
        core.scale.setScalar(coreBreath);
        coreMat.emissiveIntensity = 0.55 + Math.sin(clock * 2.0) * 0.3;

        // Particle floating drift
        const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
          arr[i * 3] += velocities[i * 3];
          arr[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(clock + i) * 0.0005;
          arr[i * 3 + 2] += velocities[i * 3 + 2];
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        geometry.dispose();
        shellMat.dispose();
        wireGeo.dispose();
        wireMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        particleGeometry.dispose();
        particleMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [hydrationLevel]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={`hydrogel-scene pointer-events-none absolute inset-0 ${className}`}
    />
  );
}