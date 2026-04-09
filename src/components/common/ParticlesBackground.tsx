import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useAnimationStore } from "@/store/useAnimationStore";

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { particlesEnabled } = useAnimationStore();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles
        id="tsparticles"
        options={{
          fpsLimit: 60,
          particles: {
            color: {
              value: "#000000",
            },
            links: {
              color: "#000000",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: particlesEnabled,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "out",
              },
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.1,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};
