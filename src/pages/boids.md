# Boids

{{unity:boids}}

In 1986, Craig Reynolds developed [the original Boids model](https://www.red3d.com/cwr/boids/) to simulate the coordinated motion of animals like birds or fish. What you see below is my implementation of Reynolds's model using C# in the Unity game engine.

### What Are Boids?
Each triangle you see above is a single boid. A boid represents an individual entity like a bird or fish. Each individual boid follows three basic rules from Reynolds's original model:

1. **Separation**: Steer to avoid colliding with or overcrowding other nearby boids
2. **Alignment**: Steer toward the average heading of the nearest boids
3. **Cohesion**: Steer toward the average center of the nearest boids

In addition to the original three rules, I've added an edge avoidance rule to keep the simulation contained.

### Emergent Behavior
The code for this simulation does not explicitly tell the group of boids, "move together in a flock". The code only tells each boid how to behave individually, and they begin to flock as a result! This is emergent behavior.

The Boids simulation is a great, approachable introduction to emergent behavior. Since there are only three quite simple rules, it's easy to see how they can combine to produce flocking movement. If you make a leap of intuition, you can begin to understand how something even more complex - like life itself - can emerge from the fundamental rules of physics and chemistry. When inert material follows simple rules in complex ways, life can appear.