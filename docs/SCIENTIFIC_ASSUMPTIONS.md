# MISSION FORGE — SCIENTIFIC ASSUMPTIONS & MATHEMATICAL FOUNDATIONS
**Team Ghost Hunter | NASA Space Apps Challenge 2026**

---

## 1. Propulsion & Velocity Calculations ($\Delta v$)

### 1.1 Tsiolkovsky Rocket Equation
The spacecraft's velocity increment is calculated using the classical ideal rocket equation:
$$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right)$$

Where:
- $I_{sp}$: Specific impulse in seconds (s). Chemical (RL10) = $450\text{ s}$; Ion (NSTAR) = $3100\text{ s}$.
- $g_0$: Standard acceleration of Earth gravity ($9.80665\text{ m/s}^2$).
- $m_0$: Total initial (wet) mass including spacecraft bus, dry payload, propellant tanks, solar wings, and instruments.
- $m_f$: Final (dry) mass after exhausting all propellant.

### 1.2 Assumptions & Simplifications
- **Impulsive vs Continuous Thrust:** The simulator uses impulsive approximation for chemical burns. For ion thrusters, $\Delta v$ capacity is calculated using the same fuel mass fraction, though flight durations reflect gradual spiral transfers.
- **Gravity Losses:** Aerodynamic drag and gravity turn losses during atmospheric launch are factored into the destination requirement table rather than modeled in 6-DOF Navier-Stokes aerodynamics.

---

## 2. Power Systems & Heliocentric Distance Decay

### 2.1 Solar Irradiance Inverse-Square Law
Solar flux decays with the square of the heliocentric distance ($r_{AU}$):
$$P_{solar}(r) = \frac{N_{wings} \cdot P_0}{r_{AU}^2}$$

Where:
- $P_0 = 1.0\text{ kW}$ per solar wing at $1.0\text{ AU}$ (Earth orbit).
- At Mars ($1.52\text{ AU}$): $P_{solar} \approx 43\%$ of Earth flux.
- At Jupiter ($5.20\text{ AU}$): $P_{solar} \approx 3.7\%$ of Earth flux.

### 2.2 Radioisotope Thermoelectric Generators (RTG)
- Continuous output: $P_{RTG} = N_{RTG} \cdot 0.20\text{ kW}$ ($200\text{ W}$), independent of heliocentric distance.
- Power adequacy constraint: Total generation ($P_{gen}$) must exceed instrument and bus draw ($P_{draw}$), or battery backup is mandated.

---

## 3. Communication Delay & Deep Space Telemetry
Light-time delay for bidirectional round-trip communication:
$$t_{RTT} = \frac{2 \cdot d}{c} = \frac{2 \cdot (r_{AU} \cdot 1.495978707\times 10^{11}\text{ m})}{2.99792458\times 10^8\text{ m/s}}$$

- At Moon ($0.00257\text{ AU}$): $t_{RTT} \approx 2.56\text{ seconds}$.
- At Mars ($1.52\text{ AU}$): $t_{RTT} \approx 25.3\text{ minutes}$.

---

## 4. Fictional / Speculative Technology Notice
- **Forge City Anti-Gravity Transit:** The anti-gravity tram in Forge City is explicitly labeled as a speculative fictional transport mechanism.
- The game's classroom lessons explicitly distinguish real gravitational mechanics (Newtonian gravity, general relativity, centrifugal artificial gravity) from speculative science fiction.
