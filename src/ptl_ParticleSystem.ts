import Particle from "./Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "./Wolfie2D/Rendering/Animations/ParticleSystem";
import { EaseFunctionType } from "./Wolfie2D/Utils/EaseFunctions";
import RandUtils from "./Wolfie2D/Utils/RandUtils";
import MathUtils from "./Wolfie2D/Utils/MathUtils";

export default class ptl_ParticleSystem extends ParticleSystem {

    setParticleAnimation(particle: Particle) {
        particle.vel = RandUtils.randVec(-100, 100, -60, -20);
        particle.velY += 100 * particle.mass;
        particle.velY = Math.sign(particle.velY) * MathUtils.clamp(Math.abs(particle.velY), 0, 700);

        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }
}