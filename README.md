# Moonbase-Build-a-Junior-Astronaut-Mission-Trainer
A junior astronaut mission trainer for ages 7–12. Make one choice each day, keep a small Moon outpost going, and see how helping one system can leave another short on supplies.
# Outpost Notes

**A junior astronaut mission trainer for ages 7–12.** Make one choice each day, keep a small Moon outpost going, and see how helping one system can leave another short on supplies.

## Try the game

1. Open the `Nasa` folder in Visual Studio Code, or find the folder in File Explorer.
2. Open `index.html` in a web browser. You can double-click the file; no server or account is needed.
3. Pick one plan for each sol and select the confirm button. Start a new mission to try a different strategy.

The game uses plain HTML, CSS, and JavaScript. It needs no packages, API key, or VS Code extensions.

## What players do

Players guide a four-person lunar outpost through five short mission days, called sols in the game. The crew uses power, oxygen, and food every sol, regardless of the plan chosen.

Each plan has a cost and a benefit:

- **Tend the garden:** spend power to add food.
- **Build a soil berm:** spend power to improve the shelter score.
- **Aim the solar wings:** spend food to store more power.
- **Run a science walk:** spend power and oxygen to earn a discovery.

A practice solar-particle alert arrives on Sol 3. The shelter score reduces its simplified game penalty. Players can restart and test a different plan.

## NASA context and simulation limits

NASA sources provide real-world context for the lessons. The game itself is a simplified classroom activity: its resource units, starting supplies, action costs, storm timing, and shelter formula are invented for gameplay. The alert is not live, and the game does not fetch or display NASA measurements. DONKI is linked as a source to explore, but its API is not connected.

| In the game | NASA context |
| --- | --- |
| Save power for dark periods | At many lunar locations, day and night each last about 14 Earth days. [NASA: Lunar day and night](https://science.nasa.gov/wp-content/uploads/2024/01/lrolitho7temperaturevariation27may2014.pdf) |
| Improve the shelter before a storm | NASA describes radiation risks and using lunar soil as shielding. [NASA: Protecting astronauts from space radiation](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation/) |
| Notice the practice storm alert | [NASA CCMC DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) provides real space-weather notifications and event data; it is not used by this prototype. |

## What the prototype teaches

There is no perfect plan that solves every problem. Players practice noticing limited supplies, weighing a cost against a benefit, and planning ahead for a hazard. The goal is to make one real mission-planning idea understandable through play, not to model an actual NASA mission.
